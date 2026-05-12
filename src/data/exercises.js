// Cardio + strength exercise databases — extracted from index.html lines 5298-5770.

export const cardioDatabase = {
  running_slow: { 
    name: 'Running (5 mph - 12 min/mile)', 
    category: 'cardio',
    calsPerMin: 8,
    icon: '🏃'
  },
  running_moderate: { 
    name: 'Running (6 mph - 10 min/mile)', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '🏃'
  },
  running_fast: { 
    name: 'Running (7.5 mph - 8 min/mile)', 
    category: 'cardio',
    calsPerMin: 12,
    icon: '🏃‍♂️'
  },
  running_sprint: { 
    name: 'Running (9+ mph - sprint)', 
    category: 'cardio',
    calsPerMin: 15,
    icon: '🏃‍♂️'
  },
  walking_slow: { 
    name: 'Walking (2 mph - casual)', 
    category: 'cardio',
    calsPerMin: 3,
    icon: '🚶'
  },
  walking_moderate: { 
    name: 'Walking (3 mph - moderate)', 
    category: 'cardio',
    calsPerMin: 4,
    icon: '🚶'
  },
  walking_brisk: { 
    name: 'Walking (4 mph - brisk)', 
    category: 'cardio',
    calsPerMin: 5,
    icon: '🚶‍♂️'
  },
  rucking_moderate: { 
    name: 'Rucking (20-30 lbs - moderate pace)', 
    category: 'cardio',
    calsPerMin: 6,
    icon: '🎒'
  },
  rucking_heavy: { 
    name: 'Rucking (30-50 lbs - vigorous)', 
    category: 'cardio',
    calsPerMin: 8,
    icon: '🎒'
  },
  cycling_leisurely: { 
    name: 'Cycling (10-12 mph - leisurely)', 
    category: 'cardio',
    calsPerMin: 5,
    icon: '🚴'
  },
  cycling_moderate: { 
    name: 'Cycling (12-14 mph - moderate)', 
    category: 'cardio',
    calsPerMin: 8,
    icon: '🚴'
  },
  cycling_vigorous: { 
    name: 'Cycling (14-16 mph - vigorous)', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '🚴‍♂️'
  },
  cycling_racing: { 
    name: 'Cycling (16+ mph - racing)', 
    category: 'cardio',
    calsPerMin: 12,
    icon: '🚴‍♂️'
  },
  swimming_leisurely: { 
    name: 'Swimming (leisurely)', 
    category: 'cardio',
    calsPerMin: 6,
    icon: '🏊'
  },
  swimming_moderate: { 
    name: 'Swimming (moderate laps)', 
    category: 'cardio',
    calsPerMin: 9,
    icon: '🏊'
  },
  swimming_vigorous: { 
    name: 'Swimming (vigorous laps)', 
    category: 'cardio',
    calsPerMin: 12,
    icon: '🏊‍♂️'
  },
  rowing_moderate: { 
    name: 'Rowing Machine (moderate)', 
    category: 'cardio',
    calsPerMin: 7,
    icon: '🚣'
  },
  rowing_vigorous: { 
    name: 'Rowing Machine (vigorous)', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '🚣‍♂️'
  },
  elliptical_moderate: { 
    name: 'Elliptical (moderate)', 
    category: 'cardio',
    calsPerMin: 7,
    icon: '🏋️'
  },
  elliptical_vigorous: { 
    name: 'Elliptical (vigorous)', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '🏋️‍♂️'
  },
  stairmaster: { 
    name: 'Stair Climber / StairMaster', 
    category: 'cardio',
    calsPerMin: 9,
    icon: '🪜'
  },
  jumping_rope: { 
    name: 'Jump Rope', 
    category: 'cardio',
    calsPerMin: 12,
    icon: '🪢'
  },
  hiking: { 
    name: 'Hiking (hills/mountains)', 
    category: 'cardio',
    calsPerMin: 6,
    icon: '🥾'
  },
  basketball: { 
    name: 'Basketball (game)', 
    category: 'cardio',
    calsPerMin: 8,
    icon: '🏀'
  },
  soccer: { 
    name: 'Soccer (game)', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '⚽'
  },
  tennis: { 
    name: 'Tennis (singles)', 
    category: 'cardio',
    calsPerMin: 8,
    icon: '🎾'
  },
  boxing: { 
    name: 'Boxing (sparring)', 
    category: 'cardio',
    calsPerMin: 11,
    icon: '🥊'
  },
  kickboxing: { 
    name: 'Kickboxing', 
    category: 'cardio',
    calsPerMin: 10,
    icon: '🥋'
  },
  yoga: { 
    name: 'Yoga (general)', 
    category: 'cardio',
    calsPerMin: 3,
    icon: '🧘'
  },
  pilates: { 
    name: 'Pilates', 
    category: 'cardio',
    calsPerMin: 4,
    icon: '🤸'
  },
  zumba: { 
    name: 'Zumba / Dance Cardio', 
    category: 'cardio',
    calsPerMin: 7,
    icon: '💃'
  },
  spinning: { 
    name: 'Spin Class', 
    category: 'cardio',
    calsPerMin: 9,
    icon: '🚴'
  },
  crossfit: { 
    name: 'CrossFit WOD', 
    category: 'cardio',
    calsPerMin: 11,
    icon: '💪'
  }
};

