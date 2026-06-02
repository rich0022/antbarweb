import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://antbar.com',
  trailingSlash: 'always',
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
