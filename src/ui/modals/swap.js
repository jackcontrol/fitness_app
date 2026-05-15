// Swap modals — 4 near-identical shells for recipe / breakfast / lunch /
// snack swap. Lifted from index.html L2334-2377 (HTML) + L25900-26200
// (show/close functions).
//
// The show* functions in monolith both toggle display AND populate the
// inner list. For 7B we lift the shells + close functions only — list
// population stays in monolith (couples to recipes / recipeIngredients /
// getFilteredRecipes / swapToRecipe + variants). Slice 8 will pull that
// logic in or replace it via the lifted plan/shopping UI modules.

import { ensureMounted, closeById } from './helpers.js';

function swapTemplate(id, listId, title, subtitle, closeFn) {
  return `
<div class="modal" id="${id}">
<div class="modal-content" style="max-width: 600px; position: relative;">
<button aria-label="Close" onclick="${closeFn}()" style="position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; border: none; background: var(--bg-elevated); color: var(--text-secondary); border-radius: 50%; cursor: pointer; font-size: 20px; line-height: 1; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10;">×</button>
<h2>${title}</h2>
<p style="color: #5a6573; margin-bottom: 20px;">${subtitle}</p>
<div id="${listId}" style="max-height: 400px; overflow-y: auto;"></div>
<div class="btn-group" style="margin-top: 20px;">
<button class="btn" onclick="${closeFn}()" style="background: var(--text-tertiary);">Cancel</button>
</div>
</div>
</div>
`;
}

const MODALS = [
  {
    id: 'recipeSwapModal',
    listId: 'recipe-swap-list',
    title: "Change Today's Dinner",
    subtitle: 'Select a new recipe for today. Your macros will stay the same, ingredients will update.',
    closeFn: 'closeRecipeSwapModal',
  },
  {
    id: 'breakfastSwapModal',
    listId: 'breakfast-swap-list',
    title: 'Change Breakfast',
    subtitle: 'Select a different breakfast option. Your macros will stay the same.',
    closeFn: 'closeBreakfastSwapModal',
  },
  {
    id: 'snackSwapModal',
    listId: 'snack-swap-list',
    title: 'Change Evening Snack',
    subtitle: 'Select a different snack option that fits your macros.',
    closeFn: 'closeSnackSwapModal',
  },
  {
    id: 'lunchSwapModal',
    listId: 'lunch-swap-list',
    title: "Change Today's Lunch",
    subtitle: 'Select a different lunch for today. Macros stay the same.',
    closeFn: 'closeLunchSwapModal',
  },
];

export function mount() {
  MODALS.forEach(m => ensureMounted(m.id, swapTemplate(m.id, m.listId, m.title, m.subtitle, m.closeFn)));
}

export const closeRecipeSwapModal = () => closeById('recipeSwapModal');
export const closeBreakfastSwapModal = () => closeById('breakfastSwapModal');
export const closeSnackSwapModal = () => closeById('snackSwapModal');
export const closeLunchSwapModal = () => closeById('lunchSwapModal');

