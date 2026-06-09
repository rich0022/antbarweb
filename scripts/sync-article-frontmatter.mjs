import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const MIRROR_DIR = path.join(ROOT, 'mirror');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');

const MISSING_ARTICLES = [
  { collection: 'blog', slug: 'global-vape-regulations-update-in-2024-8-countries-or-territories' },
  { collection: 'blog', slug: 'how-about-vaping-prescription-in-australia' },
  { collection: 'blog', slug: 'what-are-the-top-10-popular-and-least-harmful-disposable-vapes' },
  { collection: 'review', slug: 'antbar-the-pop-disposable-vape-review-kt800' },
];

function escapeYaml(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function parseMirrorMeta(html) {
  const title =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ??
    '';
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    '';
  const heroImage =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? '';
  const publishedAt = html.match(/<time>([^<]+)<\/time>/i)?.[1]?.trim() ?? '';
  const excerpt = description || title;
  return { title, description, heroImage, publishedAt, excerpt };
}

function extractBalancedDiv(html, startIndex) {
  const openStart = html.indexOf('<div', startIndex);
  if (openStart === -1) return null;
  const openEnd = html.indexOf('>', openStart);
  if (openEnd === -1) return null;
  const tagPattern = /<\/?div\b[^>]*>/gi;
  tagPattern.lastIndex = openEnd + 1;
  let depth = 1;
  for (let match = tagPattern.exec(html); match; match = tagPattern.exec(html)) {
    if (match[0].startsWith('</div')) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return {
        inner: html.slice(openEnd + 1, match.index),
      };
    }
  }
  return null;
}

function extractArticleBody(html) {
  const wpPostMatch = html.match(/<div\b[^>]*data-elementor-type=["']wp-post["'][^>]*>/i);
  if (!wpPostMatch || wpPostMatch.index === undefined) return '';
  const wpPost = extractBalancedDiv(html, wpPostMatch.index);
  if (!wpPost) return '';
  const innerWrapperMatch = wpPost.inner.match(/<div\b[^>]*\be-parent\b[^>]*>/i);
  if (!innerWrapperMatch || innerWrapperMatch.index === undefined) return wpPost.inner.trim();
  const innerWrapper = extractBalancedDiv(wpPost.inner, innerWrapperMatch.index);
  const body = innerWrapper?.inner ?? wpPost.inner;
  const textWidgetMatch = body.match(
    /<div\b[^>]*data-widget_type=["']text-editor\.default["'][^>]*>[\s\S]*?<div class="elementor-widget-container">([\s\S]*?)<\/div>/i,
  );
  return (textWidgetMatch?.[1] ?? body).trim();
}

function htmlToMarkdownBody(html) {
  return html
    .replace(/<h2([^>]*)>/gi, '\n\n## ')
    .replace(/<\/h2>/gi, '\n\n')
    .replace(/<h3([^>]*)>/gi, '\n\n### ')
    .replace(/<\/h3>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, '\n\n![]($1)\n\n')
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function upsertFrontmatterField(raw, key, value) {
  if (!value) return raw;
  const match = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) return raw;
  const [, open, frontmatter, close, body] = match;
  const lines = frontmatter.split(/\r?\n/).filter((line) => !line.startsWith(`${key}:`));
  lines.push(`${key}: "${escapeYaml(value)}"`);
  return `${open}${lines.join('\n')}${close}${body}`;
}

async function listMarkdownFiles(collection) {
  const dir = path.join(CONTENT_DIR, collection);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md')).map((entry) => entry.name);
}

async function syncCollection(collection) {
  const files = await listMarkdownFiles(collection);
  for (const fileName of files) {
    if (fileName === 'index.md') continue;
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(CONTENT_DIR, collection, fileName);
    const mirrorPath = path.join(MIRROR_DIR, collection, slug, 'index.html');
    let raw = await readFile(filePath, 'utf8');
    if (raw.includes('publishedAt:')) continue;
    try {
      const html = await readFile(mirrorPath, 'utf8');
      const { publishedAt } = parseMirrorMeta(html);
      if (!publishedAt) continue;
      raw = upsertFrontmatterField(raw, 'publishedAt', publishedAt);
      await writeFile(filePath, raw, 'utf8');
      console.log(`Updated ${collection}/${fileName} publishedAt=${publishedAt}`);
    } catch {
      console.warn(`Skip ${collection}/${fileName}: mirror missing`);
    }
  }
}

async function createMissingArticle({ collection, slug }) {
  const filePath = path.join(CONTENT_DIR, collection, `${slug}.md`);
  try {
    await readFile(filePath, 'utf8');
    console.log(`Exists ${collection}/${slug}.md`);
    return;
  } catch {
    // create
  }

  const html = await readFile(path.join(MIRROR_DIR, collection, slug, 'index.html'), 'utf8');
  const meta = parseMirrorMeta(html);
  const body = htmlToMarkdownBody(extractArticleBody(html));
  const frontmatter = {
    title: meta.title,
    slug: `${collection}/${slug}`,
    description: meta.description,
    excerpt: meta.excerpt,
    heroImage: meta.heroImage,
    publishedAt: meta.publishedAt,
  };

  const fm = Object.entries(frontmatter)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: "${escapeYaml(value)}"`)
    .join('\n');

  await writeFile(filePath, `---\n${fm}\n---\n\n${body}\n`, 'utf8');
  console.log(`Created ${collection}/${slug}.md`);
}

await syncCollection('blog');
await syncCollection('review');
for (const article of MISSING_ARTICLES) {
  await createMissingArticle(article);
}
