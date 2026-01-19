# jesusmariniweb

Portfolio hub for Jesus Marini Parissi highlighting computational design, industrial collaborations, Unity experiments, and the new blog that curates research notes plus social content from Instagram and LinkedIn.

## Features
- **Single-page portfolio** with hero copy, services, and a curated gallery of cross-disciplinary projects.
- **Unity WebGL showcase** (`Unity.html`) for interactive experiences backed by explicit deployment guardrails.
- **Blog experience** (`/blog`) powered by JSON content, Markdown → HTML rendering, and stubbed social feeds for Instagram and LinkedIn integrations.
- **Project detail templates** (`fea_climbing.html`, `ABC_climbing.html`) share the upgraded hero/meta system, structured sections, and optional intro-video module.
- **Expanded case studies** now updated to the new layout (MIT Design Lab, Ford CAE, Xetic, Dot Shell, Nespresso, R2 Heater, Redstorm, Polar Roller, Airport Travel Assistant).
- **Navigation revamp** with a floating pill header, improved mobile burger visibility, and aligned hero spacing across the blog.
- **Article template** (`/blog/article.html`) hydrates full-length posts from the shared JSON dataset, including share buttons and tag chips.
- **Shared styling/components** via `css/style.css`, `css/blog.css`, and lightweight vanilla JS in `js/index.js` plus `src/blog.js`.

## Getting started
1. `cd website_master`
2. `npm install` (installs Vite, Sass, and content helper libraries).
3. `npm run dev` to launch the local Vite server at http://localhost:5173 with hot reload for the portfolio, `/blog`, and `/blog/article.html?id=<slug>`.
4. `npm run build` emits a production-ready bundle into `dist/` (mirrors the existing folder structure for simple static hosting).
5. Review `docs/deployment.md` before deploying Unity assets to ensure MIME types, cache headers, and security policies are correct.

## Controls
- Use the header toggle (`.nav__toggle`) on mobile to open/close navigation; links route back to anchors on `index.html` or scroll sections on `/blog`.
- Blog filter chips switch the JSON-driven feed client-side; social panels hydrate from `/data/instagram.json` and `/data/linkedin.json` (replace with API proxies when tokens are ready).
- Email links are obfuscated but still open in the default client; social icons include aria labels for assistive tech.
