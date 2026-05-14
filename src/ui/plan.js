// Plan tab — main planner render + grids + budget optimizer.
// Lifted from index.html L10233-10791 + L15660-16094 + L16101-16475.
//
// State via window.Sorrel.{loadState,saveState,getProfile,saveProfile,plan,progress}.
// Recipe data imported from src/data/*.
// Cross-tab/modal helpers stay in monolith and are called via window.*:
//   ensureAdaptiveState, getAdherenceScore, getEffectiveMacrosForToday,
//   getTodaysIntensityRecommendation, getLoggingStreak, swapMeal,
//   openRecipeFromHome, logPlannedMeal, unlogPlannedMeal,
//   openBudgetEditModal, openRecoveryModal, renderPlanNextSteps,
//   showLogToast.

import { todayISO, daysBetween } from '../utils/dates.js';
import { breakfastRecipes as breakfastOptions } from '../data/breakfasts.js';
import { lunchRecipes } from '../data/lunches.js';
import { dinnerRecipes as recipes } from '../data/dinners.js';
import { snackOptions as eveningOptions } from '../data/snacks.js';
import { recipeIngredients } from '../data/ingredients.js';
import { $ as domGet, qa as domQa } from '../utils/dom.js';
import { esc } from '../utils/html.js';
import { nextMeal, nextRoutineAction, nextLogAction, usefulLogsLeft } from '../features/coaching.js';

function S() {
  return window.Sorrel.loadState();
}
function P() {
  return window.Sorrel.getProfile();
}
function save() {
  window.Sorrel.saveState();
}

export function calculateMealRotation() {
  const state = S();
  if (!state.favoriteLunches || !state.favoriteLunches.length || !state.favoriteDinners || !state.favoriteDinners.length) return;

  const lunchRotation = state.favoriteLunches;
  const dinnerRotation = state.favoriteDinners;
  const snackRotation = state.favoriteSnacks || [];

  if (!state.weeklyMealPlan) state.weeklyMealPlan = {};
  if (!state.breakfastSwaps) state.breakfastSwaps = {};

  for (let day = 1; day <= 7; day++) {
    const dayKey = `day${day}`;
    const breakfastId = state.breakfastSwaps[dayKey] || state.defaultBreakfast;
    const lunchId = lunchRotation[(day - 1) % lunchRotation.length];
    const dinnerId = dinnerRotation[(day - 1) % dinnerRotation.length];
    const snackId = snackRotation.length > 0
      ? snackRotation[(day - 1) % snackRotation.length]
      : state.selectedEveningSnack;

    state.weeklyMealPlan[dayKey] = {
      breakfast: breakfastId,
      lunch: state.mealsPerDay >= 2 ? lunchId : null,
      dinner: dinnerId,
      snack: state.includeSnack ? snackId : null
    };
  }
}

export function calculateBreakfastMacros() {
  const profile = P();
  const state = S();
  if (!profile) return { protein: 0, carbs: 0, fat: 0, calories: 0 };

  const breakfastId = state.defaultBreakfast;
  const breakfast = breakfastOptions[breakfastId];
  if (!breakfast) return { protein: 0, carbs: 0, fat: 0, calories: 0 };

  const breakfastProtein = Math.round(profile.protein * 0.3);
  const breakfastCarbs = Math.round(profile.carbs * 0.3);
  const breakfastFat = Math.round(profile.fat * 0.3);
  const breakfastCalories = (breakfastProtein * 4) + (breakfastCarbs * 4) + (breakfastFat * 9);

  state.breakfastMacros = {
    protein: breakfastProtein,
    carbs: breakfastCarbs,
    fat: breakfastFat,
    calories: breakfastCalories
  };
  return state.breakfastMacros;
}

export function distributeRemainingMacros() {
  const profile = P();
  const state = S();
  if (!profile) return;

  calculateBreakfastMacros();

  const remainingProtein = profile.protein - state.breakfastMacros.protein;
  const remainingCarbs = profile.carbs - state.breakfastMacros.carbs;
  const remainingFat = profile.fat - state.breakfastMacros.fat;
  const remainingCalories = (profile.targetCalories || profile.calories || 0) - state.breakfastMacros.calories;

  let snackProtein = 0, snackCarbs = 0, snackFat = 0, snackCalories = 0;
  if (state.includeSnack && state.selectedEveningSnack) {
    const snack = eveningOptions[state.selectedEveningSnack];
    if (snack) {
      snackProtein = snack.protein || 0;
      snackCarbs = snack.carbs || 0;
      snackFat = snack.fat || 0;
      snackCalories = (snackProtein * 4) + (snackCarbs * 4) + (snackFat * 9);
    }
  }

  state.remainingMacros = {
    protein: remainingProtein - snackProtein,
    carbs: remainingCarbs - snackCarbs,
    fat: remainingFat - snackFat,
    calories: remainingCalories - snackCalories
  };

  if (state.mealsPerDay === 3) {
    state.lunchMacros = {
      protein: Math.round(state.remainingMacros.protein * 0.5),
      carbs: Math.round(state.remainingMacros.carbs * 0.5),
      fat: Math.round(state.remainingMacros.fat * 0.5),
      calories: Math.round(state.remainingMacros.calories * 0.5)
    };
    state.dinnerMacros = {
      protein: state.remainingMacros.protein - state.lunchMacros.protein,
      carbs: state.remainingMacros.carbs - state.lunchMacros.carbs,
      fat: state.remainingMacros.fat - state.lunchMacros.fat,
      calories: state.remainingMacros.calories - state.lunchMacros.calories
    };
  } else if (state.mealsPerDay === 2) {
    state.lunchMacros = { protein: 0, carbs: 0, fat: 0, calories: 0 };
    state.dinnerMacros = state.remainingMacros;
  }
}

