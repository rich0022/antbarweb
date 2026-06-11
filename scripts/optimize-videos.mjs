#!/usr/bin/env node
/**
 * Compress silent/background MP4s and emit WebM (VP9) for modern browsers.
 * Replaces in-place MP4 with H.264 faststart; keeps audio when the source has signal.
 *
 * Usage: node scripts/optimize-videos.mjs [--dry-run]
 */
import { existsSync, mkdirSync, readdirSync, renameSync, statSync, copyFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = join(import.meta.dirname, '..');
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');
const MASTERS = join(ROOT, 'assets-source', 'video-masters', 'pre-phase-c');
const dryRun = process.argv.includes('--dry-run');

const MP4_MAX_WIDTH = 1280;
const WEBM_MAX_WIDTH = 960;
const MP4_CRF = 30;
const WEBM_CRF = 40;
const TARGET_BYTES = 1.5 * 1024 * 1024;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function hasAudibleAudio(filePath) {
  try {
    const out = execSync(
      `ffmpeg -i "${filePath}" -af volumedetect -f null - 2>&1`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    );
    if (!/Audio:/i.test(out)) return false;
    const max = out.match(/max_volume:\s*([-\d.]+)\s*dB/);
    if (!max) return false;
    return Number(max[1]) > -50;
  } catch (error) {
    const text = String(error.stdout || error.stderr || error.message || '');
    if (!/Audio:/i.test(text)) return false;
    const max = text.match(/max_volume:\s*([-\d.]+)\s*dB/);
    return max ? Number(max[1]) > -50 : false;
  }
}

function run(cmd) {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd}`);
    return;
  }
  execSync(cmd, { stdio: 'pipe' });
}

function backup(filePath) {
  const rel = relative(UPLOADS, filePath);
  const dest = join(MASTERS, rel);
  mkdirSync(dirname(dest), { recursive: true });
  if (!existsSync(dest)) copyFileSync(filePath, dest);
}

function transcode(filePath) {
  const rel = relative(UPLOADS, filePath);
  const masterPath = join(MASTERS, rel);
  const inputPath = existsSync(masterPath) ? masterPath : filePath;
  const before = statSync(inputPath).size;
  const webmPath = filePath.replace(/\.mp4$/i, '.webm');
  const tmpMp4 = `${filePath}.opt.mp4`;
  const audible = hasAudibleAudio(inputPath);
  const mp4Scale = `scale='min(${MP4_MAX_WIDTH},iw)':-2`;
  const webmScale = `scale='min(${WEBM_MAX_WIDTH},iw)':-2`;

  console.log(`\n${rel} (${(before / 1024 / 1024).toFixed(2)} MB, audio: ${audible ? 'yes' : 'no'})`);

  if (!dryRun && inputPath === filePath) backup(filePath);

  const audioArgs = audible ? '-c:a aac -b:a 96k' : '-an';

  run(
    `ffmpeg -y -i "${inputPath}" -vf "${mp4Scale}" -c:v libx264 -crf ${MP4_CRF} -preset slow -movflags +faststart ${audioArgs} "${tmpMp4}"`,
  );

  run(
    `ffmpeg -y -i "${inputPath}" -vf "${webmScale}" -an -c:v libvpx-vp9 -crf ${WEBM_CRF} -b:v 0 -row-mt 1 -deadline good -cpu-used 3 "${webmPath}"`,
  );

  if (!dryRun) {
    renameSync(tmpMp4, filePath);
    const mp4Size = statSync(filePath).size;
    const webmSize = existsSync(webmPath) ? statSync(webmPath).size : 0;
    console.log(
      `  → mp4 ${(mp4Size / 1024 / 1024).toFixed(2)} MB, webm ${(webmSize / 1024 / 1024).toFixed(2)} MB`,
    );
    if (mp4Size > TARGET_BYTES) {
      console.log(`  ⚠ mp4 still above ${(TARGET_BYTES / 1024 / 1024).toFixed(1)} MB target`);
    }
  }
}

if (!existsSync(UPLOADS)) {
  console.log('No uploads directory.');
  process.exit(0);
}

mkdirSync(MASTERS, { recursive: true });

for (const filePath of walk(UPLOADS)) {
  if (!/\.mp4$/i.test(filePath)) continue;
  transcode(filePath);
}

console.log('\nDone.');
