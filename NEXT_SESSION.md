# Sorrel Refactor — Next Session Handoff

Picks up where last session ended. Refactor plan canonical at
`C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`.
Slice 7 plan: `C:\Users\abark\.claude\plans\next-session-md-replicated-hoare.md`.

---

## Session log

- **Session 1** — Steps 1, 3, 6, 7 done (pnpm switch, Vite config, GH Action
  scaffold, minimal CLAUDE.md). Infrastructure only.
- **Session 2** — Step 2 begun. Slices 1, 2, 3 complete + first module of
  Slice 4 (fasting).
- **Session 3** — Slice 4 substantially done (fasting, diary, plan, progress,
  training, customFoods + 5 more data tables + utils). Slice 6 (CSS extract)
  done. `index.html` still 1.88 MB — shell-swap is slice 8.
- **Session 4** — Slice 5 complete. 8 tabs + top banner + render.js
  orchestrator lifted (~3,780 LOC across 10 modules). Bridge pattern:
  `window.Sorrel.*` namespace. Slice 5 modules idle until `installSwitchTab()`
  in slice 8.
- **Session 5** — Slice 7A complete (15 cross-tab helpers) + Slice 7B static
  portion (12 static modal templates). Build green: 44 modules, 67 KB main
  bundle, 1.79s. Monolith still authoritative.
- **Session 6** — Slice 8.1 complete. Lifted 5 dynamic modal factories
  (paywall, weeklyPlan, swap [day-level], voiceLog, aiPhotoLog [entry only]),
  profileModal template, renderPlanWeightChip, logSunlight subsystem.
  Extracted DOM helpers (`src/utils/dom.js`) and extended date utils
  (`localDateKey`/`weekStart`/`plusDays`). All lifts dormant — monolith
  authoritative until slice 8.2. Build green: 50 modules, 98 KB main bundle.
- **Session 7** — Slice 8.2a partial. Survivor-module lifts ready, IIFE
  body deletion deferred to 8.2b cutover. Created shared utils
  (`src/utils/format.js`, `src/utils/time.js`, `src/utils/html.js#esc`
  alias), state accessors (`src/state/accessors.js` —
  appState/appProfile/saveAll/saveQuiet/saveProfileQuiet), toast alias.
  Domain feature modules: `src/features/recipes.js` (mealForSlot,
  recipeDbs, ingredientFor — V165 survivors), `src/features/shopping.js`
  (purchaseCost, weeklyCost, pantryHas, normalizeItems,
  buildItemsFromWeekPlan, shoppingItems, storeInfoFor, pantry — V165
  survivors), `src/features/coaching.js` (nextMeal, nextRoutineAction,
  nextLogAction, usefulLogsLeft — V1617 survivors),
  `src/features/hydration.js` (hydrateCount + 5 actions — V163 survivor),
  `src/features/customRoutine.js` (customItems + CRUD +
  installCustomRoutineHandlers — V163 survivor). UI extensions:
  `src/ui/routine.js#renderCustomRoutineItems` (V163 body),
  `src/ui/plan.js#renderPlanNextSteps` (V1617 body). main.js wires
  ~40 `window.*` shims (live overrides for renderCustomRoutineItems,
  hydration actions, renderPlanNextSteps, logSunlight, etc.). Build
  green: 66 modules, 271 KB main bundle (data files now pulled in via
  plan imports). Browser smoke not run this session.

  **Deferred from 8.2a to 8.2b** (substantial work, coupled to monolith
  bare-identifier resolution + shell swap):
  - All 19 patch-IIFE body deletions (V162-V1631 at L33386-39865).
  - 24 smoke functions + `function smokeTest()` (all inside IIFE bodies).
  - V1622 weekly plan modal reconcile (~400 LOC, replaces session-6
    lifted L32031 baseline).
  - V1625 observer + initializeSorrelUI hooks for `src/ui/render.js`.
  - aiPhotoLog downstream flow (handleAIPhotoFile, callAIPhotoAnalysis,
    showAIPhotoReview, confirmAIPhotoLog, escapeAIText,
    updateAIPhotoTotals).
  - profileModal inline `<script>` extraction (nextPage, prevPage,
    saveProfile placeholders).

  **NOT FOUND in monolith** (handoff/plan inventory inaccurate):
  - `renderBaselineCard`/`dismissBaselineCard` — plan listed in V166;
    grep returns zero matches. Drop from scope.

