import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSharedHtml } from './html-templates.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules', 'templates']);
const siteConfig = JSON.parse(readFileSync(resolve(projectRoot, 'data', 'site.json'), 'utf8'));
const expectedTitle = siteConfig.repositoryName;
const errors = [];
const warnings = [];

const collectFiles = (directory, extension) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];

    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath, extension);
    return entry.name.toLowerCase().endsWith(extension) ? [entryPath] : [];
  });

const htmlFiles = collectFiles(projectRoot, '.html');
const htmlByPath = new Map(
  htmlFiles.map((filePath) => [relative(projectRoot, filePath).replaceAll('\\', '/'), filePath])
);

const addIssue = (collection, filePath, message) => {
  collection.push(`${relative(projectRoot, filePath).replaceAll('\\', '/')}: ${message}`);
};

const getAttributes = (tag) => {
  const attributes = new Map();
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }

  return attributes;
};

const cleanUrl = (value) => {
  try {
    return decodeURIComponent(value.split('#')[0].split('?')[0]);
  } catch {
    return value.split('#')[0].split('?')[0];
  }
};

const isExternalUrl = (value) => /^(?:[a-z]+:|\/\/)/i.test(value);

const resolveReference = (htmlPath, value) => {
  const cleanValue = cleanUrl(value);
  if (!cleanValue || isExternalUrl(cleanValue)) return null;

  return cleanValue.startsWith('/')
    ? resolve(projectRoot, cleanValue.replace(/^\/+/, ''))
    : resolve(dirname(htmlPath), cleanValue);
};

const isInsideProject = (filePath) => {
  const rootPrefix = `${projectRoot}${sep}`;
  return filePath === projectRoot || filePath.startsWith(rootPrefix);
};

const validateReference = (htmlPath, value, label) => {
  const targetPath = resolveReference(htmlPath, value);
  if (!targetPath) return;

  if (!isInsideProject(targetPath)) {
    addIssue(errors, htmlPath, `${label} escapes the project directory: ${value}`);
    return;
  }

  if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
    addIssue(errors, htmlPath, `${label} does not exist: ${value}`);
  }
};

const validateHashLink = (htmlPath, href, currentIds) => {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1 || !href.slice(hashIndex + 1)) return;

  const hash = decodeURIComponent(href.slice(hashIndex + 1));
  const pathPart = href.slice(0, hashIndex);

  if (!pathPart) {
    if (!currentIds.has(hash)) addIssue(errors, htmlPath, `link targets missing id #${hash}`);
    return;
  }

  const targetPath = resolveReference(htmlPath, pathPart);
  if (!targetPath || !existsSync(targetPath)) return;

  const targetSource = readFileSync(targetPath, 'utf8');
  const targetIds = new Set(
    [...targetSource.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1])
  );

  if (!targetIds.has(hash)) addIssue(errors, htmlPath, `link targets missing id ${href}`);
};

htmlFiles.forEach((htmlPath) => {
  const source = renderSharedHtml(readFileSync(htmlPath, 'utf8'));
  const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim();

  if (title !== expectedTitle) {
    addIssue(errors, htmlPath, `title must be "${expectedTitle}"`);
  }

  const ids = [...source.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  const seenIds = new Set();
  ids.forEach((id) => {
    if (seenIds.has(id)) addIssue(errors, htmlPath, `duplicate id "${id}"`);
    seenIds.add(id);
  });

  const stylesheetHrefs = [];
  for (const tagMatch of source.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = getAttributes(tagMatch[0]);
    const href = attributes.get('href');
    if (!href) continue;

    if (attributes.get('rel')?.toLowerCase() === 'stylesheet') {
      if (stylesheetHrefs.includes(href)) {
        addIssue(errors, htmlPath, `stylesheet is included more than once: ${href}`);
      }
      stylesheetHrefs.push(href);
    }

    validateReference(htmlPath, href, 'linked file');
  }

  for (const tagMatch of source.matchAll(/<img\b[^>]*>/gi)) {
    const attributes = getAttributes(tagMatch[0]);
    const src = attributes.get('src');

    if (!attributes.has('alt')) {
      addIssue(warnings, htmlPath, `image needs descriptive alt text${src ? `: ${src}` : ''}`);
    }
    if (src) validateReference(htmlPath, src, 'image');
  }

  for (const tagMatch of source.matchAll(/<(?:script|source|video)\b[^>]*>/gi)) {
    const attributes = getAttributes(tagMatch[0]);
    const src = attributes.get('src');
    const poster = attributes.get('poster');
    if (src) validateReference(htmlPath, src, 'media or script');
    if (poster) validateReference(htmlPath, poster, 'video poster');
  }

  for (const tagMatch of source.matchAll(/<a\b[^>]*>/gi)) {
    const href = getAttributes(tagMatch[0]).get('href');
    if (!href || href === '#' || isExternalUrl(href)) continue;

    const pathPart = href.split('#')[0];
    if (pathPart) validateReference(htmlPath, pathPart, 'link target');
    validateHashLink(htmlPath, href, seenIds);
  }
});

if (warnings.length) {
  console.warn(`\nAccessibility warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}

if (errors.length) {
  console.error(`\nSite validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`Validated ${htmlByPath.size} HTML files with no broken local references or duplicate IDs.`);
