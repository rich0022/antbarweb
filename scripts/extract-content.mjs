import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const MIRROR_DIR = path.join(ROOT, 'mirror');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');

const ROOT_LEVEL_PAGES = new Set([
  '',
  'about-us',
  'all-products',
  'antbar-lab',
  'brand-story',
  'contact',
  'intelligent-manufacturing',
  'pod-sys',
  'rd-center',
  'support',
  'verification',
]);

async function collectIndexPages(dirPath, routePrefix = '') {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nextPrefix = routePrefix ? `${routePrefix}/${entry.name}` : entry.name;
      pages.push(...(await collectIndexPages(fullPath, nextPrefix)));
      continue;
    }

    if (entry.isFile() && entry.name === 'index.html') {
      pages.push({
        route: routePrefix,
        filePath: fullPath,
      });
    }
  }

  return pages;
}

function parseHtml(rawHtml) {
  const html = rawHtml.replace(/^<!doctype html>\s*/i, '');
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  )?.[1];
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
  const bodyInner = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const firstImage = bodyInner.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1];
  const excerpt = bodyInner
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);

  return {
    title,
    description,
    canonical,
    bodyInner,
    firstImage,
    excerpt,
  };
}

function escapeYaml(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function toMarkdown(frontmatter, bodyMarkdown) {
  const fm = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      fm.push(`${key}: [${value.map((v) => `"${escapeYaml(v)}"`).join(', ')}]`);
      continue;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      fm.push(`${key}: ${value}`);
      continue;
    }
    fm.push(`${key}: "${escapeYaml(value)}"`);
  }

  return `---\n${fm.join('\n')}\n---\n\n${bodyMarkdown}\n`;
}

async function writeEntry(collection, slugPath, frontmatter, bodyHtml) {
  const targetDir = path.join(CONTENT_DIR, collection, path.dirname(slugPath));
  await mkdir(targetDir, { recursive: true });
  const filePath = path.join(CONTENT_DIR, collection, `${slugPath}.md`);
  const payload = toMarkdown(frontmatter, `<div class="mirror-html-content">\n${bodyHtml}\n</div>`);
  await writeFile(filePath, payload, 'utf8');
}

function classifyRoute(route) {
  if (route.startsWith('blog/')) return { collection: 'blog', slug: route.replace(/^blog\//, '') };
  if (route === 'blog') return { collection: 'blog', slug: 'index' };
  if (route.startsWith('review/')) return { collection: 'review', slug: route.replace(/^review\//, '') };
  if (route === 'review') return { collection: 'review', slug: 'index' };
  if (route === 'disposable') return { collection: 'products', slug: 'disposable/index', family: 'disposable', kind: 'category' };
  if (route.startsWith('disposable/')) {
    return {
      collection: 'products',
      slug: route,
      family: 'disposable',
      kind: 'detail',
    };
  }
  if (route === 'pod-sys') return { collection: 'products', slug: 'pod-sys/index', family: 'pod-sys', kind: 'category' };
  if (ROOT_LEVEL_PAGES.has(route)) return { collection: 'pages', slug: route === '' ? 'home' : route };
  return { collection: 'pages', slug: route };
}

async function main() {
  await rm(path.join(CONTENT_DIR, 'blog'), { recursive: true, force: true });
  await rm(path.join(CONTENT_DIR, 'review'), { recursive: true, force: true });
  await rm(path.join(CONTENT_DIR, 'products'), { recursive: true, force: true });
  await rm(path.join(CONTENT_DIR, 'pages'), { recursive: true, force: true });

  const pages = await collectIndexPages(MIRROR_DIR);

  for (const page of pages) {
    const parsed = parseHtml(await readFile(page.filePath, 'utf8'));
    const cls = classifyRoute(page.route);
    const frontmatter = {
      title: parsed.title || page.route || 'ANTBAR',
      slug: page.route,
      description: parsed.description,
      excerpt: parsed.excerpt,
      heroImage: parsed.firstImage,
      family: cls.family,
      kind: cls.kind,
    };
    await writeEntry(cls.collection, cls.slug, frontmatter, parsed.bodyInner);
  }

  console.log(`Extracted ${pages.length} pages into src/content collections.`);
}

await main();
