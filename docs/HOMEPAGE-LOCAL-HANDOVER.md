# Homepage Local Handover

## Goal

This homepage is being migrated away from the old mirror / Elementor runtime chain.

Current target:

- `/` should run on `HomeLayout.astro`
- homepage interaction should come from local JS only
- homepage visuals should be reproduced against the live site at `https://antbar.com/`
- long term, homepage should stop depending on `home-bundle.css`

This document is for future agents continuing that work.

## Current State

Homepage entry and runtime:

- `src/pages/index.astro` uses `HomeLayout.astro`
- `src/layouts/HomeLayout.astro` loads:
  - `src/styles/home-bundle.css`
  - `src/styles/home-hero.css`
  - `src/styles/home-local.css`
  - `src/components/home/HomeClientScript.astro`
  - `src/components/home/HomePopups.astro`

Homepage sections:

- `src/components/home/HeroCarousel.astro`
- `src/components/home/ProductGrid.astro`
- `src/components/home/GalleryCarousel.astro`
- `src/components/home/HomePage.astro`

## What Was Fixed In This Pass

### Hero parity fixes

The hero was adjusted to better match the live site:

- desktop hero height now follows the image aspect ratio again instead of forcing a tall `vh` block
- slide 2 copy is on the right side, matching live
- slide 1 and slide 3 copy remain on the left
- slide-specific positioning is now controlled in `src/styles/home-hero.css`

Important detail:

- `slide2` is the only desktop hero that should place copy on the right
- `slide1` and `slide3` should keep copy on the left

## Files You Should Read First

If continuing homepage work, read these first:

1. `src/layouts/HomeLayout.astro`
2. `src/components/home/HomePage.astro`
3. `src/components/home/HeroCarousel.astro`
4. `src/components/home/HomeClientScript.astro`
5. `src/styles/home-hero.css`
6. `src/styles/home-local.css`
7. `src/data/homepage.ts`
8. `src/components/site/SiteHeader.astro`

## Still Mixed / Not Fully Local Yet

The homepage is not fully local yet.

These parts still depend on old Elementor-era DOM, class names, or bundled CSS:

- `src/components/site/SiteHeader.astro`
- `src/components/home/ProductGrid.astro`
- `src/components/home/GalleryCarousel.astro`
- parts of `src/components/home/HomePage.astro`
- many selectors in `src/styles/home-local.css`
- the entire `src/styles/home-bundle.css`

In other words:

- JS is mostly local now
- layout is partly local
- CSS is still mixed
- DOM is still mixed

## Recommended Next Steps

To finish the migration cleanly, do this in order:

1. Rebuild homepage sections with local semantic classes:
   - header
   - hero
   - product intro / product grid
   - gallery
   - popups
2. Replace behavior hooks like:
   - `.elementor-invisible`
   - `.swiper-*`
   - `.e-n-menu-*`
   with local `data-home-*` / `data-carousel-*` hooks
3. Move remaining homepage section styles out of `home-bundle.css`
4. Remove homepage dependence on `scripts/bundle-homepage.mjs`
5. Remove `home-bundle.css` from `HomeLayout.astro`

## Live Comparison Rules

When adjusting hero, compare against `https://antbar.com/`, not against assumptions from the old local markup.

Useful parity checks:

- hero desktop height
- text side per slide
- text block width per slide
- image crop / focal point
- pagination location
- arrow visibility / placement

Observed live layout pattern:

- slide 1: copy left
- slide 2: copy right
- slide 3: copy left

## Validation Checklist

After homepage edits:

1. Run `npm run build`
2. Check `/` in the browser
3. Verify all 3 hero slides:
   - slide 1 visible and proportionally correct
   - slide 2 copy on right
   - slide 3 copy on left
4. Confirm there is no homepage jQuery dependency
5. Confirm dialogs still work:
   - mobile menu
   - search
   - age gate

## Warning For Future Agents

Do not assume the current homepage is already fully de-Elementorized.

It is easy to accidentally:

- fix one hero slide while breaking another
- restore old `vh`-driven sizing that looks wrong versus live
- keep adding local CSS on top of bundle CSS without reducing bundle ownership

The correct direction is:

- fewer Elementor classes
- fewer bundle dependencies
- more local semantic markup
- more local explicit section styles
