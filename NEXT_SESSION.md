# Sorrel Refactor — Next Session Handoff

Picks up where last session ended. Refactor plan canonical at
`C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`.

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
  ~40 `window.*` shims. Build green: 66 modules, 271 KB main bundle.
  Browser smoke not run this session.
- **Session 8** — 8.2b prep. V1622 weekly plan modal reconciled: rewrote
  `src/ui/modals/weeklyPlan.js` (239 → 397 LOC) from V1622 IIFE body.
  V1628 budget shims + V1629 vegan classifier shims added to main.js.
  Build green: 66 modules, 277 KB / 68 KB gzip.
- **Session 9** — Slice 8.2b shell swap complete. Created `src/ui/shell.js`
  (1,298 LOC) with nav + all 8 tab section HTML skeletons extracted verbatim
  from monolith L2640–3930. Updated `src/main.js`: mountShell() + installSwitchTab()
  + switchTab(initialTab) wired; 3 cheap shims added. index.html: removed
  L2640–3930 (nav + sections), replaced with `<div id="app"></div>` — shrunk
  from 40,265 to 38,975 lines. Build green: 77 modules, 390 KB / 92 KB gzip.
  Browser smoke: **ALL PASSED**.

  **Key architectural facts:**
  - index.html structure post-session-9: L1–2639 (head + modal HTML),
    L2640 (`<div id="app"></div>`), L2641–31,868 (main app JS body),
    L31,869–38,975 (IIFE patches — now deleted in session 10).
  - Main app JS body still has all original functions: `changeDiaryDate`
    (L10851), `openFoodSearch` (L11359), `ensureAdaptiveState` (L17094),
    `getLoggingStreak` (L17125), `getEffectiveMacrosForToday` (L19432).
    Cannot delete until lifted.
  - renderFoodDiary() + other tab renders do PARTIAL updates (getElementById),
    not innerHTML rebuild — shell.js MUST provide full skeleton.

