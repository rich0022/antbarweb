# ANTBAR Astro Site

This repository is now a content-driven Astro site for `https://www.antbar.com/`.

## Current State

- `src/content/` stores page content as Markdown collections (`blog`, `review`, `products`, `pages`).
- `src/pages/` uses Astro routes + `astro:content` to render all pages.
- `src/layouts/` and `src/components/sections/` provide reusable site templates.
- `public/` remains the asset source baseline (images/media/static files).
- `scripts/extract-content.mjs` can re-extract mirrored HTML into content collections.

## Local Commands

```bash
npm install
npm run extract:content
npm run fetch:missing-blog
npm run sync:mirror-assets
npm run dev
npm run build
npm run build:cf
```

- Local dev default: `http://localhost:4321/` unless another port is passed.
- The build output is static and can be uploaded to a static host.
- For Cloudflare deployment, set `PUBLIC_MEDIA_BASE_URL` and use `npm run build:cf`.

## Maintenance Flow

1. Update content under `src/content/**`.
2. Adjust templates/components under `src/layouts` and `src/components`.
3. Run `npm run build` to verify static output.

Mirrored page HTML lives in `mirror/` (not `public/`) so Astro routes are not shadowed. Static assets stay in `public/wp-content/`.

If blog sidebar links 404, run `npm run fetch:missing-blog`. For review pages, run `npm run fetch:missing-review`.

For missing Elementor widgets (counters, carousels) or fonts/images 404 in dev, run `npm run sync:mirror-assets`. Navigation should stay on localhost; if you still see `antbar.com` links after pulling blog pages, run `npm run normalize:mirror-html` once.
