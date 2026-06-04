#!/usr/bin/env node
/**
 * Concatenate product detail page JS assets into a local bundle.
 * Run: node scripts/bundle-product-shell.mjs
 * Outputs: public/assets/product-shell-bundle.js
 *
 * Lighter than article-shell-bundle.js — no posts, form, TOC, or jQuery Migrate.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OUT_DIR = join(PUBLIC, 'assets');

const JS_PARTS = [
  { type: 'file', path: 'wp-includes/js/jquery/jquery.min.js' },
  { type: 'file', path: 'wp-content/themes/hello-elementor/assets/js/hello-frontend.js' },
  { type: 'file', path: 'wp-content/plugins/elementor/assets/js/webpack.runtime.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor/assets/js/frontend-modules.min.js' },
  { type: 'file', path: 'wp-includes/js/jquery/ui/core.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor/assets/js/frontend.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js' },
  { type: 'file', path: 'wp-includes/js/imagesloaded.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js' },
  { type: 'file', path: 'wp-includes/js/dist/hooks.min.js' },
  { type: 'file', path: 'wp-includes/js/dist/i18n.min.js' },
  {
    type: 'inline',
    label: 'wp-i18n-js-after',
    content:
      "wp.i18n&&wp.i18n.setLocaleData({ 'text direction\\u0004ltr': ['ltr'] });",
  },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/frontend.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js' },
];

async function readIfExists(relativePath) {
  const filePath = join(PUBLIC, relativePath);
  await access(filePath);
  return readFile(filePath, 'utf8');
}

async function buildJsBundle() {
  let output = '/* Product shell JS bundle — auto-generated. Do not edit. */\n';

  for (const part of JS_PARTS) {
    if (part.type === 'inline') {
      output += `\n/* ${part.label} */\n;${part.content}\n`;
      console.log(`  js  ✓ ${part.label}`);
      continue;
    }

    try {
      const content = await readIfExists(part.path);
      output += `\n/* ${part.path} */\n;${content}\n`;
      console.log(`  js  ✓ ${part.path}`);
    } catch {
      console.warn(`  js  ✗ missing: ${part.path}`);
    }
  }

  return output;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const js = await buildJsBundle();
  const jsOut = join(OUT_DIR, 'product-shell-bundle.js');

  await writeFile(jsOut, js, 'utf8');

  console.log(`\nDone: ${jsOut} (${(Buffer.byteLength(js) / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
