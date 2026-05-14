# Sorrel — Project Instructions

## Build
- `pnpm install` — install deps (run once after clone).
- `pnpm run dev` — local dev server with hot reload. Open the URL it prints.
- `pnpm run build` — produce `dist/`, the shippable output. A GitHub Action
  publishes `dist/` to GitHub Pages on push to main.
- `pnpm run preview` — serve built `dist/` locally to sanity-check before
  pushing.

## Tests
None. Manual browser smoke only.

## Notes
- All state in `localStorage`. No backend DB.
- PWA: service worker in `src/pwa/sw.js`.
- Cloudflare Worker scaffold at `server/proxy.js` is unused until Claude API
  features ship.
