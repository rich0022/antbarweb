export interface BackgroundVideoSources {
  webm: string;
  mp4: string;
}

export function webmFromMp4(mp4: string): string {
  return mp4.replace(/\.mp4$/i, '.webm');
}

export function backgroundVideoFromMp4(mp4: string): BackgroundVideoSources {
  return { webm: webmFromMp4(mp4), mp4 };
}
