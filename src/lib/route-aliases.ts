/** Legacy URLs from the live site that differ from mirrored filenames. */
export const REVIEW_URL_ALIASES: Record<string, string> = {
  'antbar-sa8000-disposable-vape-reviewpop-vape': 'antbar-sa8000-disposable-vape-review',
};

export function resolveReviewUrlSlug(slug: string): string {
  return REVIEW_URL_ALIASES[slug] ?? slug;
}

export function disposableUrlSlugFromMirrorRoute(mirrorRoute: string): string {
  const normalized = mirrorRoute.replace(/^disposable\//, '');
  if (normalized.startsWith('disposable/')) {
    return normalized.replace(/^disposable\//, '');
  }
  return normalized;
}

/** Disposable slugs with dedicated SubPageLayout routes — exclude from catch-all. */
export const DEDICATED_DISPOSABLE_PAGE_SLUGS = new Set([
  'antbar-3000-6000',
  'v10000-puffs-disposable-vape',
  'agp12000-nicotine-disposable-vape',
  'antbar-ag600',
  'antbar-atb600',
  'antbar-kt800',
  'antbar-rocket',
  'antbar-sa8000',
  'at800-puffs-disposable-vape',
]);

export function disposableUrlSlugFromEntryId(entryId: string): string {
  const path = entryId.replace(/^products\//, '').replace(/^disposable\//, '');
  if (path.startsWith('disposable/')) {
    return path.replace(/^disposable\//, '');
  }
  return path;
}
