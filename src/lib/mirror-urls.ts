import type { MirrorScript } from './mirror-assets';

/** Turn live-site absolute URLs into root-relative paths for local dev/preview. */
export function normalizeMirrorUrl(url: string): string {
  let value = url.trim();
  value = value.replace(/https?:\/\/(?:www\.)?antbar\.com/gi, '');
  if (value.startsWith('//antbar.com')) {
    value = value.replace(/^\/\/antbar\.com/i, '');
  }
  return value || '/';
}

export function normalizeMirrorHtml(html: string): string {
  return html.replace(/https?:\/\/(?:www\.)?antbar\.com/gi, '');
}

export function shouldSkipMirrorScript(script: MirrorScript): boolean {
  const inline = script.inline ?? '';
  if (inline.includes('otel-rum') || inline.includes('/.cloud/rum')) return true;

  const src = script.src ?? '';
  if (!src) return false;
  if (src.includes('/.cloud/')) return true;
  if (src.includes('cloudflare-static/email-decode')) return true;
  if (src.includes('cdn-cgi/scripts')) return true;
  if (src.includes('hello-frontend')) return true;
  return false;
}

/** Mirror header/footer widgets that duplicate SiteShellClientScript / SiteShellPopups. */
export function shouldSkipShellMirrorScript(script: MirrorScript): boolean {
  const inline = script.inline ?? '';
  if (!inline) return false;

  if (inline.includes('setPop') && inline.includes('site-shell-menu-dialog')) return true;
  if (inline.includes('#hMenu') && inline.includes('site-shell-dialog')) return true;
  if (inline.includes('#mainNav .e-n-menu-title') && inline.includes('e-current')) return true;
  if (inline.includes('elementor/action') && inline.includes('popup')) return true;

  return false;
}

export function shouldKeepMirrorScript(script: MirrorScript): boolean {
  return !shouldSkipMirrorScript(script) && !shouldSkipShellMirrorScript(script);
}
