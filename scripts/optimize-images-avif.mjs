#!/usr/bin/env node
/**
 * Generate AVIF variants for priority raster images.
 *
 * Usage:
 *   node scripts/optimize-images-avif.mjs
 *   node scripts/optimize-images-avif.mjs --force
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');
const force = process.argv.includes('--force');

const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MIN_BYTES = 40 * 1024;
const MIN_WIDTH = 400;
const QUALITY = 52;

/** Directories and filename hints for above-the-fold / catalog imagery. */
const PRIORITY_DIR_RE =
  /\/(2024\/(03|04|05|06|07|09|10|11)|2023\/12)\//i;
const PRIORITY_NAME_RE =
  /(banner|BANNER|HOME-|ROCKET|SA800|AT800|AG600|KT800|AGP|ROCKET|ahp10000|ATB600|DAH6000|ABOUT|ANTBAR-LAB|RD-Center|Intelligent-Manufacturing|LOGO|图层|product|homepage|home2|mobile|移动端)/i;

let created = 0;
let skipped = 0;

async function main() {
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

function isPriority(relPath) {
  return PRIORITY_DIR_RE.test(`/${relPath}/`) || PRIORITY_NAME_RE.test(relPath);
}

for (const filePath of walk(UPLOADS)) {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  if (!SOURCE_EXT.has(ext)) continue;

  const relPath = relative(UPLOADS, filePath);
  if (!isPriority(relPath)) continue;

  const avifPath = filePath.replace(/\.(png|jpe?g|webp)$/i, '.avif');
  if (existsSync(avifPath) && !force) {
    skipped++;
    continue;
  }

  const inputSize = statSync(filePath).size;
  if (inputSize < MIN_BYTES && !/LOGO|图标|TITLE|图层/i.test(relPath)) continue;

  try {
    const image = sharp(filePath, { failOn: 'none' });
    const meta = await image.metadata();
    if ((meta.width ?? 0) < MIN_WIDTH && inputSize < MIN_BYTES) continue;

    await image.avif({ quality: QUALITY, effort: 4 }).toFile(avifPath);
    const outputSize = statSync(avifPath).size;
    created++;
    console.log(
      `  avif ${(outputSize / 1024).toFixed(0)}KB <= ${(inputSize / 1024).toFixed(0)}KB: ${relPath}`,
    );
  } catch {
    /* skip broken sources */
  }
}

console.log(`\nAVIF: ${created} created, ${skipped} skipped (already present)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
