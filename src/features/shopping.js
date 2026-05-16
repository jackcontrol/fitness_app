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
import { ingredientDatabase } from '../data/ingredients.js';

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
    const generated = generateShoppingList();
    const generatedItems = normalizeItems(generated && generated.items);
    if (generatedItems.length) return generatedItems;
  } catch (e) {
    console.warn('generateShoppingList failed; rebuilding manually', e);
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
        try { parsed = parseIngredientString(str); } catch (e) {}
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
    items = normalizeItems(generateShoppingList().items);
  } catch (e) {}
  if (!items.length) items = buildItemsFromWeekPlan();
  const s = appState();
  if (!items.length && s && s.dynamicShoppingList && Array.isArray(s.dynamicShoppingList.items)) {
    items = normalizeItems(s.dynamicShoppingList.items);
  }
  return items;
}

export function parseIngredientString(ingredientStr) {
  const quantityMatch = ingredientStr.match(/^([\d./]+)\s*(oz|lb|cups?|tbsps?|tsps?|cloves?|bulbs?|scoops?|slices?|each|bag|cans?|box|boxes|container|jar|bottle|packet|package)?/i);
  if (!quantityMatch) {
    return { quantity: 0, unit: 'misc', ingredient: ingredientStr.toLowerCase(), originalText: ingredientStr };
  }
  let quantity = 0;
  const qtyStr = quantityMatch[1];
  if (qtyStr.includes('/')) {
    const parts = qtyStr.split(/\s+/);
    let whole = 0, fraction = 0;
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, denom] = part.split('/');
        fraction = parseInt(num) / parseInt(denom);
      } else {
        whole = parseFloat(part);
      }
    }
    quantity = whole + fraction;
  } else {
    quantity = parseFloat(qtyStr);
  }
  let unit = (quantityMatch[2] || 'each').toLowerCase();
  unit = unit.replace(/s$/, '');
  const remainingText = ingredientStr.substring(quantityMatch[0].length).trim();
  const ingredientName = remainingText.split(',')[0].toLowerCase();
  const ingredientMap = {
    'chicken breast': 'chicken_breast', 'chicken': 'chicken_breast',
    'ground turkey': 'ground_turkey', 'turkey': 'ground_turkey',
    'eggs': 'eggs', 'egg': 'eggs',
    'greek yogurt': 'greek_yogurt', 'greek yogurt (plain': 'greek_yogurt',
    'yogurt': 'greek_yogurt', 'plain yogurt': 'greek_yogurt',
    'tuna cans': 'tuna_cans', 'tuna': 'tuna_cans', 'canned tuna': 'tuna_cans',
    'tofu': 'tofu', 'firm tofu': 'tofu_firm', 'tempeh': 'tempeh',
    'edamame': 'edamame', 'lentils': 'lentils_dry', 'dry lentils': 'lentils_dry',
    'cooked lentils': 'lentils_dry', 'chickpeas': 'chickpeas_canned',
    'canned chickpeas': 'chickpeas_canned', 'feta cheese': 'feta_cheese',
    'feta': 'feta_cheese', 'cheese': 'cheese_shredded', 'shredded cheese': 'cheese_shredded',
    'cheddar cheese': 'cheese_shredded', 'cheese (cheddar or swiss)': 'cheese_shredded',
    'mozzarella': 'mozzarella', 'mozzarella cheese': 'mozzarella',
    'beef sirloin': 'beef_sirloin', 'beef': 'beef_sirloin',
    'beef or chicken': 'beef_sirloin', 'sirloin': 'beef_sirloin',
    'shrimp': 'shrimp', 'salmon': 'salmon', 'salmon fillet': 'salmon',
    'cottage cheese': 'greek_yogurt', 'protein powder': 'protein_powder',
    'scoop protein powder': 'protein_powder',
    'scoop protein powder (vanilla)': 'protein_powder',
    'scoop protein powder (optional boost)': 'protein_powder',
    'scoops protein powder': 'protein_powder',
    'scoops protein powder (vanilla)': 'protein_powder',
    'brown rice': 'brown_rice', 'rice': 'brown_rice', 'cooked rice': 'brown_rice',
    'red lentil pasta': 'lentil_pasta', 'red lentil pasta (dry)': 'lentil_pasta',
    'lentil pasta': 'lentil_pasta', 'pasta': 'lentil_pasta',
    'spaghetti': 'lentil_pasta', 'noodles': 'lentil_pasta',
    'whole grain bread': 'whole_grain_bread', 'whole wheat bread': 'bread',
    'slices whole wheat bread': 'bread', 'slices whole grain bread': 'whole_grain_bread',
    'bread': 'bread', 'toast': 'bread',
    'large whole wheat tortilla': 'ezekiel_tortillas',
    'ezekiel bread': 'ezekiel_bread', 'ezekiel 4:9 bread': 'ezekiel_bread',
    'ezekiel cereal': 'ezekiel_cereal', 'ezekiel 4:9 cereal': 'ezekiel_cereal',
    'ezekiel tortillas': 'ezekiel_tortillas', 'tortillas': 'ezekiel_tortillas',
    'quinoa': 'quinoa', 'oats': 'oats', 'rolled oats': 'oats',
    'rolled oats (dry)': 'oats', 'rolled oats or granola': 'oats', 'oatmeal': 'oats',
    'sweet potato': 'sweet_potatoes', 'sweet potatoes': 'sweet_potatoes',
    'kefir': 'kefir', 'plain kefir': 'kefir',
    'berries': 'berries', 'fresh berries': 'berries', 'frozen berries': 'berries',
    'mixed berries': 'berries', 'fresh berries (blueberrie': 'berries',
    'blueberries': 'berries', 'strawberries': 'berries',
    'banana': 'bananas', 'bananas': 'bananas', 'frozen banana': 'bananas',
    'spinach': 'spinach', 'fresh spinach': 'spinach',
    'tomatoes': 'tomatoes', 'tomato': 'tomatoes',
    'fresh tomatoes': 'tomatoes', 'diced tomatoes': 'tomatoes',
    'cherry tomatoes': 'cherry_tomatoes',
    'onion': 'onions', 'onions': 'onions',
    'yellow onion': 'onions', 'red onion': 'onions',
    'avocado': 'avocados', 'avocados': 'avocados',
    'garlic': 'garlic', 'garlic cloves': 'garlic', 'garlic bulb': 'garlic',
    'bell pepper': 'bell_peppers', 'bell peppers': 'bell_peppers',
    'pepper': 'bell_peppers', 'peppers': 'bell_peppers',
    'red bell pepper': 'bell_peppers', 'green bell pepper': 'bell_peppers',
    'broccoli': 'broccoli', 'broccoli crown': 'broccoli',
    'carrots': 'carrots', 'carrot': 'carrots',
    'cucumber': 'cucumber', 'lettuce': 'lettuce', 'romaine lettuce': 'lettuce',
    'kale': 'kale', 'zucchini': 'zucchini',
    'mushrooms': 'mushrooms', 'cauliflower': 'cauliflower',
    'crushed tomatoes': 'crushed_tomatoes', 'canned tomatoes': 'crushed_tomatoes',
    'tomato sauce': 'crushed_tomatoes', 'marinara sauce': 'crushed_tomatoes',
    'tomato soup (canned or homemade)': 'crushed_tomatoes',
    'black beans': 'black_beans', 'beans': 'black_beans', 'canned beans': 'black_beans',
    'white beans': 'white_beans', 'white beans (cannellini)': 'white_beans',
    'cannellini beans': 'white_beans', 'pinto beans': 'pinto_beans',
    'red lentils': 'red_lentils',
    'chicken broth': 'chicken_broth', 'broth': 'chicken_broth',
    'vegetable broth': 'vegetable_broth',
    'soy sauce': 'soy_sauce', 'bbq sauce': 'bbq_sauce', 'salsa': 'salsa',
    'hot sauce': 'hot_sauce', 'sriracha': 'hot_sauce',
    'teriyaki sauce': 'teriyaki_sauce', 'hoisin sauce': 'hoisin_sauce',
    'tahini': 'tahini', 'hummus': 'hummus',
    'peanut butter': 'peanut_butter', 'almond butter': 'almond_butter',
    'almond butter or walnuts': 'almond_butter',
    'peanut butter or almond butter': 'peanut_butter',
    'honey': 'honey', 'honey or maple syrup': 'honey',
    'honey or maple syrup (optional)': 'honey',
    'maple syrup': 'maple_syrup', 'caesar dressing': 'caesar_dressing',
    'lemon juice': 'lemon',
    'olive oil': 'olive_oil', 'oil': 'olive_oil',
    'extra virgin olive oil': 'olive_oil', 'coconut oil': 'coconut_oil',
    'sesame oil': 'sesame_oil', 'butter': 'butter', 'ghee': 'ghee',
    'salt': 'salt', 'pepper': 'pepper', 'black pepper': 'pepper',
    'cumin': 'cumin', 'coriander': 'coriander', 'turmeric': 'turmeric',
    'paprika': 'paprika', 'chili powder': 'chili_powder',
    'cayenne pepper': 'cayenne', 'garam masala': 'garam_masala',
    'italian seasoning': 'italian_seasoning', 'oregano': 'oregano',
    'basil': 'basil', 'thyme': 'thyme', 'rosemary': 'rosemary',
    'garlic powder': 'garlic_powder', 'onion powder': 'onion_powder',
    'cinnamon': 'cinnamon', 'ginger': 'ginger', 'taco seasoning': 'taco_seasoning',
    'milk': 'almond_milk', 'almond milk': 'almond_milk',
    'unsweetened almond milk': 'almond_milk', 'heavy cream': 'heavy_cream',
    'cream': 'heavy_cream', 'sour cream': 'sour_cream',
    'parmesan': 'parmesan', 'parmesan cheese': 'parmesan',
    'baking powder': 'baking_powder', 'vanilla extract': 'vanilla_extract',
    'lemon': 'lemon', 'lime': 'lime', 'vinegar': 'vinegar',
    'apple cider vinegar': 'vinegar', 'balsamic vinegar': 'balsamic_vinegar',
    'celery': 'celery', 'kalamata olives': 'olives',
  };
  const dbKey = ingredientMap[ingredientName] || null;
  return { quantity, unit, ingredient: ingredientName, dbKey, originalText: ingredientStr };
}

