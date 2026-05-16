// Profile assessment + pattern detection + week plan generation.
// Lifted from monolith (Session 17). State convention follows S16 modules:
// read/write window.profile + window.state directly through the live
// Object.defineProperty bridges in index.html (~L7478-7487); call downstream
// UI via `typeof window.X === 'function'` guards.

// ─── Pure calculators ─────────────────────────────────────────────

export function calculateBMR(weight, height, age, gender) {
  const weight_kg = weight * 0.453592;
  const height_cm = height * 2.54;
  if (gender === 'male') {
    return Math.round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5);
  }
  return Math.round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161);
}

export function getActivityMultiplier(activity) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
  };
  return multipliers[activity] || 1.2;
}

export function calculateHydration(weight, activity, pattern) {
  let water = weight * 0.5;
  const bonus = { sedentary: 0, light: 16, moderate: 24, very: 32 };
  water += bonus[activity] || 0;
  if (pattern === 'C') water += 20;
  return Math.round(water / 8) * 8;
}

export function calculateCalories(bmr, activity, goal, pattern, age) {
  const activityMultiplier = getActivityMultiplier(activity);
  let tdee = bmr * activityMultiplier;

  if (age > 30) {
    const decadesPast30 = Math.floor((age - 30) / 10);
    tdee *= (1 - (decadesPast30 * 0.02));
  }

  const adjustments = {
    lose_fat_aggressive: -750,
    lose_fat_moderate: -500,
    maintain: 0,
    gain_muscle: 250,
  };

  let calories = tdee + (adjustments[goal] || 0);

  if (pattern === 'C' && goal.includes('lose_fat')) {
    const originalDeficit = adjustments[goal];
    calories = tdee + (originalDeficit * 0.5);
  }

  return Math.round(calories);
}

export function calculateMacros(calories, weight, gender) {
  let protein = weight * 1.0;
  if (gender === 'male') protein = weight * 1.1;
  protein = Math.round(protein);

  const fatPercent = gender === 'female' ? 0.30 : 0.25;
  const fat = Math.round(calories * fatPercent / 9);
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

  return { protein, carbs, fat };
}

// ─── Header refresh ───────────────────────────────────────────────

export function updateHeaderWithProfile() {
  const profile = window.profile;
  if (!profile) return;

  const headerTitle = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');
  const waterGoalText = document.getElementById('water-goal-text');

  if (headerTitle) headerTitle.textContent = 'Sorrel';
  if (headerSubtitle) {
    const firstName = (profile.name || '').split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    headerSubtitle.textContent = `${greeting}, ${firstName}`;
  }
  if (waterGoalText) waterGoalText.textContent = `💧 ${profile.waterOz}oz Daily Goal`;

  const hydrationProtocol = document.getElementById('hydration-protocol-card');
  const sleepProtocol = document.getElementById('sleep-protocol-card');
  if (profile.pattern === 'C') {
    if (hydrationProtocol) hydrationProtocol.style.display = 'block';
    if (sleepProtocol) sleepProtocol.style.display = 'block';
  }

  const store1Name = document.getElementById('store1-summary-name');
  const store2Name = document.getElementById('store2-summary-name');
  const store1Header = document.getElementById('store1-list-header');
  const store2Header = document.getElementById('store2-list-header');

  if (store1Name && profile.store1Name) store1Name.textContent = `🏪 ${profile.store1Name}`;
  if (store2Name && profile.store2Name) store2Name.textContent = `🏬 ${profile.store2Name}`;
  if (store1Header && profile.store1Name) store1Header.textContent = `🏪 ${profile.store1Name} List`;
  if (store2Header && profile.store2Name) store2Header.textContent = `🏬 ${profile.store2Name} List`;
}

