# codex_website

Portfolio hub for Jesus Marini Parissi highlighting computational design, industrial collaborations, Unity experiments, and the new blog that curates research notes plus social content from Instagram and LinkedIn.

## Features
- **Single-page portfolio** with hero copy, services, and a curated gallery of cross-disciplinary projects.
- **Unity WebGL showcase** (`Unity.html`) for interactive experiences backed by explicit deployment guardrails.
- **Blog experience** (`/blog`) generated from reusable Markdown article files, with JSON-powered rendering and stubbed social feeds for Instagram and LinkedIn integrations.
- **Project detail templates** (`fea_climbing.html`, `ABC_climbing.html`) share the upgraded hero/meta system, structured sections, and optional intro-video module.
- **Expanded case studies** with an authorship-focused MIT Design Lab/XETIC story, adaptive portrait/landscape media, technical workflows, verified references, and the updated project-page system.
- **Navigation revamp** with a floating pill header, improved mobile burger visibility, and aligned hero spacing across the blog.
- **Responsive polish** with smoother typography scaling and adaptive header pill sizing across breakpoints.
- **Mobile navigation improvements** with a readable fixed header, centered hamburger control, reliable home-logo navigation, and overflow-safe layouts.
- **Responsive project pages** with centered content cards, reset media margins, and single-column galleries on small screens.
- **Article template** (`/blog/article.html`) hydrates full-length posts from the shared JSON dataset, including share buttons and tag chips.
- **Shared site shell** with centrally maintained header, footer, analytics, and security partials injected by Vite.
- **Responsive shared footer** with current-year copyright, social links, and a direct Moon Rabbit Lab company CTA.
- **Modular design tokens** in `css/tokens.css`, page styling in `css/style.css` and `css/blog.css`, and lightweight vanilla JavaScript.
- **Complete production build** that includes every portfolio page plus the blog data, Unity runtime, 3D assets, and custom-domain configuration.
- **Content authoring toolkit** with an article template, central site settings, image conventions, editing guides, and automated blog/site validation.
- **Asset audit tooling** that reports large, duplicated, and possibly unused media without deleting source files.
- **Media review workspace** in `media-review/unused/` for manually checking assets removed from the active site structure before permanent deletion.
- **GitHub Pages deployment** through GitHub Actions with separate base-path settings for the generic project URL and future custom domain.

## Getting started
1. `cd website_master`
2. `npm install` installs Vite and the blog rendering libraries.
3. `npm run content:build` generates `data/posts.json` from the Markdown files in `content/blog/`.
4. `npm run content:validate` checks article metadata, image paths, alt text, and generated JSON.
5. `npm run dev` generates blog content and launches the local Vite server at http://localhost:5173.
6. `npm run site:validate` checks titles, local links, assets, duplicate IDs, and repeated stylesheets.
7. `npm run assets:audit` refreshes `docs/ASSET_AUDIT.md` for reviewed media cleanup.
8. `npm run build` validates content and the site before emitting the production-ready files into `dist/`.
9. Review `Modify_guide.txt`, `CONTENT_GUIDE.md`, `docs/CODEBASE_GUIDE.md`, and `docs/deployment.md` before larger changes or deployment.

## Deployment
- Pushes to `main` deploy through `.github/workflows/deploy-pages.yml`.
- The generic site URL is `https://jesusmarini-spec.github.io/codex_website/`.
- Follow `docs/GITHUB_PAGES.md` to verify the generic deployment and later move `jmariniparissi.com` safely.

## Controls
- Use the header toggle (`.nav__toggle`) on mobile to open/close navigation; links route back to anchors on `index.html` or scroll sections on `/blog`.
- Blog filter chips switch the JSON-driven feed client-side; social panels hydrate from `/data/instagram.json` and `/data/linkedin.json` (replace with API proxies when tokens are ready).
- Footer social icons include assistive labels, while the Moon Rabbit Lab CTA routes professional traffic to the company website.
