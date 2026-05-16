// Elite training protocol database.
// Extracted from index.html lines 22757-24137.

export const ELITE_PROTOCOL_DATABASE = {
  
  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 1: MEN - FAT LOSS PROTOCOLS
  // ═══════════════════════════════════════════════════════════════════════
  
  // Men 18-30: Aggressive Fat Loss (Doucette Method)
  male_young_aggressive_shred: {
    name: "Doucette Aggressive Shred",
    source: "Greg Doucette - IFBB Pro Methodology",
    ageRange: "18-30",
    gender: "male",
    goal: "aggressive_fat_loss",
    tagline: "Maximize fat loss while preserving muscle - capitalize on youthful recovery",
    
    philosophy: "You can recover from anything at this age. Train hard, eat high volume, stay consistent. Your metabolism is a furnace - feed it right and it'll burn everything.",
    
    keyPriorities: [
      "🔥 Aggressive deficit: 600-800 cal/day (25-30% below TDEE)",
      "🥩 VERY high protein: 1.2-1.4g per lb bodyweight (muscle preservation + satiety)",
      "🥗 Volume eating strategy: Fill up on high-volume, low-calorie foods",
      "💪 High-frequency training: 5-6 days/week, PPL or upper/lower split",
      "📈 'Harder than last time': Add reps, weight, or sets every session",
      "🏃 Daily activity: 10k+ steps PLUS 30-45 min cardio 4-5x/week",
      "🔄 Weekly refeed: 1 day at maintenance calories (metabolic reset)",
      "😴 Sleep 7-8 hours minimum (recovery and hunger hormone regulation)",
      "📊 Track religiously: Every calorie, every macro, every workout",
      "🚫 Avoid: Excessive dietary fat (keep under 0.3g/lb), liquid calories, cheat days"
    ],
    
    calorieStrategy: {
      type: "aggressive_deficit_with_refeed",
      weeklyPattern: [
        {days: "Mon-Sat", deficit: 700},
        {days: "Sun", calories: "maintenance"}
      ],
      adjustments: "Drop 100 cal if no progress for 2 weeks"
    },
    
    macros: {
      proteinPerLb: 1.3,
      fatPerLb: 0.25,
      carbsFromRemaining: true,
      fiberMinimum: "30g",
      volumeFoods: ["Vegetables (unlimited)", "Low-cal sauces", "Egg whites", "Lean proteins"]
    },
    
    training: {
      split: "Push/Pull/Legs repeated 2x per week",
      frequency: 6,
      setsPerMuscle: "16-22 sets/week",
      repRange: "8-15 reps (hypertrophy focus)",
      intensity: "Train to 1-2 RIR (reps in reserve)",
      progression: "Add reps weekly, then add weight when hitting top range",
      cardio: {
        type: "LISS or incline walking",
        frequency: "4-5x/week",
        duration: "30-45 minutes",
        timing: "Post-workout or fasted AM preferred"
      }
    },
    
    weeklyStructure: {
      monday: "Push (Chest, Shoulders, Triceps)",
      tuesday: "Pull (Back, Biceps, Rear Delts)",
      wednesday: "Legs (Quads, Hams, Calves)",
      thursday: "Push",
      friday: "Pull", 
      saturday: "Legs",
      sunday: "Rest + Refeed"
    },
    
    supplements: {
      essential: ["Protein powder", "Creatine 5g", "Caffeine pre-workout"],
      optional: ["BCAAs during training", "Multivitamin", "Fish oil 2g"]
    },
    
    expectedResults: {
      week1_4: "1.5-2 lbs/week (includes water weight)",
      week5_12: "1-1.5 lbs/week",
      strength: "Maintain or slight decrease acceptable",
      bodyComp: "Significant muscle retention with aggressive fat loss"
    },
    
    dietBreak: {
      timing: "After 12-16 weeks",
      duration: "1-2 weeks at maintenance",
      purpose: "Metabolic recovery, psychological break, leptin restoration"
    },
    
    redFlags: [
      "❌ Strength loss >15% on main lifts",
      "❌ Sleep dropping below 6 hours consistently",
      "❌ Libido crash",
      "❌ Chronic fatigue/lethargy",
      "❌ Extreme hunger daily (volume eating not working)"
    ],
    
    successMarkers: [
      "✅ Strength maintained within 10%",
      "✅ Energy levels good",
      "✅ Adherence >90%",
      "✅ Consistent 1+ lb/week loss",
      "✅ Visual muscle retention"
    ]
  },

  // Men 30-40: Sustainable Transformation (Mitchell Method)
  male_30s_transformation: {
    name: "Mitchell 12-Week Transformation",
    source: "Nick Mitchell - Ultimate Performance System",
    ageRange: "30-40",
    gender: "male",
    goal: "transformation",
    tagline: "Executive transformation protocol - balance results with demanding lifestyle",
    
    philosophy: "You're juggling career, family, stress. This isn't about grinding - it's about intelligent programming, hormonal optimization, and strategic recovery.",
    
    keyPriorities: [
      "🎯 12-week transformation focus (realistic timeline for busy professionals)",
      "⚡ Calorie cycling: Training days moderate deficit, rest days maintenance",
      "💪 Heavy compounds prioritized: Squat, deadlift, bench, press variations",
      "🔄 4-week mesocycles: Accumulation → Intensification → Deload",
      "💊 Hormonal optimization: Testosterone support through nutrition, sleep, stress management",
      "😴 Sleep 8+ hours NON-NEGOTIABLE (make this your #1 priority)",
      "🧘 Stress management: Your cortisol will sabotage everything if unchecked",
      "🥩 Protein: 1-1.2g per lb, quality sources",
      "🍺 Alcohol ≤2 drinks/week (testosterone and recovery destroyer)",
      "📊 Biofeedback tracking: HRV, sleep quality, readiness scores"
    ],
    
    mesocycleStructure: {
      weeks1_4: {
        name: "Accumulation Phase",
        focus: "Build training volume, establish work capacity",
        sets: "12-16 sets per muscle group",
        reps: "10-15",
        intensity: "RPE 7-8",
        cardio: "2-3x LISS"
      },
      weeks5_8: {
        name: "Intensification Phase", 
        focus: "Increase load, lower volume, build strength",
        sets: "10-12 sets per muscle group",
        reps: "6-10",
        intensity: "RPE 8-9",
        cardio: "2x HIIT"
      },
      weeks9_10: {
        name: "Deload",
        focus: "Active recovery, maintain movement",
        volume: "50% of normal",
        intensity: "RPE 5-6"
      },
      weeks11_12: {
        name: "Peak Phase",
        focus: "Show off the results",
        volume: "Moderate",
        intensity: "Maintain"
      }
    },
    
    calorieStrategy: {
      type: "intelligent_cycling",
      trainingDays: "TDEE - 500 cal",
      restDays: "TDEE (maintenance)",
      refeed: "Every 10 days at TDEE + 200"
    },
    
    training: {
      frequency: 4,
      split: "Upper/Lower",
      structure: {
        upperA: "Horizontal push/pull focus (bench, rows)",
        lowerA: "Squat dominant",
        upperB: "Vertical push/pull focus (OHP, pull-ups)",
        lowerB: "Hip hinge dominant (deadlifts, RDLs)"
      },
      sessionLength: "60 minutes MAX (quality over duration)"
    },
    
    nutritionProtocol: {
      protein: "1.1g per lb bodyweight",
      fat: "0.35-0.4g per lb (hormone support)",
      carbs: "Remainder, cycle around training",
      micronutrients: {
        zinc: "30mg (testosterone)",
        magnesium: "400mg (sleep, recovery)",
        vitaminD: "5000 IU (if deficient)",
        omega3: "2-3g (inflammation)"
      }
    },
    
    supplements: {
      tier1_essential: ["Creatine 5g", "Vitamin D3", "Omega-3 2-3g", "Magnesium"],
      tier2_recommended: ["Zinc 30mg", "Ashwagandha 600mg (cortisol control)", "Quality multivitamin"],
      tier3_optional: ["Rhodiola (stress adaptation)", "Citrulline malate (pump/performance)"]
    },
    
    expectedResults: {
      total: "15-25 lbs fat loss in 12 weeks while maintaining/building muscle",
      bodyComp: "Visible abs, defined physique",
      strength: "Maintained or increased on main lifts",
      hormonal: "Improved testosterone markers, better sleep, higher libido"
    },
    
    lifestyleIntegration: {
      meal_prep: "Sunday prep for week",
      training_time: "Morning preferred (hormonal optimization)",
      stress_management: "10 min daily meditation or breathwork",
      sleep_protocol: "Same bedtime daily, dark room, cool temp"
    }
  },

  // Men 40-50: Anti-Inflammatory Lean Protocol
  male_40s_longevity_lean: {
    name: "Longevity Lean Protocol",
    source: "Gunnar Peterson + RP - Functional Performance + Evidence-Based",
    ageRange: "40-50",
    gender: "male",
    goal: "lean_longevity",
    tagline: "Get lean while optimizing healthspan, hormones, and longevity markers",
    
    philosophy: "At 40+, your approach must change. Inflammation is your enemy #1. Hormones need support. Recovery takes longer. But you can still get incredibly lean and strong - you just need to be smarter, not harder.",
    
    CRITICAL_FOUNDATION: {
      rule1: "🔥 FIX INFLAMMATION FIRST - 2 weeks before any deficit",
      rule2: "⚡ NEVER stay in deficit >2-3 consecutive days (metabolic adaptation)",
      rule3: "😴 SLEEP IS MEDICINE - 8+ hours or this won't work",
      rule4: "🧘 STRESS KILLS PROGRESS - manage cortisol or stay fat"
    },
    
    phaseStructure: {
      phase1: {
        name: "🔥 Inflammation Reset (Weeks 1-2)",
        calories: "Maintenance (TDEE)",
        focus: [
          "Gut health optimization",
          "Anti-inflammatory foods only",
          "Sleep protocol establishment",
          "Stress management practices",
          "Baseline measurements"
        ],
        supplements: ["Probiotic 50B CFU", "Omega-3 4g", "Curcumin 1000mg", "Magnesium 500mg"],
        eliminate: ["Processed foods", "Alcohol", "Sugar", "Inflammatory oils"],
        emphasize: ["Fatty fish", "Leafy greens", "Berries", "Olive oil", "Turmeric", "Ginger"]
      },
      
      phase2: {
        name: "⚡ Fat Loss Cycling Phase (Weeks 3-12)",
        caloriePattern: "2 deficit / 1 maintenance / repeat",
        weekExample: [
          {day: "Mon", deficit: 500, focus: "Training day"},
          {day: "Tue", deficit: 500, focus: "Training day"},
          {day: "Wed", maintenance: true, focus: "Recovery day"},
          {day: "Thu", deficit: 500, focus: "Training day"},
          {day: "Fri", deficit: 500, focus: "Training day"},
          {day: "Sat", maintenance: true, focus: "Active recovery"},
          {day: "Sun", maintenance: true, focus: "Rest"}
        ],
        rationale: "Prevents metabolic adaptation, preserves hormones, maintains energy"
      },
      
      phase3: {
        name: "🔄 Mandatory Diet Break (Week 13)",
        calories: "Maintenance for 7-10 days",
        purpose: "Leptin restoration, metabolic reset, psychological break",
        activity: "Maintain training, increase NEAT"
      }
    },
    
    keyPriorities: [
      "🔥 Anti-inflammatory nutrition: Omega-3s daily, colorful vegetables, eliminate processed foods",
      "⚡ Strict 2-day deficit cycling: NEVER exceed 2-3 consecutive deficit days",
      "🥩 Very high protein: 1.2g per lb minimum (offset sarcopenia)",
      "💪 Heavy compound lifts: Preserve testosterone and muscle mass",
      "🏃 Zone 2 cardio ONLY: 30-40 min, 3-4x/week (NO high cortisol HIIT)",
      "😴 Sleep optimization: 8+ hours, dark room, cool temp, same schedule",
      "🧘 Daily stress management: Meditation, nature walks, breathwork",
      "⏰ Time-restricted eating: 10-12 hour eating window (autophagy, metabolic health)",
      "💊 Strategic supplementation: Address age-related deficiencies",
      "📊 Biomarker tracking: HRV, sleep quality, morning readiness, libido"
    ],
    
    macros: {
      protein: "1.2-1.4g per lb (very high for muscle preservation)",
      fat: "0.4-0.45g per lb (hormone production support)",
      carbs: "Remainder from calories, time around training",
      fiber: "40-50g daily (gut health, inflammation control)",
      omega3: "4-5g daily (anti-inflammatory)",
      water: "1 oz per lb bodyweight minimum"
    },
    
    training: {
      philosophy: "Functional strength + muscle preservation + injury prevention",
      frequency: 4,
      split: "Functional Upper/Lower",
      structure: {
        upperA: {
          mainLift: "Bench press variation (3-5 sets, 5-8 reps)",
          accessories: ["Rows 3x10", "Face pulls 3x15", "Core work"],
          duration: "50 minutes"
        },
        lowerA: {
          mainLift: "Squat variation (3-5 sets, 5-8 reps)",
          accessories: ["RDL 3x10", "Lunges 3x12", "Core work"],
          duration: "50 minutes"
        },
        upperB: {
          mainLift: "Overhead press variation (3-5 sets, 5-8 reps)",
          accessories: ["Pull-ups/Pulldowns 3x10", "Delt work", "Rotator cuff"],
          duration: "50 minutes"
        },
        lowerB: {
          mainLift: "Deadlift variation (3-5 sets, 5-8 reps)",
          accessories: ["Bulgarian split squats 3x10", "Core work"],
          duration: "50 minutes"
        }
      },
      cardio: {
        type: "Zone 2 ONLY (conversational pace)",
        frequency: "4-5x per week",
        duration: "30-40 minutes",
        modalities: ["Incline walking", "Cycling", "Swimming", "Rowing"],
        avoid: "HIIT, sprints, high-impact (cortisol spike)"
      },
      mobility: {
        frequency: "Daily",
        duration: "10-15 minutes",
        focus: ["Hip mobility", "Thoracic spine", "Shoulder health", "Ankle mobility"]
      }
    },
    
    antiInflammatoryNutrition: {
      dailyMustHaves: [
        "Fatty fish (salmon, sardines, mackerel) - omega-3s",
        "2-3 cups leafy greens - antioxidants",
        "1 cup berries - polyphenols",
        "Turmeric/ginger - natural anti-inflammatory",
        "Olive oil - healthy fats",
        "Green tea - EGCG",
        "Walnuts/chia seeds - ALA omega-3s"
      ],
      strictlyAvoid: [
        "Processed foods and seed oils",
        "Refined sugars and high-fructose corn syrup",
        "Excessive alcohol (max 2 drinks/week)",
        "Trans fats",
        "Processed meats"
      ]
    },
    
    supplements: {
      tier1_foundation: [
        "Omega-3 fish oil: 4-5g daily (EPA+DHA combined)",
        "Vitamin D3: 5000 IU (if deficient, check levels)",
        "Magnesium glycinate: 400-500mg (sleep, recovery)",
        "Zinc: 30mg (testosterone support)"
      ],
      tier2_antiInflammatory: [
        "Curcumin: 1000mg with black pepper",
        "Probiotic: 50 billion CFU multi-strain",
        "Creatine monohydrate: 5g (muscle, cognitive)",
        "Ashwagandha: 600mg (cortisol management)"
      ],
      tier3_optimization: [
        "Tongkat Ali: 200-400mg (testosterone)",
        "Boron: 10mg (free testosterone)",
        "CoQ10: 200mg (mitochondrial health)",
        "NAC: 600mg (glutathione production)"
      ]
    },
    
    expectedResults: {
      fatLoss: "0.5-1 lb/week (sustainable, muscle-preserving)",
      strength: "Maintained or improved on main lifts",
      bodyComp: "Lean muscle mass preserved or increased",
      markers: [
        "Reduced systemic inflammation (hsCRP if tested)",
        "Improved sleep quality",
        "Better HRV scores",
        "Maintained/improved libido",
        "Stable energy throughout day",
        "No chronic joint pain"
      ]
    },
    
    duration: "12-16 weeks with mandatory diet breaks every 12 weeks",
    
    criticalSuccessFactors: [
      "✅ Completed 2-week inflammation reset before dieting",
      "✅ Never exceeded 2 consecutive deficit days",
      "✅ Sleep averaging 8+ hours",
      "✅ Stress management practiced daily",
      "✅ Strength maintained within 5% on main lifts",
      "✅ Energy levels stable",
      "✅ Libido maintained",
      "✅ No chronic inflammation symptoms"
    ],
    
    redFlags_stopImmediately: [
      "❌ Chronic fatigue despite adequate sleep",
      "❌ Libido crash",
      "❌ Joint pain/inflammation increasing",
      "❌ Sleep quality deteriorating",
      "❌ Strength loss >10%",
      "❌ Depression/mood issues",
      "❌ HRV consistently dropping"
    ]
  },

  // Men 50+: Longevity & Function
  male_50plus_longevity: {
    name: "Peterson Longevity Protocol",
    source: "Gunnar Peterson - Functional Longevity Focus",
    ageRange: "50+",
    gender: "male",
    goal: "longevity_health",
    tagline: "Optimize healthspan, maintain independence, strategic body composition",
    
    philosophy: "You're playing the long game now. Function and health trump aesthetics. Preserve muscle and bone, maintain independence, optimize metabolic health. Fat loss is a bonus, not the goal.",
    
    keyPriorities: [
      "💪 Muscle preservation PARAMOUNT: Critical for longevity and metabolic health",
      "🦴 Bone density focus: Weight-bearing exercises, adequate calcium and vitamin D",
      "⚡ Minimal deficit: 200-300 cal MAXIMUM (muscle loss risk too high)",
      "🥩 Very high protein: 1.2-1.6g per lb (offset age-related sarcopenia)",
      "🧘 Functional movement: Balance, mobility, stability > aesthetics",
      "😴 Sleep optimization: 8-9 hours (recovery capacity reduced)",
      "🏃 Low-impact cardio: Walking, swimming, cycling (joint preservation)",
      "🧠 Cognitive health: Exercise, omega-3s, social engagement",
      "💊 Comprehensive supplementation: Address all age-related gaps"
    ],
    
    training: {
      resistance: {
        frequency: "3-4x per week",
        focus: "Functional strength patterns",
        exercises: [
          "Goblet squats (joint-friendly)",
          "Push-ups variations (scalable)",
          "TRX rows (shoulder-friendly)",
          "Farmer carries (functional)",
          "Step-ups (balance + strength)",
          "Pallof press (core stability)"
        ],
        intensity: "RPE 6-7 (leave 3-4 reps in tank)",
        sets: "2-3 per exercise",
        reps: "8-12"
      },
      balance: {
        frequency: "Daily",
        exercises: ["Single-leg stance", "Tandem walking", "Stability exercises"],
        purpose: "Fall prevention, proprioception"
      },
      mobility: {
        frequency: "Daily 15-20 min",
        focus: ["Hip mobility", "Thoracic rotation", "Ankle mobility", "Shoulder health"]
      },
      cardio: {
        type: "Low-impact Zone 2",
        options: ["Walking", "Rucking", "Swimming", "Cycling", "Elliptical"],
        frequency: "5-6x per week",
        duration: "30-45 minutes"
      }
    },
    
    expectedRate: "0.25-0.5 lb/week (if fat loss is goal)",
    primaryGoal: "Maintain muscle mass, optimize health markers, preserve function"
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 2: WOMEN - FAT LOSS PROTOCOLS
  // ═══════════════════════════════════════════════════════════════════════

  female_young_rp_fatloss: {
    name: "RP Women's Fat Loss Protocol",
    source: "Renaissance Periodization - Evidence-Based Female Physiology",
    ageRange: "20-35",
    gender: "female",
    goal: "fat_loss",
    tagline: "Physiologically-appropriate fat loss for women - hormone-aware approach",
    
    philosophy: "Women are not small men. Hormonal considerations, menstrual cycle awareness, and sustainable approaches are non-negotiable. Your body will fight back against extreme approaches.",
    
    keyPriorities: [
      "⚡ Moderate deficit: 300-500 cal (women more sensitive to large deficits)",
      "🥩 High protein: 0.8-1g per lb bodyweight (satiety + muscle preservation)",
      "🔄 Menstrual cycle tracking: Adjust expectations and training across phases",
      "💪 Progressive resistance training: 4-5x per week, focus on strength",
      "🏃 Cardio moderation: 3-4x per week, avoid excessive volumes",
      "😴 Sleep 8+ hours (leptin sensitivity, menstrual regularity)",
      "🚫 AVOID: Extreme deficits (<1200 cal), excessive cardio (>5 hours/week)",
      "📊 Track biofeedback: Energy, sleep, cycle regularity, mood, hunger"
    ],
    
    menstrualCycleConsiderations: {
      follicularPhase: {
        timing: "Day 1-14 (menstruation to ovulation)",
        characteristics: ["Higher energy", "Better strength", "Better carb tolerance", "Higher motivation"],
        training: "Can push intensity and volume",
        nutrition: "Carbs well-tolerated, slight preference for higher carb"
      },
      lutealPhase: {
        timing: "Day 15-28 (ovulation to menstruation)",
        characteristics: ["Lower energy", "Increased hunger", "Water retention", "Reduced strength"],
        training: "Maintain but don't push for PRs, listen to body",
        nutrition: "May need 100-200 extra calories, slightly higher fat can help satiety"
      },
      menstruation: {
        characteristics: ["Fatigue", "Cramps possible", "Lower motivation"],
        training: "Light activity or rest as needed - don't force it",
        nutrition: "Comfort and adequacy over perfection"
      }
    },
    
    calorieStrategy: {
      base: "TDEE - 400 cal",
      lutealAdjustment: "Add 100-150 cal if needed for adherence",
      refeed: "Every 10-14 days at maintenance"
    },
    
    training: {
      frequency: 4,
      split: "Upper/Lower or Full Body",
      setsPerMuscle: "10-15 sets per week",
      repRange: "8-15 reps",
      cardio: "3-4x per week, 20-30 min LISS or 2x HIIT"
    },
    
    expectedRate: "0.5-1 lb per week",
    
    hormonalRedFlags: [
      "❌ Loss of period (amenorrhea) - STOP IMMEDIATELY",
      "❌ Irregular cycles (>35 days or <21 days)",
      "❌ Extreme hunger/cravings daily",
      "❌ Mood swings beyond normal PMS",
      "❌ Hair loss or thinning",
      "❌ Very dry skin, brittle nails",
      "❌ Libido crash"
    ],
    
    successMarkers: [
      "✅ Regular menstrual cycles maintained",
      "✅ Energy levels stable across month",
      "✅ Strength improving or maintained",
      "✅ Sleep quality good",
      "✅ Steady fat loss without crashes"
    ]
  },

  female_35_45_metabolic: {
    name: "Metabolic Optimization Protocol",
    source: "Evidence-Based Perimenopause Approach",
    ageRange: "35-45",
    gender: "female",
    goal: "metabolic_health",
    tagline: "Navigate hormonal shifts while optimizing body composition",
    
    keyPriorities: [
      "⚡ Conservative deficit: 250-400 cal (metabolic sensitivity increases)",
      "🥩 Protein: 1g per lb minimum (muscle preservation critical)",
      "💪 Heavy resistance training: 3-4x per week (bone density, metabolism)",
      "😴 Sleep 8+ hours (cortisol, leptin, ghrelin balance)",
      "🧘 Stress management CRITICAL (cortisol affects fat distribution)",
      "🥬 Fiber: 30-35g (gut health, hormone metabolism)",
      "🏃 Moderate cardio: Don't overdo it (can worsen hormonal issues)"
    ],
    
    expectedRate: "0.5-0.75 lb per week"
  },

  female_45plus_menopause: {
    name: "Menopause Metabolic Protocol",
    source: "Hormonal Transition Evidence-Based",
    ageRange: "45+",
    gender: "female",
    goal: "menopause_health",
    tagline: "Thrive through the transition - composition maintenance is success",
    
    philosophy: "Your body is going through massive hormonal changes. Maintaining muscle and bone while slowly improving composition is a massive win. Patience and precision required.",
    
    keyPriorities: [
      "🦴 Bone density #1 priority: Resistance training 4x/week, calcium, vitamin D",
      "💪 Muscle preservation: Heavy lifting with progressive overload",
      "⚡ Gentle deficit ONLY: 200-300 cal maximum (adaptation risk high)",
      "🥩 VERY high protein: 1.2-1.4g per lb (offset hormonal muscle loss)",
      "🥬 Phytoestrogens: Flax, soy, legumes (mild estrogenic activity)",
      "😴 Sleep optimization: Often disrupted, make it priority #1",
      "🧘 Stress management: Cortisol management critical during transition",
      "🔥 Anti-inflammatory focus: Control inflammation during hormonal shifts",
      "🚫 AVOID: Extreme deficits, excessive cardio, chronic stress"
    ],
    
    supplements: {
      essential: ["Calcium 1200mg", "Vitamin D3 2000-5000 IU", "Omega-3 2-3g", "Magnesium 400mg"],
      recommended: ["Black cohosh (hot flashes)", "Maca root (hormonal balance)", "Evening primrose oil"],
      muscle: ["Creatine 5g (muscle + cognitive)", "Protein powder"]
    },
    
    expectedRate: "0.25-0.5 lb per week",
    successMetric: "Maintain muscle and bone density while slowly improving composition"
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 3: MUSCLE BUILDING PROTOCOLS
  // ═══════════════════════════════════════════════════════════════════════

  male_young_hypertrophy: {
    name: "RP Hypertrophy Protocol",
    source: "Renaissance Periodization - Evidence-Based Muscle Building",
    ageRange: "18-35",
    gender: "male",
    goal: "muscle_gain",
    tagline: "Maximize muscle growth with minimal fat gain - scientific approach",
    
    keyPriorities: [
      "⚡ Lean surplus: 200-400 cal above TDEE (slow, lean gains)",
      "🥩 Protein: 1g per lb minimum (muscle protein synthesis)",
      "💪 High volume training: 15-25 sets per muscle per week",
      "📈 Progressive overload: Add reps/weight every session",
      "🔄 Mesocycle periodization: 4-6 week blocks",
      "😴 Sleep 8-9 hours (GH release, recovery)",
      "🏃 Minimal cardio: 2x per week for heart health only",
      "📊 Track body weight: 0.5-1 lb gain per week target"
    ],
    
    mesocycleStructure: {
      weeks1_5: {
        name: "Accumulation",
        volume: "Progressively increase from MEV to MRV",
        intensity: "Moderate (RPE 7-8)",
        focus: "Build work capacity"
      },
      week6: {
        name: "Deload",
        volume: "50% of week 5",
        intensity: "Light (RPE 5-6)",
        focus: "Recovery, supercompensation"
      }
    },
    
    training: {
      frequency: "5-6 days",
      split: "PPL or Upper/Lower",
      setsPerMuscle: "15-25 sets per week (progress from 15 to 25 over mesocycle)",
      repRange: "6-20 reps (variety across exercises)",
      progression: "Add reps until top of range, then add weight 5-10%"
    },
    
    expectedRate: "0.5-1 lb per week (2-4 lbs per month, ~50% muscle)"
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 4: SPECIALIZED PROTOCOLS
  // ═══════════════════════════════════════════════════════════════════════

  // POSTPARTUM RECOVERY & BODY COMPOSITION
  female_postpartum_recovery: {
    name: "Postpartum Recovery & Restoration Protocol",
    source: "Evidence-Based Postpartum Physiology + Women's Health",
    ageRange: "Any postpartum",
    gender: "female",
    goal: "postpartum_recovery",
    tagline: "Safe, progressive return to fitness with body composition improvement",
    
    philosophy: "Your body just performed a miracle. Recovery comes first, aesthetics second. Rushing back causes injury and setbacks. Be patient, be smart, be kind to yourself.",
    
    CRITICAL_POSTPARTUM_RULES: {
      rule1: "🏥 Get medical clearance before ANY exercise (typically 6 weeks vaginal, 8-12 weeks C-section)",
      rule2: "🤰 Pelvic floor rehabilitation BEFORE heavy lifting or high-impact exercise",
      rule3: "🤱 If breastfeeding: Add 300-500 calories, never aggressive deficit",
      rule4: "😴 Sleep when you can - recovery is more important than training",
      rule5: "💧 Hydration critical if breastfeeding - 100+ oz daily"
    },
    
    phaseStructure: {
      phase1_immediate: {
        name: "Immediate Postpartum (Weeks 0-6)",
        timeline: "Birth to medical clearance",
        focus: "Recovery only",
        activities: [
          "Walking only (start 5-10 min, build to 20-30 min)",
          "Pelvic floor exercises (Kegels)",
          "Deep breathing exercises",
          "Gentle stretching"
        ],
        nutrition: "Maintenance + 300-500 cal if breastfeeding",
        training: "NONE - walking and breathing only",
        avoidance: "NO core exercises, NO heavy lifting, NO high-impact"
      },
      
      phase2_earlyReturn: {
        name: "Early Return Phase (Weeks 6-16)",
        timeline: "Medical clearance to 4 months postpartum",
        prerequisites: [
          "Medical clearance obtained",
          "Pelvic floor assessment (physical therapist recommended)",
          "No diastasis recti concerns or cleared to progress"
        ],
        focus: "Rebuild foundation, bodyweight movements, core rehabilitation",
        activities: [
          "Bodyweight exercises: Squats, modified push-ups, rows",
          "Core rehabilitation: Dead bugs, bird dogs, planks (if cleared)",
          "Walking 30-45 min daily",
          "Light resistance bands"
        ],
        training: {
          frequency: "3-4x per week",
          duration: "20-30 minutes",
          intensity: "RPE 5-6 (very conservative)",
          progression: "Add reps, not weight yet"
        },
        nutrition: "Maintenance calories if breastfeeding, slight deficit (-200 cal) if not",
        avoidance: "Still avoid heavy weights, crunches, high-impact until pelvic floor strong"
      },
      
      phase3_fullReturn: {
        name: "Full Return Phase (4-12 months postpartum)",
        timeline: "4 months onward",
        prerequisites: [
          "Pelvic floor strength verified",
          "Can perform bodyweight movements pain-free",
          "Diastasis recti improving or resolved",
          "Energy levels stable"
        ],
        focus: "Progressive strength training, metabolic conditioning",
        training: {
          frequency: "4-5x per week",
          style: "Full-body or Upper/Lower",
          progression: "Progressive overload - add weight gradually",
          cardio: "LISS or moderate intensity, build to HIIT if desired"
        },
        nutrition: {
          breastfeeding: "Maintenance, can add small deficit (-200 to -300 cal max)",
          notBreastfeeding: "Can pursue moderate deficit (-300 to -500 cal)",
          protein: "1g per lb minimum (critical for recovery and milk supply)"
        }
      }
    },
    
    keyPriorities: [
      "🏥 Medical clearance first - never skip this step",
      "🤰 Pelvic floor rehabilitation - work with PT if possible",
      "🤱 If breastfeeding: Never aggressive deficit, hydration critical (100+ oz)",
      "😴 Sleep when possible - recovery > training always",
      "💪 Progressive return: Bodyweight → Light weights → Full training",
      "🧘 Core rehab before crunches: Dead bugs, bird dogs, then progress",
      "🚫 Avoid: Crunches early, heavy lifting before pelvic floor strong, aggressive deficits",
      "📊 Track energy, milk supply, mood - these override calorie targets",
      "⏰ Be patient: 9 months to grow baby, 9-12 months to fully return"
    ],
    
    diastasisRectiGuidelines: {
      assessment: "Check with healthcare provider or PT",
      safeExercises: ["Dead bugs", "Bird dogs", "Modified planks", "Standing exercises"],
      avoid: ["Traditional crunches", "Sit-ups", "Toe touches", "Full planks (until cleared)"],
      rehabilitation: "Work with pelvic floor PT for specific protocol"
    },
    
    breastfeedingConsiderations: {
      calorieAddition: "300-500 calories above baseline",
      protein: "1-1.2g per lb (milk production + recovery)",
      hydration: "100-120 oz water daily minimum",
      micronutrients: "Continue prenatal vitamins, Omega-3s",
      deficitWarning: "Aggressive deficits can reduce milk supply - never >300 cal deficit"
    },
    
    supplements: {
      continue: ["Prenatal vitamin", "Omega-3 DHA/EPA", "Vitamin D3", "Probiotic"],
      add: ["Protein powder (whey if tolerated)", "Collagen (connective tissue)", "Magnesium (sleep/recovery)"],
      consider: ["Iron (if depleted from birth)", "B-complex (energy)"]
    },
    
    expectedTimeline: {
      months3: "Return to bodyweight training, gentle core work",
      months6: "Return to moderate weights, progressive overload",
      months9_12: "Full return to pre-pregnancy training capacity",
      bodyComp: "Fat loss 0.5-1 lb/week in months 6-12 (if not breastfeeding)"
    },
    
    redFlags_seeDoctor: [
      "❌ Pelvic pain or pressure",
      "❌ Urinary leakage during exercise",
      "❌ Visible doming or coning of abdomen during core work",
      "❌ Severe fatigue beyond normal new parent tiredness",
      "❌ Depression or severe mood changes",
      "❌ Heavy bleeding or unusual discharge"
    ],
    
    successMarkers: [
      "✅ Energy levels improving",
      "✅ Pelvic floor strength increasing",
      "✅ No pain during movement",
      "✅ Milk supply stable (if breastfeeding)",
      "✅ Mood stable and positive",
      "✅ Gradual strength improvements"
    ]
  },

  // STRENGTH ATHLETE PROTOCOL (Powerlifting, Strongman, Olympic Lifting)
  strength_athlete_protocol: {
    name: "Strength Athlete Performance Protocol",
    source: "Powerlifting & Strength Sports Methodology",
    ageRange: "18-45",
    gender: "both",
    goal: "strength_performance",
    tagline: "Maximize absolute strength while managing body composition",
    
    philosophy: "Strength is the goal, body composition is secondary. Fuel performance, recover hard, get strong. Weight class considerations may apply.",
    
    keyPriorities: [
      "💪 Strength progression is #1 metric - numbers on the bar matter most",
      "⚡ Performance-based nutrition: Eat to fuel training and recovery",
      "🎯 Periodization: Linear or block periodization for competition prep",
      "🥩 High protein: 1-1.2g per lb (recovery from heavy loading)",
      "🏋️ Specificity: Competition lifts 2-3x per week minimum",
      "😴 Recovery paramount: 8-9 hours sleep, deloads every 4-6 weeks",
      "⚖️ Body comp: If weight class athlete, strategic cuts before competition only",
      "🔄 Volume management: High volume in off-season, lower closer to meet",
      "🧘 Joint health: Mobility work, warm-ups, accessory exercises for longevity"
    ],
    
    periodizationStructure: {
      offSeason: {
        timeline: "12-20 weeks out from competition",
        focus: "Hypertrophy and work capacity",
        volume: "High (15-20 sets per lift pattern)",
        intensity: "Moderate (70-80% 1RM)",
        nutrition: "Slight surplus (200-300 cal) or maintenance"
      },
      strengthPhase: {
        timeline: "8-12 weeks out",
        focus: "Build absolute strength",
        volume: "Moderate (10-15 sets per lift pattern)",
        intensity: "High (80-90% 1RM)",
        nutrition: "Maintenance calories"
      },
      peakingPhase: {
        timeline: "4-6 weeks out",
        focus: "Peak strength, CNS adaptation",
        volume: "Low (6-10 sets per lift pattern)",
        intensity: "Very high (85-95% 1RM)",
        nutrition: "Maintenance, perfect execution"
      },
      competition: {
        timeline: "Meet week",
        focus: "Show what you've built",
        volume: "Minimal",
        intensity: "Maximum",
        nutrition: "Water cut if needed, carb load 48hr out"
      }
    },
    
    macros: {
      protein: "1-1.2g per lb",
      carbs: "4-6g per kg bodyweight (fuel heavy training)",
      fat: "0.4-0.5g per lb (hormone support, satiety)",
      intraWorkout: "Optional: Carbs + EAAs during long sessions"
    },
    
    supplements: {
      performance: ["Creatine 5g (proven strength gains)", "Caffeine pre-workout (CNS)", "Beta-alanine (work capacity)"],
      recovery: ["Protein powder", "BCAAs/EAAs", "Tart cherry (inflammation)", "Magnesium (sleep)"],
      joints: ["Fish oil 3-4g", "Glucosamine/chondroitin", "Collagen peptides"],
      optional: ["Citrulline malate (pump)", "Betaine (strength)", "Vitamin D3"]
    },
    
    weightClassConsiderations: {
      offSeason: "Train 5-10 lbs above weight class for strength gains",
      preComp: "12 weeks out: Begin gradual cut if needed",
      waterCut: "Last resort only, 48-72 hours max, 5-10% bodyweight max",
      refeed: "Immediately post-weigh-in, structured carb/sodium reload"
    },
    
    expectedResults: {
      offSeason: "10-30 lb total increase over 12-16 weeks",
      meet: "PR attempts, platform success",
      bodyComp: "Muscle gain if surplus, maintain if maintenance"
    }
  },

  // ENDURANCE ATHLETE PROTOCOL
  endurance_athlete_protocol: {
    name: "Endurance Athlete Performance Protocol",
    source: "Endurance Sports Nutrition & Training Science",
    ageRange: "18-55",
    gender: "both",
    goal: "endurance_performance",
    tagline: "Optimize endurance performance while maintaining healthy body composition",
    
    philosophy: "Power-to-weight ratio matters, but health comes first. Fuel your training, don't starve it. Chronically underfueled endurance athletes underperform and break down.",
    
    keyPriorities: [
      "⚡ Fuel the work: Match nutrition to training load (high/medium/low days)",
      "🏃 Performance > aesthetics: Being lighter helps, being underfueled destroys performance",
      "🥩 Adequate protein: 0.8-1g per lb (endurance athletes need more than they think)",
      "🔋 Carb periodization: High on hard/long days, moderate on easy days, lower on rest",
      "💧 Hydration critical: Sweat rate testing, electrolyte replacement",
      "😴 Sleep 8-9 hours: Endurance training is catabolic, recovery essential",
      "🦴 Bone density monitoring: Especially cyclists and swimmers (low-impact sports)",
      "🔄 Periodize training: Base → Build → Peak → Race → Recover",
      "📊 Track: Resting heart rate, HRV, power/pace metrics, not just scale weight"
    ],
    
    trainingPhases: {
      base: {
        focus: "Aerobic capacity, volume accumulation",
        intensity: "Mostly Zone 2 (70-80% of volume)",
        nutrition: "Moderate carbs, build metabolic flexibility",
        calories: "Match expenditure, slight surplus acceptable"
      },
      build: {
        focus: "Threshold work, race-specific intensity",
        intensity: "Zone 2 + structured intervals",
        nutrition: "Higher carbs on interval days",
        calories: "Match expenditure precisely"
      },
      peak: {
        focus: "Race simulation, tapering volume",
        intensity: "High quality, lower volume",
        nutrition: "High carb availability",
        calories: "Maintain despite lower volume"
      },
      race: {
        focus: "Execute race plan",
        nutrition: "Carb loading 48-72 hours, race-day fueling dialed",
        hydration: "Practice in training, execute in race"
      }
    },
    
    nutritionByDay: {
      hardDay: {
        type: "Long run, threshold workout, race",
        carbs: "6-8g per kg bodyweight",
        protein: "1g per lb",
        intraWorkout: "60-90g carbs per hour if >90 min"
      },
      moderateDay: {
        type: "Easy run, recovery ride",
        carbs: "4-5g per kg bodyweight",
        protein: "1g per lb"
      },
      restDay: {
        type: "Complete rest or very light",
        carbs: "2-3g per kg bodyweight",
        protein: "1g per lb"
      }
    },
    
    supplements: {
      performance: ["Caffeine (pre-workout/race)", "Beetroot juice (nitrate, endurance)", "Beta-alanine (buffering)"],
      recovery: ["Protein powder", "Tart cherry (inflammation)", "Branched-chain amino acids"],
      health: ["Iron (especially female runners)", "Vitamin D3", "Calcium (bone health)", "Omega-3 2-3g"],
      intraWorkout: ["Carb drink/gels 60-90g/hr", "Electrolytes (sodium, potassium)", "BCAAs optional"]
    },
    
    bodyComposition: {
      approach: "Optimize power-to-weight without compromising health",
      timing: "Base phase only - never cut during build or peak",
      deficit: "Very gentle - 200-300 cal max",
      redLine: "STOP if: performance drops, chronic fatigue, hormonal issues, injury risk increases"
    },
    
    redFlags: [
      "❌ Resting heart rate elevated >10 bpm",
      "❌ HRV consistently low",
      "❌ Performance declining despite training",
      "❌ Chronic fatigue, not recovering between sessions",
      "❌ Menstrual irregularity (females) or libido crash (males)",
      "❌ Stress fractures or recurring injuries",
      "❌ Obsessive thoughts about food/weight"
    ],
    
    femaleAthleteConsiderations: {
      warning: "Female endurance athletes at HIGH risk for RED-S (Relative Energy Deficiency in Sport)",
      priorities: ["Menstrual cycle regularity monitored monthly", "Bone density DEXA scan annually", "Never train through amenorrhea"],
      ironStatus: "Check ferritin quarterly (target >30 ng/mL for performance)"
    }
  },

  // COMBAT SPORTS ATHLETE
  combat_sports_protocol: {
    name: "Combat Sports Performance Protocol",
    source: "MMA, Boxing, Wrestling Methodology",
    ageRange: "18-40",
    gender: "both",
    goal: "combat_performance",
    tagline: "Build strength, power, endurance while making weight safely",
    
    philosophy: "You need strength, power, endurance, AND skill. Don't sacrifice any. Weight cuts are necessary evil - do them smart, not stupid.",
    
    keyPriorities: [
      "🥊 Multi-dimensional fitness: Strength, power, conditioning, skill all matter",
      "⚖️ Strategic weight management: Fight at optimal weight class",
      "🥩 High protein: 1-1.2g per lb (MMA is brutal on muscles)",
      "💪 Strength 2-3x/week: Maintain power despite high volume",
      "🏃 Conditioning varied: Alactic power, glycolytic capacity, aerobic base",
      "⚡ Energy management: Periodize nutrition around training intensity",
      "😴 Recovery critical: 8+ hours sleep, active recovery days",
      "🎯 Weight cut timing: 8-12 weeks gradual, final week water cut only",
      "🧠 Mental toughness: But smart - don't confuse toughness with stupidity"
    ],
    
    trainingPhases: {
      offSeason: {
        timeline: "No fight scheduled",
        focus: "Build strength, muscle, work capacity",
        bodyweight: "5-10 lbs above fight weight",
        nutrition: "Maintenance or slight surplus",
        training: "High volume strength, technique, conditioning"
      },
      camp_early: {
        timeline: "8-12 weeks out",
        focus: "Build fight-specific conditioning",
        bodyweight: "Begin gradual cut to 3-5 lbs above",
        nutrition: "Small deficit (300-400 cal)",
        training: "High volume MMA, maintain strength"
      },
      camp_late: {
        timeline: "2-4 weeks out",
        focus: "Peak conditioning, maintain strength",
        bodyweight: "At or 1-2 lbs above fight weight",
        nutrition: "Slight deficit if needed",
        training: "Moderate volume, high intensity"
      },
      fightWeek: {
        timeline: "7 days out",
        focus: "Make weight, stay sharp",
        bodyweight: "Water cut last 48-72 hours only",
        nutrition: "Strategic carb/water manipulation",
        training: "Minimal - sharpen only"
      }
    },
    
    weightCutProtocol: {
      gradual: {
        timeline: "8-12 weeks",
        method: "Diet and training, lose 8-12 lbs",
        rate: "1-1.5 lbs per week",
        safetyNote: "This is where real fat loss happens"
      },
      waterCut: {
        timeline: "48-72 hours before weigh-in",
        method: "Water manipulation only",
        amount: "5-10% bodyweight MAX",
        protocol: [
          "5 days out: Water load (2 gallons/day)",
          "3 days out: Continue high water",
          "2 days out: Reduce water",
          "1 day out: Minimal water, sauna/hot bath if needed",
          "Weigh-in: Make weight",
          "Post weigh-in: Structured rehydration protocol"
        ],
        dangerZone: "Never cut >10% bodyweight, never for >72 hours"
      },
      rehydration: {
        immediate: "Pedialyte, coconut water, small meals",
        hours1_2: "Continue fluids + easily digested carbs",
        hours2_6: "Regular meals, sodium, carbs",
        hours6_24: "Normal eating, focus on performance fuel"
      }
    },
    
    supplements: {
      performance: ["Creatine 5g (power)", "Beta-alanine (buffering)", "Caffeine (pre-training)"],
      recovery: ["Protein powder", "BCAAs during training", "Tart cherry", "Magnesium"],
      fightWeek: ["Electrolytes (sodium, potassium, magnesium)", "Glycerol (water retention post-weigh-in)"]
    }
  },

  // ADVANCED BODY RECOMPOSITION
  advanced_recomp_protocol: {
    name: "Advanced Body Recomposition Protocol",
    source: "Evidence-Based Precision Nutrition + RP Principles",
    ageRange: "25-45",
    gender: "both",
    goal: "advanced_recomp",
    tagline: "Simultaneous muscle gain and fat loss for intermediate-advanced lifters",
    
    philosophy: "Recomp is the slowest path but produces the highest quality physique changes. Requires precision, patience, and perfect execution. Not for beginners or those wanting fast results.",
    
    prerequisites: {
      training: "Minimum 2-3 years consistent training",
      strength: "Intermediate strength standards (e.g., 1.5x BW bench, 2x BW squat)",
      knowledge: "Understanding of macros, progressive overload, recovery",
      patience: "Willing to commit to 6-12 month timeline",
      notFor: [
        "❌ Beginners (use surplus and build muscle first)",
        "❌ Very overweight (use deficit and lose fat first)",
        "❌ Advanced lifters (diminishing returns)",
        "❌ Impatient people (too slow for those wanting rapid changes)"
      ]
    },
    
    keyPriorities: [
      "🎯 Precision nutrition: Calories ±50 cal accuracy required",
      "🥩 VERY high protein: 1.2-1.4g per lb (enable simultaneous goals)",
      "⚡ Calorie cycling: Surplus on training, deficit on rest (or maintenance overall)",
      "💪 Progressive overload MANDATORY: Must get stronger, not just maintain",
      "📊 Body composition tracking: Scale meaningless, use measurements, photos, DEXA if possible",
      "😴 Sleep 8+ hours: Both muscle growth AND fat loss need this",
      "🔄 Patience: 0.5-1 lb muscle per month, 0.5-1 lb fat loss per month = SLOW",
      "🎚️ Nutrient timing: Carbs around training, protein distributed evenly",
      "📈 Training volume: High (15-20 sets per muscle per week)"
    ],
    
    nutritionProtocol: {
      baseline: "Maintenance calories (TDEE)",
      cycling: {
        trainingDays: "TDEE + 200-300 cal (anabolic)",
        restDays: "TDEE - 200-300 cal (fat loss)",
        weeklyTotal: "Approximately maintenance"
      },
      macros: {
        protein: "1.3-1.4g per lb (EVERY day, no cycling)",
        carbs: "Cycle - high on training (4-5g/kg), low on rest (2-3g/kg)",
        fat: "0.3-0.4g per lb (consistent daily)"
      },
      timing: {
        preWorkout: "20-40g protein + 30-50g carbs (1-2 hours before)",
        intraWorkout: "Optional: 30-50g carbs for long sessions",
        postWorkout: "30-50g protein + 50-100g carbs (within 2 hours)",
        dailyProtein: "4-6 meals, 25-40g protein each, spread evenly"
      }
    },
    
    trainingProtocol: {
      frequency: "5-6 days per week",
      split: "PPL or Upper/Lower",
      volume: "15-20 sets per muscle per week (high)",
      intensity: "RPE 7-9 (hard but controlled)",
      progression: {
        primary: "Progressive overload - add reps or weight weekly",
        metric: "Strength MUST improve - if not, adjust nutrition upward"
      },
      periodization: "4-6 week blocks, accumulation → intensification → deload"
    },
    
    trackingMetrics: {
      required: [
        "Body weight (daily, track weekly average)",
        "Measurements (chest, waist, arms, thighs - biweekly)",
        "Progress photos (front, side, back - monthly)",
        "Strength on key lifts (weekly)",
        "Sleep quality (daily)",
        "Energy levels (daily)"
      ],
      recommended: [
        "DEXA scan (every 3-4 months - gold standard)",
        "Caliper measurements (weekly if trained in use)"
      ],
      expectations: {
        scale: "May not change much - muscle gained = fat lost",
        measurements: "Slow changes - arms up, waist down",
        photos: "Most reliable - visible changes every 4-6 weeks",
        strength: "Should improve consistently - KEY metric"
      }
    },
    
    expectedResults: {
      month1_3: "0.5-1 lb muscle gained, 0.5-1 lb fat lost",
      month4_6: "1-2 lbs muscle gained, 1-2 lbs fat lost",
      month7_12: "2-4 lbs muscle gained, 2-4 lbs fat lost",
      realistic: "Much slower than bulk or cut, but highest quality changes",
      strength: "Consistent strength gains required for success"
    },
    
    troubleshooting: {
      notGainingStrength: "Increase calories +100-200, especially training days",
      notLosingFat: "Decrease calories -100-200, especially rest days",
      losingStrength: "Increase calories immediately, prioritize recovery",
      plateau: "Normal - be patient or consider switching to focused phase"
    },
    
    whenToSwitch: {
      toCut: "If body fat >15% men / >25% women, better to cut first",
      toBulk: "If already lean and want faster muscle gain",
      continueRecomp: "If enjoying process and seeing slow, steady improvements"
    }
  },

  // TEEN ATHLETE PROTOCOL (13-18)
  teen_athlete_protocol: {
    name: "Teen Athlete Development Protocol",
    source: "Youth Athletic Development + Sports Science",
    ageRange: "13-18",
    gender: "both",
    goal: "athletic_development",
    tagline: "Build athletic foundation while supporting growth and development",
    
    philosophy: "You're still growing. Athletic development comes first, aesthetics never. Build strength, speed, skills, and healthy habits. Your adult body will thank you.",
    
    CRITICAL_TEEN_RULES: {
      rule1: "🚫 NEVER pursue fat loss or aggressive body comp goals during adolescence",
      rule2: "📈 Growth and development > aesthetics ALWAYS",
      rule3: "🥩 Fuel growth: Slight calorie surplus (200-500 cal) is normal and healthy",
      rule4: "🏋️ Technical mastery > heavy weights (learn perfect form first)",
      rule5: "⚠️ Growth plates: No max lifts, avoid spinal loading until growth complete"
    },
    
    keyPriorities: [
      "🏃 Athletic development: Speed, agility, coordination, sport skills",
      "💪 Strength foundation: Bodyweight mastery → Light weights → Progressive loading",
      "⚡ Fuel growth: Eat enough! Undereating stunts growth and development",
      "🥩 Protein: 0.8-1g per lb (support growth + sports)",
      "🥗 Nutrient-dense diet: Vitamins and minerals critical for development",
      "😴 Sleep 9-10 hours: Growth hormone, recovery, development",
      "🎯 Sport-specific skills: Practice your sport, don't just lift",
      "🧘 Movement quality: Perfect technique before adding load",
      "🚫 RED FLAGS: Weight cutting, extreme dieting, body image obsession"
    ],
    
    ageAppropriateTraining: {
      ages13_14: {
        focus: "Movement patterns, bodyweight strength, coordination",
        exercises: [
          "Bodyweight squats, push-ups, pull-ups",
          "Jump training, agility drills",
          "Sport-specific skills",
          "Core stabilization"
        ],
        weights: "Very light (PVC pipe, light dumbbells for learning)",
        intensity: "RPE 5-6 (very conservative)",
        volume: "Low - quality over quantity"
      },
      ages15_16: {
        focus: "Build strength foundation, continue skill development",
        exercises: [
          "Goblet squats, dumbbell presses",
          "Romanian deadlifts, rows",
          "Olympic lift variations (learning only)",
          "Sport training"
        ],
        weights: "Light to moderate (bar + light plates)",
        intensity: "RPE 6-7",
        volume: "Moderate (10-12 sets per muscle per week)",
        progressionCaution: "Add reps before weight, never sacrifice form"
      },
      ages17_18: {
        focus: "Strength development, power, sport performance",
        exercises: [
          "Back squats, bench press, deadlifts (if form perfect)",
          "Olympic lifts (if coached properly)",
          "Plyometrics, speed work",
          "Sport specificity"
        ],
        weights: "Moderate (can progress to challenging loads with supervision)",
        intensity: "RPE 7-8",
        volume: "Moderate-high (12-15 sets per muscle per week)",
        stillAvoid: "True 1RM testing until 18+ and growth plates closed"
      }
    },
    
    nutrition: {
      philosophy: "Food is fuel AND building blocks - never restrict!",
      calories: "Maintenance + 200-500 (growth requires surplus)",
      protein: "0.8-1g per lb bodyweight",
      carbs: "High (4-6g per kg) - growing bodies need carbs",
      fat: "Adequate (0.4-0.5g per lb) - hormone development",
      emphasis: [
        "Whole foods priority",
        "Regular meal timing (don't skip meals)",
        "Pre/post training nutrition",
        "Adequate fruits and vegetables",
        "Hydration throughout day"
      ],
      NEVER: [
        "❌ Weight cutting or extreme dieting",
        "❌ Calorie restriction for aesthetics",
        "❌ Elimination diets without medical reason",
        "❌ Supplements for 'fat loss' or 'muscle building'",
        "❌ Any adult bodybuilding approaches"
      ]
    },
    
    supplements: {
      appropriate: [
        "Multivitamin (if dietary gaps exist)",
        "Vitamin D3 (if deficient - get tested)",
        "Protein powder (convenience only, not necessary)",
        "Creatine (ages 16+ IF training seriously, 3-5g)"
      ],
      inappropriate: [
        "❌ Pre-workouts with high stimulants",
        "❌ Testosterone boosters",
        "❌ Fat burners",
        "❌ SARMs or any experimental compounds",
        "❌ Excessive caffeine"
      ]
    },
    
    mentalHealth: {
      warning: "Teen years are HIGH risk for eating disorders and body image issues",
      redFlags: [
        "❌ Obsessive calorie counting or food restriction",
        "❌ Body checking or weight obsession",
        "❌ Training to 'burn off' food",
        "❌ Social isolation related to food/training",
        "❌ Mood changes, irritability, depression",
        "❌ Growth or puberty delays"
      ],
      emphasis: [
        "✅ Performance goals > aesthetic goals",
        "✅ Fueling for energy and growth",
        "✅ Healthy relationship with food and exercise",
        "✅ Balanced life - school, sports, social",
        "✅ Open communication with parents/coaches"
      ]
    },
    
    parentCoachGuidance: {
      do: [
        "✅ Emphasize performance and health over appearance",
        "✅ Teach proper technique before loading",
        "✅ Encourage adequate fueling",
        "✅ Monitor for overtraining or burnout",
        "✅ Support balanced lifestyle",
        "✅ Educate on proper training and nutrition"
      ],
      dont: [
        "❌ Push weight loss or body composition goals",
        "❌ Compare to other athletes",
        "❌ Encourage restriction or extreme diets",
        "❌ Pressure to specialize too early",
        "❌ Ignore signs of mental health concerns"
      ]
    },
    
    expectedResults: {
      strength: "Rapid neural adaptations, strength gains without much muscle growth initially",
      athleticism: "Coordination, speed, agility improvements",
      bodyComp: "Natural development through puberty - DO NOT interfere",
      longTerm: "Building foundation for lifelong athletic performance"
    }
  },

  athlete_performance: {
    name: "Athletic Performance Protocol",
    source: "Gunnar Peterson - Athletic Development",
    ageRange: "18-40",
    gender: "both",
    goal: "performance",
    tagline: "Fuel performance while optimizing body composition",
    
    keyPriorities: [
      "⚡ Performance-first nutrition: Fuel training demands",
      "🥩 Protein: 1.2g per lb (recovery from high volume)",
      "⚖️ Composition secondary to performance",
      "💪 Sport-specific training + strength foundation",
      "🏃 Conditioning matches sport demands",
      "😴 Sleep 9+ hours (recovery from high training loads)",
      "📊 Periodize nutrition around training/competition"
    ]
  },

  recomposition_protocol: {
    name: "Body Recomposition Protocol",
    source: "Evidence-Based Recomp Principles",
    ageRange: "Any",
    gender: "both",
    goal: "recomp",
    tagline: "Build muscle while losing fat - advanced strategy",
    
    philosophy: "Recomp is slow but powerful for intermediate lifters. Requires precision, patience, and perfect execution.",
    
    keyPriorities: [
      "⚡ Maintenance calories or tiny surplus (+100 cal)",
      "🥩 VERY high protein: 1.2-1.4g per lb (critical for recomp)",
      "💪 Progressive overload mandatory: Must get stronger",
      "🔄 Calorie cycling: Higher on training days, lower on rest",
      "😴 Sleep 8+ hours (muscle building + fat loss both need this)",
      "📊 Track body composition: Scale weight meaningless, use measurements/photos"
    ],
    
    expectedRate: "Very slow - 0.5-1 lb muscle per month while losing similar fat",
    bestFor: "Intermediate lifters, not optimal for beginners or advanced",
    
    trainingRequirement: "Must be able to progress on main lifts consistently"
  }
};