export function getRecipeCost(recipeId, recipeType = 'dinner') {
  let recipe;
  if (recipeType === 'breakfast') recipe = breakfastOptions[recipeId];
  else if (recipeType === 'lunch') recipe = lunchRecipes[recipeId];
  else recipe = recipes[recipeId];

  if (!recipe) return 0;
  if (recipe.tier === 'budget') return 4.5;
  if (recipe.tier === 'medium') return 7.5;
  if (recipe.tier === 'premium') return 12;

  const cuisineCosts = {
    american: 5, mexican: 5, italian: 6, asian: 6,
    mediterranean: 6, indian: 5, thai: 6, fusion: 7, vegan: 4
  };
  return cuisineCosts[recipe.cuisine] || 6;
}

export function calculateWeeklyBudget() {
  const profile = P();
  const state = S();
  if (!profile || !state.weeklyMealPlan) return 0;

  let totalCost = 0;
  const breakfastCost = getRecipeCost(state.defaultBreakfast, 'breakfast');
  totalCost += breakfastCost * 7;

  if (state.mealsPerDay >= 2 && (state.favoriteLunches || []).length) {
    state.favoriteLunches.forEach(lunchId => {
      const lunchCost = getRecipeCost(lunchId, 'lunch');
      const timesPerWeek = 7 / state.favoriteLunches.length;
      totalCost += lunchCost * timesPerWeek;
    });
  }

  if ((state.favoriteDinners || []).length) {
    state.favoriteDinners.forEach(dinnerId => {
      const dinnerCost = getRecipeCost(dinnerId, 'dinner');
      const timesPerWeek = 7 / state.favoriteDinners.length;
      totalCost += dinnerCost * timesPerWeek;
    });
  }

  if (state.includeSnack) {
    if (state.favoriteSnacks && state.favoriteSnacks.length > 0) {
      state.favoriteSnacks.forEach(snackId => {
        const snack = eveningOptions[snackId];
        const snackCost = (snack && snack.cost) || 3;
        const timesPerWeek = 7 / state.favoriteSnacks.length;
        totalCost += snackCost * timesPerWeek;
      });
    } else if (state.selectedEveningSnack) {
      const snack = eveningOptions[state.selectedEveningSnack];
      totalCost += ((snack && snack.cost) || 3) * 7;
    } else {
      totalCost += 3 * 7;
    }
  }

  state.weeklyBudgetUsed = Math.round(totalCost * 100) / 100;
  return state.weeklyBudgetUsed;
}

export function generateIngredientSubstitutions(_overBudget) {
  const state = S();
  const suggestions = [];

  const expensiveIngredients = [
    { original: 'salmon', cheaper: 'chicken breast', savings: 5 },
    { original: 'beef', cheaper: 'ground turkey', savings: 3 },
    { original: 'shrimp', cheaper: 'chicken', savings: 4 },
    { original: 'sushi-grade tuna', cheaper: 'canned tuna', savings: 8 },
    { original: 'fresh mozzarella', cheaper: 'regular mozzarella', savings: 2 }
  ];

  (state.favoriteDinners || []).forEach(dinnerId => {
    const recipe = recipes[dinnerId];
    if (recipe && recipe.tier === 'premium') {
      expensiveIngredients.forEach(sub => {
        if (recipe.name.toLowerCase().includes(sub.original)) {
          suggestions.push({
            type: 'ingredient_substitution',
            title: `Substitute ${sub.cheaper} for ${sub.original}`,
            description: `In "${recipe.name}", use ${sub.cheaper} instead of ${sub.original}`,
            savings: sub.savings * 1.4,
            mealType: 'dinner',
            recipeId: dinnerId
          });
        }
      });
    }
  });

  return suggestions.slice(0, 2);
}

export function suggestCheaperSnack() {
  const state = S();
  const currentSnack = eveningOptions[state.selectedEveningSnack];
  if (!currentSnack) return null;

  const currentCost = currentSnack.cost || 3;
  const cheaperSnacks = Object.entries(eveningOptions)
    .map(([id, snack]) => ({ id, ...snack }))
    .filter(snack => (snack.cost || 3) < currentCost)
    .sort((a, b) => (a.cost || 3) - (b.cost || 3));

  if (cheaperSnacks.length) {
    const suggested = cheaperSnacks[0];
    return {
      type: 'cheaper_snack',
      title: `Switch to ${suggested.name}`,
      description: `Replace ${currentSnack.name} with ${suggested.name}`,
      savings: (currentCost - (suggested.cost || 2)) * 7,
      snackId: suggested.id
    };
  }
  return null;
}

export function suggestCheaperMealWithinEthnicity() {
  const state = S();
  const mealCosts = [];

  (state.favoriteLunches || []).forEach(lunchId => {
    const lunch = lunchRecipes[lunchId];
    const cost = getRecipeCost(lunchId, 'lunch');
    mealCosts.push({ type: 'lunch', id: lunchId, recipe: lunch, cost, timesPerWeek: 7 / state.favoriteLunches.length });
  });

  (state.favoriteDinners || []).forEach(dinnerId => {
    const dinner = recipes[dinnerId];
    const cost = getRecipeCost(dinnerId, 'dinner');
    mealCosts.push({ type: 'dinner', id: dinnerId, recipe: dinner, cost, timesPerWeek: 7 / state.favoriteDinners.length });
  });

  mealCosts.sort((a, b) => b.cost - a.cost);
  const mostExpensive = mealCosts[0];
  if (!mostExpensive) return null;

  const sameCuisine = mostExpensive.type === 'lunch'
    ? Object.entries(lunchRecipes).filter(([id, r]) => r.cuisine === mostExpensive.recipe.cuisine && getRecipeCost(id, 'lunch') < mostExpensive.cost)
    : Object.entries(recipes).filter(([id, r]) => r.cuisine === mostExpensive.recipe.cuisine && getRecipeCost(id, 'dinner') < mostExpensive.cost);

  if (sameCuisine.length) {
    const [cheaperId, cheaperRecipe] = sameCuisine[0];
    const savings = (mostExpensive.cost - getRecipeCost(cheaperId, mostExpensive.type)) * mostExpensive.timesPerWeek;
    return {
      type: 'meal_swap_within_ethnicity',
      title: `Switch ${mostExpensive.recipe.name} to ${cheaperRecipe.name}`,
      description: `Both are ${mostExpensive.recipe.cuisine} cuisine, but ${cheaperRecipe.name} is more budget-friendly`,
      savings,
      originalId: mostExpensive.id,
      suggestedId: cheaperId,
      mealType: mostExpensive.type
    };
  }
  return null;
}