// Dev-only: fill the profile form with realistic demo values so the
// 47-field assessment can be quick-tested.
export function fillDemoData() {
  const safeSetValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  };
  const safeCheckRadio = (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el) el.checked = true;
  };

  try {
    safeSetValue('name', 'Test User');
    safeSetValue('age', '54');
    safeCheckRadio('gender', 'male');
    safeSetValue('weight', '210');
    safeSetValue('target-weight', '190');
    safeSetValue('height-feet', '6');
    safeSetValue('height-inches', '0');
    safeSetValue('body-fat', '25');
    safeCheckRadio('goal', 'moderate_fatloss');
    safeCheckRadio('timeline', '12_weeks');

    safeCheckRadio('hormonal-health', 'declining');
    safeCheckRadio('metabolic-status', 'normal');
    safeCheckRadio('sleep-quality', '7-8');
    safeCheckRadio('stress-level', 'moderate');
    safeCheckRadio('recovery-capacity', 'moderate');
    safeCheckRadio('injuries', 'minor');

    safeCheckRadio('experience', 'intermediate');
    safeCheckRadio('current-training-days', '3-4');
    safeCheckRadio('training-preference', 'gym');
    safeSetValue('current-calories', '2200');

    safeCheckRadio('occupation-type', 'sedentary');
    safeSetValue('current-steps', '5000');

    safeCheckRadio('diet-history', 'occasional');
    safeCheckRadio('food-relationship', 'healthy');

    safeCheckRadio('meals-per-day', '3');
    safeCheckRadio('meal-types', 'breakfast_lunch_dinner');
    safeCheckRadio('cooking-time', '30-45');
    safeCheckRadio('cooking-skill', 'intermediate');

    safeCheckRadio('kitchen-equipment', 'full');
    safeCheckRadio('diet', 'standard');

    const allergens = document.querySelectorAll('#allergenGrid input[type="checkbox"]');
    allergens.forEach(cb => { cb.checked = false; });

    const cuisines = document.querySelectorAll('#cuisineGrid input[type="checkbox"]');
    if (cuisines.length > 0) {
      const pick = ['american', 'italian', 'mexican', 'asian', 'mediterranean'];
      cuisines.forEach(cb => { if (pick.includes(cb.value)) cb.checked = true; });
    }

    safeSetValue('weekly-budget', '150');
  } catch (error) {
    console.error('fillDemoData failed:', error);
    throw error;
  }
}

// Risk-flag aggregator over profile self-reports. Used by selectTrainingProtocol
// to bias toward gentler / recovery protocols.
export function calculateRedFlagScore(profile) {
  let score = 0;
  if (profile.metabolicStatus === 'damaged') score += 3;
  if (profile.gender === 'female' && profile.hormonalHealth === 'absent') score += 3;
  if (profile.gender === 'male' && profile.hormonalHealth === 'poor') score += 2;
  if (profile.stressLevel === 'very_high') score += 2;
  if (profile.sleepQuality <= '3-4') score += 2;
  if (profile.injuries === 'significant') score += 2;
  if (profile.recoveryCapacity === 'poor') score += 1;
  if (profile.foodRelationship === 'disordered') score += 3;
  return score;
}

// ─── Pattern detection (v1.4 — full 47-field) ─────────────────────

