# Sorrel Refactor — Next Session Handoff

This document picks up where the last session ended. The refactor plan lives at
`C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md` (full
context + decisions). This file is the short-form continuation guide.

---

## Session log

- **Session 1** — Steps 1, 3, 6, 7 done (pnpm switch, Vite config, GH Action
  scaffold, minimal CLAUDE.md). Infrastructure only.
- **Session 2** — Step 2 begun. Slices 1, 2, 3 complete + first module of
  Slice 4 (fasting).
- **Session 3** — Slice 4 substantially done (fasting, diary, plan, progress,
  training, customFoods + 5 more data tables + utils). Slice 6 (CSS extract)
  done. `index.html` still 1.88 MB — shell-swap is slice 8.
- **Session 4** — Slice 5 complete. Plan revised to match actual tab inventory
  (8 real tabs: plan/diary/exercise/progress/shopping/analytics/premium/routine —
  no home/settings tabs). Lifted all 8 tabs + top banner + render.js
  orchestrator. Build green throughout. `src/ui/` modules sit idle — monolith
  still owns runtime until slice 8 calls `installSwitchTab()`.

## What's done in `src/`

```
src/
  api/claudeProxy.js           ✓ (scaffold, future Claude use)
  data/
    api-config.js              ✓ OFF_CONFIG + AI_PHOTO_CONFIG
    breakfasts.js              ✓ 1,038 LOC, from index.html:3933-4967
    dinners.js                 ✓ 2,012 LOC, from index.html:6588-8592
    exercises.js               ✓ cardio + strength, 475 LOC
    foods.js                   ✓ quick-add foods, 128 LOC
    ingredients.js             ✓ ingredientDatabase + recipeIngredients
    lunches.js                 ✓ 688 LOC
    protocols.js               ✓ ELITE_PROTOCOL_DATABASE
    providers.js               ✓ deliveryProviders + storeInfo
    snacks.js                  ✓ 320 LOC
    substitutions.js           ✓ ingredientSubstitutions
    taxonomy.js                ✓ INGREDIENT_TAXONOMY (vegan classifier)
  features/
    budget.js                  ✓ getBudget / setBudget cascade
    customFoods.js             ✓ custom-foods LS key
    diary.js                   ✓ food-diary LS key + entry CRUD
    diet.js                    ✓ canonicalDietType + classifyForVegan
    fasting.js                 ✓ fasting-state LS key + streak math
    index.js                   ✓ barrel: re-exports + namespaced features
    plan.js                    ✓ pure mutations over appState
    progress.js                ✓ progress-photos LS key + weight tracking
    training.js                ✓ exercise-log LS key + CRUD
  state/
    appState.js                ✓ tracker-state + ensure() lazy-init
    index.js                   ✓ barrel
    profile.js                 ✓ user-profile + budget triple migration
  styles/
    main.css                   ✓ 1,327 lines extracted from <style> blocks
  ui/                          ✓ Slice 5 COMPLETE
    topbanner.js               ✓ priority-cascade banner (recovery/trial/weekly/baseline)
    premium.js                 ✓ fasting UI + photo grid + custom foods cards
    routine.js                 ✓ circadian routine (wake/bedtime + sunlight)
    analytics.js               ✓ weight/calorie/macro/exercise charts (Chart.js)
    progress.js                ✓ weight summary + pattern badge + photo grid
    exercise.js                ✓ cardio/strength log + rest timer + byset session
    diary.js                   ✓ food log + macros + multi-add + swipe-delete
    plan.js                    ✓ main planner + grids + budget optimizer
    shopping.js                ✓ list render + pantry toggles + store recos
    render.js                  ✓ tab orchestrator (installSwitchTab for slice 8)
  utils/
    dates.js                   ✓ todayISO / toLocalISO / daysBetween
    html.js                    ✓ escapeHtml
  main.js                      ✓ imports CSS, hoists window.Sorrel namespace
```

