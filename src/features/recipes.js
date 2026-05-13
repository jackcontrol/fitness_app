// Recipe DB accessors — lifted from V165 IIFE (L34042-34068).
//
// Centralizes monolith-global recipe-database access so the lifted
// shopping/plan modules can find a meal by slot type. Falls back to
// empty objects when monolith hasn't published the globals yet.

export function ingredientFor(keyOrItem) {
  try {
    const key = typeof keyOrItem === 'string' ? keyOrItem : keyOrItem && keyOrItem.dbKey;
    if (key && typeof window.ingredientDatabase !== 'undefined' && window.ingredientDatabase[key]) {
      return window.ingredientDatabase[key];
    }
  } catch (e) {}
  return null;
}

export function recipeDbs() {
  return {
    breakfast: (typeof window.breakfastRecipes !== 'undefined' && window.breakfastRecipes) ? window.breakfastRecipes : {},
    lunch: (typeof window.lunchRecipes !== 'undefined' && window.lunchRecipes) ? window.lunchRecipes : {},
    dinner: (typeof window.recipes !== 'undefined' && window.recipes) ? window.recipes : {},
    snack: (typeof window.snackOptions !== 'undefined' && window.snackOptions) ? window.snackOptions : {},
  };
}

export function mealForSlot(slotData, slot) {
  if (!slotData) return null;
  const meal = slotData.meal || slotData.recipe || slotData.food || slotData;
  if (!meal) return null;
  if (typeof meal.getIngredients === 'function') return meal;
  const db = recipeDbs()[slot] || {};
  const key = meal.key || meal.id;
  if (key && db[key]) {
    return Object.assign({}, db[key], meal, { getIngredients: db[key].getIngredients || meal.getIngredients });
  }
  const byName = Object.entries(db).find(([, v]) => v && meal.name && v.name === meal.name);
  if (byName) {
    return Object.assign({}, byName[1], meal, { key: byName[0], getIngredients: byName[1].getIngredients || meal.getIngredients });
  }
  return meal;
}
