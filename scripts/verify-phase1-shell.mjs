#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { existsSync } from 'node:fs';

const ROOT = join(import.meta.dirname, '..');
const DIST_CANDIDATES = [join(ROOT, 'dist', 'client'), join(ROOT, 'dist')];
const DIST = DIST_CANDIDATES.find((dir) => existsSync(join(dir, 'index.html'))) ?? DIST_CANDIDATES[0];

const SAMPLE_PAGES = [
  'index.html',
  'contact/index.html',
  'blog/index.html',
  'blog/what-is-pmta/index.html',
  'review/index.html',
  'disposable/disposable/antbar-ag600/index.html',
  'disposable/antbar-ag600/index.html',
  'support/index.html',
];

async function collectHtmlFiles(dirPath, files = []) {
  let entries;
  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await collectHtmlFiles(fullPath, files);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function auditHtml(relativePath, html) {
  const issues = [];

  const shellAssignments = countMatches(
    html,
    /__antbarSiteShellInitialized\s*=\s*(?:!0|true)/g,
  );
  if (shellAssignments !== 1) {
    issues.push(`expected 1 shell init assignment, found ${shellAssignments}`);
  }

  for (const [label, pattern] of [
    ['age', /id="elementor-popup-modal-1146"/g],
    ['menu', /id="elementor-popup-modal-2978"/g],
    ['search', /id="elementor-popup-modal-1132"/g],
  ]) {
    const count = countMatches(html, pattern);
    if (count !== 1) {
      issues.push(`expected 1 ${label} dialog, found ${count}`);
    }
  }

  if (html.includes('function setPop')) {
    issues.push('legacy setPop() shell script still present');
  }

  if (html.includes('$("#hMenu").click') || html.includes("$('#hMenu').click")) {
    issues.push('legacy jQuery hMenu handler still present');
  }

  const hasPopUpsTrue = countMatches(html, /hasPopUps":(?:true|!0)/g);
  if (hasPopUpsTrue > 0) {
    issues.push(`Elementor popup runtime enabled (${hasPopUpsTrue})`);
  }

  if (!html.includes('id="hMenu"') || !html.includes('data-age-accept')) {
    issues.push('missing unified shell header/popup markup');
  }

  return issues;
}

async function main() {
  const allHtml = await collectHtmlFiles(DIST);
  if (allHtml.length === 0) {
    console.error('No dist HTML found. Run `npm run build` first.');
    process.exit(1);
  }

  let failures = 0;

  console.log(`Auditing ${allHtml.length} built pages from ${DIST}...\n`);

  for (const relative of SAMPLE_PAGES) {
    const filePath = join(DIST, relative);
    let html;
    try {
      html = await readFile(filePath, 'utf8');
    } catch {
      console.log(`SKIP  ${relative} (not built)`);
      continue;
    }

    const issues = auditHtml(relative, html);
    if (issues.length === 0) {
      console.log(`PASS  ${relative}`);
      continue;
    }

    failures += issues.length;
    console.log(`FAIL  ${relative}`);
    for (const issue of issues) {
      console.log(`      - ${issue}`);
    }
  }

  const legacyPages = [];
  for (const filePath of allHtml) {
    const html = await readFile(filePath, 'utf8');
    if (html.includes('function setPop') || html.includes('$("#hMenu").click')) {
      legacyPages.push(filePath.slice(DIST.length + 1));
    }
  }

  if (legacyPages.length > 0) {
    failures += legacyPages.length;
    console.log('\nLegacy shell scripts found on:');
    for (const page of legacyPages.slice(0, 10)) {
      console.log(`  - ${page}`);
    }
    if (legacyPages.length > 10) {
      console.log(`  ... and ${legacyPages.length - 10} more`);
    }
  }

  if (failures > 0) {
    console.log(`\nPhase 1 shell verification failed (${failures} issue(s)).`);
    process.exit(1);
  }

  console.log('\nPhase 1 shell verification passed.');
}

main();
