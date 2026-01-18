jesusmariniweb – Deployment Notes
=================================

Unity WebGL bundle
------------------
- Serve `/Build` assets with the official MIME types: `.data` → `application/octet-stream`, `.wasm` → `application/wasm`, `.js` → `application/javascript`, `.json` → `application/json`.
- Add `Cross-Origin-Resource-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers for the Unity loader responses so browsers allow the WASM module to run with SharedArrayBuffer optimizations.
- Disable directory listing on `/Build`, `/team3`, and `/TemplateData` (e.g., `Options -Indexes` on Apache or `<directoryBrowse enabled="false" />` on IIS) to avoid leaking raw assets.
- Enforce HTTPS and add `Cache-Control: public, max-age=31536000, immutable` for static Unity artifacts; keep `Build_web.json` shorter (e.g., `max-age=3600`) so configuration changes propagate quickly.
- Because Unity streams large files, enable gzip/brotli for `.js` / `.json`, but leave `.data`/`.wasm` compressed as shipped (Unity already produces `.unityweb` builds that are pre-compressed).

General security headers
------------------------
- Mirror the meta-based CSP from every HTML page at the server level for stronger enforcement; supply a `Report-To` endpoint if you want violation telemetry.
- Send `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` after confirming HTTPS is consistently available.
- Apply `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: accelerometer=(), …, usb=()` (already in HTML), and `X-Content-Type-Options: nosniff` server-wide.

Static hosting tips
-------------------
- If deploying via Netlify or Vercel, add a `_headers` file that captures the policies above. For IIS/Azure Static Web Apps, use `web.config` with `<staticContent>` entries for the MIME types and `<httpProtocol>` custom headers.
- Keep large media files (videos under `img/Project*`) on a CDN or object storage when possible to improve TTFB; update the HTML references to absolute URLs only after verifying caching headers.
- Re-run a local Lighthouse/PSI audit after each deployment to ensure CSP and COOP/COEP headers are actually applied by the edge network.