// Day-level swapModal — lifted from index.html L32443-32515.
//
// Distinct from the recipe/breakfast/lunch/snack shells above. Dynamic
// factory: built fresh per swap action with the current meal + filtered
// alternatives. Inline onclick handlers reference `confirmSwap` and
// `closeSwapModal` (both still in monolith).
export function showSwapModal(day, mealType, alternatives) {
  const currentMeal = day[mealType];
  const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const modalHTML = `
    <div id="swapModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: var(--bg-card); border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-elevated);">
        <div style="display: flex; align-items: center; gap: 10px; margin: 0 0 18px 0;">
          <div style="width: 18px; height: 3px; background: var(--accent-primary); border-radius: 2px; position: relative;">
            <div style="position: absolute; right: -3px; top: -2px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent-primary);"></div>
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em;">Swap ${mealLabel}</h3>
        </div>

        <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 10px; margin-bottom: 18px;">
          <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 4px;">Current</div>
          <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${currentMeal.meal.name || currentMeal.meal.key}</div>
          <div style="color: var(--text-secondary); font-size: 13px; margin-top: 4px; font-variant-numeric: tabular-nums;">
            ${currentMeal.macros.protein}p · ${currentMeal.macros.carbs}c · ${currentMeal.macros.fat}f · $${currentMeal.cost.toFixed(2)}
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 10px;">Choose alternative</div>
        <div id="alternativesList">
          ${alternatives.map((meal) => `
            <div class="alternative-meal" onclick="confirmSwap('${meal.key}')" style="padding: 14px; margin-bottom: 8px; background: var(--bg-card); border-radius: 10px; cursor: pointer; border: 1px solid var(--border-subtle); transition: border-color 0.15s ease, background-color 0.15s ease;">
              <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${meal.name || meal.key}</div>
              ${meal.description ? `
                <div style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                  ${meal.emoji || ''} ${meal.description}
                </div>
              ` : ''}
              ${meal.protein !== undefined ? `
                <div style="color: var(--text-secondary); font-size: 13px; margin-top: 6px; font-variant-numeric: tabular-nums;">
                  ${meal.protein}p · ${meal.carbs}c · ${meal.fat}f${meal.cost ? ` · $${meal.cost.toFixed(2)}` : ''}
                </div>
              ` : `
                <div style="color: var(--text-tertiary); font-size: 12px; margin-top: 6px;">
                  Portions adjusted to your macro targets
                </div>
              `}
            </div>
          `).join('')}
        </div>

        <button onclick="closeSwapModal()" style="margin-top: 16px; padding: 12px 24px; background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-subtle); border-radius: 10px; cursor: pointer; width: 100%; font-weight: 600; font-size: 14px;">
          Cancel
        </button>
      </div>
    </div>
  `;

  const existingModal = document.getElementById('swapModal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  setTimeout(() => {
    document.querySelectorAll('.alternative-meal').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        el.style.borderColor = 'var(--accent-primary)';
        el.style.background = 'var(--accent-soft)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.borderColor = 'var(--border-subtle)';
        el.style.background = 'var(--bg-card)';
      });
    });
  }, 100);
}

export function closeSwapModal() {
  const el = document.getElementById('swapModal');
  if (el) el.remove();
  currentSwapContext = null;
}

// ─── Session 18: swapMeal + getAlternativeMeals + confirmSwap ─────
// Lifted from monolith. Module-private currentSwapContext (was a
// monolith `let` reassigned across two fns; now lives here so the
// trio can share state without bridging through window).

let currentSwapContext = null;

export function swapMeal(dayNumber, mealType, source) {
  const profile = window.profile;
  if (!profile || !profile.weekPlan) {
    if (typeof window.showLogToast === 'function') window.showLogToast('No meal plan available');
    else alert('No meal plan available');
    return;
  }
  const day = profile.weekPlan.find(d => d.day == dayNumber) || profile.weekPlan[dayNumber - 1];
  if (!day || !day[mealType]) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Day not found');
    else alert('Day not found');
    return;
  }
  const alternatives = getAlternativeMeals(mealType, profile.cuisinePreferences || []);
  const current = (day[mealType] && day[mealType].meal) ? day[mealType].meal : {};
  const currentKey = current.key || current.id || '';
  const currentName = current.name || '';
  const usable = alternatives.filter(m => m && (m.key !== currentKey) && ((m.name || '') !== currentName));
  if (!usable.length) {
    if (typeof window.showLogToast === 'function') window.showLogToast('No swap options available');
    return;
  }
  currentSwapContext = {
    dayNumber, mealType, day,
    source: source || (document.getElementById('weeklyPlanModal') ? 'weekly' : 'home'),
  };
  showSwapModal(day, mealType, usable);
}