export function suggestCheaperMealAnyEthnicity() {
  const state = S();
  const mealCosts = [];

  (state.favoriteLunches || []).forEach(lunchId => {
    const cost = getRecipeCost(lunchId, 'lunch');
    mealCosts.push({ type: 'lunch', id: lunchId, recipe: lunchRecipes[lunchId], cost, timesPerWeek: 7 / state.favoriteLunches.length });
  });

  (state.favoriteDinners || []).forEach(dinnerId => {
    const cost = getRecipeCost(dinnerId, 'dinner');
    mealCosts.push({ type: 'dinner', id: dinnerId, recipe: recipes[dinnerId], cost, timesPerWeek: 7 / state.favoriteDinners.length });
  });

  mealCosts.sort((a, b) => b.cost - a.cost);
  const mostExpensive = mealCosts[0];
  if (!mostExpensive) return null;

  const allCheaperOptions = mostExpensive.type === 'lunch'
    ? Object.entries(lunchRecipes).filter(([id, r]) => getRecipeCost(id, 'lunch') < mostExpensive.cost).sort((a, b) => getRecipeCost(a[0], 'lunch') - getRecipeCost(b[0], 'lunch'))
    : Object.entries(recipes).filter(([id, r]) => getRecipeCost(id, 'dinner') < mostExpensive.cost).sort((a, b) => getRecipeCost(a[0], 'dinner') - getRecipeCost(b[0], 'dinner'));

  if (allCheaperOptions.length) {
    const [cheaperId, cheaperRecipe] = allCheaperOptions[0];
    const savings = (mostExpensive.cost - getRecipeCost(cheaperId, mostExpensive.type)) * mostExpensive.timesPerWeek;
    return {
      type: 'meal_swap_any_ethnicity',
      title: `Switch ${mostExpensive.recipe.name} to ${cheaperRecipe.name}`,
      description: `${cheaperRecipe.name} (${cheaperRecipe.cuisine}) is significantly cheaper`,
      savings,
      originalId: mostExpensive.id,
      suggestedId: cheaperId,
      mealType: mostExpensive.type
    };
  }
  return null;
}

export function runBudgetOptimization() {
  const profile = P();
  const state = S();
  if (!profile) return;

  const weeklyBudget = profile.weeklyBudget || 100;
  const currentBudget = calculateWeeklyBudget();
  const overBudget = currentBudget - weeklyBudget;

  state.budgetOptimizationSuggestions = [];
  if (overBudget <= 0) return;

  const ingredientSuggestions = generateIngredientSubstitutions(overBudget);
  if (ingredientSuggestions.length) {
    state.budgetOptimizationSuggestions.push(...ingredientSuggestions);
    const savedAmount = ingredientSuggestions.reduce((sum, s) => sum + (s.savings || 0), 0);
    if (savedAmount >= overBudget) return;
  }

  if (state.includeSnack) {
    const snackSuggestion = suggestCheaperSnack();
    if (snackSuggestion) {
      state.budgetOptimizationSuggestions.push(snackSuggestion);
      if (snackSuggestion.savings >= overBudget) return;
    }
  }

  if (state.includeSnack) {
    const eliminateSnackSuggestion = {
      type: 'eliminate_snack',
      title: 'Eliminate Evening Snack',
      description: 'Remove evening snack to stay within budget',
      savings: 21,
      action: () => {
        state.includeSnack = false;
        calculateWeeklyBudget();
        runBudgetOptimization();
      }
    };
    state.budgetOptimizationSuggestions.push(eliminateSnackSuggestion);
    if (eliminateSnackSuggestion.savings >= overBudget) return;
  }

  const withinEthnicitySuggestion = suggestCheaperMealWithinEthnicity();
  if (withinEthnicitySuggestion) {
    state.budgetOptimizationSuggestions.push(withinEthnicitySuggestion);
    if (withinEthnicitySuggestion.savings >= overBudget) return;
  }

  const anyEthnicitySuggestion = suggestCheaperMealAnyEthnicity();
  if (anyEthnicitySuggestion) {
    state.budgetOptimizationSuggestions.push(anyEthnicitySuggestion);
    if (anyEthnicitySuggestion.savings >= overBudget) return;
  }

  state.budgetOptimizationSuggestions.push({
    type: 'reduce_meals',
    title: 'Reduce to 2 Meals Per Day',
    description: 'Choose either Breakfast + Dinner OR Lunch + Dinner to stay within budget',
    savings: state.mealsPerDay === 3 ? calculateWeeklyBudget() * 0.33 : 0,
    options: [
      { label: 'Breakfast + Dinner', value: 'breakfast_dinner' },
      { label: 'Lunch + Dinner', value: 'lunch_dinner' }
    ],
    action: (choice) => {
      state.mealsPerDay = 2;
      if (choice === 'lunch_dinner') state.defaultBreakfast = null;
      calculateMealRotation();
      calculateWeeklyBudget();
      distributeRemainingMacros();
    }
  });
}

export function applyOptimizationSuggestion(suggestion) {
  const state = S();
  switch (suggestion.type) {
    case 'ingredient_substitution':
      alert(`When shopping for ${suggestion.description}, use the cheaper option to save $${suggestion.savings.toFixed(2)}/week`);
      break;
    case 'cheaper_snack':
      state.selectedEveningSnack = suggestion.snackId;
      break;
    case 'eliminate_snack':
      state.includeSnack = false;
      break;
    case 'meal_swap_within_ethnicity':
    case 'meal_swap_any_ethnicity':
      if (suggestion.mealType === 'lunch') {
        const index = state.favoriteLunches.indexOf(suggestion.originalId);
        if (index !== -1) state.favoriteLunches[index] = suggestion.suggestedId;
      } else {
        const index = state.favoriteDinners.indexOf(suggestion.originalId);
        if (index !== -1) state.favoriteDinners[index] = suggestion.suggestedId;
      }
      break;
    case 'reduce_meals':
      break;
  }

  calculateMealRotation();
  calculateWeeklyBudget();
  distributeRemainingMacros();
  runBudgetOptimization();
  save();
}