---

## What's done in `src/`

```
src/
  api/claudeProxy.js                    ✓ (scaffold, future Claude use)
  data/
    api-config.js                       ✓ OFF_CONFIG + AI_PHOTO_CONFIG
    breakfasts.js  dinners.js           ✓ 1,038 + 2,012 LOC
    exercises.js   foods.js             ✓ cardio/strength + quick-add
    ingredients.js lunches.js           ✓ + 688 LOC
    protocols.js   providers.js         ✓ ELITE_PROTOCOL + delivery
    snacks.js      substitutions.js     ✓ 320 LOC + subs
    taxonomy.js                         ✓ INGREDIENT_TAXONOMY
  features/
    budget.js  customFoods.js           ✓
    diary.js   diet.js                  ✓ (+ calculateDailyTotals, updateMacroSummary in src/ui/diary.js)
    fasting.js plan.js                  ✓ plan extended: getDayKey, getDayData (session 5)
    coaching.js                         ✓ NEW (session 7) — nextMeal, nextRoutineAction, nextLogAction, usefulLogsLeft
    customRoutine.js                    ✓ NEW (session 7) — CRUD + installCustomRoutineHandlers
    hydration.js                        ✓ NEW (session 7) — hydrateCount + 5 actions
    recipes.js                          ✓ NEW (session 7) — mealForSlot, recipeDbs, ingredientFor
    shopping.js                         ✓ NEW (session 7) — purchaseCost et al. (data side, distinct from src/ui/shopping.js)
    progress.js                         ✓
    training.js                         ✓ extended: getIntensityRecommendation, getTodaysIntensityRecommendation (session 5)
    trial.js                            ✓ NEW (session 5): TRIAL_DAYS, ensureTrialState, getTrialDaysLeft, isAdaptiveUnlocked, saveTrialState, checkTrialExpiry
    routine.js                          ✓ NEW (session 5): getHydrationSchedule
    index.js                            ✓ barrel
  state/
    appState.js  index.js  profile.js   ✓
  styles/main.css                       ✓ slice 6
  ui/
    topbanner.js  premium.js routine.js ✓ slice 5
    analytics.js  progress.js exercise.js ✓ slice 5
    diary.js  plan.js  shopping.js      ✓ slice 5
    render.js                           ✓ slice 5 orchestrator (installSwitchTab for slice 8)
    helpers/                            ✓ NEW (session 5)
      toast.js                          ✓ showLogToast, showUndoToast
      banners.js                        ✓ updateBaselineBanner, updateTrialBanner, updateTrainRecoveryBanner, updateIntelligenceBanners
      stats.js                          ✓ updateStats
      index.js                          ✓ barrel
    modals/                             ✓ NEW (session 5)
      helpers.js                        ✓ ensureMounted, openById, closeById
      customFood.js                     ✓ template + open + close
      swap.js                           ✓ session 5: recipe/breakfast/lunch/snack
                                        ✓ session 6: + showSwapModal (day-level)
      recipeRating.js                   ✓ template + close
      exercise.js                       ✓ addCardio + addStrength templates
      food.js                           ✓ foodSearch + foodDetail templates
      barcode.js                        ✓ template + close
      imageRecognition.js               ✓ template + close
      photoComparison.js                ✓ template + close
      paywall.js                        ✓ NEW (session 6) — showPaywallModal factory
      weeklyPlan.js                     ✓ NEW (session 6) — open/closeWeeklyPlanModal
      voiceLog.js                       ✓ NEW (session 6) — renderVoiceLogModal
      aiPhotoLog.js                     ✓ NEW (session 6) — openAIPhotoLog entry only
      profile.js                        ✓ NEW (session 6) — 1021-line template + open/close
      index.js                          ✓ barrel + mountAll()
  utils/
    dates.js                            ✓ + session 6: localDateKey, weekStart, plusDays
    html.js                             ✓ + session 7: esc alias
    dom.js                              ✓ NEW (session 6) — $, qa, byId
    format.js                           ✓ NEW (session 7) — money
    time.js                             ✓ NEW (session 7) — fmtTime/minutes24/timeToMinutes/toInputTime/parseDisplayTime
  features/sunlight.js                  ✓ NEW (session 6) — sunlightMap, logSunlight, renderHealthSunlightStable
  state/
    accessors.js                        ✓ NEW (session 7) — appState/appProfile/saveAll/saveQuiet/saveProfileQuiet
  ui/helpers/toast.js                   ✓ + session 7: toast() short alias
  ui/routine.js                         ✓ + session 7: renderCustomRoutineItems (V163 body)
  ui/plan.js                            ✓ + session 7: renderPlanNextSteps (V1617 body)
  main.js                               ✓ session 7: imports CSS, wires window.Sorrel + ~40 window.* shims, calls modals.mountAll() + installCustomRoutineHandlers() at bootstrap
```

