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

### index.html current state (session 14)

- **28,695 lines** (was 31,870 after session 10, 40,265 original)
- L1–2639: head + modal HTML (still monolith-owned)
- L2640: `<div id="app"></div>` (shell)
- L2641–28,693: main app JS body (~26K LOC)
- L28,694–28,695: `</body></html>`
- **All 19 IIFE patch blocks deleted (session 10).**
- **A1/A2/A3 dead shimmed blocks deleted (session 14, 3,156 LOC).**

### Main app body (L2641–28,693) — cannot delete until lifted

Tab renders — **all three deleted in session 14**:
- ~~Diary tab~~ (A1, 508 LOC) — deleted, module authoritative
- ~~Plan tab~~ (A2, ~5.5K LOC) — deleted, module authoritative
- ~~Shopping tab~~ (A3, ~2K LOC) — deleted, module authoritative

Food actions still in monolith (B2/B3 deferred):
- `logPlannedMeal` / `unlogPlannedMeal` (~130 LOC) — mutates `foodDiary.entries`
- `deleteFoodEntry` + edit (~200 LOC) — mutates `foodDiary.entries`

Cross-tab helpers still in monolith body (not yet lifted):
- `ensureAdaptiveState` (still defined in monolith but session 14 wrapper in
  main.js routes `window.ensureAdaptiveState` to module version)
- `renderHydrationSchedule` (depends on un-lifted `toggleHydration` — deferred)
- `swapMeal`, `viewRecipe` (complex, deferred)
- save/load profile beyond `state/profile.js`
- trial subsystem caller sites (`showPaywallModal`, `subscribePro`)
- hundreds more original functions
- `openFoodSearch` — **lifted in session 14**

Shadowed by `window.*` shims (module overrides win, monolith copy inert):
- `renderHealthRecovery`, `generateShoppingList`, `analyzeStoreRecommendations`,
  `parseIngredientString`, `getRecoveryLevel` (session 10)
- `renderHealthSunlight`, `logSunlight` (earlier sessions)
- `getLoggingStreak`, `getEffectiveMacrosForToday`, `getMealTimingGuide`,
  `renderProgress`, `renderProgressTab`, `renderMorningStrip` (session 12)
- `renderTopBanner`, `updateIntelligenceBanners`, `updateTrainRecoveryBanner`,
  `updateStats`, `getTrendWeight` (earlier sessions)
- `updateMainPagePlanner`, `ensureAdaptiveState` (session 13)
- `renderFoodDiary`, `renderMealFoods`, `updateMacroSummary`, `changeDiaryDate`,
  `renderDynamicShopping` (session 13)

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

### Long tail (post-ship, not blocking)

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
| Session 11 (PWA) | 1,314 KB | 302 KB |
| Session 12 (cross-tab lifts) | 1,314 KB | 302 KB (main bundle +12 KB) |
| Session 13 (wire dormant shims) | 1,314 KB | 303 KB (main bundle 459 KB / 112 KB) |
| Session 14 (long-tail delete + B1 + bug fixes) | 1,183 KB | 270 KB (main bundle 460 KB / 112 KB) |
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
