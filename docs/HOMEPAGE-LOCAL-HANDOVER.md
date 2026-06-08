# Homepage Local Handover

## Goal

Homepage `/` should stay aligned with the live site at `https://antbar.com/`, but it should run on local Astro components and local CSS/JS ownership instead of the old homepage bundle pipeline.

## Current State

Homepage entry and runtime:

- `src/pages/index.astro` uses `src/layouts/HomeLayout.astro`
- `src/layouts/HomeLayout.astro` now loads:
  - `src/styles/home-hero.css`
  - `src/styles/home-sections.css`
- homepage interaction comes from shared local runtime in `src/components/site/SiteShellClientScript.astro`

Homepage sections:

- `src/components/home/HeroCarousel.astro`
- `src/components/home/HomePage.astro`
- `src/components/home/ProductGrid.astro`
- `src/components/home/GalleryCarousel.astro`
- `src/data/homepage.ts`

## What Was Fixed

### Hero

- hero desktop/mobile behavior is now controlled locally in `src/styles/home-hero.css`
- slide 2 copy stays on the right on desktop
- slide 1 and slide 3 copy stay on the left on desktop
- mobile hero copy is no longer forced into one generic lower-left state

### Homepage sections

- product highlight banner, product intro, product grid, video, and gallery now use local semantic classes
- homepage no longer imports `src/styles/home-bundle.css`
- old hashed homepage IDs such as `containerDataId`, `widgetDataId`, and `cellContainerId` were removed from `src/data/homepage.ts`
- homepage section IDs are now semantic, such as:
  - `home-product-highlight`
  - `home-products`
  - `home-product-video`
  - `home-gallery`
  - `home-gallery-carousel`

### Cleanup

- `src/styles/home-bundle.css` was removed
- `scripts/bundle-homepage.mjs` was removed because homepage no longer depends on that generated bundle

## Files You Should Read First

1. `src/layouts/HomeLayout.astro`
2. `src/components/home/HomePage.astro`
3. `src/components/home/HeroCarousel.astro`
4. `src/components/home/ProductGrid.astro`
5. `src/components/home/GalleryCarousel.astro`
6. `src/styles/home-hero.css`
7. `src/styles/home-sections.css`
8. `src/data/homepage.ts`
9. `src/components/site/SiteShellClientScript.astro`

## Remaining Legacy Areas

Homepage sections are now local, but the site is not globally de-Elementorized.

Still legacy or shared:

- `src/components/site/SiteHeader.astro`
- `src/components/site/SiteFooter.astro`
- shared reveal/carousel behavior still uses `.elementor-invisible` and `.swiper-*` hooks inside `SiteShellClientScript.astro`
- shell/header/footer/popups are styled from local hand-written CSS in `src/styles/site-shell-local.css`
- pages that have not been locally rebuilt use `src/layouts/LegacyShellLayout.astro`, which loads `src/styles/site-shell-legacy.css`

So the current state is:

- homepage section markup: local
- homepage section CSS: local
- homepage section naming: semantic
- shell CSS: local
- legacy shell CSS: kept for unreworked pages, not loaded by `HomeLayout`
- runtime hooks: still shared with the broader migration

## Recommended Next Steps

1. If continuing homepage work, keep using semantic classes and semantic IDs instead of reintroducing hashed Elementor names.
2. If you need to keep reveal animations, prefer local `data-home-*` hooks eventually, but do not regress the current shared runtime unless you replace it cleanly.
3. Keep comparing against `https://antbar.com/` for visual parity, especially for the hero and gallery spacing.
4. If future agents touch homepage sections, update `src/data/homepage.ts` first instead of hiding structure in CSS selectors.

## Validation Checklist

After homepage edits:

1. Run `npm run build`
2. Check `/` in the browser
3. Verify all 3 hero slides:
   - slide 1 copy left on desktop
   - slide 2 copy right on desktop
   - slide 3 copy left on desktop
4. Verify homepage sections:
   - product highlight image scales correctly
   - product grid keeps 3-column layout on desktop and 1-column on mobile
   - video keeps its 16:9 frame
   - gallery arrows work on desktop
5. Confirm dialogs still work:
   - mobile menu
   - search
   - age gate

## Warning For Future Agents

Do not restore homepage dependence on generated bundle CSS just because it feels faster in the short term.

The correct direction for homepage is:

- semantic section markup
- semantic IDs and data names
- local, explicit section styles
- minimal reliance on mirror-era hashed selectors
