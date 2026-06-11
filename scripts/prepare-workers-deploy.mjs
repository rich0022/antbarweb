import { rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

// Astro writes a Pages-oriented wrangler.json into dist/client during build.
// Remove it so `wrangler deploy` uses the root wrangler.jsonc Worker config.
await rm(path.join(ROOT, 'dist', 'client', 'wrangler.json'), { force: true });
await rm(path.join(ROOT, '.wrangler'), { force: true, recursive: true });

console.log('Workers deploy prepared: removed generated Pages wrangler config.');
