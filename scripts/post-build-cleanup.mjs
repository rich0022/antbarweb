#!/usr/bin/env node
/**
 * Post-build cleanup: remove files from dist/wp-content/ that aren't needed.
 * - Removes PNG/JPEG originals that have WebP copies
 * - Removes plugin/theme source files (already bundled into our bundles)
 * - Reports savings
 */
import { existsSync, readdirSync, statSync, rmSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist', 'wp-content');
const PUBLIC_UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');

const EXT_RE = /\.(png|jpe?g)$/i;
const DELETED = [];

function* walk(dir) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) yield* walk(full);
      else yield full;
    }
  } catch {}
}

function webpExistsInPublic(originalPath) {
  // Given a path in dist/, check if the corresponding file in public/ has a .webp version
  const relative = originalPath.replace(DIST, '');
  const publicPath = join(ROOT, 'public', 'wp-content', relative);
  // Check webp at the same directory level
  const webpPath = publicPath.replace(EXT_RE, '.webp');
  return existsSync(webpPath);
}

function filesize(p) {
  try { return statSync(p).size; } catch { return 0; }
}

let sizeRemoved = 0;
let fileCount = 0;

// Remove original PNG/JPEG when WebP exists
for (const filePath of walk(DIST)) {
  if (!EXT_RE.test(filePath)) continue;
  if (!webpExistsInPublic(filePath)) continue;
  const sz = filesize(filePath);
  unlinkSync(filePath);
  sizeRemoved += sz;
  fileCount++;
}

console.log(`Removed ${fileCount} original images: ${(sizeRemoved/1024/1024).toFixed(1)}MB`);
