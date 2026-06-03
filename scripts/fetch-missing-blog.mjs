import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { normalizeMirrorHtml } from './lib/mirror-urls.mjs';

const ROOT = process.cwd();
const MIRROR_DIR = path.join(ROOT, 'mirror');
const BLOG_INDEX = path.join(MIRROR_DIR, 'blog', 'index.html');
const ORIGIN = 'https://antbar.com';

function extractBlogLinks(html) {
  const links = new Set();
  const patterns = [
    /href=["'](\/blog\/[^"'#?]+)\/?["']/gi,
    /href=["']https?:\/\/(?:www\.)?antbar\.com(\/blog\/[^"'#?]+)\/?["']/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const pathname = match[1].replace(/\/+$/, '');
      if (pathname === '/blog') continue;
      const slug = pathname.replace(/^\/blog\//, '');
      if (slug && !/^\d+$/.test(slug)) links.add(slug);
    }
  }

  return [...links];
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchPage(slug) {
  const url = `${ORIGIN}/blog/${slug}/`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'antbarweb-mirror-fetch/1.0' },
  });
  if (!response.ok) {
    console.warn(`Skip ${slug}: HTTP ${response.status}`);
    return false;
  }
  const html = normalizeMirrorHtml(await response.text());
  const targetDir = path.join(MIRROR_DIR, 'blog', slug);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`Fetched blog/${slug}/`);
  return true;
}

const htmlChunks = [await readFile(BLOG_INDEX, 'utf8')];
const page2Path = path.join(MIRROR_DIR, 'blog', '2', 'index.html');
if (await exists(page2Path)) {
  htmlChunks.push(await readFile(page2Path, 'utf8'));
} else {
  try {
    const response = await fetch(`${ORIGIN}/blog/2/`, {
      headers: { 'User-Agent': 'antbarweb-mirror-fetch/1.0' },
    });
    if (response.ok) {
      const html = normalizeMirrorHtml(await response.text());
      await mkdir(path.join(MIRROR_DIR, 'blog', '2'), { recursive: true });
      await writeFile(page2Path, html, 'utf8');
      htmlChunks.push(html);
      console.log('Fetched blog/2/');
    }
  } catch (error) {
    console.warn('Could not fetch blog/2/', error);
  }
}

const slugs = [...new Set(htmlChunks.flatMap(extractBlogLinks))];
let fetched = 0;
let skipped = 0;

for (const slug of slugs) {
  const target = path.join(MIRROR_DIR, 'blog', slug, 'index.html');
  if (await exists(target)) {
    skipped += 1;
    continue;
  }
  if (await fetchPage(slug)) fetched += 1;
}

console.log(`Done. ${slugs.length} links found, ${fetched} fetched, ${skipped} already present.`);
