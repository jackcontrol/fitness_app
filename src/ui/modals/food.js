// Food modals — foodSearchModal + foodDetailModal.
// Lifted from index.html L2408-2472 + L2474-2522.
//
// open/save logic stays in monolith (couples to foodDatabase, OFF client,
// favorites). This module only provides templates + close.

import { ensureMounted, closeById } from './helpers.js';

const SEARCH_ID = 'foodSearchModal';
const DETAIL_ID = 'foodDetailModal';

const SEARCH_TEMPLATE = `
<div class="modal" id="foodSearchModal">
<div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Add Food to <span id="food-search-meal-name">Breakfast</span></h2>
<button onclick="closeFoodSearch()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<input id="food-search-input" onkeyup="searchFoodsWithRemote()" placeholder="Search foods (incl. branded items via Open Food Facts)..." style="width: 100%; padding: 14px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px; margin-bottom: 16px;" type="text"/>
<div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
<button class="btn-secondary" id="tab-all" onclick="showAllFoods()" style="font-size: 13px; padding: 8px 14px;">All Foods</button>
<button class="btn-secondary" id="tab-recent" onclick="showRecentFoodsInSearch()" style="font-size: 13px; padding: 8px 14px;">🕐 Recent</button>
<button class="btn-secondary" id="tab-favorites" onclick="showFavoriteFoodsInSearch()" style="font-size: 13px; padding: 8px 14px;">⭐ Favorites</button>
<button class="btn-secondary" id="tab-quick" onclick="showQuickAddInSearch()" style="font-size: 13px; padding: 8px 14px;">⚡ Quick Add</button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
<button class="btn-secondary" id="multi-add-toggle" onclick="toggleMultiAddMode()" style="font-size: 13px; padding: 8px 14px;">☰ Multi-add</button>
<button class="btn-secondary" id="copy-yesterday-btn" onclick="copyYesterdayMeal()" style="font-size: 13px; padding: 8px 14px; display: none;">📋 Copy yesterday</button>
</div>
<div id="food-search-results" style="max-height: 400px; overflow-y: auto;">
<div style="padding: 20px; text-align: center; color: #94a0ad;">Start typing to search for foods...</div>
</div>
<div id="quick-add-section" style="display: none; padding: 20px; background: #f4f1ec; border-radius: 8px;">
<h3 style="margin-top: 0;">Quick Add Calories &amp; Macros</h3>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
<div>
<label style="display: block; margin-bottom: 4px; font-weight: 600;">Calories</label>
<input id="quick-calories" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 4px; font-weight: 600;">Protein (g)</label>
<input id="quick-protein" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 4px; font-weight: 600;">Carbs (g)</label>
<input id="quick-carbs" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 4px; font-weight: 600;">Fat (g)</label>
<input id="quick-fat" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" type="number"/>
</div>
</div>
<button class="btn" onclick="addQuickCalories()" style="width: 100%;">Add to <span id="quick-add-meal-name">Meal</span></button>
</div>
</div>
</div>
`;

const DETAIL_TEMPLATE = `
<div class="modal" id="foodDetailModal">
<div class="modal-content" style="max-width: 500px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 id="food-detail-name" style="margin: 0;">Food Name</h2>
<button onclick="closeFoodDetail()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Serving Size</label>
<select id="serving-size-selector" onchange="updateFoodDetailNutrition()" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;">
</select>
</div>
<div style="margin-bottom: 20px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Number of Servings</label>
<input id="num-servings" min="0.25" onchange="updateFoodDetailNutrition()" step="0.25" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="1"/>
</div>
<div style="background: var(--accent-gradient); padding: 20px; border-radius: 12px; color: white; margin-bottom: 20px;">
<div style="text-align: center; margin-bottom: 12px;">
<div id="food-detail-calories" style="font-size: 36px; font-weight: 700;">0</div>
<div style="font-size: 14px; opacity: 0.9;">CALORIES</div>
</div>
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
<div style="text-align: center;">
<div id="food-detail-protein" style="font-size: 20px; font-weight: 600;">0g</div>
<div style="font-size: 11px; opacity: 0.8;">PROTEIN</div>
</div>
<div style="text-align: center;">
<div id="food-detail-carbs" style="font-size: 20px; font-weight: 600;">0g</div>
<div style="font-size: 11px; opacity: 0.8;">CARBS</div>
</div>
<div style="text-align: center;">
<div id="food-detail-fat" style="font-size: 20px; font-weight: 600;">0g</div>
<div style="font-size: 11px; opacity: 0.8;">FAT</div>
</div>
</div>
</div>
<div class="btn-group">
<button class="btn" onclick="addFoodToMeal()" style="flex: 1;">Add to <span id="food-detail-meal-name">Meal</span></button>
<button class="btn-secondary" id="favorite-btn" onclick="toggleFoodFavorite()" style="padding: 12px 20px;">⭐</button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(SEARCH_ID, SEARCH_TEMPLATE);
  ensureMounted(DETAIL_ID, DETAIL_TEMPLATE);
}

export const closeFoodSearch = () => closeById(SEARCH_ID);
export const closeFoodDetail = () => closeById(DETAIL_ID);
