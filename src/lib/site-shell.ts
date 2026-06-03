import { normalizeMirrorHtml } from './mirror-urls';

/** Remove duplicated header/footer blocks from mirrored page bodies. */
export function stripSiteShellFromHtml(html: string): string {
  return normalizeMirrorHtml(html)
    .replace(/<header\b[^>]*\belementor-location-header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*\belementor-location-footer\b[\s\S]*?<\/footer>/gi, '')
    .trim();
}
