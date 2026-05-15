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

- **Session 16** — profileModal lift (Phase A + Phase B). 27,719 → 26,306 (-1,413).
  Phase A (-1,022): deleted profileModal HTML L1304-2325. Rewrote
  `src/ui/modals/profile.js` to strip 3 embedded `<script>` blocks. New
  `src/ui/modals/profile-controller.js` with `nextPage`/`prevPage`/`skipDetailedAssessment`
  + module-scoped `currentPage` + `install()` (wires gender + motivation listeners
  post-mount). Phase B (-391): lifted `openProfileModal`, `closeProfileModal`,
  `closeProfileEditModal`, `openProfileEdit` → profile-controller; lifted
  `checkProfile` → new `src/bootstrap/checkProfile.js`. State writes via
  `window.profile = X` (Object.defineProperty bridge propagates). Build green
  1,045 KB / 241 KB gzip. Browser smoke deferred per aggressive-sweep policy.

- **Session 17** — Profile region finish. 26,306 → 24,840 (-1,466).
  New `src/features/assessment.js`: `submitProfileAssessment` (47-field form
  submit, renamed to avoid clash with state-mod `saveProfile`),
  `detectPatternFromProfile`, `generateOptimalWeek` + filterMealsByCuisine +
  selectMealsForDay + optimizeWeekForBudget, `rehydrateMealMethods`, 5 calc
  utils (BMR/activity/hydration/calories/macros), `updateHeaderWithProfile`.
  New `src/ui/modals/quickStart.js`: `openQuickStartModal` + qsPick +
  commitQuickStart, `browseAnonymously`, `openQuickGoalModal` +
  selectQuickGoalPace + saveQuickGoal. main.js wired ~18 window shims +
  recipe DB imports (breakfastRecipes/lunchRecipes/recipes/snackOptions) +
  calculateWeeklyIngredients + saveState + todayISO shims. Monolith got
  `window.shoppingCategories` shim + `window.calculateMealMacros` shim for
  module consumption. 5 batches deleted with build-green between each.
  4 bare-name call sites in remaining monolith rewritten to `window.*`.
  Committed `f8f9448 Session 17`.

- **Session 19** — 9-batch aggressive sweep. 24,071 → 22,327 (−1,744 / −7.2%).
  - **A** (-222): Lifted `subscribePro` + `updateTrialBanner` → `src/features/trial.js`.
    Wired `window.showPaywallModal` = `modals.paywall.showPaywallModal`. Deleted
    monolith trial cluster (L7490–7690) + `dismissTopBanner` (already lifted to
    `src/ui/topbanner.js`).
  - **B** (-218): Weight subsystem. Added `getCurrentWeekKey` to
    `src/utils/dates.js`. Wrapped `window.logWeight` / `get7DayAverage` /
    `getWeeklyWeightChange` / `projectGoalDate` over `progress.*`. Deleted
    monolith bodies + dead-duplicate `computeWeeklyAdjustment` /
    `computeRecoverySignal` / `dismissWeeklyAdjustment` / `dismissRecoveryBanner`
    (already in topbanner.js).
  - **C** (-73): Added `renderHydrationSchedule` + `toggleHydration` →
    `src/features/hydration.js`. Used `appState()` / `appProfile()` accessors +
    `getHydrationSchedule` import from routine.
  - **D** (-67): `calculateMealMacros` → `src/features/recipes.js` (signature
    takes profile). `estimateMealCost` → `src/features/budget.js`.
  - **E** (-332): New `src/ui/mealPlanner.js` with `renderMealPlanner`,
    `swapBreakfastForDay`, `closeBreakfastSwapModal`, `recalculateRotation`,
    `renderBudgetTracker`, `renderBudgetOptimizationPanel`. Internal deps
    (`calculateWeeklyBudget`, `distributeRemainingMacros`,
    `calculateMealRotation`, `runBudgetOptimization`, `applySuggestion`,
    `displayStarRating`, `getRecipeRating`, `openRatingModal`,
    `openBreakfastSwapForDay`) still routed via `window.*` (deferred to S20).
  - **F** (-101): `maybeRecalibrate` → `src/features/progress.js`. Added
    `getAdherenceScore(state, days)` sibling. Window wrapper persists state +
    profile + triggers `updateMacroSummary` / `updateMainPagePlanner` UI
    refresh on adjustment.
  - **G** (-95): Food-search support cohort → `src/ui/foodSearch.js`.
    `ensureDateEntry`, `saveFoodDiary`, `addToRecent`, `refreshAfterFoodLog`,
    `showAllFoods`, `setActiveTab`, `updateFoodDetailNutrition`,
    `closeFoodDetail` — all operate on `window.foodDiary` bridge.
  - **H** (-373): New `src/api/openFoodFacts.js`. Imports `OFF_CONFIG` from
    `src/data/api-config.js`. Exports `offLoadPersistentCache`,
    `offSavePersistentCache`, `normalizeOFFProduct`, `offLookupBarcode`,
    `offSearchByText`, `offSearchByTextDebounced`, `logFoodByBarcode`,
    `offCacheStats`, `offClearCache`. Cache state module-scoped (Maps).
    Deleted monolith block L7628–8000.
  - **I.1** (-147): Plain-deleted `/* DEAD CODE */` comment block containing
    `matchProtocol_DEPRECATED` (L16141–16287).
  - **I.2** (-13): `calculateRedFlagScore` → `src/features/assessment.js`.
  - **I.3** (-125): `fillDemoData` → `src/features/assessment.js` (DOM-only
    form filler).
  - **Deferred to S20**: rest of assessment cohort (`selectTrainingProtocol`
    540 LOC, `getTrainingSchedule` 460, `showResults` 372, `matchProtocol`
    + downstream) — all reference monolith `ELITE_PROTOCOL_DATABASE` const
    duplicate (1,381 LOC, already lifted to `src/data/protocols.js`). Lift
    + window.ELITE_PROTOCOL_DATABASE bridge will unlock removing the dup.
  - Build green between each batch. **Browser smoke deferred per
    aggressive-sweep policy — required before commit.**
  - Build: main bundle 595 KB / 147 KB gzip; dist index.html 876 KB / 200 KB
    gzip.
  - 5 new modules added: `src/ui/mealPlanner.js`,
    `src/api/openFoodFacts.js` (the rest extend existing modules).
  - ~25 new window shims wired in `src/main.js`.

