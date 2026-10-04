import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const partialDirectory = resolve(projectRoot, 'src', 'templates', 'partials');
const siteConfig = JSON.parse(readFileSync(resolve(projectRoot, 'data', 'site.json'), 'utf8'));

const getConfigValue = (key) => key.split('.').reduce((value, segment) => value?.[segment], siteConfig);

const renderConfigValues = (template, overrides = {}) => template.replace(/{{([\w.]+)}}/g, (token, key) => {
  const value = overrides[key] ?? getConfigValue(key);
  if (value === undefined) throw new Error(`Unknown site configuration value: ${key}`);
  return String(value);
});

const readPartial = (name, values) => renderConfigValues(
  readFileSync(resolve(partialDirectory, `${name}.html`), 'utf8').trim(),
  values
);

const patterns = {
  analytics: /(?:<!-- shared:analytics -->|\s*<!-- Global site tag \(gtag\.js\) - Google Analytics -->[\s\S]*?gtag\('config',\s*'G-MFKSEHYHWT'\);\s*<\/script>)/i,
  footer: /(?:<!-- shared:footer -->|<footer\b[^>]*>[\s\S]*?<\/footer>)/i,
  header: /(?:<!-- shared:header -->|<header\b[^>]*>[\s\S]*?<\/header>)/i,
  security: /(?:<!-- shared:security -->|<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?<meta\s+http-equiv="X-UA-Compatible"[^>]*>)/i
};

export const renderSharedHtml = (html, { basePath = '/' } = {}) => {
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const copyrightYear = new Date().getFullYear();
  const partials = Object.fromEntries(
    Object.keys(patterns).map((name) => [name, readPartial(name, {
      basePath: normalizedBasePath,
      copyrightYear
    })])
  );
  let renderedHtml = html;

  Object.entries(patterns).forEach(([name, pattern]) => {
    if (pattern.test(renderedHtml)) renderedHtml = renderedHtml.replace(pattern, partials[name]);
  });

  return renderedHtml;
};

export const sharedHtmlPlugin = (basePath = '/') => ({
  name: 'shared-html-templates',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => renderSharedHtml(html, { basePath })
  }
});
