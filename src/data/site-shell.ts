/** Base body class for pages using SiteShellLayout (handwritten shell). */
export const SITE_SHELL_BODY_CLASS = 'site-shell-body';

export function siteShellBodyClass(pageClass = ''): string {
  return pageClass ? `${SITE_SHELL_BODY_CLASS} ${pageClass}` : SITE_SHELL_BODY_CLASS;
}
