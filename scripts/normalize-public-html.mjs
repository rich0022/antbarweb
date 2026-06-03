import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeMirrorHtml } from './lib/mirror-urls.mjs';

const MIRROR_DIR = path.join(process.cwd(), 'mirror');

async function collectHtmlFiles(dirPath, files = []) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await collectHtmlFiles(fullPath, files);
      continue;
    }
    if (entry.name === 'index.html') files.push(fullPath);
  }
  return files;
}

const files = await collectHtmlFiles(MIRROR_DIR);
let updated = 0;

for (const filePath of files) {
  const raw = await readFile(filePath, 'utf8');
  const normalized = normalizeMirrorHtml(raw);
  if (normalized === raw) continue;
  await writeFile(filePath, normalized, 'utf8');
  updated += 1;
  console.log(`Normalized ${path.relative(MIRROR_DIR, filePath)}`);
}

console.log(`Done. ${updated} of ${files.length} HTML files updated.`);
