import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { sharedHtmlPlugin } from './scripts/html-templates.js';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const ignoredDirectories = new Set(['dist', 'node_modules', 'templates']);

const collectHtmlEntries = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : collectHtmlEntries(entryPath);
    }

    return entry.name.endsWith('.html') ? [entryPath] : [];
  });

const htmlEntries = Object.fromEntries(
  collectHtmlEntries(rootDirectory).map((filePath) => {
    const outputName = relative(rootDirectory, filePath)
      .replace(/\\/g, '/')
      .replace(/\.html$/, '');

    return [outputName, filePath];
  })
);

const staticAssets = ['data', 'Build', 'TemplateData', 'team3'];
const siteBase = process.env.VITE_BASE_PATH || '/';

const collectRuntimeImagePaths = () => {
  const postsPath = resolve(rootDirectory, 'data', 'posts.json');
  const imagePaths = new Set();

  if (!existsSync(postsPath)) return imagePaths;

  const posts = JSON.parse(readFileSync(postsPath, 'utf8'));
  const serializedPosts = JSON.stringify(posts);
  const matches = serializedPosts.match(/\/img\/[^)"'\\s>]+/g) || [];

  matches.forEach((assetPath) => imagePaths.add(assetPath));
  return imagePaths;
};

const copyRuntimeImages = () => {
  collectRuntimeImagePaths().forEach((assetPath) => {
    const relativeAssetPath = assetPath.replace(/^\/+/, '');
    const sourcePath = resolve(rootDirectory, relativeAssetPath);
    const destinationPath = resolve(rootDirectory, 'dist', relativeAssetPath);

    if (!sourcePath.startsWith(resolve(rootDirectory, 'img')) || !existsSync(sourcePath)) return;

    mkdirSync(dirname(destinationPath), { recursive: true });
    cpSync(sourcePath, destinationPath);
  });
};

const copyRuntimeAssets = () => ({
  name: 'copy-runtime-assets',
  closeBundle() {
    staticAssets.forEach((assetPath) => {
      cpSync(
        resolve(rootDirectory, assetPath),
        resolve(rootDirectory, 'dist', assetPath),
        { recursive: true }
      );
    });
    copyRuntimeImages();
  }
});

export default defineConfig({
  root: '.',
  base: siteBase,
  plugins: [sharedHtmlPlugin(siteBase), copyRuntimeAssets()],
  server: {
    open: '/index.html',
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlEntries
    }
  }
});
