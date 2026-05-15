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

- **Session 11** — PWA + GH Pages auto-deploy. Created `public/manifest.webmanifest`
  (name/scope/theme for `/fitness_app/`), `public/sw.js` (cache-first service worker,
  `sorrel-v1`). Added SW registration to `src/main.js` via `import.meta.env.BASE_URL`.
  Fixed stale `manifest-personalized.json` ref in `index.html` L10. Changed
  `.github/workflows/deploy.yml` trigger from `workflow_dispatch`-only to
  `push: branches: [main]` + `workflow_dispatch`. Browser smoke passed. Build green:
  1,314 KB / 302 KB gzip. **One manual step remaining**: repo Settings → Pages → Source
  → "GitHub Actions" (if not done yet).

- **Session 12** — Long-tail cross-tab helper lifts. Added `getLoggingStreak` to
  `src/features/progress.js` (reads `getDiary()` instead of `foodDiary` global).
  Added `getEffectiveMacrosForToday` to `src/features/training.js` (reads
  `appState()`/`appProfile()` via accessors). Added `getMealTimingGuide` to
  `src/ui/plan.js` (profile-aware HTML generator). Wired `window.renderProgress`,
  `window.renderProgressTab` shims to already-lifted `src/ui/progress.js`
  (`renderPatternBadge`, `renderProgressTab`). Added `window.renderMorningStrip`
  inline no-op shim. Build green: 443 KB / 108 KB gzip main bundle.

- **Session 13** — Wired dormant module functions as live window.* overrides.
  Added `window.updateMainPagePlanner` → `src/ui/plan.js#updateMainPagePlanner`
  (plan tab now driven by module). Added `window.ensureAdaptiveState` →
  `progress.ensureAdaptiveState`. Added `window.changeDiaryDate` →
  new `src/ui/diary.js#changeDiaryDate` (dual-writes module + `window.foodDiary`
  so monolith food-log functions stay in sync). Added `window.renderFoodDiary`,
  `window.renderMealFoods`, `window.updateMacroSummary` → already-lifted
  `src/ui/diary.js` functions. Added `window.renderDynamicShopping` →
  already-lifted `src/ui/shopping.js#renderDynamicShopping`.
  Build green: 459 KB / 112 KB gzip main bundle.
  **Browser smoke required before next commit.**

- **Session 14** — Long-tail monolith body deletion + B1 lift + assessment bug fixes.
  Deleted 3,156 LOC dead shimmed copies from monolith (31,870 → 28,695):
  A1 diary render block, A2 plan render block (~5.5K LOC), A3 shopping render
  block (~2K LOC). Lifted `openFoodSearch` → `src/ui/diary.js` + `window.openFoodSearch`
  shim; deleted monolith copy. Added `window.foodDiary = foodDiary` bridge in
  index.html after `const foodDiary` so module functions can sync state.
  **Three bug fixes uncovered by browser smoke:**
  1. Full assessment never persisted profile to localStorage — old monolith
     `updateMainPagePlanner` read global `profile` var; module version reads
     localStorage. Added `localStorage.setItem('user-profile', JSON.stringify(profile))`
     in `saveProfile` before `closeProfileModal()`.
  2. `closeProfileModal` UI calls wrapped in individual try/catches so one
     failure doesn't block `updateMainPagePlanner`.
  3. `window.ensureAdaptiveState = progress.ensureAdaptiveState` shim broke
     monolith call sites passing no args. Module's `ensureAdaptiveState(state)`
     required state param → `undefined['weightLog']` threw. Wrapped in main.js
     to resolve state from `window.state` || `loadState()`.
  B2 (logPlannedMeal/unlogPlannedMeal) + B3 (deleteFoodEntry) deferred — both
  mutate `foodDiary.entries` directly, need state bridge work.
  Build green: 460 KB / 112 KB gzip main bundle. Browser smoke: plan renders
  after full assessment completion.

- **Session 15** — B2/B3 lift + aggressive monolith sweep (~993 LOC delete net).
  Phase A: lifted `logPlannedMeal`, `unlogPlannedMeal`, `editFoodEntry`,
  `deleteFoodEntry`, `undoLastDelete` + `lastDeletedEntry` → `src/ui/diary.js`
  (self-shims via `window.*`); deleted monolith L10700-10792 + L11116-11193
  (−169). Phase B: deleted 16 dead-shimmed monolith fns (−604) —
  `ensureAdaptiveState`, `getLoggingStreak`, `getTrendWeight`, `renderMorningStrip`,
  `renderProgressTab`, `updateTrainRecoveryBanner`, `updateIntelligenceBanners`,
  `renderTopBanner`, `getRecoveryLevel`, `getEffectiveMacrosForToday`,
  `getMealTimingGuide`, `renderProgress`, `updateStats`, `logSunlight`,
  `renderHealthSunlight`, `renderHealthRecovery`. Phase C: stripped 5 inline
  modal HTML blocks from head (−220) — `recipeRatingModal`, `foodSearchModal`,
  `foodDetailModal`, `barcodeScannerModal`, `imageRecognitionModal`. Modules
  inject via `ensureMounted` / `mountAll`. Build green: 464 KB / 113 KB gzip
  main bundle; index.html: 28,695 → 27,702 LOC (−993).

