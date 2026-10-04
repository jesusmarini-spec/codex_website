# Codebase Guide

## Structure

- `index.html` and the root project HTML files contain page-specific content plus markers for shared build templates.
- `content/blog/` contains editable Markdown blog articles.
- `data/site.json` contains shared contact, social, analytics, and repository settings.
- `src/templates/partials/` contains the shared header, footer, analytics, and security markup.
- `css/tokens.css` contains global colors, typography, spacing-related settings, and responsive font scales.
- `css/style.css` contains the main site and project-page styles.
- `css/blog.css` contains blog-specific styles.
- `scripts/` contains content generation, shared-template rendering, validation, and asset-audit tools.
- `dist/` is generated output and should never be edited manually.

## Common Updates

### Contact and social links

Edit `data/site.json`. The shared footer reads these values during development and production builds.

### Navigation, header, and footer

Edit the relevant file in `src/templates/partials/`. Vite expands the shared markers when serving or building pages, keeping the rendered navigation consistent. Open pages through the Vite development server rather than directly from the filesystem.

### Colors and typography

Edit `css/tokens.css` first. Component-specific visual changes belong in `css/style.css` or `css/blog.css`.

### Blog articles

Create or copy an article folder in `content/blog/`, then run `npm run content:build`. Follow `CONTENT_GUIDE.md` for metadata and image conventions.

## Quality Checks

Run these commands before publishing:

```powershell
cmd /c npm run content:validate
cmd /c npm run site:validate
cmd /c npm run build
```

Run `cmd /c npm run assets:audit` when images or videos are added or removed. The resulting `docs/ASSET_AUDIT.md` is advisory: verify every file before deleting it.

## Cleanup Rules

- Preserve existing public HTML filenames until redirects are introduced; inbound links may depend on them.
- Do not edit generated files in `dist/` or `data/posts.json` directly.
- Do not remove media based only on the audit report.
- Prefer WebP or AVIF for new large images and MP4 or WebM instead of GIF for long animations.
- Keep filenames lowercase with hyphens for new files to avoid case-sensitive GitHub Pages failures.
