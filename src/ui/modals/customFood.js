// Custom food modal. Lifted from index.html L3359-3404 (HTML) +
// L15406-15420 (open/close). saveCustomFood stays in monolith for 7B
// (touches customFoods + foodDatabase + renderCustomFoods globals).
//
// Bridge pattern: mount() injects the template only if the monolith's
// inline copy isn't already in the DOM. Coexists during 7B; takes over
// in slice 8 when monolith HTML is stripped.

import { ensureMounted, closeById } from './helpers.js';

const MODAL_ID = 'customFoodModal';

const TEMPLATE = `
<div class="modal" id="customFoodModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Create Custom Food</h2>
<button onclick="closeCustomFoodModal()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Food Name</label>
<input id="custom-food-name" placeholder="e.g., Homemade Protein Shake" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="text"/>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Serving Size</label>
<input id="custom-food-serving" placeholder="e.g., 1 cup, 1 serving, 100g" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="text"/>
</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Calories</label>
<input id="custom-food-calories" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Protein (g)</label>
<input id="custom-food-protein" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Carbs (g)</label>
<input id="custom-food-carbs" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Fat (g)</label>
<input id="custom-food-fat" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
</div>
<div class="btn-group">
<button class="btn" onclick="saveCustomFood()" style="flex: 1;">
        Save Custom Food
      </button>
<button class="btn-secondary" onclick="closeCustomFoodModal()" style="padding: 12px 20px;">
        Cancel
      </button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(MODAL_ID, TEMPLATE);
}

export function open() {
  const el = ensureMounted(MODAL_ID, TEMPLATE);
  if (!el) return;
  ['custom-food-name', 'custom-food-serving', 'custom-food-calories',
   'custom-food-protein', 'custom-food-carbs', 'custom-food-fat'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
  el.style.display = 'block';
}

export function close() {
  closeById(MODAL_ID);
}
