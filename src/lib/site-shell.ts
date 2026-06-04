import { normalizeMirrorHtml } from './mirror-urls';

/** Remove duplicated header/footer blocks from mirrored page bodies. */
export function stripSiteShellFromHtml(html: string): string {
  return normalizeMirrorHtml(html)
    .replace(/<header\b[^>]*\belementor-location-header\b[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*\belementor-location-footer\b[\s\S]*?<\/footer>/gi, '')
    .trim();
}

/** Remove the <main> wrapper and stray tags from mirror body content. */
export function stripMainWrapper(html: string): string {
  return html
    .replace(/<main\b[^>]*>/gi, '')
    .replace(/<\/main>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<a\b[^>]*\bcdn-cgi\b[^>]*>[\s\S]*?<\/a>/gi, '')
    .trim();
}