## What's still in the monolith

- Diary tab render (~3,000 LOC): `renderFoodDiary`, `renderMealFoods`,
  swipe-delete, multi-add, daily totals.
- Plan tab render (~5,500 LOC): `updateMainPagePlanner`, grids, optimizer
  (`runBudgetOptimization`, `suggestCheaper*`), `calculateMealRotation`.
- Shopping tab render (~2,000 LOC): `renderDynamicShopping`, pantry toggles,
  store assignment, delivery links.
- Inline modal HTML (~25 KB) — slice 7.
- Onboarding modal flow (Elite v1 assessment) — slice 7.
- Trial/paywall system (`sorrel-trial` LS key, `showPaywallModal`) — slice 7.
- Open Food Facts client code + barcode scanner glue (Quagga) — diary modals.
- AI photo / voice log flows — diary modals.
- Cross-tab helpers still in monolith: `updateStats`, `calculateDailyTotals`,
  `updateTrainRecoveryBanner`, `getTodaysIntensityRecommendation`,
  `showLogToast`, `showUndoToast`, `getDayData`, `getHydrationSchedule`,
  `logSunlight`. The lifted UI modules call these via `window.*` for now.
- 24 smoke test functions (`sorrelRunV16XXSmoke`) — delete in slice 8.
- 420 `console.log` calls — stripped by Vite `esbuild.drop` on build.
- Patch IIFEs (v1.6.10 → v1.6.31 versioned guards + wrapper chains) — slice 8
  cleanup.

## Projected dist/ payload after slice 8 (shell-swap)

| Asset | Size | Gzipped |
|---|---|---|
| `index.html` shell | ~3 KB | ~1 KB |
| `index.css` | 17 KB | 4.2 KB |
| `index.js` entry | 25 KB | 8.7 KB |
| `vendor-chart` | 200 KB | 67 KB |
| `vendor-quagga` | 154 KB | 44 KB |
| `vendor` (other) | 8 KB | 4 KB |
| **Total initial** | **~407 KB** | **~129 KB** |

Down from 1.88 MB / 428 KB gzipped. Quagga is a candidate for lazy-loading
since only the food-search-by-barcode flow needs it.

## Design decisions (don't relitigate)

1. **Bridge pattern.** Modules export getters/setters. `main.js` exposes
   `window.Sorrel = { fasting, diary, plan, progress, training,
   customFoods, ... }` namespace. After slice 8 the legacy render code that
   reads globals can either be rewritten to use `window.Sorrel.*` OR
   `main.js` can additionally hoist `window.profile = getProfile()` etc.
   so existing reads don't break.
2. **Behavior-preserving.** Every existing feature must work after rewrite.
3. **No automated tests.** Manual browser smoke only.
4. **GitHub Pages stays on `main / root`** until the rewrite ships in
   slice 8. Workflow file is set to `workflow_dispatch` only — does not
   auto-deploy. Switch repo Pages source to "GitHub Actions" + flip trigger
   to `push: main` AFTER slice 8 ships.

## Remaining slices

### Slice 5 — UI orchestration + per-tab views (biggest)

**Active execution plan (Session 4+):**
`C:\Users\abark\.claude\plans\read-next-session-md-and-slice5-plan-md-bright-cascade.md`.
The older SLICE5_PLAN.md (in repo) assumed 7 tabs including `home`/`settings`;
that doesn't match reality. The active plan has the corrected 8-tab inventory.

**All done (Session 4):**