export function detectPatternFromProfile(profile) {
  if (!profile) return { pattern: 'A', score: 0, reasoning: [], description: 'Healthy recovery status' };

  let score = 0;
  const reasoning = [];

  // Tier 1: critical overrides
  if (profile.gender === 'female' && profile.hormonalHealth === 'absent') {
    return {
      pattern: 'C',
      score: 99,
      reasoning: [
        '🚨 Amenorrhea (absent menstrual cycle) is a critical signal — your body is in energy deficit or under too much stress to maintain reproductive function.',
        'Recovery protocol prioritizes restoring cycle before any aggressive training or dieting. Medical consultation recommended.',
      ],
      description: 'Recovery-first protocol — restoring hormonal function comes before fat loss or performance work',
    };
  }
  if (profile.metabolicStatus === 'damaged') {
    return {
      pattern: 'C',
      score: 99,
      reasoning: [
        '🚩 Metabolic damage from chronic dieting means your maintenance calories are below where they should be.',
        'You need a reverse-diet phase to rebuild metabolism BEFORE attempting fat loss. Cutting now would just make this worse.',
      ],
      description: 'Reverse-diet phase — rebuild metabolism before any deficit',
    };
  }
  if (profile.injuries === 'significant') {
    return {
      pattern: 'C',
      score: 99,
      reasoning: [
        '🩹 Significant injury history requires a recovery-led approach with medical clearance for affected movements.',
        'Protocol modifies exercise selection, volume, and intensity to work around the injury, not through it.',
      ],
      description: 'Recovery-led training — modified exercise selection around injuries',
    };
  }
  if (profile.foodRelationship === 'disordered') {
    return {
      pattern: 'C',
      score: 99,
      reasoning: [
        '⚠️ History of disordered eating — aggressive deficits and tracking pressure can be triggering.',
        'Conservative protocol with no calorie counting pressure. Working with an eating disorder specialist alongside this app is strongly recommended.',
      ],
      description: 'Conservative protocol — minimizes triggers, prioritizes a healthy relationship with food',
    };
  }

  // Tier 2: hormonal health
  if (profile.gender === 'male') {
    if (profile.hormonalHealth === 'poor') {
      score += 4;
      reasoning.push('🔬 Poor hormonal health (low libido, fatigue, mood issues) suggests low testosterone — train and eat to support hormone production, not deplete it.');
    } else if (profile.hormonalHealth === 'declining') {
      const ageMod = (profile.age >= 40) ? 1 : 0;
      score += 2 + ageMod;
      reasoning.push(`⚠️ Declining hormonal markers${profile.age >= 40 ? ' combined with age 40+' : ''} → conservative training intensity, prioritize sleep and recovery to protect testosterone.`);
    }
  } else if (profile.gender === 'female') {
    if (profile.hormonalHealth === 'irregular') {
      score += 3;
      reasoning.push('⚠️ Irregular menstrual cycle is often a signal of insufficient calories, excessive training stress, or both. Cautious approach until cycle stabilizes.');
    } else if (profile.hormonalHealth === 'perimenopause') {
      score += 2;
      reasoning.push('🌸 Perimenopause shifts your recovery curve — emphasize sleep, strength training over cardio, and slightly higher protein.');
    } else if (profile.hormonalHealth === 'postpartum') {
      score += 3;
      reasoning.push('🤱 Postpartum recovery: tissues are still healing and sleep is disrupted. Gentle re-entry into training, no aggressive deficits.');
    } else if (profile.hormonalHealth === 'menopause') {
      score += 1;
      reasoning.push('🌿 Post-menopausal physiology: prioritize strength training for bone density and lean mass preservation.');
    }
  }

  // Tier 3: stress + sleep
  if (profile.stressLevel === 'very_high') {
    score += 2;
    reasoning.push('😰 Very high stress level → elevated cortisol blunts recovery and drives fat retention. Lower training volume, more rest.');
  } else if (profile.stressLevel === 'high') {
    score += 1;
    reasoning.push('😬 High stress level → moderate the volume, prioritize recovery work.');
  }

  if (profile.sleepQuality === '1-2') {
    score += 3;
    reasoning.push('💤 Severely poor sleep (1-2 hrs feeling rested) is a top-priority lever — no protocol works without sleep. Address this first.');
  } else if (profile.sleepQuality === '3-4') {
    score += 2;
    reasoning.push('💤 Poor sleep (3-4 hrs feeling rested) significantly limits recovery. Reduced training intensity until sleep improves.');
  } else if (profile.sleepQuality === '5-6') {
    score += 1;
    reasoning.push('💤 Below-optimal sleep (5-6 hrs) → conservative training, focus on sleep hygiene.');
  }

  if (profile.stressLevel === 'very_high' && (profile.sleepQuality === '1-2' || profile.sleepQuality === '3-4')) {
    score += 1;
    reasoning.push('🚨 High stress + poor sleep is a cortisol-crisis pattern. The stack of these together is more damaging than either alone.');
  }

  // Tier 4: recovery capacity
  if (profile.recoveryCapacity === 'poor') {
    score += 2;
    reasoning.push('🔋 Self-reported poor recovery → significantly reduce training frequency until baseline improves.');
  } else if (profile.recoveryCapacity === 'moderate') {
    score += 1;
    reasoning.push('🔋 Moderate recovery capacity → careful volume management, build up gradually.');
  }

  // Tier 5: metabolic + diet history
  if (profile.metabolicStatus === 'adaptive') {
    score += 1;
    reasoning.push('📉 Metabolic adaptation from previous dieting → diet breaks built into the protocol.');
  }
  if (profile.dietHistory === 'chronic') {
    score += 1;
    reasoning.push('📅 Chronic dieting history → periodic refeeds and longer maintenance phases protect against further adaptation.');
  }

  // Tier 6: age
  if (profile.age >= 60) {
    score += 2;
    reasoning.push('👴 Age 60+ → longevity-focused protocol: bone density, balance, functional strength take priority over peak performance.');
  } else if (profile.age >= 50) {
    score += 1;
    reasoning.push('🧓 Age 50+ → moderate adjustments for recovery; intensity is fine, total weekly volume comes down.');
  }

  // Tier 7: minor/moderate injuries
  if (profile.injuries === 'moderate') {
    score += 1;
    reasoning.push('🩹 Moderate injuries → exercise modifications around affected areas.');
  } else if (profile.injuries === 'minor') {
    score += 1;
    reasoning.push('🩹 Minor injuries — note any movements that aggravate the area; back off to pain-free range until they fully resolve.');
  }

  // Score → pattern
  let pattern, description;
  if (score >= 10) {
    pattern = 'C';
    description = 'Recovery-first protocol — multiple signals indicate cortisol burden and depleted recovery';
  } else if (score >= 6) {
    pattern = 'B';
    description = 'Conservative protocol — meaningful adjustments needed for sustainable progress';
  } else if (score >= 2) {
    pattern = 'A-';
    description = 'Minor optimization — small adjustments will protect long-term progress';
  } else if (score === 1) {
    pattern = 'A';
    description = 'Healthy overall with one factor to mind — standard protocol with awareness';
  } else {
    pattern = 'A';
    description = 'Healthy recovery status — your body is in good shape to push hard';
  }

  if (pattern === 'A' && reasoning.length === 0) {
    reasoning.push('✅ Your assessment shows good sleep, manageable stress, and healthy recovery markers — no major red flags.');
    reasoning.push('💪 Standard protocol gives you the most flexibility to push intensity and pursue your goal aggressively.');
  }

  return { pattern, score, reasoning, description };
}

