# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sorrel (v1.6.31) is a standalone single-file HTML nutrition & fitness tracker. All app code lives in `index.html` (1.88 MB, ~40,000 lines). There is no npm project, no build system, and no server — the file runs directly in a browser or as a PWA.

Full technical reference: [SORREL_MASTER_REFERENCE.md](SORREL_MASTER_REFERENCE.md)  
Build history and patterns: [sorrel_handoff_v1.6.31.md](sorrel_handoff_v1.6.31.md)

---

## Build Workflow

Each version is a self-contained IIFE `<script>` tag appended before `</body></html>` by a Python builder script:

```bash
cp index.html v16XX_working.html          # copy current build
# write build_v16XX.py using the builder template (see SORREL_MASTER_REFERENCE.md §5)
python3 build_v16XX.py                    # produces v16XX_final.html
```

Validate extracted scripts before shipping:

```python
# Extract all inline <script> blocks and syntax-check each with node --check
import re, os
with open('v16XX_final.html') as f: content = f.read()
os.makedirs('/tmp/scripts_check', exist_ok=True)
count = 0
for m in re.finditer(r'<script(?:\s[^>]*)?>(.*?)</script>', content, re.DOTALL):
    body = m.group(1).strip()
    if body and 'src=' not in m.group(0)[:200]:
        with open(f'/tmp/scripts_check/s{count:02d}.js', 'w') as f: f.write(body)
        count += 1
# then: for each /tmp/scripts_check/*.js: node --check <file>
```

After a green build, rename `v16XX_final.html` → `index.html` and commit.

---

## Running Tests

104 automated smoke tests run via JSDOM (requires `npm install jsdom` once):

```bash
timeout 30 node --input-type=module -e "
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'fs';
const html = readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true,
  url: 'https://localhost/', virtualConsole: new VirtualConsole() });
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

Every new patch must add a `window.sorrelRunV16XXSmoke()` function following the structure in [SORREL_MASTER_REFERENCE.md §4](SORREL_MASTER_REFERENCE.md).

---

## Architecture

### Single-file monolith with additive patches

- `index.html` contains 2 large CSS `<style>` blocks and ~33 `<script>` blocks
- CDN-only dependencies: Chart.js 4.4.0, QuaggaJS 1.8.4
- Each patch is a versioned IIFE (`window.__sorrelV16XXLoaded` guard) appended to the file
- All state is persisted in `localStorage` — no backend, no database

### Lexically-scoped variables — the #1 recurring gotcha

`let`/`const` at the top level of a legacy `<script>` block are **not** on `window`. Patches in separate `<script>` tags cannot see them directly. Three known occurrences:

| Variable | Approx. line |
|---|---|
| `let profile` | ~2000 |
| `let state` | ~9930 |
| `const snackOptions` | ~4975 |

**Canonical fix** — inject a script whose body runs at host top-level scope:

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

### Patch patterns

**Wrapper interception** — augment existing functions without rewriting them:

```javascript
if (typeof window.logWeight === 'function' && !window.logWeight.__v1630Wrapped) {
  var orig = window.logWeight;
  window.logWeight = function(weightLb, dateISO) {
    var out = orig.apply(this, arguments);
    try { if (typeof renderTopBanner === 'function') renderTopBanner(); } catch(e){}
    return out;
  };
  window.logWeight.__v1630Wrapped = true;
}
```

Always preserve ALL prior version wrapper flags when re-wrapping (see [SORREL_MASTER_REFERENCE.md §5 Pattern 2](SORREL_MASTER_REFERENCE.md)).

**MutationObserver** — for dynamically-created DOM (settings sheet, modals):

```javascript
var obs = new MutationObserver(function(mutations) {
  mutations.forEach(function(m) {
    m.addedNodes.forEach(function(node) {
      if (node.nodeType !== 1) return;
      if (node.id === 'settingsSheet') patchSettingsVersion(node);
    });
  });
});
obs.observe(document.body, { childList: true, subtree: true });
```

### Food ontology — do not deviate from user-specified architecture

- **Never** read `profile.dietType` directly. Always use `canonicalDietType(p)`:

```javascript
function canonicalDietType(p) {
  if (!p) return 'omnivore';
  return p.dietType ||
         (Array.isArray(p.diets) ? p.diets[0] : null) ||
         p.diet || p.dietPreference || 'omnivore';
}
```

- 5-state vegan classifier output: `not_vegan | likely_not_vegan | source_dependent | no_animal_found | unknown`
- Plant-confirmed terms must be scanned **first** (longest phrases first) to prevent false positives (`pepper` → `pepperoni`)
- Required UX copy: "No obvious animal-derived ingredients found. This is not a vegan certification."

### Budget cascade

Always use `getBudget()` / `setBudget(v)` — they write all 3 budget fields (`weeklyBudget`, `weeklyGroceryBudgetTarget`, `budgetTarget`) plus `localStorage` atomically. Never write individual fields directly.

---

## Known Gotchas

**localStorage key proliferation** — baseline dismiss has multiple scoped keys that must all be honored:
- `baseline-banner-dismissed` (global, undated — stale trap, cleared on render in v1.6.31)
- `baseline-banner-dismissed-YYYY-MM-DD` (week-scoped)
- `sorrel-baseline-nudge-dismissed-YYYY-MM-DD` (day-scoped)

**JSDOM limitations** — `offsetWidth/offsetHeight` always returns 0; use `innerHTML.length` or `textContent` to detect rendered output. Use `dispatchEvent(new MouseEvent('click', {bubbles:true}))` rather than `.click()`.

**Recipe data shape inconsistency** — validator must handle all three shapes:

```javascript
var hasMethod = typeof food.getIngredients === 'function';   // breakfast/lunch
var hasArray  = Array.isArray(food.ingredients) && food.ingredients.length > 0; // some dinners
var hasText   = typeof food.ingredients_text === 'string';   // OFF products
```

**File size** — currently 1.88 MB and grows ~10–50 KB per patch. File size optimization is the next high-priority milestone (target < 1 MB).

**Wrapper chain preservation** — when re-wrapping a function, copy all prior version flags forward:

```javascript
window.myFn.__v1632Wrapped = true;
window.myFn.__v1631Wrapped = priorFn.__v1631Wrapped; // preserve upstream chain
```

---

## Pending High-Priority Work

From [SORREL_MASTER_REFERENCE.md §12](SORREL_MASTER_REFERENCE.md):

1. **File size optimization** → target < 1 MB: extract smoke tests, lazy-load taxonomy by diet type
2. **Barnivore API** integration for alcohol vegan classification (`https://barnivore.com/api/v1/search/<name>`)
3. **FatSecret API** OAuth for packaged foods coverage
4. **Photo/voice/barcode wiring** — currently stubs; monetization decision needed first

Features deliberately cut in v1.6.23 (do not re-add without explicit direction): dark mode, trial upsells, social/community, gamification, premium tiers, shop/ads.