export function populateBreakfastGrid() {
  const state = S();
  const grid = document.getElementById('breakfastSelectionGrid');
  if (!grid) return;

  grid.innerHTML = '';

  Object.entries(breakfastOptions).forEach(([id, breakfast]) => {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.dataset.breakfastId = id;
    if (state.defaultBreakfast === id) card.classList.add('selected');

    card.innerHTML = `
      <div class="favorite-card-header">
        <div class="favorite-card-emoji">${breakfast.emoji}</div>
        <div class="favorite-card-check">${state.defaultBreakfast === id ? '✓' : ''}</div>
      </div>
      <div class="favorite-card-name">${breakfast.name}</div>
      <div class="favorite-card-details">
        <span>⏱️ ${breakfast.prepTime}</span>
        ${breakfast.dietType === 'vegan' ? '<span class="favorite-card-badge" style="background: #d4edda; color: #155724;">🌱 Vegan</span>' : ''}
      </div>
    `;

    card.onclick = (e) => {
      e.stopPropagation();
      selectDefaultBreakfast(id);
    };
    card.style.cursor = 'pointer';
    grid.appendChild(card);
  });

  if (state.defaultBreakfast) {
    const nextBtn = document.getElementById('breakfastNextBtn');
    if (nextBtn) nextBtn.disabled = false;
  }
}

export function selectDefaultBreakfast(breakfastId) {
  const state = S();
  state.defaultBreakfast = breakfastId;

  const allCards = document.querySelectorAll('#breakfastSelectionGrid .favorite-card');
  allCards.forEach(card => {
    card.classList.remove('selected');
    const checkmark = card.querySelector('.favorite-card-check');
    if (checkmark) checkmark.textContent = '';
  });

  allCards.forEach(card => {
    if (card.dataset.breakfastId === breakfastId) {
      card.classList.add('selected');
      const checkmark = card.querySelector('.favorite-card-check');
      if (checkmark) checkmark.textContent = '✓';
    }
  });

  const nextBtn = document.getElementById('breakfastNextBtn');
  if (nextBtn) nextBtn.disabled = false;
}

export function populateLunchGrid() {
  const state = S();
  const grid = document.getElementById('lunchSelectionGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filterEl = document.getElementById('lunchCuisineFilter');
  const cuisineFilter = (filterEl && filterEl.value) || 'all';

  Object.entries(lunchRecipes).forEach(([id, lunch]) => {
    if (cuisineFilter !== 'all') {
      if (cuisineFilter === 'fusion' && !['fusion', 'hawaiian'].includes(lunch.cuisine)) return;
      if (cuisineFilter !== 'fusion' && lunch.cuisine !== cuisineFilter) return;
    }

    const card = document.createElement('div');
    card.className = 'favorite-card';
    if ((state.favoriteLunches || []).includes(id)) card.classList.add('selected');

    const tierBadge = lunch.tier === 'budget' ? 'badge-budget' :
                      lunch.tier === 'medium' ? 'badge-medium' : 'badge-premium';

    card.innerHTML = `
      <div class="favorite-card-header">
        <div class="favorite-card-emoji">${lunch.emoji}</div>
        <div class="favorite-card-check">${(state.favoriteLunches || []).includes(id) ? '✓' : ''}</div>
      </div>
      <div class="favorite-card-name">${lunch.name}</div>
      <div class="favorite-card-details">
        <span>⏱️ ${parseInt(lunch.prepTime) + parseInt(lunch.cookTime)} min</span>
        <span class="favorite-card-badge ${tierBadge}">${lunch.tier}</span>
        <span class="favorite-card-badge badge-cuisine">${lunch.cuisine}</span>
      </div>
    `;
    card.onclick = () => toggleLunch(id);
    grid.appendChild(card);
  });

  updateLunchCount();
}

export function toggleLunch(lunchId) {
  const state = S();
  const result = window.Sorrel.plan.toggleLunch(state, lunchId);

  if (result.atLimit) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Max 3 lunches — deselect one first');
    else alert('Max 3 — deselect one first');
    return;
  }

  if (typeof event !== 'undefined' && event && event.currentTarget) {
    if (result.added) {
      event.currentTarget.classList.add('selected');
      const check = event.currentTarget.querySelector('.favorite-card-check');
      if (check) check.textContent = '✓';
    } else {
      event.currentTarget.classList.remove('selected');
      const check = event.currentTarget.querySelector('.favorite-card-check');
      if (check) check.textContent = '';
    }
  }

  updateLunchCount();
}

export function updateLunchCount() {
  const state = S();
  const countEl = document.getElementById('lunchSelectionCount');
  if (countEl) countEl.innerHTML = `Selected: <strong>${(state.favoriteLunches || []).length} / 3</strong>`;
  const nextBtn = document.getElementById('lunchNextBtn');
  if (nextBtn) nextBtn.disabled = (state.favoriteLunches || []).length !== 3;
}

export function filterLunches() { populateLunchGrid(); }

