# ANTBAR Mirror Baseline

This repository currently serves as a static mirror baseline for `https://www.antbar.com/`.

The current goal is not to keep the old placeholder Astro rebuild. The goal is:

1. Keep the mirrored site runnable and reviewable.
2. Use the mirror as the visual/content baseline.
3. Gradually replace mirrored pages with real Astro implementations.

## Current State

- `public/` contains mirrored HTML assets and media fetched from the live site.
- `src/pages/[...slug].astro` replays mirrored HTML into Astro output.
- `scripts/scrape.mjs` refreshes the mirror from the live sitemap and downloads same-site assets.
- `dist/` is generated from the mirror replay layer.

## Local Commands

```bash
npm install
npm run dev
npm run build
```

- Local dev default: `http://localhost:4321/` unless another port is passed.
- The build output is static and can be uploaded to a static host.

## Important Constraints

- The mirror currently contains large media files that exceed Cloudflare's 25 MiB per-file static asset limit.
- Before Cloudflare deployment, oversized videos must be moved to R2, Stream, or another media host.
- The old placeholder Astro rebuild has been removed from the active app and should not be revived as-is.

## Planning

See [docs/STATIC-TO-ASTRO-PLAN.md](/Users/smoant/github/antbarweb/docs/STATIC-TO-ASTRO-PLAN.md) for the migration plan, agent work split, acceptance criteria, and deployment blockers.