// ─── Week plan generation ─────────────────────────────────────────

function filterMealsByCuisine(cuisinePreferences, userProfile) {
  const dietType = (userProfile && userProfile.dietType) ? userProfile.dietType : 'omnivore';
  const allergens = (userProfile && userProfile.allergens) || [];

  const passesDiet = (meal) => {
    if (!meal) return false;
    if (dietType === 'vegan' && meal.dietType !== 'vegan') return false;
    if (dietType === 'vegetarian' && meal.dietType === 'omnivore') return false;
    if (allergens.length && Array.isArray(meal.allergens) && meal.allergens.some(a => allergens.includes(a))) return false;
    return true;
  };

  const snackOptions = window.snackOptions || {};
  const breakfastRecipes = window.breakfastRecipes || {};
  const lunchRecipes = window.lunchRecipes || {};
  const recipes = window.recipes || {};

  const filtered = {
    breakfasts: [],
    lunches: [],
    dinners: [],
    snacks: Object.values(snackOptions).filter(passesDiet),
  };

  Object.entries(breakfastRecipes).forEach(([key, meal]) => {
    if (passesDiet(meal)) filtered.breakfasts.push({ key, ...meal });
  });
  Object.entries(lunchRecipes).forEach(([key, meal]) => {
    if (passesDiet(meal)) filtered.lunches.push({ key, ...meal });
  });
  Object.entries(recipes).forEach(([key, meal]) => {
    if (passesDiet(meal) && cuisinePreferences.includes(meal.cuisine)) {
      filtered.dinners.push({ key, ...meal });
    }
  });
  if (filtered.dinners.length < 10) {
    Object.entries(recipes).forEach(([key, meal]) => {
      if (passesDiet(meal) && !cuisinePreferences.includes(meal.cuisine) && filtered.dinners.length < 20) {
        filtered.dinners.push({ key, ...meal });
      }
    });
  }

  console.log(`Filtered meals (diet=${dietType}, allergens=[${allergens.join(',')}]):`, {
    breakfasts: filtered.breakfasts.length,
    lunches: filtered.lunches.length,
    dinners: filtered.dinners.length,
    snacks: filtered.snacks.length,
  });

  if (filtered.breakfasts.length === 0) console.warn(`⚠️ No breakfasts match diet=${dietType}. Database may need more ${dietType} options.`);
  if (filtered.lunches.length === 0) console.warn(`⚠️ No lunches match diet=${dietType}.`);
  if (filtered.dinners.length === 0) console.warn(`⚠️ No dinners match diet=${dietType}.`);
  if (filtered.snacks.length === 0) console.warn(`⚠️ No snacks match diet=${dietType}.`);

  return filtered;
}

