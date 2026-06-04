#!/usr/bin/env node
/**
 * Optimize all PNG/JPEG images in public/wp-content/uploads/ to WebP.
 * Keeps originals. Run once or as needed.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const QUALITY = 80; // good balance for WebP

let converted = 0;
let totalSaved = 0;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}

for (const filePath of walk(UPLOADS)) {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  if (!EXTENSIONS.has(ext)) continue;

  const webpPath = filePath.slice(0, filePath.lastIndexOf('.')) + '.webp';
  if (existsSync(webpPath)) continue; // already has webp

  const inputSize = statSync(filePath).size;
  const relPath = relative(UPLOADS, filePath);

  try {
    execSync(`cwebp -q ${QUALITY} "${filePath}" -o "${webpPath}" 2>/dev/null`, { stdio: 'pipe' });
    const outputSize = statSync(webpPath).size;
    const saved = inputSize - outputSize;
    totalSaved += saved;
    converted++;
    if (saved > 50000) {
      console.log(`  ${(saved/1024).toFixed(0)}KB saved: ${relPath}`);
    }
  } catch (e) {
    // skip files that can't be converted
  }
}

console.log(`\nConverted ${converted} files, saved ${(totalSaved/1024/1024).toFixed(1)}MB`);
