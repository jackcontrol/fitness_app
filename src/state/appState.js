// App state persistence — the central runtime state object.
//
// Storage key: 'tracker-state' (localStorage). Other persistence tracks
// (food-diary, exercise-log, fasting-state, progress-photos, custom-foods,
// off-cache, sorrel-trial) are owned by their respective feature modules.
//
// Defaults are intentionally minimal. Properties not listed in defaultState()
// are lazy-initialized at first use via ensure() so localStorage stays compact
// for new users.

const STATE_KEY = 'tracker-state';

export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return migrateState(mergeDefaults(parsed));
  } catch (e) {
    return defaultState();
  }
}

export function saveState(state) {
  if (!state || typeof state !== 'object') return false;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('saveState failed:', e && e.message);
    return false;
  }
}

// Default minimal shape. Documented and stable — code may rely on these
// existing on a freshly-loaded state object.
export function defaultState() {
  return {
    meals: {},
    hydration: {},
    shopping: {},
    storeAssignments: {},
    checkins: [],
    streak: 0,
    lastActiveDay: 0,
    recipeRatings: {},
    recipeNotes: {},
    recipePhotos: {},
    mealHistory: [],
    weeklyAdherence: 0,
    macroTolerance: { protein: 10, carbs: 15, fat: 10, calories: 100 },
  };
}

// Ensure a state field exists with a default. Used by features for
// lazy-initialized fields (weightLog, adherenceLog, macroAdjustments, etc.)
// so the defaults are colocated with the code that uses them.
export function ensure(state, field, fallback) {
  if (state[field] === undefined || state[field] === null) {
    state[field] = typeof fallback === 'function' ? fallback() : fallback;
  }
  return state[field];
}

// Backfill any keys in defaultState() that are missing from a loaded state.
// Existing values are never overwritten.
function mergeDefaults(loaded) {
  const defaults = defaultState();
  for (const k in defaults) {
    if (loaded[k] === undefined) loaded[k] = defaults[k];
  }
  return loaded;
}

// Schema migration. Idempotent.
// Add migrations here as the schema evolves; record the version that
// introduced each migration in a comment so future-you can trace it.
function migrateState(s) {
  if (!s || typeof s !== 'object') return s;
  // Future migrations go here. Each must check whether it has already run
  // (e.g., by inspecting the shape of the data) so they remain idempotent.
  return s;
}
