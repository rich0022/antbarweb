import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /cdn-cgi/
Disallow: /search/

Sitemap: https://antbar.com/sitemap.xml
`,
    {
      headers: { 'Content-Type': 'text/plain' },
    },
  );
};
