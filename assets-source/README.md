# Local media masters (not deployed)

High-resolution source files kept outside `public/` so they are not copied into
`dist/` or uploaded with the site.

## Layout

- `video-masters/` — original `.orig.mp4` files used to produce compressed deploy assets
- `image-masters/` — large source images/animations (e.g. original GIF) kept out of `public/`

## Restore a master locally

```bash
cp assets-source/video-masters/2024/07/C486-ok-2k.orig.mp4 public/wp-content/uploads/2024/07/
```

Do not commit copies back under `public/` — deploy uses the compressed `.mp4` only.
