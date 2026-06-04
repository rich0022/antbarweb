#!/usr/bin/env node
/**
 * Analyze a CSS file against a built HTML page.
 * Reports which CSS rules have matching elements.
 * Usage: node scripts/analyze-css.mjs <dist-page-dir> <css-file>
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');

const pageDir = process.argv[2];
const cssFileName = process.argv[3];

if (!pageDir || !cssFileName) {
  console.error('Usage: node scripts/analyze-css.mjs <page-dir> <css-file>');
  process.exit(1);
}

async function main() {
  const htmlPath = join(DIST, pageDir, 'index.html');
  const cssPath = join(DIST, 'assets', cssFileName);

  let html, css;
  try {
    html = await readFile(htmlPath, 'utf8');
    css = await readFile(cssPath, 'utf8');
  } catch (e) {
    console.error('Error reading files:', e.message);
    process.exit(1);
  }

  const classesInHtml = new Set();
  const idsInHtml = new Set();
  const tagsInHtml = new Set();

  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    m[1].split(/\s+/).forEach((c) => c && classesInHtml.add(c));
  }
  for (const m of html.matchAll(/id="([^"]*)"/g)) {
    idsInHtml.add(m[1]);
  }
  for (const m of html.matchAll(/<(\w+)[\s>]/g)) {
    tagsInHtml.add(m[1].toLowerCase());
  }

  const SAFELIST = new Set([
    'elementor-invisible', 'elementor-animated', 'fadeIn', 'fadeInUp', 'fadeInLeft',
    'fadeInRight', 'slideInDown', 'elementor-animation-grow', 'animated',
    'swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev',
    'swiper-pagination-bullet-active', 'is-open', 'is-active', 'e-active', 'active',
    'elementor-sticky--effects', 'e-load-more-pagination-loading', 'e-load-more-pagination-end',
    'elementor-fit-height', 'swiper-initialized', 'elementor-button-content-wrapper',
    'e-n-menu-title-text', 'e-n-menu-dropdown-icon-opened', 'e-n-menu-dropdown-icon-closed',
    'home-dialog-open',
  ]);

  const DYNAMIC_PATTERNS = [
    ':hover', ':focus', ':active', ':visited', ':focus-visible', ':focus-within',
    ':before', ':after', '::before', '::after',
    ':first-child', ':last-child', ':nth-child',
    ':not(', ':is(', ':where(', ':has(',
    '[hidden]', '[aria-', '[data-', '[type=', '[role=',
    '.elementor-invisible', '.elementor-animated',
    '.is-open', '.is-active', '.e-active', '.active',
    '.e-load-more', 'elementor-sticky',
  ];

  const rulePattern = /([^{]+)\{([^}]+)\}/g;
  let match;
  const rules = [];
  while ((match = rulePattern.exec(css)) !== null) {
    const selectors = match[1].split(',').map((s) => s.trim());
    rules.push({ selectors, body: match[2], raw: match[0] });
  }

  const totalSize = css.length;

  function parseSelector(sel) {
    const base = sel
      .replace(/::?[a-zA-Z-]+(\s*\([^)]*\))?/g, ' ')
      .replace(/:[\w-]+(\s*\([^)]*\))?/g, ' ')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/[>.~+*]/g, ' ')
      .trim();

    return {
      classes: [...base.matchAll(/\.([\w-]+)/g)].map((m) => m[1]),
      ids: [...base.matchAll(/#([\w-]+)/g)].map((m) => m[1]),
      tags: [...base.matchAll(/(?:^|\s)([a-z][a-z0-9]*)/gi)]
        .map((m) => m[1].toLowerCase())
        .filter((t) => /^[a-z]+$/.test(t)),
    };
  }

  function matches(sel) {
    if (!sel || sel.startsWith('@')) return true;
    if (sel === '*' || sel === 'html' || sel === 'body') return true;
    if (sel.includes('@keyframes') || sel.includes('@font-face')) return true;

    for (const p of DYNAMIC_PATTERNS) {
      if (sel.includes(p)) return true;
    }

    const { classes, ids, tags } = parseSelector(sel);

    if (classes.length > 0) {
      if (!classes.every((c) => classesInHtml.has(c) || SAFELIST.has(c))) return false;
    }
    if (ids.length > 0) {
      if (!ids.every((i) => idsInHtml.has(i))) return false;
    }
    if (classes.length === 0 && ids.length === 0 && tags.length > 0) {
      return tags.some((t) => tagsInHtml.has(t));
    }
    return true;
  }

  const matched = [];
  const unmatched = [];
  for (const rule of rules) {
    if (rule.selectors.some((s) => matches(s))) matched.push(rule);
    else unmatched.push(rule);
  }

  const byFile = {};
  for (const rule of unmatched) {
    for (const sel of rule.selectors) {
      const cls = sel.match(/\.(elementor-\d+|wp-[\w-]+)/);
      const key = cls ? cls[1] : 'generic';
      byFile[key] = (byFile[key] || 0) + rule.raw.length;
      break;
    }
  }

  const unmatchedSize = unmatched.reduce((sum, r) => sum + r.raw.length, 0);

  console.log(`CSS: ${cssFileName} (${(totalSize/1024).toFixed(0)}KB total)`);
  console.log(`Rules: ${rules.length} total, ${matched.length} matched, ${unmatched.length} unmatched`);
  console.log(`Savable: ${(unmatchedSize/1024).toFixed(0)}KB (${((unmatchedSize/totalSize)*100).toFixed(1)}%)`);
  console.log(`\nTop unmatched sources:`);
  const sorted = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [key, size] of sorted) {
    console.log(`  ${key}: ${(size/1024).toFixed(1)}KB`);
  }

  // Sample of unmatched class-based selectors
  const classBased = unmatched.filter((r) =>
    r.selectors.some((s) => parseSelector(s).classes.length > 0)
  );
  console.log(`\nSample unmatched class selectors (${classBased.length} rules):`);
  classBased.slice(0, 30).forEach((r) => {
    console.log(`  ${r.selectors.join(', ').slice(0, 160)}`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
