/** Map Astro 6 content entry id to on-disk markdown filename under src/content/{collection}/ */
export function contentEntryFileName(entryId: string, collection?: string): string {
  let base = entryId;

  if (collection === 'blog' || collection === 'review') {
    base = entryId.replace(/^(?:blog|review)\//, '');
    if (base === 'blog' || base === 'review' || base === 'index') return 'index.md';
  } else if (collection === 'products') {
    base = entryId.replace(/^products\//, '');
    if (base === 'disposable' || base === 'pod-sys') return `${base}/index.md`;
  }

  if (base.endsWith('.md') || base.endsWith('.mdx')) return base;
  return `${base}.md`;
}

export function contentEntrySlug(entryId: string, collection?: string): string {
  return contentEntryFileName(entryId, collection).replace(/\.mdx?$/, '');
}