---

## What's still in the monolith (slice 8 targets)

### Tab renders (lifted to src/ui/ but dormant; monolith copies still run)

- Diary tab (`renderFoodDiary`, `renderMealFoods`, swipe-delete, multi-add) ~3,000 LOC
- Plan tab (`updateMainPagePlanner`, grids, optimizer, `calculateMealRotation`) ~5,500 LOC
- Shopping tab (`renderDynamicShopping`, pantry, store, delivery) ~2,000 LOC

These delete when `installSwitchTab()` fires in slice 8.

### Modals lifted in session 6 (dormant until slice 8.2)

| Modal | Module | Status |
|---|---|---|
| `paywallModal` | src/ui/modals/paywall.js | ✓ Lifted complete |
| `weeklyPlanModal` | src/ui/modals/weeklyPlan.js | ✓ Lifted complete |
| `swapModal` (day-level) | src/ui/modals/swap.js | ✓ Lifted complete |
| `voiceLogModal` | src/ui/modals/voiceLog.js | ✓ Lifted complete |
| `aiPhotoLogModal` | src/ui/modals/aiPhotoLog.js | ✓ Entry only (downstream stays in monolith for 8.1) |
| `profileModal` | src/ui/modals/profile.js | ✓ Template only (1021 LOC) |

### Still deferred to slice 8.2

- **aiPhotoLog downstream flow** — `handleAIPhotoFile`, `resizeImageForAI`,
  `callAIPhotoAnalysis`, `showAIPhotoReview`, `confirmAIPhotoLog`,
  `escapeAIText`, `updateAIPhotoTotals`. Need to factor `aiPhotoSession`
  + `AI_PHOTO_CONFIG` into module state.
- **profileModal inline `<script>`** — IMMEDIATE modal check IIFE +
  nextPage/prevPage/saveProfile placeholders at template L1327-1587 won't
  auto-execute via innerHTML injection. When monolith strips, extract to
  `src/ui/modals/profile-controller.js` and invoke from main.js bootstrap.
- **renderPlanNextSteps** — closure deps on `nextMeal`, `nextRoutineAction`,
  `nextLogAction`, `usefulLogsLeft`, `esc`. Lift after full IIFE collapse.

### Patch-IIFE-closure helpers

Session 6 status:
- `logSunlight` + `sunlightMap` + `renderHealthSunlightStable` ✓ lifted to
  `src/features/sunlight.js`. Dormant — monolith IIFE-local copies at
  L36205-36261 still drive active code path.
- `renderPlanWeightChip` ✓ lifted into `src/ui/plan.js`.
- `renderPlanNextSteps` ⏸ deferred to 8.2 (deep IIFE closure deps).
- `renderCustomRoutineItems` ✗ NOT FOUND in monolith. Either renamed
  earlier or removed. Drop from scope.

