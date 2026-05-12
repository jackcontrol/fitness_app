// Meal plan — pure state mutations over the central appState.
// Extracted from index.html lines 15721, 15820, 15919, 16059 (and surrounds).
//
// The plan composes from state.defaultBreakfast, state.favoriteLunches,
// state.favoriteDinners, state.favoriteSnacks, state.includeSnack,
// state.mealsPerDay, state.breakfastSwaps. No own localStorage key —
// persistence flows through saveState() in src/state/appState.js.
//
// DOM rendering (populateBreakfastGrid, populateLunchGrid, etc.) lives in
// the plan UI module (slice 5). This module is DOM-free.

import { ensure } from '../state/appState.js';

export const LIMITS = {
  lunches: 3,
  dinners: 5,
  snacks: 3,
};

export function setDefaultBreakfast(state, breakfastId) {
  state.defaultBreakfast = breakfastId;
  return state.defaultBreakfast;
}

// Toggle membership in a favorites list with a cap. Returns:
//   { added: true, atLimit: false }  — newly added
//   { added: false, atLimit: false } — removed
//   { added: false, atLimit: true }  — at cap, not added
function toggleFavorite(list, id, limit) {
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
    return { added: false, atLimit: false };
  }
  if (list.length >= limit) return { added: false, atLimit: true };
  list.push(id);
  return { added: true, atLimit: false };
}

export function toggleLunch(state, lunchId) {
  const list = ensure(state, 'favoriteLunches', []);
  return toggleFavorite(list, lunchId, LIMITS.lunches);
}

export function toggleDinner(state, dinnerId) {
  const list = ensure(state, 'favoriteDinners', []);
  return toggleFavorite(list, dinnerId, LIMITS.dinners);
}

export function toggleSnack(state, snackId) {
  const list = ensure(state, 'favoriteSnacks', []);
  return toggleFavorite(list, snackId, LIMITS.snacks);
}

// Swap a single day's breakfast (day index 1-7 or YYYY-MM-DD key).
export function swapBreakfast(state, dayKey, recipeId) {
  if (!state.breakfastSwaps) state.breakfastSwaps = {};
  state.breakfastSwaps[dayKey] = recipeId;
  return state.breakfastSwaps;
}

export function setIncludeSnack(state, include) {
  state.includeSnack = !!include;
  return state.includeSnack;
}

// 2 or 3 meals per day. Other values clamp.
export function setMealsPerDay(state, n) {
  const v = Number(n);
  state.mealsPerDay = v === 3 ? 3 : 2;
  return state.mealsPerDay;
}

// Derive the meal rotation for a given day index (1-7), reading favorites
// and falling back to the default. Pure — no state mutation.
export function getMealRotation(state, dayIdx) {
  const lunchRotation = state.favoriteLunches || [];
  const dinnerRotation = state.favoriteDinners || [];
  const snackRotation = state.favoriteSnacks || [];
  const dayKey = String(dayIdx);
  const breakfastId = (state.breakfastSwaps && state.breakfastSwaps[dayKey]) || state.defaultBreakfast;
  const lunchId  = lunchRotation.length  ? lunchRotation[(dayIdx - 1)  % lunchRotation.length]  : null;
  const dinnerId = dinnerRotation.length ? dinnerRotation[(dayIdx - 1) % dinnerRotation.length] : null;
  const snackId  = snackRotation.length  ? snackRotation[(dayIdx - 1)  % snackRotation.length]  : (state.selectedEveningSnack || null);
  return { breakfastId, lunchId, dinnerId, snackId };
}
