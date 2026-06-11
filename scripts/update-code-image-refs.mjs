#!/usr/bin/env node
/**
 * Point src/ and content image URLs at WebP/AVIF when available in public/.
 *
 * Usage:
 *   node scripts/update-code-image-refs.mjs
 *   node scripts/update-code-image-refs.mjs --webp-only
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { modernizeUploadRefs } from './lib/image-paths.mjs';

const ROOT = join(import.meta.dirname, '..');
const TARGETS = [join(ROOT, 'src')];
const WEBP_ONLY = process.argv.includes('--webp-only');

const EXT_RE = /\.(astro|ts|tsx|md|mdx|css)$/i;
let filesChanged = 0;
let replacements = 0;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      yield* walk(full);
    } else if (EXT_RE.test(entry.name)) {
      yield full;
    }
  }
}

for (const base of TARGETS) {
  for (const filePath of walk(base)) {
    const before = readFileSync(filePath, 'utf8');
    const after = modernizeUploadRefs(before, ROOT, !WEBP_ONLY);
    if (after === before) continue;

    const count = [...before.matchAll(/\/wp-content\/uploads\/[^'"\s)>]+?\.(?:png|jpe?g|webp)/gi)].filter(
      (match, index) => {
        const resolved = modernizeUploadRefs(match[0], ROOT, !WEBP_ONLY);
        return resolved !== match[0];
      },
    ).length;

    writeFileSync(filePath, after, 'utf8');
    filesChanged++;
    replacements += count;
    console.log(`  ${relative(ROOT, filePath)}`);
  }
}

console.log(`\nUpdated ${filesChanged} files (${replacements}+ path modernizations).`);
