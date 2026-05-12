# SORREL — Master Reference Document
## For Claude Code Continuation Build

> **Current build:** `v1.6.31` (1.88 MB, 40,226 lines)
> **Handoff doc version:** 1.0 — May 11, 2026
> **Test coverage:** 104/104 automated smoke tests across 7 version checkpoints
> **Status:** Trust-critical infrastructure complete. Production-ready pending lazy-loading optimization.
> **Origin:** Migrated from ChatGPT Custom GPT artifact → standalone Claude-based single-file HTML app.

---

## 1. Origin & Project Philosophy

Sorrel began as a ChatGPT Custom GPT artifact and was migrated to a standalone Claude-based HTML app. The migration approach was **incremental additive patching** — not a rewrite. Each patch is a self-contained `<script>` IIFE that wraps existing functions or injects new behavior. This is intentional and load-bearing.

**Why patch instead of rewrite?** Legacy code is 38K+ lines. Rewriting introduces 10× more bugs than patching. User explicitly requested incremental migration. Patches are testable in isolation.

**Why no ES6 modules?** Single-file artifact runs standalone (no build system, no server). ES6 modules require CORS headers — `import` doesn't work with `file://`. Injected-script-tag pattern gives access to legacy scope while keeping patches modular.

**Why localStorage over IndexedDB?** App data is small (~50 KB profile + 200 KB diary after 6 months). Synchronous localStorage API is simpler. Will revisit if photo attachments are added (those need IDB).

---

## 2. Visual Identity System

### Color Palette (CSS Variables)
```css
--accent-primary:   #0a7d5a   /* Deep emerald — signature brand color */
--accent-secondary: #10b981   /* Lighter emerald — gradient end / hover */
--accent-soft:      #d1f0e3   /* Tinted emerald background */
--accent-deep:      #064e3b   /* Darkest emerald */
--accent-gradient:  linear-gradient(135deg, #0a7d5a 0%, #10b981 100%)
--energy:           #f59e0b   /* Warm amber — streaks/wins ONLY */
--energy-soft:      #fef3c7
--bg-app:           #f7f5f1   /* Bone/off-white — warm, not clinical */
--bg-card:          #ffffff
--text-primary:     #1a2332   /* Deep ink */
--text-secondary:   #5a6573
--text-tertiary:    #94a0ad
```

### Typography
- System font: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', Segoe UI, Roboto`
- Font size tokens: `--font-xs: 11px` / `--font-sm: 13px` / `--font-base: 15px` / `--font-lg: 18px` / `--font-xl: 24px`
- **Tabular numbers enforced on all live data displays** via `font-variant-numeric: tabular-nums`

### Signature Elements
- **Meal slot rule:** 18px wide, 3px tall emerald bar + 7px filled dot at right end — pure CSS, brand's identifying mark
- **Header gradient:** `linear-gradient(135deg, #064e3b, #0a7d5a, #10b981)` with 14px border radius
- **Primary CTAs:** Always use `var(--accent-gradient)` — never flat color (v1.4 bug was caused by this exact mistake)
- **PWA theme color:** `#0a7d5a`

> "Differentiates from the purple/blue incumbents. Signals vitality + natural health. Slight warmth keeps the app from feeling clinical."

---

## 3. Architecture

| Layer | Technology | Notes |
|---|---|---|
| UI Framework | Vanilla JS, no framework | Intentional — no build step |
| Charts | Chart.js v4.4.0 (CDN) | |
| Barcode Scanning | QuaggaJS v1.8.4 (CDN) | **Stub only** — production wiring pending |
| AI Photo/Voice | Claude API `/v1/messages` | **Stub only** — production wiring pending |
| Persistence | `localStorage` only | v2 migrates to cloud-synced DB |
| Deployment | Single HTML file PWA | `manifest-personalized.json` |
| Target viewport | max-width: 600px, mobile-first | |

### State Objects (ALL LEXICALLY SCOPED — See Pattern 1)
- `let profile` — user profile (~line 2000)
- `let state` — transient app state, persisted as `'tracker-state'` (~line 9930)
- `const snackOptions` — snack database (~line 4975)
- `foodDiary` — food log, persisted as `'food-diary'`

---

## 4. Build Process & Version History

