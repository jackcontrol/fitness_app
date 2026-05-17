# Sorrel v1.6.31 — Next Session Plan

**Created:** 2026-05-16  
**Branch:** jack-changes  
**Context:** Gap analysis against `sorrel_developer_integration_strategy_v2_metabolic_reset.md` showed most v1.6.23 "partials" are already working. Three actual gaps remain before v1.6.24 (Plan Mutation Pipeline) can begin.

---

## Verified working — do not re-implement

| Feature | Location |
|---|---|
| Log It / undo for all meals incl. snack | `src/features/diary.js`, `src/ui/plan.js` |
| Adjust/View week runtime | `src/ui/modals/weeklyPlan.js:309-485` |
| Sunlight local date | `src/features/sunlight.js:41` + `src/utils/dates.js:23` |
| Vitamin D toggle | `src/ui/modals/profile.js:369` (profile modal page 5) |
| Custom routine add/toggle/remove | `src/features/customRoutine.js`, `src/ui/routine.js:355` |
| Have It lowering checkout estimate | `src/ui/shopping.js:365-371` (`pantrySavings` deducted) |

---

## Task 1 — Version labels (2 lines)

**File:** `index.html`

```html
<!-- Change FROM: -->
<title>Sorrel — v1.6.22</title>
<meta name="version" content="v1.6.22-thin-shell"/>

<!-- Change TO: -->
<title>Sorrel — v1.6.31</title>
<meta name="version" content="v1.6.31"/>
```

---

## Task 2 — Budget card: Target / Checkout estimate / Over by

**Gap:** Shopping header shows only `#total-selected-cost`. Budget target (`getBudget()`) is never displayed alongside the estimate.

**Shell change** (`src/ui/shell.js` ~line 949):  
Replace the single "Total Weekly Cost" div with a 3-row card containing:
- `#shopping-budget-target` — user's budget target
- `#shopping-checkout-estimate` — replaces current `#total-selected-cost`
- `#shopping-over-budget` — amber row, hidden when under budget

**Shopping change** (`src/ui/shopping.js`, `renderDynamicShopping()` ~line 345):
```js
import { getBudget } from '../features/budget.js';
import { getProfile } from '../state/index.js';

// inside renderDynamicShopping():
const target = getBudget(getProfile());
const delta = adjustedTotal - target;
el('#shopping-budget-target').textContent = `$${target.toFixed(2)}`;
el('#shopping-checkout-estimate').textContent = `$${adjustedTotal.toFixed(2)}`;
const overEl = el('#shopping-over-budget');
if (delta > 0) {
  overEl.textContent = `$${delta.toFixed(2)} over`;
  overEl.style.display = '';
} else {
  overEl.style.display = 'none';
}
```

Both imports already exported from those modules.

---

## Task 3 — Bought and Sub states for shopping items

**Gap:** Only Need (default) and Have (pantry) exist. Bought and Sub are absent.

**State** (`src/state/appState.js` — add to `defaultState`):
```js
shoppingBought: {},   // { [itemId]: true }
shoppingSub: {},      // { [itemId]: true }
```

**Toggle functions** (`src/ui/shopping.js` — model on `toggleShoppingPantry` at line 38):
```js
export function toggleShoppingBought(itemId) { ... }  // expose as window.toggleShoppingBought
export function toggleShoppingSub(itemId) { ... }     // expose as window.toggleShoppingSub
```

**Cost logic**: Bought items deduct from estimate identically to Have It (both represent "not buying this trip"). Sub items have no cost effect.

**Item row HTML**: Replace "✓ have it" toggle with 4-button row:
```
[ Need it ]  [ Have it ]  [ Bought ]  [ Sub ]
```
Active state = emerald. Exactly one state active at a time per item.

**Files to change:**
| File | Change |
|---|---|
| `src/state/appState.js` | Add `shoppingBought`, `shoppingSub` to `defaultState` |
| `src/ui/shopping.js` | Toggle fns + item row 4-state buttons + cost deduction for Bought |
| `src/ui/shell.js` | Update shopping item template if items rendered there |

---

## Smoke checklist

- [ ] Browser tab shows "Sorrel — v1.6.31"
- [ ] Shopping tab shows 3-row budget card (Target / Estimate / Over by)
- [ ] Have It → estimate decreases, card updates
- [ ] Bought → estimate decreases identically to Have It
- [ ] Sub → item styled differently, estimate unchanged
- [ ] Budget $10 → amber Over target row visible
- [ ] Budget $500 → Over target row hidden
- [ ] No regression: Log It, week modal, sunlight, routine all still work

---

## What comes after (v1.6.24)

`sorrelCommitPlanChange(reason, mutationFn)` — canonical plan mutation pipeline:
1. snapshot current plan
2. apply mutation
3. validate diet safety (`sorrelValidateFoodForProfile`)
4. recalculate macros
5. rebuild grocery list
6. recalculate checkout estimate
7. persist state
8. refresh relevant views
9. show honest feedback

This is the prerequisite for Protocol Engine (v1.6.26) and Recipe Inbox (v1.7.0).
