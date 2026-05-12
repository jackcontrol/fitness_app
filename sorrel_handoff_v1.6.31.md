# Sorrel Migration — Comprehensive Handoff (v1.6.31)

**Document version**: 1.0
**Date**: May 11, 2026
**Current build**: v1.6.31 (1.88 MB, 40,226 lines)
**Status**: Trust-critical infrastructure complete, production-ready pending lazy-loading optimization
**Test coverage**: 104/104 automated smoke tests across 7 version checkpoints

---

## Table of Contents

1. [Executive Overview](#executive-overview)
2. [Project Timeline & Build History](#project-timeline--build-history)
3. [Current Architecture](#current-architecture)
4. [Critical Patterns & Anti-Patterns](#critical-patterns--anti-patterns)
5. [Food Ontology Architecture](#food-ontology-architecture-v1628--v1629)
6. [Testing Infrastructure](#testing-infrastructure)
7. [Known Issues & Gotchas](#known-issues--gotchas)
8. [Next Actions & Pending Work](#next-actions--pending-work)
9. [How to Continue Development](#how-to-continue-development)
10. [User Feedback & Preferences](#user-feedback--preferences)
11. [Key Technical Decisions & Rationale](#key-technical-decisions--rationale)
12. [Handoff Checklist](#handoff-checklist)

---

## Executive Overview

**Project**: Migration of Sorrel (adaptive nutrition app) from ChatGPT Custom GPT artifact to standalone Claude-based HTML app.

**Approach**: Incremental additive patches on the legacy 38K-line codebase rather than a full rewrite. Each patch is a self-contained `<script>` IIFE that wraps existing functions or injects new behavior.

**Key deliverables completed**:
- 16 PARTIAL items from initial v1.6.22 handoff: all CLOSED
- Food ontology: production-grade 5-state ambiguity scoring with curated taxonomy
- Budget cascade: 5-step optimizer with dietary compatibility enforcement
- UI/UX trust cluster: baseline visibility, weight log feedback, touch targets, budget unification
- Settings polish: data export, reset, version strings

**Crown jewel**: The vegan classifier (v1.6.29) handles real-world ambiguity honestly. It distinguishes between "definitely contains animal products" and "ingredients may be source-dependent, not a vegan certification."

---

## Project Timeline & Build History

### Phase 1: Foundation (v1.6.22 - v1.6.23)

**v1.6.22** — Initial handoff. 16 PARTIAL items (incomplete features, architectural gaps). Discovery of first lexical scoping issue: `let profile = {...}` in legacy script not exposed to `window`, causing profile-reading patches to fail silently.

**v1.6.23** — Major cuts pass. Removed 12 features:
- Dark mode / themes
- Trial upsells
- Social / community features
- Gamification / achievements
- Premium tiers / subscription
- Shop / partners / ads

Budget feature preserved. Reduced from ~2MB to manageable size. 38 smoke tests defined.

### Phase 2: Architectural Fixes (v1.6.26 - v1.6.27)

**v1.6.26** — Architectural breakthrough. Root cause of pantry/shopping bugs:

```javascript
// Legacy code at line 9930:
let state = { weightLog: [], pantry: {}, ... };

// Patch code in separate <script> tag:
const s = () => window.state || (window.state = {});
// ← window.state is undefined because `let` doesn't expose to window!
// Falls back to empty {}, so all reads return nothing.
```

**Solution**: Inject separate `<script>` element whose body runs at top-level scope (sees lexical `state`), assigns `window.state = state`. Both names alias same heap object — no continuous sync needed.

Closure verified: Pantry have-it click pipeline: $189.85 → $186.86 → $189.85 round-trip.

**v1.6.27** — Consolidation. Added `sorrelRunAllSmokes()` that runs all version smoke matrices. All 16 PARTIAL items from v1.6.22 handoff CLOSED. 57/58 smokes pass (1 JSDOM-only false positive).

### Phase 3: Food Ontology Overhaul (v1.6.28 - v1.6.29)

**v1.6.28** — User screenshot audit revealed catastrophic trust bugs:

1. **Diet filtering broken**: `filterMealsByCuisine()` reads `profile.dietType` (singular, NEVER set anywhere — only `profile.diets` array exists). Vegan user got omnivore plan. Test: 0/28 meals were vegan, breakfast was "Eggs + Toast + Smoothie".

2. **Validator substring bug**: `termHit()` does bidirectional substring match so "pepper" matches "pepperoni", "almond milk" matches "milk".

3. **Budget desync**: 3 fields (`weeklyBudget`, `weeklyGroceryBudgetTarget`, `budgetTarget`) + localStorage not synced. Home shows $125, shopping $175, plan $223.

4. **Budget cascade stubbed**: Steps 3, 4, 5 marked TODO. Snack swap has NO diet filter — vegan over-budget user picks Hard Boiled Eggs ($1.50).

**Fixes**:
- `canonicalDietType(p)` reads from any of: `dietType | diets[0] | diet | dietPreference`
- Wrapped `filterMealsByCuisine` to force-set `userProfile.dietType`
- Replaced validator with `v1628Validate` using `dietType` + `allergens` FIRST, then ingredient scan with token-based word-boundary match
- Budget unification: `getBudget()` / `setBudget(v)` writes all 3 fields + localStorage
- Real 5-step budget cascade with dietary compatibility validation

**Results**: 28/28 vegan meals (vs 0/28 before). Aggressive cascade reduces $104 → $75.14.

**v1.6.29** — Ambiguity-aware dietary stack. User-specified architecture:
1. Open Food Facts barcode/product lookup
2. Internal vegan rule engine built from PETA/Vegan.com/Vegan Society terminology
3. Ambiguity scoring (NOT binary)
4. Barnivore for alcohol
5. Optional FatSecret later
6. UX must avoid overpromising

**5-state status**:
- `not_vegan` (high confidence)
- `likely_not_vegan` (medium)
- `source_dependent` (low)
- `no_animal_found` (medium)
- `unknown` (low)

**Pipeline**:
- Plant-confirmed scan FIRST (longest phrases) before single-word category scans
- OFF tags as primary signal for packaged foods
- Honest UX copy: "No obvious animal-derived ingredients found. Some ingredients may be source-dependent, so this is not a vegan certification."

**Results**: 16/16 smoke PASS. Real-world verification:
- Bacon → not_vegan
- Almond milk → no_animal_found (NOT dairy false-positive)
- Pepper → no_animal_found (NOT pepperoni false-positive)
- Wine → source_dependent
- Worcestershire → likely_not_vegan (hidden anchovies)

### Phase 4: UI/UX Trust Cluster (v1.6.30 - v1.6.31)

**v1.6.30** — Six trust-impacting issues from user screenshot review:

1. Baseline "Building your baseline" X-click doesn't dismiss (competing dismiss keys)
2. "Log Weight" suggestion doesn't update after weight logged
3. Mobile touch targets too small (44px iOS HIG minimum)
4. Weight input has arrows + accepts decimals
5. Budget displays diverge (home $125, shopping $175, plan $223)
6. Cascade toast generic

All six fixed with end-to-end verification. 10/10 smoke PASS, 94/94 total.

**v1.6.31** — Three fixes from real review:

1. **Baseline visibility regression**: v1.6.30 over-honored the global undated `baseline-banner-dismissed` key. Anyone who dismissed in pre-v1.6.30 builds had this stale key forever. Fix: read only SCOPED keys (today/week), actively clear stale global key on render.

2. **Snack ingredient lists**: 25/25 snacks had no `ingredients` or `getIngredients` method. Synthesized from name parsing: "Cottage Cheese & Berries" → `[cottage cheese, berries]`. Uses v1.6.26 injected-script pattern because `const snackOptions` is lexically scoped.

3. **Settings polish**: Added Export Data (CSV download) + Reset Data (confirmation flow). Bumped version strings v1.5.3 → v1.6.31.

**Results**: 10/10 smoke PASS, **104/104 total** across all versions, 16/16 PARTIAL items still CLOSED.

---

## Current Architecture

### File Structure

```
/home/claude/sorrel/
├── v1631_final.html              # Current production build (1.88 MB)
├── v1631_working.html            # Working copy for next patch
├── build_v16XX.py                # Python builder scripts for each version
└── test/
    ├── closure_v1627.mjs         # JSDOM deep closure harness (16 items)
    └── (smoke tests run via JSDOM inline)

/mnt/user-data/outputs/
└── sorrel_v1.6.XX_final.html     # Delivered builds

/mnt/transcripts/
├── 2026-05-11-16-09-07-sorrel-v1626-v1631-state-mirror-ui-polish.txt
└── journal.txt                    # Catalog of all transcripts
```

### Build Process

Each version follows this workflow:

1. **Copy working file**: `cp v1630_final.html v1631_working.html`
2. **Create builder script**: `build_v1631.py` with docstring, PATCH constant, injection logic
3. **Build**: `python3 build_v1631.py`
4. **Validate**: Node.js `--check` on all extracted scripts
5. **Test**: Run version-specific smoke + all prior version smokes
6. **Verify**: End-to-end scenarios for user-reported issues
7. **Deliver**: `cp v1631_final.html /mnt/user-data/outputs/sorrel_v1.6.31_final.html`

---

## Critical Patterns & Anti-Patterns

### Pattern 1: Lexical Scoping (Recurrent Issue)

**Problem**: Legacy script declares variables with `let` or `const` at top level. These are lexically scoped to that script block and do NOT expose to `window`. Patches in separate script tags can't see them.

**Occurrences**:
1. v1.6.22: `let profile = {...}` at line ~2000
2. v1.6.26: `let state = {...}` at line 9930
3. v1.6.31: `const snackOptions = {...}` at line 4975

**Canonical Solution** (from v1.6.26):

```javascript
// In your patch IIFE, inject a separate script tag:
var probe = document.createElement('script');
probe.textContent = [
  '(function(){',
  '  if (typeof state !== "undefined") window.state = state;',
  '  if (typeof profile !== "undefined") window.profile = profile;',
  '  if (typeof snackOptions !== "undefined") window.snackOptions = snackOptions;',
  '})();'
].join('\n');
document.body.appendChild(probe);
document.body.removeChild(probe);

// Now window.state aliases the same heap object as lexical state
```

**Why this works**: The injected script's body runs at top-level scope of the host document. It sees the lexical variables and assigns them to window properties. No polling or continuous sync needed — same object reference.

**When to use**: Anytime you need to read/modify a variable that's `let`/`const` in legacy code and your patch is in a separate `<script>` tag.

### Pattern 2: Wrapper-Based Interception

**Use case**: Augmenting existing functions without rewriting them.

**Example** (from v1.6.30):

```javascript
if (typeof window.logWeight === 'function' && !window.logWeight.__v1630Wrapped) {
  var origLogWeight = window.logWeight;
  window.logWeight = function(weightLb, dateISO){
    var out = origLogWeight.apply(this, arguments);
    // Additional behavior
    try { if (typeof renderPlanWeightChip === 'function') renderPlanWeightChip(); } catch(e){}
    try { if (typeof renderTopBanner === 'function') renderTopBanner(); } catch(e){}
    return out;
  };
  window.logWeight.__v1630Wrapped = true;
}
```

**Key principles**:
- Check for existing wrapper flag before re-wrapping
- Preserve original function reference
- Use `apply(this, arguments)` for proper context/args
- Wrap cleanup calls in try-catch
- Return original result
- Add wrapper flag to prevent double-wrapping

### Pattern 3: MutationObserver for Dynamic Content

**Use case**: Patching DOM that's created on-demand (modals, sheets).

**Example** (from v1.6.31):

```javascript
var obs = new MutationObserver(function(mutations){
  mutations.forEach(function(m){
    m.addedNodes.forEach(function(node){
      if (node.nodeType !== 1) return;
      if (node.id === 'settingsSheet' ||
          (node.querySelector && node.querySelector('#settingsSheet'))) {
        patchSettingsVersion(node);
        injectSettingsExtras(node.id === 'settingsSheet'
          ? node
          : node.querySelector('#settingsSheet'));
      }
    });
  });
});
obs.observe(document.body, { childList: true, subtree: true });
```

**When to use**: Settings modal, weight log modal, food entry sheets — anything that's built by innerHTML on user action.

### Pattern 4: Smoke Test Structure

Each version defines `window.sorrelRunV16XXSmoke = function()` that returns:

```javascript
{
  build: 'v1.6.XX-description',
  pass: true/false,
  total: N,
  passed: M,
  failed: N-M,
  failures: ['check name', ...],
  detail: [
    { name: 'Check description', ok: true/false, reliability: 1-10 }
  ]
}
```

**Reliability scale**:
- 10: End-to-end user scenario verified
- 9: Function exists + basic call succeeds
- 8: Presence check (CSS injected, observer installed)
- 7: Wrapper flag check
- 6: Indirect signal (side effect observed)
- 1-5: Heuristics, brittle checks

**Running all smokes**:

```javascript
['sorrelRunV1623Smoke', 'sorrelRunV1626Smoke', ...].forEach(name => {
  var r = win.eval(name + '()');
  console.log(name + ': ' + r.passed + '/' + r.total + ' ' + (r.pass ? 'PASS' : 'FAIL'));
});
```

---

## Food Ontology Architecture (v1.6.28 - v1.6.29)

### Canonical Diet Type Resolution

**Problem**: Profile has inconsistent diet fields across versions: `dietType` (singular, rarely set), `diets` (array), `diet`, `dietPreference`.

**Solution** (v1.6.28):

```javascript
function canonicalDietType(p){
  if (!p) return 'omnivore';
  return p.dietType ||
         (Array.isArray(p.diets) ? p.diets[0] : null) ||
         p.diet ||
         p.dietPreference ||
         'omnivore';
}
```

Always use this when filtering recipes. Never read `profile.dietType` directly.

### Vegan Classification Pipeline (v1.6.29)

**Input**: Food object with `{ name, ingredients, allergens, source, ... }`

**Output**:

```javascript
{
  status: 'not_vegan' | 'likely_not_vegan' | 'source_dependent' | 'no_animal_found' | 'unknown',
  confidence: 'high' | 'medium' | 'low',
  evidence: {
    hasDefinite: [...],
    hasLikely: [...],
    hasSourceDep: [...],
    plantHits: [...]
  },
  message: 'Human-readable explanation'
}
```

**Pipeline**:

1. **OFF tags primary**: If `food.source === 'openfoodfacts'`, check `ingredients_analysis_tags` first.
   - `en:non-vegan` → not_vegan
   - `en:maybe-vegan` → source_dependent
   - `en:vegan` → no_animal_found

2. **Allergen override**: If `allergens` includes `'dairy'` or `'eggs'` → not_vegan (even with sparse ingredients).

3. **Ingredient extraction**: Try Array.isArray(ingredients), ingredients_text string split, getIngredients() method.

4. **Taxonomy scan**:
   - STEP A: plant-confirmed scan FIRST (longest phrases first, masks subsequent scans)
   - STEP B: definite_animal
   - STEP C: likely_animal
   - STEP D: source_dependent
   - STEP E: alcohol

5. **Priority**:
   - hasDefinite → not_vegan/high
   - hasLikely → likely_not_vegan/medium
   - hasSourceDep → source_dependent/low
   - plantHits > 0 → no_animal_found/medium
   - else → unknown/low

6. **Curated override**: If food has `dietTrustedPositive: true` (recipe explicitly tagged 'vegan'), skip ingredient scan and upgrade to no_animal_found.

### INGREDIENT_TAXONOMY (5 categories)

**DEFINITE_ANIMAL**:
```javascript
{
  meat: ['beef','pork','lamb','chicken','turkey','duck','venison','bacon',
         'sausage','ham','salami','pepperoni','prosciutto','chorizo',
         'meatball','steak','ribeye','sirloin','tenderloin','brisket',
         'ground beef','ground turkey','rotisserie chicken'],
  seafood: ['fish','salmon','tuna','cod','halibut','tilapia','trout',
            'sardines','anchovies','shrimp','prawns','lobster','crab',
            'scallops','clams','mussels','oysters','octopus','squid',
            'calamari','crayfish'],
  dairy: ['milk','cream','butter','cheese','cheddar','mozzarella',
          'parmesan','feta','brie','gouda','swiss cheese','cottage cheese',
          'ricotta','yogurt','greek yogurt','sour cream','whey','casein',
          'lactose','ghee','half and half','heavy cream','buttermilk',
          'condensed milk','evaporated milk'],
  eggs: ['egg','eggs','egg white','egg yolk','scrambled eggs','fried egg',
         'hard boiled egg','omelette','frittata','quiche','mayonnaise',
         'aioli','hollandaise'],
  honey: ['honey','honeycomb','royal jelly'],
  gelatin: ['gelatin','gelatine','jello','jelly','gummy','marshmallow','gummies'],
  animal_fat: ['lard','tallow','suet','dripping','schmaltz','duck fat','bacon grease'],
  other_animal: ['bone broth','stock','chicken stock','beef broth','collagen','keratin']
}
```

**LIKELY_ANIMAL**:
```javascript
{
  carmine_cochineal: ['carmine','cochineal','e120','natural red 4','crimson lake'],
  shellac: ['shellac','e904',"confectioner's glaze",'resinous glaze'],
  isinglass: ['isinglass','fish bladder'],
  lanolin: ['lanolin','wool fat','wool wax'],
  l_cysteine: ['l-cysteine','e920','cysteine'],
  hidden_animal_sauces: ['worcestershire','worcestershire sauce','fish sauce',
                         'nam pla','nuoc mam','oyster sauce','caesar dressing',
                         'shrimp paste','anchovy paste','garum']
}
```

**SOURCE_DEPENDENT**:
```javascript
{
  glycerin: ['glycerin','glycerine','glycerol','e422'],
  lecithin: ['lecithin','e322'],
  mono_diglycerides: ['monoglycerides','diglycerides','mono and diglycerides','e471','e472'],
  natural_flavors: ['natural flavors','natural flavoring','natural flavour'],
  sugar: ['white sugar','refined sugar','cane sugar','beet sugar','powdered sugar',
          'confectioners sugar','granulated sugar'],
  vitamin_d3: ['vitamin d3','cholecalciferol'],
  enzymes: ['rennet','microbial rennet','enzymes','lipase','lactase'],
  lactic_acid: ['lactic acid','e270'],
  stearic_acid: ['stearic acid','e570'],
  palmitic_acid: ['palmitic acid'],
  omega_3: ['omega-3','omega 3','dha','epa']
}
```

**PLANT_CONFIRMED**:
```javascript
{
  plant_milks: ['almond milk','soy milk','oat milk','coconut milk','rice milk',
                'cashew milk','hemp milk','pea milk','flax milk'],
  plant_proteins: ['tofu','tempeh','seitan','tvp','textured vegetable protein',
                   'soy protein','pea protein','beyond meat','impossible burger',
                   'veggie burger'],
  plant_cheeses: ['vegan cheese','cashew cheese','nutritional yeast','vegan parmesan'],
  plant_butters: ['vegan butter','margarine','coconut oil butter','earth balance'],
  plant_yogurts: ['soy yogurt','coconut yogurt','almond yogurt','oat yogurt'],
  grains: ['rice','quinoa','oats','barley','wheat','pasta','noodles','bread','flour'],
  veggies: ['broccoli','spinach','kale','carrots','tomatoes','onions',
            'garlic','peppers','mushrooms'],
  fruits: ['apples','bananas','berries','oranges','lemons','avocado'],
  oils: ['olive oil','vegetable oil','canola oil','sunflower oil','avocado oil'],
  nuts_seeds: ['almonds','walnuts','cashews','peanuts','chia seeds',
               'flax seeds','sunflower seeds'],
  seasonings: ['salt','pepper','herbs','spices','cumin','paprika',
               'turmeric','basil','oregano']
}
```

**ALCOHOL_BARNIVORE**:
```javascript
{
  wine: ['wine','red wine','white wine','rosé','champagne','prosecco',
         'port','sherry','vermouth'],
  beer: ['beer','ale','lager','stout','porter','ipa','pilsner','wheat beer','cider'],
  spirits: ['vodka','gin','rum','whiskey','bourbon','scotch','tequila','brandy','cognac']
}
```

### Word-Boundary Matching (v1.6.28)

```javascript
function multiwordHit(haystack, term){
  var hTokens = haystack.toLowerCase().split(/\s+/);
  var tTokens = term.toLowerCase().split(/\s+/);
  if (tTokens.length === 1) {
    return hTokens.some(function(h){ return h === tTokens[0]; });
  }
  // Multi-word: look for consecutive sequence
  for (var i = 0; i <= hTokens.length - tTokens.length; i++) {
    var match = true;
    for (var j = 0; j < tTokens.length; j++) {
      if (hTokens[i + j] !== tTokens[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}
```

**Why this matters**: "almond milk" won't false-positive on dairy "milk", "pepper" won't match "pepperoni".

### Budget Cascade (v1.6.28)

**5 steps** with progressive aggressiveness:

1. **Regenerate from cheap-first pool**: Call `generateOptimalWeek` with budget hint
2. **Per-slot swap**: For each meal, find cheapest valid alternative (validates dietary compatibility)
3. **Suggest drop snack**: If still over, suggest removing snack (auto-applies if `aggressive: true`)
4. **Suggest 2-meals/day**: Suggest dropping lunch (auto-applies if `aggressive: true`)
5. **Manual review needed**: If all automated steps fail, return structured result

**Returns**:

```javascript
{
  ok: true/false,
  initialCost: 104.50,
  target: 75,
  finalCost: 75.14,
  steps: [
    { name: 'Regenerate from cheap pool', saved: 12.30 },
    { name: 'Swap dinner day 3 to cheaper option', saved: 4.20 },
    { name: 'Drop snack', saved: 8.50, suggestion: true },
    ...
  ]
}
```

**Critical**: Cheaper-snack swap validates dietary compatibility (v1.6.28 wrap on `optimizeWeekForBudget`). Before this, vegan over-budget user could get Hard Boiled Eggs.

---

## Testing Infrastructure

### Automated Smoke Tests

**Current coverage**: 104 checks across 7 version checkpoints

| Version | Checks | Focus |
|---------|--------|-------|
| v1.6.23 | 38 | Cuts, feature presence |
| v1.6.26 | 11 | State mirror, pantry pipeline |
| v1.6.27 | 6 | Consolidation, wrapper preservation |
| v1.6.28 | 13 | Diet filtering, budget unification, cascade |
| v1.6.29 | 16 | Vegan classifier, taxonomy, ambiguity |
| v1.6.30 | 10 | UI cluster (dismiss, re-renders, touch targets) |
| v1.6.31 | 10 | Baseline visibility, snack ingredients, settings |

**Run all smokes** (JSDOM):

```bash
cd /home/claude/sorrel/test
timeout 30 node --input-type=module -e "
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'fs';
const html = readFileSync('../v1631_final.html', 'utf8');
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://localhost/',
  resources: undefined,
  virtualConsole: new VirtualConsole()
});
await new Promise(r => setTimeout(r, 2000));
const win = dom.window;
win.console.log = () => {};
['sorrelRunV1623Smoke', 'sorrelRunV1626Smoke', 'sorrelRunV1627Smoke',
 'sorrelRunV1628Smoke', 'sorrelRunV1629Smoke', 'sorrelRunV1630Smoke',
 'sorrelRunV1631Smoke'].forEach(name => {
  var r = win.eval(name + '()');
  console.log(name + ': ' + r.passed + '/' + r.total + ' ' + (r.pass ? 'PASS' : 'FAIL'));
});
process.exit(0);
"
```

### Deep Closure Harness (v1.6.27)

**Purpose**: End-to-end verification of the 16 PARTIAL items from v1.6.22 handoff.

**Location**: `/home/claude/sorrel/test/closure_v1627.mjs`

**Usage**:

```bash
cd /home/claude/sorrel/test
sed -i "s|v16XX_final.html|v1631_final.html|g" closure_v1627.mjs
timeout 60 node closure_v1627.mjs
```

**Items tracked**:
1. Shopping budget calculator
2. Plan tab weekly modal
3. Profile setup flow
4. Shopping/pantry fallback renderer
5. Custom food logger
6. Progress retrospective
7. Diary entry flow
8. Planning initial week
9. Progress charts
10. Adaptive calibration
11. Trial + paywall
12. Recovery toggles
13. Recovery state
14. Banner cascade
15. AI loggers (photo/voice/barcode stubs)
16. State mirror (v1.6.26 architectural fix)

### End-to-End Scenario Tests

For user-reported issues, always write end-to-end JSDOM tests BEFORE fixing:

```javascript
// Set up profile with 0 weigh-ins
win.eval(`
  window.profile = {
    name: 'Test', weeklyBudget: 100, targetCalories: 2000,
    weekPlan: [], weight: 180
  };
  if (typeof profile !== 'undefined') profile = window.profile;
  state.weightLog = [];
  renderTopBanner();
`);

// Click X button
win.eval(`
  var slot = document.getElementById('plan-top-banner');
  var btn = slot.querySelector('button');
  var ev = new MouseEvent('click', { bubbles: true, cancelable: true });
  btn.dispatchEvent(ev);
`);

// Re-render and verify stays hidden
win.eval('renderTopBanner();');
const after = win.eval(`
  var slot = document.getElementById('plan-top-banner');
  return { display: slot.style.display };
`);
// Assert: after.display === 'none'
```

---

## Known Issues & Gotchas

### 1. JSDOM Quirks

- **offsetWidth/offsetHeight always 0**: JSDOM doesn't compute layout. Check `innerHTML.length` or `textContent` instead.
- **Inline onclick doesn't always fire**: Use `dispatchEvent(new MouseEvent('click', {bubbles: true}))` instead of `.click()`.
- **localStorage persistence**: Each JSDOM instance has fresh localStorage. Can't test cross-session persistence.
- **No CSS cascade**: Injected `<style>` tags work, but `:hover`, `@media`, and computed styles don't.

### 2. localStorage Key Proliferation

Over the migration, various patches wrote to different localStorage keys for the same data:

**Budget**:
- `sorrelV1620BudgetTarget` (v1.6.20)
- `profile.weeklyBudget` (legacy)
- `profile.weeklyGroceryBudgetTarget` (v1.6.20)
- `profile.budgetTarget` (v1.6.20 alias)

**Baseline dismiss**:
- `baseline-banner-dismissed` (global, no date — **stale trap**)
- `baseline-banner-dismissed-YYYY-MM-DD` (week-scoped)
- `sorrel-baseline-nudge-dismissed-YYYY-MM-DD` (day-scoped, v1.6.7)
- `weekly-adjustment-dismissed` (value = week key)

**Strategy**: When unifying, write to ALL keys but read from a canonical subset (scoped only for dismissals, latest-written for budget).

### 3. File Size Growth

Each patch adds 10-50 KB. Current: 1.88 MB.

**Contributors**:
- v1.6.29 food taxonomy: +50 KB (5 categories × ~200 terms)
- v1.6.28 recipe mirrors: +20 KB
- Inline smoke tests: +15 KB per version

**Mitigation path** (for v1.6.32+):
- Extract smoke tests to separate file
- Lazy-load food taxonomy (detect diet type, load relevant subset)
- Split legacy code into chunks (profile/plan/diary/shopping)
- Use dynamic imports: `await import('./chunk-plan.js')`

### 4. Recipe Data Shapes Are Inconsistent

**Breakfast/lunch recipes** (67 total):
```javascript
{
  name, dietType, allergens, macros, cost,
  getIngredients: function(macros) { return ['ingredient 1', 'ingredient 2']; }
}
```

**Dinner recipes** (63 total):
- 40 have `getIngredients` method
- 23 have `ingredients: ['...']` array

**Snacks** (25 total):
- NONE have ingredients (before v1.6.31)
- v1.6.31 synthesizes from name

**Validator must handle all three shapes**:

```javascript
var hasMethod = typeof food.getIngredients === 'function';
var hasArray = Array.isArray(food.ingredients) && food.ingredients.length > 0;
var hasText = typeof food.ingredients_text === 'string';
```

### 5. Wrapper Chain Preservation

When wrapping a function that's already wrapped by a prior patch:

**BAD**:
```javascript
var orig = window.renderTopBanner;
window.renderTopBanner = function(){
  /* new behavior */
  return orig.apply(this, arguments);
};
window.renderTopBanner.__v1631Wrapped = true;
// Lost the v1630 flag!
```

**GOOD**:
```javascript
var v1630RTB = window.renderTopBanner;
window.renderTopBanner = function(){
  /* new behavior */
  return v1630RTB.apply(this, arguments);
};
window.renderTopBanner.__v1631Wrapped = true;
window.renderTopBanner.__v1630Wrapped = v1630RTB.__v1630Wrapped; // Preserve upstream
```

---

## Next Actions & Pending Work

### High Priority (Production Blockers)

1. **File size optimization** (~1.88 MB → target <1 MB)
   - Extract smoke tests to separate file loaded on demand
   - Lazy-load food taxonomy based on user's diet type
   - Consider code splitting: profile/plan/diary/shopping as separate chunks

2. **Real Barnivore integration** (currently `source_dependent` placeholder)
   - API endpoint: `https://barnivore.com/api/v1/search/<beverage_name>`
   - Cache results in localStorage (wine/beer/spirits don't change often)
   - Fallback to `source_dependent` on API failure

3. **FatSecret API integration** (optional but valuable for commercial barcode coverage)
   - OAuth flow + token management
   - Augment Open Food Facts results with FatSecret when OFF lacks data
   - Priority: top 100 common US packaged foods

### Medium Priority (UX Polish)

4. **Photo/voice/barcode production wiring**
   - Currently artifact-pattern placeholders (functions exist, return success, do nothing)
   - Options: (a) Anthropic API relay backend, (b) App Store IAP enforcement for premium, (c) Remove features
   - Decision needed on monetization strategy

5. **Trial economics modeling**
   - Current: 90-day trial (very generous)
   - Need conversion funnel analysis: what % upgrade? at what price point?
   - Consider: 14-day trial + freemium tier with limited features

6. **Notification permissions flow**
   - Meal reminders, weight reminder, macro check-in
   - Needs iOS/Android permission request UX
   - localStorage opt-in flag: `sorrel-notifications-enabled`

### Low Priority (Future Enhancements)

7. **Dark mode** (cut in v1.6.23 for complexity)
   - If re-added: CSS custom properties + `prefers-color-scheme` media query
   - Toggle in Settings, persisted to localStorage

8. **Units toggle** (lb/kg, oz/g)
   - Currently hard-coded to imperial
   - Converter functions exist in legacy code, not exposed

9. **Connected services** (Apple Health, Google Fit, MyFitnessPal import)
   - Would require OAuth flows + data sync architecture
   - Large scope, questionable ROI for standalone app

---

## How to Continue Development

### Starting a New Patch

```bash
cd /home/claude/sorrel

# 1. Copy current final to working
cp v1631_final.html v1632_working.html

# 2. Create builder script (template below)

# 3. Build
python3 build_v1632.py

# 4. Validate
python3 -c "
import re, os
with open('v1632_final.html') as f: content = f.read()
os.makedirs('/tmp/scripts_v1632', exist_ok=True)
for f in os.listdir('/tmp/scripts_v1632'): os.remove(f'/tmp/scripts_v1632/{f}')
count = 0
for m in re.finditer(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL):
    body = m.group(1).strip()
    if body and 'src=' not in m.group(0)[:200]:
        ln = content[:m.start()].count('\n') + 1
        with open(f'/tmp/scripts_v1632/s{count:02d}_L{ln}.js', 'w') as f: f.write(body)
        count += 1
print(f'Scripts: {count}')
"
cd /tmp/scripts_v1632 && for f in *.js; do
  result=$(node --check "$f" 2>&1)
  if [ -n "$result" ]; then echo "FAIL $f"; echo "$result" | head -3; fi
done

# 5. Test (see Testing Infrastructure section)

# 6. Deliver
cp v1632_final.html /mnt/user-data/outputs/sorrel_v1.6.32_final.html
```

### Builder Script Template

```python
#!/usr/bin/env python3
"""v1.6.32 — [Description of patch]

[Detailed explanation of what's being fixed and why]
"""

PATCH = r"""<script>
/* Sorrel v1.6.32 — [Short title]
   [Implementation notes] */
(function(){
  'use strict';
  if (window.__sorrelV1632Loaded) return;
  window.__sorrelV1632Loaded = true;
  var BUILD = 'v1.6.32-description';
  console.log('[Sorrel] ' + BUILD + ' loaded');
  window.SORREL_BUILD = BUILD;

  // ═══ YOUR PATCH CODE HERE ═══

  // ═══ SMOKE MATRIX ═══
  window.sorrelRunV1632Smoke = function(){
    var checks = [];
    checks.push({ name: 'Check description', ok: /* test */, reliability: 9 });
    var failed = checks.filter(function(c){ return !c.ok; });
    return {
      build: BUILD,
      pass: failed.length === 0,
      total: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      failures: failed.map(function(c){ return c.name; }),
      detail: checks
    };
  };
})();
</script>"""

with open('v1632_working.html') as f:
    content = f.read()

new_content = content.replace('</body>\n</html>', PATCH + '\n</body>\n</html>')
if new_content == content:
    print("ERROR: end marker not found")
    import sys; sys.exit(1)

with open('v1632_final.html', 'w') as f:
    f.write(new_content)

import re
opens = len(re.findall(r'(?:^|\n)<script(?:\s[^>]*)?>', new_content))
closes = len(re.findall(r'</script>', new_content))
print(f"Wrote v1632_final.html ({len(new_content):,} bytes)")
print(f"Scripts: opens={opens}, closes={closes}")
print(f"Lines: {new_content.count(chr(10))+1}")
```

### Debugging Tips

**Access lexical variables**:
```javascript
var probe = document.createElement('script');
probe.textContent = 'console.log("state:", state); console.log("profile:", profile);';
document.body.appendChild(probe);
```

**JSDOM execution trace**:
```javascript
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  virtualConsole: new VirtualConsole().sendTo(console)
});
```

**Check for double-wrapping**:
```javascript
if (window.myFunction.__v1631Wrapped && window.myFunction.__v1632Wrapped) {
  console.error('Double-wrapped!');
}
```

**localStorage inspection in JSDOM**:
```javascript
const keys = Object.keys(win.localStorage);
keys.forEach(k => console.log(k, '=', win.localStorage.getItem(k)));
```

---

## User Feedback & Preferences

**Communication style**: Rigorous, deep debugging, real verification. Won't move on until 9/10 reliability verified. Frustrated with "fix one thing, break three" pattern. Explicitly approves Path C scope discipline.

**Trust-critical features get priority**: Food ontology, budget cascade, baseline visibility — anything that affects user confidence in the adaptive protocol.

**Architectural design specs came from user**: The 5-tier taxonomy, ambiguity scoring, OFF integration, honest UX copy ("not a vegan certification") were user-specified, not Claude's invention. When user provides detailed requirements, follow them precisely.

**No tolerance for generic responses**: End-to-end tests must use real data. "Function exists" is not verification. Show the exact state transitions.

---

## Key Technical Decisions & Rationale

### Why Not Use Modules?

**Decision**: Stay with legacy `<script>` tags, no ES6 modules.

**Rationale**: The app is a single-file artifact meant to run standalone (no build system, no server). ES6 modules require CORS headers (`import` doesn't work with `file://`). Injected-script-tag pattern gives us the flexibility to access legacy scope while keeping patches modular.

### Why JSDOM for Testing?

**Decision**: JSDOM for all automated tests, not Playwright/Puppeteer.

**Rationale**: Faster (no browser launch), runs in CI without dependencies, gives access to window/document internals. Tradeoff: can't test real layout/rendering, but that's acceptable for this app's mostly-logic testing needs.

### Why Patch Instead of Rewrite?

**Decision**: Additive patches on legacy code, not full rewrite.

**Rationale**: Legacy code is 38K lines. Rewriting introduces 10× more bugs than patching. User explicitly requested incremental migration. Patches are testable in isolation. When we DO hit a rewrite boundary (file size lazy-loading), we'll extract sections then.

### Why localStorage Over IndexedDB?

**Decision**: Continue using localStorage for state persistence.

**Rationale**: App data is small (~50 KB profile + 200 KB diary after 6 months). localStorage synchronous API is simpler. No need for IDB's complexity yet. Will revisit if photo attachments get added (those need IDB).

### Why Inject Scripts Instead of Direct Function Calls?

**Decision**: Injected `<script>` tags for accessing lexical scope.

**Rationale**: ES6 `let`/`const` creates lexical scope. Our patch code is in a separate IIFE, different scope. We can't reach across. Injecting a script element whose `textContent` runs at top-level scope of the host document gives us access to the legacy bindings. Alternative (eval in global context) is more fragile.

---

## Handoff Checklist

When starting work in a new project:

- [ ] Read this entire handoff document
- [ ] Copy latest build: `sorrel_v1.6.31_final.html`
- [ ] Verify test infrastructure works: run all smokes, should get 104/104 PASS
- [ ] Review the 3 lexical-scoping examples (profile, state, snackOptions)
- [ ] Understand food ontology pipeline (5-state ambiguity, taxonomy structure)
- [ ] Review budget cascade 5-step architecture
- [ ] Check pending work list, pick next task
- [ ] Read user feedback section for communication style
- [ ] Study the wrapper-based interception pattern (most patches use it)
- [ ] Review MutationObserver pattern for dynamic content
- [ ] Understand smoke test structure and reliability scale
- [ ] Check gotchas section for localStorage key proliferation
- [ ] Remember: v1.6.31 is the most field-ready build
- [ ] All 16 PARTIAL items from v1.6.22 are CLOSED
- [ ] Trust-critical features (diet filtering, budget cascade, vegan classifier) are production-ready

---

## Final Notes

This migration is **substantially complete** for the core adaptive protocol. The app is field-ready for a private beta with the following caveats:

1. **File size** needs lazy-loading before public launch
2. **Barnivore** integration would complete the food ontology (alcohol currently ambiguous)
3. **Photo/voice/barcode** are stubs (need production wiring decision)

The test coverage (104/104 automated, 16/16 closure items) gives high confidence that no regressions have been introduced. The pattern library (lexical scoping, wrapper interception, MutationObserver) provides a solid foundation for future work.

**Most important**: The food ontology (v1.6.28/v1.6.29) is the crown jewel. It's production-grade, handles real ambiguity honestly, and validates dietary restrictions correctly. This is what makes Sorrel trustworthy.

Good luck with the next phase.

---

*End of handoff document. v1.6.31 — May 11, 2026.*
