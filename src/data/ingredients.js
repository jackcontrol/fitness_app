// Ingredient database + recipe→ingredient mapping.
// Extracted from index.html lines 8595-8727 (ingredientDatabase)
// and 8730-9814 (recipeIngredients).

export const ingredientDatabase = {
  // PROTEINS (Updated 4/17/2026 - Cross-referenced Walmart, Aldi, Costco)
  chicken_breast: { name: 'Chicken breast', unit: 'lb', baseQty: 4, cost: 11.16, category: 'protein', bestStore: 'aldi', altStore: 'costco' },
  ground_turkey: { name: 'Ground turkey', unit: 'lb', baseQty: 2, cost: 6.50, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  eggs: { name: 'Eggs', unit: 'dozen', baseQty: 2, cost: 5.98, category: 'protein', bestStore: 'aldi', altStore: 'costco' },
  greek_yogurt: { name: 'Greek yogurt (32oz)', unit: 'container', baseQty: 3, cost: 11.97, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  tuna_cans: { name: 'Canned tuna (5oz)', unit: 'can', baseQty: 5, cost: 7.95, category: 'protein', bestStore: 'walmart', altStore: 'aldi' },
  tofu_firm: { name: 'Firm tofu (14oz)', unit: 'package', baseQty: 2, cost: 5.98, category: 'protein', bestStore: 'walmart', altStore: 'specialty' },
  tempeh: { name: 'Tempeh (8oz)', unit: 'package', baseQty: 2, cost: 7.98, category: 'protein', bestStore: 'specialty', altStore: 'walmart' },
  edamame: { name: 'Frozen edamame (10oz)', unit: 'bag', baseQty: 2, cost: 5.98, category: 'protein', bestStore: 'walmart', altStore: 'aldi' },
  lentils_dry: { name: 'Dry lentils (16oz)', unit: 'bag', baseQty: 1, cost: 1.99, category: 'protein', bestStore: 'walmart', altStore: 'aldi' },
  chickpeas_canned: { name: 'Canned chickpeas (15oz)', unit: 'can', baseQty: 6, cost: 6.54, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  feta_cheese: { name: 'Feta cheese (8oz)', unit: 'package', baseQty: 1, cost: 4.50, category: 'protein', bestStore: 'aldi', altStore: 'specialty' },
  cheese_shredded: { name: 'Shredded cheese (8oz)', unit: 'bag', baseQty: 2, cost: 8.98, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  paneer: { name: 'Paneer (8oz)', unit: 'package', baseQty: 1, cost: 5.50, category: 'protein', bestStore: 'specialty', altStore: 'walmart' },
  seitan: { name: 'Seitan (8oz)', unit: 'package', baseQty: 1, cost: 6.49, category: 'protein', bestStore: 'specialty', altStore: 'walmart' },
  white_beans: { name: 'Cannellini beans', unit: 'can', baseQty: 4, cost: 4.36, category: 'canned', bestStore: 'aldi', altStore: 'walmart' },
  pinto_beans: { name: 'Pinto beans', unit: 'can', baseQty: 4, cost: 4.36, category: 'canned', bestStore: 'aldi', altStore: 'walmart' },
  mozzarella: { name: 'Mozzarella cheese', unit: 'package', baseQty: 1, cost: 4.49, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  beef_sirloin: { name: 'Beef sirloin', unit: 'lb', baseQty: 2, cost: 14.50, category: 'protein', bestStore: 'costco', altStore: 'walmart' },
  shrimp: { name: 'Shrimp (frozen)', unit: 'lb', baseQty: 1, cost: 9.99, category: 'protein', bestStore: 'costco', altStore: 'walmart' },
  ground_lamb: { name: 'Ground lamb', unit: 'lb', baseQty: 1, cost: 8.99, category: 'protein', bestStore: 'wholefood', altStore: 'target' },
  tuna_steak: { name: 'Tuna steak (6oz)', unit: 'package', baseQty: 1, cost: 12.99, category: 'protein', bestStore: 'wholefood', altStore: 'costco' },
  salmon: { name: 'Salmon fillet', unit: 'lb', baseQty: 1.5, cost: 12.99, category: 'protein', bestStore: 'costco', altStore: 'walmart' },
  tofu: { name: 'Firm tofu (14oz)', unit: 'package', baseQty: 1, cost: 2.49, category: 'protein', bestStore: 'walmart', altStore: 'aldi' },
  
  // GRAINS (Updated 4/17/2026)
  brown_rice: { name: 'Brown rice', unit: 'lb', baseQty: 2, cost: 2.10, category: 'grain', bestStore: 'walmart', altStore: 'costco' },
  lentil_pasta: { name: 'Red lentil pasta', unit: 'box', baseQty: 1, cost: 3.29, category: 'grain', bestStore: 'specialty', altStore: 'walmart' },
  whole_grain_bread: { name: 'Whole grain bread', unit: 'loaf', baseQty: 1, cost: 2.49, category: 'grain', bestStore: 'aldi', altStore: 'walmart' },
  bread: { name: 'Whole wheat bread', unit: 'loaf', baseQty: 1, cost: 3.29, category: 'grain', bestStore: 'walmart', altStore: 'aldi' },
  ezekiel_bread: { name: 'Ezekiel 4:9 Bread', unit: 'loaf', baseQty: 1, cost: 5.99, category: 'grain', bestStore: 'wholefood', altStore: 'target' },
  ezekiel_tortillas: { name: 'Ezekiel 4:9 Tortillas', unit: 'package', baseQty: 1, cost: 4.99, category: 'grain', bestStore: 'wholefood', altStore: 'target' },
  ezekiel_cereal: { name: 'Ezekiel 4:9 Cereal', unit: 'box', baseQty: 1, cost: 6.49, category: 'grain', bestStore: 'wholefood', altStore: 'target' },
  quinoa: { name: 'Quinoa', unit: 'lb', baseQty: 1, cost: 4.99, category: 'grain', bestStore: 'costco', altStore: 'walmart' },
  oats: { name: 'Rolled oats', unit: 'lb', baseQty: 1, cost: 3.29, category: 'grain', bestStore: 'walmart', altStore: 'costco' },
  sweet_potatoes: { name: 'Sweet potatoes', unit: 'lb', baseQty: 3, cost: 3.57, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  kefir: { name: 'Plain Kefir (32oz)', unit: 'bottle', baseQty: 1, cost: 4.99, category: 'protein', bestStore: 'wholefood', altStore: 'walmart' },
  
  // PRODUCE (Updated 4/17/2026)
  berries: { name: 'Fresh berries', unit: 'pint', baseQty: 2, cost: 8.98, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  bananas: { name: 'Bananas', unit: 'bunch', baseQty: 1, cost: 1.59, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  spinach: { name: 'Spinach', unit: 'bag', baseQty: 1, cost: 2.99, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  tomatoes: { name: 'Fresh tomatoes', unit: 'lb', baseQty: 2, cost: 3.98, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  cherry_tomatoes: { name: 'Cherry tomatoes', unit: 'pint', baseQty: 1, cost: 3.29, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  onions: { name: 'Onions', unit: 'bag', baseQty: 1, cost: 2.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  avocados: { name: 'Avocados', unit: 'each', baseQty: 4, cost: 5.96, category: 'produce', bestStore: 'walmart', altStore: 'aldi' },
  garlic: { name: 'Garlic', unit: 'bulb', baseQty: 2, cost: 1.00, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  bell_peppers: { name: 'Bell peppers', unit: 'each', baseQty: 3, cost: 5.97, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  broccoli: { name: 'Broccoli', unit: 'crown', baseQty: 2, cost: 3.50, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  frozen_veg: { name: 'Mixed frozen vegetables', unit: 'bag', baseQty: 2, cost: 4.56, category: 'produce', bestStore: 'walmart', altStore: 'costco' },
  green_beans: { name: 'Green beans', unit: 'lb', baseQty: 1, cost: 2.29, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  potatoes: { name: 'Potatoes', unit: 'lb', baseQty: 3, cost: 2.97, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  kale: { name: 'Fresh kale', unit: 'bunch', baseQty: 1, cost: 2.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  mushrooms: { name: 'White mushrooms', unit: 'lb', baseQty: 1, cost: 3.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  mixed_greens: { name: 'Mixed salad greens', unit: 'bag', baseQty: 1, cost: 3.79, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  snap_peas: { name: 'Snap peas', unit: 'bag', baseQty: 1, cost: 3.59, category: 'produce', bestStore: 'walmart', altStore: 'aldi' },
  carrots: { name: 'Carrots', unit: 'bag', baseQty: 1, cost: 1.99, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  cucumber: { name: 'Cucumber', unit: 'each', baseQty: 2, cost: 1.98, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  celery: { name: 'Celery', unit: 'bunch', baseQty: 1, cost: 2.29, category: 'produce', bestStore: 'walmart', altStore: 'aldi' },
  bok_choy: { name: 'Bok choy', unit: 'bunch', baseQty: 1, cost: 2.99, category: 'produce', bestStore: 'specialty', altStore: 'walmart' },
  red_onion: { name: 'Red onion', unit: 'each', baseQty: 2, cost: 1.50, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  zucchini: { name: 'Zucchini', unit: 'each', baseQty: 2, cost: 2.50, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  sweet_potato: { name: 'Sweet potatoes', unit: 'lb', baseQty: 2, cost: 1.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  lime: { name: 'Limes', unit: 'each', baseQty: 4, cost: 2.00, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  cilantro: { name: 'Fresh cilantro', unit: 'bunch', baseQty: 1, cost: 1.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  ginger: { name: 'Fresh ginger', unit: 'root', baseQty: 1, cost: 2.99, category: 'produce', bestStore: 'walmart', altStore: 'specialty' },
  green_onions: { name: 'Green onions', unit: 'bunch', baseQty: 1, cost: 1.49, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  mint: { name: 'Fresh mint', unit: 'bunch', baseQty: 1, cost: 1.99, category: 'produce', bestStore: 'specialty', altStore: 'walmart' },
  
  // CANNED/PANTRY (Updated 4/17/2026)
  black_beans: { name: 'Black beans', unit: 'can', baseQty: 7, cost: 7.63, category: 'canned', bestStore: 'aldi', altStore: 'walmart' },
  crushed_tomatoes: { name: 'Crushed tomatoes', unit: 'can', baseQty: 5, cost: 4.95, category: 'canned', bestStore: 'walmart', altStore: 'aldi' },
  red_lentils: { name: 'Red lentils', unit: 'lb', baseQty: 1, cost: 3.29, category: 'canned', bestStore: 'walmart', altStore: 'costco' },
  chicken_broth: { name: 'Chicken broth', unit: 'carton', baseQty: 3, cost: 5.97, category: 'canned', bestStore: 'walmart', altStore: 'aldi' },
  tomatoes_canned: { name: 'Diced tomatoes', unit: 'can', baseQty: 4, cost: 3.96, category: 'canned', bestStore: 'walmart', altStore: 'aldi' },
  pasta_chickpea: { name: 'Chickpea pasta', unit: 'box', baseQty: 1, cost: 3.49, category: 'grain', bestStore: 'specialty', altStore: 'walmart' },
  tortilla_whole_wheat: { name: 'Whole wheat tortillas', unit: 'package', baseQty: 1, cost: 3.49, category: 'grain', bestStore: 'walmart', altStore: 'aldi' },
  tortilla: { name: 'Flour tortillas', unit: 'package', baseQty: 1, cost: 3.29, category: 'grain', bestStore: 'walmart', altStore: 'aldi' },
  pasta: { name: 'Regular pasta', unit: 'box', baseQty: 1, cost: 1.29, category: 'grain', bestStore: 'walmart', altStore: 'aldi' },
  pita_bread: { name: 'Pita bread', unit: 'package', baseQty: 1, cost: 3.49, category: 'grain', bestStore: 'traderjoes', altStore: 'walmart' },
  soba_noodles: { name: 'Soba noodles', unit: 'package', baseQty: 1, cost: 4.29, category: 'grain', bestStore: 'specialty', altStore: 'walmart' },
  coconut_milk: { name: 'Light coconut milk', unit: 'can', baseQty: 2, cost: 4.58, category: 'canned', bestStore: 'walmart', altStore: 'specialty' },
  bamboo_shoots: { name: 'Bamboo shoots', unit: 'can', baseQty: 1, cost: 2.49, category: 'canned', bestStore: 'walmart', altStore: 'specialty' },
  dried_apricots: { name: 'Dried apricots', unit: 'bag', baseQty: 1, cost: 3.99, category: 'produce', bestStore: 'costco', altStore: 'walmart' },
  corn: { name: 'Corn (frozen or canned)', unit: 'bag/can', baseQty: 2, cost: 3.18, category: 'produce', bestStore: 'walmart', altStore: 'aldi' },
  vegetable_broth: { name: 'Vegetable broth', unit: 'carton', baseQty: 1, cost: 2.49, category: 'canned', bestStore: 'walmart', altStore: 'aldi' },
  
  // SAUCES/SEASONINGS (Updated 4/17/2026)
  bbq_sauce: { name: 'BBQ sauce', unit: 'bottle', baseQty: 1, cost: 3.29, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  salsa: { name: 'Fresh salsa', unit: 'container', baseQty: 2, cost: 6.58, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  garam_masala: { name: 'Garam masala', unit: 'jar', baseQty: 1, cost: 4.29, category: 'sauce', bestStore: 'specialty', altStore: 'walmart' },
  cumin: { name: 'Ground cumin', unit: 'jar', baseQty: 1, cost: 2.99, category: 'sauce', bestStore: 'walmart', altStore: 'costco' },
  paprika: { name: 'Paprika', unit: 'jar', baseQty: 1, cost: 2.49, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  coriander: { name: 'Ground coriander', unit: 'jar', baseQty: 1, cost: 2.99, category: 'sauce', bestStore: 'walmart', altStore: 'costco' },
  turmeric: { name: 'Ground turmeric', unit: 'jar', baseQty: 1, cost: 2.99, category: 'sauce', bestStore: 'walmart', altStore: 'costco' },
  soy_sauce: { name: 'Soy sauce', unit: 'bottle', baseQty: 1, cost: 2.99, category: 'sauce', bestStore: 'walmart', altStore: 'costco' },
  hot_sauce: { name: 'Hot sauce', unit: 'bottle', baseQty: 1, cost: 2.49, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  taco_seasoning: { name: 'Taco seasoning', unit: 'packet', baseQty: 2, cost: 2.18, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  enchilada_sauce: { name: 'Enchilada sauce', unit: 'can', baseQty: 2, cost: 4.58, category: 'sauce', bestStore: 'walmart', altStore: 'specialty' },
  red_curry_paste: { name: 'Red curry paste', unit: 'jar', baseQty: 1, cost: 4.49, category: 'sauce', bestStore: 'specialty', altStore: 'walmart' },
  fajita_seasoning: { name: 'Fajita seasoning', unit: 'packet', baseQty: 2, cost: 2.78, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  tikka_masala: { name: 'Tikka masala spice', unit: 'jar', baseQty: 1, cost: 4.29, category: 'sauce', bestStore: 'specialty', altStore: 'walmart' },
  tzatziki: { name: 'Tzatziki sauce', unit: 'container', baseQty: 1, cost: 4.49, category: 'sauce', bestStore: 'traderjoes', altStore: 'target' },
  teriyaki_sauce: { name: 'Teriyaki sauce', unit: 'bottle', baseQty: 1, cost: 3.99, category: 'sauce', bestStore: 'walmart', altStore: 'target' },
  chili_seasoning: { name: 'Chili seasoning', unit: 'packet', baseQty: 2, cost: 2.50, category: 'sauce', bestStore: 'walmart', altStore: 'target' },
  curry_powder: { name: 'Curry powder', unit: 'jar', baseQty: 1, cost: 3.99, category: 'sauce', bestStore: 'walmart', altStore: 'specialty' },
  italian_seasoning: { name: 'Italian seasoning', unit: 'jar', baseQty: 1, cost: 2.99, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  
  // OILS/NUTS (Updated 4/17/2026)
  peanut_butter: { name: 'Peanut butter', unit: 'jar', baseQty: 1, cost: 3.99, category: 'nuts', bestStore: 'costco', altStore: 'walmart' },
  peanuts: { name: 'Roasted peanuts', unit: 'bag', baseQty: 1, cost: 3.29, category: 'nuts', bestStore: 'costco', altStore: 'walmart' },
  olive_oil: { name: 'Olive oil', unit: 'bottle', baseQty: 1, cost: 8.99, category: 'oil', bestStore: 'costco', altStore: 'walmart' },
  butter: { name: 'Butter', unit: 'lb', baseQty: 1, cost: 4.49, category: 'oil', bestStore: 'aldi', altStore: 'walmart' },
  sesame_oil: { name: 'Sesame oil', unit: 'bottle', baseQty: 1, cost: 4.49, category: 'oil', bestStore: 'specialty', altStore: 'walmart' },
  tahini: { name: 'Tahini', unit: 'jar', baseQty: 1, cost: 5.99, category: 'nuts', bestStore: 'specialty', altStore: 'costco' },
  nutritional_yeast: { name: 'Nutritional yeast', unit: 'container', baseQty: 1, cost: 7.99, category: 'staple', bestStore: 'specialty', altStore: 'walmart' },
  olives: { name: 'Kalamata olives', unit: 'jar', baseQty: 1, cost: 4.29, category: 'produce', bestStore: 'specialty', altStore: 'walmart' },
  lemon_juice: { name: 'Lemon juice', unit: 'bottle', baseQty: 1, cost: 2.49, category: 'sauce', bestStore: 'walmart', altStore: 'aldi' },
  sesame_seeds: { name: 'Sesame seeds', unit: 'jar', baseQty: 1, cost: 3.99, category: 'nuts', bestStore: 'specialty', altStore: 'walmart' },
  parmesan: { name: 'Parmesan cheese', unit: 'package', baseQty: 1, cost: 5.99, category: 'protein', bestStore: 'costco', altStore: 'walmart' },
  cheese: { name: 'Shredded cheese', unit: 'bag', baseQty: 1, cost: 4.49, category: 'protein', bestStore: 'aldi', altStore: 'walmart' },
  feta: { name: 'Feta cheese (8oz)', unit: 'package', baseQty: 1, cost: 4.99, category: 'protein', bestStore: 'aldi', altStore: 'specialty' },
  avocado: { name: 'Avocado', unit: 'each', baseQty: 1, cost: 1.99, category: 'produce', bestStore: 'walmart', altStore: 'aldi' },
  tomato: { name: 'Fresh tomato', unit: 'lb', baseQty: 1, cost: 1.99, category: 'produce', bestStore: 'aldi', altStore: 'walmart' },
  
  // BREAKFAST ITEMS
  protein_powder: { name: 'Protein powder', unit: 'container', baseQty: 1, cost: 28.99, category: 'supplement', bestStore: 'costco', altStore: 'specialty' },
  
  // STAPLES (always needed)
  salt_pepper: { name: 'Salt & pepper', unit: 'set', baseQty: 1, cost: 2.99, category: 'staple', bestStore: 'walmart', altStore: 'aldi' },
  italian_seasoning: { name: 'Italian seasoning', unit: 'jar', baseQty: 1, cost: 3.29, category: 'staple', bestStore: 'walmart', altStore: 'costco' }
};

// RECIPE TO INGREDIENT MAPPING
export const recipeIngredients = {
  marinara: {
    name: 'Chicken Spaghetti Marinara',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,      // 40% of 4lb pack = 1.6 lbs
      lentil_pasta: 1,           // 1 full box
      crushed_tomatoes: 0.6,     // 3 cans
      onions: 0.3,               // 30% of bag
      garlic: 0.4,               // ~5 cloves
      olive_oil: 0.15,           // 15% of bottle
      italian_seasoning: 0.2     // 20% of jar
    },
    servings: 1,
    costPerServing: 4.20
  },
  creamy_tomato: {
    name: 'Creamy Tomato Pasta',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      lentil_pasta: 1,
      crushed_tomatoes: 0.6,
      greek_yogurt: 0.1,
      garlic: 0.3,
      olive_oil: 0.1,
      italian_seasoning: 0.15
    },
    servings: 1,
    costPerServing: 4.50
  },
  tomato_basil: {
    name: 'Tomato Basil Chicken',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      tomatoes: 0.25,
      garlic: 0.3,
      olive_oil: 0.1,
      brown_rice: 0.2,
      italian_seasoning: 0.1
    },
    servings: 1,
    costPerServing: 3.80
  },
  butter: {
    name: 'Butter Chicken',
    tier: 'premium',
    ingredients: {
      chicken_breast: 0.4,
      crushed_tomatoes: 0.2,
      greek_yogurt: 0.1,
      butter: 0.15,
      onions: 0.2,
      garlic: 0.5,
      garam_masala: 0.3,
      cumin: 0.2,
      coriander: 0.2,
      turmeric: 0.2,
      brown_rice: 0.25,
      coconut_milk: 0.2
    },
    servings: 1,
    costPerServing: 6.80
  },
  tikka: {
    name: 'Chicken Tikka Masala',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.4,
      greek_yogurt: 0.12,
      crushed_tomatoes: 0.2,
      onions: 0.2,
      garlic: 0.5,
      garam_masala: 0.25,
      cumin: 0.2,
      coriander: 0.2,
      turmeric: 0.2,
      olive_oil: 0.1,
      brown_rice: 0.25
    },
    servings: 1,
    costPerServing: 5.20
  },
  teriyaki_bowl: {
    name: 'Teriyaki Chicken Bowl',
    cuisine: 'asian',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      brown_rice: 0.3,
      broccoli: 0.5,
      bell_peppers: 0.33,
      onions: 0.2,
      garlic: 0.3,
      soy_sauce: 0.3,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 4.30
  },
  bbq_chicken_sweetpotato: {
    name: 'BBQ Chicken & Sweet Potato',
    cuisine: 'american',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      sweet_potatoes: 0.5,
      broccoli: 0.5,
      olive_oil: 0.1,
      onions: 0.1
    },
    servings: 1,
    costPerServing: 3.90
  },
  chicken_cacciatore: {
    name: 'Chicken Cacciatore',
    cuisine: 'italian',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      crushed_tomatoes: 0.2,
      bell_peppers: 0.67,
      onions: 0.3,
      garlic: 0.4,
      italian_seasoning: 0.2,
      olive_oil: 0.15,
      brown_rice: 0.25
    },
    servings: 1,
    costPerServing: 4.20
  },
  burrito: {
    name: 'Burrito Bowl',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.35,
      brown_rice: 0.3,
      black_beans: 0.3,
      bell_peppers: 0.33,
      onions: 0.2,
      tomatoes: 0.15,
      salsa: 0.25,
      avocados: 0.25,
      taco_seasoning: 0.5
    },
    servings: 1,
    costPerServing: 4.50,
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `${Math.round(dinner.carbs * 0.5 / 45 * 2 * 10) / 10} cup brown rice`,
      `1 cup black beans`,
      `1 bell pepper, diced`,
      `1/4 onion, diced`,
      `1 tomato, diced`,
      `1/4 cup salsa`,
      `1/2 avocado`,
      `Taco seasoning`
    ]
  },
  mexican_rice: {
    name: 'Mexican Chicken & Rice',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.35,
      brown_rice: 0.35,
      crushed_tomatoes: 0.2,
      chicken_broth: 0.5,
      onions: 0.2,
      bell_peppers: 0.33,
      garlic: 0.2,
      taco_seasoning: 0.5
    },
    servings: 1,
    costPerServing: 3.90
  },
  fajitas: {
    name: 'Chicken Fajitas',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      bell_peppers: 0.67,
      onions: 0.35,
      garlic: 0.2,
      olive_oil: 0.1,
      taco_seasoning: 0.5,
      salsa: 0.15
    },
    servings: 1,
    costPerServing: 4.80
  },
  lemon_garlic: {
    name: 'Lemon Garlic Chicken & Rice',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.4,
      brown_rice: 0.3,
      chicken_broth: 0.5,
      garlic: 0.6,
      olive_oil: 0.15,
      italian_seasoning: 0.15
    },
    servings: 1,
    costPerServing: 4.20
  },
  fried_rice: {
    name: 'Chicken Fried Rice',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.3,
      brown_rice: 0.3,
      eggs: 0.08,
      frozen_veg: 0.3,
      garlic: 0.2,
      soy_sauce: 0.2,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 3.40
  },
  lentil_stew: {
    name: 'Spicy Chicken & Lentil Stew',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.3,
      red_lentils: 0.5,
      crushed_tomatoes: 0.2,
      chicken_broth: 0.5,
      onions: 0.2,
      garlic: 0.3,
      cumin: 0.2,
      turmeric: 0.2,
      spinach: 0.5,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 3.60
  },
  chicken_noodle: {
    name: 'Classic Chicken Noodle Soup',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      lentil_pasta: 0.7,
      chicken_broth: 0.67,
      frozen_veg: 0.3,
      onions: 0.2,
      garlic: 0.2,
      olive_oil: 0.05
    },
    servings: 1,
    costPerServing: 3.80
  },
  turkey_chili: {
    name: 'Turkey Black Bean Chili',
    tier: 'budget',
    ingredients: {
      ground_turkey: 0.35,
      black_beans: 0.43,
      crushed_tomatoes: 0.2,
      bell_peppers: 0.33,
      onions: 0.2,
      garlic: 0.2,
      cumin: 0.2,
      brown_rice: 0.15,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 3.70
  },
  tuna_rice: {
    name: 'Tuna & Egg Rice Bowl',
    tier: 'budget',
    ingredients: {
      tuna_cans: 0.2,
      eggs: 0.08,
      brown_rice: 0.25,
      frozen_veg: 0.25,
      garlic: 0.2,
      soy_sauce: 0.15,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 2.90
  },
  greek_bowl: {
    name: 'Greek Chicken Quinoa Bowl',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.4,
      quinoa: 0.4,
      spinach: 0.5,
      tomatoes: 0.25,
      onions: 0.2,
      garlic: 0.3,
      olive_oil: 0.2,
      greek_yogurt: 0.06
    },
    servings: 1,
    costPerServing: 5.20
  },
  chicken_broccoli_stirfry: {
    name: 'Chicken & Broccoli Stir-Fry',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      broccoli: 0.75,
      bell_peppers: 0.33,
      onions: 0.2,
      garlic: 0.3,
      soy_sauce: 0.25,
      brown_rice: 0.25,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 4.10
  },
  turkey_meatballs: {
    name: 'Turkey Meatballs Marinara',
    tier: 'budget',
    ingredients: {
      ground_turkey: 0.4,
      lentil_pasta: 0.8,
      crushed_tomatoes: 0.2,
      eggs: 0.04,
      oats: 0.1,
      onions: 0.2,
      garlic: 0.3,
      olive_oil: 0.1,
      italian_seasoning: 0.15
    },
    servings: 1,
    costPerServing: 4.30
  },
  southwest_bowl: {
    name: 'Southwest Chicken Quinoa Bowl',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.35,
      quinoa: 0.35,
      black_beans: 0.29,
      bell_peppers: 0.33,
      onions: 0.2,
      tomatoes: 0.15,
      garlic: 0.2,
      cumin: 0.15,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 4.90
  },
  veggie_fried_rice: {
    name: 'Veggie & Egg Fried Rice',
    tier: 'budget',
    ingredients: {
      eggs: 0.125,
      brown_rice: 0.3,
      frozen_veg: 0.5,
      onions: 0.2,
      garlic: 0.3,
      soy_sauce: 0.25,
      olive_oil: 0.1,
      chicken_breast: 0.15
    },
    servings: 1,
    costPerServing: 3.20
  },
  chicken_spinach: {
    name: 'Chicken Spinach Garlic Pasta',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.35,
      lentil_pasta: 0.9,
      spinach: 1,
      crushed_tomatoes: 0.2,
      garlic: 0.5,
      olive_oil: 0.2,
      chicken_broth: 0.17,
      italian_seasoning: 0.15
    },
    servings: 1,
    costPerServing: 4.60
  },
  turkey_taco: {
    name: 'Turkey Taco Rice Bowl',
    tier: 'budget',
    ingredients: {
      ground_turkey: 0.35,
      brown_rice: 0.25,
      black_beans: 0.29,
      tomatoes: 0.15,
      bell_peppers: 0.33,
      onions: 0.2,
      garlic: 0.2,
      taco_seasoning: 0.5,
      greek_yogurt: 0.04,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 4.00
  },
  thai_basil_chicken: {
    name: 'Thai Basil Chicken',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      bell_peppers: 0.33,
      onions: 0.3,
      garlic: 0.5,
      soy_sauce: 0.25,
      hot_sauce: 0.2,
      olive_oil: 0.15,
      brown_rice: 0.25
    },
    servings: 1,
    costPerServing: 3.80
  },
  ginger_scallion_chicken: {
    name: 'Ginger Scallion Chicken',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      brown_rice: 0.3,
      garlic: 0.4,
      onions: 0.2,
      broccoli: 0.5,
      soy_sauce: 0.2,
      olive_oil: 0.1
    },
    servings: 1,
    costPerServing: 3.60
  },
  sesame_chicken: {
    name: 'Sesame Chicken Bowl',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.4,
      brown_rice: 0.3,
      broccoli: 0.5,
      bell_peppers: 0.33,
      garlic: 0.3,
      soy_sauce: 0.25,
      olive_oil: 0.15
    },
    servings: 1,
    costPerServing: 4.10
  },
  peanut_noodle_bowl: {
    name: 'Peanut Noodle Bowl',
    tier: 'budget',
    ingredients: {
      chicken_breast: 0.35,
      lentil_pasta: 0.8,
      peanut_butter: 0.15,
      soy_sauce: 0.25,
      bell_peppers: 0.33,
      broccoli: 0.4,
      garlic: 0.3,
      onions: 0.15
    },
    servings: 1,
    costPerServing: 4.40
  },
  
  // VEGETARIAN RECIPES (Eggs/Dairy Allowed)
  veggie_power_bowl: {
    name: 'Veggie Power Bowl',
    tier: 'budget',
    ingredients: {
      quinoa: 0.6,
      chickpeas_canned: 0.5,
      mixed_greens: 0.4,
      cherry_tomatoes: 0.35,
      cucumber: 0.25,
      feta_cheese: 0.3,
      olive_oil: 0.2,
      lemon_juice: 0.15,
      tahini: 0.3
    },
    servings: 1,
    costPerServing: 3.80
  },
  spinach_mushroom_frittata: {
    name: 'Spinach Mushroom Frittata',
    tier: 'budget',
    ingredients: {
      eggs: 0.8,
      spinach: 0.4,
      mushrooms: 0.5,
      cheese_shredded: 0.35,
      onions: 0.2,
      olive_oil: 0.2,
      garlic: 0.25,
      cherry_tomatoes: 0.25
    },
    servings: 1,
    costPerServing: 4.20
  },
  lentil_dal_yogurt: {
    name: 'Lentil Dal with Greek Yogurt',
    tier: 'budget',
    ingredients: {
      lentils_dry: 0.5,
      greek_yogurt: 0.4,
      tomatoes: 0.3,
      onions: 0.2,
      garlic: 0.3,
      ginger: 0.15,
      curry_powder: 0.3,
      coconut_milk: 0.45,
      spinach: 0.35
    },
    servings: 1,
    costPerServing: 3.60
  },
  black_bean_quesadillas: {
    name: 'Black Bean & Cheese Quesadillas',
    tier: 'budget',
    ingredients: {
      black_beans: 0.45,
      tortilla_whole_wheat: 0.6,
      cheese_shredded: 0.5,
      bell_peppers: 0.35,
      onions: 0.2,
      greek_yogurt: 0.25,
      salsa: 0.3,
      corn: 0.25
    },
    servings: 1,
    costPerServing: 4.50
  },
  chickpea_pasta_mediterranean: {
    name: 'Mediterranean Chickpea Pasta',
    tier: 'premium',
    ingredients: {
      pasta_chickpea: 0.95,
      chickpeas_canned: 0.5,
      cherry_tomatoes: 0.4,
      spinach: 0.35,
      feta_cheese: 0.35,
      olives: 0.45,
      olive_oil: 0.25,
      garlic: 0.3,
      lemon_juice: 0.15
    },
    servings: 1,
    costPerServing: 5.20
  },
  greek_lentil_bowl: {
    name: 'Greek Lentil Bowl with Feta',
    tier: 'budget',
    ingredients: {
      lentils_dry: 0.5,
      quinoa: 0.5,
      cucumber: 0.25,
      cherry_tomatoes: 0.35,
      red_onion: 0.2,
      feta_cheese: 0.35,
      olive_oil: 0.25,
      lemon_juice: 0.15,
      mixed_greens: 0.35
    },
    servings: 1,
    costPerServing: 4.00
  },
  egg_white_veggie_wrap: {
    name: 'Egg White Veggie Wrap',
    tier: 'budget',
    ingredients: {
      eggs: 0.6,
      tortilla_whole_wheat: 0.5,
      spinach: 0.3,
      bell_peppers: 0.3,
      mushrooms: 0.35,
      cheese_shredded: 0.25,
      onions: 0.15,
      salsa: 0.25
    },
    servings: 1,
    costPerServing: 3.90
  },
  caprese_quinoa_bake: {
    name: 'Caprese Quinoa Bake',
    tier: 'premium',
    ingredients: {
      quinoa: 0.6,
      cherry_tomatoes: 0.45,
      mozzarella: 0.65,
      spinach: 0.35,
      eggs: 0.4,
      basil: 0.3,
      olive_oil: 0.25,
      garlic: 0.25
    },
    servings: 1,
    costPerServing: 4.80
  },
  spicy_bean_enchiladas: {
    name: 'Spicy Bean Enchiladas',
    tier: 'budget',
    ingredients: {
      black_beans: 0.45,
      pinto_beans: 0.4,
      tortilla_whole_wheat: 0.6,
      cheese_shredded: 0.45,
      enchilada_sauce: 0.55,
      onions: 0.2,
      bell_peppers: 0.3,
      greek_yogurt: 0.25
    },
    servings: 1,
    costPerServing: 4.20
  },
  paneer_tikka_bowl: {
    name: 'Paneer Tikka Bowl',
    tier: 'premium',
    ingredients: {
      paneer: 1.2,
      brown_rice: 0.35,
      bell_peppers: 0.35,
      onions: 0.25,
      tikka_masala: 0.65,
      greek_yogurt: 0.35,
      spinach: 0.3,
      garlic: 0.3
    },
    servings: 1,
    costPerServing: 5.10
  },
  
  // VEGAN RECIPES (100% Plant-Based)
  lentil_sweet_potato_buddha: {
    name: 'Lentil & Sweet Potato Buddha Bowl',
    tier: 'budget',
    ingredients: {
      lentils_dry: 0.5,
      sweet_potato: 0.55,
      kale: 0.35,
      quinoa: 0.5,
      chickpeas_canned: 0.35,
      tahini: 0.35,
      lemon_juice: 0.15,
      olive_oil: 0.2
    },
    servings: 1,
    costPerServing: 3.80
  },
  tofu_scramble_black_beans: {
    name: 'Tofu Scramble with Black Beans',
    tier: 'budget',
    ingredients: {
      tofu_firm: 0.85,
      black_beans: 0.45,
      bell_peppers: 0.35,
      spinach: 0.3,
      onions: 0.2,
      nutritional_yeast: 0.3,
      turmeric: 0.2,
      whole_wheat_bread: 0.35
    },
    servings: 1,
    costPerServing: 4.10
  },
  tempeh_stirfry: {
    name: 'Tempeh Stir-Fry Bowl',
    tier: 'premium',
    ingredients: {
      tempeh: 1.2,
      brown_rice: 0.35,
      broccoli: 0.45,
      bell_peppers: 0.35,
      snap_peas: 0.45,
      carrots: 0.25,
      soy_sauce: 0.25,
      sesame_oil: 0.3,
      garlic: 0.3
    },
    servings: 1,
    costPerServing: 4.90
  },
  chickpea_curry_quinoa: {
    name: 'Chickpea Curry with Quinoa',
    tier: 'budget',
    ingredients: {
      chickpeas_canned: 0.6,
      quinoa: 0.5,
      coconut_milk: 0.6,
      tomatoes: 0.35,
      spinach: 0.3,
      onions: 0.2,
      curry_powder: 0.3,
      garlic: 0.3,
      ginger: 0.15
    },
    servings: 1,
    costPerServing: 4.20
  },
  peanut_tofu_rice: {
    name: 'Peanut Tofu Rice Bowl',
    tier: 'premium',
    ingredients: {
      tofu_firm: 0.9,
      brown_rice: 0.35,
      broccoli: 0.45,
      peanut_butter: 0.25,
      soy_sauce: 0.25,
      bell_peppers: 0.35,
      carrots: 0.25,
      garlic: 0.3,
      ginger: 0.15
    },
    servings: 1,
    costPerServing: 5.50
  },
  seitan_fajita_bowl: {
    name: 'Seitan Fajita Bowl',
    tier: 'premium',
    ingredients: {
      seitan: 1.5,
      brown_rice: 0.35,
      bell_peppers: 0.45,
      onions: 0.25,
      black_beans: 0.35,
      fajita_seasoning: 0.35,
      salsa: 0.3,
      lime: 0.15
    },
    servings: 1,
    costPerServing: 5.20
  },
  thai_red_curry_tofu: {
    name: 'Thai Red Curry Tofu',
    tier: 'premium',
    ingredients: {
      tofu_firm: 0.9,
      coconut_milk: 0.65,
      bell_peppers: 0.35,
      bamboo_shoots: 0.45,
      red_curry_paste: 0.5,
      brown_rice: 0.35,
      snap_peas: 0.4,
      basil: 0.25
    },
    servings: 1,
    costPerServing: 4.60
  },
  white_bean_tuscan_stew: {
    name: 'White Bean Tuscan Stew',
    tier: 'budget',
    ingredients: {
      white_beans: 0.5,
      kale: 0.35,
      tomatoes: 0.35,
      carrots: 0.25,
      celery: 0.2,
      onions: 0.2,
      garlic: 0.3,
      olive_oil: 0.2,
      vegetable_broth: 0.3
    },
    servings: 1,
    costPerServing: 3.70
  },
  moroccan_chickpea_tagine: {
    name: 'Moroccan Chickpea Tagine',
    tier: 'budget',
    ingredients: {
      chickpeas_canned: 0.6,
      sweet_potato: 0.5,
      tomatoes: 0.35,
      dried_apricots: 0.4,
      onions: 0.2,
      garlic: 0.3,
      curry_powder: 0.3,
      quinoa: 0.45
    },
    servings: 1,
    costPerServing: 4.10
  },
  asian_edamame_noodle: {
    name: 'Asian Edamame Noodle Bowl',
    tier: 'premium',
    ingredients: {
      soba_noodles: 0.85,
      edamame: 0.75,
      bok_choy: 0.45,
      carrots: 0.25,
      bell_peppers: 0.35,
      soy_sauce: 0.25,
      sesame_oil: 0.3,
      garlic: 0.3,
      ginger: 0.15
    },
    servings: 1,
    costPerServing: 4.90
  },
  
  // NEW BUDGET TIER RECIPES ($3.00-$4.00)
  chickpea_curry_bowl: {
    name: 'Chickpea Curry Bowl',
    tier: 'budget',
    ingredients: {
      chickpeas_canned: 0.33,  // 2 cans @ $1.09 = $2.18
      sweet_potato: 0.5,        // 1 lb @ $1.49 = $0.75
      spinach: 0.3,             // 30% @ $2.49 = $0.75
      coconut_milk: 0.5,        // 1 can @ $2.29 = $1.15
      curry_powder: 0.2,        // 20% @ $3.99 = $0.80
      onions: 0.2,              // 20% @ $0.89 = $0.18
      brown_rice: 0.3           // 30% @ $2.10 = $0.63
    },
    servings: 1,
    costPerServing: 3.20
  },
  
  black_bean_burrito_bowl: {
    name: 'Black Bean Burrito Bowl',
    tier: 'budget',
    ingredients: {
      black_beans: 0.43,        // 3 cans @ $1.09 = $3.27
      brown_rice: 0.35,         // 35% @ $2.10 = $0.74
      corn: 0.4,                // 40% @ $1.29 = $0.52
      salsa: 0.3,               // 30% @ $2.99 = $0.90
      avocado: 0.5,             // half @ $1.99 = $1.00
      cheese: 0.15,             // 15% @ $4.49 = $0.67
      lime: 0.25                // 1 lime @ $0.50 = $0.13
    },
    servings: 1,
    costPerServing: 3.40
  },
  
  lentil_vegetable_soup: {
    name: 'Hearty Lentil Soup',
    tier: 'budget',
    ingredients: {
      lentils_dry: 0.4,         // 40% @ $1.99 = $0.80
      carrots: 0.3,             // 30% @ $1.79 = $0.54
      celery: 0.25,             // 25% @ $1.99 = $0.50
      onions: 0.25,             // 25% @ $0.89 = $0.22
      tomatoes_canned: 0.2,     // 1 can @ $0.99 = $0.99
      vegetable_broth: 0.33,    // 33% @ $2.49 = $0.83
      spinach: 0.2              // 20% @ $2.49 = $0.50
    },
    servings: 1,
    costPerServing: 3.10
  },
  
  egg_fried_rice: {
    name: 'Egg Fried Rice',
    tier: 'budget',
    ingredients: {
      brown_rice: 0.4,          // 40% @ $2.10 = $0.84
      eggs: 0.25,               // 3 eggs @ $2.99 = $0.75
      frozen_veg: 0.4,          // 40% @ $2.49 = $1.00
      soy_sauce: 0.25,          // 25% @ $2.99 = $0.75
      sesame_oil: 0.2,          // 20% @ $5.99 = $1.20
      green_onions: 0.2         // 20% @ $1.49 = $0.30
    },
    servings: 1,
    costPerServing: 3.50
  },
  
  tofu_scramble_wrap: {
    name: 'Tofu Scramble Breakfast Wrap',
    tier: 'budget',
    ingredients: {
      tofu: 0.5,                // 50% @ $2.49 = $1.25
      tortilla: 0.33,           // 2 tortillas @ $3.29 = $1.10
      spinach: 0.25,            // 25% @ $2.49 = $0.62
      bell_peppers: 0.25,       // 25% @ $1.99 = $0.50
      onions: 0.15,             // 15% @ $0.89 = $0.13
      nutritional_yeast: 0.15,  // 15% @ $7.99 = $1.20
      salsa: 0.2                // 20% @ $2.99 = $0.60
    },
    servings: 1,
    costPerServing: 3.60
  },
  
  // NEW STANDARD TIER RECIPES ($4.00-$4.80)
  turkey_chili: {
    name: 'Turkey Chili Bowl',
    tier: 'medium',
    ingredients: {
      ground_turkey: 0.4,       // 40% @ $6.50 = $2.60
      black_beans: 0.29,        // 2 cans @ $1.09 = $2.18
      pinto_beans: 0.17,        // 1 can @ $1.09 = $1.09
      tomatoes_canned: 0.2,     // 1 can @ $0.99 = $0.99
      onions: 0.2,              // 20% @ $0.89 = $0.18
      bell_peppers: 0.2,        // 20% @ $1.99 = $0.40
      chili_seasoning: 0.3      // 30% @ $2.99 = $0.90
    },
    servings: 1,
    costPerServing: 4.20
  },
  
  chicken_fajita_bowl: {
    name: 'Chicken Fajita Bowl',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.35,     // 35% @ $11.16 = $3.91
      bell_peppers: 0.35,       // 35% @ $1.99 = $0.70
      onions: 0.25,             // 25% @ $0.89 = $0.22
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      fajita_seasoning: 0.3,    // 30% @ $2.99 = $0.90
      salsa: 0.2,               // 20% @ $2.99 = $0.60
      avocado: 0.5              // half @ $1.99 = $1.00
    },
    servings: 1,
    costPerServing: 4.40
  },
  
  greek_chicken_pita: {
    name: 'Greek Chicken Pita',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.35,     // 35% @ $11.16 = $3.91
      pita_bread: 0.5,          // 50% @ $3.49 = $1.75
      cucumber: 0.3,            // 30% @ $1.49 = $0.45
      tomato: 0.25,             // 25% @ $1.99 = $0.50
      red_onion: 0.2,           // 20% @ $0.99 = $0.20
      feta: 0.25,               // 25% @ $4.99 = $1.25
      tzatziki: 0.3             // 30% @ $4.49 = $1.35
    },
    servings: 1,
    costPerServing: 4.30,
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `2 pita breads`,
      `1/2 cucumber, diced`,
      `1 tomato, diced`,
      `1/4 red onion, sliced`,
      `1/4 cup feta cheese`,
      `1/4 cup tzatziki sauce`,
      `Lettuce, fresh herbs`
    ]
  },
  
  salmon_teriyaki_bowl: {
    name: 'Salmon Teriyaki Bowl',
    tier: 'medium',
    ingredients: {
      salmon: 0.5,              // 50% @ $12.99 = $6.50
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      broccoli: 0.4,            // 40% @ $2.49 = $1.00
      carrots: 0.25,            // 25% @ $1.79 = $0.45
      teriyaki_sauce: 0.25,     // 25% @ $3.99 = $1.00
      sesame_seeds: 0.1         // 10% @ $3.99 = $0.40
    },
    servings: 1,
    costPerServing: 4.70
  },
  
  bbq_chicken_quesadilla: {
    name: 'BBQ Chicken Quesadilla',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.35,     // 35% @ $11.16 = $3.91
      tortilla: 0.33,           // 2 tortillas @ $3.29 = $1.10
      cheese: 0.25,             // 25% @ $4.49 = $1.12
      bbq_sauce: 0.25,          // 25% @ $2.99 = $0.75
      red_onion: 0.15,          // 15% @ $0.99 = $0.15
      cilantro: 0.1             // 10% @ $1.49 = $0.15
    },
    servings: 1,
    costPerServing: 4.50
  },
  
  // NEW PREMIUM TIER RECIPES ($4.80-$5.50)
  beef_stir_fry: {
    name: 'Beef & Vegetable Stir-Fry',
    tier: 'premium',
    ingredients: {
      beef_sirloin: 0.5,        // 50% @ $14.50 = $7.25
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      broccoli: 0.4,            // 40% @ $2.49 = $1.00
      bell_peppers: 0.3,        // 30% @ $1.99 = $0.60
      snap_peas: 0.3,           // 30% @ $3.49 = $1.05
      soy_sauce: 0.2,           // 20% @ $2.99 = $0.60
      ginger: 0.2,              // 20% @ $2.99 = $0.60
      garlic: 0.3               // 30% @ $1.99 = $0.60
    },
    servings: 1,
    costPerServing: 5.20
  },
  
  shrimp_pasta_primavera: {
    name: 'Shrimp Pasta Primavera',
    tier: 'premium',
    ingredients: {
      shrimp: 0.6,              // 60% @ $9.99 = $6.00
      pasta: 0.5,               // 50% @ $1.29 = $0.65
      cherry_tomatoes: 0.4,     // 40% @ $2.99 = $1.20
      zucchini: 0.5,            // 1 zucchini @ $1.25 = $1.25
      bell_peppers: 0.25,       // 25% @ $1.99 = $0.50
      garlic: 0.3,              // 30% @ $1.99 = $0.60
      olive_oil: 0.15,          // 15% @ $8.99 = $1.35
      parmesan: 0.2             // 20% @ $5.99 = $1.20
    },
    servings: 1,
    costPerServing: 5.40
  },
  
  steak_burrito_bowl: {
    name: 'Steak Burrito Bowl',
    tier: 'premium',
    ingredients: {
      beef_sirloin: 0.5,        // 50% @ $14.50 = $7.25
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      black_beans: 0.2,         // 1 can @ $1.09 = $1.09
      corn: 0.3,                // 30% @ $1.29 = $0.39
      salsa: 0.25,              // 25% @ $2.99 = $0.75
      cheese: 0.2,              // 20% @ $4.49 = $0.90
      avocado: 0.5,             // half @ $1.99 = $1.00
      lime: 0.25                // 1 lime @ $0.50 = $0.13
    },
    servings: 1,
    costPerServing: 5.30
  },
  
  lamb_kofta_bowl: {
    name: 'Lamb Kofta Bowl',
    tier: 'premium',
    ingredients: {
      ground_lamb: 0.67,        // 67% @ $8.99 = $6.00
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      cucumber: 0.3,            // 30% @ $1.49 = $0.45
      tomato: 0.25,             // 25% @ $1.99 = $0.50
      red_onion: 0.2,           // 20% @ $0.99 = $0.20
      feta: 0.25,               // 25% @ $4.99 = $1.25
      tzatziki: 0.3,            // 30% @ $4.49 = $1.35
      mint: 0.1                 // 10% @ $1.99 = $0.20
    },
    servings: 1,
    costPerServing: 5.50
  },
  
  tuna_poke_bowl: {
    name: 'Seared Tuna Poke Bowl',
    tier: 'premium',
    ingredients: {
      tuna_steak: 1.0,          // 100% @ $12.99 = $12.99 (6oz)
      brown_rice: 0.3,          // 30% @ $2.10 = $0.63
      edamame: 0.5,             // 50% @ $2.99 = $1.50
      cucumber: 0.25,           // 25% @ $1.49 = $0.37
      avocado: 0.5,             // half @ $1.99 = $1.00
      soy_sauce: 0.2,           // 20% @ $2.99 = $0.60
      sesame_oil: 0.2,          // 20% @ $5.99 = $1.20
      sesame_seeds: 0.1         // 10% @ $3.99 = $0.40
    },
    servings: 1,
    costPerServing: 5.45
  },
  massaman_curry: {
    name: 'Massaman Curry',
    tier: 'medium',
    ingredients: {
      chicken_breast: 0.4,           // 40% of 4lb pack = $4.46
      potatoes: 0.33,                // 1 lb @ $2.97/3lb = $0.99
      coconut_milk: 0.5,             // 1 can @ $4.58/2 = $2.29
      red_curry_paste: 0.3,          // 30% jar @ $4.49 = $1.35
      peanuts: 0.2,                  // 20% bag @ $3.29 = $0.66
      onions: 0.25,                  // 25% @ $1.99 = $0.50
      brown_rice: 0.25,              // 25% @ $2.10 = $0.53
      soy_sauce: 0.1                 // 10% @ $2.99 = $0.30
    },
    servings: 1,
    costPerServing: 5.50
  },
  shakshuka: {
    name: 'Shakshuka',
    tier: 'budget',
    ingredients: {
      eggs: 0.33,                    // 4 eggs @ $5.98/dozen = $1.99
      crushed_tomatoes: 0.4,         // 2 cans @ $3.78/5 = $1.51
      bell_peppers: 0.33,            // 1 pepper @ $5.97/3 = $1.99
      onions: 0.5,                   // half @ $1.99/bag = $1.00
      garlic: 0.3,                   // 3 cloves @ $1.99 = $0.60
      cumin: 0.15,                   // 15% jar @ $2.99 = $0.45
      paprika: 0.15,                 // 15% jar @ $2.49 = $0.37
      olive_oil: 0.1,                // 10% @ $5.99 = $0.60
      whole_grain_bread: 0.25        // 25% loaf @ $2.49 = $0.62
    },
    servings: 1,
    costPerServing: 4.15
  }
};