| # | Tab | File | LOC | Status |
|---|---|---|---|---|
| 5.1 | Top banner (global) | `src/ui/topbanner.js` | ~270 | ✅ |
| 5.2 | Premium | `src/ui/premium.js` | ~170 | ✅ |
| 5.3 | Routine | `src/ui/routine.js` | ~270 | ✅ |
| 5.4 | Analytics | `src/ui/analytics.js` | ~470 | ✅ |
| 5.5 | Progress | `src/ui/progress.js` | ~110 | ✅ |
| 5.6 | Exercise | `src/ui/exercise.js` | ~580 | ✅ |
| 5.7 | Diary | `src/ui/diary.js` | ~570 | ✅ |
| 5.8 | Plan | `src/ui/plan.js` | ~830 | ✅ |
| 5.9 | Shopping | `src/ui/shopping.js` | ~420 | ✅ |
| 5.10 | render.js orchestrator | `src/ui/render.js` | ~90 | ✅ |

**Slice 5 grand total**: ~3,780 LOC lifted across 10 modules. Build green.

**Next: Slice 7 (modals) + Slice 8 (shell-swap).**

**Bridge pattern in use:**

- All state reads via `window.Sorrel.{loadState, getProfile, diary, training,
  customFoods, progress, fasting, plan}` etc.
- Lifted modules expose mutators on `window.*` (e.g.
  `window.addCardioExercise`, `window.deleteCustomFood`) so monolith's inline
  `onclick="..."` handlers keep working until slice 8.
- Some helpers stay in monolith for now and are called via `window.*`
  (calculateDailyTotals, updateStats, showLogToast, etc). Lift in slice 7-8.

**Per-tab post-lift validation:**
Build sanity-check only (`pnpm.cmd run build` — must compile cleanly). No
per-tab dev runs during slice 5; monolith is still authoritative. Final
verification session runs `pnpm preview` + tab walkthrough after 5.10.

Each tab's render code should:
- Call into `window.Sorrel.*` for data (or import directly)
- Use `escapeHtml()` from `src/utils/html.js` for user-input safety
- Use `todayISO()` from `src/utils/dates.js` for date strings
- Not touch globals directly

### Slice 7 — Modals (lazy-loaded)

Modal HTML in the monolith is inline `<div>` blocks. Move templates to
`src/ui/modals/*.js` as template strings + open/close API. Lazy-load on
first open. Candidates: profile setup, food search, food detail, weekly
plan editor, photo comparison, AI photo review, voice log, custom food,
quick log sheet, paywall, budget edit, quick start.

### Slice 8 — Shell `index.html` + final swap

Replace `index.html` with the ~30-line shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta name="theme-color" content="#..." />
  <title>Sorrel</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href="/icon-192.png" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

Update `src/main.js` bootstrap to:
1. Load profile + state + diary + training + fasting + custom foods + photos
2. Hoist `window.profile`, `window.state` (bridge for any straggler reads)
3. Mount UI via render() orchestrator from slice 5
4. Register service worker (slice 4 of original plan = Step 4 below)

Delete:
- `sorrel_v1.6.31_final.html` (duplicate backup of monolith)
- `test/` folder
- All `__sorrelV16XXLoaded` / `__v16XXWrapped` flags (gone with index.html)

### After Step 2 (in any order)

- **Step 4 — PWA basics**: `public/manifest.webmanifest`, `src/pwa/sw.js`,
  service worker registration in `main.js`.
- **Step 5 — Export/Import backup** in Settings.
- **Final flip**: change `.github/workflows/deploy.yml` trigger from
  `workflow_dispatch` to `push: main`; switch repo Pages source to
  "GitHub Actions".

## Quick verification commands

```bash
# Windows: use .cmd suffix when running from Git Bash. Bare `pnpm` fails.
pnpm.cmd run build      # sanity-check after each lift
pnpm.cmd run preview    # serve dist/ for tab walkthrough
pnpm.cmd run dev        # hot-reload dev server

git status
git diff --stat
```

## Key file paths

- Plan (canonical): `C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`
- This handoff: `NEXT_SESSION.md`
- Project instructions: `CLAUDE.md`
- Monolith (still live): `index.html`
- Build config: `vite.config.js`
- Deploy workflow: `.github/workflows/deploy.yml`
