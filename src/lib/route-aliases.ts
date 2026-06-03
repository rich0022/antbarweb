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

/** Pod-sys URLs that use disposable product content on disk. */
export const POD_SYS_DISPOSABLE_ALIASES: Record<string, string> = {
  'antbar-3000-6000': 'disposable/antbar-3000-6000',
};

export function disposableUrlSlugFromEntryId(entryId: string): string {
  const path = entryId.replace(/^products\//, '').replace(/^disposable\//, '');
  if (path.startsWith('disposable/')) {
    return path.replace(/^disposable\//, '');
  }
  return path;
}
