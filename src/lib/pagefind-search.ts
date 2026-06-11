export type SearchResultType = 'product' | 'blog' | 'page';

export type SearchTypeLabels = Partial<Record<SearchResultType, string>>;

export type SearchResultItem = {
  url: string;
  excerpt?: string;
  meta: {
    title?: string;
    type?: string;
    image?: string;
    [key: string]: unknown;
  };
};

export type EnrichedSearchResult = SearchResultItem & {
  resultType: SearchResultType;
  typeLabel: string;
};

export const SEARCH_PAGE_SIZE = 12;
export const SEARCH_DROPDOWN_LIMIT = 8;

export const DEFAULT_TYPE_LABELS: Required<SearchTypeLabels> = {
  product: 'Product',
  blog: 'Blog',
  page: 'Page',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function cleanExcerpt(html: unknown, stripHighlights = false): string {
  let text = String(html ?? '')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<(?!\/?mark\b)[^>]+>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (stripHighlights) {
    text = text.replace(/<\/?mark>/gi, '');
  }

  return text;
}

export function truncateExcerpt(html: unknown, maxLength = 110, stripHighlights = false): string {
  const text = cleanExcerpt(html, stripHighlights);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function inferResultType(url: string): SearchResultType {
  try {
    const path = new URL(url, 'https://antbar.com').pathname;
    if (
      path === '/all-products/' ||
      path.startsWith('/disposable/') ||
      path.startsWith('/review/')
    ) {
      return 'product';
    }
    if (path === '/blog/' || path.startsWith('/blog/')) return 'blog';
  } catch {
    /* ignore */
  }
  return 'page';
}

export function normalizeMetaType(value: unknown): SearchResultType | null {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase();
  if (raw === 'product' || raw === 'products') return 'product';
  if (raw === 'blog' || raw === 'article') return 'blog';
  if (raw === 'page' || raw === 'pages') return 'page';
  return null;
}

export function getTypeLabel(type: SearchResultType, labels?: SearchTypeLabels): string {
  if (labels?.[type]) return labels[type]!;
  return DEFAULT_TYPE_LABELS[type];
}

export function enrichResult(item: SearchResultItem, labels?: SearchTypeLabels): EnrichedSearchResult {
  const resultType = normalizeMetaType(item.meta?.type) ?? inferResultType(item.url);
  return {
    ...item,
    resultType,
    typeLabel: getTypeLabel(resultType, labels),
  };
}

export function enrichResults(items: SearchResultItem[], labels?: SearchTypeLabels): EnrichedSearchResult[] {
  return items.map((item) => enrichResult(item, labels));
}

export function filterByType(
  items: EnrichedSearchResult[],
  filter: SearchResultType | 'all',
): EnrichedSearchResult[] {
  if (filter === 'all') return items;
  return items.filter((item) => item.resultType === filter);
}

export function groupByType(items: EnrichedSearchResult[]) {
  return {
    product: items.filter((item) => item.resultType === 'product'),
    blog: items.filter((item) => item.resultType === 'blog'),
    page: items.filter((item) => item.resultType === 'page'),
  };
}

export function formatResultPath(url: string): string {
  try {
    return new URL(url, 'https://antbar.com').pathname;
  } catch {
    return url;
  }
}

export async function loadPagefind(excerptLength = 24) {
  if (typeof window === 'undefined') return null;

  const options = { excerptLength };

  if (window.pagefind && typeof window.pagefind.search === 'function') {
    await window.pagefind.options?.(options);
    return window.pagefind;
  }

  try {
    const pagefindUrl = '/pagefind/pagefind.js';
    const mod = (await import(/* @vite-ignore */ pagefindUrl)) as {
      default?: typeof window.pagefind;
    } & typeof window.pagefind;
    const pf = mod?.default ?? mod;
    if (pf && typeof pf.search === 'function') {
      await pf.options?.(options);
      window.pagefind = pf;
      return pf;
    }
  } catch {
    /* ignore */
  }

  return null;
}

export async function searchPagefind(keyword: string, limit?: number) {
  const pf = await loadPagefind(24);
  if (!pf) return null;

  const response = await pf.search(keyword);
  const slice = limit ? response.results.slice(0, limit) : response.results;
  const data = await Promise.all(slice.map((item) => item.data()));
  return enrichResults(data);
}
