import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://antbar.com',
  trailingSlash: 'always',
  redirects: {
    '/antbar-3000-6000': '/pod-sys/antbar-3000-6000/',
    '/disposable/': '/all-products/',
    '/pod-sys/': '/all-products/',
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
