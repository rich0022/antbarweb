#!/usr/bin/env node
/**
 * Optimize PNG/JPEG images in public/wp-content/uploads/ to WebP.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --force-large
 */
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const QUALITY = 80;
const FORCE_LARGE_BYTES = 500 * 1024;
const forceLarge = process.argv.includes('--force-large');

let converted = 0;
let regenerated = 0;
let totalSaved = 0;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

// AG600.png is the catalog card (563×697); AG600.jpg/.avif is the product hero — do not merge basenames.
const SKIP_WEBP_SOURCES = /\/2024\/03\/AG600\.png$/i;

for (const filePath of walk(UPLOADS)) {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  if (!EXTENSIONS.has(ext)) continue;
  if (SKIP_WEBP_SOURCES.test(filePath)) continue;

  const webpPath = filePath.slice(0, filePath.lastIndexOf('.')) + '.webp';
  const inputSize = statSync(filePath).size;
  const relPath = relative(UPLOADS, filePath);

  const shouldConvert = !existsSync(webpPath);
  const shouldRegenerate =
    forceLarge && existsSync(webpPath) && statSync(webpPath).size >= FORCE_LARGE_BYTES;

  if (!shouldConvert && !shouldRegenerate) continue;

  try {
    if (shouldRegenerate) unlinkSync(webpPath);
    execSync(`cwebp -q ${QUALITY} "${filePath}" -o "${webpPath}" 2>/dev/null`, { stdio: 'pipe' });
    const outputSize = statSync(webpPath).size;
    const saved = inputSize - outputSize;
    totalSaved += Math.max(saved, 0);
    if (shouldRegenerate) regenerated++;
    else converted++;
    if (Math.abs(saved) > 50000 || shouldRegenerate) {
      console.log(
        `  ${shouldRegenerate ? 'regen' : 'new'} ${(outputSize / 1024).toFixed(0)}KB <= ${(inputSize / 1024).toFixed(0)}KB: ${relPath}`,
      );
    }
  } catch {
    /* skip */
  }
}

console.log(
  `\nWebP: ${converted} new, ${regenerated} regenerated, net source savings ~${(totalSaved / 1024 / 1024).toFixed(1)}MB`,
);
