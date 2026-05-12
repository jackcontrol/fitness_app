# Sorrel — Architecture Upgrade Roadmap

**Current state**: v1.6.31 — 1.88 MB single-file HTML, vanilla JS, no build system  
**Goal**: Reduce file size, improve maintainability, fix the API key security issue

---

## Problems Ranked by Severity

| # | Problem | Severity |
|---|---|---|
| 1 | Claude API key exposed in browser-side JS | Critical — security |
| 2 | 1.88 MB uncompressed initial payload | High — performance |
| 3 | 40K lines in one file; no module boundaries | High — maintainability |
| 4 | No npm/build tooling | Medium — developer experience |
| 5 | No TypeScript or linting | Medium — code quality |
| 6 | `localStorage` only (no cloud sync, no multi-device) | Medium — data reliability |

---

## Phase 1 — File Size Relief (no new tooling required)

**Target**: 1.88 MB → ~1.2 MB  
**Approach**: Pure additive IIFE patches; compatible with current build workflow

### 1a — Extract smoke tests out of `index.html`

The 7 version smoke suites (`sorrelRunV1623Smoke` … `sorrelRunV1631Smoke`) total ~65 KB of
inline test code that ships to every end user. Extract them to `test/smoke.js` and load only
in the JSDOM harness, not in the app.

**Steps**:
1. Create `test/smoke.js` containing all 7 smoke functions as CommonJS exports
2. In `index.html`, delete the smoke function bodies; leave stub one-liners that throw if
   called outside a test environment:
   ```javascript
   window.sorrelRunV1623Smoke = function(){ throw new Error('Load test/smoke.js first'); };
   ```
3. Update the JSDOM harness to `require('./smoke.js')` and inject into `dom.window`
4. Verify browser load is unaffected (stubs throw only if called)

**Files**: create `test/smoke.js`; modify `index.html`

### 1b — Lazy-load food taxonomy by diet type

The `INGREDIENT_TAXONOMY` object is ~50 KB (5 categories × ~200 terms). Most users only
need one dietary path. Split into per-diet files and load on demand:

```
taxonomy/
  vegan.js        ← PLANT_CONFIRMED + DEFINITE_ANIMAL + LIKELY_ANIMAL + SOURCE_DEPENDENT + ALCOHOL
  omnivore.js     ← DEFINITE_ANIMAL only (smaller set)
  index.js        ← detects canonicalDietType(profile), dynamic import()s the right file
```

In the app, replace the inline taxonomy object with:

```javascript
async function loadTaxonomy(profile) {
  var diet = canonicalDietType(profile);
  if (diet === 'vegan' || diet === 'vegetarian') {
    return (await import('./taxonomy/vegan.js')).default;
  }
  return (await import('./taxonomy/omnivore.js')).default;
}
```

**Note**: `import()` requires a server or Vite (Phase 2) to work. For Phase 1, use a
synchronous `<script>` tag approach with a `data-diet` attribute on the HTML element.

**Files**: create `taxonomy/vegan.js`, `taxonomy/omnivore.js`, `taxonomy/index.js`

---

## Phase 2 — Introduce Build Tooling

**Branch**: `feat/build-system`  
**Target**: ~600 KB minified output (`dist/sorrel.html` still standalone)

### Add `package.json` + Vite

```json
{
  "name": "sorrel",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "node test/smoke-runner.js"
  },
  "devDependencies": {
    "vite": "^5",
    "jsdom": "^24",
    "vite-plugin-singlefile": "^2"
  },
  "dependencies": {
    "chart.js": "^4.4.0",
    "@ericblade/quagga2": "^1.8.4"
  }
}
```

`vite-plugin-singlefile` produces a single self-contained `dist/index.html` with all assets
inlined — preserving the "one file to open" requirement.

### Replace CDN `<script>` tags with npm imports

Replace in `index.html`:

```html
<!-- before -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@ericblade/quagga2@1.8.4/dist/quagga.min.js"></script>
```

Create `src/main.js`:

```javascript
import Chart from 'chart.js/auto';
import Quagga from '@ericblade/quagga2';
window.Chart = Chart;
window.Quagga = Quagga;
```

Reference in `index.html`:

```html
<script type="module" src="/src/main.js"></script>
```

---

## Phase 3 — Module Extraction

**Branch**: `feat/modular`  
**Approach**: Extract in leaf-to-root order — data first, then features, then UI, then bootstrap

### Proposed `src/` structure

```
src/
  data/
    taxonomy.js      ← INGREDIENT_TAXONOMY (currently ~50 KB inline)
    recipes.js       ← breakfastRecipes, lunchRecipes, dinnerRecipes
    snacks.js        ← snackOptions (currently lexically scoped at ~line 4975)
    exercises.js     ← cardioDatabase, strengthDatabase
  features/
    diet.js          ← canonicalDietType(), classifyVegan(), multiwordHit()
    budget.js        ← getBudget(), setBudget(), budgetCascade()
    mealPlanner.js   ← generateOptimalWeek(), rehydrateMealMethods()
    diary.js         ← food logging, recentFoods, favoriteFoods
    training.js      ← exercise log, streak tracking
  state/
    profile.js       ← load/save profile, canonicalDietType adapter
    appState.js      ← state object, localStorage persistence
  ui/
    render.js        ← main render() orchestrator + tab routing
    renderDiary.js
    renderPlan.js
    renderProgress.js
    renderSettings.js
    renderShopping.js
  api/
    claudeProxy.js   ← wraps fetch() to backend proxy (Phase 4)
  main.js            ← bootstrap: init state, show profile modal or render()
```

### Extraction strategy

Each module maps existing functions — **no rewrites, only reorganization**:

1. Copy the function bodies into the new module file
2. Export them: `export { canonicalDietType, classifyVegan };`
3. In the legacy `<script>` block, replace the original definition with:
   ```javascript
   // delegated to src/features/diet.js
   ```
4. Import in `main.js`: `import { canonicalDietType } from './features/diet.js';`
5. Re-expose on `window` for any remaining inline HTML handlers:
   ```javascript
   window.canonicalDietType = canonicalDietType;
   ```

Repeat module by module. Run browser smoke checks after each extraction.

---

## Phase 4 — Backend Proxy for Claude API

**Security fix** — `index.html` currently calls `https://api.anthropic.com/v1/messages`
directly from client-side JavaScript. This requires the API key to be present in browser
memory, where it can be extracted from DevTools.

### Minimal fix: Cloudflare Worker proxy

Create `server/proxy.js`:

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const body = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,   // set in Cloudflare dashboard
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json' }
    });
  }
};
```

Create `wrangler.toml`:

```toml
name = "sorrel-proxy"
main = "server/proxy.js"
compatibility_date = "2024-01-01"

[vars]
# ANTHROPIC_API_KEY set via: wrangler secret put ANTHROPIC_API_KEY
```

Update `src/api/claudeProxy.js` in the app:

```javascript
export async function callClaude(payload) {
  const endpoint = import.meta.env.VITE_CLAUDE_PROXY_URL || '/api/claude';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}
```

Replace all `fetch('https://api.anthropic.com/v1/messages', ...)` calls with `callClaude(...)`.

### Alternative: Vercel Edge Function

```javascript
// api/claude.js  (Vercel)
export const config = { runtime: 'edge' };
export default async function handler(req) {
  const body = await req.json();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return new Response(res.body, { headers: { 'content-type': 'application/json' } });
}
```

---

## Migration Checklist (per phase)

Before merging any phase branch:

- [ ] Open `dist/sorrel.html` (or `index.html`) directly in browser
- [ ] Profile setup modal renders and saves correctly
- [ ] Food diary accepts a manual food entry
- [ ] Budget display is consistent across Home / Plan / Shopping
- [ ] File size is within the expected reduction range for the phase
- [ ] No console errors on first load

---

## File Size Targets by Phase

| Phase | Target | How |
|---|---|---|
| Current (v1.6.31) | 1.88 MB | baseline |
| Phase 1 | ~1.2 MB | extract smokes + lazy taxonomy |
| Phase 2 | ~600 KB | Vite minification + tree-shaking |
| Phase 3 | ~450 KB | dead code removal during extraction |
| Phase 4 | ~450 KB | no size change; security improvement only |
