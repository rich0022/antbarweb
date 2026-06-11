import cloudflare from '@astrojs/cloudflare';
import { defineConfig, sessionDrivers } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Static site has no server sessions; avoid auto-provisioning SESSION KV on deploy.
  session: {
    driver: sessionDrivers.memory(),
  },
  adapter: cloudflare({
    // Astro build reads wrangler.astro.jsonc; production deploy uses wrangler.jsonc.
    configPath: './wrangler.astro.jsonc',
    // Build-time prerender uses Node so mirror/content fs reads work locally and in CI.
    prerenderEnvironment: 'node',
  }),
  site: 'https://antbar.com',
  trailingSlash: 'always',
  redirects: {
    '/antbar-3000-6000': '/disposable/antbar-3000-6000/',
    '/pod-sys/antbar-3000-6000/': '/disposable/antbar-3000-6000/',
    '/disposable/': '/all-products/',
    '/pod-sys/': '/all-products/',
    '/blog/2/': '/blog/',
    '/disposable/ahp10000/': '/disposable/v10000-puffs-disposable-vape/',
  },
  build: {
    assets: 'assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
