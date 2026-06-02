import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ORIGINS = ['https://www.antbar.com', 'https://antbar.com'];
const SITEMAP_URL = `${ORIGINS[0]}/sitemap.xml`;
const EXTRA_PAGE_URLS = ['/blog/', '/review/'];
const REQUIRED_ASSETS = [
  '/wp-content/uploads/elementor/google-fonts/fonts/poppins-ae4d1a33.woff2',
  '/wp-content/uploads/elementor/google-fonts/fonts/poppins-3a2ac464.woff2',
  '/wp-content/uploads/elementor/google-fonts/fonts/poppins-e215b6a9.woff2',
  '/wp-content/uploads/elementor/google-fonts/fonts/poppins-95fdc599.woff2',
  '/wp-content/uploads/elementor/google-fonts/fonts/roboto-fb5169d9.woff2',
  '/wp-content/uploads/2024/10/Poppins-Regular.ttf',
  '/wp-content/uploads/2024/10/Poppins-SemiBold.ttf',
  '/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js',
  '/wp-content/plugins/elementor/assets/js/shared-frontend-handlers.03caa53373b56d3bab67.bundle.min.js',
  '/wp-content/plugins/elementor/assets/js/text-editor.45609661e409413f1cef.bundle.min.js',
  '/wp-content/plugins/elementor/assets/js/nested-accordion.10705241212f7b6c432b.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/mega-menu-stretch-content.480e081cebe071d683e8.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/mega-menu.82093824ddb3f5531ab4.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/menu-title-keyboard-handler.f0362773c21105d2c65c.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/posts.aec59265318492b89cb5.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/load-more.8b46f464e573feab5dd7.bundle.min.js',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5切片_01-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5-2_03-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5_29-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5-2_05-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5-9_11-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5-2_12-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-1-5_30-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-6-9-2_01-3_04-jpg.webp',
  '/wp-content/uploads/2024/06/C479-AGP12000详情-6-9-2_09-jpg.webp',
];

const HTML_EXTENSIONS = ['.html', '.htm'];
const ASSET_EXTENSIONS = [
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.avif',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
  '.mp4',
  '.webm',
  '.mp3',
  '.pdf',
  '.txt',
  '.xml',
];

const assetQueue = new Map();
const visitedAssets = new Set();

function normalizeUrl(rawUrl, baseUrl) {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('#')) {
    return null;
  }
  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

function ensureLocalPathname(urlString) {
  const url = new URL(urlString);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!path.extname(pathname)) pathname = `${pathname}/index.html`;
  return pathname.replace(/\/+/g, '/');
}

function ensureAssetPathname(urlString) {
  const url = new URL(urlString);
  return decodeURIComponent(url.pathname).replace(/\/+/g, '/');
}

