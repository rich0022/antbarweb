#!/usr/bin/env node
/**
 * Purge Elementor post CSS files by removing rules that reference element IDs
 * not present in the built HTML. Writes trimmed versions to public/
 * so bundle-page.mjs picks them up.
 *
 * Usage: node scripts/purge-post-css.mjs
 * Reads each post CSS from PAGE_CSS_MAP, checks against ALL built HTML pages,
 * removes rules with IDs that never appear anywhere.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const DIST = join(ROOT, 'dist');

const PAGE_CSS_MAP = {
  disposable: ['post-1075.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  'pod-sys': ['post-1077.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  verification: ['post-950.css'],
};

// These post CSS files are shared across many pages (header, footer, popups, kit).
// Collect ALL element IDs from ALL built HTML pages to determine which rules to keep.
const SHARED_POSTS = ['post-305.css', 'post-49.css', 'post-68.css', 'post-2978.css', 'post-1146.css', 'post-1132.css'];

async function collectAllHtmlIds() {
  const ids = new Set();

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'assets' && entry.name !== 'scripts' && !entry.name.startsWith('_')) {
          await walk(full);
        }
      } else if (entry.name === 'index.html') {
        const html = await readFile(full, 'utf8');
        for (const m of html.matchAll(/data-id="([^"]+)"/g)) ids.add(m[1]);
        for (const m of html.matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
      }
    }
  }

  await walk(DIST);
  return ids;
}

function parsePostCssRules(css) {
  const rules = [];
  const re = /([^{]+)\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    const selector = match[1].trim();
    rules.push({ selector, body: match[2], raw: match[0] });
  }
  return rules;
}

function ruleMatchesHtml(rule, validIds) {
  const idMatches = [...rule.selector.matchAll(/elementor-element-([a-f0-9]+)/g)].map((m) => m[1]);
  if (idMatches.length === 0) {
    // No element IDs in this rule — keep it (container-level, media queries, etc.)
    return true;
  }
  return idMatches.some((id) => validIds.has(id));
}

async function purgePostCss(fileName, validIds) {
  // Resolve path
  let filePath;
  if (existsSync(join(PUBLIC, 'wp-content', 'uploads', 'elementor', 'css', fileName))) {
    filePath = join(PUBLIC, 'wp-content', 'uploads', 'elementor', 'css', fileName);
  } else if (existsSync(join(PUBLIC, fileName))) {
    filePath = join(PUBLIC, fileName);
  } else {
    return null; // file doesn't exist (e.g., missing widget CSS)
  }

  const css = await readFile(filePath, 'utf8');
  const rules = parsePostCssRules(css);
  const originalSize = Buffer.byteLength(css);

  const kept = rules.filter((r) => ruleMatchesHtml(r, validIds));
  const removed = rules.length - kept.length;

  if (removed === 0) return { fileName, originalSize, newSize: originalSize, removed: 0 };

  const output = kept.map((r) => r.raw).join('');
  await writeFile(filePath, output, 'utf8');
  const newSize = Buffer.byteLength(output);

  return { fileName, originalSize, newSize, removed, totalRules: rules.length };
}

async function main() {
  console.log('Collecting element IDs from all built pages...');
  const validIds = await collectAllHtmlIds();
  console.log(`  Found ${validIds.size} unique element IDs across all pages.`);

  // Collect all unique post CSS files
  const allFiles = new Set([...SHARED_POSTS]);
  for (const files of Object.values(PAGE_CSS_MAP)) {
    for (const f of files) {
      if (f.startsWith('post-') && f.endsWith('.css')) {
        allFiles.add(f);
      }
    }
  }

  console.log(`\nProcessing ${allFiles.size} post CSS files...`);
  const results = [];
  for (const fileName of allFiles) {
    const result = await purgePostCss(fileName, validIds);
    if (result) results.push(result);
  }

  let totalSaved = 0;
  console.log('\nResults:');
  for (const r of results.sort((a, b) => (b.originalSize - b.newSize) - (a.originalSize - a.newSize))) {
    const saved = r.originalSize - r.newSize;
    totalSaved += saved;
    const pct = ((saved / r.originalSize) * 100).toFixed(0);
    const info = r.removed > 0 ? `-${(saved/1024).toFixed(0)}KB (${pct}%)` : 'unchanged';
    console.log(`  ${r.fileName}: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.newSize/1024).toFixed(0)}KB ${info} — ${r.removed}/${r.totalRules} rules removed`);
  }
  console.log(`\nTotal saved: ${(totalSaved/1024).toFixed(0)}KB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
