import { readdir } from 'node:fs/promises';

export async function collectMirroredPages(dirPath, routePrefix = '') {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = `${dirPath}/${entry.name}`;

    if (entry.isDirectory()) {
      const nextPrefix = `${routePrefix}/${entry.name}`;
      pages.push(...await collectMirroredPages(fullPath, nextPrefix));
      continue;
    }

    if (!entry.isFile() || entry.name !== 'index.html') continue;

    const normalizedRoute = routePrefix.replace(/^\/+/, '');
    pages.push({
      route: normalizedRoute === '' ? undefined : normalizedRoute,
      filePath: fullPath,
    });
  }

  return pages;
}
