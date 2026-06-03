import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const ORIGIN = 'https://antbar.com';

const REQUIRED_ASSETS = [
  '/wp-content/plugins/elementor/assets/js/counter.12335f45aaa79d244f24.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/nested-carousel.db797a097fdc5532ef4a.bundle.min.js',
  '/wp-content/plugins/elementor/assets/js/video.86d44e46e43d0807e708.bundle.min.js',
  '/wp-content/uploads/2024/10/Poppins-Bold.ttf',
  '/wp-content/uploads/2024/10/Poppins-Light.ttf',
  '/wp-content/uploads/elementor/google-fonts/fonts/poppins-4348c405.woff2',
  '/wp-content/plugins/elementor/assets/css/conditionals/dialog.min.css',
  '/wp-content/plugins/elementor-pro/assets/js/form.71055747203b48a65a24.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/popup.f7b15b2ca565b152bf98.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/0726b2d81686a5392236.bundle.min.js',
  '/wp-content/plugins/elementor-pro/assets/js/table-of-contents.3be1ab725f562d10dd86.bundle.min.js',
  '/wp-content/uploads/elementor/css/post-1075.css',
  '/wp-content/uploads/elementor/css/post-1077.css',
  '/wp-content/uploads/elementor/css/post-1441.css',
  '/wp-content/uploads/2024/10/kt800-vape-with-vibrant-lanyard.png',
  '/wp-content/uploads/2024/10/antbar-kt800-vape-review.png',
  '/wp-content/uploads/2024/10/kt800-vape-Package-Specifications.png',
  '/wp-content/uploads/2024/10/kt800-vape-Product-Certification.png',
  '/wp-content/uploads/2024/03/JOIN-OUR.jpg',
  '/wp-content/uploads/2024/04/%E7%AC%AC1%E4%B8%AA.jpg',
  '/wp-content/uploads/2024/04/%E7%AC%AC2%E4%B8%AA.jpg',
  '/wp-content/uploads/2024/04/%E7%AC%AC3%E4%B8%AA.jpg',
  '/wp-content/uploads/2024/04/%E7%AC%AC4%E4%B8%AA.jpg',
];

const ASSET_PATTERNS = [
  /https?:\/\/(?:www\.)?antbar\.com(\/(?:wp-content|wp-includes)\/[^\s"'<>]+)/gi,
  /["'](\/(?:wp-content|wp-includes)\/[^"'?#]+)["']/gi,
  /url\(["']?(\/(?:wp-content|wp-includes)\/[^"')]+)["']?\)/gi,
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectTextFiles(dirPath, files = []) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      await collectTextFiles(fullPath, files);
      continue;
    }
    if (/\.(html|md|css)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function cleanAssetPath(rawPath) {
  let assetPath = rawPath.trim();
  if (!assetPath.startsWith('/')) return null;
  assetPath = assetPath.split('?')[0].split('#')[0];
  if (assetPath.includes(',')) return null;
  if (assetPath.includes(' ')) return null;
  if (assetPath.endsWith('/') || assetPath.endsWith('*')) return null;
  if (!/^\/(?:wp-content|wp-includes)\//.test(assetPath)) return null;
  return assetPath;
}

function extractAssetPaths(text) {
  const paths = new Set();
  for (const pattern of ASSET_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const assetPath = cleanAssetPath(match[1]);
      if (assetPath) paths.add(assetPath);
    }
  }

  for (const match of text.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) {
      const urlPart = candidate.trim().split(/\s+/)[0];
      const assetPath = cleanAssetPath(
        urlPart.replace(/https?:\/\/(?:www\.)?antbar\.com/i, ''),
      );
      if (assetPath) paths.add(assetPath);
    }
  }

  return paths;
}

async function downloadAsset(assetPath) {
  const localPath = path.join(PUBLIC_DIR, assetPath.replace(/^\//, ''));
  if (await exists(localPath)) return 'skip';

  const url = `${ORIGIN}${encodeURI(assetPath)}`;
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'antbarweb-asset-sync/1.0' },
  });
  if (!response.ok) {
    console.warn(`Missing (${response.status}): ${assetPath}`);
    return 'fail';
  }

  await mkdir(path.dirname(localPath), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(localPath, buffer);
  console.log(`Downloaded ${assetPath}`);
  return 'ok';
}

const scanDirs = [
  path.join(ROOT, 'mirror'),
  path.join(ROOT, 'src', 'content'),
];
const files = (await Promise.all(scanDirs.map((dir) => collectTextFiles(dir)))).flat();
const assetPaths = new Set(REQUIRED_ASSETS);

for (const filePath of files) {
  const text = await readFile(filePath, 'utf8');
  for (const assetPath of extractAssetPaths(text)) {
    assetPaths.add(assetPath);
  }
}

let ok = 0;
let skipped = 0;
let failed = 0;

for (const assetPath of [...assetPaths].sort()) {
  const result = await downloadAsset(assetPath);
  if (result === 'ok') ok += 1;
  else if (result === 'skip') skipped += 1;
  else failed += 1;
}

console.log(`Asset sync done: ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
