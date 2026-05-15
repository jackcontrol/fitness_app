// Quick log sheet — bottom-sheet FAB action surface.
// Lifted from monolith S19 L11005. All sub-action openers route via
// window.* (defensive — modules may load in any order). Includes
// quickLogFood + openQuickAddCaloriesModal + selectQuickAddMeal +
// commitQuickAddCalories support fns.

import { todayISO } from '../../utils/dates.js';

export function openQuickLogSheet() {
  const existing = document.getElementById('quickLogSheet');
  if (existing) existing.remove();

  const sheet = document.createElement('div');
  sheet.id = 'quickLogSheet';
  sheet.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;';
  sheet.innerHTML = `
    <div style="background:white;border-radius:20px 20px 0 0;width:100%;max-width:600px;padding:20px 20px 32px;box-shadow:0 -4px 20px rgba(0,0,0,0.1);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;font-size:18px;color:#1a2332;">Quick log</h2>
        <button onclick="document.getElementById('quickLogSheet').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
        <button onclick="quickLogFood('breakfast')" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px 14px;background:#fff8e1;border:1px solid #ffe0b2;border-radius:12px;cursor:pointer;text-align:left;">
          <div style="font-size:28px;line-height:1;">🥐</div>
          <div style="font-weight:700;font-size:14px;color:#1a2332;">Breakfast</div>
          <div style="font-size:11px;color:#777;">Log a food</div>
        </button>
        <button onclick="quickLogFood('lunch')" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px 14px;background:#e8f5e9;border:1px solid #c8e6c9;border-radius:12px;cursor:pointer;text-align:left;">
          <div style="font-size:28px;line-height:1;">🥗</div>
          <div style="font-weight:700;font-size:14px;color:#1a2332;">Lunch</div>
          <div style="font-size:11px;color:#777;">Log a food</div>
        </button>
        <button onclick="quickLogFood('dinner')" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px 14px;background:#ffebee;border:1px solid #ffcdd2;border-radius:12px;cursor:pointer;text-align:left;">
          <div style="font-size:28px;line-height:1;">🍽️</div>
          <div style="font-weight:700;font-size:14px;color:#1a2332;">Dinner</div>
          <div style="font-size:11px;color:#777;">Log a food</div>
        </button>
        <button onclick="quickLogFood('snacks')" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:16px 14px;background:#f3e5f5;border:1px solid #e1bee7;border-radius:12px;cursor:pointer;text-align:left;">
          <div style="font-size:28px;line-height:1;">🍿</div>
          <div style="font-weight:700;font-size:14px;color:#1a2332;">Snack</div>
          <div style="font-size:11px;color:#777;">Log a food</div>
        </button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px;padding-top:14px;border-top:1px solid #f0f0f0;">
        <button onclick="document.getElementById('quickLogSheet').remove();window.openAIPhotoLog&&window.openAIPhotoLog();" style="display:flex;align-items:center;gap:10px;padding:14px;background:white;border:1px solid #e8e2d6;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#1a2332;">
          <span style="font-size:20px;">🤖</span> AI photo log
        </button>
        <button onclick="document.getElementById('quickLogSheet').remove();window.openVoiceLog&&window.openVoiceLog();" style="display:flex;align-items:center;gap:10px;padding:14px;background:white;border:1px solid #e8e2d6;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#1a2332;">
          <span style="font-size:20px;">🎤</span> Voice log
        </button>
        <button onclick="document.getElementById('quickLogSheet').remove();window.openWeightLogModal&&window.openWeightLogModal();" style="display:flex;align-items:center;gap:10px;padding:14px;background:white;border:1px solid #e8e2d6;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#1a2332;">
          <span style="font-size:20px;">⚖️</span> Log weight
        </button>
        <button onclick="document.getElementById('quickLogSheet').remove();window.logOneGlass&&window.logOneGlass();" style="display:flex;align-items:center;gap:10px;padding:14px;background:white;border:1px solid #e8e2d6;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#1a2332;">
          <span style="font-size:20px;">💧</span> Glass of water
        </button>
        <button onclick="openQuickAddCaloriesModal()" style="display:flex;align-items:center;gap:10px;padding:14px;background:white;border:1px solid #e8e2d6;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#1a2332;grid-column:1 / -1;">
          <span style="font-size:20px;">⚡</span> Quick-add calories (no food search)
        </button>
      </div>
    </div>
  `;
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.remove(); });
  document.body.appendChild(sheet);
}

export function quickLogFood(mealName) {
  const sheet = document.getElementById('quickLogSheet');
  if (sheet) sheet.remove();
  if (typeof window.openFoodSearch === 'function') window.openFoodSearch(mealName);
}

