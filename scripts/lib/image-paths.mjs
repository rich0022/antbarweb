import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const UPLOADS_PREFIX = '/wp-content/uploads/';

export function uploadsRoot(rootDir) {
  return join(rootDir, 'public', 'wp-content', 'uploads');
}

export function publicPathFromUploadUrl(urlPath) {
  if (!urlPath.startsWith(UPLOADS_PREFIX)) return null;
  return join('public', urlPath);
}

export function swapRasterExt(path, ext) {
  return path.replace(/\.(png|jpe?g|webp|avif)$/i, `.${ext}`);
}

export function resolveModernPath(urlPath, rootDir, preferAvif = true) {
  if (!urlPath.startsWith(UPLOADS_PREFIX)) return urlPath;
  if (/cropped-cropped-pic/i.test(urlPath)) return urlPath;
  // Catalog card only — AG600.avif is the wide hero banner, not this file.
  if (/\/2024\/03\/AG600\.png$/i.test(urlPath)) return urlPath;

  const rel = publicPathFromUploadUrl(urlPath);
  if (!rel) return urlPath;

  const abs = join(rootDir, rel);

  if (preferAvif) {
    const avif = swapRasterExt(abs, 'avif');
    if (existsSync(avif)) return swapRasterExt(urlPath, 'avif');
  }

  const webp = swapRasterExt(abs, 'webp');
  if (existsSync(webp)) return swapRasterExt(urlPath, 'webp');

  return urlPath;
}

export function modernizeUploadRefs(text, rootDir, preferAvif = true) {
  const re = /\/wp-content\/uploads\/[^'"\s)>]+?\.(?:png|jpe?g|webp)/gi;
  return text.replace(re, (match) => resolveModernPath(match, rootDir, preferAvif));
}
