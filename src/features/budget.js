// Budget management — single source of truth for the weekly grocery budget.
// Extracted from index.html (v1.6.28 patch ~line 38626).
//
// Key invariant: always use getBudget() / setBudget(v) — never read or write individual
// budget fields directly. Three profile fields plus localStorage must stay in sync.

const BUDGET_LS_KEY = 'sorrelV1620BudgetTarget';
const PROFILE_LS_KEY = 'user-profile';
const DEFAULT_BUDGET = 100;

/**
 * Read the canonical budget from any of the four storage locations.
 * Precedence: localStorage key → profile.weeklyGroceryBudgetTarget → profile.budgetTarget → profile.weeklyBudget
 */
export function getBudget(profile) {
  var p = profile || {};
  var v = Number(localStorage.getItem(BUDGET_LS_KEY)) ||
          Number(p.weeklyGroceryBudgetTarget) ||
          Number(p.budgetTarget) ||
          Number(p.weeklyBudget) || 0;
  return v > 0 ? v : DEFAULT_BUDGET;
}

/**
 * Write the budget to all four storage locations atomically.
 * Returns false if the value is not a positive finite number.
 */
// Default-priced meal-cost estimator. Snacks honour meal.cost when set.
export function estimateMealCost(meal, mealType) {
  if (mealType === 'snack') return (meal && meal.cost) || 2.50;
  return mealType === 'breakfast' ? 4.50 : mealType === 'lunch' ? 5.50 : 6.00;
}

export function setBudget(v, profile) {
  v = Number(v);
  if (!isFinite(v) || v <= 0) return false;
  var p = profile || {};
  p.weeklyBudget = v;
  p.weeklyGroceryBudgetTarget = v;
  p.budgetTarget = v;
  try { localStorage.setItem(BUDGET_LS_KEY, String(v)); } catch (e) { /* silent */ }
  try { localStorage.setItem(PROFILE_LS_KEY, JSON.stringify(p)); } catch (e) { /* silent */ }
  return true;
}
