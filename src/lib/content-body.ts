import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stripScriptsFromHtml } from './mirror-assets';
import { normalizeMirrorHtml } from './mirror-urls';
import { stripSiteShellFromHtml } from './site-shell';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export function getContentFilePath(collection: string, entryId: string): string {
  return path.join(CONTENT_DIR, collection, entryId);
}

export async function readContentBody(collection: string, entryId: string): Promise<string> {
  const filePath = getContentFilePath(collection, entryId);
  const raw = await readFile(filePath, 'utf8');
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  const body = match?.[1]?.trim() ?? '';
  return stripSiteShellFromHtml(stripScriptsFromHtml(body));
}
