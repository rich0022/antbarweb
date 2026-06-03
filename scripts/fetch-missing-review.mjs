import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { normalizeMirrorHtml } from './lib/mirror-urls.mjs';

const ROOT = process.cwd();
const MIRROR_DIR = path.join(ROOT, 'mirror');
const ORIGIN = 'https://antbar.com';

const REQUIRED_SLUGS = [
  'antbar-the-pop-disposable-vape-review-kt800',
  'antbar-sa8000-disposable-vape-reviewpop-vape',
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchReview(slug) {
  const url = `${ORIGIN}/review/${slug}/`;
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'antbarweb-mirror-fetch/1.0' },
  });
  if (!response.ok) {
    console.warn(`Skip ${slug}: HTTP ${response.status}`);
    return false;
  }
  const html = normalizeMirrorHtml(await response.text());
  const targetDir = path.join(MIRROR_DIR, 'review', slug);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`Fetched review/${slug}/`);
  return true;
}

let fetched = 0;
let skipped = 0;

for (const slug of REQUIRED_SLUGS) {
  const target = path.join(MIRROR_DIR, 'review', slug, 'index.html');
  if (await exists(target)) {
    skipped += 1;
    continue;
  }
  if (await fetchReview(slug)) fetched += 1;
}

console.log(`Done. ${fetched} fetched, ${skipped} already present.`);
