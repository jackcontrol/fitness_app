// Profile persistence — single source of truth for the user profile object.
//
// Storage key: 'user-profile' (localStorage).
// Schema is open-ended: the profile object collects ~80 fields across identity,
// body metrics, diet, budget, training, wellness, goals, and pattern detection.
// New fields can be added freely; old fields are preserved on round-trip.
//
// Invariants:
//   - Never read `profile.dietType` directly. Use canonicalDietType() from
//     src/features/diet.js to honor the diet/diets/dietPreference fallback chain.
//   - Never write budget fields directly. Use setBudget() from
//     src/features/budget.js to keep weeklyBudget, weeklyGroceryBudgetTarget,
//     and budgetTarget in sync with the dedicated 'sorrelV1620BudgetTarget' key.

const PROFILE_KEY = 'user-profile';

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return migrateProfile(parsed);
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile) {
  if (!profile || typeof profile !== 'object') return false;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (e) {
    console.warn('saveProfile failed:', e && e.message);
    return false;
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// Schema migration. Idempotent — running it twice on the same object is a no-op.
function migrateProfile(p) {
  if (!p || typeof p !== 'object') return p;
  const budget = Number(p.weeklyGroceryBudgetTarget) ||
                 Number(p.budgetTarget) ||
                 Number(p.weeklyBudget) || 0;
  if (budget > 0) {
    if (!p.weeklyBudget) p.weeklyBudget = budget;
    if (!p.weeklyGroceryBudgetTarget) p.weeklyGroceryBudgetTarget = budget;
    if (!p.budgetTarget) p.budgetTarget = budget;
  }
  return p;
}