### Workflow (each patch)
```
1. cp v1631_final.html v1632_working.html
2. Create build_v1632.py (see Pattern 5 template)
3. python3 build_v1632.py
4. Node --check all extracted scripts
5. Run all smoke tests (must pass 104+)
6. cp v1632_final.html /mnt/user-data/outputs/sorrel_v1.6.32_final.html
```

### Phase 1: Foundation (v1.6.22 → v1.6.23)

**v1.6.22** — Initial handoff. 16 PARTIAL items. Discovery of first lexical scoping bug (`let profile`).

**v1.6.23** — **12 features deliberately removed:**
- Dark mode / themes
- Trial upsells
- Social / community features
- Gamification / achievements
- Premium tiers / subscription
- Shop / partners / ads

Budget feature preserved. 38 smoke tests defined.

### Phase 2: Architectural Fixes (v1.6.26 → v1.6.27)

**v1.6.26** — Root cause of pantry/shopping bugs found:
```javascript
// Legacy at line 9930:
let state = { weightLog: [], pantry: {}, ... };
// Patch IIFE:
const s = () => window.state || (window.state = {});
// window.state is UNDEFINED because `let` doesn't expose to window!
// Falls back to empty {} — all reads return nothing.
```
Fix: inject script element that runs at top-level host scope, assigns `window.state = state`. Same heap object — no sync needed.

Pantry verified: $189.85 → $186.86 → $189.85 round-trip. ✓

**v1.6.27** — `sorrelRunAllSmokes()` added. All 16 PARTIAL items CLOSED. 57/58 smokes pass.

### Phase 3: Food Ontology Overhaul (v1.6.28 → v1.6.29)

**v1.6.28** — Screenshot audit revealed critical trust bugs:
1. **Diet filtering broken:** `filterMealsByCuisine()` reads `profile.dietType` (singular, never set — only `profile.diets` array exists). Vegan user got omnivore plan. **0/28 meals were vegan.** Breakfast was "Eggs + Toast + Smoothie."
2. **Validator substring bug:** "pepper" matched "pepperoni", "almond milk" matched "milk."
3. **Budget desync:** 3 fields + localStorage out of sync. Home $125, Shopping $175, Plan $223.
4. **Budget cascade stubbed:** Steps 3–5 were TODO. Vegan over-budget user could pick Hard Boiled Eggs.

After fixes: **28/28 vegan meals. Cascade: $104 → $75.14.**

**v1.6.29** — User-specified ambiguity-aware dietary stack:
- 5-state output (not binary)
- Open Food Facts primary signal
- Full ingredient taxonomy (5 categories)
- Word-boundary matching (prevents false positives)
- Honest UX copy: "No obvious animal-derived ingredients found. This is not a vegan certification."

Results: Bacon → not_vegan ✓ | Almond milk → no_animal_found ✓ | Pepper → no_animal_found ✓ | Wine → source_dependent ✓ | Worcestershire → likely_not_vegan ✓

### Phase 4: UI/UX Trust Cluster (v1.6.30 → v1.6.31)

**v1.6.30** — Six trust issues fixed:
1. Baseline "X" click didn't dismiss (competing localStorage keys)
2. "Log Weight" didn't re-render after logging
3. Touch targets too small (44px iOS HIG minimum)
4. Weight input had arrows + accepted decimals
5. Budget displays diverged
6. Cascade toast was generic

**v1.6.31** — Three fixes:
1. **Baseline visibility regression:** Stale global `baseline-banner-dismissed` key. Fix: read only scoped keys (today/week), actively clear stale global on render.
2. **Snack ingredient lists:** 25/25 snacks had no ingredients. Synthesized from name. Uses injected-script pattern because `const snackOptions` is lexically scoped.
3. **Settings polish:** Export CSV + Reset Data + version strings bumped.

**104/104 total. 16/16 PARTIAL items CLOSED.**

---

## 5. Critical Patterns (DO NOT DEVIATE)

### Pattern 1: Lexical Scoping — The #1 Recurring Issue

`let`/`const` at top level of legacy script = NOT on `window`. Patches in separate `<script>` tags cannot see them.

**Three known occurrences:** `let profile` (~line 2000), `let state` (~line 9930), `const snackOptions` (~line 4975)

