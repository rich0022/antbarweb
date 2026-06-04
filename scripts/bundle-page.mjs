#!/usr/bin/env node
/**
 * Generic CSS bundler. Usage: node scripts/bundle-page.mjs <page-id> [extra...]
 * Outputs: src/styles/<page-id>-bundle.css
 * page-id examples: home, about-us, brand-story, rd-center, antbar-lab, intelligent-manufacturing
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

const PAGE_CSS_MAP = {
  home: ['post-2.css', 'swiper.min.css', 'e-swiper.min.css', 'widget-nested-carousel.min.css', 'widget-video.min.css'],
  'about-us': ['post-37.css'],
  'brand-story': ['post-41.css'],
  'rd-center': ['post-45.css', 'widget-counter.min.css'],
  'antbar-lab': ['post-118.css'],
  'intelligent-manufacturing': ['post-43.css'],
  blog: [
    'post-1817.css',
    'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css',
  ],
  review: ['post-2779.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  disposable: ['post-1075.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  'pod-sys': ['post-1077.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  contact: ['post-927.css', 'wp-content/plugins/elementor-pro/assets/css/widget-form.min.css'],
  support: ['post-948.css', 'wp-content/plugins/elementor/assets/css/widget-toggle.min.css'],
  verification: ['post-950.css'],
  'all-products': ['post-976.css', 'wp-content/plugins/elementor-pro/assets/css/widget-posts.min.css'],
  'agp12000': [
    'post-3489.css',
    'post-3519.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-image-box.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  kt800: [
    'post-2818.css',
    'post-3531.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  at800: [
    'post-1972.css',
    'post-3531.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  ag600: [
    'post-1435.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  rocket: [
    'post-1429.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  sa8000: [
    'post-1360.css',
    'post-3439.css',
    'wp-content/plugins/elementor/assets/css/widget-video.min.css',
    'wp-content/plugins/elementor/assets/css/widget-menu-anchor.min.css',
  ],
  ahp10000: [
    'post-1436.css',
  ],
  atb600: [
    'post-1403.css',
  ],
  dah6000: [
    'post-1441.css',
  ],
};

const BASE_CSS = [
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
];

async function resolvePath(file) {
  const candidates = [
    `wp-content/uploads/elementor/css/${file}`,
    `wp-content/plugins/elementor/assets/lib/swiper/v8/css/${file}`,
    `wp-content/plugins/elementor/assets/css/conditionals/${file}`,
    `wp-content/plugins/elementor-pro/assets/css/widget-${file}`,
    `wp-content/plugins/elementor/assets/css/widget-${file}`,
    file,
  ];
  for (const c of candidates) {
    try { await access(join(PUBLIC, c)); return c; } catch {}
  }
  return null;
}

async function main() {
  const pageId = process.argv[2] || 'home';
  const pageFiles = PAGE_CSS_MAP[pageId] || [];

  const allFiles = [...BASE_CSS, ...pageFiles.map(f => {
    if (f.startsWith('wp-content/')) return f;
    return f;
  })];

  // Add animation files
  allFiles.push('wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css');

  let combined = `/* ${pageId} CSS bundle */\n`;
  for (const file of allFiles) {
    const fp = join(PUBLIC, file);
    try {
      await access(fp);
      let content = await readFile(fp, 'utf8');
      content = content.replace(/\}\{\}/g, '}');
      combined += `\n/* ${file} */\n${content}\n`;
    } catch {
      const resolved = await resolvePath(file);
      if (resolved) {
        let content = await readFile(join(PUBLIC, resolved), 'utf8');
        content = content.replace(/\}\{\}/g, '}');
        combined += `\n/* ${resolved} */\n${content}\n`;
      } else {
        console.warn(`  - MISSING: ${file}`);
      }
    }
  }
  const out = join(ROOT, 'src', 'styles', `${pageId}-bundle.css`);
  await writeFile(out, combined, 'utf8');
  console.log(`Done: ${out} (${(Buffer.byteLength(combined)/1024).toFixed(0)} KB)`);
}
main().catch(e => { console.error(e); process.exit(1); });