function aggregateIngredients(ingredientsNeeded, ingredientsList, multiplier = 1) {
  ingredientsList.forEach(ingredientStr => {
    const parsed = parseIngredientString(ingredientStr);
    if (parsed.dbKey && parsed.quantity > 0) {
      if (!ingredientsNeeded[parsed.dbKey]) {
        ingredientsNeeded[parsed.dbKey] = {
          totalQty: 0,
          unit: parsed.unit,
          name: ingredientDatabase[parsed.dbKey]?.name || parsed.ingredient,
        };
      }
      let qtyToAdd = parsed.quantity * multiplier;
      if (parsed.unit === 'lb' && ingredientsNeeded[parsed.dbKey].unit === 'oz') {
        qtyToAdd = qtyToAdd * 16;
      } else if (parsed.unit === 'oz' && ingredientsNeeded[parsed.dbKey].unit === 'lb') {
        qtyToAdd = qtyToAdd / 16;
      }
      ingredientsNeeded[parsed.dbKey].totalQty += qtyToAdd;
    }
  });
}

export function calculateWeeklyIngredients() {
  const p = appProfile();
  if (!p || !p.weekPlan) {
    return { ingredientsNeeded: {}, totalCost: 0, mealsSelected: 0 };
  }
  if (typeof window.rehydrateMealMethods === 'function') {
    window.rehydrateMealMethods();
  }
  const ingredientsNeeded = {};
  let mealsSelected = 0;
  p.weekPlan.forEach(day => {
    if (day.breakfast && day.breakfast.meal && day.breakfast.meal.getIngredients) {
      aggregateIngredients(ingredientsNeeded, day.breakfast.meal.getIngredients(day.breakfast.macros), 1);
      mealsSelected++;
    } else if (day.breakfast && day.breakfast.meal) { mealsSelected++; }
    if (day.lunch && day.lunch.meal && day.lunch.meal.getIngredients) {
      aggregateIngredients(ingredientsNeeded, day.lunch.meal.getIngredients(day.lunch.macros), 1);
      mealsSelected++;
    } else if (day.lunch && day.lunch.meal) { mealsSelected++; }
    if (day.dinner && day.dinner.meal && day.dinner.meal.getIngredients) {
      aggregateIngredients(ingredientsNeeded, day.dinner.meal.getIngredients(day.dinner.macros), 1);
      mealsSelected++;
    } else if (day.dinner && day.dinner.meal) { mealsSelected++; }
    if (day.snack && day.snack.meal) {
      if (day.snack.meal.getIngredients) {
        aggregateIngredients(ingredientsNeeded, day.snack.meal.getIngredients(day.snack.macros), 1);
      }
      mealsSelected++;
    }
  });
  return { ingredientsNeeded, totalCost: 0, mealsSelected };
}

