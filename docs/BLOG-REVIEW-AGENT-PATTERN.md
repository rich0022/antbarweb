# Blog & Review Pages — Agent Pattern Summary

## Architecture Overview

Blog and Review follow the same dual-page pattern: an **index** (archive listing) and **detail** pages (individual articles). They use Astro content collections (`src/content/blog/`, `src/content/review/`) for markdown content and mirror HTML files for Elementor rendering context.

## Content Collections

- **Blog**: `src/content/blog/` — `.md` files with frontmatter (`title`, `description`, `slug`, `heroImage`, `featuredImage`, `excerpt`, etc.)
- **Review**: `src/content/review/` — same format as blog
- **Schema**: defined in `src/content/config.ts`
- **Collection type names**: `'blog'`, `'review'` (see `ArticleCollection` in `src/lib/article-page.ts`)

## Index Pages

**Files**: `src/pages/blog/index.astro`, `src/pages/review/index.astro`

Pattern:
```astro
---
import { getCollection } from 'astro:content';
import PostsWidget from '../../components/archive/PostsWidget.astro';
import ContentBody from '../../components/ContentBody.astro';
import StandaloneLayout from '../../layouts/StandaloneLayout.astro';
import { readContentBody } from '../../lib/content-body';
import { contentEntryFileName } from '../../lib/content-entry';
import { extractArchiveWidget } from '../../lib/archive-widget';
import '../../styles/<collection>-bundle.css';

const allPosts = await getCollection('<collection>');
const indexEntry = allPosts.find((entry) => entry.id === 'index' || entry.data.slug === '<collection>');
const bodyHtml = indexEntry ? await readContentBody('<collection>', contentEntryFileName(indexEntry.id, '<collection>')) : '';
const archive = bodyHtml ? extractArchiveWidget(bodyHtml) : null;
---

<StandaloneLayout title={...} description={...} pageId="<elementor-page-id>">
  {archive ? (
    <>
      <ContentBody html={archive.beforeHtml} />
      <PostsWidget widget={archive.widget} />
      <ContentBody html={archive.afterHtml} />
    </>
  ) : (
    <ContentBody html={bodyHtml} />
  )}
</StandaloneLayout>
```

Key deps:
- `StandaloneLayout`: simpler layout (no mirror head assets, no antbar.com click redirector, no `SITE_OVERFLOW_GUARD_CSS`/`MEGA_MENU_STYLE_CSS`)
- `extractArchiveWidget()`: parses Elementor posts widget HTML into structured data (cards, pagination, load-more)
- `PostsWidget.astro`: renders the parsed widget data as a styled grid
- CSS bundle must include `widget-posts.min.css`

Blog uses `[...slug].astro` (catch-all), Review uses `[slug].astro` (single segment).

## Detail Pages

**Files**: `src/pages/blog/[...slug].astro`, `src/pages/review/[slug].astro`

Pattern:
```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import ArticlePage from '../../components/article/ArticlePage.astro';
import ArticleShellRuntime from '../../components/article/ArticleShellRuntime.astro';
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import { contentEntrySlug } from '../../lib/content-entry';
import {
  <COLLECTION>_FEATURED_ITEMS,    // BLOG_ or REVIEW_ prefix
  <COLLECTION>_HOT_SALE_PRODUCTS,
  <COLLECTION>_LATEST_ITEMS,
  <COLLECTION>_RELATED_ITEMS,
  extractTocItems,
  readMarkdownBody,
  readMirrorArticleMeta,
  readMirrorPublishedLabel,
} from '../../lib/article-page';

export async function getStaticPaths() {
  const posts = await getCollection('<collection>');
  return posts
    .filter((entry) => entry.id !== 'index' && entry.data.slug !== '<collection>')
    .map((entry) => ({
      params: { slug: contentEntrySlug(entry.id, '<collection>') },
      props: { entryId: entry.id },
    }));
}

// Review also supports URL aliases via REVIEW_URL_ALIASES and resolveReviewUrlSlug

const entry = await getEntry('<collection>', props.entryId);
const { Content } = await render(entry);
const [markdownBody, publishedLabel, articleMeta] = await Promise.all([
  readMarkdownBody('<collection>', props.entryId),
  readMirrorPublishedLabel(`<collection>/${slug}`),
  readMirrorArticleMeta(`<collection>/${slug}`),
]);
const tocItems = extractTocItems(markdownBody);
---

<ArticleLayout title={...} description={...} mirrorRoute={`<collection>/${slug}`} bodyClass={articleMeta.bodyClass}>
  <ArticlePage title={...} sectionLabel="<Section>" currentPostId={...} publishedLabel={publishedLabel}
    tocItems={tocItems} latestItems={<COLLECTION>_LATEST_ITEMS} relatedTitle="..." relatedItems={<COLLECTION>_RELATED_ITEMS}
    featuredItems={<COLLECTION>_FEATURED_ITEMS} hotProducts={<COLLECTION>_HOT_SALE_PRODUCTS}>
    <Content />
  </ArticlePage>
  <ArticleShellRuntime postId={...} title={...} excerpt={...} featuredImage={...} />
</ArticleLayout>
```