// Strength training exercises with muscle groups
export const strengthDatabase = {
  // CHEST
  bench_press: { 
    name: 'Bench Press (Barbell)', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '💪'
  },
  incline_bench: { 
    name: 'Incline Bench Press', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '💪'
  },
  decline_bench: { 
    name: 'Decline Bench Press', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '💪'
  },
  dumbbell_press: { 
    name: 'Dumbbell Chest Press', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '💪'
  },
  chest_fly: { 
    name: 'Chest Fly (Dumbbell)', 
    muscleGroup: 'chest',
    type: 'isolation',
    icon: '💪'
  },
  pushups: { 
    name: 'Push-ups', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '🏋️'
  },
  dips_chest: { 
    name: 'Dips (Chest Focused)', 
    muscleGroup: 'chest',
    type: 'compound',
    icon: '🏋️'
  },
  
  // BACK
  deadlift: { 
    name: 'Deadlift (Barbell)', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '💪'
  },
  bent_over_row: { 
    name: 'Bent Over Row (Barbell)', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '💪'
  },
  dumbbell_row: { 
    name: 'Dumbbell Row (Single Arm)', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '💪'
  },
  lat_pulldown: { 
    name: 'Lat Pulldown', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '🏋️'
  },
  pullups: { 
    name: 'Pull-ups / Chin-ups', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '🏋️'
  },
  seated_row: { 
    name: 'Seated Cable Row', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '🏋️'
  },
  tbar_row: { 
    name: 'T-Bar Row', 
    muscleGroup: 'back',
    type: 'compound',
    icon: '💪'
  },
  
  // LEGS
  squat: { 
    name: 'Squat (Barbell)', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '💪'
  },
  front_squat: { 
    name: 'Front Squat', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '💪'
  },
  leg_press: { 
    name: 'Leg Press', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '🏋️'
  },
  lunges: { 
    name: 'Lunges (Dumbbell)', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '💪'
  },
  bulgarian_split_squat: { 
    name: 'Bulgarian Split Squat', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '💪'
  },
  leg_extension: { 
    name: 'Leg Extension', 
    muscleGroup: 'legs',
    type: 'isolation',
    icon: '🏋️'
  },
  leg_curl: { 
    name: 'Leg Curl (Hamstring)', 
    muscleGroup: 'legs',
    type: 'isolation',
    icon: '🏋️'
  },
  calf_raise: { 
    name: 'Calf Raise', 
    muscleGroup: 'legs',
    type: 'isolation',
    icon: '🏋️'
  },
  romanian_deadlift: { 
    name: 'Romanian Deadlift', 
    muscleGroup: 'legs',
    type: 'compound',
    icon: '💪'
  },
  
  // SHOULDERS
  overhead_press: { 
    name: 'Overhead Press (Barbell)', 
    muscleGroup: 'shoulders',
    type: 'compound',
    icon: '💪'
  },
  military_press: { 
    name: 'Military Press', 
    muscleGroup: 'shoulders',
    type: 'compound',
    icon: '💪'
  },
  dumbbell_shoulder_press: { 
    name: 'Dumbbell Shoulder Press', 
    muscleGroup: 'shoulders',
    type: 'compound',
    icon: '💪'
  },
  lateral_raise: { 
    name: 'Lateral Raise (Dumbbell)', 
    muscleGroup: 'shoulders',
    type: 'isolation',
    icon: '💪'
  },
  front_raise: { 
    name: 'Front Raise (Dumbbell)', 
    muscleGroup: 'shoulders',
    type: 'isolation',
    icon: '💪'
  },
  rear_delt_fly: { 
    name: 'Rear Delt Fly', 
    muscleGroup: 'shoulders',
    type: 'isolation',
    icon: '💪'
  },
  
  // ARMS
  barbell_curl: { 
    name: 'Barbell Curl (Biceps)', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  dumbbell_curl: { 
    name: 'Dumbbell Curl (Biceps)', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  hammer_curl: { 
    name: 'Hammer Curl', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  preacher_curl: { 
    name: 'Preacher Curl', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  tricep_pushdown: { 
    name: 'Tricep Pushdown (Cable)', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  overhead_tricep: { 
    name: 'Overhead Tricep Extension', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  skull_crusher: { 
    name: 'Skull Crushers', 
    muscleGroup: 'arms',
    type: 'isolation',
    icon: '💪'
  },
  dips_tricep: { 
    name: 'Dips (Tricep Focused)', 
    muscleGroup: 'arms',
    type: 'compound',
    icon: '🏋️'
  },
  
  // CORE
  plank: { 
    name: 'Plank', 
    muscleGroup: 'core',
    type: 'isometric',
    icon: '🏋️'
  },
  sit_ups: { 
    name: 'Sit-ups / Crunches', 
    muscleGroup: 'core',
    type: 'isolation',
    icon: '🏋️'
  },
  leg_raises: { 
    name: 'Hanging Leg Raises', 
    muscleGroup: 'core',
    type: 'isolation',
    icon: '🏋️'
  },
  russian_twist: { 
    name: 'Russian Twists', 
    muscleGroup: 'core',
    type: 'isolation',
    icon: '🏋️'
  },
  cable_crunch: { 
    name: 'Cable Crunch', 
    muscleGroup: 'core',
    type: 'isolation',
    icon: '🏋️'
  },
  ab_wheel: { 
    name: 'Ab Wheel Rollout', 
    muscleGroup: 'core',
    type: 'compound',
    icon: '🏋️'
  }
};