export function populateDinnerGrid() {
  const state = S();
  const grid = document.getElementById('dinnerSelectionGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const budgetFilterEl = document.getElementById('dinnerBudgetFilter');
  const cuisineFilterEl = document.getElementById('dinnerCuisineFilter');
  const budgetFilter = (budgetFilterEl && budgetFilterEl.value) || 'all';
  const cuisineFilter = (cuisineFilterEl && cuisineFilterEl.value) || 'all';

  Object.entries(recipes).forEach(([id, dinner]) => {
    const recipeData = recipeIngredients[id];
    const tier = (recipeData && recipeData.tier) || 'budget';

    if (budgetFilter !== 'all' && tier !== budgetFilter) return;
    if (cuisineFilter !== 'all' && dinner.cuisine !== cuisineFilter) return;

    const card = document.createElement('div');
    card.className = 'favorite-card';
    if ((state.favoriteDinners || []).includes(id)) card.classList.add('selected');

    const tierBadge = tier === 'budget' ? 'badge-budget' :
                      tier === 'medium' ? 'badge-medium' : 'badge-premium';

    card.innerHTML = `
      <div class="favorite-card-header">
        <div class="favorite-card-emoji">${dinner.emoji}</div>
        <div class="favorite-card-check">${(state.favoriteDinners || []).includes(id) ? '✓' : ''}</div>
      </div>
      <div class="favorite-card-name">${dinner.name}</div>
      <div class="favorite-card-details">
        <span>⏱️ ${parseInt(dinner.prepTime) + parseInt(dinner.cookTime)} min</span>
        <span class="favorite-card-badge ${tierBadge}">${tier}</span>
        <span class="favorite-card-badge badge-cuisine">${dinner.cuisine}</span>
      </div>
    `;
    card.onclick = () => toggleDinner(id);
    grid.appendChild(card);
  });

  updateDinnerCount();
}

export function toggleDinner(dinnerId) {
  const state = S();
  const result = window.Sorrel.plan.toggleDinner(state, dinnerId);

  if (result.atLimit) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Max 5 dinners — deselect one first');
    else alert('Max 5 — deselect one first');
    return;
  }

  if (typeof event !== 'undefined' && event && event.currentTarget) {
    if (result.added) {
      event.currentTarget.classList.add('selected');
      const check = event.currentTarget.querySelector('.favorite-card-check');
      if (check) check.textContent = '✓';
    } else {
      event.currentTarget.classList.remove('selected');
      const check = event.currentTarget.querySelector('.favorite-card-check');
      if (check) check.textContent = '';
    }
  }

  updateDinnerCount();
}

export function updateDinnerCount() {
  const state = S();
  const countEl = document.getElementById('dinnerSelectionCount');
  if (countEl) countEl.innerHTML = `Selected: <strong>${(state.favoriteDinners || []).length} / 5</strong>`;
  const nextBtn = document.getElementById('dinnerNextBtn');
  if (nextBtn) nextBtn.disabled = (state.favoriteDinners || []).length !== 5;
}

export function filterDinners() { populateDinnerGrid(); }

export function calculatePlanWithFavorites() {
  const state = S();
  if (!state.defaultBreakfast) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Pick a default breakfast');
    else alert('Please pick a default breakfast');
    return;
  }
  if ((state.favoriteLunches || []).length !== 3) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Pick exactly 3 lunches');
    else alert('Pick exactly 3 lunches');
    return;
  }
  if ((state.favoriteDinners || []).length !== 5) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Pick exactly 5 dinners');
    else alert('Pick exactly 5 dinners');
    return;
  }
  window.Sorrel.saveProfile();
}

export function populateFavoriteSnacksGrid() {
  const state = S();
  const grid = document.getElementById('favoriteSnacksGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!state.favoriteSnacks) state.favoriteSnacks = [];

  Object.entries(eveningOptions).forEach(([id, snack]) => {
    const isSelected = state.favoriteSnacks.includes(id);

    const card = document.createElement('div');
    card.className = 'favorite-card' + (isSelected ? ' selected' : '');
    card.innerHTML = `
      <div class="favorite-card-header">
        <div class="favorite-card-emoji">${snack.emoji || '🍪'}</div>
        <div class="favorite-card-check">${isSelected ? '✓' : ''}</div>
      </div>
      <div class="favorite-card-name">${snack.name}</div>
      <div class="favorite-card-details">
        <span>${snack.protein}p • ${snack.carbs}c • ${snack.fat}f</span>
        <span class="favorite-card-badge" style="background: #e8f5e9; color: #2e7d32;">
          $${(snack.cost || 3).toFixed(2)}/day
        </span>
      </div>
    `;
    card.onclick = () => selectSnack(id);
    grid.appendChild(card);
  });

  updateSnackCount();
}

export function selectSnack(snackId) {
  const state = S();
  const result = window.Sorrel.plan.toggleSnack(state, snackId);

  if (result.atLimit) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Max 3 snacks — deselect one first');
    else alert('Max 3 — deselect one first');
    return;
  }

  populateFavoriteSnacksGrid();
  updateSnackCount();
}

export function updateSnackCount() {
  const state = S();
  const countSpan = document.getElementById('snackCount');
  const nextBtn = document.getElementById('snackNextBtn');
  const count = state.favoriteSnacks ? state.favoriteSnacks.length : 0;
  if (countSpan) countSpan.textContent = count;
  if (nextBtn) nextBtn.disabled = count !== 3;
}

export function selectPlanDay(dayIdx) {
  const state = S();
  state.selectedPlanDay = dayIdx;
  save();
  updateMainPagePlanner();
}

