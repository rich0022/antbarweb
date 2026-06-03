import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  normalizeMirrorHtml,
  normalizeMirrorUrl,
  shouldSkipMirrorScript,
} from './mirror-urls';

export type MirrorScript = {
  src?: string;
  inline?: string;
};

export type MirrorHeadAssets = {
  stylesheets: string[];
  inlineStyles: string[];
  bodyClass: string;
  headScripts: MirrorScript[];
  footerScripts: MirrorScript[];
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
/** Mirrored page HTML (not served as static files — avoids shadowing Astro routes). */
export const MIRROR_HTML_DIR = path.join(process.cwd(), 'mirror');

let sharedStylesheets: string[] | null = null;

function isHaContsScript(script: MirrorScript): boolean {
  return Boolean(script.inline?.includes('#haConts') || script.inline?.includes('haConts'));
}

function orderFooterScripts(scripts: MirrorScript[]): MirrorScript[] {
  const deferred: MirrorScript[] = [];
  const ordered: MirrorScript[] = [];
  for (const script of scripts) {
    if (isHaContsScript(script)) deferred.push(script);
    else ordered.push(script);
  }
  return [...ordered, ...deferred];
}

async function filterExistingAssetPaths(paths: string[]): Promise<string[]> {
  const existing: string[] = [];
  for (const assetPath of paths) {
    const localPath = path.join(PUBLIC_DIR, assetPath.replace(/^\//, '').split('?')[0]);
    try {
      await access(localPath);
      existing.push(assetPath);
    } catch {
      // skip missing mirror files
    }
  }
  return existing;
}

export function mirrorHtmlPath(route: string): string {
  const normalized = route.replace(/\/index$/, '');
  if (!normalized) return path.join(MIRROR_HTML_DIR, 'index.html');
  return path.join(MIRROR_HTML_DIR, normalized, 'index.html');
}

function parseScriptTag(tag: string): MirrorScript | null {
  const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
  const inline = tag.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim();
  if (src) return { src };
  if (inline) return { inline };
  return null;
}

function parseScripts(html: string): MirrorScript[] {
  const scripts: MirrorScript[] = [];
  for (const match of html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)) {
    const parsed = parseScriptTag(match[0]);
    if (parsed) scripts.push(parsed);
  }
  return scripts;
}

function parseHeadAssets(html: string): MirrorHeadAssets {
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  const stylesheets = [
    ...head.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi),
  ].map((match) => match[1]);

  const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  const bodyClass = html.match(/<body[^>]*class=["']([^"']*)["']/i)?.[1] ?? '';

  const allScripts = parseScripts(html);
  const headScriptTags = [...head.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map((m) => m[0]);
  const headScripts = headScriptTags
    .map((tag) => parseScriptTag(tag))
    .filter((s): s is MirrorScript => Boolean(s));

  const bodyScriptTags = [...body.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map((m) => m[0]);
  const footerScripts = bodyScriptTags
    .map((tag) => parseScriptTag(tag))
    .filter((s): s is MirrorScript => Boolean(s));

  // Fallback: if body scripts empty, use scripts not in head (by position in full html)
  const footerFromDiff =
    footerScripts.length > 0
      ? footerScripts
      : allScripts.filter((_, i) => i >= headScripts.length);

  return {
    stylesheets: [...new Set(stylesheets.map(normalizeMirrorUrl))],
    inlineStyles: [...new Set(inlineStyles.map(normalizeMirrorHtml))],
    bodyClass,
    headScripts: headScripts
      .filter((script) => !shouldSkipMirrorScript(script))
      .map((script) => ({
        ...script,
        src: script.src ? normalizeMirrorUrl(script.src) : undefined,
        inline: script.inline ? normalizeMirrorHtml(script.inline) : undefined,
      })),
    footerScripts: footerFromDiff
      .filter((script) => !shouldSkipMirrorScript(script))
      .map((script) => ({
        ...script,
        src: script.src ? normalizeMirrorUrl(script.src) : undefined,
        inline: script.inline ? normalizeMirrorHtml(script.inline) : undefined,
      })),
  };
}

async function collectIndexHtmlFiles(dirPath: string, routePrefix = ''): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nextPrefix = routePrefix ? `${routePrefix}/${entry.name}` : entry.name;
      files.push(...(await collectIndexHtmlFiles(fullPath, nextPrefix)));
      continue;
    }
    if (entry.isFile() && entry.name === 'index.html') {
      files.push(fullPath);
    }
  }

  return files;
}

