# Astro Migration Issues & Solutions

Issues encountered during the Elementor-to-Astro migration and how they were resolved.

## 1. Horizontal Overflow from Mega Menu Hidden Dropdown

**Problem:** Pages had horizontal scrollbar and white space on the right when scrolling down. The root cause was the mega menu's hidden dropdown (`e-n-menu-content`) — even when `display:none`, it still participated in the page's scroll width because the dropdown's `left` positioning pushed it beyond the viewport.

**Solution:** Added `SITE_OVERFLOW_GUARD_CSS` in `src/data/site-assets.ts`, injected across all layouts:

```css
html,body{max-width:100%;overflow-x:clip;}
body>header,body>main,body>footer{max-width:100%;overflow-x:clip;}
#hNav{overflow-x:clip;}
```

Key points:
- Use `overflow-x:clip` not `overflow-x:hidden` — `clip` also clips absolutely positioned children
- Applied to `html`, `body`, and the three structural children (`header`, `main`, `footer`)
- `#hNav` needs its own clip for the mobile hamburger menu area

## 2. `overflow-x:clip` on `#mainNav` Clipping the Mega Menu Dropdown

**Problem:** Initially `#mainNav` was included in the overflow guard (`#mainNav,#hNav{overflow-x:clip}`). This caused the absolutely positioned mega menu dropdown (`e-n-menu-content`) to be completely invisible — clipped out of existence.

**Root cause:** The dropdown is absolutely positioned relative to `#mainNav`, and `overflow-x:clip` on the parent container clips it.

**Solution:** Removed `#mainNav` from the clip rule. Only `#hNav` (the outer header wrapper) keeps the clip.

## 3. Mega Menu Dropdown Not Full-Width

**Problem:** After removing the overflow clip, the mega menu dropdown was only as wide as its containing nav element (~900px), not the full viewport. The original WordPress/Elementor JS sets CSS custom properties dynamically to stretch the dropdown.

**Solution:** Added `MEGA_MENU_STYLE_CSS` in `src/data/site-assets.ts`:

```css
#mainNav .e-n-menu-content{
  --stretch-width:100vw;
  --stretch-left:calc(-50vw + 50%);
  --stretch-right:auto;
  padding-top:20px;
  padding-bottom:20px;
}
```

This overrides the CSS custom properties that Elementor's CSS references via `var()`, positioning the dropdown from the left viewport edge. Unlike the JS approach, this is static CSS — no dynamic repositioning on scroll.

## 4. Products Dropdown Content Spacing Too Narrow

**Problem:** The two product tiles in the mega menu Products dropdown (Disposable, Closed Pod System) were too close together (~60px gap).

**Solution:** Increased the gap on the inner flex container via the same `MEGA_MENU_STYLE_CSS`:

```css
#mainNav .e-n-menu-content [data-id="14cc13b"]{
  --gap:100px 100px;
  --row-gap:100px;
  --column-gap:100px;
}
```

Also constrained the inner boxed container width so the tiles don't spread too wide:

```css
#mainNav .e-n-menu-content .e-con-boxed>.e-con-inner{
  max-width:min(var(--content-width),900px);
}
```

## 5. Duplicate `<main>` Wrapper Nesting

**Problem:** The mirror body HTML contains `<main>` wrapper elements, but the Astro layout also wraps the slot content in `<main>`. This creates a nested `<main>` structure: `<main id="content"><main class="...">...</main></main>`.

**Solution:** Added `stripMainWrapper()` in `src/lib/site-shell.ts`:

```typescript
export function stripMainWrapper(html: string): string {
  return html
    .replace(/<main\b[^>]*>/gi, '')
    .replace(/<\/main>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<a\b[^>]*\bcdn-gi\b[^>]*>[\s\S]*?<\/a>/gi, '')
    .trim();
}
```

This strips the mirror's `<main>` tags, `<link>` elements, and Cloudflare email obfuscation links from the body HTML.

## 6. WordPress Body Class Mismatch

**Problem:** Product detail pages in WordPress are "single posts" (`post-template-default`, `single`, `single-post`, `postid-N`), but the `SubPageLayout` uses page-specific body classes (`page-template-default`, `elementor-page elementor-page-N`). Some theme CSS selectors target the single-post body classes.

**Status:** Currently using page-style body classes for all subpages. No visual issues observed yet, but may need a `bodyClass` prop on the layout for correct single-post classes.

## 7. Product Shell JS Bundle Pattern

**Problem:** Product detail pages need Elementor JS (jQuery, frontend, sticky, mega menu, popup, search, etc.) for full functionality, plus product-specific JS (image gallery). The full article bundle is ~375KB.

**Solution:** Created `scripts/bundle-product-shell.mjs` that concatenates only the JS parts needed by product pages into `public/assets/product-shell-bundle.js` (~322KB). The product page loads this shared bundle, avoiding per-page JS duplication.

JS parts included: jquery, hello-frontend, webpack.runtime, frontend-modules, jquery-ui-core, frontend, sticky, imagesloaded, webpack-pro, hooks, i18n, frontend-pro, elements-handlers.

## 8. CSS Bundle Pattern via `bundle-page.mjs`

**Problem:** Mirror HTML references 15+ CSS stylesheets. Loading them individually means many HTTP requests and slow page loads.

**Solution:** `scripts/bundle-page.mjs` concatenates BASE_CSS (shared across all pages: reset, theme, header-footer, frontend, mega menu, etc.) + page-specific CSS into a single bundle at `src/styles/<id>-bundle.css`. The bundle is imported directly in the Astro page file.

Page-specific CSS is defined in `PAGE_CSS_MAP` keyed by page ID. Each product page gets its own entry with post CSS files and widget CSS files.

## 9. Animation Keyframe Inlining

**Problem:** Elementor pages load 6 small animation CSS files (fadeIn, fadeInLeft, fadeInRight, fadeInUp, e-animation-grow, slideInDown) as separate HTTP requests (~834 bytes total).

**Solution:** Inlined all animation keyframes into `ANIMATION_INLINE_CSS` constant in `src/data/site-assets.ts` and injected via `<style set:html>` across all layouts. Saves 6 HTTP requests per page.
