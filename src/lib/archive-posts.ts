import type { CollectionEntry } from 'astro:content';
import type { ArchivePostCard, ArchivePostsWidget } from './archive-widget';
import { readMirrorArticlePage, readMirrorPublishedLabel } from './article-page';
import { contentEntrySlug } from './content-entry';
import {
  collectBlogMirrorSlugs,
  collectReviewMirrorRoutes,
} from './mirror-assets';

export type ArchiveCollection = 'blog' | 'review';

type SortableArchiveCard = ArchivePostCard & { sortKey: number };

const WIDGET_SHELL: Record<
  ArchiveCollection,
  Omit<ArchivePostsWidget, 'cards' | 'nextPageHref' | 'currentPage' | 'maxPage' | 'loadMoreText'>
> = {
  blog: {
    widgetClass:
      'elementor-element elementor-element-239032f elementor-posts--align-left elementor-posts__hover-none blog elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-posts--thumbnail-top load-more-align-center elementor-invisible elementor-widget elementor-widget-posts',
    dataId: '239032f',
    dataElementType: 'widget',
    dataSettings:
      '{"cards_row_gap":{"unit":"rem","size":2.2,"sizes":[]},"pagination_type":"load_more_on_click","_animation":"fadeInUp","cards_columns":"3","cards_columns_tablet":"2","cards_columns_mobile":"1"}',
    dataWidgetType: 'posts.cards',
    postsContainerClass:
      'elementor-posts-container elementor-posts elementor-posts--skin-cards elementor-grid',
    skin: 'cards',
  },
  review: {
    widgetClass:
      'elementor-element elementor-element-5d36121 elementor-posts--align-left elementor-posts__hover-none blog elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-posts--thumbnail-top load-more-align-center elementor-invisible elementor-widget elementor-widget-posts',
    dataId: '5d36121',
    dataElementType: 'widget',
    dataSettings:
      '{"cards_row_gap":{"unit":"rem","size":2.2,"sizes":[]},"pagination_type":"load_more_on_click","_animation":"fadeInUp","cards_columns":"3","cards_columns_tablet":"2","cards_columns_mobile":"1"}',
    dataWidgetType: 'posts.cards',
    postsContainerClass:
      'elementor-posts-container elementor-posts elementor-posts--skin-cards elementor-grid',
    skin: 'cards',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseArchiveDate(value: string): number {
  if (!value) return 0;
  const dotted = value.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
  if (dotted) {
    return Date.UTC(Number(dotted[1]), Number(dotted[2]) - 1, Number(dotted[3]));
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildArchiveCard(params: {
  collection: ArchiveCollection;
  slug: string;
  title: string;
  image: string;
  dateText?: string;
  sortKey: number;
}): SortableArchiveCard {
  const href = `/${params.collection}/${params.slug}/`;
  return {
    sortKey: params.sortKey,
    articleClass: `elementor-post elementor-grid-item post type-post status-publish format-standard has-post-thumbnail hentry category-${params.collection}`,
    href,
    imageSrc: params.image,
    imageAlt: params.title,
    imageWidth: '532',
    imageHeight: '535',
    titleTag: 'h2',
    titleHtml: escapeHtml(params.title),
    readMoreText: 'View More',
    readMoreAria: `Read more about ${params.title}`,
    dateText: params.dateText || undefined,
  };
}

async function cardFromContentEntry(
  entry: CollectionEntry<'blog'> | CollectionEntry<'review'>,
  collection: ArchiveCollection,
): Promise<SortableArchiveCard> {
  const slug = contentEntrySlug(entry.id, collection);
  const mirrorRoute = `${collection}/${slug}`;
  const dateText =
    entry.data.publishedAt ??
    (await readMirrorPublishedLabel(mirrorRoute));
  const image =
    entry.data.heroImage ??
    entry.data.featuredImage ??
    '/wp-content/uploads/2024/05/LOGO.png';

  return buildArchiveCard({
    collection,
    slug,
    title: entry.data.title,
    image,
    dateText,
    sortKey: parseArchiveDate(dateText),
  });
}

async function cardFromMirror(
  collection: ArchiveCollection,
  slug: string,
): Promise<SortableArchiveCard> {
  const mirrorRoute = `${collection}/${slug}`;
  const article = await readMirrorArticlePage(mirrorRoute);
  return buildArchiveCard({
    collection,
    slug,
    title: article.title,
    image: article.featuredImage,
    dateText: article.publishedLabel,
    sortKey: parseArchiveDate(article.publishedLabel),
  });
}

export async function listArchivePosts(
  collection: ArchiveCollection,
  entries: CollectionEntry<'blog'>[] | CollectionEntry<'review'>[],
): Promise<ArchivePostCard[]> {
  const cards: SortableArchiveCard[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (entry.id === 'index' || entry.data.slug === collection) continue;
    const slug = contentEntrySlug(entry.id, collection);
    seen.add(slug);
    cards.push(await cardFromContentEntry(entry, collection));
  }

  if (collection === 'blog') {
    for (const slug of await collectBlogMirrorSlugs()) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      cards.push(await cardFromMirror(collection, slug));
    }
  } else {
    for (const [slug] of await collectReviewMirrorRoutes()) {
      if (slug === 'index' || seen.has(slug)) continue;
      seen.add(slug);
      cards.push(await cardFromMirror(collection, slug));
    }
  }

  return cards
    .sort((left, right) => right.sortKey - left.sortKey)
    .map(({ sortKey: _sortKey, ...card }) => card);
}

export function buildArchivePostsWidget(
  collection: ArchiveCollection,
  cards: ArchivePostCard[],
): ArchivePostsWidget {
  return {
    ...WIDGET_SHELL[collection],
    cards,
  };
}

export type FeaturedArchivePost = {
  title: string;
  href: string;
  image: string;
  dateText: string;
};

export async function resolveFeaturedArchivePost(
  collection: ArchiveCollection,
  slug: string,
  entries: CollectionEntry<'blog'>[] | CollectionEntry<'review'>[],
): Promise<FeaturedArchivePost | null> {
  const entry = entries.find((item) => contentEntrySlug(item.id, collection) === slug);
  if (entry) {
    const card = await cardFromContentEntry(entry, collection);
    return {
      title: entry.data.title,
      href: card.href,
      image: card.imageSrc,
      dateText: card.dateText ?? '',
    };
  }

  try {
    const article = await readMirrorArticlePage(`${collection}/${slug}`);
    return {
      title: article.title,
      href: `/${collection}/${slug}/`,
      image: article.featuredImage,
      dateText: article.publishedLabel,
    };
  } catch {
    return null;
  }
}
