#!/usr/bin/env node
/**
 * Report deploy-risk media under public/wp-content/uploads.
 * Usage: node scripts/audit-media.mjs
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');
const MB = 1024 * 1024;

const issues = [];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

if (!existsSync(UPLOADS)) {
  console.log('No uploads directory found.');
  process.exit(0);
}

let uploadsBytes = 0;
const large = [];

for (const filePath of walk(UPLOADS)) {
  const size = statSync(filePath).size;
  uploadsBytes += size;
  const rel = relative(ROOT, filePath);

  if (/\.orig\.mp4$/i.test(filePath)) {
    issues.push(`orig master in public: ${rel} (${(size / MB).toFixed(1)} MB)`);
  }

  if (/\.gif$/i.test(filePath)) {
    issues.push(`gif in public: ${rel} (${(size / MB).toFixed(1)} MB)`);
  }

  if (size >= MB) large.push({ rel, size });
}

large.sort((a, b) => b.size - a.size);

console.log(`Uploads total: ${(uploadsBytes / MB).toFixed(1)} MB\n`);

if (issues.length) {
  console.log('Issues:');
  for (const line of issues) console.log(`  - ${line}`);
} else {
  console.log('Issues: none (no .orig.mp4 or .gif under public/uploads)');
}

console.log('\nLargest files (>1 MB):');
for (const item of large.slice(0, 12)) {
  console.log(`  ${(item.size / MB).toFixed(1)} MB  ${item.rel}`);
}

process.exit(issues.length ? 1 : 0);
