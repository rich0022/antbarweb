#!/usr/bin/env node
/**
 * Delete upload assets under public/wp-content/uploads that are not referenced
 * anywhere in deployable source (src/, functions/, public styles outside uploads).
 *
 * Usage:
 *   node scripts/prune-unreferenced-media.mjs --dry-run
 *   node scripts/prune-unreferenced-media.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');
const dryRun = process.argv.includes('--dry-run');
const UPLOADS_URL = '/wp-content/uploads/';

const SCAN_DIRS = [
  join(ROOT, 'src'),
  join(ROOT, 'functions'),
  join(ROOT, 'public', 'styles'),
];

const MEDIA_EXT = /\.(?:avif|webp|png|jpe?g|gif|mp4|webm|svg)$/i;

function* walkFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(full);
    else yield full;
  }
}

function collectSourceText() {
  const chunks = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walkFiles(dir)) {
      if (file.includes(`${join('public', 'wp-content', 'uploads')}${join('', '')}`)) continue;
      try {
        chunks.push(readFileSync(file, 'utf8'));
      } catch {}
    }
  }
  return chunks.join('\n');
}

function addCompanionRefs(refs, urlPath) {
  refs.add(urlPath);
  if (/\.mp4$/i.test(urlPath)) {
    refs.add(urlPath.replace(/\.mp4$/i, '.webm'));
  }
  if (/\.webm$/i.test(urlPath)) {
    refs.add(urlPath.replace(/\.webm$/i, '.mp4'));
  }
  if (/-poster\.webp$/i.test(urlPath)) {
    const base = urlPath.replace(/-poster\.webp$/i, '');
    refs.add(`${base}.mp4`);
    refs.add(`${base}.webm`);
  }
}

function extractReferencedPaths(sourceText) {
  const refs = new Set();
  const re = /\/wp-content\/uploads\/[^\s"'`)<>]+/gi;
  for (const match of sourceText.matchAll(re)) {
    let path = match[0].replace(/[),.;]+$/, '');
    if (MEDIA_EXT.test(path)) addCompanionRefs(refs, path);
  }
  return refs;
}

function uploadUrlFromAbs(absPath) {
  const rel = relative(join(ROOT, 'public'), absPath).replace(/\\/g, '/');
  return `/${rel}`;
}

let removed = 0;
let savedBytes = 0;

const sourceText = collectSourceText();
const referenced = extractReferencedPaths(sourceText);

console.log(`Referenced upload paths: ${referenced.size}`);
if (dryRun) console.log('(dry-run — no files deleted)\n');

for (const filePath of walkFiles(UPLOADS)) {
  const url = uploadUrlFromAbs(filePath);
  if (referenced.has(url)) continue;

  const size = statSync(filePath).size;
  const rel = relative(ROOT, filePath);
  console.log(`  delete ${rel} (${(size / 1024).toFixed(0)} KB)`);
  if (!dryRun) unlinkSync(filePath);
  removed++;
  savedBytes += size;
}

console.log(
  `\n${dryRun ? 'Would remove' : 'Removed'} ${removed} files, ${(savedBytes / 1024 / 1024).toFixed(1)} MB`,
);