**Canonical Solution:**
```javascript
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
```

### Pattern 2: Wrapper-Based Interception

```javascript
if (typeof window.logWeight === 'function' && !window.logWeight.__v1630Wrapped) {
  var origLogWeight = window.logWeight;
  window.logWeight = function(weightLb, dateISO) {
    var out = origLogWeight.apply(this, arguments);
    try { if (typeof renderPlanWeightChip === 'function') renderPlanWeightChip(); } catch(e){}
    return out;
  };
  window.logWeight.__v1630Wrapped = true;
}
```

**Wrapper chain preservation (CRITICAL):**
```javascript
// BAD — loses prior version flag:
window.renderTopBanner.__v1631Wrapped = true;

// GOOD — preserves chain:
window.renderTopBanner.__v1631Wrapped = true;
window.renderTopBanner.__v1630Wrapped = v1630RTB.__v1630Wrapped;
```

### Pattern 3: MutationObserver for Dynamic Content

```javascript
var obs = new MutationObserver(function(mutations) {
  mutations.forEach(function(m) {
    m.addedNodes.forEach(function(node) {
      if (node.nodeType !== 1) return;
      if (node.id === 'settingsSheet') {
        patchSettingsVersion(node);
        injectSettingsExtras(node);
      }
    });
  });
});
obs.observe(document.body, { childList: true, subtree: true });
```

### Pattern 4: Smoke Test Structure

```javascript
window.sorrelRunV16XXSmoke = function() {
  var checks = [];
  checks.push({ name: 'Description', ok: /* test */, reliability: 9 });
  var failed = checks.filter(function(c){ return !c.ok; });
  return {
    build: BUILD, pass: failed.length === 0,
    total: checks.length, passed: checks.length - failed.length,
    failed: failed.length,
    failures: failed.map(function(c){ return c.name; }),
    detail: checks
  };
};
```

**Reliability scale:** 10 = E2E scenario | 9 = function exists + call | 8 = presence check | 7 = wrapper flag | 6 = side effect | 1–5 = heuristic

### Pattern 5: Builder Script Template

```python
#!/usr/bin/env python3
"""v1.6.32 — [Description]"""

PATCH = r"""<script>
/* Sorrel v1.6.32 — [Short title] */
(function(){
  'use strict';
  if (window.__sorrelV1632Loaded) return;
  window.__sorrelV1632Loaded = true;
  var BUILD = 'v1.6.32-description';

  // ═══ PATCH CODE HERE ═══

  window.sorrelRunV1632Smoke = function(){
    var checks = [];
    // checks here
    var failed = checks.filter(function(c){ return !c.ok; });
    return { build: BUILD, pass: failed.length === 0,
             total: checks.length, passed: checks.length - failed.length,
             failed: failed.length, failures: failed.map(function(c){ return c.name; }),
             detail: checks };
  };
})();
</script>"""

with open('v1632_working.html') as f:
    content = f.read()
new_content = content.replace('</body>\n</html>', PATCH + '\n</body>\n</html>')
if new_content == content:
    print("ERROR: end marker not found"); import sys; sys.exit(1)
with open('v1632_final.html', 'w') as f:
    f.write(new_content)
```

---

## 6. Food Ontology Architecture (Crown Jewel)

The vegan classifier is production-grade, handles real ambiguity honestly. User-specified architecture — not Claude's invention. Follow precisely.

### Canonical Diet Type Resolution — NEVER read `profile.dietType` directly

```javascript
function canonicalDietType(p) {
  if (!p) return 'omnivore';
  return p.dietType ||
         (Array.isArray(p.diets) ? p.diets[0] : null) ||
         p.diet ||
         p.dietPreference ||
         'omnivore';
}
```

### 5-State Output

```javascript
{
  status: 'not_vegan' | 'likely_not_vegan' | 'source_dependent' | 'no_animal_found' | 'unknown',
  confidence: 'high' | 'medium' | 'low',
  evidence: { hasDefinite: [...], hasLikely: [...], hasSourceDep: [...], plantHits: [...] },
  message: 'Human-readable explanation'
}
```

