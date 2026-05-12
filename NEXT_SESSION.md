# Sorrel Refactor — Next Session Handoff

This document picks up where the last session ended. The refactor plan lives at
`C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md` (full
context + decisions). This file is the short-form continuation guide.

---

## What's done

- **Step 1** — Package manager switched to pnpm.
  - `pnpm install` succeeded, 98 packages, `pnpm-lock.yaml` exists.
  - `vite-plugin-singlefile` removed (no longer used).
- **Step 3** — `vite.config.js` rewritten.
  - Singlefile plugin dropped.
  - `base: '/fitness_app/'` for GitHub Pages subpath.
  - `manualChunks` splits Chart.js + Quagga into vendor chunks.
  - `esbuild.drop: ['console', 'debugger']` for production builds.
  - `cssCodeSplit: true`.
- **Step 6** — `.github/workflows/deploy.yml` created with `workflow_dispatch`
  trigger only (manual). Uses pnpm + `actions/deploy-pages@v4`.
- **Step 7** — `CLAUDE.md` replaced with minimal 23-line version.

## State of the repo right now

- `index.html` (1.88 MB monolith) is **unchanged** and still the live site.
- Nothing is committed yet — run `git status` to review the diff before
  committing.
- GitHub Pages source must stay on "Deploy from a branch: main / root" until
  the rewrite ships. Switching to "GitHub Actions" now would deploy the
  monolith with no benefit.

---

## What's left

### Step 2 — Full rewrite of `index.html` into `src/` (biggest)

Read each section of `index.html` (~40k lines), understand intent, re-author
as clean module code. Final `index.html` becomes a ~30-line shell.

Target `src/` layout:

```
src/
  main.js              — bootstrap: load state, register SW, mount UI
  styles/
    base.css           — variables, typography, layout primitives
    components.css     — buttons, cards, modals, tabs
  data/
    recipes.js         — breakfastRecipes + lunchRecipes + dinnerRecipes
    snacks.js          — snackOptions (currently lexically scoped ~line 4975)
    taxonomy.js        — INGREDIENT_TAXONOMY (file exists, populate)
    exercises.js       — cardio + strength databases
  features/
    diet.js            — canonicalDietType, classifyVegan, multiwordHit (exists, expand)
    budget.js          — getBudget, setBudget, cascade (exists, expand)
    diary.js           — food logging, recentFoods, favoriteFoods
    plan.js            — generateOptimalWeek, rehydrateMealMethods
    progress.js        — weight log, photo storage, charts
    shopping.js        — shopping list generation
    fasting.js         — fasting state machine
  state/
    profile.js         — profile load/save (exists)
    appState.js        — central state object, localStorage persistence (exists)
  ui/
    render.js          — main render() orchestrator + tab routing
    home.js, diary.js, plan.js, progress.js, shopping.js, settings.js
    modals.js          — profile setup, food picker, weekly plan editor (lazy)
  pwa/
    sw.js              — service worker (offline cache)
```

Rules:

- **Behavior-preserving.** Every current feature must work after rewrite.
- **No version-patch noise.** Delete every `__sorrelV16XXLoaded` guard, every
  `__v16XXWrapped` flag, every smoke suite, every wrapper chain.
- **No `console.log` spam.** Remove all 420 dev logs.
- **Lazy-load tabs.** Dynamic `import()` per tab; initial load fetches only
  Home shell.
- **Preserve food ontology.** Keep `canonicalDietType()` indirection, 5-state
  vegan classifier, longest-phrase-first plant-confirmed scan, required UX
  copy: "No obvious animal-derived ingredients found. This is not a vegan
  certification."
- **Preserve budget cascade.** `getBudget()` / `setBudget(v)` remain the only
  way to read/write the three budget fields (`weeklyBudget`,
  `weeklyGroceryBudgetTarget`, `budgetTarget`).

Recommended order during rewrite:

1. State (`state/profile.js`, `state/appState.js`) — already partially scaffolded.
2. Data tables (`data/recipes.js`, `data/snacks.js`, `data/taxonomy.js`,
   `data/exercises.js`) — pure data, easy lift.
3. Pure feature logic (`features/diet.js`, `features/budget.js`,
   `features/fasting.js`) — pure functions, easy to verify.
4. Feature logic with side effects (`features/diary.js`, `features/plan.js`,
   `features/progress.js`, `features/shopping.js`).
5. UI orchestration (`ui/render.js`, per-tab views).
6. Styles (`styles/base.css`, `styles/components.css`) extracted from the
   inline `<style>` block at lines 19–2614.
7. Modals (`ui/modals.js`) — last, since they depend on every feature.
8. Final shell `index.html` (~30 lines).

After each slice, run `pnpm run dev` and verify the slice's feature works in
the browser.

### Step 4 — PWA basics

- `public/manifest.webmanifest`: name, short_name, icons (192/512),
  `display: standalone`, `start_url: '.'`, theme/background colors.
- `src/pwa/sw.js`: cache app shell + chunks on install; network-first for
  navigation, cache-first for assets, stale-while-revalidate elsewhere.
- Register service worker in `src/main.js` on load.

### Step 5 — Export / Import backup buttons in Settings

- **Export**: serialize `localStorage` → JSON → Blob download named
  `sorrel-backup-YYYY-MM-DD.json`.
- **Import**: file picker → `confirm()` dialog → overwrite `localStorage` →
  reload.

### Final flip — enable auto-deploy

Only after Step 2 + Step 4 + Step 5 are done and `pnpm run preview` shows the
app working:

1. Edit `.github/workflows/deploy.yml`: change trigger from
   `workflow_dispatch` to:
   ```yaml
   on:
     push:
       branches: [main]
   ```
2. In GitHub repo Settings → Pages, change Source to "GitHub Actions".
3. Push to main; verify the live site updates.

---

## Files to delete during Step 2

- `sorrel_v1.6.31_final.html` — duplicate backup of the monolith.
- `test/` — entire directory (`test/smoke-runner.js`).
- `jsdom` devDependency: `pnpm remove jsdom`.
- All `sorrelRunV16XXSmoke` functions inside `index.html`.

## Files to keep untouched

- `server/proxy.js` — Cloudflare Worker for future Claude API; not yet wired.
- `wrangler.toml` — matches the above.
- `src/api/claudeProxy.js` — client wrapper for future use.
- `ARCHITECTURE_UPGRADE.md` — historical roadmap; superseded by the plan but
  worth keeping as context.

---

## Quick verification commands

```bash
# Build the current state
pnpm run build

# Serve the built dist/ locally
pnpm run preview

# Start dev server with hot reload (after rewrite begins)
pnpm run dev

# Check what's about to be committed
git status
git diff
```

## Key file paths

- Plan (full context): `C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`
- This handoff: `NEXT_SESSION.md` (repo root)
- Project instructions: `CLAUDE.md` (repo root)
- Monolith to dissect: `index.html`
- Architecture history: `ARCHITECTURE_UPGRADE.md`
- Build config: `vite.config.js`
- Deploy workflow: `.github/workflows/deploy.yml`

---

## Bloat targets (from plan)

| State | Initial payload |
|---|---|
| Current monolith | 1.88 MB |
| After Step 2 + Vite build | ~200–300 KB initial chunk, rest lazy |
| After Step 4 (service worker first cache) | ~0 KB on repeat visit |

## Database

**No backend DB for MVP.** `localStorage` + `IndexedDB` (for binary blobs)
stays sole storage. Backup buttons (Step 5) provide durability without infra.
Revisit only when multi-device sync becomes a real requirement.
