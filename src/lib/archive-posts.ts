import type { CollectionEntry } from 'astro:content';
import { readMirrorArticlePage, readMirrorPublishedLabel } from './article-page';
import { contentEntrySlug } from './content-entry';
import {
  collectBlogMirrorSlugs,
  collectReviewMirrorRoutes,
} from './mirror-assets';

export type ArchiveCollection = 'blog' | 'review';

export type ArchiveGridCard = {
  href: string;
  title: string;
  image: string;
  dateText?: string;
};

type SortableArchiveGridCard = ArchiveGridCard & { sortKey: number };

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
}): SortableArchiveGridCard {
  return {
    sortKey: params.sortKey,
    href: `/${params.collection}/${params.slug}/`,
    title: params.title,
    image: params.image,
    dateText: params.dateText || undefined,
  };
}

async function cardFromContentEntry(
  entry: CollectionEntry<'blog'> | CollectionEntry<'review'>,
  collection: ArchiveCollection,
): Promise<SortableArchiveGridCard> {
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
): Promise<SortableArchiveGridCard> {
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
): Promise<ArchiveGridCard[]> {
  const cards: SortableArchiveGridCard[] = [];
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
      image: card.image,
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
