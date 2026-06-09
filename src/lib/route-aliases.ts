/** Legacy URLs from the live site that differ from mirrored filenames. */
export const REVIEW_URL_ALIASES: Record<string, string> = {
  'antbar-sa8000-disposable-vape-reviewpop-vape': 'antbar-sa8000-disposable-vape-review',
};

export function resolveReviewUrlSlug(slug: string): string {
  return REVIEW_URL_ALIASES[slug] ?? slug;
}