- **Session 20** — **NUCLEAR**: monolith JS body deleted in one cut.
  22,327 → 1,400 (−20,927 / −93.7%). dist/index.html: 875 KB → 32 KB.

  Bridge pattern abandoned per user directive ("shit or get off pot — not a
  production site"). Site no longer needs the two-copy bridge.

  **What changed:**
  - `index.html` L1399 (`<script>` open) through L22325 (`</script>` close)
    deleted via `awk 'NR<1399 || NR>22325'`. 20,927 LOC gone in one shot.
    All `function fooBar()` defs, ELITE_PROTOCOL_DATABASE const dup,
    foodDatabase const dup, deliveryProviders const dup,
    Object.defineProperty(window, 'state'/'profile') bridges — all in one
    block, all gone.
  - `src/main.js`: added imports for `foodDatabase`, `deliveryProviders`,
    `storeInfo`, `ELITE_PROTOCOL_DATABASE`, and the 4 budget calc fns
    (`calculateMealRotation` / `calculateWeeklyBudget` /
    `distributeRemainingMacros` / `runBudgetOptimization` — already exported
    by `src/ui/plan.js`, just never wired). Bootstrap now also calls
    `loadAccessors()`, `diary.loadDiary()`, `training.loadExerciseLog()`,
    `trial.ensureTrialState()`, `checkProfile()`. `window.foodDiary` wired
    to module-owned diary object. `window.safeLocalStorageSet` shimmed
    inline.
  - `src/state/accessors.js`: simplified. `loadAccessors()` is the single
    boot-time init that populates `window.state` / `window.profile` from
    localStorage; `appState()` / `appProfile()` keep their window-reader
    semantics so existing modules continue to work unchanged. Module-owned
    reassignment pattern `window.profile = X` (used in assessment.js,
    quickStart.js, weeklyPlan.js, checkProfile.js) preserved.

  **Build state:**
  - `pnpm.cmd run build` green. Bundle: index.html 32 KB / 8 KB gzip; main
    bundle 655 KB / 167 KB gzip (unchanged — modules didn't shrink).
  - `pnpm.cmd run preview` serves at http://localhost:4180/fitness_app/.

  **Browser smoke RUN end-of-session via claude-in-chrome MCP.** Tab
  http://localhost:4181/fitness_app/. Golden path → all green. Console: 0 app
  errors (only MetaMask extension noise).

  | Check | Result |
  |---|---|
  | Boot — window.state / .profile / .foodDiary / .foodDatabase / .ELITE_PROTOCOL_DATABASE | ✓ populated |
  | Boot — 8 tab nav buttons | ✓ Plan/Diary/Train/Routine/Progress + 3 more |
  | Boot — no profile: welcome screen | ✓ "Welcome to Sorrel · Get Started" |
  | Profile modal — open + fillDemoData + saveProfile | ✓ weekPlan generated, localStorage written, modal closed |
  | Plan tab post-profile | ✓ Today's meals (Eggs+Toast, Bibimbap, Greek Lentil) + macros |
  | Shopping tab | ✓ 42 items, store optimization $68.67 saved (Aldi/Walmart/Costco) |
  | logPlannedMeal('breakfast',0) | ✓ entry +1 in diary, 564/2144 cal, streak "Day 1 logged" |
  | Train tab | ✓ Recovery card, 7-day recovery, HRV logging UI |
  | Progress tab | ✓ 30-day retrospective, weekly review, weight trend |
  | Routine tab | ✓ Sunlight tracking |
  | Top banner (plan-top-banner) | ✓ 1061 chars rendered |
  | Baseline banner | ✓ #baseline-banner present |
  | Trial banner | ✓ #trial-banner present |

  **Known regressions confirmed by smoke (defer to S21):**
  - `unlogPlannedMeal('breakfast', 0)` — runs without error, but entry not
    removed (before=1, after=1). Module behavior diverges from monolith. Fix:
    inspect `src/ui/diary.js#unlogPlannedMeal`.
  - `openWeeklyPlanModal(1)` returns false, toasts "Weekly plan could not be
    repaired. Open Settings → Quick Setup to rebuild your plan." Despite
    `window.profile.weekPlan` having all 7 days populated, the V1622
    `weekPlan()` reader in `src/ui/modals/weeklyPlan.js:310` does not
    recognize the schema. Fix: align reader with assessment.js output schema.
  - `openWeightLogModal()` — modal element mounts but `.active` class never
    added. Modal not visible. Fix: `src/ui/modals/weightLog.js#openWeightLogModal`.
  - `openFoodSearch('breakfast')` — modal element mounts but `.active` not
    added. Search results never populate. Fix: `src/ui/diary.js#openFoodSearch`
    (or `src/ui/foodSearch.js`).
  - `openProfileEdit()` — `#profileEditModal` element does NOT exist. Module
    fn runs but produces no DOM. Fix: confirm template injection in
    `src/ui/modals/profile-controller.js` or `profile.js#mount`.

  **Known regressions (acceptable — not production, log + defer):**
  - `onclick="openSettingsSheet()"` on top-right gear (head HTML L7-ish in
    `<header>`) — monolith-only fn, click throws. Fix: lift settings sheet
    or rewire.
  - `onclick="openQuickLogSheet()"` on bottom-right FAB — same.
  - `onclick="closeRecipeSwapModal()"` / `closeBreakfastSwapModal()` /
    `closeSnackSwapModal()` / `closeLunchSwapModal()` inside legacy modal
    stubs in head HTML (~10 onclick refs total) — only triggered when the
    legacy modal is open, which now never happens because the openers are
    gone. Dead code, defer to S21 cleanup of head HTML.
  - Modal stubs `<div id="recipeSwapModal">` etc. still in head — never
    shown post-nuke. Safe to delete in S21.
  - AI photo log downstream (handleAIPhotoFile, callAIPhotoAnalysis,
    showAIPhotoReview, etc.) — monolith only, never lifted. Entry modal
    opens but flow breaks at file pick. Defer.
  - Voice log downstream (toggleVoiceListening, showVoiceLogReview, etc.) —
    same. Defer.
  - Exercise tab: addCardioExercise / addStrengthExercise lifted, BUT
    init paths (initExerciseLog, switchExerciseTab, renderCardioList,
    renderStrengthList, calculateTotalCaloriesBurned, updateWeeklyStats,
    setupInstallPrompt) all monolith-only. Exercise tab partially broken
    until lifted. Defer.
  - Cross-tab helpers monolith-only: changeDiaryDate (lifted), copyYesterdayMeal
    (lifted), various small fns. Most have `typeof X === 'function'` guards
    in modules so they silently no-op rather than throw.

  **Next session (S21) priorities:**
  1. Browser smoke + commit if golden path clean.
  2. Sweep head HTML: delete legacy modal stubs `<div id="recipeSwapModal">`
    / `breakfastSwapModal` / `snackSwapModal` / `lunchSwapModal` (~700 LOC
    of HTML in head — already-shadowed by lifted modules).
  3. Lift remaining critical-path fns: `openSettingsSheet`, FAB
    (`openQuickLogSheet`), exercise tab init cluster.
  4. Long tail: AI photo + voice log downstream, settings sub-pages,
    `setupInstallPrompt`, `displayPWAStatus`, partner sharing.
  5. Eventually delete head HTML modal cruft entirely → ~30 LOC target.

- **Session 21** — Aggressive S20 follow-up. 4 phases A/B/C/D in one cut.
  Index.html: 1,400 → 1,354 (−46 / Phase B head sweep). Build green:
  693.96 KB / 176 KB gzip main bundle (+38 KB for new modules).
  Browser smoke RUN via claude-in-chrome MCP at http://localhost:4180/fitness_app/.

  **Phase A — 5 S20 regressions fixed:**
  - `src/ui/diary.js#unlogPlannedMeal` (L795-815) — splice-on-default-array
    bug + name-match mismatch. Plan.js caller sometimes passes empty `meal.name`
    while log-path falls back to capitalized mealType ⇒ name check never
    matched. Dropped name check (slot already filtered by mealType,
    idempotence in log-path guarantees ≤1 _sourcePlan entry per slot).
  - `src/ui/modals/weightLog.js#openWeightLogModal` — added `class="modal"`
    + `classList.add('active')` after appendChild. CSS `.modal.active` rule
    at `src/styles/main.css:179` now applies.
  - `src/ui/diary.js#openFoodSearch` (L716) + `src/ui/foodSearch.js#closeFoodSearch`
    (L6) — switched from `style.display='block'` to `classList.add/remove('active')`.
  - `src/ui/modals/profile-controller.js#openProfileEdit` (L192) — defensive
    `mountProfile()` call if `#profileModal` not in DOM. Static import of
    `mount` from profile.js at top of controller.
  - `weeklyPlan.js` schema — verified at-rest by code-read; all shims wired
    in main.js. S20 smoke msg was misleading (`return false` at L337 is by
    design, prevents inline-onclick default propagation — modal DOES open).

  **Phase B — head HTML cruft sweep (−46 LOC):**
  - Deleted 4 modal stub `<div>`s from `index.html` L1311-1356 (recipeSwap /
    breakfastSwap / snackSwap / lunchSwap), already shadowed by
    `src/ui/modals/swap.js` ensureMounted templates.
  - Added 4 defensive `window.close*SwapModal = () => closeById(...)` shims
    in `src/main.js` (in case stale onclick still fires).

  **Phase C — 6 critical-path lifts (~700 LOC new modules):**
  - NEW `src/ui/modals/settings.js` — `openSettingsSheet` + `navigateFromSettingsSheet`.
    Trimmed to v1.4.1 item set (Profile only); openProfileRows + openProfileFieldEdit
    deep tail deferred (would need ~400 LOC inline-edit cluster).
  - NEW `src/ui/modals/quickLog.js` — `openQuickLogSheet` + `quickLogFood` +
    `openQuickAddCaloriesModal` + `selectQuickAddMeal` + `commitQuickAddCalories`.
    Sub-action openers (AI photo / voice log / weight log / glass) routed via
    `window.*` (defensive — boot-order independent).
  - EXTENDED `src/ui/exercise.js` — added `initExerciseLog`, `switchExerciseTab`,
    `changeExerciseDate`, exported `addCardioExercise` / `deleteCardioExercise` /
    `addStrengthExercise` / `deleteStrengthExercise` / `updateCardioCalories`
    (previously module-local).
  - NEW `src/features/aiPhotoLog.js` — full downstream: `handleAIPhotoFile`,
    `resizeImageForAI`, `callAIPhotoAnalysis`, `showAIPhotoReview`,
    `updateAIPhotoTotals`, `confirmAIPhotoLog`, `showAIPhotoError`,
    `escapeAIText`. Imports `AI_PHOTO_CONFIG` from `src/data/api-config.js`.
    `window.aiPhotoSession` module-owned via `window.openAIPhotoLog` init.
  - NEW `src/features/voiceLog.js` — `openVoiceLog` + `toggleVoiceListening`
    + `submitVoiceTranscript` + `callVoiceAnalysis` (module-private) +
    `showVoiceLogReview` + `selectVoiceMealSlot` + `toggleVoiceFoodSelection`
    + `updateVoiceTotals` + `confirmVoiceLog` + `closeVoiceLog` + `showVoiceLogError`.
    Module-private `voiceLogSession` + `voiceRecognition` (SpeechRecognition).
  - NEW `src/pwa/install.js` — `setupInstallPrompt` + `installPWA` +
    `isInstalledPWA` + `displayPWAStatus`. Called from bootstrap.

  **main.js wiring:**
  - +27 imports from 5 new modules + extended exercise.js.
  - +44 `window.*` shims across all 6 lifts.
  - Bootstrap now calls `initExerciseLog()` + `setupInstallPrompt()` after
    `training.loadExerciseLog()`.

  **Phase D — browser smoke (all green):**
  | Check | Result |
  |---|---|
  | Boot globals (18 fns + state/profile/foodDiary/foodDatabase) | ✓ wired |
  | Nav tab count | 5 |
  | Console errors | 0 |
  | A1 logPlannedMeal→1, unlogPlannedMeal→0 | ✓ FIXED |
  | A2 openWeeklyPlanModal(1) modal visible (display:flex) | ✓ FIXED |
  | A3 openWeightLogModal `.active` + display:flex | ✓ FIXED |
  | A4 openFoodSearch `.active` + display:flex | ✓ FIXED |
  | A5 openProfileEdit mounts + `.active` | ✓ FIXED |
  | C1 openSettingsSheet (display:flex) | ✓ working |
  | C2 openQuickLogSheet (display:flex) | ✓ working |
  | C3 switchExerciseTab('cardio') cardio:block strength:none | ✓ working |
  | C4 openAIPhotoLog('lunch') modal + handleAIPhotoFile=function | ✓ working |
  | C5 openVoiceLog('dinner') modal + session created | ✓ working |
  | C6 setupInstallPrompt wired (no install prompt in dev) | ✓ wired |

  **What's left for S22:**
  - Profile rows inline-edit cluster (openProfileRows / openProfileFieldEdit /
    openBudgetEditModal — settings sheet currently routes Profile → full
    assessment instead of rows view).
  - Head `<header>` HTML extraction (top banner + gear button) + inline
    CSS extraction to external CSS file → ~30 LOC index.html final target.
  - Bottom-FAB stays in head for now; could move into shell.js.
  - Long tail any remaining `typeof window.X === 'function'` no-op guards.

- **Session 22** — **THIN SHELL HIT**. index.html 1,347 → **17 LOC** (−98.7%).
  dist/index.html 28.63 KB → **0.98 KB** (gzip 7.55 → 0.45 KB).
  Build green: main bundle 709.87 KB / 179.37 KB gzip (+16 KB net for
  shell.js extensions + profileRows module).

  **Phase 0 — restore corrupted working-copy.** Between commits the working
  index.html was overwritten with 203 LOC of grep output (intentional but
  destructive). `git checkout HEAD -- index.html` restored 1,347-LOC S21
  state. Verify: `wc -l index.html`.

  **Phase 1 — CSS parity check.** Confirmed `src/styles/main.css` (1,327
  LOC) already mirrors both inline `<style>` blocks (L19-1301 main +
  L1320-1344 nav). Selector counts: 180 vs 181 (main.css has one extra
  comment header), both `@keyframes` present, nav rules at main.css L626 +
  L642 + L1288. Already double-loaded since S6 — deletion is pure
  redundancy strip.

  **Phase 2 — `mountHeader` + `mountFab` added to `src/ui/shell.js`.**
  - `mountHeader()`: creates `<div class="header">` with title +
    subtitle + ⚙️ settings button, prepends before `#app` (or as
    body firstChild fallback). Settings button uses
    `window.openSettingsSheet && window.openSettingsSheet()` for safe
    routing.
  - `mountFab()`: creates `<button id="fab">` with full inline style
    (position:fixed bottom-right, z-index 100, accent-gradient bg).
    Click → `window.openQuickLogSheet()`.
  - `src/main.js`: import line updated to
    `import { mountShell, mountHeader, mountFab } from './ui/shell.js'`.
    Top-level bootstrap calls run in order: `mountHeader()` →
    `mountShell()` → `mountFab()`. `<script type="module">` is deferred
    so `document.body` is parsed before module runs.

  **Phase 3 — index.html collapse (1,347 → 17 LOC).** Stripped:
  - L19-1301 inline `<style>` (main CSS, redundant with main.css)
  - L1304-1310 `<header>` HTML (now in shell.js)
  - L1311-1314 modal-stubs comment (already-deleted artifacts)
  - L1315 `<button id="fab">` (now in shell.js)
  - L1316-1319 FAB + nav comments
  - L1320-1344 nav inline `<style>` (redundant with main.css)

  Final structure: DOCTYPE + 7 meta tags + manifest link + title +
  version meta + `<script type="module" src="/src/main.js">` +
  `<div id="app"></div>` + closing tags. Title bumped from "v1.6.22
  Week Plan Bridge Fix" → "v1.6.22". Version meta bumped to
  `v1.6.22-thin-shell`.

  **Phase 4 — browser smoke (all green).**

  | Check | Result |
  |---|---|
  | Boot — globals (state/profile/foodDiary/foodDatabase/all shims) | ✓ wired |
  | Boot — header rendered with title "Sorrel" + emerald gradient bg | ✓ |
  | Boot — FAB rendered z-index 100 + accent gradient | ✓ |
  | Boot — 5 nav tabs | ✓ |
  | Boot — `<body>` children count: 13 (header + app inner + fab + modals) | ✓ |
  | Console errors | 0 |
  | ⚙️ click → settings sheet (display:flex) | ✓ |
  | FAB click → quickLogSheet (display:flex) | ✓ |
  | logPlannedMeal → unlogPlannedMeal (S21 regression stays fixed) | ✓ before=0/after=1/afterUnlog=0 |
  | CSS — `.header` background-image: linear-gradient(135deg,#064e3b,#0a7d5a,...) | ✓ from main.css |
  | CSS — `#fab` background-image: linear-gradient(135deg,#0a7d5a,#10b981,...) | ✓ |
  | CSS — `#headerTitle` color: rgb(255,255,255) | ✓ |

  **Phase 5 — profile rows inline-edit cluster.**
  NEW `src/ui/modals/profileRows.js` (~270 LOC). Lifted from S19 monolith
  L19520-19790 + L10897-10960:
  - `openProfileRows()` — bottom-sheet with 8 rows (Name/Age/Gender/Height/
    Weight + Goal/Activity/Budget) + "Re-take full assessment" footer
    button.
  - `openProfileFieldEdit(field)` — modal with field-specific input
    (text/number/select/feet+inches). Config object drives 7 field types.
  - `saveProfileField(field)` — validates, mutates profile, persists to
    localStorage via `window.profile = X` assignment, reopens rows sheet.
  - `openBudgetEditModal()` + `saveBudgetEdit()` — separate weekly-budget
    modal (single input with $ prefix).

  Wired in `src/main.js`: 5 new imports + 5 new `window.*` shims (Session
  22 block). `src/ui/modals/settings.js#navigateFromSettingsSheet` Profile
  route now prefers `window.openProfileRows` over `openProfileEdit`
  (rows view is faster path for single-field edits; full assessment still
  reachable via "Re-take" footer button).

  **Phase 5 browser smoke:**

  | Check | Result |
  |---|---|
  | openProfileRows / openProfileFieldEdit / saveProfileField / openBudgetEditModal / saveBudgetEdit shims | ✓ all function |
  | `openProfileRows()` → sheet w/ 10 buttons | ✓ display:flex |
  | `openProfileFieldEdit('weight')` → modal + `#pf-input` | ✓ exists |
  | `openBudgetEditModal()` → modal + `#budget-edit-input` | ✓ exists |
  | Settings Profile button onclick → `navigateFromSettingsSheet('profile','profile')` → openProfileRows | ✓ wired |
  | Console errors | 0 |

  **Files changed S22:**
  - `index.html` — 1,347 → 17 LOC (Phase 0 restore + Phase 3 collapse)
  - `src/ui/shell.js` — +mountHeader, +mountFab (~35 LOC)
  - `src/main.js` — header/fab imports + bootstrap + profileRows imports + shims
  - `src/ui/modals/settings.js` — navigateFromSettingsSheet route to rows
  - NEW `src/ui/modals/profileRows.js` (~270 LOC)

  **What's left for S23:**
  - **Long-tail polish** — confirm all `typeof window.X === 'function'`
    no-op guards in modules either route to live shims or get removed.
  - **`<header>` style cleanup** — settings button has inline gradient
    styles that could move into `.header button` CSS rule.
  - **PWA install collision check** — `setupInstallPrompt` floating
    button (S21) could overlap with FAB (z-index 1000 vs 100). Verify
    in real install-prompt scenario.
  - **AI photo + voice log live-fire smoke** — file picker + speech
    recognition can't be tested via MCP automation. Manual smoke needed.
  - **NEXT_SESSION.md trim** — handoff is now 800+ LOC. Could collapse
    S1-S15 into a 1-paragraph historical summary; keep S16+ verbatim.

- **Session 18** — Food search + recipe + weight log + swap cluster.
  24,840 → 24,071 (-769). New `src/ui/foodSearch.js` (9 fns: closeFoodSearch,
  searchFoods, renderSearchResults, selectFood, parseServing, servingRatio,
  addFoodToMeal, addFoodToMealDirect, searchFoodsWithRemote). New
  `src/ui/modals/weightLog.js` (openWeightLogModal + saveWeightFromModal).
  `src/ui/plan.js` extended with `viewRecipe` + `inferLunchInstructions`.
  `src/ui/modals/swap.js` extended with `swapMeal` + `getAlternativeMeals` +
  `confirmSwap` + module-private `currentSwapContext` (was monolith
  script-scoped let; now owned by the module so the trio shares state without
  bridging). closeSwapModal updated to clear ctx. main.js wired 16 new window
  shims + `Object.defineProperty` bridge for `multiAddState` (was let, gets
  reassigned in toggleMultiAddMode — plain `window.X = X` would diverge).
  4 batches deleted: food search (-314), recipe (-181), weight log (-73),
  swap cluster (-216). 9 bare-name call sites rewritten to `window.*` in
  remaining monolith. **Left in monolith intentionally**: `swapBreakfastForDay`
  + `closeBreakfastSwapModal` (deep render deps — calculateWeeklyBudget,
  distributeRemainingMacros, renderMealPlanner, renderBudgetTracker,
  renderBudgetOptimizationPanel). Defer to S19. Browser smoke deferred per
  aggressive-sweep policy. **Uncommitted** — pending manual commit.

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
    aiPhotoLog.js                       ✓ S21: handleAIPhotoFile + resizeImageForAI +
                                            callAIPhotoAnalysis + showAIPhotoReview +
                                            updateAIPhotoTotals + confirmAIPhotoLog +
                                            showAIPhotoError + escapeAIText
    voiceLog.js                         ✓ S21: openVoiceLog + toggleVoiceListening +
                                            submitVoiceTranscript + showVoiceLogReview +
                                            selectVoiceMealSlot + toggleVoiceFoodSelection +
                                            updateVoiceTotals + confirmVoiceLog + closeVoiceLog +
                                            showVoiceLogError
    index.js                            ✓ barrel
  pwa/
    install.js                          ✓ S21: setupInstallPrompt + installPWA + isInstalledPWA +
                                            displayPWAStatus
  state/
    appState.js  index.js  profile.js   ✓
    accessors.js                        ✓ appState/appProfile/saveAll/saveQuiet/saveProfileQuiet
  styles/main.css                       ✓ slice 6
  ui/
    topbanner.js  premium.js routine.js ✓ slice 5
    analytics.js  progress.js           ✓ slice 5
    exercise.js                         ✓ slice 5 + session 10: renderHealthRecovery +
                                            session 21: initExerciseLog, switchExerciseTab,
                                            changeExerciseDate, updateCardioCalories +
                                            exported addCardio/Strength + deleteCardio/Strength
    diary.js  shopping.js               ✓ slice 5
    plan.js                             ✓ slice 5 + session 12: getMealTimingGuide
    render.js                           ✓ slice 5 orchestrator + installSwitchTab
    shell.js                            ✓ session 9: nav + all 8 tab skeletons (1,298 LOC) +
                                            session 22: mountHeader + mountFab
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
      aiPhotoLog.js                     ✓ openAIPhotoLog entry only (downstream in features/aiPhotoLog.js S21)
      profile.js                        ✓ 1021-line template + open/close
      settings.js                       ✓ S21: openSettingsSheet + navigateFromSettingsSheet (S22 retargeted Profile → openProfileRows)
      quickLog.js                       ✓ S21: openQuickLogSheet + quickLogFood + quickAddCalories cluster
      profileRows.js                    ✓ S22: openProfileRows + openProfileFieldEdit + saveProfileField +
                                            openBudgetEditModal + saveBudgetEdit (Apple Settings inline-edit pattern)
      index.js                          ✓ barrel + mountAll()
  utils/
    dates.js                            ✓ todayISO, toLocalISO, localDateKey, weekStart, plusDays
    html.js                             ✓ esc alias
    dom.js                              ✓ $, qa, byId
    format.js                           ✓ money
    time.js                             ✓ fmtTime/minutes24/timeToMinutes/toInputTime/parseDisplayTime
  main.js                               ✓ imports CSS, wires window.Sorrel + ~105 window.* shims
                                            (+44 S21, +5 S22 profileRows), calls modals.mountAll() +
                                            installCustomRoutineHandlers() + mountHeader() +
                                            mountShell() + mountFab() + installSwitchTab() +
                                            initExerciseLog() + setupInstallPrompt() at bootstrap;
                                            SW registration via import.meta.env.BASE_URL + 'sw.js'
```

---

## What's still in the monolith

### index.html current state (session 22, uncommitted)

- **17 lines** (was 1,347 after S21, 40,265 original — net −40,248 / −99.96%).
- Pure thin shell: DOCTYPE + 7 meta + manifest + title + version + module
  script + `<div id="app"></div>` + closing tags.
- All header/FAB/styling now in modules.

### Previous state (session 21)

- 1,347 lines (post-S21 head sweep). Header + FAB + 2 inline `<style>`
  blocks + comment placeholders. All collapsed in S22 Phase 3.

### Previous state (session 20)

- 1,400 lines (post-nuke). Modal stubs for recipeSwap/breakfastSwap/snackSwap/
  lunchSwap still in head (46 LOC) — deleted in S21 Phase B.

### Previous state (session 19)

- **22,327 lines** (was 24,071 after S18, 40,265 original — net −17,938 / −44.5%)
- L1–~1280: head + CSS + manifest links
- L~1280–~1620: small inline modal stubs + nav styles + `<div id="app"></div>`
- L~1620–24,069: main app JS body (~22K LOC)
- L24,070–24,071: `</body></html>`
- **profileModal HTML deleted (session 16, -1,022 LOC).**
- **profile-region fns deleted (sessions 16+17, ~1,800 LOC total).**
- **Food search + recipe + weight log + swap cluster deleted (session 18, -769 LOC).**
- **5 window bridges live**: `state`/`profile` accessors (15.1), `foodDatabase`
  plain assign (15.1), `shoppingCategories` plain assign (17), `multiAddState`
  Object.defineProperty (18). Recipe DBs (breakfastRecipes/lunchRecipes/recipes/
  snackOptions) + `calculateWeeklyIngredients` + `saveState` + `todayISO` wired
  via main.js shims (17).

### Main app body (L2641–27,714) — cannot delete until lifted

Tab renders + food actions — **all deleted in earlier sessions**:
- ~~Diary tab~~ (A1, 508 LOC, session 14)
- ~~Plan tab~~ (A2, ~5.5K LOC, session 14)
- ~~Shopping tab~~ (A3, ~2K LOC, session 14)
- ~~`logPlannedMeal` / `unlogPlannedMeal`~~ (session 15)
- ~~`editFoodEntry` / `deleteFoodEntry` / `undoLastDelete`~~ (session 15)

Cross-tab helpers still in monolith body (not yet lifted):
- `renderHydrationSchedule` (depends on un-lifted `toggleHydration` — deferred)
- `swapBreakfastForDay`, `closeBreakfastSwapModal` (deep render deps — defer)
- `calculateMealMacros`, `estimateMealCost` (called from confirmSwap module via window)
- `getWeeklyWeightChange`, `computeRecoverySignal`, `getCurrentWeekKey`,
  `logWeight`, `getTrendWeight` (still monolith — modules access via window)
- `updateFoodDetailNutrition`, `closeFoodDetail`, `showAllFoods`, `setActiveTab`,
  `ensureDateEntry`, `saveFoodDiary`, `refreshAfterFoodLog`, `addToRecent`
  (food search support fns — kept in monolith; foodSearch module routes via window)
- `subscribePro`, `dismissTopBanner` and other trial / banner callbacks
- hundreds more original functions

✅ **Lifted in sessions 16-18:**
- profileModal HTML + nav controller + checkProfile bootstrap (S16)
- saveProfile, detectPatternFromProfile, generateOptimalWeek, rehydrateMealMethods,
  5 calc utils, updateHeaderWithProfile, quick-start/quick-goal modals, browseAnonymously (S17)
- closeFoodSearch, searchFoods, renderSearchResults, selectFood, parseServing,
  servingRatio, addFoodToMeal, addFoodToMealDirect, searchFoodsWithRemote (S18)
- viewRecipe + inferLunchInstructions (S18)
- openWeightLogModal + saveWeightFromModal (S18)
- swapMeal + getAlternativeMeals + confirmSwap + currentSwapContext state (S18)

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
| `swapModal` (day-level) | src/ui/modals/swap.js | ✓ Lifted + swapMeal/getAlternativeMeals/confirmSwap (S18) |
| `voiceLogModal` | src/ui/modals/voiceLog.js | ✓ Lifted complete |
| `aiPhotoLogModal` | src/ui/modals/aiPhotoLog.js + src/features/aiPhotoLog.js | ✓ Entry + full downstream (S21) |
| `profileModal` | src/ui/modals/profile.js | ✓ Template + controller (S16) |
| `quickStartModal` + `quickGoalModal` | src/ui/modals/quickStart.js | ✓ Dynamic factory (S17) |
| `weightLogModal` | src/ui/modals/weightLog.js | ✓ Dynamic factory (S18 + S21 .active fix) |
| `settingsSheet` | src/ui/modals/settings.js | ✓ Dynamic factory (S21) — Profile route now → openProfileRows (S22) |
| `quickLogSheet` | src/ui/modals/quickLog.js | ✓ Dynamic factory + quickAddCalories cluster (S21) |
| `profileRowsSheet` + `profileFieldModal` | src/ui/modals/profileRows.js | ✓ Inline-edit pattern (S22) |
| `budgetEditModal` | src/ui/modals/profileRows.js | ✓ Weekly budget edit (S22) |

### Still deferred (post-S22)

- ~~**aiPhotoLog downstream**~~ — DONE in S21.
- ~~**voice log downstream**~~ — DONE in S21.
- ~~**setupInstallPrompt / displayPWAStatus**~~ — DONE in S21.
- ~~**openSettingsSheet / openQuickLogSheet**~~ — DONE in S21.
- ~~**Exercise init cluster**~~ — DONE in S21.
- ~~**Profile rows inline-edit**~~ — DONE in S22.
- ~~**`<header>` HTML extraction + inline CSS extraction**~~ — DONE in S22.
  Thin shell achieved (17 LOC).
- ~~**profileModal inline `<script>`**~~ — done in S16.

**Remaining tail (low-priority polish):**
- AI photo + voice log live-fire smoke (can't automate file picker /
  SpeechRecognition via MCP — manual smoke only).
- PWA install button vs FAB z-index collision check.
- Inline-style cleanup in shell.js mountHeader/mountFab (settings button
  + FAB still use inline `style.cssText` — could move to CSS classes).
- NEXT_SESSION.md trim (handoff is 900+ LOC — collapse S1-S15 to
  one-paragraph historical summary).

---

## Slice 8.3 status

Items 1–3 complete (sessions 11–12). Remaining: long tail only.

### Remaining distance to thin shell

- **Now:** **17 LOC index.html** (post-S22). **THIN SHELL HIT.**
- **Original target:** ~30 LOC. Beat target by 13 LOC.
- Final structure: DOCTYPE + meta + manifest + module script + `<div id="app"></div>`.

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
| Session 16 (profileModal lift) | 1,045 KB | 241 KB (main bundle 510 KB / 124 KB) |
| Session 17 (profile region finish) | ~990 KB | ~228 KB (assessment + quickStart modules added) |
| Session 18 (foodSearch + recipe + weightLog + swap) | ~1,046 KB | ~242 KB (4 module surfaces extended/new) |
| Session 19 (9-batch sweep) | ~876 KB | ~200 KB (main bundle 595 KB / 147 KB) |
| Session 20 (NUCLEAR — monolith JS body deleted) | 32 KB | 8 KB (main bundle 655 KB / 167 KB) |
| Session 21 (A regressions + B head sweep + 6 C lifts) | 28.63 KB | 7.55 KB (main bundle 693.96 KB / 176.41 KB) |
| Session 22 (CSS extract + header/FAB lift + profile rows) | **0.98 KB** | **0.45 KB** (main bundle 709.87 KB / 179.37 KB) — **THIN SHELL HIT** |
| Original target (thin shell ~3 KB) | ✓ beat by 2 KB | — |

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