function selectMealsForDay(macros, availableMeals, userProfile, dayNumber) {
  const breakfastIndex = (dayNumber - 1) % availableMeals.breakfasts.length;
  const lunchIndex = ((dayNumber - 1) * 3) % availableMeals.lunches.length;
  const dinnerIndex = ((dayNumber - 1) * 5) % availableMeals.dinners.length;
  const snackIndex = ((dayNumber - 1) * 2) % availableMeals.snacks.length;

  const breakfast = availableMeals.breakfasts[breakfastIndex];
  const lunch = availableMeals.lunches[lunchIndex];
  const dinner = availableMeals.dinners[dinnerIndex];
  const snack = availableMeals.snacks[snackIndex];

  const breakfastCost = 4.50;
  const lunchCost = 5.50;
  const dinnerCost = 6.00;
  const snackCost = snack.cost || 2.50;
  const totalCost = breakfastCost + lunchCost + dinnerCost + snackCost;

  // calculateMealMacros reads window.profile. Swap temporarily.
  const savedProfile = window.profile;
  window.profile = userProfile;
  const calculateMealMacros = window.calculateMealMacros;
  const breakfastMealMacros = calculateMealMacros(breakfast, 'breakfast');
  const lunchMealMacros = calculateMealMacros(lunch, 'lunch');
  const dinnerMealMacros = calculateMealMacros(dinner, 'dinner');
  const snackMealMacros = calculateMealMacros(snack, 'snack');
  window.profile = savedProfile;

  const actualMacros = {
    protein: breakfastMealMacros.protein + lunchMealMacros.protein + dinnerMealMacros.protein + snackMealMacros.protein,
    carbs: breakfastMealMacros.carbs + lunchMealMacros.carbs + dinnerMealMacros.carbs + snackMealMacros.carbs,
    fat: breakfastMealMacros.fat + lunchMealMacros.fat + dinnerMealMacros.fat + snackMealMacros.fat,
    calories: breakfastMealMacros.calories + lunchMealMacros.calories + dinnerMealMacros.calories + snackMealMacros.calories,
  };

  return {
    day: dayNumber,
    dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayNumber - 1],
    breakfast: { meal: breakfast, macros: breakfastMealMacros, cost: breakfastCost },
    lunch: { meal: lunch, macros: lunchMealMacros, cost: lunchCost },
    dinner: { meal: dinner, macros: dinnerMealMacros, cost: dinnerCost },
    snack: { meal: snack, macros: snackMealMacros, cost: snackCost },
    actualMacros,
    totalCost,
  };
}

function optimizeWeekForBudget(weekPlan, currentCost, targetBudget) {
  const overBudget = currentCost - targetBudget;
  console.log(`Optimizing week: need to save $${overBudget.toFixed(2)}`);

  const snackOptions = window.snackOptions || {};
  weekPlan.forEach(day => {
    if (day.snack.cost > 2.00) {
      const cheaperSnack = Object.values(snackOptions).find(s => s.cost < 2.00);
      if (cheaperSnack) {
        day.snack.meal = cheaperSnack;
        day.snack.cost = cheaperSnack.cost;
      }
    }
  });

  const newTotal = weekPlan.reduce((sum, day) => sum + day.totalCost, 0);
  console.log(`After optimization: $${newTotal.toFixed(2)}`);
  return weekPlan;
}

export function generateOptimalWeek(userProfile) {
  console.log('🤖 Generating optimal week for profile:', userProfile);

  const macros = {
    protein: userProfile.protein,
    carbs: userProfile.carbs,
    fat: userProfile.fat,
    calories: userProfile.targetCalories,
  };
  console.log('Target macros:', macros);

  const availableMeals = filterMealsByCuisine(userProfile.cuisinePreferences, userProfile);

  const weekPlan = [];
  let totalWeekCost = 0;
  for (let day = 1; day <= 7; day++) {
    const dayPlan = selectMealsForDay(macros, availableMeals, userProfile, day);
    weekPlan.push(dayPlan);
    totalWeekCost += dayPlan.totalCost;
  }

  const targetBudget = userProfile.weeklyBudget || 100;
  if (totalWeekCost > targetBudget) {
    console.log(`⚠️ Over budget: $${totalWeekCost.toFixed(2)} > $${targetBudget}`);
    optimizeWeekForBudget(weekPlan, totalWeekCost, targetBudget);
    totalWeekCost = weekPlan.reduce((sum, day) => sum + day.totalCost, 0);
  }

  let realTotalCost = totalWeekCost;
  try {
    const savedProfile = window.profile;
    window.profile = { ...userProfile, weekPlan };
    const calculateWeeklyIngredients = window.calculateWeeklyIngredients;
    const ingredientData = (typeof calculateWeeklyIngredients === 'function')
      ? calculateWeeklyIngredients()
      : null;
    if (ingredientData && typeof window.generateShoppingList === 'function') {
      const shoppingList = window.generateShoppingList();
      if (shoppingList && typeof shoppingList.totalCost === 'number' && shoppingList.totalCost > 0) {
        realTotalCost = shoppingList.totalCost;
        console.log(`💰 Real cost from ingredients: $${realTotalCost.toFixed(2)} (placeholder was $${totalWeekCost.toFixed(2)})`);
      }
    }
    window.profile = savedProfile;
  } catch (err) {
    console.warn('Could not compute real cost, using placeholder:', err.message);
  }

  console.log('✅ Week generated successfully!');
  return {
    weekPlan,
    totalWeekCost: realTotalCost,
    placeholderCost: totalWeekCost,
    dailyMacros: macros,
  };
}