- **Session 10** — Slice 8.3 lifts + IIFE deletion. Lifted recovery helpers
  (`ensureRecoveryState`, `computeRecoveryBaseline`, `getRecoveryLevel`) into
  `src/features/training.js`; updated `getTodaysIntensityRecommendation` to use
  local `getRecoveryLevel` instead of `window.getRecoveryLevel`. Lifted
  `renderHealthRecovery` into `src/ui/exercise.js`. Lifted
  `parseIngredientString`, `aggregateIngredients`, `calculateWeeklyIngredients`,
  `groupItemsBySelectedStores`, `generateShoppingList`,
  `analyzeStoreRecommendations` into `src/features/shopping.js`;
  `buildItemsFromWeekPlan`/`shoppingItems` updated to use local fns. Added 5
  new `window.*` shims to `main.js` (`generateShoppingList`,
  `parseIngredientString`, `analyzeStoreRecommendations`, `getRecoveryLevel`,
  `renderHealthRecovery`). **Deleted all 19 IIFE patch blocks** (L31,869–L38,973,
  7,105 lines) from index.html. Build green: 77 modules, 1,315 KB / 303 KB gzip
  (was 1,769 KB / 411 KB, −454 KB). **Browser smoke NOT run this session —
  must do before next commit.**

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
    diary.js   diet.js                  ✓
    fasting.js plan.js                  ✓ plan extended: getDayKey, getDayData
    coaching.js                         ✓ nextMeal, nextRoutineAction, nextLogAction, usefulLogsLeft
    customRoutine.js                    ✓ CRUD + installCustomRoutineHandlers
    hydration.js                        ✓ hydrateCount + 5 actions
    recipes.js                          ✓ mealForSlot, recipeDbs, ingredientFor
    shopping.js                         ✓ purchaseCost/weeklyCost/pantryHas/normalizeItems/
                                            buildItemsFromWeekPlan/shoppingItems (V165) +
                                            session 10: parseIngredientString, aggregateIngredients,
                                            calculateWeeklyIngredients, groupItemsBySelectedStores,
                                            generateShoppingList, analyzeStoreRecommendations
    progress.js                         ✓
    training.js                         ✓ getIntensityRecommendation, getTodaysIntensityRecommendation +
                                            session 10: ensureRecoveryState, computeRecoveryBaseline,
                                            getRecoveryLevel
    trial.js                            ✓ TRIAL_DAYS, ensureTrialState, getTrialDaysLeft,
                                            isAdaptiveUnlocked, saveTrialState, checkTrialExpiry
    routine.js                          ✓ getHydrationSchedule
    sunlight.js                         ✓ sunlightMap, logSunlight, renderHealthSunlightStable
    index.js                            ✓ barrel
  state/
    appState.js  index.js  profile.js   ✓
    accessors.js                        ✓ appState/appProfile/saveAll/saveQuiet/saveProfileQuiet
  styles/main.css                       ✓ slice 6
  ui/
    topbanner.js  premium.js routine.js ✓ slice 5
    analytics.js  progress.js           ✓ slice 5
    exercise.js                         ✓ slice 5 + session 10: renderHealthRecovery
    diary.js  plan.js  shopping.js      ✓ slice 5
    render.js                           ✓ slice 5 orchestrator + installSwitchTab
    shell.js                            ✓ session 9: nav + all 8 tab skeletons (1,298 LOC)
    helpers/
      toast.js                          ✓ showLogToast, showUndoToast, toast() alias
      banners.js                        ✓ updateBaselineBanner, updateTrialBanner,
                                            updateTrainRecoveryBanner, updateIntelligenceBanners
      stats.js                          ✓ updateStats
      index.js                          ✓ barrel
    modals/
      helpers.js                        ✓ ensureMounted, openById, closeById
      customFood.js                     ✓ template + open + close
      swap.js                           ✓ recipe/breakfast/lunch/snack + showSwapModal (day-level)
      recipeRating.js                   ✓ template + close
      exercise.js                       ✓ addCardio + addStrength templates
      food.js                           ✓ foodSearch + foodDetail templates
      barcode.js                        ✓ template + close
      imageRecognition.js               ✓ template + close
      photoComparison.js                ✓ template + close
      paywall.js                        ✓ showPaywallModal factory
      weeklyPlan.js                     ✓ open/closeWeeklyPlanModal (V1622 reconciled)
      voiceLog.js                       ✓ renderVoiceLogModal
      aiPhotoLog.js                     ✓ openAIPhotoLog entry only
      profile.js                        ✓ 1021-line template + open/close
      index.js                          ✓ barrel + mountAll()
  utils/
    dates.js                            ✓ todayISO, toLocalISO, localDateKey, weekStart, plusDays
    html.js                             ✓ esc alias
    dom.js                              ✓ $, qa, byId
    format.js                           ✓ money
    time.js                             ✓ fmtTime/minutes24/timeToMinutes/toInputTime/parseDisplayTime
  main.js                               ✓ imports CSS, wires window.Sorrel + ~45 window.* shims,
                                            calls modals.mountAll() + installCustomRoutineHandlers()
                                            + mountShell() + installSwitchTab() at bootstrap
