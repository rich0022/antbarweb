# Static Mirror To Astro Plan

## Objective

Turn the current mirrored ANTBAR site into a maintainable Astro site without losing route parity, visual fidelity, or SEO-critical page content.

The mirror is the source-of-truth baseline for:

- route coverage
- visible content
- media references
- page-level metadata

The old placeholder Astro implementation is not part of the target architecture.

## Current Baseline

- Runtime baseline: mirrored pages served through [`src/pages/[...slug].astro`](/Users/smoant/github/antbarweb/src/pages/%5B...slug%5D.astro)
- Mirror refresh script: [`scripts/scrape.mjs`](/Users/smoant/github/antbarweb/scripts/scrape.mjs)
- Mirrored assets and HTML: `public/`
- Reference scrape artifacts: `scrape/`

## Known Deployment Blockers

Cloudflare static deployment is blocked by oversized assets:

- `public/wp-content/uploads/2024/07/AGP12000-479-.mp4` about 34 MiB
- `public/wp-content/uploads/2024/07/C486-ok-2k.mp4` about 184 MiB

These two files are intentionally kept out of git for now because they are both deployment blockers and poor repository payload candidates.

These must be moved before production deployment:

1. Cloudflare Stream, preferred for video pages
2. Cloudflare R2 + public bucket
3. third-party CDN as fallback

## Migration Rules

1. Do not change live route paths.
2. Do not rewrite page copy unless matching the live page.
3. Rebuild one page family at a time behind the mirrored baseline.
4. Keep the mirrored version available until the Astro replacement is visually and structurally checked.
5. Do not reintroduce the deleted placeholder Astro code.

## Recommended Work Split For Multiple Agents

### Agent 1: Design System And Shared Shell

Own:

- `src/components/`
- `src/layouts/`
- `src/styles/`

Deliver:

- header
- footer
- navigation
- typography tokens
- global layout shell
- shared section primitives

Acceptance:

- shared shell matches mirror spacing and page chrome
- mobile and desktop navigation both work

### Agent 2: Content Model And Data Extraction

Own:

- `src/content/`
- `src/data/`
- extraction helpers under `scripts/` if needed

Deliver:

- product schema
- blog schema
- review schema
- route inventory mapped from mirror to structured content

Acceptance:

- every mirrored page family has a content source plan
- slugs and canonical routes match the current mirror

### Agent 3: Blog And Review Rebuild

Own:

- `src/pages/blog/`
- `src/pages/review/`

Deliver:

- `/blog/`
- blog post template
- `/review/`
- review post template

Acceptance:

- route parity with mirror
- hero, cards, metadata, and content flow close to live

### Agent 4: Product Rebuild

Own:

- `src/pages/disposable/`
- `src/pages/pod-sys/`
- supporting product components

Deliver:

- category pages
- product detail pages

Acceptance:

- no missing image slices
- product spec blocks and media sections match mirror

### Agent 5: Static Pages, QA, And Deployment

Own:

- `src/pages/*.astro` for non-blog/product pages
- deployment docs
- media offload plan

Deliver:

- about, contact, support, verification, brand-story, rd-center, intelligent-manufacturing, antbar-lab
- Cloudflare deployment checklist
- media hosting migration

Acceptance:

- build passes
- static output deploys
- large videos removed from static bundle

## Execution Order

### Phase 0: Baseline Lock

- keep mirror runnable
- preserve `public/`
- preserve `scrape/` references
- remove dead prototype code

### Phase 1: Shared Foundation

- build layout shell
- define content schemas
- establish asset strategy

### Phase 2: High-Value Page Families

- blog
- review
- disposable products

### Phase 3: Remaining Static Pages

- about/contact/support/etc.

### Phase 4: Media And Deployment Hardening

- move oversized videos off static bundle
- finalize Cloudflare deployment
- cache and performance pass

## Definition Of Done

A page family is done only when all of these are true:

1. route matches the mirror
2. primary content matches the mirror
3. major imagery/video sections render correctly
4. page metadata is present
5. mobile and desktop layouts hold
6. build passes
7. mirrored fallback for that family is no longer needed

## What To Delete And Keep

Delete:

- old placeholder Astro implementation
- old Worker and D1-only scaffolding tied to that prototype
- stale config that points at deleted runtime paths

Keep:

- `public/` mirror
- `scrape/` reference artifacts
- mirror replay route until each page family is replaced

## Coordination Notes For Other Agents

- Do not edit `public/` manually unless the task is mirror refresh.
- Use the live mirror output as the comparison target, not the deleted prototype.
- Keep changes scoped by page family or shared system ownership.
- If a rebuilt page family is complete, remove only that family's mirrored fallback pathing in a controlled change.

## Immediate Next Tasks

1. Offload oversized videos from `public/`
2. Create first real Astro shared shell
3. Convert `/blog/` and blog detail pages
4. Convert `/disposable/` and priority product detail pages
5. Reintroduce form/API behavior only after the static conversion is stable