// ─── Meal rehydration ─────────────────────────────────────────────

export function rehydrateMealMethods() {
  const profile = window.profile;
  if (!profile || !profile.weekPlan) return;

  const dbs = {
    breakfast: window.breakfastRecipes || {},
    lunch: window.lunchRecipes || {},
    dinner: window.recipes || {},
    snack: window.snackOptions || {},
  };

  let rehydrated = 0;
  let missing = 0;

  profile.weekPlan.forEach(day => {
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
      const slotData = day[slot];
      if (!slotData || !slotData.meal) return;
      const meal = slotData.meal;

      if (typeof meal.getIngredients === 'function') return;

      const key = meal.key;
      if (!key) {
        const db = dbs[slot];
        const liveEntry = Object.entries(db).find(([, v]) => v.name === meal.name);
        if (liveEntry) {
          const [foundKey, liveRecipe] = liveEntry;
          meal.key = foundKey;
          if (typeof liveRecipe.getIngredients === 'function') {
            meal.getIngredients = liveRecipe.getIngredients;
            rehydrated++;
            return;
          }
        }
        missing++;
        return;
      }

      const liveRecipe = dbs[slot][key];
      if (liveRecipe && typeof liveRecipe.getIngredients === 'function') {
        meal.getIngredients = liveRecipe.getIngredients;
        rehydrated++;
      } else {
        missing++;
      }
    });
  });

  if (rehydrated > 0 || missing > 0) {
    console.log('🔧 Rehydrated meal methods: ' + rehydrated + ' restored, ' + missing + ' missing');
  }
}

// ─── Heavy: full 47-field assessment submit ───────────────────────
// Renamed from monolith's `saveProfile(event)` to avoid clash with the
// state-persist `saveProfile(profile)` exported from src/state/profile.js.

