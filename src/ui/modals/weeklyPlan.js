// Weekly plan modal — lifted from V1622 IIFE (L37301–37711).
// V1622 is the last-write-wins override of the L32031 original.
// Uses sorrel-v1622-week-modal DOM ID, normalizeDay + safeMeal repair
// bridge, inline recipe + swap sub-modals, lock/repeat/undo actions.

import { $, qa } from '../../utils/dom.js';
import { esc } from '../../utils/html.js';
import { toast } from '../helpers/toast.js';
import { appState, appProfile, saveAll as saveAllState } from '../../state/accessors.js';
import { recipeDbs } from '../../features/recipes.js';

// ── Closure helpers ───────────────────────────────────────────────────────────

function txt(el) {
  return (el && (el.textContent || el.innerText) || '').replace(/\s+/g, ' ').trim();
}
function deepClone(obj) {
  try { return JSON.parse(JSON.stringify(obj)); } catch (e) { return obj; }
}
export function currentDayIndex() {
  try {
    const s = appState();
    if (s && typeof s.selectedPlanDay === 'number' && s.selectedPlanDay >= 1 && s.selectedPlanDay <= 7)
      return s.selectedPlanDay - 1;
  } catch (e) {}
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
function getProfile() {
  const p = appProfile();
  if (p) return p;
  try {
    const raw = localStorage.getItem('user-profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function setProfile(p) {
  if (!p) return p;
  try { window.profile = p; } catch (e) {}
  return p;
}
function syncProfileMirror() {
  const p = getProfile();
  if (p) setProfile(p);
  return p;
}

function dbForType(type) {
  const dbs = recipeDbs();
  if (type === 'breakfast') return dbs.breakfast || {};
  if (type === 'lunch') return dbs.lunch || {};
  if (type === 'dinner') return dbs.dinner || {};
  if (type === 'snack' || type === 'snacks') return dbs.snack || {};
  return {};
}
function objectEntries(obj) {
  try { return Object.entries(obj || {}); } catch (e) { return []; }
}
function pickFirst(db) {
  const e = objectEntries(db)[0];
  return e ? Object.assign({ key: e[0] }, e[1]) : null;
}
function findMealByKey(type, key) {
  if (!key) return null;
  const db = dbForType(type);
  if (db && db[key]) return Object.assign({ key }, db[key]);
  for (const t of ['breakfast', 'lunch', 'dinner', 'snack']) {
    const db2 = dbForType(t);
    if (db2 && db2[key]) return Object.assign({ key }, db2[key]);
  }
  return null;
}
function validateMeal(m) {
  try {
    if (typeof window.sorrelValidateFoodForProfile === 'function')
      return window.sorrelValidateFoodForProfile(m, getProfile() || {}).ok !== false;
  } catch (e) {}
  return true;
}
function safeMeal(type, key) {
  const m = findMealByKey(type, key);
  if (m && validateMeal(m)) return m;
  const db = dbForType(type);
  for (const [k, v] of objectEntries(db)) {
    const c = Object.assign({ key: k }, v);
    if (validateMeal(c)) return c;
  }
  return m || pickFirst(db) || {
    key: type, name: type.charAt(0).toUpperCase() + type.slice(1),
    calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0,
  };
}
function macrosFor(meal, type) {
  try {
    if (typeof window.calculateMealMacros === 'function' && meal) {
      const mc = window.calculateMealMacros(meal, type);
      if (mc && typeof mc === 'object') return {
        calories: Number(mc.calories || mc.cal || 0),
        protein: Number(mc.protein || 0),
        carbs: Number(mc.carbs || 0),
        fat: Number(mc.fat || 0),
      };
    }
  } catch (e) {}
  return {
    calories: Number(meal && (meal.calories || meal.cal) || 0),
    protein: Number(meal && meal.protein || 0),
    carbs: Number(meal && meal.carbs || 0),
    fat: Number(meal && meal.fat || 0),
  };
}
function slotFromMeal(meal, type) {
  const m = meal || safeMeal(type);
  return {
    meal: m, macros: macrosFor(m, type),
    cost: Number(m && m.cost || (type === 'snack' ? 2.5 : type === 'dinner' ? 6 : type === 'lunch' ? 5.5 : 4.5)),
    locked: false,
  };
}
function slotMeal(day, type) {
  const slot = day && (day[type] || day[type + 's']);
  return slot && (slot.meal || slot) || null;
}
function dayTotalCost(day) {
  return ['breakfast', 'lunch', 'dinner', 'snack'].reduce((sum, type) => {
    const slot = day && day[type];
    return sum + Number(slot && slot.cost || slotMeal(day, type) && slotMeal(day, type).cost || 0);
  }, 0);
}
function normalizeDay(day, idx) {
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const out = Object.assign({}, day || {});
  out.day = idx + 1;
  out.dayName = out.dayName || names[idx];
  for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
    const slot = out[type] || out[type + 's'];
    let meal = slot && (slot.meal || slot);
    if (!meal || !(meal.name || meal.key)) meal = safeMeal(type);
    out[type] = Object.assign(slotFromMeal(meal, type), { locked: !!(slot && slot.locked) });
  }
  out.totalCost = dayTotalCost(out);
  out.actualMacros = ['breakfast', 'lunch', 'dinner', 'snack'].reduce((acc, type) => {
    const mc = out[type].macros || {};
    acc.calories += Number(mc.calories || 0);
    acc.protein += Number(mc.protein || 0);
    acc.carbs += Number(mc.carbs || 0);
    acc.fat += Number(mc.fat || 0);
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  return out;
}
function buildFromStateWeeklyMealPlan() {
  try {
    const s = appState();
    if (!s || !s.weeklyMealPlan) return [];
    const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names.map((n, i) => {
      const raw = s.weeklyMealPlan['day' + (i + 1)] || {};
      const day = { day: i + 1, dayName: n };
      for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
        const key = raw[type] || raw[type + 's'];
        day[type] = slotFromMeal(safeMeal(type, key), type);
      }
      return normalizeDay(day, i);
    });
  } catch (e) { return []; }
}
function buildFromRenderedToday() {
  try {
    const cards = qa('#main-weekly-plan-section .card, #plan .card')
      .filter(el => /BREAKFAST|LUNCH|DINNER|SNACK/i.test(txt(el)) && /Log it|Recipe|Swap/i.test(txt(el)));
    const byType = {};
    for (const card of cards) {
      const t = txt(card);
      const type = /BREAKFAST/i.test(t) ? 'breakfast' : /LUNCH/i.test(t) ? 'lunch'
        : /DINNER/i.test(t) ? 'dinner' : /SNACK/i.test(t) ? 'snack' : null;
      if (!type || byType[type]) continue;
      const label = t.replace(/^(BREAKFAST|LUNCH|DINNER|SNACK)\s*/i, '').split(/\s+\d+\s*cal|\s+Log it|\s+Recipe|\s+Swap/i)[0].trim();
      const db = dbForType(type);
      let found = null;
      for (const [k, v] of objectEntries(db)) {
        const m = Object.assign({ key: k }, v);
        if ((m.name || '').toLowerCase() === label.toLowerCase()) { found = m; break; }
      }
      byType[type] = found || {
        key: label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        name: label || type, calories: 0, protein: 0, carbs: 0, fat: 0,
        cost: type === 'snack' ? 2.5 : type === 'dinner' ? 6 : type === 'lunch' ? 5.5 : 4.5,
      };
    }
    if (!byType.breakfast && !byType.lunch && !byType.dinner && !byType.snack) return [];
    const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names.map((n, i) => {
      const day = { day: i + 1, dayName: n };
      for (const type of ['breakfast', 'lunch', 'dinner', 'snack'])
        day[type] = slotFromMeal(byType[type] || safeMeal(type), type);
      return normalizeDay(day, i);
    });
  } catch (e) { return []; }
}
function buildFallbackPlan() {
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const pools = {};
  for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
    pools[type] = objectEntries(dbForType(type))
      .map(([k, v]) => Object.assign({ key: k }, v))
      .filter(validateMeal);
  }
  return names.map((n, i) => {
    const day = { day: i + 1, dayName: n };
    for (const type of ['breakfast', 'lunch', 'dinner', 'snack']) {
      const pool = pools[type] && pools[type].length ? pools[type] : [safeMeal(type)];
      day[type] = slotFromMeal(pool[i % pool.length], type);
    }
    return normalizeDay(day, i);
  });
}
function tryGenerateOptimal(p) {
  try {
    if (typeof window.generateOptimalWeek !== 'function' || !p) return [];
    const input = Object.assign({
      targetCalories: p.targetCalories || 2000, protein: p.protein || 150,
      carbs: p.carbs || 200, fat: p.fat || 65,
      cuisinePreferences: p.cuisinePreferences || ['american', 'italian', 'asian', 'mexican'],
      dietType: p.dietType || 'omnivore', allergens: p.allergens || p.allergies || [],
      weeklyBudget: p.weeklyBudgetTarget || p.weeklyBudget || 150,
    }, p);
    const generated = window.generateOptimalWeek(input);
    const plan = Array.isArray(generated) ? generated : generated && generated.weekPlan;
    return Array.isArray(plan) ? plan.map(normalizeDay) : [];
  } catch (e) { console.warn('[Sorrel v1.6.22] generateOptimalWeek bridge failed:', e); return []; }
}
function isUsablePlan(plan) {
  return Array.isArray(plan) && plan.length >= 7 &&
    plan.some(day => ['breakfast', 'lunch', 'dinner', 'snack']
      .some(type => { const m = slotMeal(day, type); return m && (m.name || m.key); }));
}
function mealLabel(type) {
  return type === 'snack' ? 'Snack' : type.charAt(0).toUpperCase() + type.slice(1);
}
function getMealMacros(m) {
  const mm = m && (m.macros || m);
  return [
    Number(mm && (mm.calories || mm.cal) || 0),
    Number(mm && mm.protein || 0),
    Number(mm && mm.carbs || 0),
    Number(mm && mm.fat || 0),
  ];
}
function mealPool(type) {
  const db = dbForType(type);
  let pool = objectEntries(db).map(([k, v]) => Object.assign({ key: k }, v)).filter(validateMeal);
  if (pool.length < 3) {
    for (const t of ['breakfast', 'lunch', 'dinner', 'snack'])
      for (const [k, v] of objectEntries(dbForType(t))) {
        const m = Object.assign({ key: k }, v);
        if (validateMeal(m)) pool.push(m);
      }
  }
  const seen = {};
  return pool.filter(m => {
    const k = (m.name || m.key || '').toLowerCase();
    if (!k || seen[k]) return false;
    seen[k] = 1; return true;
  }).slice(0, 16);
}
function saveAll() {
  try { saveAllState(); } catch (e) {}
  try { if (typeof window.saveProfile === 'function') window.saveProfile(); } catch (e) {}
  try { if (typeof window.saveState === 'function') window.saveState(); } catch (e) {}
}

// ── Public: plan repair bridge ────────────────────────────────────────────────

export function ensureWeekPlan(reason) {
  const p = syncProfileMirror() || {};
  let plan = p.weekPlan;
  if (isUsablePlan(plan)) {
    p.weekPlan = plan.slice(0, 7).map(normalizeDay);
    setProfile(p); saveAll();
    return p.weekPlan;
  }
  const candidates = [
    tryGenerateOptimal(p),
    buildFromStateWeeklyMealPlan(),
    buildFromRenderedToday(),
    buildFallbackPlan(),
  ];
  for (const c of candidates) {
    if (isUsablePlan(c)) {
      p.weekPlan = c.slice(0, 7).map(normalizeDay);
      if (!p.weeklyBudget && !p.weeklyBudgetTarget)
        p.weeklyBudget = p.weekPlan.reduce((s, d) => s + dayTotalCost(d), 0);
      setProfile(p); saveAll();
      try { if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner(); } catch (e) {}
      try { if (typeof window.renderShopping === 'function') window.renderShopping(); } catch (e) {}
      console.log('[Sorrel v1.6.22] weekly plan repaired via bridge:', reason || 'unknown');
      return p.weekPlan;
    }
  }
  setProfile(p); saveAll();
  return [];
}
function weekPlan() { return ensureWeekPlan('weekPlan read') || []; }

// ── Main modal ────────────────────────────────────────────────────────────────

export function openWeeklyPlanModal(targetDay) {
  const plan = weekPlan();
  if (!plan.length) { toast('Weekly plan could not be repaired. Open Settings → Quick Setup to rebuild your plan.'); return false; }
  const idx = Math.max(0, Math.min(plan.length - 1, Number(targetDay || currentDayIndex() + 1) - 1));
  const day = plan[idx] || {};
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const old = $('sorrel-v1620-week-modal') || $('sorrel-v1622-week-modal') || $('weeklyPlanModal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.id = 'sorrel-v1622-week-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10090;display:flex;align-items:center;justify-content:center;padding:14px;';
  const nav = names.map((n, i) =>
    `<button type="button" style="min-height:42px;border-radius:12px;border:1px solid var(--border-subtle);background:${i === idx ? 'var(--accent-primary)' : 'var(--bg-elevated)'};color:${i === idx ? 'white' : 'var(--text-primary)'};font-weight:800;" onclick="openWeeklyPlanModal(${i + 1})">${n.slice(0, 3)}</button>`
  ).join('');
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
    const m = slotMeal(day, type) || safeMeal(type);
    const mac = getMealMacros(day[type] && day[type].macros ? day[type].macros : m);
    const locked = !!(day[type] && day[type].locked);
    return `<div style="border:1px solid var(--border-subtle);border-radius:12px;padding:12px;background:var(--bg-elevated);display:grid;gap:8px;">` +
      `<div style="display:flex;justify-content:space-between;gap:10px;align-items:start;"><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);font-weight:800;">${mealLabel(type)}</div><div style="font-weight:800;color:var(--text-primary);">${esc(m.name || m.key || 'Meal')}</div><div style="font-size:12px;color:var(--text-secondary);">${mac[0]} cal · ${mac[1]}p · ${mac[2]}c · ${mac[3]}f</div></div><button type="button" aria-label="Lock" onclick="sorrelV1622ToggleLock(${idx},'${type}')" style="min-width:44px;min-height:44px;border-radius:10px;border:1px solid var(--border-subtle);background:var(--bg-card);">${locked ? '🔒' : '🔓'}</button></div>` +
      `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;"><button type="button" class="btn-secondary" onclick="sorrelV1622OpenRecipe(${idx},'${type}')">Recipe</button><button type="button" class="btn-secondary" onclick="sorrelV1622OpenSwap(${idx},'${type}')">Swap</button><button type="button" class="btn-secondary" onclick="sorrelV1622RepeatMeal(${idx},'${type}')">Repeat</button></div>` +
      `</div>`;
  }).join('');
  modal.innerHTML = `<div style="background:var(--bg-card);border-radius:18px;border:1px solid var(--border-subtle);width:100%;max-width:620px;max-height:90vh;overflow:auto;box-shadow:var(--shadow-elevated);">` +
    `<div style="position:sticky;top:0;background:var(--bg-card);padding:14px 16px;border-bottom:1px solid var(--border-subtle);z-index:2;"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;"><div><div style="font-size:11px;text-transform:uppercase;color:var(--text-tertiary);font-weight:800;">Weekly plan</div><h2 style="margin:2px 0;color:var(--text-primary);">Review ${esc(names[idx])}</h2></div><button type="button" onclick="this.closest('#sorrel-v1622-week-modal').remove()" style="width:44px;height:44px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-elevated);font-size:20px;">×</button></div>` +
    `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:12px;">${nav}</div></div>` +
    `<div style="padding:14px 16px;display:grid;gap:10px;">${meals}<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;"><button type="button" onclick="sorrelV1622ValidateWeek()" class="btn-secondary">Validate week</button><button type="button" onclick="sorrelV1622ClearLocks()" class="btn-secondary">Clear locks</button><button type="button" onclick="sorrelV1622UndoRepeat()" class="btn-secondary">Undo repeat</button></div></div></div>`;
  document.body.appendChild(modal);
  return false;
}

export function closeWeeklyPlanModal() {
  const m = $('sorrel-v1622-week-modal') || $('weeklyPlanModal');
  if (m) m.remove();
}

// ── Sub-modals ────────────────────────────────────────────────────────────────

export function openRecipeModal(dayIdx, type) {
  const plan = weekPlan();
  const slot = plan[dayIdx] && plan[dayIdx][type];
  const m = slotMeal(plan[dayIdx], type) || safeMeal(type);
  const mac = getMealMacros(slot && slot.macros ? slot.macros : m);
  const old = $('sorrel-v1622-recipe-modal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.id = 'sorrel-v1622-recipe-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10100;display:flex;align-items:center;justify-content:center;padding:14px;';
  const ingredients = Array.isArray(m.ingredients)
    ? m.ingredients.map(x => `<li>${esc(typeof x === 'string' ? x : JSON.stringify(x))}</li>`).join('')
    : '<li>Use your saved plan portions.</li>';
  const timing = type === 'breakfast' ? 'Recommended: 8:00–9:30 AM' : type === 'lunch' ? 'Recommended: 12:00–1:30 PM'
    : type === 'dinner' ? 'Recommended: 6:30–8:00 PM' : 'Recommended: around 8:30 PM';
  modal.innerHTML = `<div style="background:var(--bg-card);border-radius:18px;border:1px solid var(--border-subtle);width:100%;max-width:540px;max-height:86vh;overflow:auto;padding:18px;box-shadow:var(--shadow-elevated);"><div style="display:flex;justify-content:space-between;align-items:start;gap:12px;"><div><div style="font-size:11px;text-transform:uppercase;color:var(--text-tertiary);font-weight:800;">${mealLabel(type)}</div><h2 style="margin:2px 0;color:var(--text-primary);">${esc(m.name || m.key || 'Recipe')}</h2><div style="color:var(--text-secondary);font-size:13px;">${mac[0]} cal · ${mac[1]}p · ${mac[2]}c · ${mac[3]}f</div></div><button type="button" onclick="this.closest('#sorrel-v1622-recipe-modal').remove()" style="width:44px;height:44px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-elevated);font-size:20px;">×</button></div><h4>Ingredients</h4><ul>${ingredients}</ul><h4>Instructions</h4><p style="line-height:1.5;color:var(--text-secondary);">${esc(m.instructions || m.method || 'Prepare according to your saved plan. Keep seasoning flexible and preserve the protein target.')}</p><div style="background:#d7f3e7;border:1px solid #0a7d5a;border-radius:12px;padding:12px;margin:14px 0;"><strong>Suggested meal timing</strong><br>${timing}</div><button type="button" onclick="sorrelV1622OpenSwap(${dayIdx},'${type}')" class="btn-secondary" style="width:100%;min-height:46px;">Swap meal</button></div>`;
  document.body.appendChild(modal);
}

export function openSwapModal(dayIdx, type) {
  const plan = weekPlan();
  const day = plan[dayIdx];
  const current = slotMeal(day, type) || safeMeal(type);
  const options = mealPool(type)
    .filter(m => (m.name || m.key) !== (current.name || current.key))
    .slice(0, 10);
  const old = $('sorrel-v1622-swap-modal');
  if (old) old.remove();
  const modal = document.createElement('div');
  modal.id = 'sorrel-v1622-swap-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10110;display:flex;align-items:center;justify-content:center;padding:14px;';
  const rows = options.length
    ? options.map((m, i) => {
        const mac = macrosFor(m, type);
        return `<button type="button" onclick="sorrelV1622ChooseSwap(${dayIdx},'${type}',${i})" style="text-align:left;border:1px solid var(--border-subtle);background:var(--bg-elevated);border-radius:12px;padding:12px;min-height:54px;"><strong>${esc(m.name || m.key)}</strong><br><span style="font-size:12px;color:var(--text-secondary);">${mac.calories} cal · ${mac.protein}p · ${mac.carbs}c · ${mac.fat}f</span></button>`;
      }).join('')
    : '<div style="padding:16px;background:var(--bg-elevated);border-radius:12px;">No safe alternatives found for this profile.</div>';
  window.__sorrelV1622SwapOptions = options;
  modal.innerHTML = `<div style="background:var(--bg-card);border-radius:18px;border:1px solid var(--border-subtle);width:100%;max-width:540px;max-height:86vh;overflow:auto;padding:18px;box-shadow:var(--shadow-elevated);"><div style="display:flex;justify-content:space-between;align-items:start;gap:12px;"><div><div style="font-size:11px;text-transform:uppercase;color:var(--text-tertiary);font-weight:800;">Swap ${mealLabel(type)}</div><h2 style="margin:2px 0;color:var(--text-primary);">Choose replacement</h2></div><button type="button" onclick="this.closest('#sorrel-v1622-swap-modal').remove()" style="width:44px;height:44px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-elevated);font-size:20px;">×</button></div><div style="margin:12px 0;padding:12px;border:1px solid var(--border-subtle);border-radius:12px;background:var(--bg-elevated);"><div style="font-size:10px;text-transform:uppercase;color:var(--text-tertiary);font-weight:800;">Current</div><strong>${esc(current.name || current.key || 'Current meal')}</strong></div><div style="display:grid;gap:8px;">${rows}</div><button type="button" onclick="this.closest('#sorrel-v1622-swap-modal').remove()" class="btn-secondary" style="width:100%;margin-top:12px;min-height:46px;">Cancel</button></div>`;
  document.body.appendChild(modal);
}

// ── Actions ───────────────────────────────────────────────────────────────────

export function chooseSwap(dayIdx, type, optIdx) {
  const plan = weekPlan();
  const opt = (window.__sorrelV1622SwapOptions || [])[optIdx];
  if (!plan[dayIdx] || !opt) return;
  plan[dayIdx][type] = slotFromMeal(opt, type);
  setProfile(Object.assign(getProfile() || {}, { weekPlan: plan }));
  saveAll();
  const sm = $('sorrel-v1622-swap-modal'); if (sm) sm.remove();
  const rm = $('sorrel-v1622-recipe-modal'); if (rm) rm.remove();
  openWeeklyPlanModal(dayIdx + 1);
  try { if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner(); } catch (e) {}
  try { if (typeof window.renderShopping === 'function') window.renderShopping(); } catch (e) {}
  toast('Meal swapped.');
}
export function toggleLock(dayIdx, type) {
  const plan = weekPlan();
  if (!plan[dayIdx] || !plan[dayIdx][type]) return;
  plan[dayIdx][type].locked = !plan[dayIdx][type].locked;
  setProfile(Object.assign(getProfile() || {}, { weekPlan: plan }));
  saveAll(); openWeeklyPlanModal(dayIdx + 1);
}
export function clearLocks() {
  const plan = weekPlan();
  for (const d of plan)
    for (const t of ['breakfast', 'lunch', 'dinner', 'snack'])
      if (d[t]) d[t].locked = false;
  setProfile(Object.assign(getProfile() || {}, { weekPlan: plan }));
  saveAll(); openWeeklyPlanModal(currentDayIndex() + 1); toast('Locks cleared.');
}
export function repeatMeal(dayIdx, type) {
  const plan = weekPlan();
  const meal = slotMeal(plan[dayIdx], type);
  if (!meal) return;
  window.__sorrelV1622RepeatUndo = deepClone(plan);
  for (let i = dayIdx + 1; i < plan.length; i++)
    if (plan[i] && plan[i][type] && !plan[i][type].locked)
      plan[i][type] = slotFromMeal(deepClone(meal), type);
  setProfile(Object.assign(getProfile() || {}, { weekPlan: plan }));
  saveAll(); openWeeklyPlanModal(dayIdx + 1); toast('Repeated later unlocked meals.');
}
export function undoRepeat() {
  if (window.__sorrelV1622RepeatUndo) {
    setProfile(Object.assign(getProfile() || {}, { weekPlan: window.__sorrelV1622RepeatUndo }));
    saveAll(); openWeeklyPlanModal(currentDayIndex() + 1); toast('Repeat undone.');
  } else toast('No repeat to undo.');
}
export function validateWeek() {
  const plan = weekPlan();
  const bad = [];
  plan.forEach((d, di) => {
    for (const t of ['breakfast', 'lunch', 'dinner', 'snack'])
      if (!validateMeal(slotMeal(d, t))) bad.push((d.dayName || ('Day ' + (di + 1))) + ' ' + t);
  });
  toast(bad.length ? ('Check these meals: ' + bad.slice(0, 3).join(', ')) : 'Week is profile-safe.');
  return !bad.length;
}
export function openWeek(evt) {
  if (evt) { evt.preventDefault(); evt.stopPropagation(); if (evt.stopImmediatePropagation) evt.stopImmediatePropagation(); }
  syncProfileMirror();
  ensureWeekPlan('button tap');
  return openWeeklyPlanModal(currentDayIndex() + 1);
}

// ── Week-button repair ────────────────────────────────────────────────────────

function repairWeekButtons() {
  for (const id of ['sorrel-v1620-adjust-week', 'sorrel-v1620-view-week', 'sorrel-v1619-adjust-week', 'sorrel-v1619-view-week']) {
    const b = $(id);
    if (b) { b.removeAttribute('onclick'); b.onclick = openWeek; b.dataset.sorrelV1622Fixed = 'true'; b.setAttribute('type', 'button'); }
  }
  for (const btn of qa('button')) {
    const label = txt(btn);
    if (/^(Adjust week|View week)$/i.test(label) && btn.closest && btn.closest('#plan') &&
        !btn.closest('#sorrel-v1622-week-modal,#sorrel-v1620-week-modal')) {
      btn.removeAttribute('onclick'); btn.onclick = openWeek; btn.dataset.sorrelV1622Fixed = 'true'; btn.setAttribute('type', 'button');
    }
  }
}

export function mount() {
  document.addEventListener('click', evt => {
    const btn = evt.target && evt.target.closest && evt.target.closest('button');
    if (!btn) return;
    const label = txt(btn); const id = btn.id || '';
    if ((/sorrel-v1620-(adjust|view)-week|sorrel-v1619-(adjust|view)-week/.test(id) ||
         /^(Adjust week|View week)$/i.test(label)) &&
        btn.closest && btn.closest('#plan') &&
        !btn.closest('#sorrel-v1622-week-modal,#sorrel-v1620-week-modal')) {
      openWeek(evt);
    }
  }, true);
  repairWeekButtons();
  setTimeout(repairWeekButtons, 50);
  setTimeout(repairWeekButtons, 300);
}
