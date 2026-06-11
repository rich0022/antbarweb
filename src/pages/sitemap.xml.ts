import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE_URL = 'https://antbar.com';

function xmlUrl(loc: string, priority = '0.8', changefreq = 'weekly'): string {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const urls: string[] = [];

  // Static pages
  urls.push(xmlUrl('/', '1.0', 'weekly'));
  urls.push(xmlUrl('/all-products/', '0.9', 'weekly'));
  urls.push(xmlUrl('/about-us/', '0.8', 'monthly'));
  urls.push(xmlUrl('/brand-story/', '0.7', 'monthly'));
  urls.push(xmlUrl('/rd-center/', '0.7', 'monthly'));
  urls.push(xmlUrl('/intelligent-manufacturing/', '0.7', 'monthly'));
  urls.push(xmlUrl('/antbar-lab/', '0.7', 'monthly'));
  urls.push(xmlUrl('/contact/', '0.7', 'monthly'));
  urls.push(xmlUrl('/support/', '0.6', 'monthly'));
  urls.push(xmlUrl('/verification/', '0.5', 'monthly'));
  urls.push(xmlUrl('/privacy-policy/', '0.3', 'yearly'));
  urls.push(xmlUrl('/search/', '0.3', 'yearly'));

  // Blog archive + posts
  urls.push(xmlUrl('/blog/', '0.8', 'weekly'));
  const blogPosts = await getCollection('blog');
  for (const entry of blogPosts) {
    if (entry.id === 'index') continue;
    const slug = entry.id.replace(/\.mdx?$/, '');
    urls.push(xmlUrl(`/blog/${slug}/`, '0.7', 'monthly'));
  }

  // Review archive + posts
  urls.push(xmlUrl('/review/', '0.8', 'weekly'));
  const reviews = await getCollection('review');
  for (const entry of reviews) {
    if (entry.id === 'index') continue;
    const slug = entry.id.replace(/\.mdx?$/, '');
    urls.push(xmlUrl(`/review/${slug}/`, '0.7', 'monthly'));
  }

  // Product category pages
  urls.push(xmlUrl('/disposable/', '0.7', 'weekly'));
  urls.push(xmlUrl('/pod-sys/', '0.7', 'weekly'));

  // Individual product pages (defined by static Astro pages)
  const productPages = [
    '/disposable/at800-puffs-disposable-vape/',
    '/disposable/antbar-ag600/',
    '/disposable/antbar-atb600/',
    '/disposable/antbar-kt800/',
    '/disposable/antbar-rocket/',
    '/disposable/antbar-sa8000/',
    '/disposable/agp12000-nicotine-disposable-vape/',
    '/disposable/v10000-puffs-disposable-vape/',
    '/disposable/antbar-3000-6000/',
  ];
  for (const path of productPages) {
    urls.push(xmlUrl(path, '0.8', 'weekly'));
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml' },
    },
  );
};
