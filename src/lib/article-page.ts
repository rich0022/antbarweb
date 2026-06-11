import type { CollectionEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { contentEntryFileName, contentEntrySlug } from './content-entry';
import { getContentFilePath } from './content-body';

export type ArticleCollection = 'blog' | 'review';

export type TocItem = {
  id: string;
  text: string;
};

export type ArticleCard = {
  title: string;
  href: string;
  image: string;
};

export type ArticleRef = {
  collection: ArticleCollection;
  slug: string;
};

export type HotProductCard = ArticleCard & {
  cta: string;
};

type ArticleEntry = CollectionEntry<'blog'> | CollectionEntry<'review'>;

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export const BLOG_LATEST_REFS: ArticleRef[] = [
  { collection: 'blog', slug: 'what-is-the-impact-on-black-market-vape' },
  { collection: 'blog', slug: 'future-trends-in-vape-design-2024' },
  { collection: 'blog', slug: 'what-are-the-popular-vape-brands-in-2024' },
];

export const BLOG_RELATED_REFS: ArticleRef[] = [
  { collection: 'blog', slug: 'what-is-pmta' },
  { collection: 'blog', slug: 'what-are-the-benefits-of-banning-disposable-and-flavored-vapes' },
  { collection: 'blog', slug: 'eu-ecigarette-regulation' },
];

export const REVIEW_LATEST_REFS: ArticleRef[] = [
  { collection: 'blog', slug: 'what-is-the-impact-on-black-market-vape' },
  { collection: 'review', slug: '2024-best-nicotine-containing-disposable-vapes-antbar-at800' },
  { collection: 'blog', slug: 'future-trends-in-vape-design-2024' },
];

export const REVIEW_RELATED_REFS: ArticleRef[] = [
  { collection: 'review', slug: 'antbar-rocket-disposable-vape-review' },
  { collection: 'review', slug: 'antbar-sa8000-disposable-vape-review' },
  { collection: 'review', slug: 'disposable-nicotine-vapes-antbar-ag600-reviews' },
];

export const BLOG_FEATURED_REFS: ArticleRef[] = [
  { collection: 'review', slug: 'antbar-rocket-disposable-vape-review' },
];

export const REVIEW_FEATURED_REFS: ArticleRef[] = [
  { collection: 'blog', slug: 'what-are-the-popular-vape-brands-in-2024' },
];

export const HOT_SALE_PRODUCTS: HotProductCard[] = [
  {
    title: 'KT800',
    href: '/disposable/antbar-kt800/',
    image: '/wp-content/uploads/2024/05/KT800.avif',
    cta: 'Learn More »',
  },
  {
    title: 'DAH6000',
    href: '/disposable/antbar-3000-6000/',
    image: '/wp-content/uploads/2024/03/DAH6000.avif',
    cta: 'Learn More »',
  },
  {
    title: 'AGP12000',
    href: '/disposable/agp12000-nicotine-disposable-vape/',
    image: '/wp-content/uploads/2024/06/AGP12000-NEW.webp',
    cta: 'Learn More »',
  },
  {
    title: 'ROCKET',
    href: '/disposable/antbar-rocket/',
    image: '/wp-content/uploads/2024/03/ROCKET-1.avif',
    cta: 'Learn More »',
  },
];

export const BLOG_LATEST_ITEMS: ArticleCard[] = [
  {
    title: 'How about Vaping Prescription In Australia',
    href: '/blog/how-about-vaping-prescription-in-australia/',
    image: '/wp-content/uploads/2024/10/aodaliya.avif',
  },
  {
    title: 'Global Vape Regulations Update In 2024: 8 Countries or Territories',
    href: '/blog/global-vape-regulations-update-in-2024-8-countries-or-territories/',
    image: '/wp-content/uploads/2024/10/golbal-Vape-Regulations.avif',
  },
  {
    title: 'What Are The Top 10 Popular And Least Harmful Disposable Vapes?',
    href: '/blog/what-are-the-top-10-popular-and-least-harmful-disposable-vapes/',
    image: '/wp-content/uploads/2024/04/9.avif',
  },
];

export const BLOG_RELATED_ITEMS: ArticleCard[] = [
  {
    title: 'Does Vaping make you less smart',
    href: '/blog/does-vaping-impact-iq/',
    image: '/wp-content/uploads/2024/09/2.avif',
  },
  {
    title: '2024: Ban on flavoured e-cigarettes in Holland',
    href: '/blog/2024-ban-on-flavoured-vape-in-holland/',
    image: '/wp-content/uploads/2024/07/flavor-vape-ban-in-Holland.avif',
  },
  {
    title: 'VAPE Design:Looking ahead to vape trends from the Spain Vape Expo',
    href: '/blog/future-trends-in-vape-design-2024/',
    image: '/wp-content/uploads/2024/09/1.webp',
  },
];

export const BLOG_FEATURED_ITEMS: ArticleCard[] = [
  {
    title: 'Antbar ROCKET Disposable Vape Review：POP Vape',
    href: '/review/antbar-rocket-disposable-vape-review/',
    image: '/wp-content/uploads/2024/03/3T5A7879.avif',
  },
];

export const BLOG_HOT_SALE_PRODUCTS: HotProductCard[] = [
  {
    title: 'KT800',
    href: '/disposable/antbar-kt800/',
    image: '/wp-content/uploads/2024/05/KT800.avif',
    cta: 'Learn More »',
  },
  {
    title: 'DAH6000',
    href: '/disposable/antbar-3000-6000/',
    image: '/wp-content/uploads/2024/03/DAH6000.avif',
    cta: 'Learn More »',
  },
  {
    title: 'AGP12000',
    href: '/disposable/agp12000-nicotine-disposable-vape/',
    image: '/wp-content/uploads/2024/06/AGP12000-NEW.webp',
    cta: 'Learn More »',
  },
  {
    title: 'ROCKET',
    href: '/disposable/antbar-rocket/',
    image: '/wp-content/uploads/2024/03/ROCKET-1.avif',
    cta: 'Learn More »',
  },
];

export const REVIEW_LATEST_ITEMS: ArticleCard[] = [
  {
    title: 'How about Vaping Prescription In Australia',
    href: '/blog/how-about-vaping-prescription-in-australia/',
    image: '/wp-content/uploads/2024/10/aodaliya.avif',
  },
  {
    title: 'ANTBAR The Pop Disposable Vape Review: KT800',
    href: '/review/antbar-the-pop-disposable-vape-review-kt800/',
    image: '/wp-content/uploads/2024/10/2024-best-Pop-Disposable-Vape.avif',
  },
  {
    title: 'Global Vape Regulations Update In 2024: 8 Countries or Territories',
    href: '/blog/global-vape-regulations-update-in-2024-8-countries-or-territories/',
    image: '/wp-content/uploads/2024/10/golbal-Vape-Regulations.avif',
  },
];

export const REVIEW_RELATED_ITEMS: ArticleCard[] = [
  {
    title: 'The 2024 Best Nicotine Disposable Vapes: Antbar AT800',
    href: '/review/2024-best-nicotine-containing-disposable-vapes-antbar-at800/',
    image: '/wp-content/uploads/2024/09/3.webp',
  },
  {
    title: 'Antbar SA8000 Disposable Vape Review：POP Vape',
    href: '/review/antbar-sa8000-disposable-vape-reviewpop-vape/',
    image: '/wp-content/uploads/2024/09/1.webp',
  },
  {
    title: 'What to expect from Disposable Vapes Pen Antbar AG600',
    href: '/review/disposable-nicotine-vapes-antbar-ag600-reviews/',
    image: '/wp-content/uploads/2024/09/2.avif',
  },
];

export const REVIEW_FEATURED_ITEMS: ArticleCard[] = [
  {
    title: 'What Are The Top 10 Popular And Least Harmful Disposable Vapes?',
    href: '/blog/what-are-the-top-10-popular-and-least-harmful-disposable-vapes/',
    image: '/wp-content/uploads/2024/04/9.avif',
  },
];

export const REVIEW_HOT_SALE_PRODUCTS: HotProductCard[] = [
  {
    title: 'DAH6000',
    href: '/disposable/antbar-3000-6000/',
    image: '/wp-content/uploads/2024/03/DAH6000.avif',
    cta: 'Learn More »',
  },
  {
    title: 'AHP10000',
    href: '/disposable/v10000-puffs-disposable-vape/',
    image: '/wp-content/uploads/2024/05/ahp10000.avif',
    cta: 'Learn More »',
  },
  {
    title: 'AG600',
    href: '/disposable/antbar-ag600/',
    image: '/wp-content/uploads/2024/03/AG600.png',
    cta: 'Learn More »',
  },
  {
    title: 'AT800',
    href: '/disposable/at800-puffs-disposable-vape/',
    image: '/wp-content/uploads/2024/03/AT800.avif',
    cta: 'Learn More »',
  },
];

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyHeading(value: string): string {
  return stripInlineMarkdown(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function formatPublishedLabel(publishedAt?: string): string {
  return publishedAt?.trim() ?? '';
}

export async function readMarkdownBody(
  collection: ArticleCollection,
  entryId: string,
): Promise<string> {
  const fileName = contentEntryFileName(entryId, collection);
  const raw = await readFile(getContentFilePath(collection, fileName), 'utf8');
  return raw.replace(FRONTMATTER_RE, '').trim();
}

export function extractTocItems(markdown: string): TocItem[] {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => stripInlineMarkdown(match[1]))
    .filter(Boolean)
    .map((text) => ({
      id: slugifyHeading(text),
      text,
    }));
}

export function buildArticleCard(entry: ArticleEntry, collection: ArticleCollection): ArticleCard {
  const slug = contentEntrySlug(entry.id, collection);
  return {
    title: entry.data.title,
    href: `/${collection}/${slug}/`,
    image: entry.data.heroImage ?? entry.data.featuredImage ?? '/wp-content/uploads/2024/05/LOGO.webp',
  };
}

export function pickArticleCards(
  entriesByCollection: Record<ArticleCollection, ArticleEntry[]>,
  refs: ArticleRef[],
): ArticleCard[] {
  const cards: ArticleCard[] = [];

  for (const ref of refs) {
    const entry = entriesByCollection[ref.collection].find(
      (item) => contentEntrySlug(item.id, ref.collection) === ref.slug,
    );
    if (!entry) continue;
    cards.push(buildArticleCard(entry, ref.collection));
  }

  return cards;
}
