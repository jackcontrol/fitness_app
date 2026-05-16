# Slice 5 Execution Plan — UI Orchestration + Per-Tab Views

This is the largest remaining slice of the Sorrel refactor. Pick this up in a
fresh session. Read `NEXT_SESSION.md` first for global context, then this file
for the slice-5 specifics.

---

## Goal

Move all UI rendering, event handlers, and tab routing out of `index.html`
(the 40k-line monolith) into focused modules under `src/ui/`. Each tab gets
its own module that is lazy-loaded on first visit. After this slice, the
monolith is empty enough that slice 8 (shell-swap) becomes a one-shot file
replacement.

## Scope

- **~11,000 lines** of render JS in the monolith (220 DOM-touching functions).
- **~25 KB** of inline modal HTML (mixed in with the body — slice 7 absorbs
  most of these, but tab-specific modals come with their tab).
- Event handler wiring + tab routing logic scattered across the file.

## Pre-flight context

Already extracted in prior slices (do not re-extract):

```
src/
  api/claudeProxy.js
  data/ — all major data tables (recipes, snacks, exercises, foods,
          ingredients, protocols, substitutions, providers, taxonomy, api-config)
  features/
    budget.js, customFoods.js, diary.js, diet.js, fasting.js, plan.js,
    progress.js, training.js, index.js (barrel)
  state/ — profile.js, appState.js, index.js (barrel)
  styles/main.css — all <style> blocks
  utils/dates.js, utils/html.js
  main.js — imports CSS + features; exposes window.Sorrel namespace
```

Bridge pattern in `src/main.js`: `window.Sorrel = { fasting, diary, plan,
progress, training, customFoods, getProfile, loadState, ... }`. Render code
should call into `window.Sorrel.diary.addFoodEntry(...)` etc. rather than
mutating raw globals.

## Approach — hybrid (recommended)

Two extremes were considered:

1. **Clean re-author** — read every function, understand intent, rewrite
   from scratch using the extracted state/feature modules. High quality,
   ~10 sessions of work, high regression risk because of behavior-preserving
   constraint with no automated tests.

2. **Verbatim lift** — cut-and-paste the existing functions into `src/ui/`
   files, change global state reads to `window.Sorrel.*` reads, fix import
   surface, ship. Fast, ~2-3 sessions, but inherits the 220-function sprawl
   and the wrapper-chain noise.

**Recommended: hybrid.**

- **Lift verbatim** for any function that's already DOM-tight and works.
- **Re-author** only when the function:
  - Reads from a lexically-scoped global that no longer exists in the shell
    (e.g. `let profile` at line 2000 is gone — must use `window.Sorrel.getProfile()`
    or import directly).
  - Wraps another function via `__v16XXWrapped` flag — collapse the wrapper
    chain into a single clean function.
  - Has `console.log` spam — leave for Vite's `esbuild.drop` to handle.

This means most functions ship as direct lifts plus mechanical edits. Only
the gnarly state-coupled ones get re-authored.

## Output structure

```
src/ui/
  render.js           ← main render() orchestrator + tab routing
  home.js             ← Home tab (summary cards, daily totals)
  diary.js            ← Diary tab (food log) + its sub-modals split out to slice 7
  plan.js             ← Plan tab (breakfast/lunch/dinner/snack selection)
  progress.js         ← Progress tab (weight charts, photo grid, comparison)
  shopping.js         ← Shopping tab (deferred from slice 4 — DOM-heavy)
  training.js         ← Training tab (cardio + strength + rest timer)
  settings.js         ← Settings tab (profile edit, exports, toggles)
  banner.js           ← Top banner (streak, weight nudge, baseline banner)
  topbar.js           ← Nav bar + global header
```

Modals get their own folder in slice 7:

```
src/ui/modals/
  profileSetup.js     ← Elite v1 assessment flow
  foodSearch.js       ← Food picker for diary
  foodDetail.js       ← Food detail editor (serving, quantity)
  weeklyPlanEditor.js ← Adjust breakfastSwaps per day
  photoComparison.js  ← Before/after progress photos
  aiPhotoReview.js    ← AI-detected foods review
  voiceLog.js         ← Voice log review
  customFood.js       ← Add/edit custom food
  quickLogSheet.js    ← Coaching overflow + quick add
  paywall.js          ← Trial / subscribe modal
  budgetEdit.js       ← Inline budget editor
  quickStart.js       ← Anonymous / browse mode start
```

## Per-tab execution order

Smallest → largest. After each tab is lifted, verify in `pnpm run dev` that
the live app still works (the shell-swap happens in slice 8, so during
slice 5 the monolith remains the source of truth and the new `src/ui/*.js`
files are unused).

### 5.1 Home tab (~500 LOC, smallest)

Monolith functions to lift:
- `renderHome()` / similar entry point (grep for the function called from
  the home-tab route)
- Summary card builders (calories today, macros today, streak, etc.)
- Top banner integration (`renderTopBanner()`)

Dependencies: `getProfile()`, `loadState()`, `dailyCardioCalories()`,
`getLoggingStreak()`, `getTrendWeight()`. All available via
`window.Sorrel.*` or direct import.

### 5.2 Settings tab (~800 LOC)

Lift settings render + form handlers. Pay attention to:
- Profile edit form (every field maps to `profile.*`)
- Budget edit (must go through `setBudget()` — not direct profile writes)
- Export buttons (anticipates Step 5: Export/Import backup)
- Reset / clear flows (use `clearProfile()` from state module)
- Diet type picker (must round-trip through `canonicalDietType()`)

Modal: budget edit modal → `src/ui/modals/budgetEdit.js` (slice 7).

### 5.3 Progress tab (~1,200 LOC)

Lift + verify:
- Weight chart (uses Chart.js — already vendored)
- Photo grid render (`renderProgressPhotos`)
- Photo comparison modal → slice 7
- Trend weight + 7-day average display (from `src/features/progress.js`)
- Goal projection date (from `projectGoalDate()`)

Modal: photo comparison → `src/ui/modals/photoComparison.js` (slice 7).

### 5.4 Training tab (~1,500 LOC)

Lift:
- `renderExerciseLog`, `renderCardioList`, `renderStrengthList`
- Rest timer (`startRestTimer`, `updateRestTimerDisplay`, `stopRestTimer`)
- "Last session" card builder
- Add cardio / add strength modals → slice 7

State path: `window.Sorrel.training.addCardio(entry)` etc.

### 5.5 Diary tab (~2,000 LOC)

The biggest user-facing tab. Lift:
- `renderFoodDiary`, `renderMealFoods` (per-meal section render)
- Swipe-to-delete gesture handler (`initSwipeToDelete`)
- Multi-add mode (`toggleMultiAddMode`, `commitMultiAdd`)
- Daily totals + macro summary (`calculateDailyTotals`, `updateMacroSummary`)
- "Yesterday" / "Copy yesterday" affordances
- Quick add caloric placeholder (`addQuickCalories`)

Modals (largest set in slice 7):
- Food search → `src/ui/modals/foodSearch.js`
- Food detail → `src/ui/modals/foodDetail.js`
- AI photo review → `src/ui/modals/aiPhotoReview.js`
- Voice log → `src/ui/modals/voiceLog.js`
- Custom food → `src/ui/modals/customFood.js`
- Quick log sheet → `src/ui/modals/quickLogSheet.js`

State path: `window.Sorrel.diary.*`, `window.Sorrel.customFoods.*`.

### 5.6 Plan tab (~2,500 LOC, biggest)

Lift:
- `populateBreakfastGrid`, `populateLunchGrid`, `populateDinnerGrid`,
  `populateFavoriteSnacksGrid`
