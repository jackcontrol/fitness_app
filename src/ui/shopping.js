// Shopping tab — list render + pantry toggles + store grouping.
// Lifted from index.html:
//   renderDynamicShopping L28048, renderShoppingListByCategory L28130,
//   renderShoppingListByStore L28234, renderStoreRecommendations L30699,
//   toggleShoppingPantry L25596, resetShoppingPantry L25611,
//   toggleGroupByStore + toggleShowPrices L28024-28038.
//
// Heavy generators stay in monolith and are called via window.*:
//   generateShoppingList, analyzeStoreRecommendations, rehydrateMealMethods,
//   getDayData, toggleCheck, showLogToast.
// Ingredient data from src/data/ingredients.js.

import { ingredientDatabase } from '../data/ingredients.js';
import { storeInfo } from '../data/providers.js';

const shoppingListState = {
  groupByStore: false,
  showPrices: true
};

function S() { return window.Sorrel.loadState(); }
function P() { return window.Sorrel.getProfile(); }

function toggleGroupByStore() {
  shoppingListState.groupByStore = !shoppingListState.groupByStore;
  const t = document.getElementById('group-toggle-text');
  if (t) t.textContent = shoppingListState.groupByStore ? '📋 Group by Category' : '📦 Group by Store';
  renderDynamicShopping();
}

function toggleShowPrices() {
  shoppingListState.showPrices = !shoppingListState.showPrices;
  const t = document.getElementById('price-toggle-text');
  if (t) t.textContent = shoppingListState.showPrices ? '💰 Hide Prices' : '💰 Show Prices';
  renderDynamicShopping();
}

function toggleShoppingPantry(itemId) {
  const state = S();
  if (!state.shoppingPantry) state.shoppingPantry = {};
  if (state.shoppingPantry[itemId]) delete state.shoppingPantry[itemId];
  else state.shoppingPantry[itemId] = true;
  window.Sorrel.saveState();
  renderDynamicShopping();
}

function resetShoppingPantry() {
  if (!confirm('Reset all "have it" markers? Items you marked on hand will go back to counting toward this week\'s cost.')) return;
  const state = S();
  state.shoppingPantry = {};
  window.Sorrel.saveState();
  renderDynamicShopping();
  if (typeof window.showLogToast === 'function') window.showLogToast('Pantry reset for new week');
}