- **Session 16** — profileModal lift (Phase A + Phase B). Aggressive sweep:
  -1,413 LOC monolith (27,719 → 26,306).
  - **Phase A** (-1,022): Deleted profileModal HTML L1304-2325 (1,022 LOC).
    Rewrote `src/ui/modals/profile.js` to strip 3 embedded `<script>` blocks
    from template. Created `src/ui/modals/profile-controller.js` —
    `nextPage`, `prevPage`, `skipDetailedAssessment` + module-scoped
    `currentPage` + `install()` that wires gender + motivation listeners
    after mount. Added profile.mount() to mountAll. Wired window.* shims
    for the 3 nav fns in main.js.
  - **Phase B** (-391): Lifted `openProfileModal` (L15069-15097),
    `closeProfileModal` (L15099-15147), `closeProfileEditModal`
    (L15803-15812), `openProfileEdit` (L15814-15893) → profile-controller.
    Lifted `checkProfile` (L15149-15364) → new `src/bootstrap/checkProfile.js`.
    All ports use `window.profile = X` (state bridge defineProperty setter
    propagates to monolith `let profile` binding) and `typeof window.X ===
    'function'` checks for downstream UI fns. Wired window.* shims in main.js.
    Deleted monolith bodies.
  - **Build green**: 1,045 KB / 241 KB gzip (-90 KB from session 15.1).
    Main bundle 510 KB / 124 KB (+10 KB for added module code).
  - **Browser smoke deferred** — accepted intermediate-state risk per
    aggressive-sweep roadmap. Next-session pre-commit smoke required.
  - **Remaining profile work**: `saveProfile` (L17352 → ~L16930 after
    delete) still in monolith. ~348 LOC. Heaviest fn — touches 47 form
    fields + state mutations. Plan: Session 17 lifts to features/assessment.js
    along with detectPatternFromProfile + generateOptimalWeek + helpers.