- `toggleLunch`, `toggleDinner`, `toggleSnack`, `selectDefaultBreakfast`,
  `selectSnack` — most of these already have pure equivalents in
  `src/features/plan.js`; the UI version becomes a thin wrapper:
  ```js
  function toggleLunch(lunchId, evt) {
    const result = window.Sorrel.plan.toggleLunch(window.state, lunchId);
    if (result.atLimit) showLogToast('Max 3 lunches — deselect one first');
    if (result.added) evt.currentTarget.classList.add('selected');
    else evt.currentTarget.classList.remove('selected');
    saveState();
    updateLunchCount();
  }
  ```
- `filterLunches`, `filterDinners` (cuisine filtering)
- `calculatePlanWithFavorites`, `calculateMealRotation`
- `runBudgetOptimization`, `suggestCheaperSnack`,
  `suggestCheaperMealWithinEthnicity`, `applyOptimizationSuggestion`
- `updateMainPagePlanner` (the big render call)
- `selectPlanDay`, day swap UI

Modal: weekly plan editor → `src/ui/modals/weeklyPlanEditor.js` (slice 7).

### 5.7 Shopping tab (~1,500 LOC)

Lift the deferred slice 4f work:
- Shopping list render
- `state.shoppingPantry` mutations ("+ have it" toggles)
- Store assignment editor (uses `storeInfo` from `src/data/providers.js`)
- Delivery provider links (uses `deliveryProviders` from
  `src/data/providers.js`)
- Filter / sort UI

### 5.8 render.js + tab routing

Last. Single `render()` function that:
1. Reads current tab from URL hash or `state.selectedTab`
2. Dynamic-imports the relevant tab module
3. Mounts it into `#app`

```js
const tabs = {
  home:     () => import('./home.js'),
  diary:    () => import('./diary.js'),
  plan:     () => import('./plan.js'),
  progress: () => import('./progress.js'),
  training: () => import('./training.js'),
  shopping: () => import('./shopping.js'),
  settings: () => import('./settings.js'),
};

export async function render(tabName = 'home') {
  const mod = await tabs[tabName]();
  mod.render(document.getElementById('app'));
}
```

This unlocks per-tab code splitting in the final build — initial load only
fetches `home.js`; other tabs lazy-fetch on first click.

## Mechanical edits per lifted function

When lifting verbatim, apply these edits:

1. **Replace lexical reads** of `profile`, `state`, `foodDiary`,
   `exerciseLog`, `fastingState`, `progressPhotos`, `customFoods` with the
   corresponding `window.Sorrel.*` accessor:
   ```diff
   - if (!profile) return;
   + const profile = window.Sorrel.getProfile();
   + if (!profile) return;
   ```
2. **Replace direct mutations** with feature-module calls:
   ```diff
   - state.favoriteLunches.push(lunchId);
   + window.Sorrel.plan.toggleLunch(state, lunchId);
   ```
3. **Drop wrapper chains.** If you find `if (!fn.__v16XXWrapped) { ... }`
   patterns, collapse into the wrapped behavior directly.
4. **Drop `console.log` calls** — Vite's `esbuild.drop` will strip them on
   build, but leaving them in dev is fine. Remove only if they reference
   variables that no longer exist post-edit.
5. **Replace `safeLocalStorageSet`** (a monolith helper) with direct calls
   on the feature module — each module already has its own quota-safe save.
6. **Skip the smoke functions entirely** (`sorrelRunV16XXSmoke`). They
   disappear with slice 8.

## Per-tab verification (manual)

After lifting a tab, before moving on:

```bash
pnpm run dev
```

Open the dev server URL, open the tab in question. Verify:

- Tab renders without console errors.
- Primary actions work (log a food in diary, swap a lunch in plan, etc.).
- Data persists across reload (localStorage round-trip).
- Tab switching still works.

The monolith is still the live source during slice 5, so the new
`src/ui/*.js` files are not actually rendered by the running app yet —
they sit in `src/` ready for slice 8. **Verification during slice 5 means
running each new tab module in isolation in the dev server**, e.g. by
temporarily wiring `main.js` to render only the just-lifted tab.

## Pitfalls

