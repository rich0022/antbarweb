import cloudflare from '@astrojs/cloudflare';
import { defineConfig, sessionDrivers } from 'astro/config';
import { pagefindDevPlugin } from './scripts/pagefind-dev-plugin.mjs';
import { readWranglerVars } from './scripts/read-wrangler-vars.mjs';

const wranglerVars = readWranglerVars();
const turnstileSiteKey =
  process.env.PUBLIC_TURNSTILE_SITE_KEY || wranglerVars.PUBLIC_TURNSTILE_SITE_KEY || '';
const contactEndpoint =
  process.env.PUBLIC_CONTACT_ENDPOINT || wranglerVars.PUBLIC_CONTACT_ENDPOINT || '/api/contact/';

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
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [pagefindDevPlugin()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      'import.meta.env.PUBLIC_TURNSTILE_SITE_KEY': JSON.stringify(turnstileSiteKey),
      'import.meta.env.PUBLIC_CONTACT_ENDPOINT': JSON.stringify(contactEndpoint),
    },
  },
});