### Real IIFE guard names (verified 2026-05-13)

Handoff originally said "v1.6.10 → v1.6.31 wrapper chains". Actual guards
are per-feature camelCase: `__sorrelV162Fallbacks` (L33386),
`__sorrelV163BehaviorFix`, `__sorrelV163WaterGuard`,
`__sorrelV164ShoppingRestore`, `__sorrelV165OriginalBehaviorRestore`,
`__sorrelV166OriginalInteractionFix`, `__sorrelV167UXFix`,
`__sorrelV168OriginalMobileUxRefine`, `__sorrelV1616Loaded`,
`__sorrelV1617FunctionalSmokeConsolidation`, ... through
`__sorrelV1625Observer` (L38176). ~14 stacked patch IIFEs total. Multiple
`boot()` IIFE bodies at L34370, L34675, L34898, L35129; `bootV1617()` at
L36681. Slice 8.2 must collapse all of these.

### Other monolith-only code (delete or lift at slice 8)

- OFF (Open Food Facts) client code + Quagga barcode scanner glue
- AI photo / voice log flows
- Patch IIFEs (`__sorrelV16XXLoaded`, `__v16XXWrapped` guards, `v1.6.10` → `v1.6.31` wrapper chains)
- 24 smoke test functions (`sorrelRunV16XXSmoke`)
- 420 `console.log` calls (stripped by Vite `esbuild.drop` on build)
- Cross-tab helpers still in monolith: `getEffectiveMacrosForToday`, `getLoggingStreak`,
  `getRecoveryLevel`, `ensureAdaptiveState`, `renderMorningStrip`, `renderTopBanner`,
  `getMealTimingGuide`, `renderHydrationSchedule`, `renderHealthSunlight`,
  `renderHealthRecovery`, `getTrendWeight`, `renderProgress`, `renderProgressTab`,
  `swapMeal`, `viewRecipe`, save/load profile beyond what `state/profile.js` covers,
  trial subsystem caller sites (`showPaywallModal`, `subscribePro`)

---

## Bridge pattern (in use, slice 5-7)

