/** Normalize Astro pathname for nav active-state (matches mirror e-current). */
export function normalizeSitePath(pathname: string): string {
  const path = pathname.replace(/\/index\.html$/, '') || '/';
  if (path !== '/' && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function isNavItemActive(href: string, pathname: string): boolean {
  const current = normalizeSitePath(pathname);
  const target = normalizeSitePath(href);
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}