export function openQuickAddCaloriesModal() {
  const existing = document.getElementById('quickLogSheet');
  if (existing) existing.remove();
  const existing2 = document.getElementById('quickAddCaloriesModal');
  if (existing2) existing2.remove();

  const modal = document.createElement('div');
  modal.id = 'quickAddCaloriesModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:440px;width:100%;padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;font-size:20px;">⚡ Quick add</h2>
        <button onclick="document.getElementById('quickAddCaloriesModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>
      <p style="color:#5a6573;font-size:13px;margin:0 0 16px 0;">Enter calories (and optionally macros). Saves to today's snacks by default.</p>
      <div style="margin-bottom:14px;">
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#1a2332;">Calories *</label>
        <input id="qa-cal" type="number" inputmode="numeric" placeholder="450" autofocus
               style="width:100%;padding:14px;border:2px solid #0a7d5a;border-radius:8px;font-size:18px;font-weight:600;box-sizing:border-box;">
      </div>
      <details style="margin-bottom:16px;">
        <summary style="cursor:pointer;font-size:13px;color:#5a6573;font-weight:600;padding:6px 0;">+ Add macros (optional)</summary>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px;">
          <div><label style="font-size:11px;color:#5a6573;display:block;margin-bottom:3px;">Protein (g)</label>
            <input id="qa-p" type="number" inputmode="numeric" placeholder="0" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div>
          <div><label style="font-size:11px;color:#5a6573;display:block;margin-bottom:3px;">Carbs (g)</label>
            <input id="qa-c" type="number" inputmode="numeric" placeholder="0" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div>
          <div><label style="font-size:11px;color:#5a6573;display:block;margin-bottom:3px;">Fat (g)</label>
            <input id="qa-f" type="number" inputmode="numeric" placeholder="0" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"></div>
        </div>
      </details>
      <div style="margin-bottom:16px;">
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;color:#1a2332;">Add to which meal?</label>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;" id="qa-meal-picker">
          ${['breakfast','lunch','dinner','snacks'].map(m => `
            <button data-meal="${m}" onclick="selectQuickAddMeal('${m}')"
                    style="padding:10px 4px;background:${m === 'snacks' ? '#0a7d5a' : 'white'};color:${m === 'snacks' ? 'white' : '#333'};border:2px solid ${m === 'snacks' ? '#0a7d5a' : '#e0e0e0'};border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;text-transform:capitalize;">${m === 'snacks' ? 'Snack' : m}</button>
          `).join('')}
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button onclick="document.getElementById('quickAddCaloriesModal').remove()" style="flex:1;padding:14px;background:#f4f1ec;color:#5a6573;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Cancel</button>
        <button onclick="commitQuickAddCalories()" style="flex:2;padding:14px;background:#0a7d5a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.dataset.meal = 'snacks';
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  setTimeout(() => { const el = document.getElementById('qa-cal'); if (el) el.focus(); }, 50);
}

export function selectQuickAddMeal(meal) {
  const modal = document.getElementById('quickAddCaloriesModal');
  if (!modal) return;
  modal.dataset.meal = meal;
  modal.querySelectorAll('#qa-meal-picker button').forEach(btn => {
    const isSelected = btn.dataset.meal === meal;
    btn.style.background = isSelected ? '#0a7d5a' : 'white';
    btn.style.color = isSelected ? 'white' : '#333';
    btn.style.borderColor = isSelected ? '#0a7d5a' : '#e0e0e0';
  });
}

export function commitQuickAddCalories() {
  const modal = document.getElementById('quickAddCaloriesModal');
  if (!modal) return;

  const cal = parseInt(document.getElementById('qa-cal').value) || 0;
  if (cal <= 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Enter a calorie amount');
    else alert('Please enter a calorie amount');
    return;
  }

  const p = parseInt(document.getElementById('qa-p')?.value) || 0;
  const c = parseInt(document.getElementById('qa-c')?.value) || 0;
  const f = parseInt(document.getElementById('qa-f')?.value) || 0;
  const mealKey = modal.dataset.meal || 'snacks';

  const today = todayISO();
  if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(today);

  const foodDiary = window.foodDiary;
  if (!foodDiary || !foodDiary.entries[today]) { modal.remove(); return; }
  if (!foodDiary.entries[today][mealKey]) foodDiary.entries[today][mealKey] = [];

  foodDiary.entries[today][mealKey].push({
    foodId: 'quickadd_' + Date.now(),
    name: 'Quick add',
    serving: '1 entry',
    quantity: 1,
    calories: cal,
    protein: p,
    carbs: c,
    fat: f,
  });
  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  modal.remove();

  if (typeof window.renderFoodDiary === 'function') window.renderFoodDiary();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.showLogToast === 'function') window.showLogToast(`+${cal} cal added to ${mealKey === 'snacks' ? 'snack' : mealKey}`);
}