### Pipeline (in order)
1. OFF tags primary (`en:non-vegan` → not_vegan, `en:vegan` → no_animal_found)
2. Allergen override (dairy/eggs in `allergens` array → not_vegan)
3. Ingredient extraction (try array, `ingredients_text`, `getIngredients()`)
4. Taxonomy scan: **PLANT_CONFIRMED first (longest phrases)** → DEFINITE_ANIMAL → LIKELY_ANIMAL → SOURCE_DEPENDENT → ALCOHOL
5. Priority: definite > likely > source_dep > plantHits > unknown
6. `dietTrustedPositive: true` on recipe → skip scan, force no_animal_found

### INGREDIENT_TAXONOMY

**DEFINITE_ANIMAL** (high confidence — not_vegan):
- meat: beef, pork, lamb, chicken, turkey, duck, venison, bacon, sausage, ham, salami, pepperoni, prosciutto, chorizo, meatball, steak, ribeye, sirloin, tenderloin, brisket, ground beef, ground turkey, rotisserie chicken
- seafood: fish, salmon, tuna, cod, halibut, tilapia, trout, sardines, anchovies, shrimp, prawns, lobster, crab, scallops, clams, mussels, oysters, octopus, squid, calamari, crayfish
- dairy: milk, cream, butter, cheese, cheddar, mozzarella, parmesan, feta, brie, gouda, swiss cheese, cottage cheese, ricotta, yogurt, greek yogurt, sour cream, whey, casein, lactose, ghee, half and half, heavy cream, buttermilk, condensed milk, evaporated milk
- eggs: egg, eggs, egg white, egg yolk, scrambled eggs, fried egg, hard boiled egg, omelette, frittata, quiche, mayonnaise, aioli, hollandaise
- honey: honey, honeycomb, royal jelly
- gelatin: gelatin, gelatine, jello, jelly, gummy, marshmallow
- animal_fat: lard, tallow, suet, dripping, schmaltz, duck fat, bacon grease
- other_animal: bone broth, stock, chicken stock, beef broth, collagen, keratin

**LIKELY_ANIMAL** (medium confidence — likely_not_vegan):
- carmine/cochineal: carmine, cochineal, e120, natural red 4, crimson lake
- shellac: shellac, e904, confectioner's glaze, resinous glaze
- isinglass: isinglass, fish bladder
- lanolin: lanolin, wool fat, wool wax
- l_cysteine: l-cysteine, e920, cysteine
- hidden_animal_sauces: worcestershire, fish sauce, nam pla, nuoc mam, oyster sauce, caesar dressing, shrimp paste, anchovy paste, garum

**SOURCE_DEPENDENT** (low confidence):
- glycerin/glycerol (e422), lecithin (e322), monoglycerides/diglycerides (e471/e472), natural flavors/flavoring, white/refined/cane/beet/powdered/confectioners sugar, vitamin d3/cholecalciferol, rennet/microbial rennet/enzymes/lipase/lactase, lactic acid (e270), stearic acid (e570), omega-3/dha/epa

**PLANT_CONFIRMED** (scan FIRST — longest phrases first to prevent false positives):
- plant_milks: almond milk, soy milk, oat milk, coconut milk, rice milk, cashew milk, hemp milk, pea milk, flax milk
- plant_proteins: tofu, tempeh, seitan, tvp, textured vegetable protein, soy protein, pea protein, beyond meat, impossible burger
- plant_cheeses: vegan cheese, cashew cheese, nutritional yeast, vegan parmesan
- plant_butters: vegan butter, margarine, coconut oil butter, earth balance
- plant_yogurts: soy yogurt, coconut yogurt, almond yogurt, oat yogurt
- grains: rice, quinoa, oats, barley, wheat, pasta, noodles, bread, flour
- veggies: broccoli, spinach, kale, carrots, tomatoes, onions, garlic, peppers, mushrooms
- fruits: apples, bananas, berries, oranges, lemons, avocado
- oils: olive oil, vegetable oil, canola oil, sunflower oil, avocado oil
- nuts_seeds: almonds, walnuts, cashews, peanuts, chia seeds, flax seeds, sunflower seeds
- seasonings: salt, pepper, herbs, spices, cumin, paprika, turmeric, basil, oregano

