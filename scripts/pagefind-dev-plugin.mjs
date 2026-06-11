import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const PAGEFIND_MIME = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
};

function servePagefind(req, res, next) {
  const raw = req.url?.split('?')[0] ?? '';
  if (!raw.startsWith('/pagefind/')) return next();

  const rel = decodeURIComponent(raw.slice('/pagefind/'.length));
  if (!rel || rel.includes('..')) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const roots = ['public/pagefind', 'dist/client/pagefind', 'dist/pagefind'];
  for (const root of roots) {
    const file = join(process.cwd(), root, rel);
    if (!existsSync(file) || !statSync(file).isFile()) continue;

    const ext = extname(file);
    res.setHeader('Content-Type', PAGEFIND_MIME[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    createReadStream(file).pipe(res);
    return;
  }

  next();
}

/** Serve Pagefind assets in dev/preview from a prior production build output. */
export function pagefindDevPlugin() {
  const attach = (server) => {
    server.middlewares.use(servePagefind);
  };

  return {
    name: 'antbarweb-pagefind-dev',
    configureServer: attach,
    configurePreviewServer: attach,
  };
}
