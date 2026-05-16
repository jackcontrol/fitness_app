// Ingredient substitution rules.
// Extracted from index.html lines 27338-27379.

export const ingredientSubstitutions = {
  'chicken breast': [
    { alt: 'turkey breast', reason: 'Similar protein, slightly leaner', macroChange: 'protein: +2g' },
    { alt: 'tofu', reason: 'Vegan option, lower calories', macroChange: 'protein: -10g, calories: -50' },
    { alt: 'chicken thigh', reason: 'More flavor, higher fat', macroChange: 'fat: +5g' }
  ],
  'ground beef': [
    { alt: 'ground turkey', reason: '30% less fat, similar protein', macroChange: 'fat: -8g' },
    { alt: 'ground chicken', reason: 'Leaner option', macroChange: 'fat: -10g' },
    { alt: 'lentils', reason: 'Vegan, high fiber', macroChange: 'protein: -15g, carbs: +20g, fiber: +8g' }
  ],
  'salmon': [
    { alt: 'trout', reason: 'Similar omega-3s, often cheaper', macroChange: 'Similar' },
    { alt: 'mackerel', reason: 'Higher omega-3s, budget-friendly', macroChange: 'fat: +3g' },
    { alt: 'cod', reason: 'Leaner option', macroChange: 'fat: -5g' }
  ],
  'rice': [
    { alt: 'quinoa', reason: 'Higher protein, complete amino acids', macroChange: 'protein: +5g' },
    { alt: 'cauliflower rice', reason: 'Low-carb option', macroChange: 'carbs: -35g, calories: -150' },
    { alt: 'pasta', reason: 'Similar carbs, different texture', macroChange: 'Similar' }
  ],
  'pasta': [
    { alt: 'zucchini noodles', reason: 'Low-carb, vegetable-based', macroChange: 'carbs: -40g, calories: -180' },
    { alt: 'whole wheat pasta', reason: 'Higher fiber', macroChange: 'fiber: +5g' },
    { alt: 'rice noodles', reason: 'Gluten-free option', macroChange: 'Similar' }
  ],
  'butter': [
    { alt: 'olive oil', reason: 'Heart-healthy fats', macroChange: 'saturated fat: -5g' },
    { alt: 'avocado oil', reason: 'High smoke point, neutral flavor', macroChange: 'Similar' },
    { alt: 'ghee', reason: 'Lactose-free, high smoke point', macroChange: 'Similar' }
  ],
  'milk': [
    { alt: 'almond milk', reason: 'Low-calorie, dairy-free', macroChange: 'calories: -100, protein: -6g' },
    { alt: 'oat milk', reason: 'Creamy texture, dairy-free', macroChange: 'carbs: +5g' },
    { alt: 'soy milk', reason: 'High protein, dairy-free', macroChange: 'Similar protein' }
  ],
  'eggs': [
    { alt: 'egg whites', reason: 'No fat, pure protein', macroChange: 'fat: -5g, cholesterol: -185mg' },
    { alt: 'flax eggs', reason: 'Vegan option (1 tbsp ground flax + 3 tbsp water)', macroChange: 'binding only' },
    { alt: 'silken tofu', reason: 'Vegan, for baking', macroChange: 'protein: similar' }
  ]
};
