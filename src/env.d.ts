/// <reference types="astro/client" />

interface PagefindInstance {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<import('./lib/pagefind-search').SearchResultItem> }>;
  }>;
  options?: (options: { excerptLength?: number }) => Promise<void>;
}

interface Window {
  pagefind?: PagefindInstance;
  turnstile?: {
    reset: (widget?: HTMLElement) => void;
  };
}
