const SHELL_HTML = `
<div class="nav">
<button aria-label="Plan" class="active" onclick="switchTab('plan')">
<!-- Lucide: leaf -->
<svg viewbox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.5 1.36C18.84 7.86 19.18 12 19.18 12c.04 4.5-2.97 7.5-8.18 8z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6"></path></svg>
<span>Plan</span>
</button>
<button aria-label="Diary" onclick="switchTab('diary')">
<!-- Lucide: book-open -->
<svg viewbox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
<span>Diary</span>
</button>
<button aria-label="Train" onclick="switchTab('exercise')">
<!-- Lucide: dumbbell -->
<svg viewbox="0 0 24 24"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>
<span>Train</span>
</button>
<button aria-label="Routine" onclick="switchTab('routine')">
<!-- Lucide: sunrise -->
<svg viewbox="0 0 24 24"><path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 6 4-4 4 4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>
<span>Routine</span>
</button>
<button aria-label="Progress" onclick="switchTab('progress')">
<!-- Lucide: trending-up -->
<svg viewbox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
<span>Progress</span>
</button>
</div>
<!-- DIARY SECTION -->
<div class="section" id="diary">
<!-- Streak banner — habit-reinforcement at point of action -->
<div id="diary-streak-banner" style="display:none;margin-bottom:12px;"></div>
<!-- Date Navigation -->
<div class="card" style="padding: 12px;">
<div style="display: flex; justify-content: space-between; align-items: center;">
<button onclick="changeDiaryDate(-1)" style="background: #0a7d5a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
        ← Previous
      </button>
<div id="diary-current-date" style="font-size: 16px; font-weight: 600; color: #1a2332;">
        Today - April 17, 2026
      </div>
<button onclick="changeDiaryDate(1)" style="background: #0a7d5a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
        Next →
      </button>
</div>
</div>
<!-- Quick Add Options moved to FAB → Quick Log sheet for a cleaner
       review-focused Diary surface. Scan/Photo are still 2 taps away. -->
<!-- Macro Summary Card -->
<div class="card">
<div class="card-header">Daily Nutrition Summary</div>
<div style="display: flex; justify-content: space-around; padding: 20px; background: var(--accent-gradient); border-radius: 12px; color: white; margin-bottom: 16px;">
<div style="text-align: center;">
<div id="diary-calories-consumed" style="font-size: 32px; font-weight: 700;">0</div>
<div style="font-size: 24px; font-weight: 300; margin-bottom: 4px;">/</div>
<div id="diary-calories-goal" style="font-size: 20px; opacity: 0.9;">2200</div>
<div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">CALORIES</div>
</div>
</div>
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
<div style="text-align: center; padding: 12px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">PROTEIN</div>
<div id="diary-protein" style="font-size: 18px; font-weight: 600; color: #dc2626;">0g</div>
<div id="diary-protein-goal" style="font-size: 12px; color: #94a0ad;">/ 165g</div>
<div style="height: 6px; background: #e8e2d6; border-radius: 3px; margin-top: 8px; overflow: hidden;">
<div id="diary-protein-bar" style="height: 100%; background: #dc2626; width: 0%; transition: width 0.3s;"></div>
</div>
</div>
<div style="text-align: center; padding: 12px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">CARBS</div>
<div id="diary-carbs" style="font-size: 18px; font-weight: 600; color: #d97706;">0g</div>
<div id="diary-carbs-goal" style="font-size: 12px; color: #94a0ad;">/ 220g</div>
<div style="height: 6px; background: #e8e2d6; border-radius: 3px; margin-top: 8px; overflow: hidden;">
<div id="diary-carbs-bar" style="height: 100%; background: #d97706; width: 0%; transition: width 0.3s;"></div>
</div>
</div>
<div style="text-align: center; padding: 12px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">FAT</div>
<div id="diary-fat" style="font-size: 18px; font-weight: 600; color: #0891b2;">0g</div>
<div id="diary-fat-goal" style="font-size: 12px; color: #94a0ad;">/ 73g</div>
<div style="height: 6px; background: #e8e2d6; border-radius: 3px; margin-top: 8px; overflow: hidden;">
<div id="diary-fat-bar" style="height: 100%; background: #0891b2; width: 0%; transition: width 0.3s;"></div>
</div>
</div>
</div>
</div>
<!-- Meals Section -->
<div class="card">
<div class="card-header">Food Diary</div>
<!-- Breakfast -->
<div class="meal-slot">
<div class="meal-slot-header">
<div class="meal-slot-rule"></div>
<div class="meal-slot-title">🍳 Breakfast</div>
<div class="meal-slot-cals" id="breakfast-calories">0 cals</div>
</div>
<div class="meal-slot-foods" id="breakfast-foods">
<div class="meal-slot-empty">No foods logged</div>
</div>
<button class="meal-slot-add" onclick="openFoodSearch('breakfast')">
        + Add to breakfast
      </button>
</div>
<!-- Lunch -->
<div class="meal-slot">
<div class="meal-slot-header">
<div class="meal-slot-rule"></div>
<div class="meal-slot-title">🥗 Lunch</div>
<div class="meal-slot-cals" id="lunch-calories">0 cals</div>
</div>
<div class="meal-slot-foods" id="lunch-foods">
<div class="meal-slot-empty">No foods logged</div>
</div>
<button class="meal-slot-add" onclick="openFoodSearch('lunch')">
        + Add to lunch
      </button>
</div>
<!-- Dinner -->
<div class="meal-slot">
<div class="meal-slot-header">
<div class="meal-slot-rule"></div>
<div class="meal-slot-title">🍽️ Dinner</div>
<div class="meal-slot-cals" id="dinner-calories">0 cals</div>
</div>
<div class="meal-slot-foods" id="dinner-foods">
<div class="meal-slot-empty">No foods logged</div>
</div>
<button class="meal-slot-add" onclick="openFoodSearch('dinner')">
        + Add to dinner
      </button>
</div>
<!-- Snacks -->
<div class="meal-slot">
<div class="meal-slot-header">
<div class="meal-slot-rule"></div>
<div class="meal-slot-title">🍪 Snacks</div>
<div class="meal-slot-cals" id="snacks-calories">0 cals</div>
</div>
<div class="meal-slot-foods" id="snacks-foods">
<div class="meal-slot-empty">No foods logged</div>
</div>
<button class="meal-slot-add" onclick="openFoodSearch('snacks')">
        + Add to snacks
      </button>
</div>
</div>
<!-- Quick Actions -->
<div class="card">
<div class="card-header">Quick Actions</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
<button class="btn btn-secondary" onclick="showQuickAdd()">
        ⚡ Quick Add Calories
      </button>
<button class="btn btn-secondary" onclick="showRecentFoods()">
        🕐 Recent Foods
      </button>
<button class="btn btn-secondary" onclick="showFavoriteFoods()">
        ⭐ Favorite Foods
      </button>
<button class="btn btn-secondary" onclick="copyYesterdayMeals()">
        📋 Copy Yesterday
      </button>
</div>
</div>
<!-- ─── Water tracking (moved into Diary) ────────────────────────
       Water IS logging — keep it next to meal logging so users hit it
       every time they open Diary. Compact card; full schedule below
       (collapsed by default). -->
<div class="card" id="diary-water-card">
<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
<span id="water-goal-text">💧 Hydration</span>
<span class="badge badge-warning" id="hydration-badge">0/8</span>
</div>
<div style="display:flex;align-items:center;gap:14px;padding:6px 0;">
<div style="flex:1;min-width:0;">
<div style="font-size:12px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Today</div>
<div id="water-today" style="font-size:28px;font-weight:700;color:var(--text-primary);font-variant-numeric:tabular-nums;letter-spacing:-0.02em;line-height:1.2;">0oz</div>
</div>
<button onclick="logOneGlass()" style="padding:14px 18px;background:linear-gradient(135deg,#3498db,#2980b9);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px;flex-shrink:0;min-height:48px;">
        💧 + Glass
      </button>
<!-- v1.5.1 Issue #9: tap = undo last glass; long-press = reset all to 0oz.
           Long-press bound via inline pointerdown/up timers; no extra slot taken. -->
<button onclick="undoLastGlass()" onpointerdown="this._t=setTimeout(()=&gt;{this._fired=true;resetWaterToday();},700)" onpointerleave="clearTimeout(this._t);" onpointerup="clearTimeout(this._t);if(this._fired){this._fired=false;event.preventDefault();}" style="padding:14px 12px;background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-weight:600;font-size:13px;flex-shrink:0;min-height:48px;" title="Tap to undo · Hold to reset to 0">
        ↶
      </button>
</div>
<div class="progress-bar" style="margin-top:6px;">
<div class="progress-fill" id="hydration-progress" style="width: 0%"></div>
</div>
<!-- Collapsible: full 8-checkpoint schedule -->
<button id="diary-hydration-toggle" onclick="toggleDiaryHydrationSchedule()" style="width:100%;background:none;border:none;color:var(--text-secondary);font-size:12px;cursor:pointer;padding:10px 0 4px 0;text-align:center;letter-spacing:0.04em;">
      Show daily schedule ▾
    </button>
<div id="hydration-items" style="margin-top:10px;display:none;"></div>
</div>
<!-- ─── Diary quick actions ──────────────────────────────────────
       Custom food creation belongs WITH logging (was buried in Tools).
       Retrospective is "review your diary at scale" — links from here. -->
<div class="card" id="diary-quick-actions">
<div class="card-header">Quick actions</div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:6px 0;">
<button onclick="openCustomFoodModal()" style="display:flex;align-items:center;gap:10px;padding:14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--text-primary);">
<span style="font-size:20px;">✚</span>
<span style="text-align:left;flex:1;">Add custom food
          <span style="display:block;font-size:11px;color:var(--text-tertiary);font-weight:500;margin-top:2px;">For foods not in our database</span>
</span>
</button>
<button onclick="openRetrospective()" style="display:flex;align-items:center;gap:10px;padding:14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--text-primary);">
<span style="font-size:20px;">🌿</span>
<span style="text-align:left;flex:1;">30-day retrospective
          <span style="display:block;font-size:11px;color:var(--text-tertiary);font-weight:500;margin-top:2px;">Your last 30 days at a glance</span>
</span>
</button>
</div>
</div>
<!-- ─── Gut insights (collapsible) ──────────────────────────────────
       Gut health is a differentiator (fiber, symptoms, food sensitivity)
       but only ~10-20% of users will engage daily. Living as a collapsed
       card at the bottom of Diary keeps it discoverable without crowding
       users who don't track it. Lazy-loaded on first expand. -->
</div>
<!-- EXERCISE SECTION -->
<div class="section" id="exercise">
<!-- ─── Recovery card (top of Train) ────────────────────────────────
       Recovery and Training are causally coupled — HRV/sleep/training-load
       feed directly into "should I push or pull back today?" The recovery
       card below renders today's readout + history + the Log HRV CTA.
       
       v1.4: removed the gradient banner that previously sat above this
       slot — it duplicated the same info and CTA as the card itself.
       Recovery card is now the single entry point. -->
<div id="train-recovery-content"></div>
<!-- Date Navigation (Matches Diary) -->
<div class="card" style="padding: 12px;">
<div style="display: flex; justify-content: space-between; align-items: center;">
<button onclick="changeExerciseDate(-1)" style="background: #0a7d5a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
        ← Previous
      </button>
<div id="exercise-current-date" style="font-size: 16px; font-weight: 600; color: #1a2332;">
        Today - April 17, 2026
      </div>
<button onclick="changeExerciseDate(1)" style="background: #0a7d5a; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
        Next →
      </button>
</div>
</div>
<!-- Exercise Summary Card -->
<div class="card">
<div class="card-header">Exercise Summary</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 16px;">
<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #e76f51 0%, #d65a3f 100%); border-radius: 12px; color: white;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">CALORIES BURNED</div>
<div id="exercise-calories-burned" style="font-size: 32px; font-weight: 700;">0</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">cals</div>
</div>
<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 12px; color: white;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">NET CALORIES</div>
<div id="exercise-net-calories" style="font-size: 32px; font-weight: 700;">0</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">
<span id="exercise-food-cals">0</span> food - <span id="exercise-burn-cals">0</span> exercise
        </div>
</div>
</div>
</div>
<!-- Exercise Type Tabs -->
<div class="card" style="padding: 0; overflow: hidden;">
<div style="display: flex; border-bottom: 2px solid #f0f0f0;">
<button id="exercise-tab-cardio" onclick="switchExerciseTab('cardio')" style="flex: 1; padding: 16px; border: none; background: #0a7d5a; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
        🏃 Cardio
      </button>
<button id="exercise-tab-strength" onclick="switchExerciseTab('strength')" style="flex: 1; padding: 16px; border: none; background: #e8e2d6; color: #495057; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
        💪 Strength
      </button>
</div>
<!-- Cardio Tab Content -->
<div id="exercise-cardio-content" style="padding: 16px;">
<button class="btn" onclick="openAddCardio()" style="width: 100%; margin-bottom: 16px; font-size: 15px;">
        + Add Cardio Exercise
      </button>
<div id="cardio-exercises-list">
<div style="padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">🏃</div>
<div>No cardio logged yet</div>
<div style="font-size: 13px; margin-top: 8px;">Click above to add your first cardio session</div>
</div>
</div>
<div style="margin-top: 16px; padding: 12px; background: #f4f1ec; border-radius: 8px; border-left: 3px solid #e76f51;">
<div style="font-weight: 600; margin-bottom: 4px;">Total Cardio Today</div>
<div id="cardio-summary" style="font-size: 13px; color: #5a6573;">
          0 minutes • 0 calories burned
        </div>
</div>
</div>
<!-- Strength Tab Content -->
<div id="exercise-strength-content" style="display: none; padding: 16px;">
<button class="btn" onclick="openAddStrength()" style="width: 100%; margin-bottom: 16px; font-size: 15px;">
        + Add Strength Exercise
      </button>
<div id="strength-exercises-list">
<div style="padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">💪</div>
<div>No strength training logged yet</div>
<div style="font-size: 13px; margin-top: 8px;">Click above to add your first exercise</div>
</div>
</div>
<div style="margin-top: 16px; padding: 12px; background: #f4f1ec; border-radius: 8px; border-left: 3px solid #0891b2;">
<div style="font-weight: 600; margin-bottom: 4px;">Total Volume Today</div>
<div id="strength-summary" style="font-size: 13px; color: #5a6573;">
          0 sets • 0 total reps
        </div>
</div>
</div>
</div>
<!-- Quick Stats -->
<div class="card">
<div class="card-header">Weekly Stats</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
<div style="text-align: center; padding: 16px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">WORKOUTS THIS WEEK</div>
<div id="weekly-workouts" style="font-size: 24px; font-weight: 600; color: #0a7d5a;">0</div>
</div>
<div style="text-align: center; padding: 16px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">CALORIES BURNED</div>
<div id="weekly-calories" style="font-size: 24px; font-weight: 600; color: #e76f51;">0</div>
</div>
</div>
</div>
</div>
<!-- Add Cardio Modal -->
<div class="modal" id="addCardioModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Add Cardio Exercise</h2>
<button onclick="closeAddCardio()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<!-- Exercise Selector -->
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Exercise Type</label>
<select id="cardio-exercise-selector" onchange="updateCardioCalories()" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;">
<!-- Options populated by JS -->
</select>
</div>
<!-- Duration Input -->
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Duration (minutes)</label>
<input id="cardio-duration" min="1" onchange="updateCardioCalories()" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="30"/>
</div>
<!-- Calories Display -->
<div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #e76f51 0%, #d65a3f 100%); border-radius: 12px; color: white; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">ESTIMATED CALORIES BURNED</div>
<div id="cardio-calories-estimate" style="font-size: 36px; font-weight: 700;">240</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">calories</div>
</div>
<!-- Notes (Optional) -->
<div style="margin-bottom: 20px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Notes (optional)</label>
<textarea id="cardio-notes" placeholder="How did it feel? Any PRs?" rows="2" style="width: 100%; padding: 12px; border: 1px solid #e8e2d6; border-radius: 8px; font-size: 14px; font-family: inherit;"></textarea>
</div>
<!-- Action Buttons -->
<div class="btn-group">
<button class="btn" onclick="addCardioExercise()" style="flex: 1;">
        Add Cardio
      </button>
<button class="btn-secondary" onclick="closeAddCardio()" style="padding: 12px 20px;">
        Cancel
      </button>
</div>
</div>
</div>
<!-- Add Strength Modal -->
<div class="modal" id="addStrengthModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Add Strength Exercise</h2>
<button onclick="closeAddStrength()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<!-- Exercise Selector -->
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Exercise</label>
<select id="strength-exercise-selector" onchange="updateLastSessionCard()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;">
<!-- Options populated by JS -->
</select>
</div>
<!-- LAST SESSION REFERENCE -->
<!-- Shows user's most recent log for this exercise, so progressive overload -->
<!-- is visible at the moment of decision-making. Populated by updateLastSessionCard. -->
<div id="last-session-card" style="display:none; padding: 12px 14px; background: #e7f5ee; border-left: 4px solid #0a7d5a; border-radius: 8px; margin-bottom: 14px; font-size: 13px;">
<div style="font-weight: 600; color: #0a7d5a; margin-bottom: 4px;">📊 Last session</div>
<div id="last-session-content" style="color: var(--text-primary); line-height: 1.4;"></div>
</div>
<!-- LOG MODE TOGGLE -->
<div style="display: flex; gap: 8px; margin-bottom: 14px;">
<button id="mode-quick-btn" onclick="setStrengthLogMode('quick')" style="flex: 1; padding: 10px; min-height: 44px; background: #0a7d5a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">
        ⚡ Quick log
      </button>
<button id="mode-bysets-btn" onclick="setStrengthLogMode('bysets')" style="flex: 1; padding: 10px; min-height: 44px; background: white; color: #0a7d5a; border: 1.5px solid #0a7d5a; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">
        📋 Track each set
      </button>
</div>
<!-- QUICK MODE: Sets, Reps, Weight Grid (existing behavior) -->
<div id="strength-quick-mode">
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Sets</label>
<input id="strength-sets" min="1" oninput="updateStrengthVolume()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="3"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Reps</label>
<input id="strength-reps" min="1" oninput="updateStrengthVolume()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="10"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Weight (lbs)</label>
<input id="strength-weight" min="0" oninput="updateStrengthVolume()" step="5" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="135"/>
</div>
</div>
<!-- Volume Display -->
<div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 12px; color: white; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">TOTAL VOLUME</div>
<div id="strength-volume-display" style="font-size: 36px; font-weight: 700;">4,050</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">
<span id="strength-total-reps">30</span> total reps × <span id="strength-weight-display">135</span> lbs
        </div>
</div>
</div>
<!-- SET-BY-SET MODE: live set log + rest timer -->
<div id="strength-bysets-mode" style="display: none;">
<!-- Active set being entered -->
<div style="background: #f4f1ec; padding: 14px; border-radius: 10px; margin-bottom: 12px;">
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
<div>
<label style="display: block; font-size: 12px; color: #5a6573; margin-bottom: 4px;">Reps</label>
<input id="byset-reps" min="1" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 16px;" type="number" value="10"/>
</div>
<div>
<label style="display: block; font-size: 12px; color: #5a6573; margin-bottom: 4px;">Weight (lbs)</label>
<input id="byset-weight" min="0" step="5" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 16px;" type="number" value="135"/>
</div>
</div>
<button onclick="addCurrentSet()" style="width: 100%; padding: 14px; background: var(--accent-gradient); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 15px; min-height: 48px;">
          ✓ Log this set &amp; start rest timer
        </button>
</div>
<!-- Rest timer (appears after a set is logged) -->
<div id="rest-timer-card" style="display: none; padding: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; color: white; margin-bottom: 12px; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">REST TIMER</div>
<div id="rest-timer-display" style="font-size: 32px; font-weight: 700; line-height: 1;">02:00</div>
<div style="display: flex; gap: 8px; margin-top: 10px;">
<button onclick="adjustRestTimer(-15)" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">−15s</button>
<button onclick="adjustRestTimer(15)" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">+15s</button>
<button onclick="stopRestTimer()" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">Skip</button>
</div>
</div>
<!-- Logged sets so far -->
<div style="background: white; border: 1px solid #e8e2d6; border-radius: 10px; margin-bottom: 14px;">
<div style="padding: 10px 14px; border-bottom: 1px solid #e8e2d6; font-weight: 600; font-size: 13px; color: #1a2332;">
          Sets logged this session
        </div>
<div id="byset-list">
<div style="padding: 14px; text-align: center; color: #94a0ad; font-size: 13px;">No sets logged yet — add your first set above</div>
</div>
</div>
</div>
<!-- Notes (Optional) -->
<div style="margin-bottom: 20px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Notes (optional)</label>
<textarea id="strength-notes" placeholder="Form notes, how it felt, PRs, etc." rows="2" style="width: 100%; padding: 12px; border: 1px solid #e8e2d6; border-radius: 8px; font-size: 14px; font-family: inherit;"></textarea>
</div>
<!-- Action Buttons -->
<div class="btn-group">
<button class="btn" onclick="addStrengthExercise()" style="flex: 1; min-height: 48px;">
        Save Workout
      </button>
<button class="btn-secondary" onclick="closeAddStrength()" style="padding: 12px 20px; min-height: 48px;">
        Cancel
      </button>
</div>
</div>
</div>
<!-- ANALYTICS SECTION -->
<div class="section" id="analytics">
<!-- Time Range Selector -->
<div class="card" style="padding: 12px;">
<div style="display: flex; gap: 8px; overflow-x: auto;">
<button class="btn-secondary" id="range-7" onclick="setAnalyticsRange(7)" style="font-size: 13px; padding: 8px 16px; white-space: nowrap;">
        7 Days
      </button>
<button class="btn-secondary" id="range-14" onclick="setAnalyticsRange(14)" style="font-size: 13px; padding: 8px 16px; white-space: nowrap;">
        14 Days
      </button>
<button class="btn-secondary" id="range-30" onclick="setAnalyticsRange(30)" style="font-size: 13px; padding: 8px 16px; white-space: nowrap; background: #0a7d5a; color: white;">
        30 Days
      </button>
<button class="btn-secondary" id="range-90" onclick="setAnalyticsRange(90)" style="font-size: 13px; padding: 8px 16px; white-space: nowrap;">
        90 Days
      </button>
</div>
</div>
<!-- Summary Stats -->
<div class="card">
<div class="card-header">Summary (<span id="analytics-period">Last 30 Days</span>)</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
<div style="text-align: center; padding: 16px 10px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px;">
<div style="width: 18px; height: 3px; background: var(--accent-primary); border-radius: 2px; margin: 0 auto 8px;"></div>
<div style="font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Avg calories</div>
<div id="avg-calories" style="font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; margin-top: 4px; font-variant-numeric: tabular-nums;">0</div>
<div style="font-size: 11px; color: var(--text-tertiary); margin-top: 2px;">per day</div>
</div>
<div style="text-align: center; padding: 16px 10px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px;">
<div style="width: 18px; height: 3px; background: var(--accent-primary); border-radius: 2px; margin: 0 auto 8px;"></div>
<div style="font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Workouts</div>
<div id="total-workouts" style="font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; margin-top: 4px; font-variant-numeric: tabular-nums;">0</div>
<div style="font-size: 11px; color: var(--text-tertiary); margin-top: 2px;">sessions</div>
</div>
<div style="text-align: center; padding: 16px 10px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px;">
<div style="width: 18px; height: 3px; background: var(--accent-primary); border-radius: 2px; margin: 0 auto 8px;"></div>
<div style="font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Avg net cals</div>
<div id="avg-net-cals" style="font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; margin-top: 4px; font-variant-numeric: tabular-nums;">0</div>
<div style="font-size: 11px; color: var(--text-tertiary); margin-top: 2px;">per day</div>
</div>
<div style="text-align: center; padding: 16px 10px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px;">
<div style="width: 18px; height: 3px; background: var(--accent-primary); border-radius: 2px; margin: 0 auto 8px;"></div>
<div style="font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">Logged days</div>
<div id="logged-days" style="font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; margin-top: 4px; font-variant-numeric: tabular-nums;">0</div>
<div style="font-size: 11px; color: var(--text-tertiary); margin-top: 2px;">days</div>
</div>
</div>
</div>
<!-- Weight Progress Chart -->
<div class="card">
<div class="card-header">Weight Progress</div>
<div style="padding: 16px;">
<canvas id="weightChart" style="max-height: 250px;"></canvas>
</div>
<div id="weight-chart-empty" style="display: none; padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">⚖️</div>
<div>No weight data yet</div>
<div style="font-size: 13px; margin-top: 8px;">Check-in with your weight to see progress</div>
</div>
</div>
<!-- Calorie Trend Chart -->
<div class="card">
<div class="card-header">Calorie Trend</div>
<div style="padding: 16px;">
<canvas id="calorieChart" style="max-height: 250px;"></canvas>
</div>
<div id="calorie-chart-empty" style="display: none; padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">📊</div>
<div>No calorie data yet</div>
<div style="font-size: 13px; margin-top: 8px;">Start logging food to see trends</div>
</div>
</div>
<!-- Macro Breakdown Pie Charts -->
<div class="card">
<div class="card-header">Average Macro Breakdown</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 16px;">
<div>
<div style="font-size: 13px; font-weight: 600; text-align: center; margin-bottom: 8px; color: #5a6573;">Daily Average</div>
<canvas id="macroChart" style="max-height: 200px;"></canvas>
</div>
<div>
<div style="font-size: 13px; font-weight: 600; text-align: center; margin-bottom: 8px; color: #5a6573;">Period Total</div>
<canvas id="macroTotalChart" style="max-height: 200px;"></canvas>
</div>
</div>
<div id="macro-chart-empty" style="display: none; padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">🥧</div>
<div>No macro data yet</div>
<div style="font-size: 13px; margin-top: 8px;">Log food to see macro breakdown</div>
</div>
</div>
<!-- Exercise Volume Chart -->
<div class="card">
<div class="card-header">Exercise Volume</div>
<div style="padding: 16px;">
<canvas id="exerciseChart" style="max-height: 250px;"></canvas>
</div>
<div id="exercise-chart-empty" style="display: none; padding: 40px 20px; text-align: center; color: #94a0ad;">
<div style="font-size: 48px; margin-bottom: 12px;">💪</div>
<div>No exercise data yet</div>
<div style="font-size: 13px; margin-top: 8px;">Log workouts to see volume trends</div>
</div>
</div>
<!-- Adherence & Consistency -->
<div class="card">
<div class="card-header">Adherence &amp; Consistency</div>
<div style="padding: 16px;">
<div style="margin-bottom: 16px;">
<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
<span style="font-size: 14px; font-weight: 600; color: #1a2332;">Food Logging</span>
<span id="food-adherence" style="font-size: 14px; font-weight: 600; color: #0a7d5a;">0%</span>
</div>
<div style="height: 8px; background: #e8e2d6; border-radius: 4px; overflow: hidden;">
<div id="food-adherence-bar" style="height: 100%; background: linear-gradient(90deg, #0a7d5a 0%, #10b981 100%); width: 0%; transition: width 0.3s;"></div>
</div>
</div>
<div style="margin-bottom: 16px;">
<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
<span style="font-size: 14px; font-weight: 600; color: #1a2332;">Exercise Logging</span>
<span id="exercise-adherence" style="font-size: 14px; font-weight: 600; color: #e76f51;">0%</span>
</div>
<div style="height: 8px; background: #e8e2d6; border-radius: 4px; overflow: hidden;">
<div id="exercise-adherence-bar" style="height: 100%; background: linear-gradient(90deg, #e76f51 0%, #d65a3f 100%); width: 0%; transition: width 0.3s;"></div>
</div>
</div>
<div>
<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
<span style="font-size: 14px; font-weight: 600; color: #1a2332;">Macro Goals Met</span>
<span id="macro-adherence" style="font-size: 14px; font-weight: 600; color: #0891b2;">0%</span>
</div>
<div style="height: 8px; background: #e8e2d6; border-radius: 4px; overflow: hidden;">
<div id="macro-adherence-bar" style="height: 100%; background: linear-gradient(90deg, #0891b2 0%, #0e7490 100%); width: 0%; transition: width 0.3s;"></div>
</div>
</div>
</div>
</div>
<!-- Weekly Comparison -->
<div class="card">
<div class="card-header">Weekly Comparison</div>
<div style="padding: 16px;">
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
<div style="padding: 12px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">THIS WEEK</div>
<div id="this-week-cals" style="font-size: 20px; font-weight: 600; color: #0a7d5a;">0</div>
<div style="font-size: 11px; color: #94a0ad;">avg cals/day</div>
</div>
<div style="padding: 12px; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 11px; color: #5a6573; margin-bottom: 4px;">LAST WEEK</div>
<div id="last-week-cals" style="font-size: 20px; font-weight: 600; color: #94a0ad;">0</div>
<div style="font-size: 11px; color: #94a0ad;">avg cals/day</div>
</div>
</div>
<div style="padding: 12px; background: var(--accent-gradient); border-radius: 8px; color: white; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">WEEKLY CHANGE</div>
<div id="weekly-change" style="font-size: 24px; font-weight: 700;">+0</div>
<div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">calories per day</div>
</div>
</div>
</div>
</div>
<!-- PREMIUM FEATURES SECTION (v1.4.1: now mostly empty — IF timer moved to
     Routine, Custom Foods is reachable from Diary's quick-actions row.
     Section kept alive for any latent switchTab('premium') callers.) -->
<div class="section" id="premium">
<div class="card">
<div class="card-header">🛠️ Tools</div>
<p style="color:var(--text-secondary);font-size:13px;margin:0 0 12px 0;line-height:1.5;">
      Tools have moved closer to where they're used:
    </p>
<div style="display:grid;gap:10px;">
<button onclick="switchTab('routine')" style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;color:var(--text-primary);text-align:left;">
<span style="font-size:20px;">⏱️</span>
<span style="flex:1;">
<strong>Intermittent fasting timer</strong>
<span style="display:block;font-size:12px;color:var(--text-tertiary);font-weight:400;margin-top:2px;">Now on the Routine tab</span>
</span>
<span style="color:var(--text-tertiary);">›</span>
</button>
<button onclick="switchTab('diary');setTimeout(function(){if(typeof openCustomFoodModal==='function')openCustomFoodModal();},120);" style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;color:var(--text-primary);text-align:left;">
<span style="font-size:20px;">🍴</span>
<span style="flex:1;">
<strong>Add custom food</strong>
<span style="display:block;font-size:12px;color:var(--text-tertiary);font-weight:400;margin-top:2px;">Available from Diary's Quick actions</span>
</span>
<span style="color:var(--text-tertiary);">›</span>
</button>
</div>
</div>
<!-- (Progress Photos card removed from premium in v1.3 — moved to Progress tab.
       The renderProgressPhotos() function still works because the IDs it
       references (progress-photos-grid, progress-photos-empty) now live in
       the Progress tab.) -->
<!-- Custom Food Creation -->
<div class="card">
<div class="card-header">🍴 Custom Foods</div>
<div style="padding: 16px;">
<button class="btn" onclick="openCustomFoodModal()" style="width: 100%; margin-bottom: 16px;">
        + Create Custom Food
      </button>
<!-- Custom Foods List -->
<div id="custom-foods-list">
<!-- Custom foods will be listed here -->
</div>
<div id="custom-foods-empty" style="padding: 40px 20px; text-align: center; color: #94a0ad; background: #f4f1ec; border-radius: 8px;">
<div style="font-size: 48px; margin-bottom: 12px;">🍴</div>
<div>No custom foods yet</div>
<div style="font-size: 13px; margin-top: 8px;">Create foods for items not in the database</div>
</div>
</div>
</div>
<!-- Data Export -->
<div class="card">
<div class="card-header">💾 Data Export</div>
<div style="padding: 16px;">
<p style="font-size: 14px; color: #5a6573; margin-bottom: 16px;">
        Export all your data to CSV format for backup or analysis in spreadsheet software.
      </p>
<div style="display: grid; gap: 12px;">
<button class="btn-secondary" onclick="exportFoodDiary()">
          📔 Export Food Diary
        </button>
<button class="btn-secondary" onclick="exportExerciseLog()">
          💪 Export Exercise Log
        </button>
<button class="btn-secondary" onclick="exportCheckIns()">
          ⚖️ Export Check-ins
        </button>
<button class="btn" onclick="exportAllData()" style="background: #0a7d5a;">
          📦 Export All Data
        </button>
</div>
<div style="margin-top: 16px; padding: 12px; background: #e7f3ff; border-radius: 8px; border-left: 3px solid #0a7d5a;">
<div style="font-size: 13px; color: #1a2332;">
<strong>💡 Tip:</strong> Export regularly to back up your data. CSV files can be opened in Excel, Google Sheets, or any spreadsheet software.
        </div>
</div>
</div>
</div>
</div>
<!-- Custom Food Creation Modal -->
<div class="modal" id="customFoodModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Create Custom Food</h2>
<button onclick="closeCustomFoodModal()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<!-- Food Name -->
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Food Name</label>
<input id="custom-food-name" placeholder="e.g., Homemade Protein Shake" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="text"/>
</div>
<!-- Serving Size -->
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Serving Size</label>
<input id="custom-food-serving" placeholder="e.g., 1 cup, 1 serving, 100g" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="text"/>
</div>
<!-- Nutrition Grid -->
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Calories</label>
<input id="custom-food-calories" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Protein (g)</label>
<input id="custom-food-protein" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Carbs (g)</label>
<input id="custom-food-carbs" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Fat (g)</label>
<input id="custom-food-fat" placeholder="0" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number"/>
</div>
</div>
<!-- Action Buttons -->
<div class="btn-group">
<button class="btn" onclick="saveCustomFood()" style="flex: 1;">
        Save Custom Food
      </button>
<button class="btn-secondary" onclick="closeCustomFoodModal()" style="padding: 12px 20px;">
        Cancel
      </button>
</div>
</div>
</div>
<!-- Photo Comparison Modal -->
<div class="modal" id="photoComparisonModal">
<div class="modal-content" style="max-width: 800px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Before &amp; After Comparison</h2>
<button onclick="closePhotoComparison()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
<div>
<div style="font-weight: 600; margin-bottom: 8px; text-align: center;">BEFORE</div>
<img id="comparison-before-img" style="width: 100%; border-radius: 8px; border: 1px solid #e8e2d6;"/>
<div id="comparison-before-date" style="text-align: center; font-size: 13px; color: #5a6573; margin-top: 8px;">--</div>
</div>
<div>
<div style="font-weight: 600; margin-bottom: 8px; text-align: center;">AFTER</div>
<img id="comparison-after-img" style="width: 100%; border-radius: 8px; border: 1px solid #e8e2d6;"/>
<div id="comparison-after-date" style="text-align: center; font-size: 13px; color: #5a6573; margin-top: 8px;">--</div>
</div>
</div>
<div style="margin-top: 20px; padding: 16px; background: var(--accent-gradient); border-radius: 8px; color: white; text-align: center;">
<div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">TIME DIFFERENCE</div>
<div id="comparison-days" style="font-size: 28px; font-weight: 700;">0 days</div>
</div>
</div>
</div>
<!-- (HEALTH section removed in v1.3 — Recovery moved to Train, Gut moved to
     Diary as collapsible card, Body content distributed: weight to Plan
     chip, photos to Progress. Routine promoted to top-level tab below.) -->
<!-- ROUTINE SECTION (v1.3 — promoted from Health sub-tab to top-level) -->
<div class="section" id="routine">
<!-- Sun exposure card -->
<div class="card">
<div class="card-header">☀️ Daily sunlight</div>
<p style="color:var(--text-secondary);font-size:13px;margin:0 0 14px 0;line-height:1.5;">
      Morning light exposure anchors your circadian rhythm — the strongest non-pharmacological lever for sleep, mood, and metabolic health. Aim for 5–10 min within an hour of waking.
    </p>
<!-- v1.5.2 Issue #2: Sun log buttons now rendered by renderHealthSunlight()
         so they can reflect today's logged state. Buttons turn brand-green
         with a checkmark once logged today. -->
<div id="sunlight-log-buttons" style="display:flex;gap:10px;margin-bottom:14px;"></div>
<div id="sunlight-week-summary" style="font-size:13px;color:var(--text-secondary);"></div>
</div>
<!-- Full morning routine — always visible -->
<div class="card">
<div class="card-header">🌅 Morning routine</div>
<div id="health-routine-morning-body"></div>
</div>
<!-- Full evening routine — always visible -->
<div class="card">
<div class="card-header">🌙 Evening routine</div>
<div id="health-routine-evening-body"></div>
</div>
<!-- Routine timing controls -->
<div class="card">
<div class="card-header">⚙️ Adjust routine times</div>
<div id="health-routine-times-body"></div>
</div>
<!-- v1.6.0 — Custom routine item. Same card/button language as original. -->
<div class="card" id="custom-routine-card">
<div class="card-header">➕ Custom routine item</div>
<div style="display:grid;grid-template-columns:120px 1fr auto;gap:8px;margin-bottom:12px;align-items:center;">
<input aria-label="Routine item time" id="custom-routine-time" style="padding:12px;border:1px solid var(--border-input);border-radius:8px;background:var(--bg-input);color:var(--text-primary);font-family:inherit;font-size:14px;min-height:48px;" type="time" value="12:00"/>
<input id="custom-routine-input" placeholder="Add a personal routine item" style="min-width:0;padding:12px;border:1px solid var(--border-input);border-radius:8px;background:var(--bg-input);color:var(--text-primary);font-family:inherit;font-size:14px;min-height:48px;" type="text"/>
<button onclick="addCustomRoutineItem()" style="padding:12px 16px;background:var(--accent-gradient);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;min-height:48px;">Add</button>
</div>
<div id="custom-routine-list" style="font-size:13px;color:var(--text-secondary);"></div>
</div>
<!-- v1.4.1: Intermittent Fasting Timer — moved from premium/Tools section.
       Routine is the natural home: IF is eating-window discipline alongside
       sleep/sun/morning routine. Collapsible because most users don't fast,
       but those who do reach it from the same surface that owns timing. -->
<div class="card" id="if-timer-card">
<div class="card-header" onclick="toggleIFTimerCard()" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
<span>⏱️ Intermittent fasting</span>
<span id="if-timer-toggle" style="font-size:14px;color:var(--text-tertiary);font-weight:500;">Show ▾</span>
</div>
<div id="if-timer-body" style="display:none;">
<div id="fasting-active" style="display: none; padding: 16px;">
<!-- Active Fasting Display -->
<div style="text-align: center; padding: 30px 20px; background: var(--accent-gradient); border-radius: 12px; color: white; margin-bottom: 16px;">
<div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">HOURS FASTED</div>
<div id="fasting-hours" style="font-size: 64px; font-weight: 700; font-variant-numeric: tabular-nums;">00:00</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 8px;">Started: <span id="fast-start-time">--</span></div>
</div>
<div style="margin-bottom: 16px; padding: 14px; background: var(--bg-elevated); border-radius: 8px;">
<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
<span style="font-size: 14px; font-weight: 600;color:var(--text-primary);">Eating Window Ends</span>
<span id="eating-window-end" style="font-size: 14px; font-weight: 600; color: var(--accent-primary);">--</span>
</div>
<div style="font-size: 12px; color: var(--text-secondary);">Fasting Window: <span id="fasting-window-display">--</span></div>
</div>
<button class="btn" onclick="endFast()" style="width: 100%; background: #dc2626;">
          🍽️ End Fast &amp; Break Fast
        </button>
</div>
<div id="fasting-inactive" style="padding: 16px;">
<div style="padding: 20px; text-align: center; background: var(--bg-elevated); border-radius: 8px; margin-bottom: 16px;">
<div style="font-size: 48px; margin-bottom: 12px;">⏱️</div>
<div style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Ready to Start Fasting</div>
<div style="font-size: 13px; color: var(--text-secondary);">Track your fasting windows and build consistency</div>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: var(--text-primary);">Fasting Schedule</label>
<select id="fasting-schedule" onchange="updateFastingSchedule()" style="width: 100%; padding: 12px; border: 2px solid var(--accent-primary); border-radius: 8px; font-size: 15px;background:var(--bg-input);color:var(--text-primary);">
<option value="16:8">16:8 (16 hours fasting, 8 hours eating)</option>
<option value="18:6">18:6 (18 hours fasting, 6 hours eating)</option>
<option value="20:4">20:4 (20 hours fasting, 4 hours eating)</option>
<option value="14:10">14:10 (14 hours fasting, 10 hours eating)</option>
<option value="custom">Custom</option>
</select>
</div>
<button class="btn" onclick="startFast()" style="width: 100%;">
          ⏱️ Start Fasting Now
        </button>
<div style="margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
<div style="padding: 12px; background: var(--bg-elevated); border-radius: 8px; text-align: center;">
<div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">CURRENT STREAK</div>
<div id="fasting-streak" style="font-size: 24px; font-weight: 600; color: var(--accent-primary);">0</div>
<div style="font-size: 11px; color: var(--text-tertiary);">days</div>
</div>
<div style="padding: 12px; background: var(--bg-elevated); border-radius: 8px; text-align: center;">
<div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">LONGEST STREAK</div>
<div id="fasting-longest" style="font-size: 24px; font-weight: 600; color: #e76f51;">0</div>
<div style="font-size: 11px; color: var(--text-tertiary);">days</div>
</div>
</div>
</div>
</div>
</div>
<!-- Hidden: legacy content slot for backward compatibility -->
<div id="routine-content" style="display:none;"></div>
</div>
<!-- TRAINING SECTION -->
<div class="section" id="training" style="display: none;">
<div class="card">
<div class="card-header">📅 Your Training Schedule</div>
<div id="training-schedule"></div>
</div>
<div class="card" id="performance-tracking">
<div class="card-header">💪 Strength Progress Tracking</div>
<p style="color: #5a6573; margin-bottom: 12px;">Track your key lifts to ensure progressive overload</p>
<div id="strength-tracker"></div>
</div>
</div>
<!-- EVENING SECTION -->
<div class="section" id="evening" style="display: none;">
<div class="card">
<div class="card-header">
<span>🌙 Evening Routine</span>
<span class="badge badge-warning" id="evening-badge">0/11</span>
</div>
<div id="evening-items"></div>
</div>
<div class="card" id="sleep-protocol-card" style="display: none;">
<div class="card-header">⚠️ Sleep Protocol (Pattern C)</div>
<div class="alert alert-danger">
<strong>NON-NEGOTIABLE:</strong> Lights out at 9pm. Room temp 65-68°F. No screens after 9pm.
    </div>
<div style="font-size: 13px; line-height: 1.6; color: #5a6573; margin-top: 12px;">
      Your pattern indicates severe cortisol dysregulation. Sleep protocol is CRITICAL for recovery.
    </div>
</div>
</div>
<!-- SHOPPING SECTION -->
<div class="section" id="shopping">
<div class="card">
<div class="card-header">
<span>🛒 Weekly Shopping List</span>
<span class="badge badge-warning" id="shopping-badge">0/39</span>
</div>
<!-- SMART SHOPPING RECOMMENDATIONS -->
<div id="store-recommendations" style="margin-bottom: 16px;"></div>
<!-- SHOPPING LIST CONTROLS -->
<div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
<button onclick="toggleGroupByStore()" style="flex: 1; min-width: 150px; padding: 10px; background: #0a7d5a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
<span id="group-toggle-text">📋 Group by Category</span>
</button>
<button onclick="toggleShowPrices()" style="flex: 1; min-width: 150px; padding: 10px; background: #0a7d5a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
<span id="price-toggle-text">💰 Show Prices</span>
</button>
</div>
<!-- TOTAL SUMMARY -->
<div style="text-align: center; padding: 16px; background: var(--accent-gradient); border-radius: 12px; margin-bottom: 16px; color: white; box-shadow: 0 4px 12px rgba(10, 125, 90, 0.3);">
<div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Total Weekly Cost</div>
<div style="font-size: 32px; font-weight: 700;"><span id="total-selected-cost">$0</span></div>
<div style="font-size: 13px; opacity: 0.9; margin-top: 4px;"><span id="total-selected-items">0</span> items</div>
</div>
<!-- v1.4.2: Pantry banner — shows count + savings when user has marked
         items "on hand". Reset button clears all pantry markers. Hidden
         by default; populated by renderShopping(). -->
<div id="shopping-pantry-banner" style="display:none;align-items:center;gap:12px;padding:10px 14px;background:var(--accent-soft);border:1px solid var(--accent-primary);border-radius:8px;margin-bottom:14px;"></div>
<!-- UNIFIED SHOPPING LIST -->
<div id="unified-shopping-list"></div>
</div>
</div>
<!-- RECIPES SECTION -->
<!-- PLAN SECTION -->
<div class="section active" id="plan">
<!-- ═══════════════════════════════════════════════════════════════════
       v1.5 Plan tab restructure (UX audit pass)
       
       Before: 4 stacked banners + rings + weight + day-strip + cost row
       all sat ABOVE today's meals → primary "what do I eat?" answer was
       3 scrolls below the fold.
       
       After: morning strip (streak + next-log) → single rotating banner
       → rings → weight → MEALS (promoted) → day strip (demoted) → cost.
       ═══════════════════════════════════════════════════════════════════ -->
<!-- v1.5.2 Issue #5: Morning strip REMOVED.
       Per the app's stated Morning Routine, weighing — not eating — is the
       first daily action. The strip was prompting "Log breakfast" which
       contradicted that flow, and it duplicated the green weight chip
       below. Weight chip is now the canonical morning CTA and has been
       promoted up to the top of Plan, directly under the banner slot.
       Streak surface (the secondary value the strip provided) now lives
       inside the chip's logged state.
       
       The plan-morning-strip element is preserved as display:none so any
       latent code path that targets it doesn't error. -->
<div id="plan-morning-strip" style="display:none;"></div>
<!-- ─── Single rotating banner — picks ONE priority message to surface ──
       Replaces the previous 4-banner stack (baseline / trial / weekly
       adjustment / recovery cross-link). Priority cascade in
       renderTopBanner() picks the highest-priority eligible message.
       Apple/Whoop convention: never stack banners. -->
<div class="card" id="plan-top-banner" style="display:none;margin-bottom:12px;padding:0;">
<!-- Populated by renderTopBanner() -->
</div>
<!-- ─── Legacy banner divs — kept for any old code path that targets
       them by ID, but they're moved out of the visual flow and stay
       hidden. renderTopBanner() now owns the priority decision. -->
<div id="baseline-banner" style="display:none;"></div>
<div id="trial-banner" style="display:none;"></div>
<div id="weekly-adjustment-card" style="display:none;">
<div id="weekly-adjustment-label"></div>
<div id="weekly-adjustment-headline"></div>
<div id="weekly-adjustment-detail"></div>
</div>
<div id="recovery-cross-link-banner" style="display:none;">
<div id="recovery-banner-icon"></div>
<div id="recovery-banner-text"></div>
</div>
<!-- ─── v1.5.2 Issue #5: Weight chip PROMOTED to top of Plan.
       Per the user's Morning Routine: weigh-in is the first daily action.
       Putting the chip above the rings makes that flow explicit — open the
       app, log your weight, then see today's progress. State A (unweighed)
       → green prominent CTA with streak inline. State B (weighed today) →
       muted confirmation with streak chip + tap to edit. -->
<div id="plan-weight-chip" onclick="openWeightLogModal()" style="cursor:pointer;margin-bottom:12px;"></div>
<!-- ─── Activity Rings (Apple Health pattern) ────────────────────────
       Drives from calculateDailyTotals() (the diary) — single source of truth.
       Tap to expand per-macro breakdown. -->
<div class="card">
<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
<span id="plan-rings-header-label">Today's Progress</span>
<button onclick="event.stopPropagation();showMacroExplain();" style="background:var(--bg-elevated);border:1px solid var(--border-subtle);color:var(--text-secondary);font-size:11px;font-weight:600;padding:4px 10px;border-radius:14px;cursor:pointer;letter-spacing:0.04em;">
        🧠 Why?
      </button>
</div>
<div onclick="toggleMacroDetail()" style="display:flex;align-items:center;justify-content:center;padding:16px 0 8px 0;cursor:pointer;">
<div style="position:relative;width:200px;height:200px;">
<svg height="200" id="activity-rings-svg" style="transform:rotate(-90deg);" viewbox="0 0 200 200" width="200">
<circle cx="100" cy="100" fill="none" opacity="0.4" r="86" stroke="var(--border-subtle)" stroke-width="14"></circle>
<circle cx="100" cy="100" fill="none" id="ring-protein" r="86" stroke="var(--accent-primary)" stroke-dasharray="0 540" stroke-linecap="round" stroke-width="14" style="transition:stroke-dasharray 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></circle>
<circle cx="100" cy="100" fill="none" opacity="0.4" r="68" stroke="var(--border-subtle)" stroke-width="14"></circle>
<circle cx="100" cy="100" fill="none" id="ring-carbs" r="68" stroke="var(--accent-secondary)" stroke-dasharray="0 427" stroke-linecap="round" stroke-width="14" style="transition:stroke-dasharray 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></circle>
<circle cx="100" cy="100" fill="none" opacity="0.4" r="50" stroke="var(--border-subtle)" stroke-width="14"></circle>
<circle cx="100" cy="100" fill="none" id="ring-fat" r="50" stroke="#f59e0b" stroke-dasharray="0 314" stroke-linecap="round" stroke-width="14" style="transition:stroke-dasharray 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></circle>
</svg>
<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;">
<div id="rings-cal-current" style="font-size:34px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;line-height:1;">0</div>
<div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;">cal of <span id="rings-cal-target" style="font-variant-numeric:tabular-nums;">2000</span></div>
</div>
</div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px 4px 4px 4px;">
<div style="text-align:center;">
<div style="display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:500;">
<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent-primary);"></span>
          Protein
        </div>
<div style="font-size:15px;font-weight:600;color:var(--text-primary);font-variant-numeric:tabular-nums;margin-top:2px;">
<span id="protein-today">0g</span>
<span style="color:var(--text-tertiary);font-size:11px;font-weight:500;"> / <span id="rings-protein-target">0</span>g</span>
</div>
</div>
<div style="text-align:center;">
<div style="display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:500;">
<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent-secondary);"></span>
          Carbs
        </div>
<div style="font-size:15px;font-weight:600;color:var(--text-primary);font-variant-numeric:tabular-nums;margin-top:2px;">
<span id="carbs-today">0g</span>
<span style="color:var(--text-tertiary);font-size:11px;font-weight:500;"> / <span id="rings-carbs-target">0</span>g</span>
</div>
</div>
<div style="text-align:center;">
<div style="display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:500;">
<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span>
          Fat
        </div>
<div style="font-size:15px;font-weight:600;color:var(--text-primary);font-variant-numeric:tabular-nums;margin-top:2px;">
<span id="fat-today">0g</span>
<span style="color:var(--text-tertiary);font-size:11px;font-weight:500;"> / <span id="rings-fat-target">0</span>g</span>
</div>
</div>
</div>
<div id="macro-detail-expanded" style="display:none;margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle);">
<div id="macro-detail-content"></div>
</div>
<span id="calories-today" style="display:none;">0</span>
</div>
<!-- v1.5.2 Issue #5: Weight chip MOVED UP — was here, now at top of Plan
       above the banner slot. This slot intentionally left empty. -->
<!-- v1.6.0 — compact daily command surface.
       Preserves original Plan aesthetic while making the evolved product
       questions explicit: What do I do next? What do I eat next? What do I log next? -->
<div id="plan-next-steps-card" style="margin-bottom:12px;"></div>
<!-- Main weekly plan section is populated by updateMainPagePlanner()
       which renders: snapshot card → recovery banner → day selector →
       today's meal cards (with inline Recipe + Swap) -->
<div id="main-weekly-plan-section">
<!-- Populated by updateMainPagePlanner() or checkProfile() -->
</div>
<!-- v1.5.1 Issue #2: Optimal Meal Timing card removed from Plan tab.
       Reference content doesn't earn Plan-tab real estate — it lives now
       inside the recipe detail screen as "⏰ Why this meal time?" near
       where users actually need the info. The toggle helper +
       renderMealTimingGuide() data are still used; only this Plan-tab
       entry point has moved. -->
<!-- Budget Optimization Suggestions -->
<div class="card" id="budget-suggestions" style="display: none;">
<div class="card-header" style="background: #fef3c7; color: #856404;">💡 Budget Optimization</div>
<div id="swap-suggestions"></div>
</div>
</div>
<!-- PROGRESS SECTION — review destination: trends, weekly review, retrospective -->
<div class="section" id="progress">
<!-- Hero card: 30-day retrospective -->
<div class="card" onclick="openRetrospective()" style="background:linear-gradient(135deg,var(--accent-deep) 0%,var(--accent-primary) 50%,var(--accent-secondary) 100%);color:white;cursor:pointer;">
<div style="padding:22px 18px;display:flex;align-items:center;gap:14px;">
<div style="font-size:36px;line-height:1;flex-shrink:0;">🌿</div>
<div style="flex:1;min-width:0;">
<div style="font-size:11px;opacity:0.9;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:4px;">YOUR STORY</div>
<div style="font-size:18px;font-weight:700;letter-spacing:-0.01em;">30-day retrospective</div>
<div style="font-size:13px;opacity:0.92;margin-top:3px;line-height:1.4;">Tap to see your last 30 days as a story</div>
</div>
<div style="font-size:24px;opacity:0.7;flex-shrink:0;">›</div>
</div>
</div>
<!-- Weekly review entry point -->
<div class="card">
<div class="card-header">📋 Weekly review</div>
<p style="color:var(--text-secondary);font-size:13px;margin:0 0 14px 0;line-height:1.5;">
      Sunday evening reflection on the week. Auto-pops on Sunday after 5 PM, or open it anytime.
    </p>
<button class="btn" onclick="openWeeklyReviewModal()" style="width:100%;">Open this week's review</button>
</div>
<!-- Weight trend (read-only — daily logging happens on Plan tab chip) -->
<div class="card" id="progress-weight-card">
<div class="card-header">⚖️ Weight trend</div>
<div id="progress-weight-summary" style="font-size:13px;color:var(--text-secondary);"></div>
</div>
<!-- Progress photos — moved here from Health > Body in v1.3 -->
<div class="card">
<div class="card-header">📸 Progress photos</div>
<p style="color:var(--text-secondary);font-size:13px;margin:0 0 14px 0;line-height:1.5;">
      Front + side, same time of day, weekly — gives the clearest progress signal. Visible to you only.
    </p>
<button onclick="openProgressPhotoCapture()" style="width:100%;padding:14px;min-height:48px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:8px;cursor:pointer;font-weight:600;font-size:15px;margin-bottom:12px;">
      + Take a photo
    </button>
<div id="progress-photos-summary" style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;"></div>
<div id="progress-photos-empty" style="display:none;padding:20px;text-align:center;color:var(--text-tertiary);background:var(--bg-elevated);border-radius:8px;font-size:13px;">
      No photos yet. Front + side at the same time of day, weekly, gives the clearest signal.
    </div>
<div id="progress-photos-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"></div>
</div>
<!-- Recovery pattern display -->
<div class="card">
<div class="card-header">📊 Recovery pattern</div>
<div id="pattern-display"></div>
</div>
<!-- Stats summary -->
<div class="card">
<div class="card-header">📈 Tracking</div>
<div class="stat-grid">
<div class="stat-card">
<div class="stat-label">Days Active</div>
<div class="stat-value" id="days-active">0</div>
</div>
<div class="stat-card">
<div class="stat-label">Adherence</div>
<div class="stat-value" id="completion-rate">0%</div>
</div>
</div>
</div>
<!-- v1.4.1: Deep dive analytics. Single nav-level Progress destination;
       analytics is reached as a drill-down from here rather than a separate
       Settings entry or its own nav tab. -->
<div class="card" onclick="switchTab('analytics')" style="cursor:pointer;">
<div style="display:flex;align-items:center;gap:14px;padding:4px 0;">
<div style="font-size:28px;line-height:1;flex-shrink:0;">📊</div>
<div style="flex:1;min-width:0;">
<div style="font-weight:700;font-size:15px;color:var(--text-primary);">Deep dive analytics</div>
<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.4;">Charts, calorie compliance, workout volume, weekly change</div>
</div>
<div style="font-size:20px;color:var(--text-tertiary);flex-shrink:0;">›</div>
</div>
</div>
</div>
<!-- CHECK-IN SECTION (NEW) -->
<div class="section" id="checkin" style="display: none;">
<div class="card">
<div class="card-header">📋 Weekly Check-In</div>
<p style="color: #5a6573; margin-bottom: 16px;">Track your progress weekly for best results</p>
<div class="form-group">
<label>Current Weight (lbs)</label>
<input id="checkin-weight" placeholder="180" type="number"/>
<small>Weigh first thing in the morning, after bathroom</small>
</div>
<div class="form-group">
<label>Waist Measurement (inches)</label>
<input id="checkin-waist" placeholder="34" step="0.5" type="number"/>
<small>Measure at belly button level</small>
</div>
<div class="form-group">
<label>How do you feel this week?</label>
<select id="checkin-feeling">
<option>Much better</option>
<option selected="">About the same</option>
<option>Slightly worse</option>
<option>Much worse</option>
</select>
</div>
<div class="form-group">
<label>Notes (optional)</label>
<textarea id="checkin-notes" placeholder="Any observations, challenges, victories..." rows="3"></textarea>
</div>
<button class="btn" onclick="saveCheckin()">Save This Week's Check-In</button>
<div id="checkin-history" style="margin-top: 24px;"></div>
</div>
</div>
<!-- SETTINGS SECTION -->
<div class="section" id="settings" style="display: none;">
<div class="card">
<div class="card-header">⚙️ Your Profile</div>
<div id="profile-display"></div>
<button class="btn" onclick="editProfile()" style="margin-top: 20px;">Edit Profile</button>
<button class="btn btn-secondary" onclick="reassess()" style="margin-top: 10px; width: 100%;">🔄 Re-assess recovery status</button>
<div style="font-size: 12px; color: var(--text-tertiary); margin-top: 6px; line-height: 1.5;">Re-assess every 2–4 weeks to recalibrate your plan based on progress.</div>
<button class="btn" onclick="resetAllData()" style="background: #dc2626; margin-top: 16px;">Reset All Data</button>
</div>
<div class="card">
<div class="card-header">🍳 Breakfast Preferences</div>
<div style="font-size: 13px; color: #5a6573; margin-bottom: 16px;">
      Choose your preferred breakfast option. All options scale to your personal macros.
    </div>
<div id="breakfast-selector"></div>
</div>
<div class="card">
<div class="card-header">🎯 Macro Tolerance Settings</div>
<div style="font-size: 13px; color: #5a6573; margin-bottom: 16px;">
      Set acceptable ranges for your daily macros. Green = within range, Yellow = close, Red = outside range.
    </div>
<div style="display: flex; flex-direction: column; gap: 16px;">
<!-- Protein Tolerance -->
<div>
<label style="display: block; font-weight: 600; margin-bottom: 8px;">
          Protein Tolerance: ±<span id="proteinToleranceDisplay">10</span>g
        </label>
<input id="proteinTolerance" max="30" min="5" onchange="updateMacroTolerance('protein', this.value)" style="width: 100%;" type="range" value="10"/>
<div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a0ad; margin-top: 4px;">
<span>±5g (Strict)</span>
<span>±30g (Flexible)</span>
</div>
</div>
<!-- Carbs Tolerance -->
<div>
<label style="display: block; font-weight: 600; margin-bottom: 8px;">
          Carbs Tolerance: ±<span id="carbsToleranceDisplay">15</span>g
        </label>
<input id="carbsTolerance" max="50" min="10" onchange="updateMacroTolerance('carbs', this.value)" style="width: 100%;" type="range" value="15"/>
<div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a0ad; margin-top: 4px;">
<span>±10g (Strict)</span>
<span>±50g (Flexible)</span>
</div>
</div>
<!-- Fat Tolerance -->
<div>
<label style="display: block; font-weight: 600; margin-bottom: 8px;">
          Fat Tolerance: ±<span id="fatToleranceDisplay">10</span>g
        </label>
<input id="fatTolerance" max="25" min="5" onchange="updateMacroTolerance('fat', this.value)" style="width: 100%;" type="range" value="10"/>
<div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a0ad; margin-top: 4px;">
<span>±5g (Strict)</span>
<span>±25g (Flexible)</span>
</div>
</div>
<!-- Calories Tolerance -->
<div>
<label style="display: block; font-weight: 600; margin-bottom: 8px;">
          Calories Tolerance: ±<span id="caloriesToleranceDisplay">100</span> cal
        </label>
<input id="caloriesTolerance" max="300" min="50" onchange="updateMacroTolerance('calories', this.value)" step="10" style="width: 100%;" type="range" value="100"/>
<div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a0ad; margin-top: 4px;">
<span>±50 cal (Strict)</span>
<span>±300 cal (Flexible)</span>
</div>
</div>
</div>
<div style="margin-top: 16px; padding: 12px; background: #e8f5e9; border-radius: 6px; font-size: 13px; color: #2e7d32;">
      💡 Tolerances help you understand when you're close enough to your targets without being too strict.
    </div>
</div>
<div class="card">
<div class="card-header">📖 Quick Guide</div>
<div style="font-size: 13px; line-height: 1.8; color: #5a6573;">
<p style="margin-bottom: 12px;"><strong>Meal Timing:</strong> Eat within your recommended windows for optimal metabolism and recovery.</p>
<p style="margin-bottom: 12px;"><strong>Hydration:</strong> Front-load water early in the day. Taper after 7pm for better sleep.</p>
<p style="margin-bottom: 12px;"><strong>Training:</strong> Progressive overload is key. Increase weight/reps gradually.</p>
<p style="margin-bottom: 12px;"><strong>Sleep:</strong> Non-negotiable 7-9 hours. Room at 65-68°F, complete darkness.</p>
<p><strong>Re-assessment:</strong> Check recovery status every 2-4 weeks and adjust accordingly.</p>
</div>
</div>
</div>
`;

