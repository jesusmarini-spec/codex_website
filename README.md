# codex_website

Portfolio hub for Jesus Marini Parissi highlighting computational design, industrial collaborations, Unity experiments, and the new blog that curates research notes plus social content from Instagram and LinkedIn.

## Features
- **Single-page portfolio** with hero copy, services, and a curated gallery of cross-disciplinary projects.
- **Unity WebGL showcase** (`Unity.html`) for interactive experiences backed by explicit deployment guardrails.
- **Blog experience** (`/blog`) generated from reusable Markdown article files, with JSON-powered rendering and stubbed social feeds for Instagram and LinkedIn integrations.
- **Project detail templates** (`fea_climbing.html`, `ABC_climbing.html`) share the upgraded hero/meta system, structured sections, and optional intro-video module.
- **Expanded case studies** now updated to the new layout (MIT Design Lab, Ford CAE, Xetic, Dot Shell, Nespresso, R2 Heater, Redstorm, Polar Roller, Airport Travel Assistant).
- **Navigation revamp** with a floating pill header, improved mobile burger visibility, and aligned hero spacing across the blog.
- **Responsive polish** with smoother typography scaling and adaptive header pill sizing across breakpoints.
- **Article template** (`/blog/article.html`) hydrates full-length posts from the shared JSON dataset, including share buttons and tag chips.
- **Shared styling/components** via `css/style.css`, `css/blog.css`, and lightweight vanilla JS in `js/index.js` plus `src/blog.js`.
- **Complete production build** that includes every portfolio page plus the blog data, Unity runtime, 3D assets, and custom-domain configuration.
- **Content authoring toolkit** with an article template, image conventions, editing guide, copy-review checklist, and automated blog validation.
- **GitHub Pages deployment** through GitHub Actions with separate base-path settings for the generic project URL and future custom domain.

## Getting started
1. `cd website_master`
2. `npm install` (installs Vite, Sass, and content helper libraries).
3. `npm run content:build` generates `data/posts.json` from the Markdown files in `content/blog/`.
4. `npm run content:validate` checks article metadata, image paths, alt text, and generated JSON.
5. `npm run dev` generates blog content and launches the local Vite server at http://localhost:5173.
6. `npm run build` validates content and emits the production-ready site into `dist/`.
7. Review `CONTENT_GUIDE.md` for manual content and image updates, then `docs/deployment.md` before deployment.

## Deployment
- Pushes to `main` deploy through `.github/workflows/deploy-pages.yml`.
- The generic site URL is `https://jesusmarini-spec.github.io/codex_website/`.
- Follow `docs/GITHUB_PAGES.md` to verify the generic deployment and later move `jmariniparissi.com` safely.

## Controls
- Use the header toggle (`.nav__toggle`) on mobile to open/close navigation; links route back to anchors on `index.html` or scroll sections on `/blog`.
- Blog filter chips switch the JSON-driven feed client-side; social panels hydrate from `/data/instagram.json` and `/data/linkedin.json` (replace with API proxies when tokens are ready).
- Email links are obfuscated but still open in the default client; social icons include aria labels for assistive tech.