function renderShoppingListByCategory(shoppingData, dayData) {
  const state = S();
  const groupedByCategory = {};
  shoppingData.items.forEach(item => {
    const category = item.category || 'other';
    if (!groupedByCategory[category]) groupedByCategory[category] = [];
    groupedByCategory[category].push(item);
  });

  const categoryOrder = {
    protein: { name: '🥩 Proteins', priority: 1 },
    produce: { name: '🥬 Produce', priority: 2 },
    grain: { name: '🌾 Grains & Breads', priority: 3 },
    canned: { name: '🥫 Canned Goods', priority: 4 },
    sauce: { name: '🧂 Sauces & Seasonings', priority: 5 },
    oil: { name: '🫒 Oils', priority: 6 },
    nuts: { name: '🥜 Nuts & Seeds', priority: 7 },
    staple: { name: '📦 Staples', priority: 8 },
    supplement: { name: '💪 Supplements', priority: 9 }
  };

  const sortedCategories = Object.keys(groupedByCategory).sort((a, b) => {
    const pa = (categoryOrder[a] && categoryOrder[a].priority) || 999;
    const pb = (categoryOrder[b] && categoryOrder[b].priority) || 999;
    return pa - pb;
  });

  let html = '';
  sortedCategories.forEach(category => {
    const categoryName = (categoryOrder[category] && categoryOrder[category].name) || category;
    const items = groupedByCategory[category];
    const categoryTotal = items.reduce((sum, item) => sum + parseFloat(item.cost), 0);

    html += `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--accent-gradient); border-radius: 10px 10px 0 0; color: white;">
          <div style="font-size: 16px; font-weight: 600;">${categoryName}</div>
          <div style="font-size: 14px; font-weight: 600;">${items.length} items • $${categoryTotal.toFixed(2)}</div>
        </div>
        <div style="background: white; border-radius: 0 0 10px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    `;

    items.forEach((item, index) => {
      const ingredient = ingredientDatabase[item.dbKey];
      const checked = dayData[item.dbKey] || false;
      const checkedClass = checked ? 'checked' : '';
      const isPantry = !!(state.shoppingPantry && state.shoppingPantry[item.dbKey]);
      const bestStore = (ingredient && ingredient.bestStore) || 'walmart';
      const store = storeInfo[bestStore] || storeInfo['walmart'] || { name: 'Store', emoji: '🏪', color: '#666' };

      const packageCost = ingredient && typeof ingredient.cost === 'number' ? ingredient.cost : 0;
      const weeklyAmortized = parseFloat(item.cost) || 0;
      const showAmortizedHint = packageCost > 0 && weeklyAmortized > 0 && Math.abs(packageCost - weeklyAmortized) > 0.01;

      html += `
        <div class="check-item ${checkedClass}" style="border-bottom: ${index < items.length - 1 ? '1px solid #f0f0f0' : 'none'}; padding: 14px 16px; ${isPantry ? 'opacity:0.55;' : ''}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <input type="checkbox" id="shop-${item.dbKey}" ${checked ? 'checked' : ''}
                   onchange="toggleCheck('shopping', '${item.dbKey}')"
                   style="width: 20px; height: 20px; cursor: pointer;">
            <label for="shop-${item.dbKey}" style="flex: 1; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap:8px;">
              <div style="flex: 1; min-width:0;">
                <div style="font-weight: 600; font-size: 15px; margin-bottom: 2px; ${isPantry ? 'text-decoration:line-through;' : ''}">${item.name}</div>
                <div style="font-size: 13px; color: #5a6573; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span>${item.quantityNeeded} ${item.unit} needed</span>
                  ${isPantry
                    ? `<span style="color:var(--accent-primary);font-weight:600;">• ✓ on hand</span>`
                    : (shoppingListState.showPrices
                        ? `<span style="color: #0a7d5a; font-weight: 700;">• $${packageCost.toFixed(2)}</span>${showAmortizedHint ? `<span style="color:var(--text-tertiary);font-weight:500;font-size:11px;">~$${weeklyAmortized.toFixed(2)}/wk used</span>` : ''}`
                        : '')}
                  ${store ? `<span style="display: inline-flex; align-items: center; gap: 4px; background: ${store.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                    ${store.emoji} ${store.name}
                  </span>` : ''}
                </div>
              </div>
            </label>
            <button onclick="event.preventDefault();event.stopPropagation();toggleShoppingPantry('${item.dbKey}');"
                    style="flex-shrink:0;padding:6px 12px;background:${isPantry ? 'var(--accent-primary)' : 'var(--bg-elevated)'};color:${isPantry ? 'white' : 'var(--text-secondary)'};border:1px solid ${isPantry ? 'var(--accent-primary)' : 'var(--border-subtle)'};border-radius:14px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;min-height:28px;">
              ${isPantry ? '✓ have it' : '+ have it'}
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  return html;
}

function renderShoppingListByStore(shoppingData, dayData) {
  const state = S();
  if (!shoppingData.byStore || Object.keys(shoppingData.byStore).length === 0) {
    return '<div style="padding: 20px; text-align: center; color: #5a6573;">No items to display</div>';
  }

  const storeColors = {
    aldi: 'linear-gradient(135deg, #e76f51 0%, #d65a3f 100%)',
    walmart: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    costco: 'linear-gradient(135deg, #95E1D3 0%, #7FCDBB 100%)',
    traderjoes: 'linear-gradient(135deg, #FCA5A5 0%, #F87171 100%)',
    heb: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
    target: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    sams: 'var(--accent-gradient)',
    kroger: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    wholefood: 'linear-gradient(135deg, #10b981 0%, #10B981 100%)',
    amazonfresh: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    specialty: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'
  };

  let html = '';

  Object.keys(shoppingData.byStore).forEach(storeKey => {
    const storeData = shoppingData.byStore[storeKey];
    if (!storeData || !Array.isArray(storeData.items)) return;
    const items = storeData.items;
    if (items.length === 0) return;

    const storeColor = storeColors[storeKey] || 'var(--accent-gradient)';
    const storeName = storeData.name || storeKey;
    const storeEmoji = storeData.emoji || '🏪';
    const storeTotal = storeData.totalCost || '0.00';

    html += `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: ${storeColor}; border-radius: 12px 12px 0 0; color: white; box-shadow: 0 3px 10px rgba(0,0,0,0.15);">
          <div>
            <div style="font-size: 19px; font-weight: 700; margin-bottom: 2px;">${storeEmoji} ${storeName}</div>
            <div style="font-size: 12px; opacity: 0.9;">Best prices on these items</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 600; opacity: 0.95;">${items.length} items</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">$${storeTotal}</div>
          </div>
        </div>
        <div style="background: white; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    `;

    items.forEach((item, index) => {
      const checked = dayData[item.dbKey] || false;
      const checkedClass = checked ? 'checked' : '';
      const isPantry = !!(state.shoppingPantry && state.shoppingPantry[item.dbKey]);

      const ingredient = ingredientDatabase[item.dbKey];
      const packageCost = ingredient && typeof ingredient.cost === 'number' ? ingredient.cost : 0;
      const weeklyAmortized = parseFloat(item.cost) || 0;
      const showAmortizedHint = packageCost > 0 && weeklyAmortized > 0 && Math.abs(packageCost - weeklyAmortized) > 0.01;

      html += `
        <div class="check-item ${checkedClass}" style="border-bottom: ${index < items.length - 1 ? '1px solid #f0f0f0' : 'none'}; padding: 14px 18px; ${isPantry ? 'opacity:0.55;' : ''}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <input type="checkbox" id="shop-${item.dbKey}" ${checked ? 'checked' : ''}
                   onchange="toggleCheck('shopping', '${item.dbKey}')"
                   style="width: 20px; height: 20px; cursor: pointer; accent-color: #0a7d5a;">
            <label for="shop-${item.dbKey}" style="flex: 1; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap:8px;">
              <div style="flex: 1; min-width:0;">
                <div style="font-weight: 600; font-size: 15px; margin-bottom: 3px; color: ${checked ? '#999' : '#2d3748'}; ${isPantry ? 'text-decoration:line-through;' : ''}">${item.name}</div>
                <div style="font-size: 13px; color: #5a6573;">
                  ${item.quantityNeeded} ${item.unit}
                  ${isPantry
                    ? '<span style="color:var(--accent-primary);font-weight:600;margin-left:8px;">• ✓ on hand</span>'
                    : (shoppingListState.showPrices
                        ? `<span style="color: #0a7d5a; font-weight: 700; margin-left: 8px;">• $${packageCost.toFixed(2)}</span>${showAmortizedHint ? ` <span style="color:var(--text-tertiary);font-weight:500;font-size:11px;">~$${weeklyAmortized.toFixed(2)}/wk used</span>` : ''}`
                        : '')}
                  <span style="color: #94a0ad; margin-left: 8px;">• ${item.category}</span>
                </div>
              </div>
            </label>
            <button onclick="event.preventDefault();event.stopPropagation();toggleShoppingPantry('${item.dbKey}');"
                    style="flex-shrink:0;padding:6px 12px;background:${isPantry ? 'var(--accent-primary)' : 'var(--bg-elevated)'};color:${isPantry ? 'white' : 'var(--text-secondary)'};border:1px solid ${isPantry ? 'var(--accent-primary)' : 'var(--border-subtle)'};border-radius:14px;cursor:pointer;font-size:11px;font-weight:600;white-space:nowrap;min-height:28px;">
              ${isPantry ? '✓ have it' : '+ have it'}
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  return html;
}

function renderStoreRecommendations() {
  const state = S();
  const recos = document.getElementById('store-recommendations');
  if (!recos) return;

  const shoppingData = state.dynamicShoppingList ||
    (typeof window.generateShoppingList === 'function' ? window.generateShoppingList() : null);

  if (!shoppingData || shoppingData.mealsSelected === 0) {
    recos.innerHTML = '';
    return;
  }

  const recommendations = typeof window.analyzeStoreRecommendations === 'function'
    ? window.analyzeStoreRecommendations(shoppingData)
    : null;

  if (!recommendations || recommendations.suggestions.length === 0) {
    recos.innerHTML = '';
    return;
  }

  let html = `
    <div style="background: var(--accent-gradient); border-radius: 12px; padding: 16px; color: white; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(10, 125, 90, 0.3);">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <div style="font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          💡 Smart Shopping Strategy
        </div>
        <div style="background: rgba(10, 125, 90, 0.9); padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          Save $${recommendations.totalPotentialSavings}
        </div>
      </div>
      <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <div style="font-size: 13px; margin-bottom: 6px;">
          <strong>Current Cost:</strong> $${recommendations.currentTotal}
          <span style="opacity: 0.8; margin-left: 8px;">→</span>
          <strong style="color: #90EE90; margin-left: 8px;">Optimized: $${recommendations.optimizedTotal}</strong>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          Shop strategically at multiple stores to save <strong>${recommendations.percentSavings}%</strong> on your weekly groceries!
        </div>
      </div>
  `;

  recommendations.suggestions.forEach((suggestion, index) => {
    html += `
      <div style="background: rgba(255,255,255,0.15); border-radius: 10px; padding: 14px; margin-bottom: ${index < recommendations.suggestions.length - 1 ? '10px' : '0'}; border-left: 4px solid ${suggestion.color};">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            ${suggestion.emoji} ${suggestion.store}
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="background: rgba(10, 125, 90, 0.9); padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 700;">
              -$${suggestion.savings}
            </div>
            <div style="background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">
              ${suggestion.savingsPercent}%
            </div>
          </div>
        </div>
        <div style="font-size: 12px; opacity: 0.95; line-height: 1.4; margin-bottom: 6px;">
          <strong>${suggestion.itemCount} items</strong> • Best categories: ${suggestion.topCategories.join(', ')}
        </div>
        <div style="font-size: 11px; opacity: 0.85; line-height: 1.4;">
          Top deals: ${suggestion.topItems.join(', ')}
        </div>
        ${suggestion.note ? `<div style="font-size: 11px; opacity: 0.75; margin-top: 6px; font-style: italic; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 6px;">
          💡 ${suggestion.note}
        </div>` : ''}
      </div>
    `;
  });

  html += `
      <div style="font-size: 11px; opacity: 0.7; margin-top: 12px; text-align: center; font-style: italic;">
        💡 Prices based on 2026 market research across ${recommendations.suggestions.length} retailers
      </div>
    </div>
  `;

  recos.innerHTML = html;
}

export function renderDynamicShopping() {
  const profile = P();
  const state = S();
  if (!profile) return;

  const shoppingData = typeof window.generateShoppingList === 'function'
    ? window.generateShoppingList()
    : { items: [], mealsSelected: 0, byStore: {}, totalCost: 0 };

  state.dynamicShoppingList = shoppingData;
  window.Sorrel.saveState();

  if (!state.shoppingPantry) state.shoppingPantry = {};
  const pantry = state.shoppingPantry;

  const listEl = document.getElementById('unified-shopping-list');
  const costEl = document.getElementById('total-selected-cost');
  const itemsEl = document.getElementById('total-selected-items');
  const badgeEl = document.getElementById('shopping-badge');

  if (shoppingData.mealsSelected === 0) {
    if (listEl) listEl.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: #5a6573; background: #f4f1ec; border-radius: 12px;">
        <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
        <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No meals planned yet</p>
        <p style="font-size: 14px;">Go to the <strong>Plan</strong> tab to select your weekly dinners.</p>
      </div>
    `;
    if (costEl) costEl.textContent = '$0.00';
    if (itemsEl) itemsEl.textContent = '0';
    if (badgeEl) badgeEl.textContent = '0/0';
    const pb = document.getElementById('shopping-pantry-banner');
    if (pb) pb.style.display = 'none';
    return;
  }

  const totalCostNum = typeof shoppingData.totalCost === 'number'
    ? shoppingData.totalCost
    : parseFloat(shoppingData.totalCost) || 0;
  const pantryItems = (shoppingData.items || []).filter(it => pantry[it.dbKey]);
  const pantrySavings = pantryItems.reduce((sum, it) => sum + (parseFloat(it.cost) || 0), 0);
  const adjustedTotal = Math.max(0, totalCostNum - pantrySavings);
  if (costEl) costEl.textContent = `$${adjustedTotal.toFixed(2)}`;
  if (itemsEl) itemsEl.textContent = (shoppingData.items.length - pantryItems.length);

  const pantryBanner = document.getElementById('shopping-pantry-banner');
  if (pantryBanner) {
    if (pantryItems.length > 0) {
      pantryBanner.style.display = 'flex';
      pantryBanner.innerHTML = `
        <div style="flex:1;font-size:13px;color:var(--text-primary);">
          🧺 <strong>${pantryItems.length}</strong> item${pantryItems.length === 1 ? '' : 's'} on hand · saving <strong>$${pantrySavings.toFixed(2)}</strong> this week
        </div>
        <button onclick="resetShoppingPantry()" style="padding:6px 12px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;color:var(--text-primary);white-space:nowrap;">Reset for new week</button>
      `;
    } else {
      pantryBanner.style.display = 'none';
    }
  }

  if (profile && typeof profile.weeklyBudget !== 'undefined') {
    profile.weeklyBudget = adjustedTotal;
    try { localStorage.setItem('user-profile', JSON.stringify(profile)); } catch (e) {}
  }

  const dayData = (typeof window.getDayData === 'function') ? window.getDayData('shopping') : {};
  const checkedCount = Object.values(dayData).filter(v => v).length;
  if (badgeEl) badgeEl.textContent = `${checkedCount}/${shoppingData.items.length}`;

  renderStoreRecommendations();

  let html;
  if (shoppingListState.groupByStore) html = renderShoppingListByStore(shoppingData, dayData);
  else html = renderShoppingListByCategory(shoppingData, dayData);

  if (listEl) listEl.innerHTML = html;
}

export const render = renderDynamicShopping;

// Expose for inline onclick handlers in monolith HTML.
window.toggleShoppingPantry = toggleShoppingPantry;
window.resetShoppingPantry = resetShoppingPantry;
window.toggleGroupByStore = toggleGroupByStore;
window.toggleShowPrices = toggleShowPrices;
