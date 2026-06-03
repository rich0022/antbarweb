#!/usr/bin/env node
/**
 * Sync Elementor widget settings from mirror/index.html into src/data/.
 * Run after mirror header updates: npm run generate:site-shell
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const mirrorPath = path.join(root, 'mirror', 'index.html');
const html = fs.readFileSync(mirrorPath, 'utf8');

function decodeCfEmail(hex) {
  const key = Number.parseInt(hex.slice(0, 2), 16);
  let out = '';

  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(Number.parseInt(hex.slice(i, i + 2), 16) ^ key);
  }

  return out;
}

function decodeCloudflareProtectedEmails(markup) {
  return markup.replace(
    /<a[^>]*data-cfemail="([^"]+)"[^>]*>[\s\S]*?<\/a>/g,
    (_, encoded) => {
      const email = decodeCfEmail(encoded);
      return `<a href="mailto:${email}">${email}</a>`;
    },
  );
}

function stripHtml(markup) {
  return markup
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const megaSettings = html.match(
  /data-id="8490b2f"[^>]*data-settings="([^"]+)"/,
)?.[1];

if (!megaSettings) {
  console.error('mega menu data-settings not found');
  process.exit(1);
}

const megaOut = path.join(root, 'src', 'data', 'mega-menu-settings.ts');
fs.writeFileSync(
  megaOut,
  `/** Auto-generated from mirror/index.html — npm run generate:site-shell */\nexport const MEGA_MENU_WIDGET_SETTINGS = ${JSON.stringify(megaSettings)};\n`,
);
console.log('Wrote', megaOut);

const footer = html.match(/<footer\b[^>]*\belementor-location-footer\b[\s\S]*?<\/footer>/i)?.[0] ?? '';
const contactInner = footer.match(
  /data-id="958876e"[\s\S]*?data-widget_type="text-editor\.default">\s*([\s\S]*?)\s*<\/div>\s*<\/div>\s*<div class="elementor-element elementor-element-8e048d2/,
)?.[1];
const contactHtml = decodeCloudflareProtectedEmails(contactInner?.trim() ?? '');
const contactText = stripHtml(contactHtml);
const email = contactText.match(/E-mail:\s*([^\s]+)/i)?.[1] ?? '';
const phone = contactText.match(/TEL:\s*(.+?)(?:Add:|$)/i)?.[1]?.trim() ?? '';
const address = contactText.match(/Add:\s*(.+)$/i)?.[1]?.trim() ?? '';

const contactOut = path.join(root, 'src', 'data', 'footer-contact.ts');
fs.writeFileSync(
  contactOut,
  `/** Auto-generated from mirror/index.html — npm run generate:site-shell */\nexport const FOOTER_CONTACT = {\n  email: ${JSON.stringify(email)},\n  phone: ${JSON.stringify(phone)},\n  address: ${JSON.stringify(address)},\n} as const;\n`,
);
console.log('Wrote', contactOut);
