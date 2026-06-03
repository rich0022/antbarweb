export function normalizeMirrorHtml(html) {
  return html.replace(/https?:\/\/(?:www\.)?antbar\.com/gi, '');
}
