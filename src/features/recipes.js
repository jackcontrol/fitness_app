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

// Compute per-meal macros: meal-own values take priority; otherwise
// distribute the user's daily macro targets to the slot and apply a
// deterministic variance keyed on the meal name.
export function calculateMealMacros(meal, mealType, profile) {
  if (meal && typeof meal.protein === 'number' && typeof meal.carbs === 'number' && typeof meal.fat === 'number') {
    const protein = meal.protein;
    const carbs = meal.carbs;
    const fat = meal.fat;
    const calories = typeof meal.calories === 'number' ? meal.calories : (protein * 4 + carbs * 4 + fat * 9);
    return { protein, carbs, fat, calories };
  }
  if (!profile) return { protein: 0, carbs: 0, fat: 0, calories: 0 };

  const dailyP = profile.protein || 0;
  const dailyC = profile.carbs || 0;
  const dailyF = profile.fat || 0;

  let pPct, cPct, fPct;
  switch (mealType) {
    case 'breakfast': pPct = 0.25; cPct = 0.30; fPct = 0.25; break;
    case 'lunch':     pPct = 0.35; cPct = 0.35; fPct = 0.35; break;
    case 'dinner':    pPct = 0.35; cPct = 0.30; fPct = 0.35; break;
    case 'snack':     pPct = 0.05; cPct = 0.05; fPct = 0.05; break;
    default:          pPct = 0.30; cPct = 0.30; fPct = 0.30;
  }

  const mealKey = (meal && (meal.name || meal.key)) || '';
  let hash = 0;
  for (let i = 0; i < mealKey.length; i++) {
    hash = ((hash << 5) - hash + mealKey.charCodeAt(i)) & 0xffffffff;
  }
  const h = Math.abs(hash);
  const pVar = 1 + ((h % 21) - 10) / 100;
  const cVar = 1 + (((h >> 5) % 21) - 10) / 100;
  const fVar = 1 + (((h >> 10) % 21) - 10) / 100;

  const protein = Math.round(dailyP * pPct * pVar);
  const carbs = Math.round(dailyC * cPct * cVar);
  const fat = Math.round(dailyF * fPct * fVar);
  const calories = Math.round(protein * 4 + carbs * 4 + fat * 9);
  return { protein, carbs, fat, calories };
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
