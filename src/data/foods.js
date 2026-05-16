// Food database — quick-add foods for daily logging (proteins, carbs, snacks, restaurant).
// Extracted from index.html lines 5774-5898.

export const foodDatabase = {
  // PROTEINS
  chicken_breast_cooked: { name: 'Chicken Breast (cooked)', category: 'protein', servings: ['4 oz', '6 oz', '8 oz'], baseServing: '4 oz', calories: 187, protein: 35, carbs: 0, fat: 4 },
  chicken_thigh_cooked: { name: 'Chicken Thigh (cooked)', category: 'protein', servings: ['4 oz', '6 oz'], baseServing: '4 oz', calories: 232, protein: 28, carbs: 0, fat: 13 },
  ground_beef_90: { name: 'Ground Beef 90/10 (cooked)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 200, protein: 24, carbs: 0, fat: 11 },
  ground_beef_80: { name: 'Ground Beef 80/20 (cooked)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 287, protein: 23, carbs: 0, fat: 21 },
  ground_turkey_lean: { name: 'Ground Turkey 93/7 (cooked)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 160, protein: 22, carbs: 0, fat: 8 },
  salmon_cooked: { name: 'Salmon (cooked)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 233, protein: 25, carbs: 0, fat: 14 },
  tuna_canned_water: { name: 'Tuna in Water (canned)', category: 'protein', servings: ['2 oz', '3 oz', '5 oz can'], baseServing: '3 oz', calories: 73, protein: 16, carbs: 0, fat: 0.5 },
  eggs_large: { name: 'Egg (large)', category: 'protein', servings: ['1 egg', '2 eggs', '3 eggs'], baseServing: '1 egg', calories: 72, protein: 6, carbs: 0.5, fat: 5 },
  egg_whites: { name: 'Egg Whites', category: 'protein', servings: ['1/4 cup', '1/2 cup', '1 cup'], baseServing: '1/4 cup', calories: 30, protein: 6, carbs: 0, fat: 0 },
  greek_yogurt_nonfat: { name: 'Greek Yogurt (nonfat)', category: 'protein', servings: ['1/2 cup', '1 cup', '2 cups'], baseServing: '1 cup', calories: 100, protein: 17, carbs: 7, fat: 0 },
  greek_yogurt_2percent: { name: 'Greek Yogurt (2%)', category: 'protein', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 150, protein: 20, carbs: 8, fat: 4 },
  cottage_cheese_lowfat: { name: 'Cottage Cheese (lowfat)', category: 'protein', servings: ['1/2 cup', '1 cup'], baseServing: '1/2 cup', calories: 81, protein: 14, carbs: 3, fat: 1 },
  tofu_firm: { name: 'Tofu (firm)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 94, protein: 10, carbs: 2, fat: 5 },
  shrimp_cooked: { name: 'Shrimp (cooked)', category: 'protein', servings: ['3 oz', '4 oz', '6 oz'], baseServing: '4 oz', calories: 112, protein: 24, carbs: 0, fat: 1 },
  steak_sirloin: { name: 'Sirloin Steak (cooked)', category: 'protein', servings: ['4 oz', '6 oz', '8 oz'], baseServing: '6 oz', calories: 280, protein: 42, carbs: 0, fat: 11 },
  pork_chop: { name: 'Pork Chop (cooked)', category: 'protein', servings: ['4 oz', '6 oz'], baseServing: '4 oz', calories: 190, protein: 26, carbs: 0, fat: 9 },
  bacon: { name: 'Bacon (cooked)', category: 'protein', servings: ['2 slices', '3 slices', '4 slices'], baseServing: '2 slices', calories: 86, protein: 6, carbs: 0, fat: 7 },
  deli_turkey: { name: 'Deli Turkey Breast', category: 'protein', servings: ['2 oz', '4 oz'], baseServing: '2 oz', calories: 56, protein: 11, carbs: 2, fat: 0.5 },
  deli_ham: { name: 'Deli Ham', category: 'protein', servings: ['2 oz', '4 oz'], baseServing: '2 oz', calories: 60, protein: 10, carbs: 1, fat: 2 },
  
  // CARBS - GRAINS
  white_rice_cooked: { name: 'White Rice (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup', '2 cups'], baseServing: '1 cup', calories: 205, protein: 4, carbs: 45, fat: 0.5 },
  brown_rice_cooked: { name: 'Brown Rice (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup', '2 cups'], baseServing: '1 cup', calories: 218, protein: 5, carbs: 46, fat: 2 },
  quinoa_cooked: { name: 'Quinoa (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 222, protein: 8, carbs: 39, fat: 4 },
  pasta_cooked: { name: 'Pasta (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup', '2 cups'], baseServing: '1 cup', calories: 221, protein: 8, carbs: 43, fat: 1 },
  whole_wheat_pasta: { name: 'Whole Wheat Pasta (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 174, protein: 7, carbs: 37, fat: 1 },
  oatmeal_cooked: { name: 'Oatmeal (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 166, protein: 6, carbs: 28, fat: 4 },
  bread_white: { name: 'White Bread', category: 'carbs', servings: ['1 slice', '2 slices'], baseServing: '1 slice', calories: 79, protein: 2, carbs: 15, fat: 1 },
  bread_wheat: { name: 'Whole Wheat Bread', category: 'carbs', servings: ['1 slice', '2 slices'], baseServing: '1 slice', calories: 81, protein: 4, carbs: 14, fat: 1 },
  english_muffin: { name: 'English Muffin', category: 'carbs', servings: ['1 muffin'], baseServing: '1 muffin', calories: 134, protein: 5, carbs: 26, fat: 1 },
  bagel: { name: 'Bagel (plain)', category: 'carbs', servings: ['1/2 bagel', '1 bagel'], baseServing: '1 bagel', calories: 289, protein: 11, carbs: 56, fat: 2 },
  tortilla_flour: { name: 'Flour Tortilla (8")', category: 'carbs', servings: ['1 tortilla', '2 tortillas'], baseServing: '1 tortilla', calories: 146, protein: 4, carbs: 25, fat: 3 },
  tortilla_corn: { name: 'Corn Tortilla (6")', category: 'carbs', servings: ['1 tortilla', '2 tortillas'], baseServing: '1 tortilla', calories: 52, protein: 1, carbs: 11, fat: 1 },
  
  // CARBS - POTATOES & STARCHY VEG
  sweet_potato_baked: { name: 'Sweet Potato (baked)', category: 'carbs', servings: ['1 small', '1 medium', '1 large'], baseServing: '1 medium', calories: 103, protein: 2, carbs: 24, fat: 0 },
  potato_baked: { name: 'Baked Potato', category: 'carbs', servings: ['1 small', '1 medium', '1 large'], baseServing: '1 medium', calories: 161, protein: 4, carbs: 37, fat: 0 },
  potato_mashed: { name: 'Mashed Potatoes', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 237, protein: 4, carbs: 36, fat: 9 },
  corn_cooked: { name: 'Corn (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1/2 cup', calories: 88, protein: 3, carbs: 19, fat: 1 },
  
  // VEGETABLES
  broccoli_cooked: { name: 'Broccoli (cooked)', category: 'vegetable', servings: ['1/2 cup', '1 cup', '2 cups'], baseServing: '1 cup', calories: 55, protein: 4, carbs: 11, fat: 0.5 },
  spinach_cooked: { name: 'Spinach (cooked)', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 41, protein: 5, carbs: 7, fat: 0.5 },
  spinach_raw: { name: 'Spinach (raw)', category: 'vegetable', servings: ['1 cup', '2 cups'], baseServing: '1 cup', calories: 7, protein: 1, carbs: 1, fat: 0 },
  carrots_raw: { name: 'Carrots (raw)', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 52, protein: 1, carbs: 12, fat: 0 },
  bell_pepper: { name: 'Bell Pepper', category: 'vegetable', servings: ['1/2 pepper', '1 pepper'], baseServing: '1 pepper', calories: 37, protein: 1, carbs: 9, fat: 0 },
  cucumber: { name: 'Cucumber', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 16, protein: 1, carbs: 4, fat: 0 },
  tomato: { name: 'Tomato', category: 'vegetable', servings: ['1 small', '1 medium', '1 large'], baseServing: '1 medium', calories: 22, protein: 1, carbs: 5, fat: 0 },
  lettuce_romaine: { name: 'Romaine Lettuce', category: 'vegetable', servings: ['1 cup', '2 cups'], baseServing: '2 cups', calories: 16, protein: 1, carbs: 3, fat: 0 },
  mixed_greens: { name: 'Mixed Salad Greens', category: 'vegetable', servings: ['1 cup', '2 cups'], baseServing: '2 cups', calories: 18, protein: 1, carbs: 3, fat: 0 },
  green_beans: { name: 'Green Beans', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 44, protein: 2, carbs: 10, fat: 0 },
  asparagus: { name: 'Asparagus', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 27, protein: 3, carbs: 5, fat: 0 },
  zucchini: { name: 'Zucchini', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 20, protein: 1, carbs: 4, fat: 0 },
  cauliflower: { name: 'Cauliflower', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 27, protein: 2, carbs: 5, fat: 0 },
  mushrooms: { name: 'Mushrooms', category: 'vegetable', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 22, protein: 3, carbs: 3, fat: 0 },
  onion: { name: 'Onion', category: 'vegetable', servings: ['1/4 cup', '1/2 cup'], baseServing: '1/2 cup', calories: 32, protein: 1, carbs: 7, fat: 0 },
  
  // FRUITS
  apple: { name: 'Apple', category: 'fruit', servings: ['1 small', '1 medium', '1 large'], baseServing: '1 medium', calories: 95, protein: 0, carbs: 25, fat: 0 },
  banana: { name: 'Banana', category: 'fruit', servings: ['1 small', '1 medium', '1 large'], baseServing: '1 medium', calories: 105, protein: 1, carbs: 27, fat: 0 },
  orange: { name: 'Orange', category: 'fruit', servings: ['1 small', '1 medium'], baseServing: '1 medium', calories: 62, protein: 1, carbs: 15, fat: 0 },
  strawberries: { name: 'Strawberries', category: 'fruit', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 49, protein: 1, carbs: 12, fat: 0 },
  blueberries: { name: 'Blueberries', category: 'fruit', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 84, protein: 1, carbs: 21, fat: 0 },
  grapes: { name: 'Grapes', category: 'fruit', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 104, protein: 1, carbs: 27, fat: 0 },
  watermelon: { name: 'Watermelon', category: 'fruit', servings: ['1 cup', '2 cups'], baseServing: '1 cup', calories: 46, protein: 1, carbs: 12, fat: 0 },
  
  // FATS & OILS
  olive_oil: { name: 'Olive Oil', category: 'fat', servings: ['1 tsp', '1 tbsp'], baseServing: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 14 },
  butter: { name: 'Butter', category: 'fat', servings: ['1 tsp', '1 tbsp'], baseServing: '1 tbsp', calories: 102, protein: 0, carbs: 0, fat: 12 },
  coconut_oil: { name: 'Coconut Oil', category: 'fat', servings: ['1 tsp', '1 tbsp'], baseServing: '1 tbsp', calories: 121, protein: 0, carbs: 0, fat: 14 },
  avocado: { name: 'Avocado', category: 'fat', servings: ['1/4 avocado', '1/2 avocado', '1 avocado'], baseServing: '1/2 avocado', calories: 120, protein: 2, carbs: 6, fat: 11 },
  almonds: { name: 'Almonds', category: 'fat', servings: ['1 oz (23 nuts)', '1/4 cup'], baseServing: '1 oz', calories: 164, protein: 6, carbs: 6, fat: 14 },
  peanut_butter: { name: 'Peanut Butter', category: 'fat', servings: ['1 tbsp', '2 tbsp'], baseServing: '2 tbsp', calories: 188, protein: 8, carbs: 7, fat: 16 },
  almond_butter: { name: 'Almond Butter', category: 'fat', servings: ['1 tbsp', '2 tbsp'], baseServing: '2 tbsp', calories: 196, protein: 7, carbs: 6, fat: 18 },
  walnuts: { name: 'Walnuts', category: 'fat', servings: ['1 oz (14 halves)', '1/4 cup'], baseServing: '1 oz', calories: 185, protein: 4, carbs: 4, fat: 18 },
  cashews: { name: 'Cashews', category: 'fat', servings: ['1 oz (18 nuts)', '1/4 cup'], baseServing: '1 oz', calories: 157, protein: 5, carbs: 9, fat: 12 },
  cheese_cheddar: { name: 'Cheddar Cheese', category: 'fat', servings: ['1 oz', '2 oz'], baseServing: '1 oz', calories: 114, protein: 7, carbs: 0, fat: 9 },
  cheese_mozzarella: { name: 'Mozzarella Cheese', category: 'fat', servings: ['1 oz', '2 oz'], baseServing: '1 oz', calories: 85, protein: 6, carbs: 1, fat: 6 },
  cream_cheese: { name: 'Cream Cheese', category: 'fat', servings: ['1 tbsp', '2 tbsp'], baseServing: '2 tbsp', calories: 101, protein: 2, carbs: 2, fat: 10 },
  
  // DAIRY
  milk_whole: { name: 'Whole Milk', category: 'dairy', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 149, protein: 8, carbs: 12, fat: 8 },
  milk_2percent: { name: '2% Milk', category: 'dairy', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 122, protein: 8, carbs: 12, fat: 5 },
  milk_skim: { name: 'Skim Milk', category: 'dairy', servings: ['1/2 cup', '1 cup'], baseServing: '1 cup', calories: 83, protein: 8, carbs: 12, fat: 0 },
  almond_milk: { name: 'Almond Milk (unsweetened)', category: 'dairy', servings: ['1 cup'], baseServing: '1 cup', calories: 30, protein: 1, carbs: 1, fat: 3 },
  
  // LEGUMES
  black_beans_cooked: { name: 'Black Beans (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1/2 cup', calories: 114, protein: 8, carbs: 20, fat: 0.5 },
  chickpeas_cooked: { name: 'Chickpeas (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1/2 cup', calories: 134, protein: 7, carbs: 22, fat: 2 },
  lentils_cooked: { name: 'Lentils (cooked)', category: 'carbs', servings: ['1/2 cup', '1 cup'], baseServing: '1/2 cup', calories: 115, protein: 9, carbs: 20, fat: 0.5 },
  
  // SNACKS
  protein_bar: { name: 'Protein Bar', category: 'snack', servings: ['1 bar'], baseServing: '1 bar', calories: 200, protein: 20, carbs: 24, fat: 7 },
  protein_shake: { name: 'Protein Shake (whey)', category: 'snack', servings: ['1 scoop'], baseServing: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  granola_bar: { name: 'Granola Bar', category: 'snack', servings: ['1 bar'], baseServing: '1 bar', calories: 100, protein: 2, carbs: 15, fat: 4 },
  chips_potato: { name: 'Potato Chips', category: 'snack', servings: ['1 oz (about 15 chips)'], baseServing: '1 oz', calories: 152, protein: 2, carbs: 15, fat: 10 },
  pretzels: { name: 'Pretzels', category: 'snack', servings: ['1 oz'], baseServing: '1 oz', calories: 108, protein: 3, carbs: 23, fat: 1 },
  popcorn_air_popped: { name: 'Popcorn (air popped)', category: 'snack', servings: ['2 cups', '3 cups'], baseServing: '3 cups', calories: 93, protein: 3, carbs: 18, fat: 1 },
  dark_chocolate: { name: 'Dark Chocolate (70-85%)', category: 'snack', servings: ['1 oz (1 square)'], baseServing: '1 oz', calories: 170, protein: 2, carbs: 13, fat: 12 },
  
  // CONDIMENTS & MISC
  mayonnaise: { name: 'Mayonnaise', category: 'condiment', servings: ['1 tbsp'], baseServing: '1 tbsp', calories: 94, protein: 0, carbs: 0, fat: 10 },
  ketchup: { name: 'Ketchup', category: 'condiment', servings: ['1 tbsp'], baseServing: '1 tbsp', calories: 17, protein: 0, carbs: 4, fat: 0 },
  mustard: { name: 'Mustard', category: 'condiment', servings: ['1 tbsp'], baseServing: '1 tbsp', calories: 10, protein: 1, carbs: 1, fat: 0.5 },
  bbq_sauce_item: { name: 'BBQ Sauce', category: 'condiment', servings: ['2 tbsp'], baseServing: '2 tbsp', calories: 58, protein: 0, carbs: 14, fat: 0 },
  ranch_dressing: { name: 'Ranch Dressing', category: 'condiment', servings: ['2 tbsp'], baseServing: '2 tbsp', calories: 129, protein: 1, carbs: 2, fat: 13 },
  salsa_item: { name: 'Salsa', category: 'condiment', servings: ['2 tbsp', '1/4 cup'], baseServing: '2 tbsp', calories: 9, protein: 0, carbs: 2, fat: 0 },
  
  // BEVERAGES
  coffee_black: { name: 'Black Coffee', category: 'beverage', servings: ['1 cup'], baseServing: '1 cup', calories: 2, protein: 0, carbs: 0, fat: 0 },
  coffee_cream_sugar: { name: 'Coffee (cream & sugar)', category: 'beverage', servings: ['1 cup'], baseServing: '1 cup', calories: 70, protein: 1, carbs: 10, fat: 3 },
  orange_juice: { name: 'Orange Juice', category: 'beverage', servings: ['1 cup'], baseServing: '1 cup', calories: 112, protein: 2, carbs: 26, fat: 0 },
  soda_regular: { name: 'Soda (regular)', category: 'beverage', servings: ['12 oz can'], baseServing: '12 oz', calories: 140, protein: 0, carbs: 39, fat: 0 },
  
  // FAST FOOD / RESTAURANT (common items)
  pizza_slice_cheese: { name: 'Pizza Slice (cheese)', category: 'restaurant', servings: ['1 slice'], baseServing: '1 slice', calories: 285, protein: 12, carbs: 36, fat: 10 },
  pizza_slice_pepperoni: { name: 'Pizza Slice (pepperoni)', category: 'restaurant', servings: ['1 slice'], baseServing: '1 slice', calories: 313, protein: 13, carbs: 36, fat: 13 },
  burger_fast_food: { name: 'Fast Food Burger', category: 'restaurant', servings: ['1 burger'], baseServing: '1 burger', calories: 354, protein: 20, carbs: 33, fat: 16 },
  fries_medium: { name: 'French Fries (medium)', category: 'restaurant', servings: ['1 serving'], baseServing: '1 serving', calories: 365, protein: 4, carbs: 48, fat: 17 },
  chicken_nuggets: { name: 'Chicken Nuggets (6 piece)', category: 'restaurant', servings: ['6 pieces'], baseServing: '6 pieces', calories: 287, protein: 16, carbs: 16, fat: 18 },
  burrito_bowl: { name: 'Burrito Bowl (chipotle-style)', category: 'restaurant', servings: ['1 bowl'], baseServing: '1 bowl', calories: 655, protein: 40, carbs: 85, fat: 15 },
  sub_sandwich: { name: 'Sub Sandwich (6")', category: 'restaurant', servings: ['6" sub'], baseServing: '6" sub', calories: 360, protein: 18, carbs: 46, fat: 10 },
};