**ALCOHOL_BARNIVORE** (→ source_dependent until Barnivore integrated):
- wine: wine, red wine, white wine, rosé, champagne, prosecco, port, sherry, vermouth
- beer: beer, ale, lager, stout, porter, ipa, pilsner, wheat beer, cider
- spirits: vodka, gin, rum, whiskey, bourbon, scotch, tequila, brandy, cognac

### Word-Boundary Matching (prevents "pepper" → "pepperoni")

```javascript
function multiwordHit(haystack, term) {
  var hTokens = haystack.toLowerCase().split(/\s+/);
  var tTokens = term.toLowerCase().split(/\s+/);
  if (tTokens.length === 1) {
    return hTokens.some(function(h) { return h === tTokens[0]; });
  }
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

---

## 7. Budget Cascade Architecture

**5-step hierarchy (v1.6.28):**
1. Regenerate from cheap-first pool via `generateOptimalWeek` with budget hint
2. Per-slot swap — cheapest valid alternative (validates dietary compatibility)
3. Suggest drop snack (auto-applies if `aggressive: true`)
4. Suggest 2 meals/day / drop lunch (auto-applies if `aggressive: true`)
5. Manual review needed — return structured result

**Always use `getBudget()` / `setBudget(v)` — they write all 3 fields + localStorage simultaneously.**

Budget field proliferation (write ALL, read from canonical):
- `profile.weeklyBudget` (legacy canonical)
- `profile.weeklyGroceryBudgetTarget` (v1.6.20)
- `profile.budgetTarget` (v1.6.20 alias)
- localStorage: `sorrelV1620BudgetTarget`

---

## 8. Meal Planning Engine

### Recipe Data Shape Inconsistency (GOTCHA)
| Type | Count | Shape |
|---|---|---|
| Breakfast/Lunch | 67 | `{ name, dietType, allergens, macros, cost, getIngredients(macros) }` |
| Dinner w/ method | 40 | Have `getIngredients()` |
| Dinner w/ array | 23 | Have `ingredients: ['...']` array only |
| Snacks (before v1.6.31) | 25 | NO ingredient data |
| Snacks (after v1.6.31) | 25 | Synthesized via `sorrelInferIngredientsFromName()` |

**Validator must handle all three shapes:**
```javascript
var hasMethod = typeof food.getIngredients === 'function';
var hasArray  = Array.isArray(food.ingredients) && food.ingredients.length > 0;
var hasText   = typeof food.ingredients_text === 'string';
```

### Meal Method Rehydration
`rehydrateMealMethods()` — re-attaches `getIngredients()` after JSON round-trip strips it. Call before shopping list generation every time.

### Macro Distribution
- 3 meals: breakfast ~25%, lunch 50% remaining, dinner 50% remaining
- 2 meals (B+D): breakfast 40%, dinner 50%
- 2 meals (L+D): lunch 45%, dinner 45%

---

## 9. Logging Methods (ACTUAL STATUS)

| Method | Status |
|---|---|
| Quick Add | LIVE |
| Food Search | LIVE |
| Log Planned Meal | LIVE |
| AI Photo Log | **STUB — no production wiring** |
| Barcode Scan | **STUB — no production wiring** |
| Voice Logging | **STUB — UI not even wired** |

Decision needed before wiring: (a) Anthropic API relay backend, (b) App Store IAP enforcement, (c) Remove

---

## 10. Testing Infrastructure

### Run All Smokes (104/104)
```bash
timeout 30 node --input-type=module -e "
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'fs';
const html = readFileSync('v1631_final.html', 'utf8');
const dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true,
  url: 'https://localhost/', virtualConsole: new VirtualConsole()
});
await new Promise(r => setTimeout(r, 2000));
const win = dom.window;
['sorrelRunV1623Smoke','sorrelRunV1626Smoke','sorrelRunV1627Smoke',
 'sorrelRunV1628Smoke','sorrelRunV1629Smoke','sorrelRunV1630Smoke',
 'sorrelRunV1631Smoke'].forEach(name => {
  var r = win.eval(name + '()');
  console.log(name + ': ' + r.passed + '/' + r.total + ' ' + (r.pass ? 'PASS' : 'FAIL'));
});
process.exit(0);
"
```

### Smoke Coverage
| Version | Checks | Focus |
|---|---|---|
| v1.6.23 | 38 | Cuts, feature presence |
| v1.6.26 | 11 | State mirror, pantry pipeline |
| v1.6.27 | 6 | Consolidation, wrapper preservation |
| v1.6.28 | 13 | Diet filtering, budget unification, cascade |
| v1.6.29 | 16 | Vegan classifier, taxonomy, ambiguity |
| v1.6.30 | 10 | UI cluster (dismiss, re-renders, touch targets) |
| v1.6.31 | 10 | Baseline visibility, snack ingredients, settings |

### JSDOM Quirks
- `offsetWidth/offsetHeight` always 0 — use `innerHTML.length` or `textContent` instead
- Inline `onclick` unreliable — use `dispatchEvent(new MouseEvent('click', {bubbles:true}))`
- Fresh localStorage per instance — can't test cross-session persistence
- No CSS cascade — `@media`, `:hover`, computed styles don't work

---

## 11. Known Gotchas

### localStorage Key Proliferation (Baseline Dismiss)
- `baseline-banner-dismissed` — global, no date — **stale trap** — cleared on render v1.6.31
- `baseline-banner-dismissed-YYYY-MM-DD` — week-scoped
- `sorrel-baseline-nudge-dismissed-YYYY-MM-DD` — day-scoped
- `weekly-adjustment-dismissed` — value = week key

### File Size Growth
Current: **1.88 MB**. Each patch +10–50 KB. v1.6.29 taxonomy alone +50 KB.

### Wrapper Chain Preservation
Always copy prior wrapper flags forward. See Pattern 2.

---

## 12. Pending Work (Prioritized)

### High Priority (Production Blockers)
1. **File size** → target <1 MB: extract smokes, lazy-load taxonomy by diet type, code split
2. **Barnivore integration** — API: `https://barnivore.com/api/v1/search/<name>`, cache in localStorage
3. **FatSecret API** — OAuth, augment OFF for top 100 US packaged foods

