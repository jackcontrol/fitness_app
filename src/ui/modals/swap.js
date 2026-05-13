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
