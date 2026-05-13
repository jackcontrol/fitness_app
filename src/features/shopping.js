// Shopping data helpers — lifted from V165 IIFE (L34042-34159).
//
// V165 is the last-write-wins survivor of purchaseCost / weeklyCost /
// pantryHas; V163 versions are superseded. Adds normalizeItems +
// buildItemsFromWeekPlan + shoppingItems + storeInfoFor + pantry().
//
// Distinct from src/ui/shopping.js (render layer). This is the pure
// data side: cost computation, pantry, item normalization.
//
// Depends on monolith globals: ingredientDatabase, storeInfo,
// generateShoppingList, rehydrateMealMethods, parseIngredientString.
// Stay monolith-owned through 8.2a.

import { appState, appProfile } from '../state/accessors.js';
import { ingredientFor, mealForSlot } from './recipes.js';

export function purchaseCost(item) {
  if (!item) return 0;
  if (Number(item.fullPackageCost) > 0) return Number(item.fullPackageCost);
  const ing = ingredientFor(item);
  const unitCost = ing && Number(ing.cost) > 0 ? Number(ing.cost) : 0;
  return unitCost
    ? Math.max(1, Number(item.packagesToBuy) || 1) * unitCost
    : (Number(item.cost) || 0);
}

export function weeklyCost(item) {
  return Number(item && item.cost) || 0;
}

export function pantry() {
  const s = appState();
  if (!s) return {};
  if (!s.shoppingPantry || typeof s.shoppingPantry !== 'object') s.shoppingPantry = {};
  return s.shoppingPantry;
}

export function pantryHas(item) {
  return !!(item && item.dbKey && pantry()[item.dbKey]);
}

export function storeInfoFor(item) {
  const map = (typeof window.storeInfo !== 'undefined' && window.storeInfo) ? window.storeInfo : {};
  const key = (item && item.bestStore) || 'walmart';
  return Object.assign({ name: key, emoji: '🏪', color: '#0891b2' }, map[key] || {});
}

export function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.filter(Boolean).map((item, idx) => {
    const ing = ingredientFor(item) || {};
    const name = item.name || ing.name || ('Item ' + (idx + 1));
    const dbKey = item.dbKey || item.key || item.id
      || String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const packages = Math.max(1, Number(item.packagesToBuy) || 1);
    const full = Number(item.fullPackageCost)
      || (Number(ing.cost) ? Number(ing.cost) * packages : Number(item.cost) || 0);
    return Object.assign({}, item, {
      dbKey,
      name,
      quantityNeeded: item.quantityNeeded != null ? item.quantityNeeded : (item.quantity || item.qty || packages),
      unit: item.unit || ing.unit || item.packageUnit || 'item',
      category: item.category || ing.category || 'other',
      bestStore: item.bestStore || ing.bestStore || 'walmart',
      altStore: item.altStore || ing.altStore || 'walmart',
      packagesToBuy: packages,
      fullPackageCost: Number(full) || 0,
      cost: Number(item.cost) || 0,
    });
  });
}

export function buildItemsFromWeekPlan() {
  const p = appProfile();
  if (!p || !Array.isArray(p.weekPlan)) return [];
  try {
    if (typeof window.rehydrateMealMethods === 'function') window.rehydrateMealMethods();
  } catch (e) {}
  try {
    if (typeof window.generateShoppingList === 'function') {
      const generated = window.generateShoppingList();
      const generatedItems = normalizeItems(generated && generated.items);
      if (generatedItems.length) return generatedItems;
    }
  } catch (e) {
    console.warn('v1.6.5 generateShoppingList failed; rebuilding manually', e);
  }

  const needed = {};
  p.weekPlan.forEach((day) => {
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach((slot) => {
      const slotData = day && day[slot];
      const meal = mealForSlot(slotData, slot);
      if (!meal) return;
      let ingredients = [];
      try {
        if (typeof meal.getIngredients === 'function') ingredients = meal.getIngredients(slotData && slotData.macros);
        else if (Array.isArray(meal.ingredients)) ingredients = meal.ingredients;
      } catch (e) { ingredients = []; }
      (ingredients || []).forEach((str) => {
        let parsed = null;
        try {
          if (typeof window.parseIngredientString === 'function') parsed = window.parseIngredientString(str);
        } catch (e) {}
        if (!parsed || !parsed.dbKey) return;
        const ing = ingredientFor(parsed.dbKey);
        if (!ing) return;
        if (!needed[parsed.dbKey]) {
          needed[parsed.dbKey] = {
            dbKey: parsed.dbKey,
            name: ing.name || parsed.ingredient || parsed.dbKey,
            quantityNeeded: 0,
            unit: parsed.unit || ing.unit || 'item',
            category: ing.category || 'other',
            bestStore: ing.bestStore || 'walmart',
            altStore: ing.altStore || 'walmart',
          };
        }
        needed[parsed.dbKey].quantityNeeded += Number(parsed.quantity) || 1;
      });
    });
  });
  const items = Object.values(needed).map((item) => {
    const ing = ingredientFor(item.dbKey) || {};
    return Object.assign(item, {
      packagesToBuy: 1,
      cost: Number(ing.cost) ? Number((ing.cost * 0.1).toFixed(2)) : 0,
      fullPackageCost: Number(ing.cost) || 0,
    });
  });
  return normalizeItems(items);
}

export function shoppingItems() {
  let items = [];
  try {
    if (typeof window.generateShoppingList === 'function') {
      items = normalizeItems(window.generateShoppingList().items);
    }
  } catch (e) {}
  if (!items.length) items = buildItemsFromWeekPlan();
  const s = appState();
  if (!items.length && s && s.dynamicShoppingList && Array.isArray(s.dynamicShoppingList.items)) {
    items = normalizeItems(s.dynamicShoppingList.items);
  }
  return items;
}
