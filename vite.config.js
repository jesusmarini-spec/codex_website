import { defineConfig } from 'vite';
import { cpSync, readdirSync } from 'fs';
import { relative, resolve } from 'path';

const rootDirectory = resolve(__dirname);
const ignoredDirectories = new Set(['dist', 'node_modules']);

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
  }
});

export default defineConfig({
  root: '.',
  base: siteBase,
  plugins: [copyRuntimeAssets()],
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