export function mountShell() {
  const app = document.getElementById('app') || document.body;
  app.innerHTML = SHELL_HTML;
}

export function mountHeader() {
  if (document.querySelector('.header')) return;
  const header = document.createElement('div');
  header.className = 'header';
  header.style.position = 'relative';
  header.innerHTML = `
<h1 id="headerTitle">Sorrel</h1>
<p id="headerSubtitle">Nutrition that adapts to you</p>
<button aria-label="Settings"
        onclick="window.openSettingsSheet && window.openSettingsSheet()"
        style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.25);border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;padding:0;">⚙️</button>
  `;
  const app = document.getElementById('app');
  if (app && app.parentNode) app.parentNode.insertBefore(header, app);
  else document.body.insertBefore(header, document.body.firstChild);
}

export function mountFab() {
  if (document.getElementById('fab')) return;
  const fab = document.createElement('button');
  fab.id = 'fab';
  fab.title = 'Quick log';
  fab.textContent = '+';
  fab.style.cssText = 'position:fixed;right:20px;bottom:80px;width:56px;height:56px;border-radius:50%;background:var(--accent-gradient);color:white;border:none;font-size:28px;cursor:pointer;box-shadow:0 4px 14px rgba(10,125,90,0.4);z-index:100;display:flex;align-items:center;justify-content:center;font-weight:300;line-height:1;';
  fab.addEventListener('click', () => {
    if (typeof window.openQuickLogSheet === 'function') window.openQuickLogSheet();
  });
  document.body.appendChild(fab);
}
