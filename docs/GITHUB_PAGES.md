# GitHub Pages Deployment

## Current generic URL

The repository deploys the production build from `main` with GitHub Actions. Until a custom domain is configured, the expected public URL is:

`https://jesusmarini-spec.github.io/codex_website/`

The workflow uses `/codex_website/` as the default Vite base path. Local development continues to use `/`.

## Enable the first deployment

1. Open `https://github.com/jesusmarini-spec/codex_website/settings/pages`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the repository **Actions** tab and select **Deploy GitHub Pages**.
4. Run the workflow manually, or push a commit to `main`.
5. Confirm the deployment environment reports the generic URL above.

## Generic-site verification

Check these routes before connecting the domain:

- Home: `/codex_website/`
- Blog: `/codex_website/blog/index.html`
- Article: `/codex_website/blog/article.html?id=xr-field-lab`
- Unity page: `/codex_website/Unity.html`

Confirm that navigation, project images, blog JSON, article images, videos, and the Unity loader all resolve without `404` errors.

## Move `jmariniparissi.com` safely

The domain currently points to `Marini29/marini29.github.io`. Keep that site active until the generic URL has passed verification.

1. In the `jesusmarini-spec` account settings, open **Pages** and verify `jmariniparissi.com` using GitHub's TXT-record instructions. Keep the TXT record after verification.
2. In `jesusmarini-spec/codex_website`, open **Settings → Secrets and variables → Actions → Variables**.
3. Create the repository variable `VITE_BASE_PATH` with the value `/`.
4. Run **Deploy GitHub Pages** and verify the new artifact completes successfully.
5. In this repository's **Settings → Pages**, enter `jmariniparissi.com` under **Custom domain** and save it.
6. At the DNS provider, point the apex domain to GitHub Pages using these `A` records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
7. Add a `CNAME` record for `www` pointing to `jesusmarini-spec.github.io`.
8. Remove the custom-domain setting from `Marini29/marini29.github.io` only when the new deployment and DNS records are ready.
9. Wait for DNS propagation, then enable **Enforce HTTPS** in this repository's Pages settings.
10. Verify both `https://jmariniparissi.com` and `https://www.jmariniparissi.com`.

Do not add a wildcard DNS record. With an Actions-based Pages deployment, a repository `CNAME` file is not required; GitHub stores the custom domain in the Pages settings.

## Rollback

If the custom-domain switch fails, restore the previous DNS records and custom-domain setting for `Marini29/marini29.github.io`. The new site remains accessible at its generic GitHub Pages URL after resetting `VITE_BASE_PATH` to `/codex_website/` or deleting that repository variable.