```

---

## What's still in the monolith

### index.html current state (session 10)

- **31,870 lines** (was 38,975 after session 9, 40,265 original)
- L1–2639: head + modal HTML (still monolith-owned)
- L2640: `<div id="app"></div>` (shell)
- L2641–31,868: main app JS body (~29K LOC, all original functions)
- L31,869–31,870: `</body></html>`
- **All 19 IIFE patch blocks deleted.**

### Main app body (L2641–31,868) — cannot delete until lifted

Tab renders (lifted to `src/ui/` but dormant; monolith copies still run):
- Diary tab (`renderFoodDiary`, `renderMealFoods`, swipe-delete, multi-add) ~3,000 LOC
- Plan tab (`updateMainPagePlanner`, grids, optimizer, `calculateMealRotation`) ~5,500 LOC
- Shopping tab (`renderDynamicShopping`, pantry, store, delivery) ~2,000 LOC

Cross-tab helpers still in monolith body (not yet lifted):
- `getEffectiveMacrosForToday`, `getLoggingStreak`, `ensureAdaptiveState`
- `renderMorningStrip`, `renderTopBanner`, `getMealTimingGuide`
- `renderHydrationSchedule`, `renderHealthSunlight`
- `getTrendWeight`, `renderProgress`, `renderProgressTab`
- `swapMeal`, `viewRecipe`
- save/load profile beyond `state/profile.js`
- trial subsystem caller sites (`showPaywallModal`, `subscribePro`)
- `changeDiaryDate`, `openFoodSearch` and hundreds more original functions

Note: `renderHealthRecovery`, `generateShoppingList`, `analyzeStoreRecommendations`,
`parseIngredientString` still exist in monolith body but are now shadowed by
`window.*` shims from `src/main.js` (module loads last, overrides win).

### Modals

| Modal | Module | Status |
|---|---|---|
| `paywallModal` | src/ui/modals/paywall.js | ✓ Lifted complete |
| `weeklyPlanModal` | src/ui/modals/weeklyPlan.js | ✓ Lifted + V1622 reconciled |
| `swapModal` (day-level) | src/ui/modals/swap.js | ✓ Lifted complete |
| `voiceLogModal` | src/ui/modals/voiceLog.js | ✓ Lifted complete |
| `aiPhotoLogModal` | src/ui/modals/aiPhotoLog.js | ✓ Entry only (downstream deferred) |
| `profileModal` | src/ui/modals/profile.js | ✓ Template only (1021 LOC) |

### Still deferred

- **aiPhotoLog downstream** — `handleAIPhotoFile`, `resizeImageForAI`,
  `callAIPhotoAnalysis`, `showAIPhotoReview`, `confirmAIPhotoLog`,
  `escapeAIText`, `updateAIPhotoTotals`. Need to factor `aiPhotoSession`
  + `AI_PHOTO_CONFIG` into module state.
- **profileModal inline `<script>`** — nextPage/prevPage/saveProfile
  placeholders. Extract to `src/ui/modals/profile-controller.js`.

---

## Slice 8.3 remaining work

### 1. Browser smoke (BLOCKING — do first)

IIFEs deleted this session — unknown if any critical event handlers were lost.
Must verify before committing:
- Open each tab → tab content renders
- Exercise tab: recovery section renders
- Shopping tab: generateShoppingList produces items
- Open each modal from trigger → renders + closes
- localStorage writes persist

### 2. PWA

- `public/manifest.webmanifest`
- `src/pwa/sw.js`
- Service worker registration in `src/main.js`

### 3. GH Pages flip

- Change `.github/workflows/deploy.yml` trigger: `workflow_dispatch` → `push: main`
- Switch repo Pages source to "GitHub Actions"

### 4. Long tail (post-ship, not blocking)

Lift remaining ~29K LOC main app body to reach true thin shell. Major items:
- `renderFoodDiary` + diary helpers (~3K LOC) → `src/ui/diary.js`
- `updateMainPagePlanner` + plan helpers (~5.5K LOC) → `src/ui/plan.js`
- `renderDynamicShopping` + shopping UI (~2K LOC) → `src/ui/shopping.js`
- All cross-tab helpers listed above → appropriate `src/features/` modules
- `changeDiaryDate`, `openFoodSearch`, etc. → domain modules
- Strip modal HTML from head (L1–2639) once `modals.mountAll()` fully covers all

True thin shell target: `index.html` ~30 lines.

---

## Build size history

| After session | index.html | gzip |
|---|---|---|
| Session 9 (shell swap) | 1,769 KB | 411 KB |
| Session 10 (IIFE delete) | 1,315 KB | 303 KB |
| Target (thin shell) | ~3 KB | — |

---

## Verification commands

```bash
pnpm.cmd run build      # green after each step
pnpm.cmd run preview    # serve dist/ for tab walkthrough
pnpm.cmd run dev        # hot-reload dev server
```

---

## Key file paths

- Full refactor plan: `C:\Users\abark\.claude\plans\how-would-you-improve-mighty-rabbit.md`
- This handoff: `NEXT_SESSION.md`
- Project instructions: `CLAUDE.md`
- Monolith (still live): `index.html`
- Build config: `vite.config.js`
- Deploy workflow: `.github/workflows/deploy.yml`

---

## Path / shell notes

- Bash tool runs in Git Bash context. Working dir: `/c/Users/abark/OneDrive/fitness_app`.
- Use relative paths for `sed`/`awk`/`grep` — absolute paths fail via RTK.
- Always run `pnpm.cmd`, `npx.cmd`, `npm.cmd`. Bare `pnpm` fails: RTK spawns
  processes directly (not via bash shell), so shell script wrappers fail. `pnpm.cmd`
  is a Win32 binary RTK can spawn.
- If something does not work, stop. Ask.

## Design decisions (don't relitigate)

1. **Bridge pattern.** `window.Sorrel.{namespace}` for lifted modules + `window.X`
   shims for cross-tab helpers + modal templates auto-mount via `ensureMounted`.
2. **Behavior-preserving.** Every existing feature works after rewrite.
3. **No automated tests.** Manual browser smoke only.
4. **GH Pages** stays on `main / root` until slice 8.3 ships.
   Workflow `workflow_dispatch` only until then.
