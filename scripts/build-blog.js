import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = resolve(projectRoot, 'content', 'blog');
const outputFile = resolve(projectRoot, 'data', 'posts.json');
const checkOnly = process.argv.includes('--check');

const requiredFields = [
  'id',
  'title',
  'date',
  'readTime',
  'tags',
  'heroImage',
  'heroAlt',
  'excerpt',
  'status'
];

const collectMarkdownFiles = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectMarkdownFiles(entryPath);
    }

    if (!entry.name.endsWith('.md') || entry.name.startsWith('_')) {
      return [];
    }

    return [entryPath];
  });

const parseValue = (rawValue) => {
  const value = rawValue.trim();

  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value);
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return value;
};

const parseArticle = (filePath) => {
  const source = readFileSync(filePath, 'utf8').replace(/\r\n?/g, '\n');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error('Missing or invalid front matter block.');
  }

  const metadata = {};
  match[1].split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      throw new Error(`Invalid front matter line: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    metadata[key] = parseValue(value);
  });

  metadata.tags = typeof metadata.tags === 'string'
    ? metadata.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : metadata.tags;

  return {
    filePath,
    metadata,
    content: match[2].trim()
  };
};

const resolveLocalAsset = (source) => {
  if (!source.startsWith('/')) return null;

  const cleanSource = source.split(/[?#]/)[0].replace(/^[/\\]+/, '');
  const absolutePath = resolve(projectRoot, cleanSource);
  const rootPrefix = `${projectRoot}${sep}`;

  if (!absolutePath.startsWith(rootPrefix)) return null;
  return absolutePath;
};

const validateLocalAsset = (source, label, errors) => {
  if (/^(https?:|data:)/i.test(source)) return;

  const assetPath = resolveLocalAsset(source);
  if (!assetPath) {
    errors.push(`${label} must use a root-relative path such as /img/blog/article-id/image.webp.`);
    return;
  }

  if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
    errors.push(`${label} does not exist: ${source}`);
  }
};

const validateArticle = (article) => {
  const { filePath, metadata, content } = article;
  const errors = [];

  requiredFields.forEach((field) => {
    if (metadata[field] === undefined || metadata[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (metadata.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) {
    errors.push('id must contain lowercase letters, numbers, and hyphens only.');
  }

  const folderName = basename(dirname(filePath));
  if (metadata.id && folderName !== metadata.id) {
    errors.push(`id must match its folder name (${folderName}).`);
  }

  if (metadata.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(metadata.date))) {
    errors.push('date must use YYYY-MM-DD.');
  } else if (metadata.date && Number.isNaN(Date.parse(`${metadata.date}T00:00:00Z`))) {
    errors.push('date is not a valid calendar date.');
  }

  if (!Number.isInteger(metadata.readTime) || metadata.readTime < 1) {
    errors.push('readTime must be a positive whole number.');
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
    errors.push('tags must contain at least one comma-separated tag.');
  } else {
    metadata.tags.forEach((tag) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) {
        errors.push(`Invalid tag: ${tag}`);
      }
    });
  }

  if (!['draft', 'published'].includes(metadata.status)) {
    errors.push('status must be draft or published.');
  }

  if (!content) {
    errors.push('Article body is empty.');
  }

  if (/\b(?:TODO|TBD)\b|<replace(?:\s|>)/i.test(content)) {
    errors.push('Article body contains placeholder text.');
  }

  if (metadata.status === 'published') {
    validateLocalAsset(metadata.heroImage, 'heroImage', errors);

    const markdownImages = content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g);
    for (const image of markdownImages) {
      if (!image[1].trim()) errors.push(`Markdown image is missing alt text: ${image[2]}`);
      validateLocalAsset(image[2], 'Markdown image', errors);
    }

    const htmlImages = content.matchAll(/<img\s+[^>]*>/gi);
    for (const image of htmlImages) {
      const source = image[0].match(/src="([^"]+)"/i)?.[1];
      const alt = image[0].match(/alt="([^"]*)"/i)?.[1];
      if (!source) errors.push('HTML image is missing a src attribute.');
      if (!alt?.trim()) errors.push(`HTML image is missing alt text${source ? `: ${source}` : '.'}`);
      if (source) validateLocalAsset(source, 'HTML image', errors);
    }
  }

  return errors;
};

const articles = collectMarkdownFiles(contentRoot).map((filePath) => {
  try {
    return parseArticle(filePath);
  } catch (error) {
    console.error(`\n${relative(projectRoot, filePath)}\n  - ${error.message}`);
    process.exitCode = 1;
    return null;
  }
}).filter(Boolean);

const articleIds = new Set();
let hasErrors = process.exitCode === 1;

articles.forEach((article) => {
  const errors = validateArticle(article);
  const articleId = article.metadata.id;

  if (articleIds.has(articleId)) {
    errors.push(`Duplicate article id: ${articleId}`);
  }
  articleIds.add(articleId);

  if (errors.length) {
    hasErrors = true;
    console.error(`\n${relative(projectRoot, article.filePath)}`);
    errors.forEach((error) => console.error(`  - ${error}`));
  }
});

if (hasErrors) {
  process.exit(1);
}

const posts = articles
  .filter((article) => article.metadata.status === 'published')
  .map(({ metadata, content }) => ({
    id: metadata.id,
    title: metadata.title,
    date: metadata.date,
    readTime: metadata.readTime,
    tags: metadata.tags,
    heroImage: metadata.heroImage,
    heroAlt: metadata.heroAlt,
    excerpt: metadata.excerpt,
    content
  }))
  .sort((first, second) => second.date.localeCompare(first.date));

const generatedJson = `${JSON.stringify(posts, null, 2)}\n`;

if (checkOnly) {
  if (!existsSync(outputFile) || readFileSync(outputFile, 'utf8') !== generatedJson) {
    console.error('\ndata/posts.json is out of date. Run: npm run content:build');
    process.exit(1);
  }

  console.log(`Validated ${articles.length} article files and ${posts.length} published posts.`);
} else {
  writeFileSync(outputFile, generatedJson, 'utf8');
  console.log(`Generated data/posts.json with ${posts.length} published posts.`);
}

