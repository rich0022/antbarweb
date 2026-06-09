#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const STYLES_DIR = join(ROOT, 'src', 'styles');
const ARTICLE_ASSETS_DIR = join(PUBLIC, 'assets');

const LEGACY_SHELL_CSS = [
  'wp-content/themes/hello-elementor/assets/css/reset.css',
  'wp-content/themes/hello-elementor/assets/css/theme.css',
  'wp-content/themes/hello-elementor/assets/css/header-footer.css',
  'wp-content/plugins/elementor/assets/css/frontend.min.css',
  'wp-content/uploads/elementor/css/post-305.css',
  'wp-content/uploads/elementor/css/post-49.css',
  'wp-content/plugins/elementor/assets/css/widget-image.min.css',
  'wp-content/plugins/elementor/assets/css/widget-heading.min.css',
  'wp-content/plugins/elementor/assets/css/widget-icon-list.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css',
  'wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css',
  'wp-content/uploads/elementor/css/post-68.css',
  'wp-content/plugins/elementor/assets/css/widget-divider.min.css',
  'wp-content/plugins/elementor/assets/css/widget-nested-accordion.min.css',
  'wp-content/plugins/elementor/assets/css/widget-social-icons.min.css',
  'wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css',
  'wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-search-form.min.css',
  'wp-content/uploads/elementor/css/post-2978.css',
  'wp-content/uploads/elementor/css/post-1146.css',
  'wp-content/uploads/elementor/css/post-1132.css',
  'wp-content/uploads/elementor/google-fonts/css/poppins.css',
  'wp-content/uploads/elementor/google-fonts/css/roboto.css',
  'wp-content/uploads/elementor/google-fonts/css/robotoslab.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInRight.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInLeft.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInUp.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/slideInDown.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css',
];

const PAGE_CSS_MAP = {
  verification: ['wp-content/uploads/elementor/css/post-950.css'],
  agp12000: [
    'wp-content/uploads/elementor/css/post-3489.css',
    'wp-content/uploads/elementor/css/post-3519.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-image-box.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  kt800: [
    'wp-content/uploads/elementor/css/post-2818.css',
    'wp-content/uploads/elementor/css/post-3531.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  at800: [
    'wp-content/uploads/elementor/css/post-1972.css',
    'wp-content/uploads/elementor/css/post-3531.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  ag600: [
    'wp-content/uploads/elementor/css/post-1435.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  rocket: [
    'wp-content/uploads/elementor/css/post-1429.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  sa8000: [
    'wp-content/uploads/elementor/css/post-1360.css',
    'wp-content/uploads/elementor/css/post-3439.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  ahp10000: ['wp-content/uploads/elementor/css/post-1436.css'],
  atb600: ['wp-content/uploads/elementor/css/post-1403.css'],
};

const ARTICLE_CONTENT_CSS = [
  'wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-form.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-table-of-contents.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css',
  'wp-content/uploads/elementor/css/post-3997.css',
  'wp-content/uploads/elementor/css/post-4120.css',
  'wp-content/uploads/elementor/css/post-4326.css',
];

async function readCssFile(relativePath) {
  const filePath = join(PUBLIC, relativePath);
  await access(filePath);
  const content = await readFile(filePath, 'utf8');
  return `\n/* ${relativePath} */\n${content.replace(/\}\{\}/g, '}')}\n`;
}

async function buildBundle(label, files) {
  let output = `/* ${label} */\n`;

  for (const file of files) {
    try {
      output += await readCssFile(file);
    } catch {
      console.warn(`missing css: ${file}`);
    }
  }

  return output;
}

async function main() {
  await mkdir(STYLES_DIR, { recursive: true });
  await mkdir(ARTICLE_ASSETS_DIR, { recursive: true });

  const legacyShellCss = await buildBundle('Legacy WordPress/Elementor global CSS', LEGACY_SHELL_CSS);
  await writeFile(join(STYLES_DIR, 'site-shell-legacy.css'), legacyShellCss, 'utf8');

  for (const [pageId, files] of Object.entries(PAGE_CSS_MAP)) {
    const css = await buildBundle(`${pageId} content CSS bundle`, files);
    await writeFile(join(STYLES_DIR, `${pageId}-bundle.css`), css, 'utf8');
  }

  const articleCss = await buildBundle('Article content CSS bundle', ARTICLE_CONTENT_CSS);
  await writeFile(join(ARTICLE_ASSETS_DIR, 'article-shell-bundle.css'), articleCss, 'utf8');

  console.log('Rebuilt legacy shell CSS, page content bundles, and article content CSS.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
