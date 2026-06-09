import type { CollectionEntry } from 'astro:content';
import { formatPublishedLabel } from './article-page';
import { contentEntrySlug } from './content-entry';

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
  const spaced = value.match(/^(\d{2})\s+(\d{1,2}),\s+(\d{4})$/);
  if (spaced) {
    return Date.UTC(Number(spaced[3]), Number(spaced[1]) - 1, Number(spaced[2]));
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

function cardFromContentEntry(
  entry: CollectionEntry<'blog'> | CollectionEntry<'review'>,
  collection: ArchiveCollection,
): SortableArchiveGridCard {
  const slug = contentEntrySlug(entry.id, collection);
  const dateText = formatPublishedLabel(entry.data.publishedAt);
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

export async function listArchivePosts(
  collection: ArchiveCollection,
  entries: CollectionEntry<'blog'>[] | CollectionEntry<'review'>[],
): Promise<ArchiveGridCard[]> {
  const cards = entries
    .filter((entry) => entry.id !== 'index' && entry.data.slug !== collection)
    .map((entry) => cardFromContentEntry(entry, collection));

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
  if (!entry) return null;

  const card = cardFromContentEntry(entry, collection);
  return {
    title: entry.data.title,
    href: card.href,
    image: card.image,
    dateText: card.dateText ?? '',
  };
}
