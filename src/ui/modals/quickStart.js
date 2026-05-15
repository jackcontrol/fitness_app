// Quick-start onboarding + quick-goal edit + anonymous browse.
// Lifted from monolith (Session 17). State convention matches S16 modules:
// read/write window.profile directly through the live state bridge.

import { calculateHydration } from '../../features/assessment.js';

// ─── Quick Start Modal (60-second onboarding) ─────────────────────

export function openQuickStartModal() {
  const existing = document.getElementById('quickStartModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'quickStartModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:480px;width:100%;max-height:95vh;overflow-y:auto;padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h2 style="margin:0;font-size:22px;">⚡ Quick start</h2>
        <button onclick="document.getElementById('quickStartModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>
      <p style="color:#5a6573;font-size:13px;margin:0 0 20px 0;">4 questions. You can refine details anytime later.</p>

      <div style="margin-bottom:18px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Sex (for metabolic calc)</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="qs-sex-picker">
          <button data-val="male" onclick="qsPick('sex','male')" style="padding:14px;background:white;color:#1a2332;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;font-weight:600;">♂ Male</button>
          <button data-val="female" onclick="qsPick('sex','female')" style="padding:14px;background:white;color:#1a2332;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;font-weight:600;">♀ Female</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;">
        <div>
          <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#1a2332;">Current weight (lb)</label>
          <input id="qs-weight" type="number" inputmode="numeric" placeholder="180"
                 style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;font-weight:600;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#1a2332;">Target weight (lb)</label>
          <input id="qs-target" type="number" inputmode="numeric" placeholder="170"
                 style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;font-weight:600;box-sizing:border-box;">
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Activity level</label>
        <div style="display:flex;flex-direction:column;gap:6px;" id="qs-activity-picker">
          ${[
            { val: 'sedentary',   label: 'Sedentary',          detail: 'Desk job, no regular exercise' },
            { val: 'light',       label: 'Lightly active',     detail: '1-3 workouts/week' },
            { val: 'moderate',    label: 'Moderately active',  detail: '3-5 workouts/week' },
            { val: 'high',        label: 'Very active',        detail: '6+ workouts/week or physical job' },
          ].map(a => `
            <button data-val="${a.val}" onclick="qsPick('activity','${a.val}')"
                    style="padding:12px;background:white;color:#1a2332;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;text-align:left;">
              <div style="font-weight:600;font-size:14px;">${a.label}</div>
              <div style="font-size:11px;color:#777;margin-top:2px;">${a.detail}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:22px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Pace</label>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;" id="qs-pace-picker">
          <button data-val="conservative" onclick="qsPick('pace','conservative')" style="padding:10px;background:white;color:#1a2332;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;">Conservative<br><span style="font-weight:500;font-size:10px;color:var(--text-tertiary);">~0.5 lb/wk</span></button>
          <button data-val="moderate" onclick="qsPick('pace','moderate')" style="padding:10px;background:#0a7d5a;color:white;border:2px solid #0a7d5a;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;">Moderate<br><span style="font-weight:500;font-size:10px;opacity:0.85;">~1.0 lb/wk</span></button>
          <button data-val="aggressive" onclick="qsPick('pace','aggressive')" style="padding:10px;background:white;color:#1a2332;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;">Aggressive<br><span style="font-weight:500;font-size:10px;color:var(--text-tertiary);">~1.5 lb/wk</span></button>
        </div>
      </div>

      <button onclick="commitQuickStart()"
              style="width:100%;padding:16px;background:var(--accent-gradient);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px;">
        Generate my plan →
      </button>

      <div style="text-align:center;margin-top:14px;">
        <button onclick="document.getElementById('quickStartModal').remove();openProfileModal();"
                style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:12px;text-decoration:underline;">
          Or take the full 8-page assessment
        </button>
      </div>
    </div>
  `;

  modal.dataset.sex = '';
  modal.dataset.activity = '';
  modal.dataset.pace = 'moderate';

  document.body.appendChild(modal);
  setTimeout(() => { const el = document.getElementById('qs-weight'); if (el) el.focus(); }, 50);
}

export function qsPick(field, val) {
  const modal = document.getElementById('quickStartModal');
  if (!modal) return;
  modal.dataset[field] = val;
  const picker = document.getElementById('qs-' + field + '-picker');
  if (!picker) return;
  picker.querySelectorAll('button').forEach(btn => {
    const isSelected = btn.dataset.val === val;
    btn.style.background = isSelected ? '#0a7d5a' : 'white';
    btn.style.color = isSelected ? 'white' : '#333';
    btn.style.borderColor = isSelected ? '#0a7d5a' : '#e0e0e0';
    if (isSelected) {
      btn.querySelectorAll('span').forEach(s => { s.style.color = ''; s.style.opacity = '0.85'; });
    } else {
      btn.querySelectorAll('span').forEach(s => { s.style.color = '#888'; s.style.opacity = '1'; });
    }
  });
}

export function commitQuickStart() {
  const modal = document.getElementById('quickStartModal');
  if (!modal) return;

  const sex = modal.dataset.sex;
  const activity = modal.dataset.activity;
  const pace = modal.dataset.pace || 'moderate';
  const weight = parseFloat(document.getElementById('qs-weight').value);
  const targetWeight = parseFloat(document.getElementById('qs-target').value);

  if (!sex) { alert('Please pick your sex (used for metabolic calculation)'); return; }
  if (isNaN(weight) || weight < 80 || weight > 600) { alert('Enter a valid current weight (80-600 lb)'); return; }
  if (isNaN(targetWeight) || targetWeight < 80 || targetWeight > 600) { alert('Enter a valid target weight (80-600 lb)'); return; }
  if (!activity) { alert('Please pick your activity level'); return; }

  const activityMultiplier = { sedentary: 1.3, light: 1.45, moderate: 1.6, high: 1.8 }[activity] || 1.5;
  const baseBMR = sex === 'male' ? weight * 12 : weight * 10.5;
  const maintenanceCal = Math.round(baseBMR * activityMultiplier);

  const direction = targetWeight < weight ? 'loss' : (targetWeight > weight ? 'gain' : 'maintain');
  let weeklyRate = 0;
  if (direction !== 'maintain') {
    if (pace === 'conservative') weeklyRate = direction === 'loss' ? -0.5 : 0.5;
    else if (pace === 'aggressive') weeklyRate = direction === 'loss' ? -1.5 : 1.5;
    else weeklyRate = direction === 'loss' ? -1.0 : 1.0;
  }
  const targetCal = Math.round(maintenanceCal + (weeklyRate * 500));

  const protein = Math.round(weight * 1.0);
  const proteinCal = protein * 4;
  const remainingCal = Math.max(0, targetCal - proteinCal);
  const carbs = Math.round((remainingCal * 0.55) / 4);
  const fat = Math.round((remainingCal * 0.45) / 9);

  const newProfile = {
    name: 'You',
    sex: sex,
    gender: sex,
    weight: weight,
    targetWeight: targetWeight,
    age: 35,
    heightFeet: sex === 'male' ? 5 : 5,
    heightInches: sex === 'male' ? 10 : 5,
    bodyFat: sex === 'male' ? 20 : 28,
    goal: direction === 'maintain' ? 'maintain' : (pace + '_' + (direction === 'loss' ? 'fatloss' : 'gain')),
    timeline: '12_weeks',
    hormonalHealth: 'good',
    metabolicStatus: 'adapted',
    sleepQuality: '7-8',
    stressLevel: 'moderate',
    recoveryCapacity: 'good',
    injuries: 'none',
    experience: 'intermediate',
    trainingDays: { sedentary: '0-1', light: '2-3', moderate: '3-4', high: '5-6' }[activity] || '3-4',
    trainingPreference: 'gym',
    currentCalories: maintenanceCal,
    occupationType: activity === 'high' ? 'active' : 'sedentary',
    currentSteps: { sedentary: 4000, light: 6000, moderate: 8000, high: 10000 }[activity] || 6000,
    dietHistory: 'occasional',
    foodRelationship: 'healthy',
    mealsPerDay: 3,
    mealTypes: 'breakfast_lunch_dinner',
    cookingTime: '30-45',
    cookingSkill: 'intermediate',
    kitchenEquipment: 'full',
    diet: 'standard',
    allergens: [],
    cuisinePreferences: ['american', 'italian', 'mexican', 'asian'],
    weeklyBudget: 0,
    targetCalories: targetCal,
    maintenanceCalories: maintenanceCal,
    protein: protein,
    carbs: carbs,
    fat: fat,
    waterOz: Math.round(weight * 0.5),
    onboardingType: 'quick',
  };

  window.profile = newProfile;

  try {
    if (typeof window.generateOptimalWeek === 'function') {
      const generatedPlan = window.generateOptimalWeek(newProfile);
      newProfile.weekPlan = generatedPlan.weekPlan;
      newProfile.weeklyBudget = generatedPlan.totalWeekCost || 0;
    }
  } catch (e) {
    console.warn('Plan generation failed, using empty plan:', e);
    newProfile.weekPlan = [];
  }

  localStorage.setItem('user-profile', JSON.stringify(newProfile));
  if (typeof window.saveState === 'function') window.saveState();

  modal.remove();

  if (typeof window.updateHeaderWithProfile === 'function') window.updateHeaderWithProfile();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.renderHydrationSchedule === 'function' && newProfile.waterOz) window.renderHydrationSchedule();

  if (typeof window.showLogToast === 'function') window.showLogToast('Plan ready — start logging anytime');
}

// ─── Anonymous browse ─────────────────────────────────────────────

export function browseAnonymously() {
  const guestWeight = 170;
  const newProfile = {
    name: 'Guest',
    weight: guestWeight,
    targetWeight: guestWeight,
    targetCalories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    waterOz: calculateHydration(guestWeight, 'sedentary', 'healthy'),
    weekPlan: [],
    cuisinePreferences: ['american', 'italian', 'asian', 'mexican'],
    weeklyBudget: 100,
    timeAvailable: 'moderate',
    onboardingType: 'browse',
    goal: 'maintain',
  };
  window.profile = newProfile;

  try {
    if (typeof window.generateOptimalWeek === 'function') {
      const generated = window.generateOptimalWeek(newProfile);
      if (Array.isArray(generated) && generated.length > 0) {
        newProfile.weekPlan = generated;
      }
    }
  } catch (e) {
    console.warn('Guest plan generation failed; continuing with empty plan:', e);
  }
  localStorage.setItem('user-profile', JSON.stringify(newProfile));
  if (typeof window.updateHeaderWithProfile === 'function') window.updateHeaderWithProfile();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.showLogToast === 'function') window.showLogToast('Look around. Tap your profile to set up properly anytime.');
}

// ─── Quick Goal Modal (edit target weight + pace) ─────────────────

export function openQuickGoalModal() {
  const profile = window.profile;
  if (!profile) return;

  const getTrendWeight = window.getTrendWeight;
  const currentWeight = (typeof getTrendWeight === 'function' && getTrendWeight()) || profile.weight || 180;
  const targetWeight = profile.targetWeight || currentWeight - 10;

  let currentPace = 'moderate';
  const g = (profile.goal || '').toLowerCase();
  if (g.includes('aggressive')) currentPace = 'aggressive';
  else if (g.includes('conservative') || g.includes('slow')) currentPace = 'conservative';
  else if (g.includes('maintain')) currentPace = 'maintain';

  const modal = document.createElement('div');
  modal.id = 'quickGoalModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;font-size:22px;">🎯 Set Your Goal</h2>
        <button onclick="document.getElementById('quickGoalModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>

      <p style="color:#5a6573;font-size:13px;margin:0 0 20px 0;line-height:1.5;">
        Your plan will auto-adjust calories as you get closer to your target, based on your actual weight trend.
      </p>

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Current weight</label>
        <div style="padding:12px;background:#f4f1ec;border-radius:8px;font-size:16px;font-weight:600;color:#1a2332;">
          ${currentWeight} lb
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Target weight (lb)</label>
        <input id="quickGoalTargetWeight" type="number" step="0.5" value="${targetWeight}"
               style="width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:16px;box-sizing:border-box;">
      </div>

      <div style="margin-bottom:24px;">
        <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Pace</label>
        <div id="quickGoalPaceGroup" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${[
            { id: 'conservative', label: 'Conservative', detail: '~0.5 lb/wk' },
            { id: 'moderate', label: 'Moderate', detail: '~1.0 lb/wk' },
            { id: 'aggressive', label: 'Aggressive', detail: '~1.5 lb/wk' },
            { id: 'maintain', label: 'Maintain', detail: 'no change' },
          ].map(p => `
            <button onclick="selectQuickGoalPace('${p.id}')" data-pace="${p.id}"
                    style="padding:12px;background:${p.id === currentPace ? '#0a7d5a' : 'white'};color:${p.id === currentPace ? 'white' : '#333'};border:2px solid ${p.id === currentPace ? '#0a7d5a' : '#e0e0e0'};border-radius:8px;cursor:pointer;font-weight:600;text-align:left;">
              <div style="font-size:14px;">${p.label}</div>
              <div style="font-size:11px;opacity:0.8;margin-top:2px;">${p.detail}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display:flex;gap:8px;">
        <button onclick="document.getElementById('quickGoalModal').remove()"
                style="flex:1;padding:12px;background:#f4f1ec;color:#5a6573;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
          Cancel
        </button>
        <button onclick="saveQuickGoal()"
                style="flex:2;padding:12px;background:#0a7d5a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
          Save Goal
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

export function selectQuickGoalPace(paceId) {
  const buttons = document.querySelectorAll('#quickGoalPaceGroup button');
  buttons.forEach(btn => {
    const isSelected = btn.dataset.pace === paceId;
    btn.style.background = isSelected ? '#0a7d5a' : 'white';
    btn.style.color = isSelected ? 'white' : '#333';
    btn.style.borderColor = isSelected ? '#0a7d5a' : '#e0e0e0';
  });
}

export function saveQuickGoal() {
  const profile = window.profile;
  if (!profile) return;

  const targetWeight = parseFloat(document.getElementById('quickGoalTargetWeight').value);
  if (isNaN(targetWeight) || targetWeight < 50 || targetWeight > 700) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Target weight must be 50-700 lb');
    else alert('Target weight must be 50-700 lb');
    return;
  }

  const paceButtons = document.querySelectorAll('#quickGoalPaceGroup button');
  let selectedPace = 'moderate';
  paceButtons.forEach(btn => {
    if (btn.style.background.includes('102') || btn.style.background === '#0a7d5a' || btn.style.background === 'rgb(102, 126, 234)') {
      selectedPace = btn.dataset.pace;
    }
  });

  const getTrendWeight = window.getTrendWeight;
  const currentWeight = (typeof getTrendWeight === 'function' && getTrendWeight()) || profile.weight;
  const direction = targetWeight > currentWeight ? 'gain' : targetWeight < currentWeight ? 'loss' : 'maintain';

  let newGoal;
  if (selectedPace === 'maintain' || direction === 'maintain') {
    newGoal = 'maintain';
  } else if (direction === 'gain') {
    newGoal = selectedPace + '_gain';
  } else {
    newGoal = selectedPace + '_loss';
  }

  let weeklyRate = 0;
  if (selectedPace === 'aggressive') weeklyRate = direction === 'loss' ? -1.5 : 1.5;
  else if (selectedPace === 'moderate') weeklyRate = direction === 'loss' ? -1.0 : 1.0;
  else if (selectedPace === 'conservative') weeklyRate = direction === 'loss' ? -0.5 : 0.5;

  profile.targetWeight = targetWeight;
  profile.goal = newGoal;

  const maintenance = (profile.maintenanceCalories || Math.round((profile.weight || currentWeight) * 15));
  if (!profile.maintenanceCalories) {
    profile.maintenanceCalories = maintenance;
  }

  const newTargetCal = Math.round(maintenance + (weeklyRate * 500));
  const oldCal = profile.targetCalories;
  profile.targetCalories = newTargetCal;

  const newProtein = Math.round((profile.weight || currentWeight) * 1.0);
  profile.protein = newProtein;
  const proteinCal = newProtein * 4;

  const remainingCal = newTargetCal - proteinCal;
  profile.carbs = Math.round((remainingCal * 0.55) / 4);
  profile.fat = Math.round((remainingCal * 0.45) / 9);

  if (typeof window.ensureAdaptiveState === 'function') window.ensureAdaptiveState();
  const state = window.state;
  if (state) {
    if (!Array.isArray(state.macroAdjustments)) state.macroAdjustments = [];
    const today = (typeof window.todayISO === 'function') ? window.todayISO() : new Date().toISOString().slice(0, 10);
    state.macroAdjustments.push({
      date: today,
      oldCal: oldCal || newTargetCal,
      newCal: newTargetCal,
      oldP: newProtein, newP: newProtein,
      oldC: profile.carbs, newC: profile.carbs,
      oldF: profile.fat, newF: profile.fat,
      weeklyChange: 0,
      expectedRate: weeklyRate,
      reason: `Goal updated: target ${targetWeight} lb, ${selectedPace} pace (${weeklyRate > 0 ? '+' : ''}${weeklyRate} lb/wk). Calories set to ${newTargetCal}.`,
    });
    state.lastRecalibration = today;
  }

  try { localStorage.setItem('user-profile', JSON.stringify(profile)); } catch (e) {}
  if (typeof window.saveState === 'function') window.saveState();

  const modal = document.getElementById('quickGoalModal');
  if (modal) modal.remove();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.updateMacroSummary === 'function') {
    try { window.updateMacroSummary(); } catch (e) {}
  }

  console.log('🎯 Goal updated:', { targetWeight, goal: newGoal, targetCalories: newTargetCal });
}

// Mount stub — quick-start/quick-goal modals are inline-created on demand,
// no template injection needed. Profile-modal "Or take full assessment"
// fallback resolves via window.openProfileModal shim wired in main.js.
export function mount() {}
