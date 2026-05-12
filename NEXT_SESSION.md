# Sorrel Refactor — Next Session Handoff

This document picks up where the last session ended. The refactor plan lives at
`C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md` (full
context + decisions). This file is the short-form continuation guide.

---

## Session log

- **Session 1** — Steps 1, 3, 6, 7 done (pnpm switch, Vite config, GH Action
  scaffold, minimal CLAUDE.md). Infrastructure only.
- **Session 2** — Step 2 begun. Slices 1, 2, 3 complete + first module of
  Slice 4 (fasting). `index.html` still unchanged (1.88 MB).

## What's done in `src/`

```
src/
  api/claudeProxy.js           ✓ (scaffold, future Claude use)
  data/
    breakfasts.js              ✓ 1,038 LOC, from index.html:3933-4967
    snacks.js                  ✓ 320 LOC, from index.html:4973-5290
    exercises.js               ✓ 475 LOC, cardio + strength
    foods.js                   ✓ 128 LOC, quick-add foods
    lunches.js                 ✓ 688 LOC, from index.html:5901-6585
    dinners.js                 ✓ 2,012 LOC, from index.html:6588-8592 (was `const recipes`)
    taxonomy.js                ✓ INGREDIENT_TAXONOMY for vegan classifier
  features/
    budget.js                  ✓ getBudget / setBudget cascade
    diet.js                    ✓ canonicalDietType + classifyForVegan
    fasting.js                 ✓ NEW — state machine + persistence (slice 4)
  state/
    profile.js                 ✓ load/save/migrate (budget triple backfill)
    appState.js                ✓ load/save/migrate + ensure() lazy-init helper
  main.js                      ✓ Chart + Quagga shim only (rest comes in slice 8)
```

## What's still in the monolith only

- All UI rendering (~10,000 lines of render functions)
- All event handlers
- Inline modal HTML
- Side-effect features not yet extracted:
  - Diary (food-diary localStorage, ~line 10781)
  - Plan (week plan generation, meal rotation)
  - Progress (weight log, photos, charts)
  - Shopping (list generation, store assignments, delivery)
  - Training (ELITE_PROTOCOL_DATABASE at 22757, exercise logging)
- CSS (87 KB inline `<style>` block at lines 19-2614)
- 24 smoke test functions (~65 KB)
- 420 `console.log` calls
- Patch IIFEs (v1.6.10 → v1.6.31 versioned guards + wrapper chains)
- Remaining data tables not yet extracted:
  - `ingredientDatabase` (index.html:8595)
  - `recipeIngredients` (index.html:8730)
  - `ELITE_PROTOCOL_DATABASE` (index.html:22757)
  - `ingredientSubstitutions` (index.html:27338)
  - `deliveryProviders` (index.html:27666)
  - `storeInfo` (index.html:28041)
  - `OFF_CONFIG` (index.html:11525) — Open Food Facts
  - `AI_PHOTO_CONFIG` (index.html:11947) — AI photo
  - `analyticsState` (index.html:14499)

## Design decisions made (don't relitigate)

1. **Bridge pattern.** During the refactor, modules export getters/setters.
   `main.js` will hoist `window.profile`, `window.state`, `window.fastingState`
   etc. after load so render code in the monolith can keep reading globals.
   Writes funnel through module exports. This lets each slice land without
   breaking the live app.
2. **Behavior-preserving.** Every existing feature must work after rewrite.
3. **No automated tests.** Manual browser smoke only.
4. **GitHub Pages stays on `main / root`** until the rewrite ships in
   slice 8. Workflow file is set to `workflow_dispatch` only — does not
   auto-deploy. Switch repo Pages source to "GitHub Actions" + flip trigger
   to `push: main` AFTER slice 8 ships.

## Remaining slices for Step 2

### Slice 4 (in progress) — side-effect features

- ✓ `src/features/fasting.js` — done (state + pure math, no DOM)
- ☐ `src/features/diary.js` — food logging, `food-diary` localStorage,
  recentFoods, favoriteFoods. Monolith ~line 10781-11525.
- ☐ `src/features/plan.js` — generateOptimalWeek, rehydrateMealMethods,
  breakfastSwaps, week skeleton.
- ☐ `src/features/progress.js` — weightLog, weight charts, photo storage
  (separate `progress-photos` localStorage key, ~line 15215).
- ☐ `src/features/shopping.js` — shopping list generation,
  storeAssignments, delivery providers integration.
- ☐ `src/features/training.js` — exercise log, ELITE_PROTOCOL_DATABASE,
  workout rendering data.
- ☐ Extract remaining data tables to `src/data/`:
  - `ingredients.js` ← `ingredientDatabase` + `recipeIngredients`
  - `protocols.js` ← `ELITE_PROTOCOL_DATABASE`
  - `substitutions.js` ← `ingredientSubstitutions`
  - `providers.js` ← `deliveryProviders` + `storeInfo`
  - `off.js` ← `OFF_CONFIG` (Open Food Facts cache config)

Recommended order within slice 4: data tables first (pure copy-paste, fast),
then diary, then plan, then progress, then shopping, then training.

### Slice 5 — UI orchestration + per-tab views

Build `src/ui/`:
- `render.js` — main `render()` orchestrator + tab routing
- `home.js`, `diary.js`, `plan.js`, `progress.js`, `shopping.js`,
  `settings.js`, `training.js`
- Lazy-import each on first tab click via dynamic `import()`.

### Slice 6 — CSS extraction

Pull lines 19-2614 of `index.html` into `src/styles/base.css` +
`src/styles/components.css`. Vite minifies on build.

### Slice 7 — Modals (lazy-loaded)

- `src/ui/modals.js` — profile setup, food picker, weekly plan editor.
- Each modal's HTML template lives here; lazy-injected on first open.

### Slice 8 — Shell `index.html` + final swap

Replace `index.html` with the ~30-line shell (see plan file for exact shape).
Wire `main.js`:
1. Load state + profile, run migrations
2. Hoist `window.profile`, `window.state`, `window.fastingState` (bridge)
3. Import critical CSS
4. Mount UI

Delete from working tree:
- `sorrel_v1.6.31_final.html`
- `test/` folder
- All `__sorrelV16XXLoaded` and `__v16XXWrapped` flags (gone with index.html)

## After Step 2 (in any order)

- **Step 4 — PWA basics**: `public/manifest.webmanifest`, `src/pwa/sw.js`,
  service worker registration in `main.js`.
- **Step 5 — Export/Import backup** in Settings.
- **Final flip**: change `.github/workflows/deploy.yml` trigger from
  `workflow_dispatch` to `push: main`; switch repo Pages source to
  "GitHub Actions".

## Quick verification commands

```bash
# Build current state
pnpm run build

# Serve built dist/ locally
pnpm run preview

# Dev server with hot reload (once main.js wires up real modules)
pnpm run dev

# Check what's about to be committed
git status
git diff --stat
```

## Key file paths

- Plan (canonical): `C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`
- This handoff: `NEXT_SESSION.md` (repo root)
- Project instructions: `CLAUDE.md`
- Monolith (still live): `index.html`
- Build config: `vite.config.js`
- Deploy workflow: `.github/workflows/deploy.yml`

## File-size targets (unchanged)

| State | Initial payload |
|---|---|
| Current monolith | 1.88 MB |
| After Slice 8 + Vite build | ~200–300 KB initial chunk, rest lazy |
| After Step 4 (service worker first cache) | ~0 KB on repeat visit |