export function updateMainPagePlanner() {
  const profile = P();
  const state = S();
  const section = document.getElementById('main-weekly-plan-section');
  if (!section) return;

  if (!profile || !profile.weekPlan || profile.weekPlan.length === 0) {
    section.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; background: #f4f1ec; border-radius: 12px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🥗</div>
        <h2 style="color: #1a2332; margin-bottom: 8px;">Welcome to Sorrel</h2>
        <p style="color: #5a6573; margin-bottom: 20px;">${profile && profile.onboardingType === 'browse' ? 'You are browsing as a guest. Set up your profile to unlock personalized meal planning.' : 'Take the quick assessment to get your personalized nutrition plan.'}</p>
        <button onclick="document.getElementById('profileModal').classList.add('active')"
                style="padding: 14px 28px; background: var(--accent-gradient); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;">
          ${profile && profile.onboardingType === 'browse' ? 'Set up profile' : 'Get Started'}
        </button>
      </div>
    `;
    return;
  }

  const _initialTodayIdx = (() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  })();
  const todayLabel = todayISO();
  if (state.lastPlanDayDate !== todayLabel) {
    state.selectedPlanDay = _initialTodayIdx;
    state.lastPlanDayDate = todayLabel;
  }
  if (typeof state.selectedPlanDay !== 'number') {
    state.selectedPlanDay = _initialTodayIdx;
  }
  const dayIdx = state.selectedPlanDay;
  const dayPlan = profile.weekPlan[dayIdx] || profile.weekPlan[0];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (typeof window.ensureAdaptiveState === 'function') window.ensureAdaptiveState();
  const lastAdjustment = (state.macroAdjustments && state.macroAdjustments.length > 0)
    ? state.macroAdjustments[state.macroAdjustments.length - 1]
    : null;

  let todaysIntensity = null;
  try {
    if (typeof window.getTodaysIntensityRecommendation === 'function') {
      todaysIntensity = window.getTodaysIntensityRecommendation();
    }
  } catch (e) {}

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  let targetCal = profile.targetCalories || 2000;
  try {
    if (typeof window.getEffectiveMacrosForToday === 'function') {
      const eff = window.getEffectiveMacrosForToday();
      if (eff) targetCal = eff.calories || targetCal;
    }
  } catch (e) {}

  const daySelectorHTML = profile.weekPlan.map((day, idx) => {
    const isSelected = idx === dayIdx;
    const isToday = idx === todayIdx;
    const bg = (isSelected || isToday) ? 'var(--accent-gradient)' : 'var(--bg-elevated)';
    const color = (isSelected || isToday) ? 'white' : 'var(--text-primary)';
    const border = isToday ? '2px solid var(--accent-primary)' : '2px solid transparent';
    return `
      <button onclick="selectPlanDay(${idx})"
              style="flex: 1; min-width: 60px; padding: 10px 4px; background: ${bg}; color: ${color}; border: ${border}; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
        <div style="font-size: 11px; opacity: 0.8;">${dayNames[idx]}</div>
        <div style="font-size: 18px; margin-top: 2px;">${idx + 1}</div>
        ${isToday ? `<div style="font-size: 9px; margin-top: 2px;">TODAY</div>` : ''}
      </button>
    `;
  }).join('');

  const diaryRef = window.Sorrel.diary.getDiary();

  const mealCard = (label, emoji, mealObj) => {
    if (!mealObj || !mealObj.meal) return '';
    const meal = mealObj.meal;
    const m = mealObj.macros || {};
    const mealTypeMap = { Breakfast: 'breakfast', Lunch: 'lunch', Dinner: 'dinner', Snack: 'snack' };
    const mealType = mealTypeMap[label] || label.toLowerCase();
    const swapHandler = `swapMeal(${dayIdx + 1}, '${mealType}', 'home')`;

    const isLoggedToday = (() => {
      try {
        if (!diaryRef || !diaryRef.entries) return false;
        const today = todayISO();
        if (state.plannedMealLog && state.plannedMealLog[today] && state.plannedMealLog[today][mealType] === (meal.name || '')) return true;
        const dayEntry = diaryRef.entries[today];
        if (!dayEntry) return false;
        const slotKey = mealType === 'snack' ? 'snacks' : mealType;
        const slot = dayEntry[slotKey] || [];
        return slot.some(e => e && e.name && meal.name && e.name === meal.name && e._sourcePlan);
      } catch (e) { return false; }
    })();

    return `
      <div style="background: ${isLoggedToday ? 'var(--accent-soft)' : 'white'}; border: 1px solid ${isLoggedToday ? 'var(--accent-primary)' : '#e8e2d6'}; border-radius: 10px; padding: 14px; margin-bottom: 10px; transition: all 0.2s;">
        <div onclick="openRecipeFromHome('${mealType}', ${dayIdx})" style="display: flex; align-items: center; cursor: pointer;">
          <div style="font-size: 32px; margin-right: 14px;">${emoji}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 11px; color: ${isLoggedToday ? 'var(--accent-primary)' : '#94a0ad'}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; font-weight: 600;">
              ${isLoggedToday ? '✓ ' + label + ' logged' : label}
            </div>
            <div style="font-weight: 600; color: #1a2332; font-size: 15px; margin-bottom: 4px;">${meal.name || label}</div>
            <div style="font-size: 12px; color: #5a6573;">
              <span style="color: var(--accent-primary); font-weight: 600;">${m.calories || 0} cal</span>
              <span style="margin-left: 10px;">${m.protein || 0}p · ${m.carbs || 0}c · ${m.fat || 0}f</span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="event.stopPropagation(); ${isLoggedToday ? `unlogPlannedMeal('${mealType}','${(meal.name || '').replace(/'/g, "\\'")}')` : `logPlannedMeal('${mealType}', ${dayIdx})`}"
                  style="flex: 1.4; padding: 10px; background: ${isLoggedToday ? 'var(--accent-primary)' : 'white'}; color: ${isLoggedToday ? 'white' : 'var(--accent-primary)'}; border: 2px solid var(--accent-primary); border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 700;">
            ${isLoggedToday ? '✓ Logged · tap to undo' : 'Log it'}
          </button>
          <button onclick="event.stopPropagation(); openRecipeFromHome('${mealType}', ${dayIdx})"
                  style="flex: 1; padding: 10px; background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-subtle); border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;">
            📖 Recipe
          </button>
          <button onclick="event.stopPropagation(); ${swapHandler}"
                  style="flex: 1; padding: 10px; background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-subtle); border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;">
            🔄 Swap
          </button>
        </div>
      </div>
    `;
  };

  section.innerHTML = `
    ${todaysIntensity ? `
      <div onclick="openRecoveryModal()" style="background:${todaysIntensity.color || 'var(--accent-gradient)'};color:white;padding:14px 16px;border-radius:12px;margin-bottom:16px;cursor:pointer;display:flex;align-items:center;gap:12px;">
        <div style="font-size:28px;">${todaysIntensity.emoji || '💪'}</div>
        <div style="flex:1;">
          <div style="font-size:11px;opacity:0.85;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:2px;">Today's training</div>
          <div style="font-weight:700;font-size:15px;">${todaysIntensity.label || 'Standard intensity'}</div>
          <div style="font-size:12px;opacity:0.95;margin-top:2px;line-height:1.3;">${todaysIntensity.training || 'Recovery looks good — train as planned.'}</div>
        </div>
        <div style="font-size:20px;opacity:0.7;">›</div>
      </div>
    ` : ''}

    ${lastAdjustment && daysBetween(lastAdjustment.date, todayISO()) < 3 ? `
      <div style="margin-bottom: 14px; padding: 10px 12px; background: #fef3c7; border-left: 3px solid #d97706; border-radius: 6px; font-size: 13px; color: #5d4037;">
        <strong>Plan updated:</strong> ${lastAdjustment.reason}
      </div>
    ` : ''}

    <div style="background: #faf8f3; padding: 16px; border-radius: 14px; margin-bottom: 16px;">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px;">
        <h2 style="margin: 0; font-size: 20px; color: var(--text-primary);">
          ${dayIdx === todayIdx ? '📋 Today' : '📅 ' + fullDayNames[dayIdx]}
        </h2>
        <div style="font-size: 13px; color: var(--text-secondary);">
          ${(dayPlan.actualMacros || {}).calories || profile.targetCalories} cal total
        </div>
      </div>
      ${mealCard('Breakfast', '🥐', dayPlan.breakfast)}
      ${mealCard('Lunch', '🥗', dayPlan.lunch)}
      ${mealCard('Dinner', '🍽️', dayPlan.dinner)}
      ${mealCard('Snack', '🍿', dayPlan.snack)}
    </div>

    <div style="margin-bottom: 12px;">
      <h3 style="margin: 0 0 8px 0; font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Browse this week</h3>
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
        ${daySelectorHTML}
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
      <button onclick="openBudgetEditModal()"
              style="flex: 1; padding: 12px 14px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; cursor: pointer; text-align: left; font-family: inherit;">
        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 2px;">This week · tap to edit</div>
        <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums;">
          $${(profile.weeklyBudget || 0).toFixed(2)}
        </div>
      </button>
      <button onclick="switchTab('shopping')"
              style="flex-shrink: 0; padding: 14px 16px; min-height: 48px; background: var(--accent-gradient); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; box-shadow: 0 2px 8px rgba(10,125,90,0.18);">
        🛒 Shopping
      </button>
    </div>
  `;
  if (typeof window.renderPlanNextSteps === 'function') window.renderPlanNextSteps();
}