- **Lexical scope wall.** The monolith has three known lexically-scoped
  globals: `let profile` (~line 2000), `let state` (~line 9930),
  `const snackOptions` (~line 4975). These do not exist on `window`
  by default. Always go through `window.Sorrel.getProfile()` /
  `window.Sorrel.loadState()` or import directly from
  `src/state` / `src/features`.
- **Budget cascade.** Direct writes to `profile.weeklyBudget` are forbidden.
  Always go through `setBudget(value, profile)`.
- **Diet type indirection.** Never read `profile.dietType` directly.
  Always call `canonicalDietType(profile)`.
- **Plant-confirmed scan order.** When extracting any veg-classifier code,
  longest plant phrases must scan first. The pure version in
  `src/features/diet.js` already handles this; don't reimplement.
- **JSDOM quirks** are irrelevant — we have no automated tests. Only the
  real browser matters.

## Exit criteria for slice 5

- All seven tabs render correctly from `src/ui/*.js` modules.
- `render.js` orchestrator works.
- Tab routing works.
- `index.html` monolith STILL contains the old render code (don't delete
  yet — slice 8 deletes the whole monolith in one swap).
- All references to `profile`, `state`, etc. inside `src/ui/*.js` go
  through `window.Sorrel.*` or direct imports.
- `pnpm run build` succeeds.
- `pnpm run preview` works enough to walk through every tab manually
  (using a temporary main.js that mounts the new UI).

## Next after slice 5

- **Slice 7** — extract the remaining modal HTML into `src/ui/modals/*.js`.
  Most modals already noted in their parent tab section above.
- **Slice 8** — replace `index.html` with the 30-line shell. Wire `main.js`
  bootstrap to load state + render the home tab. Delete monolith remnants.

---

## Quick reference — what tabs touch which features

| Tab | Primary feature modules | Notes |
|---|---|---|
| Home | profile, appState, progress, training, diary | summary aggregator |
| Diary | diary, customFoods, taxonomy (vegan check) | most modals |
| Plan | plan, budget, recipes data | budget optimizer here |
| Progress | progress, profile (target weight) | Chart.js |
| Training | training, exercises data | Rest timer (setInterval) |
| Shopping | (no own state — reads from plan + recipes) | uses providers data |
| Settings | profile, appState (all), budget, diet | exports |

## File-extraction quick reference

| Function pattern | Approximate monolith line | New home |
|---|---|---|
| `renderHome*`, `renderTopBanner` | search via grep | `src/ui/home.js` |
| `renderFoodDiary`, `renderMealFoods` | 10865+ | `src/ui/diary.js` |
| `populateBreakfastGrid`, `populateLunchGrid`, `populateDinnerGrid` | 15660-15919 | `src/ui/plan.js` |
| `runBudgetOptimization`, `suggestCheaper*` | 10465+ | `src/ui/plan.js` |
| `renderProgressPhotos`, `showPhotoComparison` | 15276+ | `src/ui/progress.js` |
| `renderExerciseLog`, `renderCardio*`, `renderStrength*` | 13767+ | `src/ui/training.js` |
| `renderFastingUI`, `startFastingTimer` | 15150+ | `src/ui/home.js` or own fasting-ui file |
| `openFoodSearch`, `searchFoods`, `selectFood` | 11359+ | `src/ui/modals/foodSearch.js` (slice 7) |
| `openAIPhotoLog`, `confirmAIPhotoLog` | 11963+ | `src/ui/modals/aiPhotoReview.js` (slice 7) |
| `openVoiceLog`, `confirmVoiceLog` | 12397+ | `src/ui/modals/voiceLog.js` (slice 7) |
| `openCustomFoodModal`, `saveCustomFood` | 15406+ | `src/ui/modals/customFood.js` (slice 7) |
| `showPaywallModal`, `subscribePro` | 10068+ | `src/ui/modals/paywall.js` (slice 7) |
| Tab routing (`setActiveTab`, etc.) | 11488+ | `src/ui/render.js` |
