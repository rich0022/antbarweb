#!/usr/bin/env node
/**
 * Concatenate all CSS files needed for the homepage into a single file.
 * Run: node scripts/bundle-homepage.mjs
 * Reads from public/wp-content/ and public/wp-includes/.
 * Outputs to src/styles/home-bundle.css.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

const CSS_FILES = [
  // Core
  'wp-content/themes/hello-elementor/assets/css/reset.css',
  'wp-content/plugins/elementor/assets/css/frontend.min.css',
  'wp-content/uploads/elementor/css/post-305.css',
  // Header
  'wp-content/uploads/elementor/css/post-49.css',
  'wp-content/plugins/elementor/assets/css/widget-image.min.css',
  'wp-content/plugins/elementor/assets/css/widget-heading.min.css',
  'wp-content/plugins/elementor/assets/css/widget-icon-list.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css',
  'wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css',
  // Footer
  'wp-content/uploads/elementor/css/post-68.css',
  'wp-content/plugins/elementor/assets/css/widget-divider.min.css',
  'wp-content/plugins/elementor/assets/css/widget-nested-accordion.min.css',
  'wp-content/plugins/elementor/assets/css/widget-social-icons.min.css',
  'wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css',
  // Popups (search, mobile menu)
  'wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-search-form.min.css',
  'wp-content/uploads/elementor/css/post-2978.css',
  'wp-content/uploads/elementor/css/post-1146.css',
  'wp-content/uploads/elementor/css/post-1132.css',
  // Homepage content
  'wp-content/uploads/elementor/css/post-2.css',
  'wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css',
  'wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-nested-carousel.min.css',
  'wp-content/plugins/elementor/assets/css/widget-video.min.css',
  // Fonts (Google Fonts CSS)
  'wp-content/uploads/elementor/google-fonts/css/poppins.css',
  'wp-content/uploads/elementor/google-fonts/css/roboto.css',
  'wp-content/uploads/elementor/google-fonts/css/robotoslab.css',
];

async function main() {
  let combined = '/* Homepage CSS bundle — auto-generated. Do not edit. */\n';

  for (const file of CSS_FILES) {
    const filePath = join(PUBLIC, file);
    try {
      await access(filePath);
      const content = await readFile(filePath, 'utf8');
      combined += `\n/* ${file} */\n${content}\n`;
      console.log(`  ✓ ${file}`);
    } catch {
      console.warn(`  ✗ MISSING: ${file}`);
    }
  }

  const outPath = join(ROOT, 'src', 'styles', 'home-bundle.css');
  await writeFile(outPath, combined, 'utf8');
  const kb = (Buffer.byteLength(combined) / 1024).toFixed(0);
  console.log(`\nDone: ${outPath} (${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