- **Session 15.1** — Window state bridge regression fix uncovered by browser smoke.
  Phase B sweep promoted modules to authoritative but they read
  `window.state` / `window.profile` / `window.foodDatabase` — all three were
  script-scoped (`let`/`const` in classic `<script>`), never on `window`. Added
  in `index.html`:
  - `Object.defineProperty` accessors after `let profile = null` (L8492) so
    `window.state` / `window.profile` track the let bindings across all
    reassignment sites (13 sites combined).
  - Plain `window.foodDatabase = foodDatabase` after the const decl (L4388).

  Also caught 2 missed Phase B shims via smoke — handoff claimed
  `renderTopBanner` + `getTrendWeight` were shadowed but the `window.*`
  assignments were never wired. Added to `src/main.js`:
  - `import { renderTopBanner } from './ui/topbanner.js'` (was side-effect import).
  - `window.renderTopBanner = renderTopBanner;`
  - `window.getTrendWeight = () => progress.getTrendWeight(window.state, window.profile);`
    (module signature takes args; monolith bare-callers don't pass them).

  Browser-MCP smoke retest — all originally-failing items pass:
  | Check | Result |
  |---|---|
  | #1 logPlannedMeal | click → entry +1 in diary today |
  | #1 idempotence | double-click → still 1 entry |
  | #10 weight chip | click → `weightLogModal` mounts |
  | #13 top banner | display:block, 1061 chars (baseline banner) |
  | #14 recovery | `renderHealthRecovery` → 5722 chars in `train-recovery-content` |
  | #17 stats | hydration `0/8`, evening `0/11`, days-active `1` |
  | #20 ensureAdaptiveState | returns object, `weightLog` array |
  | console errors | 0 |

  Build green: 464.40 KB / 113.08 KB gzip. index.html: 27,702 → 27,716 (+14).

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
    progress.js                         ✓ photos + weight helpers (ensureAdaptiveState, getTrendWeight,
                                            get7DayAverage, getWeeklyWeightChange, projectGoalDate) +
                                            session 12: getLoggingStreak
    training.js                         ✓ getIntensityRecommendation, getTodaysIntensityRecommendation +
                                            session 10: ensureRecoveryState, computeRecoveryBaseline,
                                            getRecoveryLevel +
                                            session 12: getEffectiveMacrosForToday
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
    diary.js  shopping.js               ✓ slice 5
    plan.js                             ✓ slice 5 + session 12: getMealTimingGuide
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
  main.js                               ✓ imports CSS, wires window.Sorrel + ~55 window.* shims,
                                            calls modals.mountAll() + installCustomRoutineHandlers()
                                            + mountShell() + installSwitchTab() at bootstrap;
                                            SW registration via import.meta.env.BASE_URL + 'sw.js'
```

---

## What's still in the monolith

### index.html current state (session 15.1)

- **27,716 lines** (was 28,695 after session 14, 40,265 original — net −12,549 / −31%)
- L1–~1305: head + CSS + manifest links
- L1305–~2380: profileModal HTML (~1075 LOC) — still inline; inline `<script>` blocks lift
- L~2380–~2640: minor inline modal stubs + nav styles + `<div id="app"></div>`
- L2641–27,714: main app JS body (~25K LOC)
- L27,715–27,716: `</body></html>`
- **All 19 IIFE patch blocks deleted (session 10).**
- **A1/A2/A3 dead shimmed blocks deleted (session 14, 3,156 LOC).**
- **B2/B3 food mutation fns deleted (session 15, 169 LOC).**
- **16 dead-shim fns deleted (session 15, 604 LOC).**
- **5 inline modal HTML blocks deleted (session 15, 220 LOC).**
- **3 window bridges added (session 15.1) — `state`/`profile` accessors + `foodDatabase` plain assign.**

### Main app body (L2641–27,714) — cannot delete until lifted

Tab renders + food actions — **all deleted in earlier sessions**:
- ~~Diary tab~~ (A1, 508 LOC, session 14)
- ~~Plan tab~~ (A2, ~5.5K LOC, session 14)
- ~~Shopping tab~~ (A3, ~2K LOC, session 14)
- ~~`logPlannedMeal` / `unlogPlannedMeal`~~ (session 15)
- ~~`editFoodEntry` / `deleteFoodEntry` / `undoLastDelete`~~ (session 15)

Cross-tab helpers still in monolith body (not yet lifted):
- `renderHydrationSchedule` (depends on un-lifted `toggleHydration` — deferred)
- `swapMeal`, `viewRecipe` (complex, deferred)
- `openWeightLogModal` (still monolith — built modal dynamically)
- `getWeeklyWeightChange`, `computeRecoverySignal`, `getCurrentWeekKey`, etc.
- `selectFood`, `addFoodToMeal`, `searchFoodsWithRemote` + food-search machinery
- `checkProfile`, `openQuickStartModal`, `detectPatternFromProfile`,
  `rehydrateMealMethods` (assessment + onboarding flow)
- `subscribePro`, `dismissTopBanner` and other trial / banner callbacks
- hundreds more original functions

Shadowed by `window.*` shims (module overrides authoritative, monolith inert
— OR monolith copy already deleted in session 15):
- ~~Session 15 deletes:~~ `ensureAdaptiveState`, `getLoggingStreak`,
  `getTrendWeight`, `renderMorningStrip`, `renderProgressTab`,
  `updateTrainRecoveryBanner`, `updateIntelligenceBanners`, `renderTopBanner`,
  `getRecoveryLevel`, `getEffectiveMacrosForToday`, `getMealTimingGuide`,
  `renderProgress`, `updateStats`, `logSunlight`, `renderHealthSunlight`,
  `renderHealthRecovery`.
- Still shadowed (monolith copy still present): `renderFoodDiary`,
  `renderMealFoods`, `updateMacroSummary`, `changeDiaryDate`,
  `renderDynamicShopping`, `updateMainPagePlanner`, `generateShoppingList`,
  `analyzeStoreRecommendations`, `parseIngredientString`. Safe to delete in
  a future sweep.

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

## Slice 8.3 status

Items 1–3 complete (sessions 11–12). Remaining: long tail only.

### Remaining distance to thin shell

- **Now:** 27,716 LOC
- **Target:** ~30 LOC (single `<div id="app"></div>` + `<script type="module">` + minimal head)
- **Remaining:** ~27,686 LOC (≈99% by line count, but per-fn cost drops as
  more cross-tab helpers move to modules — the long tail is mostly small fns).

Major next-slice candidates (rough sizing):
- **`profileModal` HTML + inline `<script>`** (~1075 LOC) — biggest single deletable
  chunk. Extract `nextPage`/`prevPage`/`saveProfile` controller to
  `src/ui/modals/profile-controller.js`, then strip inline HTML.
- **`openWeightLogModal` + weight modal subsystem** (~150 LOC) — dynamic modal
  builder; lift to `src/ui/modals/weightLog.js`.
- **`checkProfile` + assessment dispatch** (~300 LOC) — onboarding entry point;
  most of its branches are already handled by modules.
- **Food search supporting fns** (`selectFood`, `addFoodToMeal`,
  `searchFoodsWithRemote`, `closeFoodSearch`, food-detail nutrition update, etc.)
  — couple thousand LOC clustered around L9000–11500.
- **Already-shadowed monolith fns** (~1000 LOC, sweep #2):
  `renderFoodDiary`, `renderMealFoods`, `updateMacroSummary`, `changeDiaryDate`,
  `renderDynamicShopping`, `updateMainPagePlanner`, `generateShoppingList`,
  `analyzeStoreRecommendations`, `parseIngredientString`. All have `window.*`
  shims pointing at modules — copies inert. Same pattern as session 15 Phase B.
- **`swapMeal`, `viewRecipe`** + meal-rotation machinery (~1.5K LOC).
- **`getWeeklyWeightChange`, `computeRecoverySignal`, `computeWeeklyAdjustment`**
  (already in modules but monolith copies remain) — small batch sweep.
- **Trial / paywall caller sites** (`subscribePro`, `dismissTopBanner` etc.) — ~500 LOC.
- **Remaining cross-tab event handlers + hundreds of small fns.**

Rough scoping: 4–6 sessions of similar volume to slice 15 reach <5K LOC. Then
a final pass strips remaining helpers + comments + dead state.

---

## Build size history

| After session | index.html | gzip |
|---|---|---|
| Session 9 (shell swap) | 1,769 KB | 411 KB |
| Session 10 (IIFE delete) | 1,315 KB | 303 KB |
| Session 11 (PWA) | 1,314 KB | 302 KB |
| Session 12 (cross-tab lifts) | 1,314 KB | 302 KB (main bundle +12 KB) |
| Session 13 (wire dormant shims) | 1,314 KB | 303 KB (main bundle 459 KB / 112 KB) |
| Session 14 (long-tail delete + B1 + bug fixes) | 1,183 KB | 270 KB (main bundle 460 KB / 112 KB) |
| Session 15 (B2/B3 + dead-shim sweep + modal strip) | 1,135 KB | 258 KB (main bundle 464 KB / 113 KB) |
| Session 15.1 (window bridge + missed shims) | 1,135 KB | 258 KB (main bundle 464 KB / 113 KB) |
| Target (thin shell) | ~3 KB | — |

---

## GitHub Pages — start, use, update

### One-time setup (do once, if not done)

1. Push this branch to `main` (or merge PR into `main`).
2. Go to **https://github.com/jackcontrol/fitness_app/settings/pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch").
4. Save. Done. GH Pages now auto-deploys on every push to `main`.

### Live site URL

**https://jackcontrol.github.io/fitness_app/**

Open in any browser. Works on mobile too — visit URL, tap "Add to Home Screen" for app icon.

### How to update the site

Every push to `main` triggers a deploy. Workflow:

```bash
# 1. Make your changes locally
# 2. Build to verify nothing broke
pnpm.cmd run build

# 3. Commit
git add <files>
git commit -m "your message"

# 4. Push to main — deploy runs automatically
git push origin main
```

Deploy takes ~60–90 seconds. Watch progress at:
**https://github.com/jackcontrol/fitness_app/actions**

### Manual deploy (without a push)

Go to **https://github.com/jackcontrol/fitness_app/actions/workflows/deploy.yml**
→ Click **Run workflow** → **Run workflow**. Useful for re-deploying without a code change.

### Local dev

```bash
pnpm.cmd run dev        # hot-reload dev server — open the URL it prints
pnpm.cmd run preview    # serve built dist/ locally (closest to prod)
pnpm.cmd run build      # build only, no server
```

### PWA / offline (session 11 addition)

- Manifest: `/fitness_app/manifest.webmanifest`
- Service worker: `/fitness_app/sw.js` (cache-first, all GET requests)
- Cache version key: `sorrel-v1` in `public/sw.js` — bump to `sorrel-v2` etc. to force cache refresh on next deploy

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

- Bash tool runs in WSL context. Working dir: `/c/Users/abark/OneDrive/fitness_app`.
- Use relative paths.
- `pnpm --version` works bare (RTK intercepts). But `pnpm run build/dev/preview` must
  use `pnpm.cmd` — bare `pnpm run X` fails because WSL's `sh` can't find node when
  spawning the vite script. `pnpm.cmd` is a Windows batch file that runs entirely in
  cmd.exe context where node is available.
- If something does not work, stop. Ask.

## Design decisions (don't relitigate)

1. **Bridge pattern.** `window.Sorrel.{namespace}` for lifted modules + `window.X`
   shims for cross-tab helpers + modal templates auto-mount via `ensureMounted`.
2. **Behavior-preserving.** Every existing feature works after rewrite.
3. **No automated tests.** Manual browser smoke only.
4. **GH Pages** auto-deploys on push to `main` (session 11). Live at
   https://jackcontrol.github.io/fitness_app/. Set Pages source to "GitHub Actions"
   in repo settings if not done yet.
