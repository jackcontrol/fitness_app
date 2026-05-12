// Breakfast recipes — extracted from index.html lines 3933-4967.
// Single-serving recipes; macros auto-adjusted at runtime.

export const breakfastRecipes = {
  eggs_toast_smoothie: {
    name: 'Eggs + Toast + Smoothie',
    emoji: '🍳',
    prepTime: '10 min',
    cookTime: '5 min',
    description: 'Balanced protein, carbs, healthy fats. Classic combo.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.4 / 6 * 10) / 10} eggs`,
      `${Math.round(breakfast.carbs * 0.4 / 15 * 10) / 10} slices whole wheat bread`,
      `${Math.round(breakfast.protein * 0.3 / 20 * 10) / 10} scoop protein powder`,
      `1 cup frozen berries`,
      `1/2 banana`,
      `1 cup unsweetened almond milk`,
      `1 tbsp peanut butter`,
      `Butter for toast (optional)`
    ],
    instructions: [
      'Scramble or fry eggs to preference.',
      'Toast bread, add butter if desired.',
      'Blend protein powder, berries, banana, almond milk, peanut butter.',
      'Serve together for balanced breakfast.'
    ]
  },
  
  ezekiel_cereal_kefir: {
    name: 'Ezekiel Cereal with Kefir',
    emoji: '🥣',
    prepTime: '2 min',
    cookTime: '0 min',
    description: 'No cooking needed. Sprouted grains, probiotic-rich. Clean and simple.',
    dietType: 'vegetarian',
    allergens: ['dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.6 / 40 * 10) / 10} cups Ezekiel 4:9 Cereal`,
      `${Math.round(breakfast.protein * 0.5 / 11 * 10) / 10} cups plain kefir`,
      `1 cup fresh berries (blueberries, strawberries)`,
      `${Math.round(breakfast.fat * 0.4 / 16 * 2 * 10) / 10} tbsp almond butter or walnuts`,
      `1 tbsp honey or maple syrup (optional)`,
      `Cinnamon (optional)`
    ],
    instructions: [
      'Pour Ezekiel cereal into bowl.',
      'Add cold kefir (or warm slightly if preferred).',
      'Top with fresh berries.',
      'Drizzle with almond butter or add walnuts.',
      'Add honey and cinnamon to taste.',
      'Instant breakfast - sprouted grains + probiotics for gut health!'
    ]
  },
  
  oatmeal_protein: {
    name: 'Protein Oatmeal Bowl',
    emoji: '🥣',
    prepTime: '5 min',
    cookTime: '5 min',
    description: 'High fiber, egg-free. Warm and filling.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.7 / 27 * 0.5 * 10) / 10} cups rolled oats (dry)`,
      `${Math.round(breakfast.protein * 0.5 / 20 * 10) / 10} scoop protein powder (vanilla)`,
      `1 cup fresh berries`,
      `${Math.round(breakfast.fat * 0.6 / 16 * 2 * 10) / 10} tbsp peanut butter`,
      `1/2 banana, sliced`,
      `Cinnamon, honey (optional)`,
      `Unsweetened almond milk as needed`
    ],
    instructions: [
      'Cook oats with water or almond milk according to package.',
      'Once cooked, stir in protein powder off heat.',
      'Top with berries, banana, peanut butter.',
      'Add cinnamon and honey to taste.',
      'High-protein, egg-free breakfast!'
    ]
  },
  
  greek_yogurt_parfait: {
    name: 'Greek Yogurt Parfait',
    emoji: '🍓',
    prepTime: '5 min',
    cookTime: '0 min',
    description: 'No cooking needed. High protein, refreshing.',
    dietType: 'vegetarian',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.7 / 20 * 10) / 10} cups Greek yogurt (plain, nonfat)`,
      `${Math.round(breakfast.carbs * 0.4 / 27 * 0.5 * 10) / 10} cups rolled oats or granola`,
      `1.5 cups mixed berries`,
      `${Math.round(breakfast.fat * 0.5 / 16 * 2 * 10) / 10} tbsp peanut butter or almond butter`,
      `1 tbsp honey or maple syrup`,
      `${Math.round(breakfast.protein * 0.2 / 20 * 10) / 10} scoop protein powder (optional boost)`
    ],
    instructions: [
      'Layer Greek yogurt in bowl.',
      'Mix in protein powder if using.',
      'Add layer of oats/granola.',
      'Top with fresh berries.',
      'Drizzle with nut butter and honey.',
      'No cooking required - perfect grab-and-go!'
    ]
  },
  
  avocado_toast_smoothie: {
    name: 'Avocado Toast + Smoothie',
    emoji: '🥑',
    prepTime: '10 min',
    cookTime: '2 min',
    description: 'Egg-free, healthy fats. Trendy and tasty.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.5 / 15 * 10) / 10} slices whole wheat bread`,
      `${Math.round(breakfast.fat * 0.7 / 15 * 10) / 10} avocado`,
      `${Math.round(breakfast.protein * 0.6 / 20 * 10) / 10} scoop protein powder`,
      `1 cup frozen berries`,
      `1/2 banana`,
      `1 cup unsweetened almond milk`,
      `1 tbsp peanut butter`,
      `Salt, pepper, red pepper flakes`,
      `Cherry tomatoes (optional topping)`
    ],
    instructions: [
      'Toast bread until golden.',
      'Mash avocado with salt, pepper, red pepper flakes.',
      'Spread avocado on toast, top with tomatoes if desired.',
      'Blend protein powder, berries, banana, almond milk, peanut butter.',
      'EGG-FREE option with healthy fats!'
    ]
  },
  
  protein_pancakes: {
    name: 'Protein Pancakes',
    emoji: '🥞',
    prepTime: '5 min',
    cookTime: '10 min',
    description: 'Fluffy, satisfying. Weekend favorite.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.3 / 6 * 10) / 10} eggs`,
      `${Math.round(breakfast.protein * 0.35 / 20 * 10) / 10} scoop protein powder`,
      `${Math.round(breakfast.carbs * 0.5 / 27 * 0.5 * 10) / 10} cups rolled oats (blended into flour)`,
      `1/2 banana, mashed`,
      `1/4 cup unsweetened almond milk`,
      `1 tsp baking powder`,
      `1 cup fresh berries`,
      `${Math.round(breakfast.fat * 0.4 / 16 * 2 * 10) / 10} tbsp peanut butter`,
      `Sugar-free syrup or honey`
    ],
    instructions: [
      'Blend oats into fine flour.',
      'Mix all ingredients except berries and toppings.',
      'Heat non-stick pan over medium.',
      'Pour batter, cook 2-3 min per side until golden.',
      'Top with berries, peanut butter, syrup.',
      'High-protein twist on classic pancakes!'
    ]
  },
  
  smoothie_bowl: {
    name: 'Smoothie Bowl',
    emoji: '🍌',
    prepTime: '10 min',
    cookTime: '0 min',
    description: 'Thick, eat with spoon. Fun toppings.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.6 / 20 * 10) / 10} scoop protein powder`,
      `1 frozen banana`,
      `1 cup frozen berries`,
      `1/2 cup Greek yogurt (or dairy-free alternative)`,
      `1/4 cup unsweetened almond milk`,
      `${Math.round(breakfast.carbs * 0.3 / 27 * 0.5 * 10) / 10} cups granola`,
      `${Math.round(breakfast.fat * 0.5 / 16 * 2 * 10) / 10} tbsp peanut butter`,
      `Fresh berries, sliced banana for topping`,
      `Chia seeds, coconut flakes (optional)`
    ],
    instructions: [
      'Blend frozen banana, berries, protein powder, yogurt, almond milk until thick.',
      'Pour into bowl (should be thick, not drinkable).',
      'Top with granola, peanut butter drizzle.',
      'Add fresh fruit, chia seeds, coconut.',
      'Eat with spoon - like ice cream for breakfast!',
      'EGG-FREE, customizable option'
    ]
  },
  
  shakshuka: {
    name: 'Shakshuka',
    emoji: '🍳',
    prepTime: '10 min',
    cookTime: '25 min',
    description: 'Middle Eastern classic. Eggs poached in spiced tomato sauce.',
    allergens: ['eggs'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein / 6)} eggs`,
      `1 cup crushed tomatoes`,
      `1 bell pepper, diced`,
      `1/2 onion, diced`,
      `3 cloves garlic, minced`,
      `1 tsp cumin`,
      `1 tsp paprika`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `${Math.round(breakfast.carbs / 20)} slices whole grain bread`,
      `Fresh parsley or cilantro`,
      `Salt, pepper, red pepper flakes`
    ],
    instructions: [
      'Heat olive oil in large skillet over medium heat.',
      'Sauté onion and bell pepper until softened, 5-7 minutes.',
      'Add garlic, cumin, paprika. Cook 1 minute until fragrant.',
      'Add crushed tomatoes, salt, pepper, red pepper flakes.',
      'Simmer 10 minutes until sauce thickens.',
      'Make 4-6 wells in sauce with back of spoon.',
      'Crack eggs into wells. Cover and cook until whites set, 5-8 minutes.',
      'Garnish with fresh herbs. Serve with toasted bread for dipping!',
      'Traditional Middle Eastern breakfast - satisfying and flavorful'
    ]
  },
  huevos_rancheros: {
    name: 'Huevos Rancheros',
    emoji: '🌮',
    prepTime: '10 min',
    cookTime: '10 min',
    description: 'Mexican classic. Eggs on tortillas with beans, salsa, cheese.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `${Math.round(breakfast.carbs * 0.4 / 12)} small corn tortillas`,
      `1/2 cup black beans (canned, drained)`,
      `1/3 cup salsa (red or green)`,
      `2 tbsp shredded cheese (cheddar or Mexican blend)`,
      `${Math.round(breakfast.fat * 0.3 / 15)} avocado, sliced`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `Fresh cilantro`,
      `Lime wedges`,
      `Salt, pepper, cumin`
    ],
    instructions: [
      'Heat beans in small pot with cumin. Keep warm.',
      'Warm tortillas in dry pan or directly over gas flame.',
      'Heat oil in pan, fry eggs sunny-side up or over-easy.',
      'Place warm tortillas on plate.',
      'Top each with beans, fried egg, salsa.',
      'Sprinkle with cheese, add avocado slices.',
      'Garnish with cilantro. Serve with lime wedges.',
      'Classic Mexican breakfast - authentic and delicious!'
    ]
  },
  breakfast_burrito: {
    name: 'Breakfast Burrito',
    emoji: '🌯',
    prepTime: '10 min',
    cookTime: '8 min',
    description: 'Hearty, portable. Everything wrapped in a warm tortilla.',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `${Math.round(breakfast.carbs * 0.6 / 30)} large flour tortillas`,
      `1/2 cup black beans (canned, drained)`,
      `1/4 cup shredded cheese (cheddar or Mexican blend)`,
      `1/4 bell pepper, diced`,
      `2 tbsp onion, diced`,
      `1/3 cup salsa`,
      `${Math.round(breakfast.fat * 0.2 / 15)} avocado or 2 tbsp sour cream`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `Salt, pepper, cumin, chili powder`
    ],
    instructions: [
      'Heat oil in pan, sauté peppers and onions until soft, 3-4 minutes.',
      'Beat eggs with salt, pepper, cumin. Add to pan.',
      'Scramble eggs until just set. Remove from heat.',
      'Warm tortillas in microwave 20 seconds or dry pan.',
      'Layer warm beans down center of each tortilla.',
      'Top with scrambled eggs, cheese, salsa, avocado.',
      'Fold sides in, roll tightly from bottom to top.',
      'Optional: Toast seam-side down in pan for crispy exterior.',
      'Portable protein-packed Mexican breakfast!'
    ]
  },
  chilaquiles: {
    name: 'Chilaquiles',
    emoji: '🌶️',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'Crispy tortilla chips in salsa. Topped with eggs and cheese.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.5 / 15)} cups tortilla chips (about 2 large handfuls)`,
      `1 cup salsa verde or red salsa`,
      `${Math.round(breakfast.protein * 0.4 / 6)} eggs`,
      `1/4 cup shredded cheese (queso fresco or Mexican blend)`,
      `1/3 cup black beans`,
      `2 tbsp sour cream or Mexican crema`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `Fresh cilantro`,
      `Sliced radishes (optional)`,
      `Lime wedges`
    ],
    instructions: [
      'Heat salsa in large skillet until simmering.',
      'Add tortilla chips, toss to coat. Let soften slightly, 2-3 minutes.',
      'Transfer chips to serving plate (should be softened but not soggy).',
      'Heat oil in same pan, fry or scramble eggs to preference.',
      'Top chips with warm black beans.',
      'Add cooked eggs on top.',
      'Sprinkle with cheese, drizzle with crema.',
      'Garnish with cilantro and radishes. Serve with lime.',
      'Traditional Mexican breakfast - comfort food at its best!'
    ]
  },
  mexican_scramble: {
    name: 'Mexican Scramble',
    emoji: '🍳',
    prepTime: '8 min',
    cookTime: '8 min',
    description: 'Fluffy scrambled eggs with peppers, onions, cheese.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.6 / 6)} eggs`,
      `1/3 bell pepper, diced`,
      `1/4 onion, diced`,
      `1/2 tomato, diced`,
      `1 jalapeño, minced (optional)`,
      `1/4 cup shredded cheese (cheddar or pepper jack)`,
      `${Math.round(breakfast.carbs * 0.4 / 12)} small corn tortillas`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil or butter`,
      `Fresh cilantro`,
      `Salsa for serving`,
      `Salt, pepper, cumin, chili powder`
    ],
    instructions: [
      'Heat oil in non-stick pan over medium heat.',
      'Sauté peppers, onions, jalapeño until softened, 4-5 minutes.',
      'Add tomatoes, cook 1 minute.',
      'Beat eggs with salt, pepper, cumin. Pour into pan.',
      'Gently scramble eggs with vegetables until fluffy and just set.',
      'Remove from heat, fold in cheese.',
      'Warm tortillas in dry pan.',
      'Serve scramble with warm tortillas, cilantro, salsa.',
      'Fresh, flavorful Mexican breakfast - ready in 15 minutes!'
    ]
  },
  turkish_eggs: {
    name: 'Çılbır (Turkish Eggs)',
    emoji: '🇹🇷',
    prepTime: '8 min',
    cookTime: '8 min',
    description: 'Turkish classic. Poached eggs over garlicky yogurt with chili butter.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.4 / 6)} eggs`,
      `${Math.round(breakfast.protein * 0.4 / 20)} cups Greek yogurt`,
      `2 cloves garlic, minced`,
      `${Math.round(breakfast.fat / 14) + 1} tbsp butter`,
      `1 tsp paprika or Aleppo pepper`,
      `${Math.round(breakfast.carbs * 0.5 / 15)} slices crusty bread or pita`,
      `Fresh dill or parsley`,
      `1 tsp white vinegar (for poaching)`,
      `Salt, pepper`,
      `Olive oil for drizzling`
    ],
    instructions: [
      'Mix Greek yogurt with minced garlic and salt. Spread on serving plate.',
      'Bring pot of water to gentle simmer. Add vinegar.',
      'Crack eggs into small cups. Create gentle whirlpool in water.',
      'Slide eggs into water, poach 3-4 minutes until whites set.',
      'Meanwhile, melt butter in small pan until foaming.',
      'Add paprika to butter, swirl 30 seconds (don\'t burn).',
      'Remove eggs with slotted spoon, place on yogurt.',
      'Drizzle chili butter over eggs. Garnish with herbs.',
      'Serve with toasted bread. Sophisticated Turkish breakfast!'
    ]
  },
  tamagoyaki_bowl: {
    name: 'Tamagoyaki Bowl',
    emoji: '🇯🇵',
    prepTime: '10 min',
    cookTime: '12 min',
    description: 'Japanese rolled omelet over rice. Sweet and savory, elegant.',
    allergens: ['eggs', 'soy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.6 / 6)} eggs`,
      `${Math.round(breakfast.carbs / 45 * 3 / 4)} cups cooked white or brown rice`,
      `2 tbsp soy sauce`,
      `1 tbsp mirin or honey`,
      `2 tsp sugar`,
      `${Math.round(breakfast.fat / 14)} tbsp sesame oil`,
      `2 green onions, sliced`,
      `1 tsp sesame seeds`,
      `Nori seaweed strips (optional)`,
      `Pickled ginger (optional)`
    ],
    instructions: [
      'Beat eggs with soy sauce, mirin, sugar until combined.',
      'Heat rectangular or round pan over medium-low with oil.',
      'Pour thin layer of egg mixture, let partially set.',
      'Roll egg from one end to other. Push to side.',
      'Add more egg mixture, lift rolled section so it flows under.',
      'Roll again, incorporating new layer. Repeat until egg is used.',
      'Let cool slightly, slice into 1-inch pieces.',
      'Serve sliced tamagoyaki over warm rice.',
      'Garnish with green onions, sesame seeds, nori.',
      'Traditional Japanese breakfast - beautiful and delicious!'
    ]
  },
  full_english: {
    name: 'High Protein English Breakfast',
    emoji: '🇬🇧',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'British classic. Eggs, bacon, beans, mushrooms, tomatoes.',
    allergens: ['eggs'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.4 / 6)} eggs`,
      `${Math.round(breakfast.protein * 0.3 / 20)} strips turkey bacon or regular bacon`,
      `1/2 cup baked beans (canned)`,
      `4 oz mushrooms, sliced`,
      `1 large tomato, halved`,
      `${Math.round(breakfast.carbs * 0.4 / 15)} slices whole grain toast`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil or butter`,
      `Fresh parsley`,
      `Salt, pepper`,
      `HP sauce or ketchup (optional)`
    ],
    instructions: [
      'Preheat oven to 400°F. Place tomato halves on baking sheet, drizzle with oil.',
      'Roast tomatoes 12-15 minutes until softened.',
      'Meanwhile, cook bacon in large skillet until crispy. Set aside.',
      'In same pan, sauté mushrooms until golden, 5-6 minutes. Season.',
      'Warm beans in small pot.',
      'Fry or scramble eggs to preference in remaining bacon fat or fresh oil.',
      'Toast bread.',
      'Arrange all components on large plate: eggs, bacon, beans, mushrooms, tomato.',
      'Garnish with parsley. Serve with toast.',
      'Hearty British breakfast - starts the day right!'
    ]
  },
  korean_egg_bowl: {
    name: 'Gyeran-bap (Korean Egg Bowl)',
    emoji: '🇰🇷',
    prepTime: '5 min',
    cookTime: '8 min',
    description: 'Korean comfort food. Rice with egg, soy sauce, sesame.',
    allergens: ['eggs', 'soy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs / 45 * 3 / 4)} cups cooked white rice (warm)`,
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `2 tbsp soy sauce`,
      `1 tbsp sesame oil`,
      `1 tsp gochugaru (Korean chili flakes) or red pepper flakes`,
      `2 green onions, sliced`,
      `1 tsp sesame seeds`,
      `1 sheet roasted seaweed (gim), torn`,
      `${Math.round(breakfast.fat / 14)} tbsp butter or oil`,
      `Salt, pepper`
    ],
    instructions: [
      'Place warm rice in large bowl.',
      'Create well in center of rice.',
      'Crack eggs into well. Add soy sauce, sesame oil.',
      'Add gochugaru, half the green onions, sesame seeds.',
      'Heat butter in small pan, pour hot butter over eggs and rice.',
      'Alternatively: fry eggs separately and place on top.',
      'Mix everything together vigorously until eggs coat rice.',
      'Top with remaining green onions, torn seaweed.',
      'Adjust soy sauce and sesame oil to taste.',
      'Simple Korean comfort breakfast - umami-rich!'
    ]
  },
  tofu_scramble: {
    name: 'Southwest Tofu Scramble',
    emoji: '🌱',
    prepTime: '8 min',
    cookTime: '10 min',
    description: 'American vegan classic. Scrambled tofu with peppers and spices.',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.8 / 20)} block firm tofu (14-16 oz), drained and crumbled`,
      `1/2 bell pepper, diced`,
      `1/4 onion, diced`,
      `1/2 cup black beans`,
      `2 tbsp nutritional yeast`,
      `1 tsp turmeric (for color)`,
      `1 tsp cumin`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `${Math.round(breakfast.carbs * 0.4 / 15)} slices whole grain toast`,
      `Salsa, avocado for serving`,
      `Salt, pepper, garlic powder`
    ],
    instructions: [
      'Press tofu between paper towels to remove excess water.',
      'Crumble tofu into small pieces with hands or fork.',
      'Heat oil in pan over medium-high.',
      'Sauté peppers and onions until softened, 4-5 minutes.',
      'Add crumbled tofu, turmeric, cumin, nutritional yeast.',
      'Cook stirring frequently until tofu is heated and slightly golden, 5-7 minutes.',
      'Add black beans, cook until warm.',
      'Season with salt, pepper, garlic powder.',
      'Serve with toast, salsa, avocado.',
      'High-protein vegan breakfast - tastes eggy without the eggs!'
    ]
  },
  vegan_pancakes: {
    name: 'Vegan Protein Pancakes',
    emoji: '🥞',
    prepTime: '8 min',
    cookTime: '12 min',
    description: 'Fluffy American pancakes. No eggs or dairy needed.',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.5 / 27 * 0.5)} cups rolled oats (blended into flour)`,
      `1 cup unsweetened almond milk`,
      `${Math.round(breakfast.protein * 0.5 / 20)} scoop vegan protein powder`,
      `1 ripe banana, mashed`,
      `2 tbsp ground flaxseed + 6 tbsp water (flax eggs)`,
      `1 tsp baking powder`,
      `1 tsp vanilla extract`,
      `${Math.round(breakfast.fat / 16 * 2)} tbsp almond butter or peanut butter`,
      `1 cup fresh berries`,
      `Maple syrup`,
      `Pinch of salt`
    ],
    instructions: [
      'Mix ground flaxseed with water, let sit 5 minutes to thicken.',
      'Blend oats into fine flour.',
      'Mash banana in bowl.',
      'Add flax eggs, almond milk, protein powder, vanilla to banana.',
      'Stir in oat flour, baking powder, salt until just combined.',
      'Heat non-stick pan over medium. Lightly oil if needed.',
      'Pour 1/4 cup batter per pancake.',
      'Cook 2-3 minutes until bubbles form, flip and cook 2 more minutes.',
      'Stack pancakes, top with berries, nut butter, maple syrup.',
      'Fluffy vegan pancakes - no one will know they\'re plant-based!'
    ]
  },
  overnight_oats_pb: {
    name: 'PB&J Overnight Oats',
    emoji: '🥜',
    prepTime: '5 min + overnight',
    cookTime: '0 min',
    description: 'No-cook American favorite. Prep night before.',
    dietType: 'vegan',
    allergens: ['peanuts'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.6 / 27 * 0.5)} cups rolled oats`,
      `1 cup unsweetened almond milk`,
      `${Math.round(breakfast.protein * 0.4 / 20)} scoop vegan protein powder`,
      `${Math.round(breakfast.fat * 0.6 / 16 * 2)} tbsp peanut butter or almond butter`,
      `1 tbsp chia seeds`,
      `1 tbsp maple syrup or agave`,
      `1/2 cup mixed berries (fresh or frozen)`,
      `1/2 banana, sliced`,
      `1 tsp vanilla extract`,
      `Pinch of salt`
    ],
    instructions: [
      'In jar or container, combine oats, almond milk, protein powder.',
      'Add peanut butter, chia seeds, maple syrup, vanilla, salt.',
      'Stir well to combine everything.',
      'Fold in half the berries.',
      'Cover and refrigerate overnight (or minimum 4 hours).',
      'In morning, stir and add more almond milk if too thick.',
      'Top with remaining berries and banana slices.',
      'Eat cold or microwave 30-60 seconds if preferred warm.',
      'Perfect grab-and-go breakfast - no cooking required!'
    ]
  },
  indian_upma: {
    name: 'Upma (Indian Semolina)',
    emoji: '🇮🇳',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'South Indian classic. Savory semolina with vegetables and spices.',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.7 / 70)} cup semolina (rava/sooji)`,
      `1/2 cup mixed vegetables (peas, carrots, green beans), diced`,
      `1/4 onion, finely chopped`,
      `2 green chilies, slit (adjust to taste)`,
      `1/2 tsp mustard seeds`,
      `1/2 tsp cumin seeds`,
      `8-10 curry leaves (optional but traditional)`,
      `1 tbsp roasted peanuts or cashews`,
      `${Math.round(breakfast.fat / 14)} tbsp coconut oil or vegetable oil`,
      `1.5 cups water`,
      `Juice of 1/2 lemon`,
      `Fresh cilantro`,
      `Salt, turmeric`
    ],
    instructions: [
      'Dry roast semolina in pan over medium heat until fragrant, 3-4 minutes. Set aside.',
      'In same pan, heat oil. Add mustard seeds until they pop.',
      'Add cumin seeds, curry leaves, green chilies.',
      'Add onions, sauté until translucent.',
      'Add mixed vegetables, cook 3-4 minutes.',
      'Add water, salt, turmeric. Bring to boil.',
      'Slowly add roasted semolina while stirring constantly to avoid lumps.',
      'Cook on low heat 3-4 minutes, stirring, until water absorbed.',
      'Add lemon juice, roasted nuts, fresh cilantro.',
      'Traditional Indian breakfast - savory, spiced, satisfying!'
    ]
  },
  ethiopian_ful: {
    name: 'Ful Medames (Ethiopian Fava Beans)',
    emoji: '🇪🇹',
    prepTime: '10 min',
    cookTime: '15 min',
    description: 'East African staple. Spiced fava beans with vegetables.',
    dietType: 'vegan',
    allergens: [],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.7 / 18)} cups cooked fava beans (or use canned, drained)`,
      `1/2 tomato, diced`,
      `1/4 onion, finely chopped`,
      `2 cloves garlic, minced`,
      `1 jalapeño, minced (optional)`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `${Math.round(breakfast.carbs * 0.3 / 15)} pieces pita or injera bread`,
      `Juice of 1 lemon`,
      `1 tsp cumin`,
      `1/2 tsp paprika`,
      `Fresh parsley or cilantro`,
      `Salt, pepper`
    ],
    instructions: [
      'Heat oil in pan over medium heat.',
      'Sauté onions until softened, 3-4 minutes.',
      'Add garlic and jalapeño, cook 1 minute.',
      'Add diced tomatoes, cook until slightly broken down, 3-4 minutes.',
      'Add fava beans, cumin, paprika, salt, pepper.',
      'Mash some beans with back of spoon (leave some whole for texture).',
      'Add splash of water if too thick. Simmer 5 minutes.',
      'Stir in lemon juice.',
      'Garnish with fresh herbs.',
      'Serve with warm pita or injera for scooping.',
      'Traditional Ethiopian breakfast - protein-rich and hearty!'
    ]
  },
  thai_jok: {
    name: 'Jok (Thai Rice Porridge)',
    emoji: '🇹🇭',
    prepTime: '10 min',
    cookTime: '25 min',
    description: 'Thai comfort food. Creamy rice porridge with ginger and tofu.',
    dietType: 'vegan',
    allergens: ['soy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.6 / 45 * 3 / 4)} cups white rice (jasmine preferred)`,
      `4 cups vegetable broth`,
      `${Math.round(breakfast.protein * 0.5 / 20)} block firm tofu, cubed`,
      `2 cloves garlic, minced`,
      `1 inch fresh ginger, minced`,
      `2 green onions, sliced`,
      `${Math.round(breakfast.fat / 14)} tbsp sesame oil`,
      `2 tbsp soy sauce`,
      `1 tsp white pepper`,
      `Fresh cilantro`,
      `Fried garlic or shallots (optional topping)`,
      `Lime wedges`
    ],
    instructions: [
      'Rinse rice until water runs clear.',
      'In pot, heat sesame oil. Fry tofu cubes until golden. Set aside.',
      'In same pot, sauté garlic and ginger 1 minute until fragrant.',
      'Add rice, stir to coat with oil.',
      'Add vegetable broth, bring to boil.',
      'Reduce heat to low, simmer 20-25 minutes, stirring occasionally.',
      'Rice should break down into creamy porridge.',
      'Add more broth if too thick.',
      'Stir in soy sauce, white pepper.',
      'Top with fried tofu, green onions, cilantro, fried garlic.',
      'Serve with lime wedges.',
      'Comforting Thai breakfast - soothing and nourishing!'
    ]
  },
  lebanese_fatteh: {
    name: 'Fatteh Hummus (Lebanese)',
    emoji: '🇱🇧',
    prepTime: '12 min',
    cookTime: '10 min',
    description: 'Lebanese layered dish. Chickpeas, tahini, crispy pita.',
    dietType: 'vegan',
    allergens: ['sesame'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.7 / 15)} cup cooked chickpeas (or canned, drained)`,
      `${Math.round(breakfast.carbs * 0.4 / 12)} pita breads`,
      `1/4 cup tahini`,
      `3 tbsp lemon juice`,
      `2 cloves garlic, minced`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil + extra for drizzling`,
      `1/4 cup chickpea cooking liquid or water`,
      `2 tbsp pine nuts (optional)`,
      `1 tsp cumin`,
      `Paprika for garnish`,
      `Fresh parsley`,
      `Salt, pepper`
    ],
    instructions: [
      'Cut pita into triangles, toast or fry until crispy.',
      'In blender, combine tahini, lemon juice, garlic, water until smooth and creamy.',
      'Add more water if too thick (should be pourable).',
      'Heat chickpeas with cumin, salt, pepper. Lightly mash some.',
      'If using pine nuts, toast in dry pan until golden.',
      'Layer dish: Break crispy pita into pieces on bottom.',
      'Top with warm chickpeas.',
      'Pour tahini sauce generously over chickpeas.',
      'Drizzle with olive oil, sprinkle paprika.',
      'Top with toasted pine nuts and fresh parsley.',
      'Traditional Lebanese breakfast - rich, creamy, satisfying!'
    ]
  },
  vietnamese_chao: {
    name: 'Cháo (Vietnamese Rice Porridge)',
    emoji: '🇻🇳',
    prepTime: '10 min',
    cookTime: '30 min',
    description: 'Vietnamese comfort food. Silky rice porridge with mushrooms.',
    dietType: 'vegan',
    allergens: ['soy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.6 / 45 * 3 / 4)} cups jasmine rice`,
      `5 cups vegetable broth`,
      `${Math.round(breakfast.protein * 0.4 / 5)} oz shiitake mushrooms, sliced`,
      `2 cloves garlic, minced`,
      `1 inch fresh ginger, julienned`,
      `2 green onions, sliced`,
      `${Math.round(breakfast.fat / 14)} tbsp vegetable oil`,
      `2 tbsp soy sauce`,
      `1 tsp sesame oil`,
      `Fresh cilantro and Thai basil`,
      `Bean sprouts (optional)`,
      `Lime wedges`,
      `Fried shallots (optional topping)`
    ],
    instructions: [
      'Rinse rice until water runs clear.',
      'Heat oil in pot, sauté garlic and ginger until fragrant.',
      'Add mushrooms, cook until softened, 3-4 minutes.',
      'Add rice, stir to coat.',
      'Add vegetable broth, bring to boil.',
      'Reduce heat to low, simmer 25-30 minutes, stirring occasionally.',
      'Rice should break down into creamy porridge.',
      'Add more broth if needed for desired consistency.',
      'Stir in soy sauce and sesame oil.',
      'Serve in bowls topped with green onions, cilantro, basil.',
      'Add bean sprouts, fried shallots, squeeze of lime.',
      'Vietnamese comfort breakfast - healing and delicious!'
    ]
  },
  
  // NEW ADDITIONS - Strategic breakfast variety
  protein_shake_berry: {
    name: 'Berry Protein Shake',
    emoji: '🫐',
    prepTime: '3 min',
    cookTime: '0 min',
    description: 'Quick, high-protein, perfect for busy mornings.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.7 / 25)} scoops protein powder (vanilla)`,
      `1.5 cups frozen mixed berries`,
      `1 banana`,
      `1 cup unsweetened almond milk`,
      `1 tbsp flax seeds`,
      `${Math.round(breakfast.fat / 14)} tbsp peanut butter`,
      `Ice cubes`,
      `Stevia or honey (optional)`
    ],
    instructions: [
      'Add all ingredients to blender.',
      'Blend on high until smooth and creamy.',
      'Add ice for thicker consistency.',
      'Quick, complete breakfast in under 3 minutes!'
    ]
  },
  
  overnight_oats: {
    name: 'Overnight Oats',
    emoji: '🥣',
    prepTime: '5 min (night before)',
    cookTime: '0 min',
    description: 'Meal prep breakfast. Make ahead and grab-and-go.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs * 0.6 / 27 * 0.5 * 10) / 10} cups rolled oats`,
      `${Math.round(breakfast.protein * 0.4 / 20)} scoop protein powder`,
      `1 cup Greek yogurt`,
      `1 cup unsweetened almond milk`,
      `1 tbsp chia seeds`,
      `${Math.round(breakfast.fat / 14)} tbsp almond butter`,
      `1/2 cup fresh berries`,
      `Cinnamon, vanilla extract, honey`
    ],
    instructions: [
      'Night before: Mix oats, yogurt, milk, chia seeds in jar.',
      'Stir in protein powder until smooth.',
      'Add cinnamon and vanilla.',
      'Refrigerate overnight.',
      'Morning: Top with berries, almond butter, drizzle honey.',
      'Eat cold or microwave 30 seconds.',
      'Perfect meal prep breakfast!'
    ]
  },
  
  breakfast_sandwich: {
    name: 'Breakfast Sandwich',
    emoji: '🥪',
    prepTime: '5 min',
    cookTime: '5 min',
    description: 'Classic, portable, satisfying.',
    allergens: ['eggs', 'gluten', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `${Math.round(breakfast.carbs * 0.6 / 25)} English muffins (whole wheat)`,
      `2 slices turkey bacon or regular bacon`,
      `1 slice cheddar cheese`,
      `1 tbsp butter`,
      `Salt, pepper`,
      `Optional: avocado, spinach, hot sauce`
    ],
    instructions: [
      'Toast English muffin.',
      'Cook bacon until crispy.',
      'Scramble or fry eggs in butter.',
      'Assemble: muffin bottom, eggs, bacon, cheese, muffin top.',
      'Microwave 15 seconds to melt cheese.',
      'Add avocado or spinach if desired.',
      'Portable breakfast done in 10 minutes!'
    ]
  },
  
  protein_pancakes: {
    name: 'Protein Pancakes',
    emoji: '🥞',
    prepTime: '5 min',
    cookTime: '10 min',
    description: 'High-protein twist on classic pancakes.',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 25)} scoops protein powder (vanilla)`,
      `${Math.round(breakfast.protein * 0.3 / 6)} eggs`,
      `1/4 cup rolled oats`,
      `1/2 banana, mashed`,
      `1 tsp baking powder`,
      `1/4 cup almond milk`,
      `${Math.round(breakfast.fat / 14)} tbsp butter (for cooking)`,
      `Toppings: berries, Greek yogurt, maple syrup`
    ],
    instructions: [
      'Blend oats into flour.',
      'Mix protein powder, oat flour, baking powder.',
      'Whisk in eggs, mashed banana, almond milk.',
      'Heat griddle, melt butter.',
      'Pour 1/4 cup batter per pancake.',
      'Cook until bubbles form, flip, cook 1-2 min more.',
      'Top with berries and Greek yogurt.',
      'High-protein comfort food!'
    ]
  },
  
  breakfast_tacos: {
    name: 'Breakfast Tacos',
    emoji: '🌮',
    prepTime: '5 min',
    cookTime: '8 min',
    description: 'Tex-Mex breakfast. Flavorful and filling.',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `${Math.round(breakfast.carbs / 15)} small corn or flour tortillas`,
      `1/4 cup black beans`,
      `1/4 cup shredded cheese`,
      `2 tbsp salsa`,
      `1/4 avocado, sliced`,
      `${Math.round(breakfast.fat / 14)} tbsp olive oil`,
      `Optional: chorizo, hot sauce, cilantro`
    ],
    instructions: [
      'Heat oil in skillet.',
      'Scramble eggs until fluffy.',
      'Warm tortillas in another pan.',
      'Heat black beans.',
      'Assemble: tortilla, eggs, beans, cheese, avocado, salsa.',
      'Add hot sauce and cilantro.',
      'Quick Tex-Mex breakfast!'
    ]
  },
  
  avocado_toast_protein: {
    name: 'Loaded Avocado Toast',
    emoji: '🥑',
    prepTime: '5 min',
    cookTime: '5 min',
    description: 'Trendy, nutritious, Instagram-worthy.',
    allergens: ['eggs', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.carbs / 20)} slices whole grain bread`,
      `1 ripe avocado`,
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `Cherry tomatoes, halved`,
      `Everything bagel seasoning`,
      `Red pepper flakes`,
      `Lemon juice`,
      `Salt, pepper`,
      `Optional: feta cheese, arugula`
    ],
    instructions: [
      'Toast bread until golden.',
      'Fry or poach eggs.',
      'Mash avocado with lemon juice, salt, pepper.',
      'Spread avocado on toast.',
      'Top with eggs, tomatoes.',
      'Sprinkle everything bagel seasoning, red pepper flakes.',
      'Add feta and arugula if desired.',
      'Beautiful, nutritious breakfast!'
    ]
  },
  
  smoothie_bowl: {
    name: 'Smoothie Bowl',
    emoji: '🍨',
    prepTime: '5 min',
    cookTime: '0 min',
    description: 'Like ice cream for breakfast. Fun and colorful.',
    allergens: ['dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 25)} scoops protein powder`,
      `1 frozen banana`,
      `1 cup frozen berries`,
      `1/2 cup Greek yogurt`,
      `1/4 cup almond milk`,
      `Toppings: granola, fresh berries, coconut, chia seeds, almond butter drizzle`
    ],
    instructions: [
      'Blend frozen banana, berries, protein powder, yogurt, milk.',
      'Use minimal liquid for thick consistency.',
      'Blend until smooth like soft-serve.',
      'Pour into bowl.',
      'Artfully arrange toppings.',
      'Eat with spoon like ice cream.',
      'Fun, customizable breakfast!'
    ]
  },
  
  breakfast_quesadilla: {
    name: 'Breakfast Quesadilla',
    emoji: '🫔',
    prepTime: '5 min',
    cookTime: '8 min',
    description: 'Crispy, cheesy, satisfying.',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.4 / 6)} eggs`,
      `2 large flour tortillas`,
      `1/2 cup shredded cheese (cheddar or Mexican blend)`,
      `2 slices turkey bacon or chorizo`,
      `2 tbsp black beans`,
      `1 tbsp salsa`,
      `${Math.round(breakfast.fat / 14)} tbsp butter`,
      `Optional: peppers, onions, avocado`
    ],
    instructions: [
      'Cook bacon or chorizo, set aside.',
      'Scramble eggs.',
      'Heat griddle, melt butter.',
      'Place tortilla, add cheese, eggs, bacon, beans on half.',
      'Fold tortilla in half.',
      'Cook until golden, flip, cook other side.',
      'Cut into triangles, serve with salsa.',
      'Crispy, cheesy breakfast!'
    ]
  },
  
  egg_muffins_meal_prep: {
    name: 'Egg Muffins (Meal Prep)',
    emoji: '🧁',
    prepTime: '10 min',
    cookTime: '20 min',
    description: 'Make 12 on Sunday, grab-and-go all week.',
    allergens: ['eggs', 'dairy'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.6 / 6 * 1.5)} eggs (for 12 muffins)`,
      `1/4 cup milk`,
      `1 cup shredded cheese`,
      `1 cup diced vegetables (peppers, spinach, onions)`,
      `1/2 cup diced ham or turkey`,
      `Salt, pepper, garlic powder`,
      `Cooking spray`
    ],
    instructions: [
      'Preheat oven to 350°F.',
      'Spray muffin tin generously.',
      'Whisk eggs, milk, salt, pepper.',
      'Divide vegetables, meat, cheese among cups.',
      'Pour egg mixture over fillings.',
      'Bake 18-20 minutes until set.',
      'Cool, store in fridge up to 5 days.',
      'Microwave 30 seconds to reheat.',
      'Perfect meal prep breakfast!'
    ]
  },
  
  breakfast_wrap: {
    name: 'Breakfast Wrap',
    emoji: '🌯',
    prepTime: '5 min',
    cookTime: '7 min',
    description: 'Portable, customizable, satisfying.',
    allergens: ['eggs', 'dairy', 'gluten'],
    getIngredients: (breakfast) => [
      `${Math.round(breakfast.protein * 0.5 / 6)} eggs`,
      `1 large whole wheat tortilla`,
      `1/4 cup shredded cheese`,
      `2 tbsp black beans`,
      `2 tbsp salsa or hot sauce`,
      `1/4 avocado, sliced`,
      `Handful of spinach`,
      `${Math.round(breakfast.fat / 14)} tbsp butter`,
      `Salt, pepper`
    ],
    instructions: [
      'Scramble eggs in butter.',
      'Warm tortilla.',
      'Layer in center: eggs, beans, cheese, avocado, spinach.',
      'Drizzle salsa.',
      'Fold sides in, roll tightly.',
      'Optional: grill wrap for 1 min per side for crispy.',
      'Wrap in foil for portable breakfast!',
      'Customizable and filling!'
    ]
  }
};