export const render = updateMainPagePlanner;

// Expose for inline onclick handlers in monolith HTML.
window.selectDefaultBreakfast = selectDefaultBreakfast;
window.toggleLunch = toggleLunch;
window.toggleDinner = toggleDinner;
window.selectSnack = selectSnack;
window.filterLunches = filterLunches;
window.filterDinners = filterDinners;
window.selectPlanDay = selectPlanDay;
window.calculatePlanWithFavorites = calculatePlanWithFavorites;
window.populateBreakfastGrid = populateBreakfastGrid;
window.populateLunchGrid = populateLunchGrid;
window.populateDinnerGrid = populateDinnerGrid;
window.populateFavoriteSnacksGrid = populateFavoriteSnacksGrid;
window.applyOptimizationSuggestion = applyOptimizationSuggestion;

// renderPlanWeightChip — lifted from index.html L17884-17937.
// Prominent green CTA when no weight logged today; muted confirmation
// with edit affordance when weighed in. Reads state.weightLog +
// getLoggingStreak (still in monolith). Idle until slice 8.2 wires
// it into the plan render path.
export function renderPlanWeightChip() {
  const chip = document.getElementById('plan-weight-chip');
  if (!chip) return;

  const state = window.state || S();
  const log = state && state.weightLog ? state.weightLog : [];
  const today = todayISO();
  const todayEntry = log.find((e) => e.date === today);

  const streak = typeof window.getLoggingStreak === 'function' ? window.getLoggingStreak() : 0;
  const streakBadge = streak >= 3 ? `
    <div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(255,255,255,0.22);border-radius:10px;font-size:11px;font-weight:700;margin-left:8px;flex-shrink:0;">
      <span>🔥</span><span style="font-variant-numeric:tabular-nums;">${streak}</span>
    </div>
  ` : '';
  const streakBadgeMuted = streak >= 3 ? `
    <div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(245,158,11,0.15);color:#92400e;border-radius:10px;font-size:11px;font-weight:700;flex-shrink:0;">
      <span>🔥</span><span style="font-variant-numeric:tabular-nums;">${streak}</span>
    </div>
  ` : '';

  if (todayEntry) {
    chip.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:12px;">
        <div style="font-size:20px;line-height:1;flex-shrink:0;color:var(--accent-primary);">✓</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;color:var(--text-primary);font-weight:600;font-variant-numeric:tabular-nums;">${todayEntry.weight} lb today</div>
          <div style="font-size:12px;color:var(--text-tertiary);margin-top:1px;">Tap to edit</div>
        </div>
        ${streakBadgeMuted}
        <div style="font-size:16px;color:var(--text-tertiary);flex-shrink:0;">›</div>
      </div>
    `;
  } else {
    chip.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--accent-gradient);color:white;border-radius:12px;box-shadow:0 2px 8px rgba(10,125,90,0.18);">
        <div style="font-size:22px;line-height:1;flex-shrink:0;">⚖️</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:700;display:flex;align-items:center;flex-wrap:wrap;">
            <span>Log today's weight</span>
            ${streakBadge}
          </div>
          <div style="font-size:12px;opacity:0.95;margin-top:1px;line-height:1.4;">Daily weigh-ins drive your adaptive macros</div>
        </div>
        <div style="font-size:18px;opacity:0.7;flex-shrink:0;">›</div>
      </div>
    `;
  }
}

window.sorrelRenderPlanWeightChipLifted = renderPlanWeightChip;

// renderPlanNextSteps — lifted from V1617 IIFE (L36518-36547).
// DO / EAT / LOG card on Plan tab. Coaching deps lifted to
// src/features/coaching.js in slice 8.2a.

