#!/usr/bin/env node
/**
 * Concatenate the shared single-article CSS/JS assets into local bundles.
 * Run: node scripts/bundle-article-shell.mjs
 * Outputs:
 *   - public/assets/article-shell-bundle.css
 *   - public/assets/article-shell-bundle.js
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OUT_DIR = join(PUBLIC, 'assets');

const CSS_FILES = [
  'wp-content/themes/hello-elementor/assets/css/reset.css',
  'wp-content/themes/hello-elementor/assets/css/theme.css',
  'wp-content/themes/hello-elementor/assets/css/header-footer.css',
  'wp-content/plugins/elementor/assets/css/frontend.min.css',
  'wp-content/uploads/elementor/css/post-305.css',
  'wp-content/plugins/elementor/assets/css/widget-image.min.css',
  'wp-content/plugins/elementor/assets/css/widget-icon-list.min.css',
  'wp-content/plugins/elementor/assets/css/widget-heading.min.css',
  'wp-content/plugins/elementor/assets/css/widget-divider.min.css',
  'wp-content/plugins/elementor/assets/css/widget-social-icons.min.css',
  'wp-content/plugins/elementor/assets/css/widget-nested-accordion.min.css',
  'wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css',
  'wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-form.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-table-of-contents.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css',
  'wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-search-form.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInRight.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/slideInDown.min.css',
  'wp-content/uploads/elementor/css/post-49.css',
  'wp-content/uploads/elementor/css/post-68.css',
  'wp-content/uploads/elementor/css/post-2978.css',
  'wp-content/uploads/elementor/css/post-1132.css',
  'wp-content/uploads/elementor/css/post-1146.css',
  'wp-content/uploads/elementor/css/post-3997.css',
  'wp-content/uploads/elementor/css/post-4120.css',
  'wp-content/uploads/elementor/css/post-4326.css',
  'wp-content/uploads/elementor/google-fonts/css/poppins.css',
  'wp-content/uploads/elementor/google-fonts/css/roboto.css',
  'wp-content/uploads/elementor/google-fonts/css/robotoslab.css',
];

const JS_PARTS = [
  { type: 'file', path: 'wp-includes/js/jquery/jquery.min.js' },
  { type: 'file', path: 'wp-includes/js/jquery/jquery-migrate.min.js' },
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
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/posts.aec59265318492b89cb5.bundle.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/form.71055747203b48a65a24.bundle.min.js' },
  { type: 'file', path: 'wp-content/plugins/elementor-pro/assets/js/table-of-contents.3be1ab725f562d10dd86.bundle.min.js' },
];

async function readIfExists(relativePath) {
  const filePath = join(PUBLIC, relativePath);
  await access(filePath);
  return readFile(filePath, 'utf8');
}

async function buildCssBundle() {
  let output = '/* Article shell CSS bundle — auto-generated. Do not edit. */\n';

  for (const file of CSS_FILES) {
    try {
      const content = await readIfExists(file);
      output += `\n/* ${file} */\n${content}\n`;
      console.log(`  css ✓ ${file}`);
    } catch {
      console.warn(`  css ✗ missing: ${file}`);
    }
  }

  return output;
}

async function buildJsBundle() {
  let output = '/* Article shell JS bundle — auto-generated. Do not edit. */\n';

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

  const [css, js] = await Promise.all([buildCssBundle(), buildJsBundle()]);
  const cssOut = join(OUT_DIR, 'article-shell-bundle.css');
  const jsOut = join(OUT_DIR, 'article-shell-bundle.js');

  await writeFile(cssOut, css, 'utf8');
  await writeFile(jsOut, js, 'utf8');

  console.log(`\nDone: ${cssOut} (${(Buffer.byteLength(css) / 1024).toFixed(0)} KB)`);
  console.log(`Done: ${jsOut} (${(Buffer.byteLength(js) / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
