#!/usr/bin/env node
/**
 * Concatenate all CSS files needed for the about-us page.
 * Shares most files with homepage, differs only in page-specific CSS.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

const CSS_FILES = [
  // Core
  'wp-content/themes/hello-elementor/assets/css/reset.css',
  'wp-content/themes/hello-elementor/assets/css/theme.css',
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
  // Popups
  'wp-content/plugins/elementor-pro/assets/css/conditionals/popup.min.css',
  'wp-content/plugins/elementor-pro/assets/css/widget-search-form.min.css',
  'wp-content/uploads/elementor/css/post-2978.css',
  'wp-content/uploads/elementor/css/post-1146.css',
  'wp-content/uploads/elementor/css/post-1132.css',
  // Page content
  'wp-content/uploads/elementor/css/post-37.css',
  // Widgets used on this page
  'wp-content/plugins/elementor/assets/css/widget-button.min.css',
  'wp-content/plugins/elementor/assets/css/widget-text-editor.min.css',
  // Animations & fonts
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInRight.min.css',
  'wp-content/plugins/elementor/assets/lib/animations/styles/fadeInLeft.min.css',
  'wp-content/uploads/elementor/google-fonts/css/poppins.css',
  'wp-content/uploads/elementor/google-fonts/css/roboto.css',
  'wp-content/uploads/elementor/google-fonts/css/robotoslab.css',
];

async function main() {
  let combined = '/* About-us CSS bundle */\n';
  for (const file of CSS_FILES) {
    const fp = join(PUBLIC, file);
    try {
      await access(fp);
      let content = await readFile(fp, 'utf8');
      content = content.replace(/\}\{\}/g, '}');
      combined += `\n/* ${file} */\n${content}\n`;
      console.log(`  + ${file}`);
    } catch { console.warn(`  - MISSING: ${file}`); }
  }
  const out = join(ROOT, 'src', 'styles', 'about-bundle.css');
  await writeFile(out, combined, 'utf8');
  console.log(`Done: ${out} (${(Buffer.byteLength(combined)/1024).toFixed(0)} KB)`);
}
main().catch(e => { console.error(e); process.exit(1); });
