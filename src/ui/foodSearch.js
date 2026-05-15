// Food search subsystem.
// Lifted from monolith (Session 18). Reads window.foodDatabase + window.foodDiary
// + window.multiAddState (all bridged from monolith script scope). Calls remaining
// monolith helpers via `typeof window.X === 'function'` guards.

export function closeFoodSearch() {
  document.getElementById('foodSearchModal').style.display = 'none';
  document.getElementById('quick-add-section').style.display = 'none';
}

export function searchFoods() {
  const query = document.getElementById('food-search-input').value.toLowerCase().trim();
  if (query.length === 0) {
    if (typeof window.showAllFoods === 'function') window.showAllFoods();
    return;
  }
  const foodDatabase = window.foodDatabase || {};
  const results = Object.entries(foodDatabase).filter(([, food]) => {
    const name = (food.name || '').toLowerCase();
    const category = (food.category || '').toLowerCase();
    return name.includes(query) || category.includes(query);
  });
  renderSearchResults(results);
}

export function renderSearchResults(results) {
  const container = document.getElementById('food-search-results');
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: #94a0ad;">
        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
        <div>No foods found</div>
        <div style="font-size: 13px; margin-top: 8px;">Try a different search term</div>
      </div>
    `;
    return;
  }

  const foodDiary = window.foodDiary || { favoriteFoods: [] };
  const multiAddState = window.multiAddState || { active: false, selected: [] };

  let html = '';
  results.forEach(([foodId, food]) => {
    const isFavorite = (foodDiary.favoriteFoods || []).includes(foodId);
    const isSelected = multiAddState.active && (multiAddState.selected || []).includes(foodId);
    const onClick = multiAddState.active
      ? `toggleMultiAddItem('${foodId}')`
      : `selectFood('${foodId}')`;

    html += `
      <div id="food-row-${foodId}" onclick="${onClick}"
           style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; border-left: ${isSelected ? '4px solid #0a7d5a' : '4px solid transparent'}; background: ${isSelected ? '#e8f0ff' : 'white'}; cursor: pointer; transition: background 0.15s, border-left 0.15s;"
           onmouseover="if(!${isSelected}) this.style.background='#f8f9fa'" onmouseout="if(!${isSelected}) this.style.background='white'">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 14px; color: #1a2332; margin-bottom: 4px;">
              ${isFavorite ? '⭐ ' : ''}${food.name || foodId}
            </div>
            <div style="font-size: 12px; color: #5a6573;">
              ${food.baseServing || '1 serving'}: ${food.calories || 0} cal | ${food.protein || 0}p ${food.carbs || 0}c ${food.fat || 0}f
            </div>
            ${food.category ? `<div style="font-size: 11px; color: #94a0ad; margin-top: 2px;">${food.category}</div>` : ''}
          </div>
          ${multiAddState.active ? `
            <div class="multi-add-check" style="width:28px;height:28px;border-radius:50%;background:${isSelected ? '#0a7d5a' : 'white'};border:2px solid ${isSelected ? '#0a7d5a' : '#ddd'};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;">${isSelected ? '✓' : ''}</div>
          ` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

export function selectFood(foodId) {
  const foodDatabase = window.foodDatabase || {};
  const food = foodDatabase[foodId];
  if (!food) return;

  const foodDiary = window.foodDiary;
  foodDiary.currentFood = { id: foodId, ...food };

  closeFoodSearch();

  document.getElementById('food-detail-name').textContent = food.name;
  document.getElementById('food-detail-meal-name').textContent =
    foodDiary.currentMeal.charAt(0).toUpperCase() + foodDiary.currentMeal.slice(1);

  const servingSelector = document.getElementById('serving-size-selector');
  servingSelector.innerHTML = '';
  const servings = (Array.isArray(food.servings) && food.servings.length > 0)
    ? food.servings
    : [food.baseServing || '1 serving'];
  servings.forEach((serving, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = serving;
    if (serving === food.baseServing) option.selected = true;
    servingSelector.appendChild(option);
  });

  document.getElementById('num-servings').value = 1;

  const isFavorite = (foodDiary.favoriteFoods || []).includes(foodId);
  document.getElementById('favorite-btn').textContent = isFavorite ? '★' : '⭐';

  if (typeof window.updateFoodDetailNutrition === 'function') window.updateFoodDetailNutrition();

  document.getElementById('foodDetailModal').style.display = 'block';
}

export function parseServing(s) {
  if (typeof s !== 'string') return null;
  const trimmed = s.trim().toLowerCase();
  const m = trimmed.match(/^(\d+(?:\s+\d+\/\d+|\.\d+|\/\d+)?)\s*([a-z]*)/);
  if (!m) return null;

  const numStr = m[1];
  let num;
  if (numStr.includes(' ')) {
    const [whole, frac] = numStr.split(/\s+/);
    const [n, d] = frac.split('/').map(Number);
    num = parseInt(whole) + (n / d);
  } else if (numStr.includes('/')) {
    const [n, d] = numStr.split('/').map(Number);
    num = n / d;
  } else {
    num = parseFloat(numStr);
  }
  if (isNaN(num) || num <= 0) return null;

  let unit = (m[2] || '').replace(/s$/, '');
  const aliases = { tbl: 'tbsp', tablespoon: 'tbsp', teaspoon: 'tsp', oz: 'oz', cup: 'cup', g: 'g', gram: 'g', ml: 'ml' };
  if (aliases[unit]) unit = aliases[unit];

  return { num, unit };
}

export function servingRatio(selectedServing, baseServing) {
  if (selectedServing === baseServing) return 1.0;
  const sel = parseServing(selectedServing);
  const base = parseServing(baseServing);
  if (!sel || !base) return 1.0;
  if (sel.unit !== base.unit) return 1.0;
  return sel.num / base.num;
}

export function addFoodToMeal() {
  const foodDiary = window.foodDiary;
  const food = foodDiary.currentFood;
  if (!food) return;

  const servingIndex = parseInt(document.getElementById('serving-size-selector').value);
  const quantity = parseFloat(document.getElementById('num-servings').value) || 1;
  const servings = (Array.isArray(food.servings) && food.servings.length > 0)
    ? food.servings
    : [food.baseServing || '1 serving'];
  const serving = servings[servingIndex] || servings[0];

  const ratio = servingRatio(serving, food.baseServing);
  const totalMultiplier = ratio * quantity;

  const entry = {
    foodId: food.id,
    name: food.name,
    serving: serving,
    quantity: quantity,
    calories: Math.round((food.calories || 0) * totalMultiplier),
    protein: Math.round((food.protein || 0) * totalMultiplier),
    carbs: Math.round((food.carbs || 0) * totalMultiplier),
    fat: Math.round((food.fat || 0) * totalMultiplier),
  };

  if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(foodDiary.currentDate);
  foodDiary.entries[foodDiary.currentDate][foodDiary.currentMeal].push(entry);

  if (typeof window.addToRecent === 'function') window.addToRecent(food.id);

  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.closeFoodDetail === 'function') window.closeFoodDetail();
}

export function addFoodToMealDirect(mealId, foodId, servingIndex, quantity) {
  const foodDatabase = window.foodDatabase || {};
  if (!foodDatabase[foodId]) {
    console.error('Food not found:', foodId);
    return false;
  }
  const food = foodDatabase[foodId];
  const servings = (Array.isArray(food.servings) && food.servings.length > 0)
    ? food.servings
    : (food.baseServing ? [food.baseServing] : null);
  if (!servings) {
    console.error('No serving data for food:', foodId);
    return false;
  }
  const serving = servings[servingIndex] || servings[0];

  const ratio = servingRatio(serving, food.baseServing);
  const totalMultiplier = ratio * quantity;

  const entry = {
    foodId: foodId,
    name: food.name,
    serving: serving,
    quantity: quantity,
    calories: Math.round((food.calories || 0) * totalMultiplier),
    protein: Math.round((food.protein || 0) * totalMultiplier),
    carbs: Math.round((food.carbs || 0) * totalMultiplier),
    fat: Math.round((food.fat || 0) * totalMultiplier),
  };

  const foodDiary = window.foodDiary;
  if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(foodDiary.currentDate);

  let mealKey = 'breakfast';
  if (mealId === 'm1') mealKey = 'lunch';
  else if (mealId === 'm2') mealKey = 'dinner';
  else if (mealId === 'm3') mealKey = 'snacks';

  foodDiary.entries[foodDiary.currentDate][mealKey].push(entry);

  if (typeof window.addToRecent === 'function') window.addToRecent(foodId);
  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();

  return true;
}

export async function searchFoodsWithRemote() {
  searchFoods();

  const input = document.getElementById('food-search-input');
  if (!input) return;
  const query = input.value.toLowerCase().trim();
  if (query.length < 3) return;

  const resultsContainer = document.getElementById('search-results')
    || document.getElementById('all-foods-list');
  if (resultsContainer && !document.getElementById('off-loading')) {
    const loader = document.createElement('div');
    loader.id = 'off-loading';
    loader.style.cssText = 'padding: 12px 16px; text-align: center; color: #94a0ad; font-size: 13px;';
    loader.textContent = '🌐 Searching online database…';
    resultsContainer.appendChild(loader);
  }

  let remoteResults;
  try {
    if (typeof window.offSearchByTextDebounced !== 'function') {
      const loader = document.getElementById('off-loading');
      if (loader) loader.remove();
      return;
    }
    remoteResults = await window.offSearchByTextDebounced(query);
  } catch (e) {
    const loader = document.getElementById('off-loading');
    if (loader) loader.remove();
    return;
  }

  const loader = document.getElementById('off-loading');
  if (loader) loader.remove();

  if (input.value.toLowerCase().trim() !== query) return;

  const foodDatabase = window.foodDatabase || {};
  let added = 0;
  for (const item of remoteResults) {
    if (!foodDatabase[item.id]) {
      foodDatabase[item.id] = item;
      added++;
    }
  }

  if (added > 0) searchFoods();
}
