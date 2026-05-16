// Meal-planner + budget render cluster — lifted from monolith (S19 Batch E).
//
// Internal deps left in monolith (window.*): breakfastOptions,
// recipeIngredients, displayStarRating, getRecipeRating, openRatingModal,
// openProfileEdit, openBreakfastSwapForDay, generateShoppingList,
// calculateWeeklyBudget, distributeRemainingMacros, calculateMealRotation,
// runBudgetOptimization, applySuggestion.

import { appState, appProfile, saveAll } from '../state/accessors.js';
import { toast } from './helpers/toast.js';

export function renderMealPlanner() {
  const profile = appProfile();
  const state = appState();
  if (!profile) return;

  if (!state.favoriteLunches || state.favoriteLunches.length === 0 ||
      !state.favoriteDinners || state.favoriteDinners.length === 0) {
    document.getElementById('weekly-calendar').innerHTML = `
      <div style="padding: 32px; background: #f4f1ec; border-radius: 12px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
        <h3 style="color: #0a7d5a; margin-bottom: 12px;">Meal Rotation Not Set Up</h3>
        <p style="color: #5a6573; margin-bottom: 20px; line-height: 1.6;">
          You need to select your favorite meals first.<br>
          Go to Settings → Edit Profile to choose your favorites.
        </p>
        <button onclick="openProfileEdit()" class="btn">Set Up Favorites Now</button>
      </div>
    `;
    return;
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const breakfastOptions = window.breakfastOptions || window.breakfastRecipes || {};
  const lunchRecipes = window.lunchRecipes || {};
  const recipes = window.recipes || {};
  const displayStarRating = window.displayStarRating || (() => '');
  const getRecipeRating = window.getRecipeRating || (() => 0);

  let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';

  for (let day = 1; day <= 7; day++) {
    const dayKey = `day${day}`;
    const dayPlan = state.weeklyMealPlan[dayKey];
    const dayName = dayNames[day - 1];
    if (!dayPlan) continue;

    const breakfast = breakfastOptions[dayPlan.breakfast];
    const lunch = dayPlan.lunch ? lunchRecipes[dayPlan.lunch] : null;
    const dinner = recipes[dayPlan.dinner];

    const dayMacros = {
      protein: state.breakfastMacros.protein + (state.lunchMacros?.protein || 0) + (state.dinnerMacros?.protein || 0),
      calories: state.breakfastMacros.calories + (state.lunchMacros?.calories || 0) + (state.dinnerMacros?.calories || 0)
    };

    html += `
      <div style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <strong style="color: #0a7d5a; font-size: 15px;">Day ${day} - ${dayName}</strong>
          <span style="font-size: 12px; color: #0a7d5a; background: #d4edda; padding: 4px 10px; border-radius: 12px;">
            ~${Math.round(dayMacros.protein)}g protein, ${Math.round(dayMacros.calories)} cal
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f4f1ec; border-radius: 6px; margin-bottom: 8px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #94a0ad; margin-bottom: 2px;">🍳 BREAKFAST</div>
            <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">
              ${breakfast?.emoji || '🍳'} ${breakfast?.name || 'Not set'}
            </div>
            ${dayPlan.breakfast ? `
              <div style="font-size: 11px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 14px;">${displayStarRating(getRecipeRating(dayPlan.breakfast))}</span>
                <button
                  onclick="openRatingModal('${dayPlan.breakfast}', 'breakfast')"
                  style="background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; color: #0a7d5a;"
                >
                  ${getRecipeRating(dayPlan.breakfast) > 0 ? 'Edit' : 'Rate'}
                </button>
              </div>
            ` : ''}
          </div>
          <button
            onclick="openBreakfastSwapForDay(${day})"
            style="background: #0a7d5a; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;"
          >
            Swap
          </button>
        </div>

        ${lunch ? `
        <div style="padding: 10px; background: #f0f8ff; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 12px; color: #94a0ad; margin-bottom: 2px;">🥗 LUNCH</div>
          <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">
            ${lunch.emoji} ${lunch.name}
          </div>
          <div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">
            ${lunch.cuisine} • ${parseInt(lunch.prepTime) + parseInt(lunch.cookTime)} min
          </div>
          <div style="font-size: 11px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px;">${displayStarRating(getRecipeRating(dayPlan.lunch))}</span>
            <button
              onclick="openRatingModal('${dayPlan.lunch}', 'lunch')"
              style="background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; color: #0a7d5a;"
            >
              ${getRecipeRating(dayPlan.lunch) > 0 ? 'Edit' : 'Rate'}
            </button>
          </div>
        </div>
        ` : ''}

        <div style="padding: 10px; background: #fff5f0; border-radius: 6px;">
          <div style="font-size: 12px; color: #94a0ad; margin-bottom: 2px;">🍽️ DINNER</div>
          <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">
            ${dinner?.emoji || '🍽️'} ${dinner?.name || 'Not set'}
          </div>
          <div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">
            ${dinner?.cuisine || ''} • ${dinner ? parseInt(dinner.prepTime) + parseInt(dinner.cookTime) : '0'} min • ${dinner?.tier || 'budget'}
          </div>
          ${dayPlan.dinner ? `
            <div style="font-size: 11px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">${displayStarRating(getRecipeRating(dayPlan.dinner))}</span>
              <button
                onclick="openRatingModal('${dayPlan.dinner}', 'dinner')"
                style="background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; color: #0a7d5a;"
              >
                ${getRecipeRating(dayPlan.dinner) > 0 ? 'Edit' : 'Rate'}
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  html += '</div>';
  document.getElementById('weekly-calendar').innerHTML = html;
}

export function swapBreakfastForDay(dayNumber, breakfastId) {
  const state = appState();
  const dayKey = `day${dayNumber}`;
  state.breakfastSwaps[dayKey] = breakfastId;
  state.weeklyMealPlan[dayKey].breakfast = breakfastId;

  if (typeof window.calculateWeeklyBudget === 'function') window.calculateWeeklyBudget();
  if (typeof window.distributeRemainingMacros === 'function') window.distributeRemainingMacros();

  saveAll();
  renderMealPlanner();
  renderBudgetTracker();
  renderBudgetOptimizationPanel();
  closeBreakfastSwapModal();
}

export function closeBreakfastSwapModal() {
  const modal = document.getElementById('breakfastSwapModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
}

export function recalculateRotation() {
  const profile = appProfile();
  const state = appState();
  if (!profile || !state.favoriteLunches || state.favoriteLunches.length === 0) {
    toast('Set up favorites in your profile first');
    return;
  }
  if (typeof window.calculateMealRotation === 'function') window.calculateMealRotation();
  if (typeof window.distributeRemainingMacros === 'function') window.distributeRemainingMacros();
  if (typeof window.calculateWeeklyBudget === 'function') window.calculateWeeklyBudget();
  if (typeof window.runBudgetOptimization === 'function') window.runBudgetOptimization();

  saveAll();
  renderMealPlanner();
  renderBudgetTracker();
  renderBudgetOptimizationPanel();
  toast('Rotation recalculated');
}

export function renderBudgetTracker() {
  const profile = appProfile();
  const state = appState();
  if (!profile) return;

  const generate = window.generateShoppingList;
  const shoppingData = state.dynamicShoppingList || (typeof generate === 'function' ? generate() : {});
  const mealsSelected = shoppingData.mealsSelected || 0;

  if (mealsSelected === 0) {
    document.getElementById('budget-tracker').innerHTML = `
      <div style="padding: 16px; background: #f4f1ec; border-radius: 8px; text-align: center; color: #5a6573;">
        <strong>No meals selected yet</strong>
        <p style="font-size: 13px; margin-top: 8px;">Select recipes for each day to see your weekly budget breakdown</p>
      </div>
    `;
    return;
  }

  const dinnerCost = parseFloat(shoppingData.dinnerCost);
  const breakfastCost = shoppingData.breakfastCost;
  const totalCost = parseFloat(shoppingData.totalCost);
  const weeklyBudget = profile.weeklyBudget || 150;
  const remaining = weeklyBudget - totalCost;
  const percentUsed = Math.min((totalCost / weeklyBudget) * 100, 100);

  const statusText = remaining >= 0 ? `$${remaining.toFixed(2)} under budget` : `$${Math.abs(remaining).toFixed(2)} over budget`;

  const html = `
    <div style="padding: 16px; background: var(--accent-gradient); border-radius: 12px; color: white;">
      <div style="font-size: 14px; margin-bottom: 8px; opacity: 0.9;">Weekly Budget Tracker</div>
      <div style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">$${totalCost.toFixed(2)}</div>

      <div style="background: rgba(255,255,255,0.15); border-radius: 6px; padding: 12px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
          <span>Dinners (${mealsSelected} meals)</span>
          <span>$${dinnerCost.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
          <span>Breakfasts (7 days)</span>
          <span>$${breakfastCost.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; opacity: 0.7;">
          <span>Lunches (est.)</span>
          <span>$40.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; opacity: 0.7;">
          <span>Snacks (est.)</span>
          <span>$25.00</span>
        </div>
      </div>

      <div style="font-size: 11px; opacity: 0.8; margin-bottom: 8px; font-style: italic;">
        💡 Budget tracks dinners + breakfasts only. Adjust your weekly budget in Settings if needed.
      </div>

      <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
        <div style="background: white; height: 100%; width: ${percentUsed}%; transition: width 0.3s;"></div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 13px;">
        <span>Budget: $${weeklyBudget}</span>
        <span style="color: ${remaining >= 0 ? '#d4ffd4' : '#ffd4d4'};">${statusText}</span>
      </div>
    </div>
  `;

  document.getElementById('budget-tracker').innerHTML = html;

  if (remaining < 0) {
    if (typeof window.runBudgetOptimization === 'function') window.runBudgetOptimization();
    renderBudgetOptimizationPanel();
  } else {
    const sug = document.getElementById('budget-suggestions');
    if (sug) sug.style.display = 'none';
  }
}

export function renderBudgetOptimizationPanel() {
  const state = appState();
  const suggestions = state.budgetOptimizationSuggestions || [];
  if (suggestions.length === 0) {
    const sug = document.getElementById('budget-suggestions');
    if (sug) sug.style.display = 'none';
    return;
  }

  let html = `
    <div style="padding: 16px;">
      <div style="font-size: 16px; font-weight: 600; color: #856404; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        💡 Budget Optimization Suggestions
      </div>
      <div style="font-size: 13px; color: #5a6573; margin-bottom: 16px;">
        Try these strategies in order to get under budget:
      </div>
  `;

  suggestions.forEach((suggestion, index) => {
    const priorityNum = index + 1;
    const borderColors = ['#0a7d5a', '#d97706', '#dc2626', '#6c757d'];
    const borderColor = borderColors[Math.min(index, 3)];

    html += `
      <div style="background: white; border-radius: 8px; padding: 14px; margin-bottom: 12px; border-left: 3px solid ${borderColor};">
        <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 8px;">
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 600; color: #1a2332; margin-bottom: 4px;">
              ${priorityNum}. ${suggestion.title}
            </div>
            <div style="font-size: 12px; color: #5a6573; line-height: 1.5;">
              ${suggestion.description}
            </div>
          </div>
          <div style="text-align: right; margin-left: 12px;">
            <div style="font-size: 16px; font-weight: 600; color: #0a7d5a;">
              -$${suggestion.savings?.toFixed(2) || '0.00'}
            </div>
            <div style="font-size: 11px; color: #94a0ad;">per week</div>
          </div>
        </div>

        ${suggestion.options ? `
          <div style="margin-top: 12px;">
            <select id="suggestion-${index}-option" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; margin-bottom: 8px;">
              ${suggestion.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        <button
          onclick="applySuggestion(${index})"
          style="width: 100%; padding: 8px; background: ${borderColor}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; margin-top: 8px;"
        >
          Apply This Change
        </button>
      </div>
    `;
  });

  html += `
    <div style="font-size: 11px; color: #856404; margin-top: 12px; font-style: italic; padding: 12px; background: #fef3c7; border-radius: 6px;">
      💡 Tip: Apply suggestions in order. Each change recalculates your budget automatically.
    </div>
  </div>
  `;

  document.getElementById('swap-suggestions').innerHTML = html;
  document.getElementById('budget-suggestions').style.display = 'block';
}