Key deps:
- `ArticleLayout`: loads mirror head assets (stylesheets, inline CSS, head/footer scripts), popup templates, antbar.com click redirector, includes `article-shell-bundle.css`
- `ArticleShellRuntime`: loads `article-shell-bundle.js` (366KB Elementor JS bundle — jquery, frontend, sticky, mega menu, popup, etc.)
- `ArticlePage.astro`: renders the article shell (sidebar, TOC, related posts, hot products, breadcrumbs)
- Constants (`LATEST_ITEMS`, `RELATED_ITEMS`, etc.) live in `src/lib/article-page.ts`

## Review-only: URL Aliases

Review uses `src/lib/route-aliases.ts` for URL aliases mapping old WordPress slugs to canonical slugs. `getStaticPaths` includes these via `REVIEW_URL_ALIASES`.

## CSS Bundles

Each collection has a `PAGE_CSS_MAP` entry in `scripts/bundle-page.mjs`:
- `blog`: `['post-1817.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css']`
- `review`: `['post-2779.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css']`

## Key Files Reference

| File | Purpose |
|---|---|
| `src/pages/blog/index.astro` | Blog archive listing |
| `src/pages/blog/[...slug].astro` | Blog article detail (catch-all) |
| `src/pages/review/index.astro` | Review archive listing |
| `src/pages/review/[slug].astro` | Review article detail |
| `src/layouts/StandaloneLayout.astro` | Layout used by index pages |
| `src/layouts/ArticleLayout.astro` | Layout used by detail pages |
| `src/lib/archive-widget.ts` | `extractArchiveWidget()` parser |
| `src/lib/article-page.ts` | Article helpers, constants |
| `src/lib/content-entry.ts` | `contentEntrySlug`, `contentEntryFileName` |
| `src/lib/content-body.ts` | `readContentBody` |
| `src/lib/mirror-assets.ts` | `readMirrorArticleMeta`, `readMirrorPublishedLabel` |
| `src/lib/route-aliases.ts` | Review URL aliases only |
| `src/components/article/ArticlePage.astro` | Article page shell |
| `src/components/article/ArticleShellRuntime.astro` | Article JS loader |
| `src/components/archive/PostsWidget.astro` | Archive grid component |
| `scripts/bundle-page.mjs` | CSS bundler with PAGE_CSS_MAP |

## Creating a New Article (Blog or Review)

1. Create `.md` file in `src/content/<collection>/` with proper frontmatter
2. Add page CSS entry to `PAGE_CSS_MAP` if needed (usually not for articles, they share the collection bundle)
3. Add mirror HTML in `mirror/<collection>/<slug>/index.html` (for meta/body class)
4. Static paths auto-generated from content collection

## Creating a New Article Collection (e.g. "news")

1. Create `src/content/news/` directory with `.md` files
2. Add schema to content config
3. Create `src/pages/news/index.astro` following blog index pattern
4. Create `src/pages/news/[...slug].astro` following blog detail pattern
5. Add constants (LATEST, RELATED, etc.) in `article-page.ts`
6. Add CSS bundle entry in `bundle-page.mjs`
7. Add `news` entry to `PAGE_CSS_MAP` with `['post-<id>.css', 'widget-posts.min.css']`
8. Run `node scripts/bundle-page.mjs news` to generate CSS bundle