export function renderPlanNextSteps() {
  let anchor = domGet('v1617-next-steps-card') || domGet('v1610-next-steps-card') || domGet('v169-next-steps-card');
  if (!anchor) {
    const meals = domGet('today-meals-section') || document.querySelector('#plan .section-header') || domGet('plan');
    anchor = document.createElement('div');
    anchor.id = 'v1617-next-steps-card';
    if (meals && meals.parentElement) meals.parentElement.insertBefore(anchor, meals);
    else (domGet('plan') || document.body).appendChild(anchor);
  }
  anchor.id = 'v1617-next-steps-card';
  const meal = nextMeal();
  const left = usefulLogsLeft();
  anchor.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <span>Today’s next steps</span>
        <span style="font-size:11px;color:var(--text-tertiary);font-weight:800;letter-spacing:.08em;">DO · EAT · LOG</span>
      </div>
      <div style="position:absolute;right:18px;top:18px;background:var(--accent-soft);color:var(--accent-primary);border:1px solid rgba(0,137,97,.22);border-radius:999px;padding:4px 9px;font-size:11px;font-weight:800;">${left} useful log${left === 1 ? '' : 's'} left</div>
      <div style="display:grid;gap:8px;margin-top:8px;">
        <div style="display:grid;grid-template-columns:140px 1fr;gap:10px;align-items:center;padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);font-weight:800;">What do I do next?</div><strong>${esc(nextRoutineAction())}</strong>
        </div>
        <div style="display:grid;grid-template-columns:140px 1fr;gap:10px;align-items:center;padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);font-weight:800;">What do I eat next?</div><strong>${esc(meal.name)} · ${esc(meal.type.charAt(0).toUpperCase() + meal.type.slice(1))} · ${esc(meal.time)}</strong>
        </div>
        <div style="display:grid;grid-template-columns:140px 1fr;gap:10px;align-items:center;padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-tertiary);font-weight:800;">What do I log next?</div><strong>${esc(nextLogAction())}</strong>
        </div>
      </div>
    </div>`;
  domQa('#v169-next-steps-card,#v1610-next-steps-card').forEach((n) => { if (n !== anchor) n.remove(); });
}

window.sorrelRenderPlanNextStepsLifted = renderPlanNextSteps;

// Returns HTML string for the meal timing reference card shown on the Plan
// tab. Reads profile from the bridge namespace; works without profile (returns
// universal principles only).
export function getMealTimingGuide() {
  const profile = window.Sorrel.getProfile();
  const pattern = profile && profile.pattern;
  const focus = profile && profile.focus;
  const goal = profile && profile.goal;

  const universalSection = `
    <div style="padding: 14px 14px 10px 14px; font-size: 13px; line-height: 1.7; color: var(--text-secondary);">
      <div style="font-weight:600;color:var(--text-primary);margin-bottom:8px;font-size:14px;">Core principles</div>
      <div style="margin-bottom:6px;"><strong style="color:var(--accent-primary);">Eat protein at every meal.</strong> 30–40g per meal maximizes muscle protein synthesis better than backloading.</div>
      <div style="margin-bottom:6px;"><strong style="color:var(--accent-primary);">Stop eating 3 hours before bed.</strong> Late meals impair sleep architecture and overnight recovery.</div>
      <div style="margin-bottom:6px;"><strong style="color:var(--accent-primary);">Train fasted or fed — both work.</strong> What matters is total daily protein and calories, not a specific anabolic window.</div>
      <div><strong style="color:var(--accent-primary);">Caffeine cutoff: 8+ hours before bed.</strong> Half-life is ~5h; full clearance protects deep sleep.</div>
    </div>
  `;

  let specificGuide = '';
  if (pattern === 'C') {
    specificGuide = `
      <div class="meal-timing-card">
        <strong>⚠️ Pattern C — cortisol-aware timing</strong>
        <div style="font-size: 13px; line-height: 1.8; color: var(--text-secondary);">
          • <strong>11 AM:</strong> First meal — breaks the fast, stabilizes blood sugar before cortisol's natural mid-morning spike<br>
          • <strong>6 PM:</strong> Largest meal of the day — front-load before evening cortisol taper<br>
          • <strong>Post-workout:</strong> Protein within 30 min if training intensity was high<br>
          • <strong>8:30 PM:</strong> Optional small protein snack — supports overnight recovery without disrupting sleep
        </div>
      </div>
    `;
  } else if (focus === 'fat_loss' || goal === 'lose' || goal === 'lose_fat_moderate' || goal === 'moderate_fatloss') {
    specificGuide = `
      <div class="meal-timing-card">
        <strong>Fat loss timing strategy</strong>
        <div style="font-size: 13px; line-height: 1.8; color: var(--text-secondary);">
          • <strong>Compress your eating window.</strong> 8–10 hours of eating, 14–16 hours of fasting overnight is well-tolerated and supports adherence.<br>
          • <strong>Front-load protein.</strong> Hits satiety harder and prevents late-night hunger.<br>
          • <strong>Largest meal at dinner.</strong> Most people are hungriest then; fighting it leads to break-the-diet snacking.<br>
          • <strong>Post-workout protein matters more in a deficit.</strong> Preserves muscle when calories are low.
        </div>
      </div>
    `;
  } else if (focus === 'strength' || goal === 'gain' || goal === 'lean_gain') {
    specificGuide = `
      <div class="meal-timing-card">
        <strong>Muscle gain timing strategy</strong>
        <div style="font-size: 13px; line-height: 1.8; color: var(--text-secondary);">
          • <strong>Eat 4–5 times per day.</strong> Easier to hit higher calories without forcing huge meals.<br>
          • <strong>Pre- and post-training meals carry more weight.</strong> Carbs before, protein + carbs within 1 hour after.<br>
          • <strong>Casein protein before bed.</strong> 30–40g of slow-digesting protein supports overnight muscle protein synthesis.<br>
          • <strong>Don't skip breakfast on training days.</strong> Glycogen replenishment starts the moment you wake.
        </div>
      </div>
    `;
  }
  return universalSection + specificGuide;
}
