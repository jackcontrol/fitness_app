// Lunch recipes — extracted from index.html lines 5901-6585.
// 30 quick options, 15-25 min total time.

export const lunchRecipes = {
  // AMERICAN LUNCHES (6)
  chicken_caesar_wrap: {
    name: 'Chicken Caesar Wrap',
    cuisine: 'american',
    emoji: '🌯',
    prepTime: '10 min',
    cookTime: '8 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `1 large whole wheat tortilla`,
      `1 cup romaine lettuce, chopped`,
      `2 tbsp Caesar dressing`,
      `2 tbsp parmesan cheese`,
      `1/4 cup croutons (optional)`
    ]
  },
  turkey_avocado_sandwich: {
    name: 'Turkey Avocado Sandwich',
    cuisine: 'american',
    emoji: '🥪',
    prepTime: '8 min',
    cookTime: '0 min',
    dietType: 'omnivore',
    allergens: ['gluten'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 22 * 4 * 10) / 10} oz deli turkey`,
      `2 slices whole grain bread`,
      `${Math.round(lunch.fat / 15)} avocado, sliced`,
      `Lettuce, tomato, onion`,
      `Mustard or mayo`
    ]
  },
  tuna_salad_plate: {
    name: 'Tuna Salad Power Plate',
    cuisine: 'american',
    emoji: '🐟',
    prepTime: '10 min',
    cookTime: '0 min',
    dietType: 'omnivore',
    allergens: [],
    tier: 'budget',
    getIngredients: (lunch) => [
      `1 can tuna (5 oz, drained)`,
      `2 cups mixed greens`,
      `1/2 cup cherry tomatoes`,
      `1/4 cucumber, sliced`,
      `2 tbsp olive oil & vinegar`,
      `Whole grain crackers or bread`
    ]
  },
  grilled_cheese_tomato_soup: {
    name: 'Grilled Cheese & Tomato Soup',
    cuisine: 'american',
    emoji: '🧀',
    prepTime: '5 min',
    cookTime: '10 min',
    dietType: 'vegetarian',
    allergens: ['gluten', 'dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `2 slices whole grain bread`,
      `2 oz cheese (cheddar or Swiss)`,
      `1 cup tomato soup (canned or homemade)`,
      `1 tbsp butter`,
      `Side salad (optional)`
    ]
  },
  chicken_quesadilla: {
    name: 'Chicken Quesadilla',
    cuisine: 'mexican',
    emoji: '🫓',
    prepTime: '8 min',
    cookTime: '8 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz cooked chicken`,
      `1 large flour tortilla`,
      `1/4 cup shredded cheese`,
      `Salsa, sour cream`,
      `Bell peppers & onions (optional)`
    ]
  },
  bbq_chicken_salad: {
    name: 'BBQ Chicken Salad',
    cuisine: 'american',
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '8 min',
    dietType: 'omnivore',
    allergens: [],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `2 cups mixed greens`,
      `1/4 cup corn`,
      `1/4 cup black beans`,
      `2 tbsp BBQ sauce`,
      `Ranch dressing`
    ]
  },

  // ASIAN LUNCHES (8)
  teriyaki_chicken_rice: {
    name: 'Teriyaki Chicken Bowl',
    cuisine: 'asian',
    emoji: '🍱',
    prepTime: '10 min',
    cookTime: '12 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `${Math.round(lunch.carbs / 45 * 3 / 4)} cups cooked rice`,
      `1 cup broccoli, steamed`,
      `2 tbsp teriyaki sauce`,
      `Sesame seeds, green onions`
    ]
  },
  poke_bowl: {
    name: 'Ahi Tuna Poke Bowl',
    cuisine: 'hawaiian',
    emoji: '🐟',
    prepTime: '15 min',
    cookTime: '0 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    tier: 'premium',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz sushi-grade tuna`,
      `${Math.round(lunch.carbs / 45 * 3 / 4)} cups cooked rice`,
      `Cucumber, avocado, edamame`,
      `Soy sauce, sesame oil`,
      `Seaweed, sesame seeds`
    ]
  },
  pad_thai: {
    name: 'Chicken Pad Thai',
    cuisine: 'thai',
    emoji: '🍜',
    prepTime: '12 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['peanuts', 'soy'],
    tier: 'medium',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken`,
      `3 oz rice noodles`,
      `1 egg`,
      `Bean sprouts, green onions`,
      `Pad Thai sauce, peanuts`,
      `Lime wedge`
    ]
  },
  chicken_fried_rice: {
    name: 'Chicken Fried Rice',
    cuisine: 'asian',
    emoji: '🍚',
    prepTime: '10 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['soy', 'eggs'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken`,
      `${Math.round(lunch.carbs / 45 * 3 / 4)} cups cooked rice`,
      `1 egg`,
      `Mixed vegetables`,
      `Soy sauce, sesame oil`
    ]
  },
  sushi_rolls: {
    name: 'California Rolls',
    cuisine: 'japanese',
    emoji: '🍣',
    prepTime: '20 min',
    cookTime: '0 min',
    dietType: 'omnivore',
    allergens: ['shellfish'],
    tier: 'premium',
    getIngredients: (lunch) => [
      `Imitation crab or real crab`,
      `Sushi rice`,
      `Nori sheets`,
      `Cucumber, avocado`,
      `Soy sauce, wasabi, ginger`
    ]
  },
  ramen_bowl: {
    name: 'Quick Chicken Ramen',
    cuisine: 'japanese',
    emoji: '🍜',
    prepTime: '8 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'soy', 'eggs'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Ramen noodles`,
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken`,
      `Soft-boiled egg`,
      `Green onions, nori`,
      `Broth, soy sauce`
    ]
  },
  korean_bibimbap: {
    name: 'Bibimbap Bowl',
    cuisine: 'korean',
    emoji: '🍲',
    prepTime: '15 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['soy', 'eggs', 'sesame'],
    tier: 'medium',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz beef or chicken`,
      `Rice, fried egg`,
      `Spinach, carrots, bean sprouts`,
      `Kimchi, gochujang`,
      `Sesame oil`
    ]
  },
  vietnamese_banh_mi: {
    name: 'Banh Mi Sandwich',
    cuisine: 'vietnamese',
    emoji: '🥖',
    prepTime: '12 min',
    cookTime: '0 min',
    dietType: 'omnivore',
    allergens: ['gluten'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `French baguette`,
      `Grilled pork or chicken`,
      `Pickled vegetables`,
      `Cilantro, jalapeño`,
      `Sriracha mayo`
    ]
  },

  // MEDITERRANEAN LUNCHES (6)
  greek_salad_chicken: {
    name: 'Greek Chicken Salad',
    cuisine: 'mediterranean',
    emoji: '🥗',
    prepTime: '12 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz grilled chicken`,
      `Mixed greens, cucumber, tomatoes`,
      `Feta cheese, olives`,
      `Red onion, peppers`,
      `Olive oil & lemon dressing`
    ]
  },
  falafel_wrap: {
    name: 'Falafel Wrap',
    cuisine: 'mediterranean',
    emoji: '🧆',
    prepTime: '10 min',
    cookTime: '0 min',
    dietType: 'vegetarian',
    allergens: ['gluten', 'sesame'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `4-5 falafel balls`,
      `Whole wheat pita`,
      `Hummus, tahini sauce`,
      `Lettuce, tomato, cucumber`,
      `Pickled vegetables`
    ]
  },
  mediterranean_grain_bowl: {
    name: 'Mediterranean Grain Bowl',
    cuisine: 'mediterranean',
    emoji: '🥙',
    prepTime: '15 min',
    cookTime: '0 min',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Quinoa or couscous`,
      `Chickpeas`,
      `Cucumber, tomatoes, olives`,
      `Feta cheese`,
      `Lemon-herb dressing`
    ]
  },
  chicken_shawarma_wrap: {
    name: 'Chicken Shawarma Wrap',
    cuisine: 'mediterranean',
    emoji: '🌯',
    prepTime: '12 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken`,
      `Pita or wrap`,
      `Tahini sauce`,
      `Lettuce, tomato, onion`,
      `Shawarma spices`
    ]
  },
  caprese_panini: {
    name: 'Caprese Panini',
    cuisine: 'italian',
    emoji: '🥪',
    prepTime: '8 min',
    cookTime: '6 min',
    dietType: 'vegetarian',
    allergens: ['gluten', 'dairy'],
    tier: 'medium',
    getIngredients: (lunch) => [
      `Ciabatta or sourdough bread`,
      `Fresh mozzarella`,
      `Tomato slices`,
      `Fresh basil`,
      `Balsamic glaze, olive oil`
    ]
  },
  italian_pasta_salad: {
    name: 'Italian Pasta Salad',
    cuisine: 'italian',
    emoji: '🍝',
    prepTime: '15 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Pasta (cooked cold)`,
      `Salami or pepperoni`,
      `Mozzarella, olives`,
      `Cherry tomatoes, peppers`,
      `Italian dressing`
    ]
  },

  // MEXICAN LUNCHES (4)
  burrito_bowl_lunch: {
    name: 'Burrito Bowl',
    cuisine: 'mexican',
    emoji: '🥙',
    prepTime: '12 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken or beef`,
      `Rice, black beans`,
      `Lettuce, tomato, corn`,
      `Cheese, sour cream, salsa`,
      `Guacamole or avocado`
    ]
  },
  taco_salad: {
    name: 'Taco Salad',
    cuisine: 'mexican',
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['dairy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 22 * 4 * 10) / 10} oz ground beef or turkey`,
      `Mixed greens`,
      `Black beans, corn, tomatoes`,
      `Cheese, sour cream`,
      `Tortilla chips, salsa`
    ]
  },
  chicken_tortilla_soup: {
    name: 'Chicken Tortilla Soup',
    cuisine: 'mexican',
    emoji: '🍲',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: [],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken`,
      `Chicken broth, tomatoes`,
      `Black beans, corn`,
      `Tortilla strips`,
      `Cilantro, lime, avocado`
    ]
  },
  street_tacos: {
    name: 'Street Tacos',
    cuisine: 'mexican',
    emoji: '🌮',
    prepTime: '10 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: [],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz carne asada or chicken`,
      `Small corn tortillas`,
      `Onion, cilantro`,
      `Lime, salsa`,
      `Radishes (optional)`
    ]
  },

  // HEALTHY BOWLS (4)
  salmon_quinoa_bowl: {
    name: 'Salmon Quinoa Bowl',
    cuisine: 'fusion',
    emoji: '🐟',
    prepTime: '15 min',
    cookTime: '12 min',
    dietType: 'omnivore',
    allergens: [],
    tier: 'premium',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz salmon`,
      `Quinoa`,
      `Kale or spinach`,
      `Roasted sweet potato`,
      `Lemon-tahini dressing`
    ]
  },
  buddha_bowl: {
    name: 'Buddha Bowl',
    cuisine: 'fusion',
    emoji: '🥙',
    prepTime: '15 min',
    cookTime: '10 min',
    dietType: 'vegetarian',
    allergens: ['soy'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Quinoa or rice`,
      `Roasted chickpeas`,
      `Roasted vegetables`,
      `Avocado`,
      `Tahini or peanut sauce`
    ]
  },
  power_protein_bowl: {
    name: 'Power Protein Bowl',
    cuisine: 'american',
    emoji: '💪',
    prepTime: '12 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['eggs'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein / 31 * 4 * 10) / 10} oz chicken or turkey`,
      `Quinoa or brown rice`,
      `Hard-boiled eggs`,
      `Steamed broccoli`,
      `Hot sauce or mustard`
    ]
  },
  mediterranean_chickpea_bowl: {
    name: 'Mediterranean Chickpea Bowl',
    cuisine: 'mediterranean',
    emoji: '🥙',
    prepTime: '12 min',
    cookTime: '0 min',
    dietType: 'vegan',
    allergens: ['sesame'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Chickpeas`,
      `Couscous or quinoa`,
      `Cucumber, tomato, olives`,
      `Hummus`,
      `Lemon-tahini dressing`
    ]
  },

  // SOUPS & SANDWICHES (2)
  chicken_noodle_soup: {
    name: 'Chicken Noodle Soup',
    cuisine: 'american',
    emoji: '🍜',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['gluten'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `Chicken breast`,
      `Egg noodles`,
      `Carrots, celery`,
      `Chicken broth`,
      `Side of bread`
    ]
  },
  club_sandwich: {
    name: 'Classic Club Sandwich',
    cuisine: 'american',
    emoji: '🥪',
    prepTime: '10 min',
    cookTime: '5 min',
    dietType: 'omnivore',
    allergens: ['gluten'],
    tier: 'budget',
    getIngredients: (lunch) => [
      `3 slices bread (toasted)`,
      `Turkey, bacon`,
      `Lettuce, tomato`,
      `Cheese, mayo`,
      `Side chips or fruit`
    ]
  },
  
  // NEW ADDITIONS - Protein-forward lunch variety
  power_bowl_chicken: {
    name: 'Chicken Power Bowl',
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'High protein, balanced macros, satisfying.',
    allergens: [],
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein * 0.7 / 30)} grilled chicken breasts`,
      `${Math.round(lunch.carbs * 0.5 / 45)} cups cooked quinoa`,
      `2 cups mixed greens`,
      `1/2 cup roasted chickpeas`,
      `1/4 avocado, diced`,
      `Cherry tomatoes, cucumber, red onion`,
      `${Math.round(lunch.fat / 14)} tbsp olive oil`,
      `Lemon juice, salt, pepper`,
      `Optional: feta cheese, tahini drizzle`
    ],
    instructions: [
      'Season and grill chicken breast.',
      'Cook quinoa according to package.',
      'Arrange greens in bowl.',
      'Top with quinoa, sliced chicken, chickpeas.',
      'Add vegetables and avocado.',
      'Drizzle with olive oil and lemon.',
      'Season with salt and pepper.',
      'High-protein, nutrient-dense lunch!'
    ]
  },
  
  tuna_protein_salad: {
    name: 'Tuna Protein Salad',
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '0 min',
    description: 'Quick, high protein, omega-3 rich.',
    allergens: ['eggs'],
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein * 0.6 / 25)} cans tuna in water, drained`,
      `${Math.round(lunch.protein * 0.3 / 6)} hard-boiled eggs, chopped`,
      `3 cups mixed greens`,
      `1 cup cherry tomatoes`,
      `1 cucumber, diced`,
      `1/4 red onion, sliced`,
      `${Math.round(lunch.carbs * 0.4 / 15)} whole grain crackers`,
      `${Math.round(lunch.fat / 14)} tbsp olive oil`,
      `2 tbsp balsamic vinegar`,
      `Salt, pepper, Italian seasoning`
    ],
    instructions: [
      'Drain tuna thoroughly.',
      'Hard-boil eggs if not pre-made.',
      'Combine greens, tomatoes, cucumber, onion in bowl.',
      'Top with tuna and chopped eggs.',
      'Whisk olive oil, vinegar, salt, pepper, Italian seasoning.',
      'Drizzle dressing over salad.',
      'Serve with whole grain crackers.',
      'Quick, protein-packed lunch in 10 minutes!'
    ]
  },
  
  greek_chicken_wrap: {
    name: 'Greek Chicken Wrap',
    emoji: '🌯',
    prepTime: '10 min',
    cookTime: '10 min',
    description: 'Mediterranean flavors, portable, high protein.',
    allergens: ['gluten', 'dairy'],
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein * 0.7 / 30)} grilled chicken breasts, sliced`,
      `${Math.round(lunch.carbs * 0.6 / 35)} large whole wheat tortillas`,
      `1/4 cup hummus`,
      `1/2 cup mixed greens`,
      `1/4 cup diced cucumber`,
      `1/4 cup diced tomatoes`,
      `2 tbsp crumbled feta cheese`,
      `Red onion slices`,
      `${Math.round(lunch.fat / 14)} tbsp olive oil`,
      `Lemon juice, oregano, tzatziki sauce`
    ],
    instructions: [
      'Season chicken with oregano, grill until done.',
      'Warm tortillas slightly.',
      'Spread hummus on tortilla.',
      'Layer greens, sliced chicken, cucumber, tomatoes, feta, onion.',
      'Drizzle with olive oil, lemon juice, tzatziki.',
      'Roll tightly, tucking in sides.',
      'Cut in half diagonally.',
      'Mediterranean lunch ready in 20 minutes!'
    ]
  },
  
  chef_salad_protein: {
    name: 'High-Protein Chef Salad',
    emoji: '🥗',
    prepTime: '12 min',
    cookTime: '0 min',
    description: 'Classic, customizable, protein-loaded.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (lunch) => [
      `3 cups mixed greens (romaine, spinach)`,
      `${Math.round(lunch.protein * 0.4 / 25)} slices deli turkey`,
      `${Math.round(lunch.protein * 0.3 / 25)} slices ham`,
      `${Math.round(lunch.protein * 0.2 / 6)} hard-boiled eggs, quartered`,
      `1/2 cup shredded cheddar cheese`,
      `1 cup cherry tomatoes, halved`,
      `1 cucumber, sliced`,
      `1/4 red onion, sliced`,
      `${Math.round(lunch.carbs * 0.3 / 15)} croutons`,
      `${Math.round(lunch.fat / 14)} tbsp ranch or vinaigrette`,
      `Salt, pepper`
    ],
    instructions: [
      'Arrange greens in large bowl.',
      'Roll turkey and ham slices, slice into strips.',
      'Quarter hard-boiled eggs.',
      'Arrange proteins, cheese, vegetables on greens.',
      'Add croutons for crunch.',
      'Drizzle with dressing.',
      'Season with salt and pepper.',
      'Classic high-protein salad!'
    ]
  },
  
  salmon_superfood_bowl: {
    name: 'Salmon Superfood Bowl',
    emoji: '🐟',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'Omega-3 rich, nutrient dense, premium lunch.',
    allergens: [],
    getIngredients: (lunch) => [
      `${Math.round(lunch.protein * 0.7 / 25)} salmon fillet (5-6 oz)`,
      `${Math.round(lunch.carbs * 0.5 / 40)} cup cooked brown rice`,
      `1 cup steamed broccoli`,
      `1/2 cup edamame`,
      `1/4 avocado, sliced`,
      `1 cup spinach`,
      `Sesame seeds`,
      `${Math.round(lunch.fat / 14)} tbsp sesame oil`,
      `2 tbsp low-sodium soy sauce`,
      `1 tbsp rice vinegar`,
      `Ginger, garlic`
    ],
    instructions: [
      'Season salmon with salt, pepper.',
      'Bake at 400°F for 12-15 minutes or pan-sear.',
      'Cook brown rice.',
      'Steam broccoli and edamame.',
      'Arrange spinach and rice in bowl.',
      'Top with salmon, broccoli, edamame, avocado.',
      'Mix sesame oil, soy sauce, vinegar, ginger, garlic.',
      'Drizzle sauce over bowl, sprinkle sesame seeds.',
      'Premium, omega-3 rich lunch!'
    ]
  }
};