export function getAlternativeMeals(mealType, cuisinePreferences) {
  const breakfastRecipes = window.breakfastRecipes || {};
  const lunchRecipes = window.lunchRecipes || {};
  const recipes = window.recipes || {};
  const snackOptions = window.snackOptions || {};

  let meals = [];
  if (mealType === 'breakfast') {
    meals = Object.entries(breakfastRecipes).map(([key, meal]) => ({ key, ...meal, type: 'breakfast' }));
  } else if (mealType === 'lunch') {
    meals = Object.entries(lunchRecipes).map(([key, meal]) => ({ key, ...meal, type: 'lunch' }));
  } else if (mealType === 'dinner') {
    meals = Object.entries(recipes)
      .filter(([, meal]) => cuisinePreferences.includes(meal.cuisine))
      .map(([key, meal]) => ({ key, ...meal, type: 'dinner' }));
  } else if (mealType === 'snack') {
    meals = Object.entries(snackOptions).map(([key, meal]) => ({ key, ...meal, type: 'snack' }));
  }
  return meals.slice(0, 10);
}

export function confirmSwap(newMealKey) {
  if (!currentSwapContext) return;

  const breakfastRecipes = window.breakfastRecipes || {};
  const lunchRecipes = window.lunchRecipes || {};
  const recipes = window.recipes || {};
  const snackOptions = window.snackOptions || {};

  const { dayNumber, mealType, day } = currentSwapContext;

  let newMeal;
  if (mealType === 'breakfast') newMeal = breakfastRecipes[newMealKey];
  else if (mealType === 'lunch') newMeal = lunchRecipes[newMealKey];
  else if (mealType === 'dinner') newMeal = recipes[newMealKey];
  else if (mealType === 'snack') newMeal = snackOptions[newMealKey];

  if (!newMeal) {
    alert('Meal not found');
    return;
  }

  day[mealType].meal = { key: newMealKey, ...newMeal };

  if (mealType === 'snack') {
    day[mealType].macros = {
      protein: newMeal.protein,
      carbs: newMeal.carbs,
      fat: newMeal.fat,
      calories: (newMeal.protein * 4) + (newMeal.carbs * 4) + (newMeal.fat * 9),
    };
    day[mealType].cost = newMeal.cost;
  } else {
    const calculateMealMacros = window.calculateMealMacros;
    const estimateMealCost = window.estimateMealCost;
    const newMealMacros = (typeof calculateMealMacros === 'function') ? calculateMealMacros(newMeal, mealType) : day[mealType].macros;
    day[mealType].macros = newMealMacros;
    day[mealType].cost = (typeof estimateMealCost === 'function') ? estimateMealCost(newMeal, mealType) : day[mealType].cost;
  }

  day.actualMacros = {
    protein: day.breakfast.macros.protein + day.lunch.macros.protein + day.dinner.macros.protein + (day.snack.macros.protein || 0),
    carbs: day.breakfast.macros.carbs + day.lunch.macros.carbs + day.dinner.macros.carbs + (day.snack.macros.carbs || 0),
    fat: day.breakfast.macros.fat + day.lunch.macros.fat + day.dinner.macros.fat + (day.snack.macros.fat || 0),
    calories: day.breakfast.macros.calories + day.lunch.macros.calories + day.dinner.macros.calories + (day.snack.macros.calories || 0),
  };
  day.totalCost = day.breakfast.cost + day.lunch.cost + day.dinner.cost + day.snack.cost;

  const state = window.state;
  if (state) state.dynamicShoppingList = null;
  if (typeof window.saveState === 'function') window.saveState();

  localStorage.setItem('user-profile', JSON.stringify(window.profile));

  const source = (currentSwapContext && currentSwapContext.source) || 'weekly';
  closeSwapModal();

  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();

  if (source === 'weekly') {
    if (typeof window.closeWeeklyPlanModal === 'function') window.closeWeeklyPlanModal();
    setTimeout(() => {
      if (typeof window.openWeeklyPlanModal === 'function') window.openWeeklyPlanModal(dayNumber);
    }, 100);
  } else if (typeof window.showLogToast === 'function') {
    const newName = (newMeal && newMeal.name) || 'meal';
    window.showLogToast('Swapped to ' + newName);
  }
}