function toDiskPath(publicPathname) {
  return path.join(PUBLIC_DIR, publicPathname.replace(/^\//, ''));
}

function isSameSite(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname === 'antbar.com' || url.hostname === 'www.antbar.com';
  } catch {
    return false;
  }
}

function isAssetUrl(urlString) {
  try {
    const url = new URL(urlString);
    const pathname = url.pathname.toLowerCase();
    if (pathname === '/cdn-cgi/content' || pathname.startsWith('/cdn-cgi/l/email-protection')) {
      return false;
    }
    return (
      pathname.startsWith('/wp-content/') ||
      pathname.startsWith('/wp-includes/') ||
      pathname.startsWith('/cdn-cgi/scripts/') ||
      pathname.startsWith('/cdn-cgi/challenge-platform/scripts/') ||
      pathname.startsWith('/.cloud/') ||
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      ASSET_EXTENSIONS.some((ext) => pathname.endsWith(ext))
    );
  } catch {
    return false;
  }
}

function extractUrls(content, baseUrl) {
  const found = new Set();
  const attrRegex = /\b(?:src|href|content|poster)\s*=\s*["']([^"'<>]+)["']/gi;
  const srcsetRegex = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  const cssUrlRegex = /url\((['"]?)([^'")]+)\1\)/gi;

  for (const regex of [attrRegex, srcsetRegex, cssUrlRegex]) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const value = match[1] ?? match[2];
      if (!value) continue;
      if (regex === srcsetRegex) {
        for (const part of value.split(',')) {
          const candidate = part.trim().split(/\s+/)[0];
          const normalized = normalizeUrl(candidate, baseUrl);
          if (normalized) found.add(normalized);
        }
        continue;
      }
      const normalized = normalizeUrl(value, baseUrl);
      if (normalized) found.add(normalized);
    }
  }

  return [...found];
}

function rewriteHtml(html) {
  return html
    .replaceAll('https://www.antbar.com', '')
    .replaceAll('https://antbar.com', '')
    .replaceAll('https:\\/\\/www.antbar.com', '')
    .replaceAll('https:\\/\\/antbar.com', '');
}

function rewriteCss(css) {
  return css
    .replaceAll('https://www.antbar.com', '')
    .replaceAll('https://antbar.com', '');
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithFallback(urlString, options) {
  const attempts = [urlString];
  const url = new URL(urlString);
  if (url.hostname === 'www.antbar.com') {
    attempts.push(urlString.replace('https://www.antbar.com', 'https://antbar.com'));
  } else if (url.hostname === 'antbar.com') {
    attempts.push(urlString.replace('https://antbar.com', 'https://www.antbar.com'));
  }

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt, {
        signal: AbortSignal.timeout(20000),
        ...options,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function writePublicFile(publicPathname, contents) {
  const filePath = toDiskPath(publicPathname);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents);
}

function queueAsset(urlString, source) {
  if (!isSameSite(urlString) || !isAssetUrl(urlString)) return;
  if (!assetQueue.has(urlString)) {
    assetQueue.set(urlString, { source });
  }
}

async function downloadAsset(urlString) {
  if (visitedAssets.has(urlString)) return;
  visitedAssets.add(urlString);

  const pathname = ensureAssetPathname(urlString);
  const diskPath = toDiskPath(pathname);

  if (await exists(diskPath)) {
    if (pathname.toLowerCase().endsWith('.css')) {
      const existingCss = await readFile(diskPath, 'utf8');
      for (const assetUrl of extractUrls(existingCss, urlString)) {
        queueAsset(assetUrl, `css:${pathname}`);
      }
    }
    return;
  }

  const response = await fetchWithFallback(urlString, {
    headers: { 'user-agent': 'Mozilla/5.0 Codex Mirror' },
  });
  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());

  await mkdir(path.dirname(diskPath), { recursive: true });

  if (contentType.includes('text/css') || pathname.toLowerCase().endsWith('.css')) {
    const css = rewriteCss(buffer.toString('utf8'));
    await writeFile(diskPath, css);
    for (const assetUrl of extractUrls(css, urlString)) {
      queueAsset(assetUrl, `css:${pathname}`);
    }
    return;
  }

  await writeFile(diskPath, buffer);
}

async function mirrorPage(urlString) {
  const response = await fetchWithFallback(urlString, {
    headers: { 'user-agent': 'Mozilla/5.0 Codex Mirror' },
  });
  const html = await response.text();
  const rewritten = rewriteHtml(html);
  const outputPath = ensureLocalPathname(urlString);

  await writePublicFile(outputPath, rewritten);

  for (const candidate of extractUrls(rewritten, urlString)) {
    queueAsset(candidate, `page:${outputPath}`);
  }

  return outputPath;
}

async function getSitemapUrls() {
  const response = await fetchWithFallback(SITEMAP_URL, {
    headers: { 'user-agent': 'Mozilla/5.0 Codex Mirror' },
  });
  const xml = await response.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((entry) => entry[1].trim());
  const pageUrls = new Set(matches.filter((item) => isSameSite(item)));
  for (const pathname of EXTRA_PAGE_URLS) {
    pageUrls.add(`${ORIGINS[0]}${pathname}`);
  }
  return [...pageUrls];
}

async function main() {
  console.log('Fetching sitemap...');
  const pageUrls = await getSitemapUrls();
  console.log(`Found ${pageUrls.length} routes.`);

  const extraFiles = [
    `${ORIGINS[0]}/robots.txt`,
    `${ORIGINS[0]}/sitemap.xml`,
    ...REQUIRED_ASSETS.map((asset) => `${ORIGINS[0]}${asset}`),
  ];

  console.log('Mirroring HTML pages...');
  const pageFailures = [];
  for (const pageUrl of pageUrls) {
    try {
      const saved = await mirrorPage(pageUrl);
      console.log(`  page ${saved}`);
    } catch (error) {
      pageFailures.push(pageUrl);
      console.error(`  failed page ${pageUrl}`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  for (const fileUrl of extraFiles) {
    queueAsset(fileUrl, 'special');
  }

  console.log(`Downloading ${assetQueue.size} queued assets...`);
  while (assetQueue.size > 0) {
    const entries = [...assetQueue.keys()];
    assetQueue.clear();
    for (const assetUrl of entries) {
      try {
        await downloadAsset(assetUrl);
        console.log(`  asset ${ensureAssetPathname(assetUrl)}`);
      } catch (error) {
        console.error(`  failed ${assetUrl}`);
        console.error(error instanceof Error ? error.message : error);
      }
    }
  }

  console.log('Mirror complete.');
  if (pageFailures.length > 0) {
    console.log(`Skipped ${pageFailures.length} failing pages:`);
    for (const failed of pageFailures) {
      console.log(`  ${failed}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