- All state reads via `window.Sorrel.{loadState, getProfile, diary, training, customFoods, progress, fasting, plan, trial, routine}` etc.
- Lifted modules expose mutators on `window.*` (e.g. `window.addCardioExercise`, `window.deleteCustomFood`) so monolith's inline `onclick="..."` handlers keep working.
- Session 5 added `window.*` shims for: showLogToast, showUndoToast, updateBaselineBanner, updateTrialBanner, updateTrainRecoveryBanner, updateIntelligenceBanners, updateStats, checkTrialExpiry, ensureTrialState, getTrialDaysLeft, isAdaptiveUnlocked, getTodaysIntensityRecommendation, getHydrationSchedule, getDayData. **These override monolith via aliasing** — when monolith bare-identifier calls (e.g. `showLogToast(...)`) hit, they go to lifted code via `window` lookup. Behavior identical (lifted is verbatim copy).
- `window.state` + `window.profile` published by monolith patch IIFEs at L33171+. Lifted helpers read these directly; mutations propagate.
- `window.foodDiary` NOT published by monolith. Lifted code that needs diary uses `window.Sorrel.diary.getDiary()` (separate identity from monolith's `const foodDiary`). Behavior overlap OK while monolith authoritative; merges at slice 8.

### Modal bridge (session 5)

Each modal module exports `mount()` + close fns. `ensureMounted(id, html)` checks for existing element by ID:
- While monolith inline HTML exists (7B): no-op, modal coexists.
- Post-slice-8 strip: injects template.

`mountAll()` called from `main.js` bootstrap on DOMContentLoaded.

---

## Slice 8 plan (next 1-2 sessions)

### 8.1 Lift remaining modals + patch IIFE helpers (~6-8 hr)

1. **Dynamic modals as factories** — move `showPaywallModal`, `openWeeklyPlanModal`, `showSwapModal`, `renderVoiceLogModal`, `openAIPhotoLog` to `src/ui/modals/*.js`. Each builds DOM via template literal + appends to body. Keep `window.*` shims.
2. **profileModal** — lift ~1028 LOC template + open/close. Onboarding logic stays in monolith for now.
3. **Patch IIFE collapse** — extract closure-local helpers (`$`, `qa`, `localDateKey`, `weekStart`, `appState`, `appProfile`, etc.) into `src/utils/dom.js` + `src/utils/dates.js` extension. Lift `logSunlight`, `renderPlanWeightChip`, `renderPlanNextSteps`, `renderCustomRoutineItems` as ordinary modules.

### 8.2 Shell swap (~2-3 hr)

Replace `index.html` with ~30-line shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
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

Update `src/main.js` bootstrap:
1. Load profile + state + diary + training + fasting + custom foods + photos
2. Hoist `window.profile`, `window.state`, `window.foodDiary` (bridge for any straggler reads)
3. Call `modals.mountAll()`
4. Mount UI shell + nav (lift from monolith)
5. Call `installSwitchTab()` (orchestrator from slice 5)
6. Register service worker (Step 4 of original plan)

Delete:
- `sorrel_v1.6.31_final.html` (duplicate backup)
- `test/` folder
- Monolith inline HTML (modals + tab content)
- Monolith JS: tab renders (`renderFoodDiary`, `updateMainPagePlanner`, `renderDynamicShopping`), lifted helpers, patch IIFE guards
- 24 smoke functions

### 8.3 PWA + flip GH Pages (Step 4 + Final flip)

- `public/manifest.webmanifest`, `src/pwa/sw.js`, service worker registration in `main.js`
- Settings: export/import backup (Step 5)
- Change `.github/workflows/deploy.yml` trigger from `workflow_dispatch` to `push: main`
- Switch repo Pages source to "GitHub Actions"

---

## Verification commands

```bash
pnpm.cmd run build      # green after each step
pnpm.cmd run preview    # serve dist/ for tab walkthrough
pnpm.cmd run dev        # hot-reload dev server

git status; git diff --stat
```

Browser smoke (after slice 8 cutover):
- Open each tab → tab content renders
- Open each modal from its trigger → renders + closes + form submits
- localStorage writes persist (profile, custom foods, diary, exercise log, photos, trial, fasting)
- Cross-tab callbacks fire (log food → diary updates + plan rings refresh)

Build size targets (after slice 8):
- `index.html` shell: ~3 KB
- `index.css`: 17 KB
- `index.js` entry: ~70 KB
- Vendor chunks: chart 200 KB, quagga 154 KB
- **Total initial**: ~440 KB (down from 1.88 MB)

---

## Key file paths

- Slice 7 plan (canonical): `C:\Users\abark\.claude\plans\next-session-md-replicated-hoare.md`
- Full refactor plan: `C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`
- This handoff: `NEXT_SESSION.md`
- Project instructions: `CLAUDE.md`
- Monolith (still live): `index.html`
- Build config: `vite.config.js`
- Deploy workflow: `.github/workflows/deploy.yml`

---

## Path / shell notes

- Git Bash uses `/mnt/c/Users/abark/OneDrive/fitness_app/` (WSL prefix). Project CLAUDE.md says `/c/` but `/c/` resolves to a no-such-directory error; `/mnt/c/` is what works.
- `sed` and `awk` fail with absolute `/mnt/c/...` paths in this RTK environment; use relative paths from `pwd` instead.
- Always run `pnpm.cmd`, `npx.cmd`, `npm.cmd` (Windows). Bare `pnpm` fails from Git Bash.

## Design decisions (don't relitigate)

1. **Bridge pattern.** `window.Sorrel.{namespace}` for lifted modules + `window.X` shims for cross-tab helpers + modal templates auto-mount via `ensureMounted`.
2. **Behavior-preserving.** Every existing feature works after rewrite.
3. **No automated tests.** Manual browser smoke only.
4. **GitHub Pages stays on `main / root`** until slice 8 ships. Workflow `workflow_dispatch` only. Switch to GitHub Actions source + `push: main` AFTER slice 8.