function groupItemsBySelectedStores(items) {
  const storeDisplayNames = {
    aldi: 'Aldi', walmart: 'Walmart', costco: 'Costco',
    traderjoes: "Trader Joe's", heb: 'HEB', target: 'Target',
    sams: "Sam's Club", kroger: 'Kroger', wholefood: 'Whole Foods',
    amazonfresh: 'Amazon Fresh', specialty: 'Specialty Store',
  };
  const storeEmojis = {
    aldi: '🥇', walmart: '🏪', costco: '🏬', traderjoes: '🛒',
    heb: '🌟', target: '🎯', sams: '📦', kroger: '🛍️',
    wholefood: '🥬', amazonfresh: '📦', specialty: '🌟',
  };
  const p = appProfile();
  if (!p || !p.selectedStores || p.selectedStores.length === 0) {
    const groups = {};
    items.forEach(item => {
      const store = item.bestStore || 'specialty';
      if (!groups[store]) {
        groups[store] = { name: storeDisplayNames[store] || store, emoji: storeEmojis[store] || '🏪', items: [], totalCost: 0 };
      }
      groups[store].items.push(item);
      groups[store].totalCost += parseFloat(item.cost) || 0;
    });
    Object.keys(groups).forEach(store => { groups[store].totalCost = groups[store].totalCost.toFixed(2); });
    return groups;
  }
  const groups = {};
  p.selectedStores.forEach(store => {
    groups[store] = { name: storeDisplayNames[store] || store, emoji: storeEmojis[store] || '🏪', items: [], totalCost: 0 };
  });
  items.forEach(item => {
    let assignedStore = p.selectedStores.includes(item.bestStore) ? item.bestStore
      : p.selectedStores.includes(item.altStore) ? item.altStore
      : p.selectedStores[0];
    groups[assignedStore].items.push(item);
    groups[assignedStore].totalCost += parseFloat(item.cost);
  });
  Object.keys(groups).forEach(store => { groups[store].totalCost = groups[store].totalCost.toFixed(2); });
  return groups;
}

