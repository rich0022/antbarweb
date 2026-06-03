# Cloudflare + R2 Deployment Notes

## Goal

Build a static Astro bundle that can be deployed to Cloudflare without shipping oversized local videos.

## Why This Is Needed

The mirrored source includes two oversized video files under `public/wp-content/uploads/2024/07/`:

- `AGP12000-479-.mp4`
- `C486-ok-2k.mp4`

Cloudflare static asset deployment rejects these payload sizes.

## Required Setup

1. Upload the two videos to a public R2 bucket (or Cloudflare Stream).
2. Set `PUBLIC_MEDIA_BASE_URL` to the CDN/public base URL that serves those two files.

Example:

```bash
export PUBLIC_MEDIA_BASE_URL="https://media.antbar.com/videos"
```

With this value, HTML references are rewritten to:

- `https://media.antbar.com/videos/AGP12000-479-.mp4`
- `https://media.antbar.com/videos/C486-ok-2k.mp4`

## Build Command

```bash
npm run build:cf
```

This command will:

1. run `astro build`
2. remove blocked local video files from `dist/`
3. verify that generated HTML no longer references local blocked mp4 paths

If verification fails, check that `PUBLIC_MEDIA_BASE_URL` is set before build.

## Current Astro Migration Coverage

The following page families are now explicit Astro routes (instead of only global catch-all):

- `blog/`
- `review/`
- `disposable/`

All remaining pages still work through mirrored fallback and can be migrated family-by-family.