/** Shared header/footer styles from the home mirror only (avoids blog-only post-*.css 404s). */
export async function getSharedMirrorStylesheets(): Promise<string[]> {
  if (sharedStylesheets) return sharedStylesheets;

  const html = await readFile(mirrorHtmlPath(''), 'utf8');
  const hrefs = new Set<string>();
  for (const match of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)) {
    hrefs.add(normalizeMirrorUrl(match[1]));
  }

  sharedStylesheets = await filterExistingAssetPaths([...hrefs]);
  return sharedStylesheets;
}

export async function getMirrorHeadAssets(mirrorRoute: string): Promise<MirrorHeadAssets> {
  const filePath = mirrorHtmlPath(mirrorRoute);
  let html: string;
  try {
    html = await readFile(filePath, 'utf8');
  } catch {
    html = await readFile(mirrorHtmlPath(''), 'utf8');
  }
  const pageAssets = parseHeadAssets(html);
  const sharedStylesheetsList = await getSharedMirrorStylesheets();

  const headScripts = pageAssets.headScripts.filter(
    (script) => script.src?.includes('jquery') || script.src?.includes('jquery-migrate'),
  );
  const footerScripts = orderFooterScripts([
    ...pageAssets.headScripts.filter(
      (script) => !script.src?.includes('jquery') && !script.src?.includes('jquery-migrate'),
    ),
    ...pageAssets.footerScripts,
  ]);

  const mergedStylesheets = await filterExistingAssetPaths([
    ...new Set([...pageAssets.stylesheets, ...sharedStylesheetsList].map(normalizeMirrorUrl)),
  ]);

  return {
    ...pageAssets,
    stylesheets: mergedStylesheets,
    headScripts,
    footerScripts,
  };
}

export function resolveMirrorRoute(collection: string, entryId: string): string {
  const base = entryId.replace(/\.mdx?$/, '');

  if (collection === 'pages') {
    return base === 'home' ? '' : base;
  }

  if (collection === 'products') {
    return base;
  }

  if (collection === 'blog') {
    return base === 'index' ? 'blog' : `blog/${base}`;
  }

  if (collection === 'review') {
    return base === 'index' ? 'review' : `review/${base}`;
  }

  return base;
}

export async function readMirrorBodyHtml(mirrorRoute: string): Promise<string> {
  const html = await readFile(mirrorHtmlPath(mirrorRoute), 'utf8');
  const bodyInner = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return normalizeMirrorHtml(stripScriptsFromHtml(bodyInner));
}

export function stripScriptsFromHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<div class="mirror-html-content">\s*/i, '')
    .replace(/\s*<\/div>\s*$/i, '');
}

function mirrorUrlSlug(sectionName: string, mirrorRoute: string): string {
  const relative = mirrorRoute.replace(new RegExp(`^${sectionName}/`), '');
  if (sectionName === 'disposable') {
    return relative.replace(/^disposable\//, '');
  }
  return relative;
}

async function collectMirrorRoutes(
  sectionName: string,
): Promise<Map<string, string>> {
  const sectionDir = path.join(MIRROR_HTML_DIR, sectionName);
  const routes = new Map<string, string>();

  async function scan(dirPath: string, parts: string[]) {
    let entries;
    try {
      entries = await readdir(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const nextParts = [...parts, entry.name];
      const childDir = path.join(dirPath, entry.name);
      const indexPath = path.join(childDir, 'index.html');

      try {
        await readFile(indexPath, 'utf8');
        const mirrorRoute = `${sectionName}/${nextParts.join('/')}`;
        routes.set(mirrorUrlSlug(sectionName, mirrorRoute), mirrorRoute);
      } catch {
        // no page at this folder
      }

      await scan(childDir, nextParts);
    }
  }

  await scan(sectionDir, []);
  return routes;
}

export async function collectBlogMirrorSlugs(): Promise<string[]> {
  const routes = await collectMirrorRoutes('blog');
  return [...routes.keys()].filter((slug) => slug !== 'index');
}

export async function collectReviewMirrorRoutes(): Promise<Map<string, string>> {
  return collectMirrorRoutes('review');
}

export async function collectDisposableMirrorRoutes(): Promise<Map<string, string>> {
  return collectMirrorRoutes('disposable');
}

export async function collectPodSysMirrorRoutes(): Promise<Map<string, string>> {
  return collectMirrorRoutes('pod-sys');
}