### Medium Priority
4. **Photo/voice/barcode wiring** — decision on monetization model first
5. **Trial economics modeling** — current 90-day trial very generous; consider 14-day + freemium
6. **Notification permissions** — meal/weight/macro reminders, iOS/Android UX

### Low Priority (Deliberately Deferred)
7. **Dark mode** — cut in v1.6.23; re-add with `prefers-color-scheme` if direction given
8. **Units toggle** (lb/kg, oz/g) — converter functions exist in legacy, not exposed
9. **Connected services** (Apple Health, MyFitnessPal import) — large scope, low ROI for standalone

---

## 13. User Communication Preferences

- **Rigorous, deep debugging, real verification.** Won't move on until 9/10 reliability.
- **No tolerance for "fix one, break three."** Scope discipline is non-negotiable.
- **Trust-critical features get priority:** food ontology, budget cascade, baseline visibility.
- **User-specified architecture must be followed precisely.** Taxonomy, ambiguity scoring, honest UX copy were all user-designed.
- **"Function exists" is not verification.** Show exact state transitions.

---

## 14. Handoff Checklist

- [ ] Read this entire reference document
- [ ] Copy latest build: `sorrel_v1.6.31_final.html`
- [ ] Run all smokes — confirm 104/104 PASS
- [ ] Review 3 lexical-scoping occurrences (profile, state, snackOptions)
- [ ] Understand food ontology pipeline (5-state, taxonomy, word-boundary matching)
- [ ] Review budget cascade 5-step + `getBudget()`/`setBudget()`
- [ ] Remember: photo/voice/barcode = stubs — wiring decision pending
- [ ] Remember: dark mode, trial upsells, social, gamification, premium tiers = CUT in v1.6.23
- [ ] Study wrapper chain preservation (preserve ALL prior version flags)
- [ ] Check localStorage key proliferation gotchas before writing new keys
- [ ] Always use `canonicalDietType()` — never read `profile.dietType` directly
- [ ] All 16 PARTIAL items from v1.6.22 are CLOSED
- [ ] Next build: v1.6.32 — file size optimization is the blocker

---

*Source: index.html v1.6.31 + sorrel_handoff_v1_6_31.md. Combined source of truth for Claude Code handoff.*