export function generateShoppingList() {
  const { ingredientsNeeded, totalCost, mealsSelected } = calculateWeeklyIngredients();
  if (mealsSelected === 0) return { items: [], totalCost: 0, mealsSelected: 0, byStore: {} };

  const shoppingList = [];
  let calculatedCost = 0;

  const conversions = {
    'lb->lb': 1, 'oz->oz': 1, 'cup->cup': 1, 'tbsp->tbsp': 1, 'tsp->tsp': 1,
    'each->each': 1, 'can->can': 1, 'bottle->bottle': 1, 'jar->jar': 1,
    'bag->bag': 1, 'box->box': 1, 'package->package': 1, 'container->container': 1,
    'oz->lb': 16, 'lb->oz': 1/16,
    'tbsp->bottle': 32, 'tsp->bottle': 96, 'cup->bottle': 4,
    'tbsp->jar': 32, 'tsp->jar': 96, 'oz->jar': 10,
    'oz->can': 15, 'cup->can': 2,
    'cup->carton': 4, 'cup->bag': 8, 'oz->bag': 16,
    'cup->box': 8, 'oz->box': 16, 'cup->container': 4,
    'oz->package': 8, 'tbsp->package': 16, 'each->package': 10, 'slice->package': 10,
    'cup->lb': 2, 'tbsp->lb': 32,
    'each->dozen': 12, 'each->bunch': 6, 'each->bag': 4,
    'clove->bulb': 10, 'cloves->bulb': 10,
    'slice->loaf': 16, 'scoop->container': 30, 'cup->crown': 2,
    'oz->each': 6, 'oz->pint': 10, 'cup->pint': 2,
    'oz->bunch': 8, 'each->bunch_small': 1,
    'each->lb': 4, 'each->crown': 1, 'tbsp->container': 32,
    'tsp->container': 96, 'tbsp->set': 100, 'tsp->set': 300,
  };

  Object.entries(ingredientsNeeded).forEach(([dbKey, data]) => {
    const ingredient = ingredientDatabase[dbKey];
    if (!ingredient) return;
    const quantityNeeded = data.totalQty;
    const recipeUnit = data.unit;
    const dbUnit = ingredient.unit;
    const conversionKey = `${recipeUnit}->${dbUnit}`;
    const factor = conversions[conversionKey];
    let convertedQty = factor !== undefined
      ? quantityNeeded / factor
      : recipeUnit === dbUnit ? quantityNeeded : quantityNeeded / 10;

    const packagesToBuy = Math.max(1, Math.ceil(convertedQty));
    const weeklyCost = convertedQty >= 1
      ? packagesToBuy * ingredient.cost
      : Math.max(convertedQty, 0.1) * ingredient.cost;
    calculatedCost += weeklyCost;

    shoppingList.push({
      dbKey,
      name: ingredient.name,
      quantityNeeded: parseFloat(quantityNeeded.toFixed(2)),
      unit: recipeUnit,
      baseQty: ingredient.baseQty,
      packagesToBuy,
      packageUnit: dbUnit,
      cost: parseFloat(weeklyCost.toFixed(2)),
      fullPackageCost: parseFloat((packagesToBuy * ingredient.cost).toFixed(2)),
      category: ingredient.category,
      bestStore: ingredient.bestStore,
      altStore: ingredient.altStore,
    });
  });

  const categoryOrder = { protein: 1, produce: 2, grain: 3, canned: 4, sauce: 5, oil: 6, nuts: 7, staple: 8, supplement: 9 };
  shoppingList.sort((a, b) => (categoryOrder[a.category] || 9) - (categoryOrder[b.category] || 9));

  const fullPackageTotal = shoppingList.reduce((sum, it) => sum + (it.fullPackageCost || it.cost), 0);
  const byStore = groupItemsBySelectedStores(shoppingList);

  return {
    items: shoppingList,
    dinnerCost: parseFloat(calculatedCost.toFixed(2)),
    breakfastCost: 0,
    totalCost: parseFloat(calculatedCost.toFixed(2)),
    fullPackageTotal: parseFloat(fullPackageTotal.toFixed(2)),
    mealsSelected,
    byStore,
  };
}

