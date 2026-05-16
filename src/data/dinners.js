// Dinner recipes — extracted from index.html lines 6588-8592.
// In the monolith this was declared as 'const recipes' (the word 'dinner'
// was implicit from the comment at line 6587). Renamed here for clarity;
// also exported as 'recipes' for compatibility with any legacy callsite.

export const dinnerRecipes = {
  marinara: { 
    name: 'Chicken Spaghetti Marinara', 
    cuisine: 'italian', 
    emoji: '🍝',
    prepTime: '5 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['gluten'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, diced`,
      `${Math.round(dinner.carbs * 0.7 / 37 * 2 * 10) / 10} oz red lentil pasta (dry)`,
      `1 cup crushed tomatoes`,
      `2 cloves garlic, minced`,
      `1/4 onion, diced`,
      `${Math.round(dinner.fat / 14)} tbsp olive oil`,
      `Fresh basil`,
      `Italian seasoning, salt, pepper`
    ],
    instructions: [
      'Cook pasta according to package. Drain and set aside.',
      'Heat olive oil in pan over medium-high.',
      'Cook chicken until golden, 6-8 minutes. Remove.',
      'Sauté onion and garlic 2 minutes.',
      'Add crushed tomatoes and seasoning. Simmer 8 minutes.',
      'Return chicken, add basil.',
      'Toss pasta with sauce and serve.'
    ]
  },
  creamy_tomato: { 
    name: 'Creamy Tomato Pasta', 
    cuisine: 'italian', 
    emoji: '🍝',
    prepTime: '5 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, cubed',
      '3 oz pasta (dry)',
      '1 cup crushed tomatoes',
      '1/4 cup Greek yogurt',
      '2 cloves garlic, minced',
      '1 tbsp olive oil',
      'Parmesan cheese',
      'Fresh basil, salt, pepper'
    ],
    instructions: [
      'Cook pasta, reserve 1/4 cup pasta water.',
      'Heat oil, cook chicken until done. Remove.',
      'Sauté garlic 30 seconds, add crushed tomatoes.',
      'Simmer 8 minutes, reduce heat to low.',
      'Stir in Greek yogurt (don\'t boil after adding).',
      'Add chicken and pasta, toss.',
      'Add pasta water if needed. Top with Parmesan and basil.'
    ]
  },
  tomato_basil: { 
    name: 'Tomato Basil Chicken', 
    cuisine: 'italian', 
    emoji: '🍅',
    prepTime: '5 min',
    cookTime: '20 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '6 oz chicken breast',
      '1/2 cup cherry tomatoes, halved',
      '2 cloves garlic, minced',
      'Fresh basil (handful)',
      '1 tbsp olive oil',
      '1 tbsp balsamic vinegar',
      'Salt, pepper, Italian seasoning'
    ],
    instructions: [
      'Season chicken with salt, pepper, Italian seasoning.',
      'Heat olive oil in skillet over medium-high.',
      'Sear chicken 6-7 minutes per side. Remove.',
      'Add garlic and tomatoes, cook 3 minutes.',
      'Add balsamic, simmer until reduced.',
      'Return chicken, top with basil.',
      'Serve with rice or pasta.'
    ]
  },
  butter: { 
    name: 'Butter Chicken', 
    cuisine: 'indian', 
    emoji: '🍛',
    prepTime: '15 min',
    cookTime: '25 min',
    dietType: 'omnivore',
    allergens: ['dairy'],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, cubed',
      '1 cup crushed tomatoes',
      '1/4 cup Greek yogurt',
      '2 tbsp butter (divided)',
      '1/4 onion, finely diced',
      '4 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '2 tbsp garam masala (divided)',
      '1 tsp cumin',
      '1 tsp coriander',
      '1 tsp turmeric',
      '1 tsp paprika',
      '1/2 tsp cayenne pepper (adjust to taste)',
      '1 tbsp tomato paste',
      '2 tbsp heavy cream OR coconut milk lite (optional richness)',
      '1 tsp sugar',
      'Salt, fresh cilantro',
      'Juice of 1/2 lemon'
    ],
    instructions: [
      'Marinate chicken in yogurt + 1 tbsp garam masala + 1/2 tsp salt for 15-30 min.',
      'Melt 1 tbsp butter in pan over medium-high, sear chicken until charred. Set aside.',
      'Add remaining butter, sauté onion until golden (5 min).',
      'Add garlic and ginger, cook 2 minutes until very fragrant.',
      'Add ALL remaining spices (garam masala, cumin, coriander, turmeric, paprika, cayenne), toast 1 minute.',
      'Stir in tomato paste, cook 1 minute.',
      'Add crushed tomatoes and sugar, simmer 12-15 minutes, stirring often.',
      'Reduce heat to low, stir in remaining yogurt and cream (don\'t boil).',
      'Add chicken back, simmer 5 minutes until sauce thickens.',
      'Finish with lemon juice, garnish with cilantro.',
      'Serve over rice. Taste and add more salt if needed!'
    ]
  },
  tikka: { 
    name: 'Chicken Tikka Masala', 
    cuisine: 'indian', 
    emoji: '🍛',
    prepTime: '20 min',
    cookTime: '25 min',
    dietType: 'omnivore',
    allergens: ['dairy'],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, cubed',
      '1/3 cup Greek yogurt (divided)',
      '1 cup crushed tomatoes',
      '1/3 cup coconut milk lite',
      '1/4 onion, finely diced',
      '4 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '2 tsp garam masala',
      '1 tsp cumin',
      '1 tsp coriander',
      '1 tsp paprika',
      '1/2 tsp turmeric',
      '1/2 tsp cayenne pepper',
      '1 tbsp tomato paste',
      '1 tbsp olive oil',
      '1 tsp sugar',
      'Fresh cilantro, salt',
      'Juice of 1/2 lime'
    ],
    instructions: [
      'Marinate chicken in 3 tbsp yogurt + 1 tsp garam masala + 1/2 tsp cumin + salt for 20-30 min.',
      'Heat oil in pan over high heat, sear chicken until charred and cooked through. Set aside.',
      'Reduce heat to medium, add more oil if needed, sauté onion until caramelized (5-6 min).',
      'Add garlic and ginger, cook 2 minutes until very fragrant.',
      'Add ALL remaining spices (garam masala, cumin, coriander, paprika, turmeric, cayenne), toast 1-2 minutes.',
      'Stir in tomato paste, cook 1 minute.',
      'Add crushed tomatoes and sugar, simmer 12-15 minutes, stirring occasionally.',
      'Reduce heat to low, stir in coconut milk and remaining yogurt.',
      'Add chicken, simmer 5-8 minutes until sauce thickens.',
      'Finish with lime juice, garnish with cilantro.',
      'Serve over rice. Season with more salt if needed!'
    ]
  },
  teriyaki_bowl: { 
    name: 'Teriyaki Chicken Bowl', 
    cuisine: 'asian', 
    emoji: '🍚',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, sliced`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz brown rice (dry)`,
      `1.5 cups broccoli florets`,
      `1/2 bell pepper, sliced`,
      `1/4 onion, sliced`,
      `3 cloves garlic, minced`,
      `3 tbsp soy sauce`,
      `1 tbsp brown sugar or honey`,
      `1 tbsp olive oil`,
      `1 tsp ginger, minced (optional)`,
      `Sesame seeds (optional garnish)`
    ],
    instructions: [
      'Cook rice according to package directions.',
      'Mix soy sauce, sugar, and 1 tbsp water for teriyaki sauce.',
      'Heat oil in large skillet or wok over high heat.',
      'Stir-fry chicken until golden and cooked through, 5-6 minutes. Remove.',
      'Add garlic and ginger (if using), cook 30 seconds.',
      'Add broccoli, peppers, onions. Stir-fry 4-5 minutes until tender-crisp.',
      'Return chicken to pan, pour teriyaki sauce over everything.',
      'Toss to coat, cook 1-2 minutes until sauce thickens.',
      'Serve over rice, garnish with sesame seeds if desired.',
      'Budget tip: Use frozen broccoli to save money!'
    ]
  },
  bbq_chicken_sweetpotato: { 
    name: 'BBQ Chicken & Sweet Potato', 
    cuisine: 'american', 
    emoji: '🍗',
    prepTime: '10 min',
    cookTime: '30 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `${Math.round(dinner.carbs * 0.6 / 26 * 6 * 10) / 10} oz sweet potato (about 1 medium)`,
      `1.5 cups broccoli florets`,
      `1 tbsp olive oil`,
      `2 tbsp BBQ sauce (store-bought or homemade)`,
      `1/4 onion, diced`,
      `Garlic powder, paprika, salt, pepper`
    ],
    instructions: [
      'Preheat oven to 400°F.',
      'Cube sweet potato into 1-inch pieces. Toss with 1/2 tbsp oil, salt, pepper.',
      'Spread on baking sheet, roast 25-30 minutes, flipping halfway.',
      'Season chicken with garlic powder, paprika, salt, pepper.',
      'Heat remaining oil in pan, cook chicken 6-7 minutes per side until done.',
      'Brush BBQ sauce on chicken in last 2 minutes of cooking.',
      'Steam or roast broccoli (add to oven with sweet potatoes if roasting).',
      'Plate: sweet potato, chicken, broccoli.',
      'Drizzle extra BBQ sauce if desired.',
      'Simple, budget-friendly, and delicious comfort food!'
    ]
  },
  chicken_cacciatore: { 
    name: 'Chicken Cacciatore', 
    cuisine: 'italian', 
    emoji: '🍅',
    prepTime: '10 min',
    cookTime: '35 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast (or thighs)`,
      `1 cup crushed tomatoes`,
      `2 bell peppers (any color), sliced`,
      `1/2 onion, sliced`,
      `4 cloves garlic, minced`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz brown rice (dry)`,
      `2 tbsp olive oil`,
      `1 tsp Italian seasoning`,
      `1/2 tsp oregano`,
      `Salt, pepper, red pepper flakes (optional)`,
      `Fresh basil or parsley (optional garnish)`
    ],
    instructions: [
      'Start cooking rice according to package.',
      'Season chicken with salt, pepper, Italian seasoning.',
      'Heat 1 tbsp oil in large skillet over medium-high.',
      'Sear chicken until golden on both sides, 4-5 minutes per side. Remove.',
      'Add remaining oil, sauté peppers and onions 5 minutes until soft.',
      'Add garlic, cook 1 minute until fragrant.',
      'Add crushed tomatoes, oregano, salt, pepper. Stir well.',
      'Return chicken to pan, nestling into sauce.',
      'Reduce heat to medium-low, cover, simmer 15-20 minutes.',
      'Chicken should be fully cooked and sauce thickened.',
      'Garnish with fresh herbs. Serve over rice.',
      'Classic Italian hunter-style chicken - rustic and delicious!'
    ]
  },
  burrito: { 
    name: 'Burrito Bowl', 
    cuisine: 'mexican', 
    emoji: '🌯',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, diced',
      '3/4 cup brown rice, cooked',
      '1/2 cup black beans, drained',
      '1/2 bell pepper, diced',
      '1/4 onion, diced',
      '1/2 cup corn',
      '1/4 cup salsa',
      '1 tbsp taco seasoning',
      'Lime, cilantro, avocado (optional)'
    ],
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
    ],
    instructions: [
      'Cook rice according to package.',
      'Season chicken with taco seasoning.',
      'Cook chicken 8-10 minutes until done.',
      'Sauté pepper and onion until soft.',
      'Heat black beans and corn.',
      'Assemble bowl: rice, beans, chicken, veggies, corn.',
      'Top with salsa, cilantro, lime, avocado.'
    ]
  },
  mexican_rice: { 
    name: 'Mexican Chicken & Rice', 
    cuisine: 'mexican', 
    emoji: '🌶️',
    prepTime: '5 min',
    cookTime: '25 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, diced',
      '3/4 cup brown rice (dry)',
      '1 cup crushed tomatoes',
      '3/4 cup chicken broth',
      '1/4 onion, diced',
      '1/2 bell pepper, diced',
      '1 clove garlic, minced',
      '1 tbsp taco seasoning',
      'Cilantro, lime'
    ],
    instructions: [
      'Heat oil in skillet.',
      'Cook chicken with taco seasoning. Set aside.',
      'Sauté onion, pepper, garlic until soft.',
      'Add rice, toast 2 minutes.',
      'Add tomatoes and broth, bring to boil.',
      'Reduce heat, cover, simmer 20-25 minutes.',
      'Stir in chicken.',
      'Garnish cilantro and lime.'
    ]
  },
  fajitas: { 
    name: 'Chicken Fajitas', 
    cuisine: 'mexican', 
    emoji: '🌮',
    prepTime: '10 min',
    cookTime: '12 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '6 oz chicken breast, sliced thin',
      '1 bell pepper, sliced',
      '1/2 onion, sliced',
      '2 cloves garlic, minced',
      '1 tbsp olive oil',
      '1 tbsp fajita seasoning',
      'Juice of 1 lime',
      'Tortillas, salsa, cilantro'
    ],
    instructions: [
      'Marinate chicken in lime + fajita seasoning, 10+ min.',
      'Heat oil in skillet over high heat.',
      'Cook chicken 6-8 minutes. Set aside.',
      'Add pepper and onion, cook until charred.',
      'Add garlic, cook 1 minute.',
      'Return chicken, toss together.',
      'Squeeze fresh lime.',
      'Serve in tortillas with salsa and cilantro.'
    ]
  },
  lemon_garlic: { 
    name: 'Lemon Garlic Chicken & Rice', 
    cuisine: 'mediterranean', 
    emoji: '🍋',
    prepTime: '5 min',
    cookTime: '30 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '6 oz chicken thighs or breast',
      '3/4 cup brown rice (dry)',
      '1.5 cups chicken broth',
      '3 cloves garlic, minced',
      'Juice and zest of 1 lemon',
      '1 tbsp olive oil',
      'Fresh parsley or dill',
      'Salt, pepper, oregano'
    ],
    instructions: [
      'Season chicken with salt, pepper, oregano.',
      'Heat oil in small oven-safe pan.',
      'Sear chicken 4-5 min per side. Remove.',
      'Add garlic, cook 1 minute.',
      'Add rice, toast 2 minutes.',
      'Add broth and lemon juice, bring to boil.',
      'Place chicken on rice.',
      'Cover, bake at 375°F for 25 minutes.',
      'Garnish lemon zest and herbs.'
    ]
  },
  fried_rice: { 
    name: 'Chicken Fried Rice', 
    cuisine: 'asian', 
    emoji: '🍚',
    prepTime: '10 min',
    cookTime: '12 min',
    dietType: 'omnivore',
    allergens: ['soy', 'eggs'],
    servings: '1',
    ingredients: [
      '4 oz chicken breast, diced small',
      '1.5 cups cooked rice (day-old best)',
      '1 egg, beaten',
      '1/3 cup frozen peas and carrots',
      '2 green onions, sliced',
      '1 clove garlic, minced',
      '1 tbsp soy sauce',
      '1 tsp sesame oil',
      '1 tbsp vegetable oil'
    ],
    instructions: [
      'Heat 1/2 tbsp oil in wok over high heat.',
      'Scramble egg, remove.',
      'Add remaining oil, cook chicken. Set aside.',
      'Add garlic, cook 30 seconds.',
      'Add peas/carrots, stir-fry 2 minutes.',
      'Add rice, break clumps, stir-fry 3 minutes.',
      'Add soy sauce and sesame oil.',
      'Return chicken and egg, add green onions.',
      'Toss and serve.'
    ]
  },
  lentil_stew: { 
    name: 'Spicy Chicken & Lentil Stew', 
    cuisine: 'mediterranean', 
    emoji: '🍲',
    prepTime: '10 min',
    cookTime: '30 min',
    dietType: 'omnivore',
    allergens: [],
    servings: '1',
    ingredients: [
      '4 oz chicken breast, cubed',
      '1/2 cup red lentils (dry)',
      '1 cup crushed tomatoes',
      '1.5 cups chicken broth',
      '1/4 onion, diced',
      '2 cloves garlic, minced',
      '1 tsp cumin, paprika',
      '1/2 tsp turmeric',
      'Handful spinach, lemon, cilantro',
      'Olive oil, salt, pepper'
    ],
    instructions: [
      'Heat oil in pot, cook chicken until browned. Set aside.',
      'Sauté onion and garlic until soft.',
      'Add spices, toast 1 minute.',
      'Add lentils, tomatoes, broth. Bring to boil.',
      'Reduce heat, simmer 20-25 minutes until lentils soft.',
      'Return chicken, add spinach.',
      'Cook until spinach wilted.',
      'Squeeze lemon, garnish cilantro.',
      'Serve with rice or bread.'
    ]
  },
  
  // NEW RECIPES - COMFORT FOOD & ETHNIC VARIETY
  chicken_noodle: { 
    name: 'Classic Chicken Noodle Soup', 
    cuisine: 'american', 
    emoji: '🍜',
    prepTime: '10 min',
    cookTime: '25 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, diced`,
      `${Math.round(dinner.carbs * 0.6 / 37 * 2 * 10) / 10} oz red lentil pasta`,
      `2 cups chicken broth`,
      `1/2 cup mixed vegetables (carrots, celery)`,
      `1/4 onion, diced`,
      `2 cloves garlic, minced`,
      `1 tsp olive oil`,
      `Fresh herbs (optional)`,
      `Salt, pepper`
    ],
    instructions: [
      'Heat oil in pot, sauté onion and garlic 2 minutes.',
      'Add chicken, cook until browned.',
      'Add chicken broth, bring to boil.',
      'Add pasta and vegetables.',
      'Simmer 12-15 minutes until pasta tender.',
      'Season with salt, pepper, herbs.',
      'Serve hot in a bowl.'
    ]
  },
  turkey_chili: { 
    name: 'Turkey Black Bean Chili', 
    cuisine: 'american', 
    emoji: '🌶️',
    prepTime: '10 min',
    cookTime: '30 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein * 0.7 / 31 * 4 * 10) / 10} oz ground turkey`,
      `1 cup black beans (canned, drained)`,
      `1 cup crushed tomatoes`,
      `1/2 bell pepper, diced`,
      `1/4 onion, diced`,
      `2 cloves garlic, minced`,
      `1 tbsp olive oil`,
      `2 tsp chili powder`,
      `1 tsp cumin`,
      `${Math.round(dinner.carbs * 0.3 / 45 * 1.5 * 10) / 10} oz rice (optional, for serving)`,
      `Salt, hot sauce`
    ],
    instructions: [
      'Heat oil in pot, cook ground turkey until browned.',
      'Add onion, pepper, garlic, cook 3 minutes.',
      'Add spices, toast 1 minute.',
      'Add crushed tomatoes and black beans.',
      'Simmer 20 minutes, stirring occasionally.',
      'Season with salt and hot sauce to taste.',
      'Serve with rice or eat as stew.'
    ]
  },
  tuna_rice: { 
    name: 'Tuna & Egg Rice Bowl', 
    cuisine: 'asian', 
    emoji: '🍚',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['eggs'],
    getIngredients: (dinner) => [
      `1 can (5oz) tuna, drained`,
      `2 eggs, beaten`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz rice (cooked)`,
      `1/2 cup mixed vegetables`,
      `2 green onions, sliced`,
      `2 cloves garlic, minced`,
      `2 tbsp soy sauce`,
      `1 tbsp olive oil`,
      `1/2 tsp sesame oil (or olive oil)`
    ],
    instructions: [
      'Heat 1/2 tbsp oil in wok, scramble eggs. Set aside.',
      'Add remaining oil, sauté garlic 30 seconds.',
      'Add vegetables, stir-fry 3 minutes.',
      'Add rice, break up clumps.',
      'Add tuna, soy sauce, stir-fry 2 minutes.',
      'Return eggs, add green onions.',
      'Drizzle with sesame oil, toss and serve.'
    ]
  },
  greek_bowl: { 
    name: 'Greek Chicken Quinoa Bowl', 
    cuisine: 'mediterranean', 
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `${Math.round(dinner.carbs * 0.6 / 39 * 1.5 * 10) / 10} oz quinoa (dry)`,
      `1 cup spinach`,
      `1/2 cup tomatoes, diced`,
      `1/4 onion, diced`,
      `3 cloves garlic, minced`,
      `2 tbsp olive oil`,
      `1 tbsp balsamic vinegar`,
      `Greek yogurt (2 tbsp, optional)`,
      `Oregano, salt, pepper`
    ],
    instructions: [
      'Cook quinoa according to package. Set aside.',
      'Season chicken with oregano, salt, pepper.',
      'Heat 1 tbsp oil, cook chicken 6-7 min per side. Slice.',
      'Sauté garlic, onion in remaining oil.',
      'Add spinach, cook until wilted.',
      'Assemble bowl: quinoa, veggies, chicken.',
      'Top with tomatoes, drizzle oil and vinegar.',
      'Add dollop of Greek yogurt if desired.'
    ]
  },
  chicken_broccoli_stirfry: { 
    name: 'Chicken & Broccoli Stir-Fry', 
    cuisine: 'asian', 
    emoji: '🥦',
    prepTime: '10 min',
    cookTime: '12 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, sliced thin`,
      `1.5 cups broccoli florets`,
      `1/2 bell pepper, sliced`,
      `1/4 onion, sliced`,
      `3 cloves garlic, minced`,
      `2 tbsp soy sauce`,
      `1 tbsp olive oil`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz rice`,
      `1/2 tsp hot sauce (optional)`,
      `Salt, pepper`
    ],
    instructions: [
      'Cook rice according to package.',
      'Heat oil in wok over high heat.',
      'Stir-fry chicken until cooked, 5-6 minutes. Set aside.',
      'Add broccoli, peppers, onions, stir-fry 4 minutes.',
      'Add garlic, cook 1 minute.',
      'Return chicken, add soy sauce and hot sauce.',
      'Toss everything together.',
      'Serve over rice.'
    ]
  },
  turkey_meatballs: { 
    name: 'Turkey Meatballs Marinara', 
    cuisine: 'italian', 
    emoji: '🍝',
    prepTime: '15 min',
    cookTime: '25 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy', 'eggs'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz ground turkey`,
      `${Math.round(dinner.carbs * 0.6 / 37 * 2 * 10) / 10} oz red lentil pasta`,
      `1 cup crushed tomatoes`,
      `1 egg`,
      `2 tbsp oats (as binder)`,
      `1/4 onion, minced`,
      `3 cloves garlic, minced`,
      `1 tbsp olive oil`,
      `Italian seasoning, salt, pepper`
    ],
    instructions: [
      'Mix turkey, egg, oats, half the garlic, salt, pepper.',
      'Form into 6-8 meatballs.',
      'Heat oil in pan, brown meatballs all sides. Set aside.',
      'In same pan, sauté onion and remaining garlic.',
      'Add crushed tomatoes and Italian seasoning.',
      'Return meatballs, simmer 15 minutes.',
      'Meanwhile, cook pasta.',
      'Serve meatballs and sauce over pasta.'
    ]
  },
  southwest_bowl: { 
    name: 'Southwest Chicken Quinoa Bowl', 
    cuisine: 'mexican', 
    emoji: '🌾',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein * 0.8 / 31 * 4 * 10) / 10} oz chicken breast, diced`,
      `${Math.round(dinner.carbs * 0.5 / 39 * 1.5 * 10) / 10} oz quinoa (dry)`,
      `1/2 cup black beans`,
      `1/2 bell pepper, diced`,
      `1/4 onion, diced`,
      `1/2 cup tomatoes, diced`,
      `2 cloves garlic, minced`,
      `1 tbsp olive oil`,
      `1 tsp cumin, chili powder`,
      `Hot sauce, salt`
    ],
    instructions: [
      'Cook quinoa according to package.',
      'Season chicken with cumin, chili powder, salt.',
      'Heat oil, cook chicken until done. Set aside.',
      'Sauté onion, pepper, garlic 3 minutes.',
      'Heat black beans.',
      'Assemble bowl: quinoa, beans, chicken, veggies.',
      'Top with fresh tomatoes and hot sauce.'
    ]
  },
  veggie_fried_rice: { 
    name: 'Veggie & Egg Fried Rice', 
    cuisine: 'asian', 
    emoji: '🥚',
    prepTime: '10 min',
    cookTime: '12 min',
    dietType: 'vegetarian',
    allergens: ['soy', 'eggs'],
    getIngredients: (dinner) => [
      `3 eggs, beaten`,
      `${Math.round(dinner.carbs * 0.65 / 45 * 1.5 * 10) / 10} oz rice (cooked, day-old best)`,
      `1 cup mixed frozen vegetables`,
      `1/4 onion, diced`,
      `3 cloves garlic, minced`,
      `2 green onions, sliced`,
      `2 tbsp soy sauce`,
      `1 tbsp olive oil`,
      `${Math.round(dinner.protein * 0.3 / 31 * 4 * 10) / 10} oz chicken, diced (optional, for extra protein)`,
      `Salt, pepper`
    ],
    instructions: [
      'Heat 1/2 tbsp oil in wok, scramble eggs. Set aside.',
      'Add remaining oil, cook chicken if using. Set aside.',
      'Sauté garlic and onion 1 minute.',
      'Add frozen vegetables, stir-fry 3 minutes.',
      'Add rice, break up clumps, stir-fry 3 minutes.',
      'Add soy sauce, toss to coat.',
      'Return eggs and chicken, add green onions.',
      'Toss everything and serve.'
    ]
  },
  chicken_spinach: { 
    name: 'Chicken Spinach Garlic Pasta', 
    cuisine: 'italian', 
    emoji: '🍝',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein * 0.85 / 31 * 4 * 10) / 10} oz chicken breast, cubed`,
      `${Math.round(dinner.carbs * 0.7 / 37 * 2 * 10) / 10} oz red lentil pasta`,
      `2 cups spinach`,
      `1 cup crushed tomatoes`,
      `5 cloves garlic, minced`,
      `2 tbsp olive oil`,
      `1/4 cup chicken broth`,
      `Italian seasoning, red pepper flakes`,
      `Salt, pepper`
    ],
    instructions: [
      'Cook pasta according to package, reserve 1/2 cup pasta water.',
      'Heat 1 tbsp oil, cook chicken until done. Set aside.',
      'Add remaining oil, sauté garlic until fragrant.',
      'Add crushed tomatoes, broth, Italian seasoning.',
      'Simmer 8 minutes.',
      'Add spinach, cook until wilted.',
      'Add pasta and chicken, toss.',
      'Add pasta water if needed. Season and serve.'
    ]
  },
  turkey_taco: { 
    name: 'Turkey Taco Rice Bowl', 
    cuisine: 'mexican', 
    emoji: '🌮',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'omnivore',
    allergens: [],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein * 0.75 / 31 * 4 * 10) / 10} oz ground turkey`,
      `${Math.round(dinner.carbs * 0.5 / 45 * 1.5 * 10) / 10} oz brown rice`,
      `1/2 cup black beans`,
      `1/2 cup tomatoes, diced`,
      `1/2 bell pepper, diced`,
      `1/4 onion, diced`,
      `2 cloves garlic, minced`,
      `1 tbsp olive oil`,
      `2 tsp taco seasoning`,
      `Greek yogurt (optional topping)`,
      `Hot sauce, salt`
    ],
    instructions: [
      'Cook rice according to package.',
      'Heat oil, cook ground turkey with taco seasoning.',
      'Add onion, pepper, garlic, cook 3 minutes.',
      'Heat black beans.',
      'Assemble bowl: rice, beans, turkey mixture.',
      'Top with fresh tomatoes.',
      'Add dollop of Greek yogurt and hot sauce.',
      'Mix and enjoy.'
    ]
  },
  thai_basil_chicken: { 
    name: 'Thai Basil Chicken (Pad Krapow)', 
    cuisine: 'asian', 
    emoji: '🌶️',
    prepTime: '10 min',
    cookTime: '10 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, thinly sliced`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz brown rice (dry)`,
      `1 bell pepper, sliced`,
      `1/4 onion, sliced`,
      `4 cloves garlic, minced`,
      `3 tbsp soy sauce`,
      `1 tbsp hot sauce or sriracha`,
      `1 tbsp olive oil`,
      `Fresh basil leaves (or dried basil)`,
      `1 tsp brown sugar (optional)`,
      `Red pepper flakes (optional, for extra heat)`
    ],
    instructions: [
      'Cook rice according to package directions.',
      'Heat oil in wok or large skillet over high heat.',
      'Add garlic, stir-fry 30 seconds until fragrant.',
      'Add chicken, stir-fry 4-5 minutes until cooked through.',
      'Add bell pepper and onion, stir-fry 2-3 minutes.',
      'Mix soy sauce, hot sauce, and sugar in small bowl.',
      'Pour sauce over chicken, toss to coat.',
      'Cook 1-2 minutes until sauce thickens slightly.',
      'Remove from heat, stir in fresh basil.',
      'Serve over rice with extra hot sauce if desired.',
      'Traditional Thai street food - spicy, savory, fast!'
    ]
  },
  ginger_scallion_chicken: { 
    name: 'Ginger Scallion Chicken', 
    cuisine: 'asian', 
    emoji: '🧄',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, sliced`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz brown rice (dry)`,
      `1.5 cups broccoli florets`,
      `4 cloves garlic, minced`,
      `2 tsp fresh ginger, minced (or 1 tsp ground)`,
      `1/4 onion, sliced`,
      `2.5 tbsp soy sauce`,
      `1 tbsp olive oil`,
      `Green onions/scallions (optional garnish)`,
      `Sesame seeds (optional)`
    ],
    instructions: [
      'Cook rice according to package.',
      'Mix ginger, garlic, and soy sauce in small bowl.',
      'Heat oil in large pan or wok over high heat.',
      'Stir-fry chicken until golden and cooked through, 5-6 minutes.',
      'Remove chicken, set aside.',
      'Add broccoli and onion to pan, stir-fry 3-4 minutes.',
      'Return chicken to pan.',
      'Pour ginger-garlic-soy mixture over everything.',
      'Toss to coat, cook 1-2 minutes.',
      'Serve over rice, garnish with scallions and sesame seeds.',
      'Simple Chinese-style dish with aromatic ginger and garlic!'
    ]
  },
  sesame_chicken: { 
    name: 'Sesame Chicken Bowl', 
    cuisine: 'asian', 
    emoji: '🥡',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['soy'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, cubed`,
      `${Math.round(dinner.carbs * 0.7 / 45 * 1.5 * 10) / 10} oz brown rice (dry)`,
      `1.5 cups broccoli florets`,
      `1/2 bell pepper, sliced`,
      `3 cloves garlic, minced`,
      `3 tbsp soy sauce`,
      `1 tbsp honey or brown sugar`,
      `1 tbsp olive oil`,
      `Sesame seeds (optional garnish)`,
      `Red pepper flakes (optional)`
    ],
    instructions: [
      'Cook rice according to package.',
      'Mix soy sauce, honey, and 1 tbsp water for sauce.',
      'Heat oil in pan over medium-high heat.',
      'Cook chicken until golden and cooked through, 6-7 minutes.',
      'Remove chicken, set aside.',
      'Add garlic, cook 30 seconds.',
      'Add broccoli and bell pepper, stir-fry 4-5 minutes.',
      'Return chicken to pan, pour sauce over.',
      'Toss to coat, cook 2 minutes until sauce thickens.',
      'Serve over rice, sprinkle with sesame seeds.',
      'American-Chinese takeout favorite made healthy!'
    ]
  },
  peanut_noodle_bowl: { 
    name: 'Peanut Noodle Bowl', 
    cuisine: 'asian', 
    emoji: '🥜',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'omnivore',
    allergens: ['nuts', 'soy', 'gluten'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein * 0.85 / 31 * 4 * 10) / 10} oz chicken breast, sliced`,
      `${Math.round(dinner.carbs * 0.7 / 37 * 2 * 10) / 10} oz red lentil pasta`,
      `3 tbsp peanut butter`,
      `3 tbsp soy sauce`,
      `1 bell pepper, sliced`,
      `1 cup broccoli florets`,
      `3 cloves garlic, minced`,
      `1/4 onion, sliced`,
      `1 tbsp olive oil`,
      `1 tsp sriracha or hot sauce (optional)`,
      `Lime juice (optional)`,
      `Crushed peanuts (optional garnish)`
    ],
    instructions: [
      'Cook pasta according to package directions.',
      'Make peanut sauce: mix peanut butter, soy sauce, 3 tbsp warm water, sriracha.',
      'Heat oil in large pan or wok over high heat.',
      'Stir-fry chicken until cooked through, 5-6 minutes. Remove.',
      'Add garlic, cook 30 seconds.',
      'Add vegetables, stir-fry 4-5 minutes until tender-crisp.',
      'Return chicken to pan.',
      'Add drained pasta and peanut sauce.',
      'Toss everything together over medium heat, 1-2 minutes.',
      'Add splash of pasta water if too thick.',
      'Garnish with crushed peanuts and lime juice.',
      'Thai-inspired comfort food - creamy, nutty, satisfying!'
    ]
  },
  
  // === VEGETARIAN RECIPES (Eggs/Dairy Allowed) ===
  veggie_power_bowl: {
    name: 'Veggie Power Bowl',
    cuisine: 'healthy',
    emoji: '🥗',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'vegetarian',
    allergens: ['eggs', 'dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 45;
      return [
        `${(4 * scale).toFixed(1)} oz cooked quinoa`,
        `${(2 * scale).toFixed(0)} large eggs`,
        `${(3 * scale).toFixed(1)} oz chickpeas`,
        `${(4 * scale).toFixed(1)} oz mixed greens`,
        `${(2 * scale).toFixed(1)} oz cherry tomatoes`,
        `${(1 * scale).toFixed(1)} oz feta cheese`,
        `${(0.5 * scale).toFixed(1)} tbsp olive oil`,
        `${(0.5 * scale).toFixed(1)} tbsp lemon juice`,
        `Salt, pepper, herbs to taste`
      ];
    },
    instructions: [
      'Cook quinoa according to package directions.',
      'Hard boil or scramble the eggs as preferred.',
      'Rinse and drain chickpeas.',
      'Toss mixed greens with olive oil and lemon juice.',
      'Layer bowl: quinoa base, then chickpeas, eggs, greens.',
      'Top with halved cherry tomatoes and crumbled feta.',
      'Season with salt, pepper, and fresh herbs.',
      'Complete protein from eggs + chickpeas + quinoa!'
    ]
  },
  
  spinach_mushroom_frittata: {
    name: 'Spinach Mushroom Frittata',
    cuisine: 'italian',
    emoji: '🍳',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'vegetarian',
    allergens: ['eggs', 'dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 42;
      return [
        `${(6 * scale).toFixed(0)} large eggs`,
        `${(2 * scale).toFixed(1)} oz shredded cheese`,
        `${(4 * scale).toFixed(1)} oz mushrooms, sliced`,
        `${(3 * scale).toFixed(1)} oz fresh spinach`,
        `${(2 * scale).toFixed(1)} oz diced onion`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Salt, pepper, garlic powder`
      ];
    },
    instructions: [
      'Preheat oven to 375°F.',
      'Heat oil in oven-safe skillet, sauté onions 3 min.',
      'Add mushrooms, cook until golden, 5 min.',
      'Add spinach, cook until wilted.',
      'Whisk eggs with cheese, salt, pepper.',
      'Pour over vegetables, cook 2 min without stirring.',
      'Transfer to oven, bake 12-15 min until set.',
      'Slice and serve - perfect for meal prep!'
    ]
  },
  
  lentil_dal_yogurt: {
    name: 'Lentil Dal with Greek Yogurt',
    cuisine: 'indian',
    emoji: '🍲',
    prepTime: '10 min',
    cookTime: '25 min',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 40;
      return [
        `${(6 * scale).toFixed(1)} oz red lentils`,
        `${(4 * scale).toFixed(1)} oz Greek yogurt`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(2 * scale).toFixed(1)} oz diced tomatoes`,
        `${(1 * scale).toFixed(1)} oz diced onion`,
        `${(0.5 * scale).toFixed(1)} oz garlic, minced`,
        `${(1 * scale).toFixed(1)} tbsp curry powder`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Salt to taste`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Heat oil, sauté onion and garlic 3 min.',
      'Add curry powder, toast 30 seconds.',
      'Add lentils, diced tomatoes, 2 cups water.',
      'Simmer 20-25 min until lentils are soft.',
      'Season with salt, stir in half the yogurt.',
      'Serve over rice, top with remaining yogurt.',
      'High protein from lentils + Greek yogurt!'
    ]
  },
  
  black_bean_quesadillas: {
    name: 'Black Bean & Cheese Quesadillas',
    cuisine: 'mexican',
    emoji: '🌮',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'vegetarian',
    allergens: ['dairy', 'gluten'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 38;
      return [
        `${(6 * scale).toFixed(1)} oz black beans, drained`,
        `${(3 * scale).toFixed(1)} oz shredded cheese`,
        `${(2 * scale).toFixed(0)} whole wheat tortillas`,
        `${(2 * scale).toFixed(1)} oz bell peppers, diced`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(2 * scale).toFixed(1)} oz salsa`,
        `${(2 * scale).toFixed(1)} oz Greek yogurt (as sour cream)`,
        `Olive oil spray`
      ];
    },
    instructions: [
      'Mash half the black beans, leave rest whole.',
      'Sauté peppers and onions in pan 5 min.',
      'Spread beans on half of each tortilla.',
      'Top with cheese and sautéed vegetables.',
      'Fold tortillas in half.',
      'Cook in lightly oiled pan 3 min per side until golden.',
      'Slice and serve with salsa and yogurt.',
      'Complete protein from beans + dairy!'
    ]
  },
  
  mediterranean_chickpea_pasta: {
    name: 'Mediterranean Chickpea Pasta',
    cuisine: 'mediterranean',
    emoji: '🍝',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 44;
      return [
        `${(5 * scale).toFixed(1)} oz chickpea pasta`,
        `${(2 * scale).toFixed(1)} oz feta cheese`,
        `${(3 * scale).toFixed(1)} oz cherry tomatoes, halved`,
        `${(2 * scale).toFixed(1)} oz kalamata olives`,
        `${(2 * scale).toFixed(1)} oz fresh spinach`,
        `${(1 * scale).toFixed(1)} oz garlic, minced`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Fresh basil, lemon juice`
      ];
    },
    instructions: [
      'Cook chickpea pasta according to package.',
      'Reserve 1/2 cup pasta water.',
      'Heat olive oil, sauté garlic 1 min.',
      'Add cherry tomatoes, cook until blistered, 5 min.',
      'Add spinach, wilt for 2 min.',
      'Toss pasta with vegetables and olives.',
      'Add pasta water to create light sauce.',
      'Top with crumbled feta and fresh basil.',
      'High protein from chickpea pasta!'
    ]
  },
  
  // === VEGAN RECIPES (100% Plant-Based) ===
  lentil_sweet_potato_bowl: {
    name: 'Lentil & Sweet Potato Buddha Bowl',
    cuisine: 'healthy',
    emoji: '🥙',
    prepTime: '15 min',
    cookTime: '25 min',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 42;
      return [
        `${(7 * scale).toFixed(1)} oz cooked lentils`,
        `${(3 * scale).toFixed(1)} oz quinoa`,
        `${(5 * scale).toFixed(1)} oz sweet potato, cubed`,
        `${(3 * scale).toFixed(1)} oz kale`,
        `${(2 * scale).toFixed(1)} oz tahini`,
        `${(1 * scale).toFixed(1)} tbsp nutritional yeast`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Lemon juice, salt, pepper`
      ];
    },
    instructions: [
      'Roast sweet potato cubes at 425°F, 20-25 min.',
      'Cook quinoa and lentils according to packages.',
      'Massage kale with lemon juice and salt.',
      'Make tahini sauce: mix tahini, lemon, nutritional yeast, water.',
      'Assemble bowl: quinoa and lentils base.',
      'Top with roasted sweet potato and massaged kale.',
      'Drizzle with tahini sauce.',
      'Complete protein from lentils + quinoa combo!'
    ]
  },
  
  tofu_scramble_black_beans: {
    name: 'Tofu Scramble with Black Beans',
    cuisine: 'healthy',
    emoji: '🍳',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'vegan',
    allergens: ['soy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 40;
      return [
        `${(8 * scale).toFixed(1)} oz firm tofu, crumbled`,
        `${(4 * scale).toFixed(1)} oz black beans`,
        `${(4 * scale).toFixed(1)} oz brown rice`,
        `${(2 * scale).toFixed(1)} oz bell peppers, diced`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(1 * scale).toFixed(1)} tbsp nutritional yeast`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `1/2 tsp turmeric, cumin, garlic powder`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Heat oil, sauté onions and peppers 5 min.',
      'Crumble tofu into pan, add turmeric for color.',
      'Add nutritional yeast, cumin, garlic powder.',
      'Cook 5-7 min, stirring, until golden.',
      'Add black beans, heat through.',
      'Serve over brown rice.',
      'Complete protein from tofu + beans!'
    ]
  },
  
  tempeh_stir_fry: {
    name: 'Tempeh Stir-Fry Bowl',
    cuisine: 'asian',
    emoji: '🥘',
    prepTime: '15 min',
    cookTime: '15 min',
    dietType: 'vegan',
    allergens: ['soy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 43;
      return [
        `${(8 * scale).toFixed(1)} oz tempeh, cubed`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(4 * scale).toFixed(1)} oz broccoli florets`,
        `${(2 * scale).toFixed(1)} oz bell peppers, sliced`,
        `${(2 * scale).toFixed(1)} oz snap peas`,
        `${(1 * scale).toFixed(1)} tbsp sesame oil`,
        `${(1 * scale).toFixed(1)} tbsp soy sauce`,
        `Ginger, garlic, sriracha`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Steam tempeh 10 min to remove bitterness.',
      'Heat sesame oil in wok or large pan.',
      'Stir-fry tempeh until golden, 5 min. Remove.',
      'Add ginger and garlic, cook 30 sec.',
      'Add vegetables, stir-fry 5-6 min.',
      'Return tempeh, add soy sauce.',
      'Serve over rice, drizzle with sriracha.',
      'Complete protein from fermented tempeh!'
    ]
  },
  
  chickpea_curry_quinoa: {
    name: 'Chickpea Curry with Quinoa',
    cuisine: 'indian',
    emoji: '🍛',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 38;
      return [
        `${(6 * scale).toFixed(1)} oz chickpeas`,
        `${(4 * scale).toFixed(1)} oz quinoa`,
        `${(3 * scale).toFixed(1)} oz diced tomatoes`,
        `${(2 * scale).toFixed(1)} oz spinach`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(0.5 * scale).toFixed(1)} oz garlic, minced`,
        `${(1 * scale).toFixed(1)} tbsp curry powder`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Salt, pepper`
      ];
    },
    instructions: [
      'Cook quinoa according to package.',
      'Heat oil, sauté onion and garlic 3 min.',
      'Add curry powder, toast 30 seconds.',
      'Add chickpeas, tomatoes, 1 cup water.',
      'Simmer 15 min until thickened.',
      'Stir in spinach until wilted.',
      'Season with salt and pepper.',
      'Serve over quinoa.',
      'Complete protein from chickpeas + quinoa!'
    ]
  },
  
  peanut_tofu_rice: {
    name: 'Peanut Tofu Rice Bowl',
    cuisine: 'asian',
    emoji: '🥜',
    prepTime: '15 min',
    cookTime: '20 min',
    dietType: 'vegan',
    allergens: ['soy', 'nuts'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 45;
      return [
        `${(8 * scale).toFixed(1)} oz extra-firm tofu, cubed`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(2 * scale).toFixed(1)} oz peanut butter`,
        `${(3 * scale).toFixed(1)} oz edamame`,
        `${(2 * scale).toFixed(1)} oz carrots, sliced`,
        `${(2 * scale).toFixed(1)} oz broccoli`,
        `${(1 * scale).toFixed(1)} tbsp soy sauce`,
        `Sriracha, lime juice`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Press tofu to remove moisture, cube.',
      'Make peanut sauce: peanut butter, soy sauce, water, sriracha.',
      'Pan-fry tofu until golden, 8-10 min.',
      'Steam or stir-fry vegetables 5 min.',
      'Cook edamame according to package.',
      'Assemble: rice base, tofu, vegetables, edamame.',
      'Drizzle with peanut sauce and lime juice.',
      'High protein from tofu + edamame + peanut butter!'
    ]
  },
  
  // === ADDITIONAL VEGETARIAN RECIPES (Batch 2) ===
  greek_lentil_bowl: {
    name: 'Greek Lentil Bowl with Feta',
    cuisine: 'mediterranean',
    emoji: '🥙',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 41;
      return [
        `${(6 * scale).toFixed(1)} oz cooked lentils`,
        `${(3 * scale).toFixed(1)} oz feta cheese`,
        `${(4 * scale).toFixed(1)} oz quinoa`,
        `${(3 * scale).toFixed(1)} oz cucumber, diced`,
        `${(2 * scale).toFixed(1)} oz cherry tomatoes, halved`,
        `${(2 * scale).toFixed(1)} oz kalamata olives`,
        `${(2 * scale).toFixed(1)} oz red onion, diced`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `${(1 * scale).toFixed(1)} tbsp lemon juice`,
        `Fresh oregano, salt, pepper`
      ];
    },
    instructions: [
      'Cook quinoa according to package directions.',
      'Cook lentils until tender, about 20 min.',
      'Combine cucumber, tomatoes, olives, onion.',
      'Make dressing: olive oil, lemon juice, oregano.',
      'Assemble bowl: quinoa and lentils base.',
      'Top with veggie mixture.',
      'Crumble feta on top, drizzle with dressing.',
      'Complete protein from lentils + quinoa!'
    ]
  },
  
  egg_white_veggie_wrap: {
    name: 'Egg White Veggie Breakfast Wrap',
    cuisine: 'american',
    emoji: '🌯',
    prepTime: '8 min',
    cookTime: '10 min',
    dietType: 'vegetarian',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 43;
      return [
        `${(8 * scale).toFixed(0)} egg whites (or 4 whole eggs)`,
        `${(2 * scale).toFixed(1)} oz shredded cheese`,
        `${(2 * scale).toFixed(0)} whole wheat tortillas`,
        `${(3 * scale).toFixed(1)} oz black beans`,
        `${(2 * scale).toFixed(1)} oz bell peppers, diced`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(2 * scale).toFixed(1)} oz salsa`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Cumin, paprika, salt`
      ];
    },
    instructions: [
      'Sauté peppers and onions in oil 5 min.',
      'Add black beans, cumin, paprika, heat through.',
      'Scramble egg whites until just set.',
      'Warm tortillas in dry pan 30 sec per side.',
      'Layer eggs, bean mixture, cheese on tortillas.',
      'Fold into wraps, grill 2 min per side.',
      'Serve with salsa on the side.',
      'High protein breakfast or anytime meal!'
    ]
  },
  
  caprese_quinoa_bake: {
    name: 'Caprese Quinoa Bake',
    cuisine: 'italian',
    emoji: '🍅',
    prepTime: '12 min',
    cookTime: '25 min',
    dietType: 'vegetarian',
    allergens: ['dairy', 'eggs'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 39;
      return [
        `${(5 * scale).toFixed(1)} oz quinoa`,
        `${(3 * scale).toFixed(0)} large eggs`,
        `${(3 * scale).toFixed(1)} oz mozzarella, cubed`,
        `${(4 * scale).toFixed(1)} oz cherry tomatoes, halved`,
        `${(2 * scale).toFixed(1)} oz fresh basil`,
        `${(2 * scale).toFixed(1)} oz Greek yogurt`,
        `${(1 * scale).toFixed(1)} oz parmesan, grated`,
        `${(2 * scale).toFixed(0)} cloves garlic, minced`,
        `Balsamic glaze, salt, pepper`
      ];
    },
    instructions: [
      'Preheat oven to 375°F.',
      'Cook quinoa, let cool slightly.',
      'Whisk eggs, Greek yogurt, parmesan, garlic.',
      'Mix quinoa with egg mixture.',
      'Fold in tomatoes, mozzarella, torn basil.',
      'Pour into greased baking dish.',
      'Bake 25 min until set and golden.',
      'Drizzle with balsamic glaze before serving.',
      'Italian-inspired protein-packed casserole!'
    ]
  },
  
  spicy_bean_enchiladas: {
    name: 'Spicy Bean & Cheese Enchiladas',
    cuisine: 'mexican',
    emoji: '🌮',
    prepTime: '15 min',
    cookTime: '25 min',
    dietType: 'vegetarian',
    allergens: ['dairy', 'gluten'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 40;
      return [
        `${(7 * scale).toFixed(1)} oz pinto beans, mashed`,
        `${(4 * scale).toFixed(1)} oz shredded cheese`,
        `${(3 * scale).toFixed(0)} whole wheat tortillas`,
        `${(3 * scale).toFixed(1)} oz Greek yogurt (as sour cream)`,
        `${(4 * scale).toFixed(1)} oz enchilada sauce`,
        `${(2 * scale).toFixed(1)} oz bell peppers, diced`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(2 * scale).toFixed(1)} oz corn kernels`,
        `Cumin, chili powder, cilantro`
      ];
    },
    instructions: [
      'Preheat oven to 375°F.',
      'Sauté peppers and onions 5 min.',
      'Mix mashed beans, corn, spices, half the cheese.',
      'Spread bean mixture on tortillas, roll up.',
      'Place seam-side down in baking dish.',
      'Pour enchilada sauce over, top with remaining cheese.',
      'Bake 20-25 min until bubbly.',
      'Serve with Greek yogurt and cilantro.',
      'Complete protein from beans + dairy!'
    ]
  },
  
  paneer_tikka_bowl: {
    name: 'Paneer Tikka Bowl',
    cuisine: 'indian',
    emoji: '🍛',
    prepTime: '15 min',
    cookTime: '20 min',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 44;
      return [
        `${(8 * scale).toFixed(1)} oz paneer, cubed`,
        `${(4 * scale).toFixed(1)} oz Greek yogurt`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(2 * scale).toFixed(1)} oz bell peppers`,
        `${(2 * scale).toFixed(1)} oz onion`,
        `${(2 * scale).toFixed(1)} oz tomatoes`,
        `${(1 * scale).toFixed(1)} tbsp tikka masala spice`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Fresh cilantro, lime`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Marinate paneer in yogurt and tikka spices 10 min.',
      'Heat oil in pan, cook paneer until golden, 8 min.',
      'Remove paneer, sauté peppers and onions 5 min.',
      'Add tomatoes, cook until soft.',
      'Return paneer to pan, coat with vegetables.',
      'Serve over rice with cilantro and lime.',
      'High protein from paneer (Indian cottage cheese)!'
    ]
  },
  
  // === ADDITIONAL VEGAN RECIPES (Batch 2) ===
  seitan_fajita_bowl: {
    name: 'Seitan Fajita Bowl',
    cuisine: 'mexican',
    emoji: '🌶️',
    prepTime: '12 min',
    cookTime: '15 min',
    dietType: 'vegan',
    allergens: ['gluten', 'soy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 48;
      return [
        `${(9 * scale).toFixed(1)} oz seitan, sliced`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(3 * scale).toFixed(1)} oz black beans`,
        `${(3 * scale).toFixed(1)} oz bell peppers, sliced`,
        `${(2 * scale).toFixed(1)} oz onion, sliced`,
        `${(2 * scale).toFixed(1)} oz corn`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `${(1 * scale).toFixed(1)} tbsp soy sauce`,
        `Fajita seasoning, lime, cilantro`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Season seitan with fajita spices.',
      'Heat oil in pan, cook seitan until crispy, 5-6 min.',
      'Remove, sauté peppers and onions 5 min.',
      'Add corn and black beans, heat through.',
      'Add seitan back, toss with soy sauce.',
      'Serve over rice with lime and cilantro.',
      'Seitan provides 25g protein per 100g!'
    ]
  },
  
  thai_red_curry_tofu: {
    name: 'Thai Red Curry Tofu',
    cuisine: 'asian',
    emoji: '🍜',
    prepTime: '10 min',
    cookTime: '20 min',
    dietType: 'vegan',
    allergens: ['soy'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 41;
      return [
        `${(10 * scale).toFixed(1)} oz firm tofu, cubed`,
        `${(5 * scale).toFixed(1)} oz brown rice`,
        `${(3 * scale).toFixed(1)} oz coconut milk (light)`,
        `${(2 * scale).toFixed(1)} tbsp red curry paste`,
        `${(3 * scale).toFixed(1)} oz broccoli`,
        `${(2 * scale).toFixed(1)} oz bell peppers`,
        `${(2 * scale).toFixed(1)} oz bamboo shoots`,
        `${(1 * scale).toFixed(1)} tbsp soy sauce`,
        `Fresh basil, lime`
      ];
    },
    instructions: [
      'Cook brown rice according to package.',
      'Press tofu to remove excess moisture.',
      'Pan-fry tofu until golden, set aside.',
      'Heat curry paste in pan 1 min.',
      'Add coconut milk, bring to simmer.',
      'Add vegetables, cook 8-10 min.',
      'Add tofu and soy sauce, heat through.',
      'Serve over rice with basil and lime.',
      'Authentic Thai flavors with complete protein!'
    ]
  },
  
  white_bean_tuscan_stew: {
    name: 'White Bean Tuscan Stew',
    cuisine: 'italian',
    emoji: '🥘',
    prepTime: '10 min',
    cookTime: '25 min',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 36;
      return [
        `${(8 * scale).toFixed(1)} oz white beans (cannellini)`,
        `${(4 * scale).toFixed(1)} oz quinoa`,
        `${(3 * scale).toFixed(1)} oz kale, chopped`,
        `${(2 * scale).toFixed(1)} oz diced tomatoes`,
        `${(2 * scale).toFixed(1)} oz carrots, diced`,
        `${(1 * scale).toFixed(1)} oz celery, diced`,
        `${(3 * scale).toFixed(0)} cloves garlic, minced`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Italian seasoning, vegetable broth`
      ];
    },
    instructions: [
      'Cook quinoa separately.',
      'Heat oil, sauté garlic, carrots, celery 5 min.',
      'Add tomatoes, beans, 2 cups broth.',
      'Add Italian seasoning, simmer 15 min.',
      'Stir in kale, cook until wilted, 3 min.',
      'Adjust consistency with more broth if needed.',
      'Serve over quinoa.',
      'Complete protein from beans + quinoa combo!'
    ]
  },
  
  moroccan_chickpea_tagine: {
    name: 'Moroccan Chickpea Tagine',
    cuisine: 'mediterranean',
    emoji: '🫔',
    prepTime: '12 min',
    cookTime: '25 min',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 37;
      return [
        `${(7 * scale).toFixed(1)} oz chickpeas`,
        `${(4 * scale).toFixed(1)} oz quinoa`,
        `${(4 * scale).toFixed(1)} oz sweet potato, cubed`,
        `${(2 * scale).toFixed(1)} oz diced tomatoes`,
        `${(2 * scale).toFixed(1)} oz dried apricots, chopped`,
        `${(1 * scale).toFixed(1)} oz onion, diced`,
        `${(1 * scale).toFixed(1)} tbsp olive oil`,
        `Cumin, cinnamon, turmeric, paprika`,
        `Fresh cilantro, almonds (optional)`
      ];
    },
    instructions: [
      'Cook quinoa according to package.',
      'Heat oil, sauté onion 3 min.',
      'Add spices (cumin, cinnamon, turmeric), toast 1 min.',
      'Add sweet potato, chickpeas, tomatoes, 1 cup water.',
      'Simmer 20 min until sweet potato is tender.',
      'Stir in apricots last 5 min.',
      'Serve over quinoa with cilantro.',
      'Exotic Moroccan flavors with complete protein!'
    ]
  },
  
  asian_edamame_noodle_bowl: {
    name: 'Asian Edamame Noodle Bowl',
    cuisine: 'asian',
    emoji: '🍲',
    prepTime: '10 min',
    cookTime: '15 min',
    dietType: 'vegan',
    allergens: ['soy', 'gluten'],
    getIngredients: (dinner) => {
      const scale = dinner.protein / 39;
      return [
        `${(6 * scale).toFixed(1)} oz edamame, shelled`,
        `${(4 * scale).toFixed(1)} oz soba noodles`,
        `${(2 * scale).toFixed(1)} oz firm tofu, cubed`,
        `${(3 * scale).toFixed(1)} oz bok choy`,
        `${(2 * scale).toFixed(1)} oz mushrooms`,
        `${(2 * scale).toFixed(1)} oz carrots, julienned`,
        `${(1 * scale).toFixed(1)} tbsp sesame oil`,
        `${(1 * scale).toFixed(1)} tbsp soy sauce`,
        `Ginger, garlic, green onions, sesame seeds`
      ];
    },
    instructions: [
      'Cook soba noodles according to package.',
      'Cook edamame in boiling water 5 min.',
      'Heat sesame oil, sauté ginger and garlic 1 min.',
      'Add tofu, cook until golden, 5 min.',
      'Add mushrooms, carrots, bok choy, stir-fry 4 min.',
      'Toss noodles with vegetables and tofu.',
      'Add edamame and soy sauce.',
      'Garnish with green onions and sesame seeds.',
      'Double protein from edamame + tofu!'
    ]
  },
  
  // NEW BUDGET TIER RECIPES ($3.00-$4.00)
  chickpea_curry_bowl: {
    name: 'Chickpea Curry Bowl',
    cuisine: 'indian',
    dietType: 'vegan',
    allergens: [],
    servings: 1,
    prepTime: 15,
    protein: 18,
    carbs: 58,
    fat: 12,
    calories: 410,
    ingredients: ['chickpeas', 'sweet potato', 'spinach', 'coconut milk', 'curry powder', 'onion', 'brown rice'],
    instructions: [
      'Cook brown rice according to package.',
      'Dice sweet potato, microwave 5 min until tender.',
      'Sauté diced onion 3 min.',
      'Add curry powder, cook 30 sec until fragrant.',
      'Add chickpeas, sweet potato, coconut milk.',
      'Simmer 8 min until thickened.',
      'Stir in fresh spinach until wilted.',
      'Serve over rice. Quick & budget-friendly!'
    ]
  },
  
  black_bean_burrito_bowl: {
    name: 'Black Bean Burrito Bowl',
    cuisine: 'mexican',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    servings: 1,
    prepTime: 12,
    protein: 20,
    carbs: 62,
    fat: 14,
    calories: 450,
    ingredients: ['black beans', 'brown rice', 'corn', 'salsa', 'avocado', 'cheese', 'lime'],
    instructions: [
      'Cook brown rice according to package.',
      'Heat black beans with taco seasoning.',
      'Warm corn in microwave 1 min.',
      'Build bowl: rice, beans, corn, salsa.',
      'Top with diced avocado and shredded cheese.',
      'Squeeze fresh lime juice over everything.',
      'Mix and enjoy! Classic burrito flavors.'
    ]
  },
  
  lentil_vegetable_soup: {
    name: 'Hearty Lentil Soup',
    cuisine: 'healthy',
    dietType: 'vegan',
    allergens: [],
    servings: 1,
    prepTime: 20,
    protein: 16,
    carbs: 48,
    fat: 8,
    calories: 340,
    ingredients: ['lentils', 'carrots', 'celery', 'onion', 'tomatoes_canned', 'vegetable_broth', 'spinach'],
    instructions: [
      'Dice carrots, celery, onion.',
      'Sauté vegetables in olive oil 5 min.',
      'Add lentils, diced tomatoes, vegetable broth.',
      'Bring to boil, reduce heat, simmer 15 min.',
      'Lentils should be tender.',
      'Stir in spinach until wilted.',
      'Season with salt and pepper.',
      'Filling soup, perfect for meal prep!'
    ]
  },
  
  egg_fried_rice: {
    name: 'Egg Fried Rice',
    cuisine: 'asian',
    dietType: 'vegetarian',
    allergens: ['eggs', 'soy'],
    servings: 1,
    prepTime: 10,
    protein: 22,
    carbs: 54,
    fat: 16,
    calories: 450,
    ingredients: ['brown rice', 'eggs', 'frozen_veg', 'soy_sauce', 'sesame_oil', 'green onions'],
    instructions: [
      'Cook rice ahead, use day-old rice for best texture.',
      'Scramble 3 eggs in sesame oil, set aside.',
      'Heat more oil, add frozen mixed vegetables.',
      'Stir-fry vegetables 3-4 min.',
      'Add rice, break up clumps, stir-fry 3 min.',
      'Add eggs back in, mix well.',
      'Season with soy sauce and sesame oil.',
      'Garnish with green onions. Restaurant quality!'
    ]
  },
  
  tofu_scramble_wrap: {
    name: 'Tofu Scramble Breakfast Wrap',
    cuisine: 'american',
    dietType: 'vegan',
    allergens: ['gluten'],
    servings: 1,
    prepTime: 12,
    protein: 20,
    carbs: 42,
    fat: 18,
    calories: 420,
    ingredients: ['tofu', 'tortilla', 'spinach', 'bell_peppers', 'onion', 'nutritional_yeast', 'salsa'],
    instructions: [
      'Crumble firm tofu with fork.',
      'Sauté diced onion and bell pepper 3 min.',
      'Add crumbled tofu, cook 5 min.',
      'Season with turmeric, nutritional yeast, salt.',
      'Add spinach, cook until wilted.',
      'Warm tortilla 20 seconds.',
      'Fill with tofu scramble, top with salsa.',
      'Roll up and enjoy! Protein-packed breakfast.'
    ]
  },
  
  // NEW STANDARD TIER RECIPES ($4.00-$4.80)
  turkey_chili: {
    name: 'Turkey Chili Bowl',
    cuisine: 'american',
    dietType: 'omnivore',
    allergens: [],
    servings: 1,
    prepTime: 18,
    protein: 38,
    carbs: 42,
    fat: 14,
    calories: 460,
    ingredients: ['ground_turkey', 'black_beans', 'pinto_beans', 'tomatoes_canned', 'onion', 'bell_peppers', 'chili_seasoning'],
    instructions: [
      'Brown 8oz ground turkey in large pot.',
      'Add diced onion and bell peppers, cook 4 min.',
      'Add both beans (drained), diced tomatoes.',
      'Season with chili powder, cumin, paprika.',
      'Simmer 12 min to blend flavors.',
      'Adjust thickness with water if needed.',
      'Top with green onions or Greek yogurt.',
      'Lean protein, high fiber, very filling!'
    ]
  },
  
  chicken_fajita_bowl: {
    name: 'Chicken Fajita Bowl',
    cuisine: 'mexican',
    dietType: 'omnivore',
    allergens: [],
    servings: 1,
    prepTime: 15,
    protein: 42,
    carbs: 48,
    fat: 16,
    calories: 510,
    ingredients: ['chicken_breast', 'bell_peppers', 'onion', 'brown_rice', 'fajita_seasoning', 'salsa', 'avocado'],
    instructions: [
      'Cook brown rice according to package.',
      'Slice chicken breast into strips.',
      'Slice bell peppers and onion into strips.',
      'Heat oil, cook chicken 5-6 min until done.',
      'Add peppers and onions, cook 4 min.',
      'Season with fajita seasoning.',
      'Serve over rice with salsa and avocado.',
      'Classic fajita flavors, bowl style!'
    ]
  },
  
  greek_chicken_pita: {
    name: 'Greek Chicken Pita',
    cuisine: 'mediterranean',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    servings: 1,
    prepTime: 14,
    protein: 40,
    carbs: 44,
    fat: 18,
    calories: 510,
    ingredients: ['chicken_breast', 'pita_bread', 'cucumber', 'tomato', 'red_onion', 'feta', 'tzatziki'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast`,
      `2 pita breads`,
      `1/2 cucumber, diced`,
      `1 tomato, diced`,
      `1/4 red onion, sliced`,
      `1/4 cup feta cheese`,
      `1/4 cup tzatziki sauce`,
      `Lettuce, fresh herbs`
    ],
    instructions: [
      'Season chicken with oregano, garlic powder, salt.',
      'Grill or pan-cook chicken 6-7 min per side.',
      'Dice cucumber, tomato, red onion.',
      'Warm pita bread 30 seconds.',
      'Slice cooked chicken.',
      'Fill pita with chicken, vegetables, feta.',
      'Drizzle with tzatziki sauce.',
      'Mediterranean flavors, handheld meal!'
    ]
  },
  
  salmon_teriyaki_bowl: {
    name: 'Salmon Teriyaki Bowl',
    cuisine: 'asian',
    dietType: 'omnivore',
    allergens: ['fish', 'soy'],
    servings: 1,
    prepTime: 16,
    protein: 36,
    carbs: 52,
    fat: 18,
    calories: 520,
    ingredients: ['salmon', 'brown_rice', 'broccoli', 'carrots', 'teriyaki_sauce', 'sesame_seeds'],
    instructions: [
      'Cook brown rice according to package.',
      'Season 6oz salmon with salt and pepper.',
      'Pan-sear salmon skin-side down 4 min.',
      'Flip, cook 3 more min until flaky.',
      'Steam broccoli and sliced carrots 5 min.',
      'Brush salmon with teriyaki sauce.',
      'Serve over rice with vegetables.',
      'Sprinkle sesame seeds. Omega-3 rich!'
    ]
  },
  
  bbq_chicken_quesadilla: {
    name: 'BBQ Chicken Quesadilla',
    cuisine: 'american',
    dietType: 'omnivore',
    allergens: ['gluten', 'dairy'],
    servings: 1,
    prepTime: 12,
    protein: 44,
    carbs: 46,
    fat: 20,
    calories: 550,
    ingredients: ['chicken_breast', 'tortilla', 'cheese', 'bbq_sauce', 'red_onion', 'cilantro'],
    instructions: [
      'Cook chicken breast, dice into small pieces.',
      'Mix chicken with BBQ sauce.',
      'Lay tortilla flat, add cheese on half.',
      'Add BBQ chicken and diced red onion.',
      'Fold tortilla in half.',
      'Cook in skillet 2-3 min per side until crispy.',
      'Cheese should be melted.',
      'Cut into triangles, garnish with cilantro!'
    ]
  },
  
  // NEW PREMIUM TIER RECIPES ($4.80-$5.50)
  beef_stir_fry: {
    name: 'Beef & Vegetable Stir-Fry',
    cuisine: 'asian',
    dietType: 'omnivore',
    allergens: ['soy'],
    servings: 1,
    prepTime: 16,
    protein: 38,
    carbs: 48,
    fat: 22,
    calories: 560,
    ingredients: ['beef_sirloin', 'brown_rice', 'broccoli', 'bell_peppers', 'snap_peas', 'soy_sauce', 'ginger', 'garlic'],
    instructions: [
      'Cook brown rice according to package.',
      'Slice 6oz beef sirloin into thin strips.',
      'Heat wok or large skillet until very hot.',
      'Quick-fry beef strips 2-3 min, set aside.',
      'Add vegetables: broccoli, peppers, snap peas.',
      'Stir-fry vegetables 4 min until tender-crisp.',
      'Return beef, add soy sauce, ginger, garlic.',
      'Toss everything 1 min. Serve over rice!'
    ]
  },
  
  shrimp_pasta_primavera: {
    name: 'Shrimp Pasta Primavera',
    cuisine: 'italian',
    dietType: 'omnivore',
    allergens: ['shellfish', 'gluten', 'dairy'],
    servings: 1,
    prepTime: 18,
    protein: 36,
    carbs: 52,
    fat: 18,
    calories: 520,
    ingredients: ['shrimp', 'pasta', 'cherry_tomatoes', 'zucchini', 'bell_peppers', 'garlic', 'olive_oil', 'parmesan'],
    instructions: [
      'Cook pasta according to package directions.',
      'Sauté minced garlic in olive oil 30 sec.',
      'Add 6oz shrimp, cook 2 min per side.',
      'Remove shrimp, set aside.',
      'Add sliced zucchini, peppers, cherry tomatoes.',
      'Sauté vegetables 5 min.',
      'Return shrimp, add cooked pasta.',
      'Toss with parmesan. Fresh and light!'
    ]
  },
  
  steak_burrito_bowl: {
    name: 'Steak Burrito Bowl',
    cuisine: 'mexican',
    dietType: 'omnivore',
    allergens: ['dairy'],
    servings: 1,
    prepTime: 16,
    protein: 42,
    carbs: 50,
    fat: 24,
    calories: 600,
    ingredients: ['beef_sirloin', 'brown_rice', 'black_beans', 'corn', 'salsa', 'cheese', 'avocado', 'lime'],
    instructions: [
      'Cook brown rice according to package.',
      'Season 6oz steak with salt, pepper, cumin.',
      'Grill or pan-sear 3-4 min per side for medium.',
      'Let steak rest 5 min, slice against grain.',
      'Heat black beans with taco seasoning.',
      'Build bowl: rice, beans, corn, steak.',
      'Top with salsa, cheese, avocado, lime.',
      'Restaurant-quality steak bowl at home!'
    ]
  },
  
  lamb_kofta_bowl: {
    name: 'Lamb Kofta Bowl',
    cuisine: 'mediterranean',
    dietType: 'omnivore',
    allergens: ['dairy'],
    servings: 1,
    prepTime: 18,
    protein: 36,
    carbs: 46,
    fat: 26,
    calories: 580,
    ingredients: ['ground_lamb', 'brown_rice', 'cucumber', 'tomato', 'red_onion', 'feta', 'tzatziki', 'mint'],
    instructions: [
      'Cook brown rice according to package.',
      'Mix 6oz ground lamb with cumin, coriander, mint.',
      'Form into 4-5 small kofta (meatballs).',
      'Pan-fry kofta 3-4 min per side until cooked.',
      'Dice cucumber, tomato, red onion.',
      'Build bowl: rice, vegetables, kofta.',
      'Top with crumbled feta and tzatziki.',
      'Fresh Mediterranean flavors, rich protein!'
    ]
  },
  
  tuna_poke_bowl: {
    name: 'Seared Tuna Poke Bowl',
    cuisine: 'asian',
    dietType: 'omnivore',
    allergens: ['fish', 'soy'],
    servings: 1,
    prepTime: 15,
    protein: 38,
    carbs: 48,
    fat: 20,
    calories: 540,
    ingredients: ['tuna_steak', 'brown_rice', 'edamame', 'cucumber', 'avocado', 'soy_sauce', 'sesame_oil', 'sesame_seeds'],
    instructions: [
      'Cook brown rice according to package.',
      'Season 6oz tuna steak with salt and pepper.',
      'Sear tuna 1-2 min per side (rare center).',
      'Slice tuna against grain into thin pieces.',
      'Cook edamame 5 min, drain.',
      'Dice cucumber and avocado.',
      'Build bowl: rice, edamame, cucumber, tuna.',
      'Drizzle with soy sauce and sesame oil. Premium!'
    ]
  },
  massaman_curry: {
    name: 'Massaman Curry',
    cuisine: 'thai',
    emoji: '🍛',
    prepTime: '15 min',
    cookTime: '30 min',
    dietType: 'omnivore',
    allergens: ['peanuts'],
    getIngredients: (dinner) => [
      `${Math.round(dinner.protein / 31 * 4 * 10) / 10} oz chicken breast, cubed`,
      `1 medium potato, cubed`,
      `1/2 cup light coconut milk`,
      `2 tbsp massaman curry paste`,
      `2 tbsp roasted peanuts`,
      `1/4 onion, sliced`,
      `${Math.round(dinner.carbs / 45 * 3 / 4 * 10) / 10} cups brown rice (cooked)`,
      `1 tbsp fish sauce or soy sauce`,
      `1 tsp brown sugar`,
      `Lime wedges for serving`
    ],
    instructions: [
      'Cook brown rice according to package.',
      'Heat coconut milk in a large pan over medium heat.',
      'Add curry paste and stir until fragrant, 1-2 minutes.',
      'Add chicken and cook until no longer pink, 5-7 minutes.',
      'Add potatoes, onion, fish sauce, and brown sugar.',
      'Add 1/2 cup water, bring to simmer.',
      'Cover and cook until potatoes are tender, 15-20 minutes.',
      'Stir in peanuts. Serve over rice with lime wedges.'
    ]
  }
};

export const recipes = dinnerRecipes;
