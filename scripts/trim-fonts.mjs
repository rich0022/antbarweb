#!/usr/bin/env node
/**
 * Trim Google Fonts CSS files to only keep latin + used weights/styles.
 * Reads public/wp-content/uploads/elementor/google-fonts/css/*.css,
 * writes the trimmed version back to the same file.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const FONTS_DIR = join(ROOT, 'public', 'wp-content', 'uploads', 'elementor', 'google-fonts', 'css');

const SPEC = {
  roboto: {
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
  },
  poppins: {
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal'],
  },
  robotoslab: {
    weights: [400, 500, 600],
    styles: ['normal'],
  },
};

function parseFaceBlocks(css) {
  const blocks = [];
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    const unicodeRange = match[1];
    const body = match[2];
    const fontStyle = (body.match(/font-style:\s*(\w+)/) || [])[1] || 'normal';
    const fontWeight = parseInt((body.match(/font-weight:\s*(\d+)/) || [])[1] || '400', 10);
    const fontStretch = (body.match(/font-stretch:\s*([^;]+)/) || [])[1] || '100%';
    blocks.push({ unicodeRange, body, fontStyle, fontWeight, fontStretch, raw: match[0] });
  }
  return blocks;
}

async function trimFont(name) {
  const spec = SPEC[name];
  if (!spec) return;

  const filePath = join(FONTS_DIR, `${name}.css`);
  const css = await readFile(filePath, 'utf8');
  const blocks = parseFaceBlocks(css);
  const originalSize = Buffer.byteLength(css);

  const kept = blocks.filter(
    (b) =>
      b.unicodeRange === 'latin' &&
      spec.weights.includes(b.fontWeight) &&
      spec.styles.includes(b.fontStyle),
  );

  if (kept.length === 0) {
    console.warn(`  ${name}: NO blocks matched! Keeping original.`);
    return;
  }

  const output = kept.map((b) => b.raw).join('\n') + '\n';
  await writeFile(filePath, output, 'utf8');
  const newSize = Buffer.byteLength(output);
  const pct = ((1 - newSize / originalSize) * 100).toFixed(0);
  const keptWeights = [...new Set(kept.map((b) => `${b.fontWeight}${b.fontStyle === 'italic' ? 'i' : ''}`))];
  console.log(`  ${name}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${pct}%) — kept ${kept.length} blocks: ${keptWeights.join(', ')}`);
}

async function main() {
  console.log('Trimming font CSS files...');
  for (const name of Object.keys(SPEC)) {
    await trimFont(name);
  }
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