export function analyzeStoreRecommendations(shoppingData) {
  if (!shoppingData || shoppingData.mealsSelected === 0) return null;
  const storePrices = {
    aldi: {
      name: 'Aldi', emoji: '🥇', color: '#e76f51',
      discountsByCategory: { protein: 0.30, produce: 0.25, canned: 0.35, grain: 0.15 },
      bestItems: { chicken_breast: 0.30, ground_turkey: 0.28, eggs: 0.27, ground_beef: 0.20,
        broccoli: 0.25, carrots: 0.30, onions: 0.20, bell_peppers: 0.20,
        chickpeas_canned: 0.40, black_beans: 0.30, white_beans: 0.35, pinto_beans: 0.35 },
    },
    walmart: {
      name: 'Walmart', emoji: '🥈', color: '#0891b2',
      discountsByCategory: { grain: 0.20, canned: 0.25, staple: 0.15 },
      bestItems: { brown_rice: 0.24, bread: 0.15, crushed_tomatoes: 0.30,
        tomatoes_canned: 0.30, lentils_dry: 0.29, oats: 0.15, pasta_chickpea: 0.10,
        chicken_broth: 0.15, vegetable_broth: 0.15 },
    },
    costco: {
      name: 'Costco', emoji: '🥉', color: '#95E1D3',
      discountsByCategory: { protein: 0.20, oil: 0.25 },
      bestItems: { eggs: 0.23, chicken_breast: 0.15, olive_oil: 0.20, peanut_butter: 0.25, nuts: 0.30 },
      requiresBulk: true, note: 'Best for bulk purchases - requires membership',
    },
  };
  const p = appProfile() || {};
  const recommendations = {
    currentTotal: parseFloat(shoppingData.totalCost),
    currentStore1: parseFloat(shoppingData.store1Total),
    currentStore2: parseFloat(shoppingData.store2Total),
    store1Name: p.store1Name || 'Store 1',
    store2Name: p.store2Name || 'Store 2',
    suggestions: [],
    categoryBreakdown: {},
  };
  const storeAnalysis = {
    aldi: { items: [], savings: 0, categories: {} },
    walmart: { items: [], savings: 0, categories: {} },
    costco: { items: [], savings: 0, categories: {} },
  };
  shoppingData.items.forEach(item => {
    const itemCost = parseFloat(item.cost);
    const ingredient = ingredientDatabase[item.dbKey];
    if (!ingredient) return;
    const category = ingredient.category;
    Object.keys(storePrices).forEach(storeKey => {
      const store = storePrices[storeKey];
      let discountRate = store.bestItems && store.bestItems[item.dbKey]
        ? store.bestItems[item.dbKey]
        : (store.discountsByCategory && store.discountsByCategory[category])
          ? store.discountsByCategory[category] : 0;
      if (discountRate > 0) {
        const potentialSavings = itemCost * discountRate;
        storeAnalysis[storeKey].savings += potentialSavings;
        storeAnalysis[storeKey].items.push({ name: item.name, dbKey: item.dbKey, savings: potentialSavings, discountRate, category });
        if (!storeAnalysis[storeKey].categories[category]) {
          storeAnalysis[storeKey].categories[category] = { items: 0, savings: 0 };
        }
        storeAnalysis[storeKey].categories[category].items++;
        storeAnalysis[storeKey].categories[category].savings += potentialSavings;
      }
    });
  });
  Object.keys(storeAnalysis).forEach((storeKey, index) => {
    const analysis = storeAnalysis[storeKey];
    const store = storePrices[storeKey];
    if (analysis.savings >= 2) {
      const topCategories = Object.entries(analysis.categories)
        .sort((a, b) => b[1].savings - a[1].savings).slice(0, 2)
        .map(([cat, data]) => `${cat} (${data.items} items)`);
      const topItems = analysis.items.sort((a, b) => b.savings - a.savings).slice(0, 4).map(i => i.name);
      recommendations.suggestions.push({
        store: store.name, emoji: store.emoji, color: store.color,
        itemCount: analysis.items.length, savings: analysis.savings.toFixed(2),
        savingsPercent: ((analysis.savings / recommendations.currentTotal) * 100).toFixed(0),
        topItems, topCategories, priority: index + 1, note: store.note,
      });
    }
  });
  const totalSavings = Object.values(storeAnalysis).reduce((sum, s) => sum + s.savings, 0);
  recommendations.totalPotentialSavings = totalSavings.toFixed(2);
  recommendations.percentSavings = ((totalSavings / recommendations.currentTotal) * 100).toFixed(0);
  recommendations.optimizedTotal = (recommendations.currentTotal - totalSavings).toFixed(2);
  recommendations.suggestions.sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings));
  return recommendations;
}
