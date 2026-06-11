import { rm, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const BLOCKED_MEDIA = [
  // Keep only local backup originals out of the Cloudflare bundle.
  '/wp-content/uploads/2024/07/AGP12000-479-.orig.mp4',
  '/wp-content/uploads/2024/07/C486-ok-2k.orig.mp4',
];

async function removeBlockedMedia() {
  for (const mediaPath of BLOCKED_MEDIA) {
    const diskPath = path.join(DIST_DIR, mediaPath);
    await rm(diskPath, { force: true });
  }
}

// Remove auto-generated wrangler.json — its Worker-specific fields
// ("assets", "images", "previews") break `wrangler pages deploy`.
async function removeGeneratedWranglerConfig() {
  const configPath = path.join(DIST_DIR, 'client', 'wrangler.json');
  await rm(configPath, { force: true });
}

async function listHtmlFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function verifyNoBlockedMediaReferences() {
  const htmlFiles = await listHtmlFiles(DIST_DIR);
  const violations = [];

  for (const htmlFile of htmlFiles) {
    const content = await readFile(htmlFile, 'utf8');
    for (const mediaPath of BLOCKED_MEDIA) {
      if (content.includes(mediaPath)) {
        violations.push({ htmlFile, mediaPath });
      }
    }
  }

  if (violations.length > 0) {
    const detail = violations
      .map((item) => `- ${item.htmlFile} -> ${item.mediaPath}`)
      .join('\n');
    throw new Error(
      `Found blocked media paths in dist html. Set PUBLIC_MEDIA_BASE_URL before build.\n${detail}`,
    );
  }
}

await removeBlockedMedia();
await removeGeneratedWranglerConfig();
await verifyNoBlockedMediaReferences();

console.log('Cloudflare static bundle prepared: blocked videos removed, wrangler config cleaned, and references verified.');
