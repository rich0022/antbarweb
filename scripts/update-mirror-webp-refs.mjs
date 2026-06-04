#!/usr/bin/env node
/**
 * Update all mirror HTML files to reference .webp images when available.
 * Updates <img src>, srcset, and any inline style background-image references.
 *
 * Usage: node scripts/update-mirror-webp-refs.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { readdirSync } from 'node:fs';

const ROOT = join(import.meta.dirname, '..');
const MIRROR = join(ROOT, 'mirror');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');

const EXT_RE = /\.(png|jpe?g)/gi;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name === 'index.html') yield full;
  }
}

function webpExists(srcPath) {
  // Convert a WordPress upload URL path to filesystem path and check .webp
  let filePath = srcPath.replace(/^\/?/, '');
  if (!filePath.startsWith('wp-content/')) filePath = join('wp-content/uploads', filePath);
  const abs = join(ROOT, 'public', filePath);
  const webp = abs.replace(/\.(png|jpe?g)$/i, '.webp');
  return existsSync(webp);
}

function replaceSrc(match, p1, offset, string) {
  const path = match.replace(/^(https?:)?\/\//, '');
  const justPath = path.replace(/^(?:www\.)?antbar\.com(?:\/|$)/, '');
  if (webpExists(justPath)) {
    return match.replace(/\.(png|jpe?g)/i, '.webp');
  }
  return match;
}

let updated = 0;
let totalRefs = 0;

for (const filePath of walk(MIRROR)) {
  const html = readFileSync(filePath, 'utf8');
  const relPath = filePath.replace(ROOT, '');

  // Replace <img src="..."> and <img srcset="...">
  let newHtml = html.replace(
    /(<img\s[^>]*?\bsrc\s*=\s*["'])([^"']*\.(?:png|jpe?g))(["'])/gi,
    (_, before, src, after) => {
      if (webpExists(src)) { totalRefs++; return before + src.replace(/\.(png|jpe?g)/i, '.webp') + after; }
      return _;
    }
  );

  // Also update srcset attributes
  newHtml = newHtml.replace(
    /(<img\s[^>]*?\bsrcset\s*=\s*["'])([^"']*?)(["'])/gi,
    (_, before, srcset, after) => {
      const newSrcset = srcset.replace(/([\w\-\/.%]+\.(?:png|jpe?g))\s*(\d+w)?/gi, (match, path, size) => {
        if (webpExists(path)) {
          totalRefs++;
          const newPath = path.replace(/\.(png|jpe?g)/i, '.webp');
          return size ? `${newPath} ${size}` : newPath;
        }
        return match;
      });
      return before + newSrcset + after;
    }
  );

  if (newHtml !== html) {
    writeFileSync(filePath, newHtml);
    updated++;
  }
}

console.log(`Updated ${updated} HTML files, replaced ${totalRefs} image references to WebP`);