export function submitProfileAssessment(event) {
  if (event) event.preventDefault();

  try {
    console.log('📊 Saving comprehensive elite assessment...');

    // Page 8: cuisine validation (must have >= 2)
    let cuisines = [];
    try {
      const cuisineCheckboxes = document.querySelectorAll('#cuisineGrid input[type="checkbox"]:checked');
      if (!cuisineCheckboxes || cuisineCheckboxes.length === 0) {
        if (typeof window.showLogToast === 'function') window.showLogToast('Select at least 2 cuisines');
        else alert('Please select at least 2 cuisines');
        return;
      }
      cuisineCheckboxes.forEach(cb => { cuisines.push(cb.value); });
    } catch (err) {
      alert('Error getting cuisines: ' + err.message);
      return;
    }
    if (cuisines.length < 2) {
      alert('Please select at least 2 cuisines (you selected ' + cuisines.length + ')');
      return;
    }

    // Page 1: demographics
    const name = document.getElementById('userName').value;
    const age = parseInt(document.getElementById('userAge').value);
    const gender = document.getElementById('userGender').value;
    const heightFeet = parseInt(document.getElementById('heightFeet').value);
    const heightInches = parseInt(document.getElementById('heightInches').value);
    const totalHeight = (heightFeet * 12) + heightInches;
    const weight = parseInt(document.getElementById('userWeight').value);
    const targetWeight = document.getElementById('targetWeight')?.value ? parseInt(document.getElementById('targetWeight').value) : null;
    const bodyFatEstimate = document.getElementById('bodyFatEstimate')?.value || '';
    const goal = document.getElementById('userGoal').value;
    const timeline = document.getElementById('timeline')?.value || '';

    // Page 2: health & hormonal
    const injuries = document.querySelector('input[name="injuries"]:checked')?.value || 'none';
    const injuryAreas = Array.from(document.querySelectorAll('[id^="injury-"]:checked')).map(el => el.value);
    const stressLevel = document.getElementById('stressLevel')?.value || 'moderate';
    const sleepQuality = document.getElementById('sleepQuality')?.value || '7-8';
    const hormonalHealth = gender === 'male'
      ? (document.getElementById('hormonalHealthMale')?.value || 'good')
      : (document.getElementById('hormonalHealthFemale')?.value || 'regular');

    // Page 3: training
    const yearsTraining = document.getElementById('yearsTraining')?.value || '1-2years';
    const experience = document.querySelector('input[name="experience"]:checked')?.value || 'intermediate';
    const currentTrainingDays = document.getElementById('currentTrainingDays')?.value || '3-4';
    const strengthLevel = document.getElementById('strengthLevel')?.value || '';
    const recoveryCapacity = document.getElementById('recoveryCapacity')?.value || 'good';
    const focus = document.querySelector('input[name="focus"]:checked')?.value || 'fat_loss';

    // Page 4: nutrition history
    const currentCalories = document.getElementById('currentCalories')?.value || '';
    const dietHistory = document.getElementById('dietHistory')?.value || 'none';
    const weightPattern = document.getElementById('weightPattern')?.value || 'stable';
    const metabolicStatus = document.getElementById('metabolicStatus')?.value || 'healthy';
    const hungerSignals = document.getElementById('hungerSignals')?.value || 'good';
    const foodRelationship = document.getElementById('foodRelationship')?.value || 'healthy';

    // Page 5: lifestyle
    const occupationType = document.getElementById('occupationType')?.value || 'sedentary';
    const dailySteps = document.getElementById('dailySteps')?.value || '';
    const qualityToHours = { '1-2': 'under5', '3-4': '5-6', '5-6': '6-7', '7-8': '7-8', '9-10': '8-9' };
    const sleepHoursRaw = document.getElementById('sleepHours')?.value || '7-8';
    const sleepHours = qualityToHours[sleepQuality] || sleepHoursRaw;
    const alcoholIntake = document.getElementById('alcoholIntake')?.value || 'none';
    const supportSystem = document.getElementById('supportSystem')?.value || 'good';
    const supplements = Array.from(document.querySelectorAll('[id^="supp-"]:checked')).map(el => el.value);

    // Page 6: goals
    const specificEvent = document.getElementById('specificEvent')?.value || '';
    const topPriority = document.getElementById('topPriority')?.value || 'aesthetics';
    const whatWorked = document.getElementById('whatWorked')?.value || '';
    const biggestObstacle = document.getElementById('biggestObstacle')?.value || 'motivation';
    const restartCount = document.getElementById('restartCount')?.value || 'first';

    // Page 7: readiness
    const motivationLevel = parseInt(document.getElementById('motivationLevel')?.value || 8);
    const timeForTraining = document.getElementById('timeForTraining')?.value || 'moderate';
    const timeForMealPrep = document.getElementById('timeForMealPrep')?.value || 'moderate';
    const foodBudget = document.getElementById('foodBudget')?.value || 'comfortable';
    const complianceConfidence = document.getElementById('complianceConfidence')?.value || 'good';
    const quitTriggers = Array.from(document.querySelectorAll('[id^="quit-"]:checked')).map(el => el.value);

    // Page 8: dietary
    const diet = document.querySelector('input[name="diet"]:checked')?.value || 'omnivore';
    const allergens = Array.from(document.querySelectorAll('[id^="allergen-"]:checked')).map(el => el.value);
    const weeklyBudget = document.getElementById('weeklyBudget')?.value || 'moderate';

    console.log('✅ All 47 data points captured');

    // Red flag detection
    const redFlags = [];
    if (gender === 'female' && hormonalHealth === 'absent') {
      redFlags.push({
        type: 'CRITICAL',
        issue: 'Amenorrhea (Absent Menstrual Cycle)',
        recommendation: 'Strongly recommend medical consultation before starting any diet or training program. Amenorrhea indicates undereating, overtraining, or hormonal issues.',
      });
    }
    if (metabolicStatus === 'damaged') {
      redFlags.push({
        type: 'HIGH',
        issue: 'Metabolic Damage',
        recommendation: 'Reverse diet protocol recommended BEFORE attempting fat loss. Need to rebuild metabolism first.',
      });
    }
    if (foodRelationship === 'disordered') {
      redFlags.push({
        type: 'HIGH',
        issue: 'Disordered Eating History',
        recommendation: 'Recommend working with eating disorder specialist alongside nutrition coaching.',
      });
    }
    if (stressLevel === 'very_high' && sleepQuality <= '3-4') {
      redFlags.push({
        type: 'MODERATE',
        issue: 'Very High Stress + Poor Sleep',
        recommendation: 'Focus on recovery and stress management before aggressive fat loss attempts.',
      });
    }
    console.log('🚩 Red flags detected:', redFlags.length);

    // Activity level from occupation + training
    let activityLevel = 'sedentary';
    if (occupationType === 'very_active' || currentTrainingDays === '7plus') {
      activityLevel = 'very_active';
    } else if (occupationType === 'active' || currentTrainingDays === '5-6') {
      activityLevel = 'active';
    } else if (occupationType === 'moderate' || currentTrainingDays === '3-4') {
      activityLevel = 'moderate';
    } else if (currentTrainingDays === '1-2') {
      activityLevel = 'light';
    }

    // Nutrition targets
    const bmr = calculateBMR(weight, totalHeight, age, gender);
    const tdee = Math.round(bmr * getActivityMultiplier(activityLevel));
    const waterOz = calculateHydration(weight, activityLevel, 'healthy');
    const calories = calculateCalories(bmr, activityLevel, goal, 'healthy', age);
    const macros = calculateMacros(calories, weight, gender);

    // Build comprehensive profile
    const profile = {
      name, age, gender, weight, targetWeight, height: totalHeight, bodyFatEstimate, goal, timeline,
      injuries, injuryAreas, stressLevel, sleepQuality, hormonalHealth,
      yearsTraining, experience, currentTrainingDays, strengthLevel, recoveryCapacity, focus,
      currentCalories, dietHistory, weightPattern, metabolicStatus, hungerSignals, foodRelationship,
      occupationType, dailySteps, sleepHours, alcoholIntake, supportSystem, supplements,
      specificEvent, topPriority, whatWorked, biggestObstacle, restartCount,
      motivationLevel, timeForTraining, timeForMealPrep, foodBudget, complianceConfidence, quitTriggers,
      diet, allergens, cuisinePreferences: cuisines, weeklyBudget,
      activityLevel, bmr, tdee, waterOz,
      targetCalories: calories,
      protein: macros.protein, carbs: macros.carbs, fat: macros.fat,
      calories,
      redFlags,
      createdDate: new Date().toISOString(),
      assessmentVersion: 'elite_v1',
    };
    window.profile = profile;
    console.log('📊 Profile created with 47 data points');

    // Pattern detection
    const patternResult = detectPatternFromProfile(profile);
    profile.pattern = patternResult.pattern;
    profile.patternScore = patternResult.score;
    profile.patternReasoning = patternResult.reasoning;
    profile.patternDescription = patternResult.description;
    profile.patternAlgorithmVersion = 'v1.4.1';
    console.log(`🎯 Pattern detected: ${patternResult.pattern} (score=${patternResult.score})`, patternResult.reasoning);

    // Auto-generate optimal week
    console.log('🤖 Auto-generating optimal weekly meal plan...');
    const generatedPlan = generateOptimalWeek(profile);
    profile.weekPlan = generatedPlan.weekPlan;
    profile.weeklyBudget = generatedPlan.totalWeekCost;
    profile.dailyMacroTargets = generatedPlan.dailyMacros;
    console.log('✅ Week plan generated');

    const state = window.state;
    console.log('Weekly budget:', state.weeklyBudgetUsed);
    console.log('Budget optimization suggestions:', state.budgetOptimizationSuggestions ? state.budgetOptimizationSuggestions.length : 0);

    // Initialize store assignments
    if (!state.storeAssignments) {
      state.storeAssignments = {};
      const shoppingCategories = window.shoppingCategories || [];
      shoppingCategories.forEach(cat => {
        cat.items.forEach(item => {
          state.storeAssignments[item.id] = item.defaultStore;
        });
      });
      if (typeof window.saveState === 'function') window.saveState();
    }

    // Shopping list
    console.log('🛒 Generating shopping list...');
    if (typeof window.generateShoppingList === 'function') {
      state.dynamicShoppingList = window.generateShoppingList();
    }
    if (typeof window.saveState === 'function') window.saveState();
    console.log('✅ Shopping list generated:', state.dynamicShoppingList ? state.dynamicShoppingList.items.length : 0, 'items');

    localStorage.setItem('user-profile', JSON.stringify(profile));

    console.log('🏠 Going directly to home page...');
    try {
      if (typeof window.closeProfileModal === 'function') window.closeProfileModal();
    } catch (uiErr) {
      console.warn('closeProfileModal error (non-fatal):', uiErr);
      try { document.getElementById('profileModal')?.classList.remove('active'); } catch (e) {}
      try { if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner(); } catch (e) {}
    }
  } catch (error) {
    console.error('Error in submitProfileAssessment:', error);
    alert('An error occurred while calculating your plan. Error: ' + error.message);
  }
}
