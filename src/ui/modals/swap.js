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
}
