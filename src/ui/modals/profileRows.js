// Profile rows inline-edit sheet — Apple Settings pattern.
// Lifted from monolith S19 L19520-19790. Replaces full-assessment reflow
// for single-field edits. Settings sheet routes Profile → openProfileRows.

import { appProfile } from '../../state/accessors.js';

function getProfile() {
  return appProfile() || window.profile || null;
}

export function openProfileRows() {
  const profile = getProfile();
  if (!profile) return;
  const existing = document.getElementById('profileRowsSheet');
  if (existing) existing.remove();

  const row = (label, value, editFn, isLast) => `
    <button onclick="${editFn}"
            style="display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;background:var(--bg-card);border:none;${isLast ? '' : 'border-bottom:1px solid var(--border-subtle);'}cursor:pointer;text-align:left;font-family:inherit;">
      <div style="flex:1;min-width:0;">
        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.04em;font-weight:600;margin-bottom:2px;">${label}</div>
        <div style="font-size:15px;color:var(--text-primary);font-weight:500;">${value}</div>
      </div>
      <div style="font-size:14px;color:var(--text-tertiary);">✏️</div>
    </button>
  `;

  const heightDisplay = profile.height
    ? `${Math.floor(profile.height / 12)}' ${profile.height % 12}"`
    : 'Not set';
  const goalDisplay = ({
    lose_fat: 'Lose fat',
    maintain: 'Maintain',
    gain_muscle: 'Gain muscle',
    recomp: 'Recomp',
  })[profile.goal] || profile.goal || 'Not set';
  const activityDisplay = ({
    sedentary: 'Sedentary',
    light: 'Light activity',
    moderate: 'Moderate activity',
    active: 'Active',
    very_active: 'Very active',
  })[profile.activity] || profile.activity || 'Not set';
  const genderDisplay = profile.gender
    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
    : 'Not set';

  const sheet = document.createElement('div');
  sheet.id = 'profileRowsSheet';
  sheet.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;';
  sheet.innerHTML = `
    <div style="background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-width:600px;padding:20px 0 32px 0;max-height:90vh;overflow-y:auto;box-shadow:0 -4px 20px rgba(0,0,0,0.1);">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0 20px 16px 20px;">
        <h2 style="margin:0;font-size:20px;color:var(--text-primary);">Profile &amp; Goals</h2>
        <button onclick="document.getElementById('profileRowsSheet').remove()"
                style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);padding:4px 8px;line-height:1;">✕</button>
      </div>

      <div style="background:var(--bg-card);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);">
        ${row('Name', profile.name || 'Not set', "openProfileFieldEdit('name')", false)}
        ${row('Age', profile.age ? profile.age + ' yrs' : 'Not set', "openProfileFieldEdit('age')", false)}
        ${row('Gender', genderDisplay, "openProfileFieldEdit('gender')", false)}
        ${row('Height', heightDisplay, "openProfileFieldEdit('height')", false)}
        ${row('Current weight', profile.weight ? profile.weight + ' lb' : 'Not set', "openProfileFieldEdit('weight')", true)}
      </div>

      <div style="padding:14px 20px 8px 20px;font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Goals</div>
      <div style="background:var(--bg-card);border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);">
        ${row('Goal', goalDisplay, "openProfileFieldEdit('goal')", false)}
        ${row('Activity level', activityDisplay, "openProfileFieldEdit('activity')", false)}
        ${row('Weekly budget', '$' + (profile.weeklyBudget || 0).toFixed(0), "document.getElementById('profileRowsSheet').remove(); openBudgetEditModal();", true)}
      </div>

      <div style="padding:18px 20px 0 20px;">
        <button onclick="document.getElementById('profileRowsSheet').remove(); setTimeout(window.openProfileEdit, 60);"
                style="width:100%;padding:14px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;">
          Re-take full assessment
        </button>
        <p style="font-size:11px;color:var(--text-tertiary);margin:10px 16px 0 16px;line-height:1.5;text-align:center;">
          Cuisine preferences, allergens, and the hormonal / stress / sleep assessment live in the full flow.
        </p>
      </div>
    </div>
  `;
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.remove(); });
  document.body.appendChild(sheet);
}

export function openProfileFieldEdit(field) {
  const profile = getProfile();
  if (!profile) return;
  const existing = document.getElementById('profileFieldModal');
  if (existing) existing.remove();

  const cfg = {
    name: { label: 'Name', input: `<input id="pf-input" type="text" value="${(profile.name || '').replace(/"/g, '&quot;')}" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">` },
    age: { label: 'Age', input: `<input id="pf-input" type="number" inputmode="numeric" min="13" max="120" value="${profile.age || ''}" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">` },
    weight: { label: 'Current weight (lb)', input: `<input id="pf-input" type="number" inputmode="decimal" step="0.1" min="50" max="700" value="${profile.weight || ''}" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">` },
    height: {
      label: 'Height',
      input: `
        <div style="display:flex;gap:10px;">
          <div style="flex:1;">
            <label style="display:block;font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Feet</label>
            <input id="pf-input-ft" type="number" inputmode="numeric" min="3" max="8" value="${profile.height ? Math.floor(profile.height / 12) : 5}" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">
          </div>
          <div style="flex:1;">
            <label style="display:block;font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Inches</label>
            <input id="pf-input-in" type="number" inputmode="numeric" min="0" max="11" value="${profile.height ? (profile.height % 12) : 8}" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">
          </div>
        </div>
      `,
    },
    gender: {
      label: 'Gender',
      input: `
        <select id="pf-input" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">
          <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>Male</option>
          <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>Female</option>
          <option value="other" ${profile.gender === 'other' ? 'selected' : ''}>Other</option>
        </select>
      `,
    },
    activity: {
      label: 'Activity level',
      input: `
        <select id="pf-input" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">
          <option value="sedentary" ${profile.activity === 'sedentary' ? 'selected' : ''}>Sedentary (desk job, no training)</option>
          <option value="light" ${profile.activity === 'light' ? 'selected' : ''}>Light (1-3 sessions/week)</option>
          <option value="moderate" ${profile.activity === 'moderate' ? 'selected' : ''}>Moderate (3-5 sessions/week)</option>
          <option value="active" ${profile.activity === 'active' ? 'selected' : ''}>Active (5-6 sessions/week)</option>
          <option value="very_active" ${profile.activity === 'very_active' ? 'selected' : ''}>Very active (6-7 sessions or physical job)</option>
        </select>
      `,
    },
    goal: {
      label: 'Goal',
      input: `
        <select id="pf-input" style="width:100%;padding:14px;border:2px solid var(--accent-primary);border-radius:10px;font-size:16px;color:var(--text-primary);background:var(--bg-input);">
          <option value="lose_fat" ${profile.goal === 'lose_fat' ? 'selected' : ''}>Lose fat</option>
          <option value="maintain" ${profile.goal === 'maintain' ? 'selected' : ''}>Maintain</option>
          <option value="gain_muscle" ${profile.goal === 'gain_muscle' ? 'selected' : ''}>Gain muscle</option>
          <option value="recomp" ${profile.goal === 'recomp' ? 'selected' : ''}>Recomp (lose fat + gain muscle)</option>
        </select>
      `,
    },
  };

  const c = cfg[field];
  if (!c) return;

  const modal = document.createElement('div');
  modal.id = 'profileFieldModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--bg-card);border-radius:16px;width:100%;max-width:420px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 style="margin:0;font-size:17px;color:var(--text-primary);">${c.label}</h2>
        <button onclick="document.getElementById('profileFieldModal').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);padding:4px 8px;line-height:1;">✕</button>
      </div>
      <div style="margin-bottom:18px;">${c.input}</div>
      <div style="display:flex;gap:10px;">
        <button onclick="document.getElementById('profileFieldModal').remove()"
                style="flex:1;padding:12px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;">
          Cancel
        </button>
        <button onclick="saveProfileField('${field}')"
                style="flex:1.4;padding:12px;background:var(--accent-gradient);color:white;border:none;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;">
          Save
        </button>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  setTimeout(() => {
    const inp = document.getElementById('pf-input') || document.getElementById('pf-input-ft');
    if (inp && typeof inp.focus === 'function') { inp.focus(); if (inp.select) inp.select(); }
  }, 50);
}

export function saveProfileField(field) {
  const profile = getProfile();
  if (!profile) return;

  let newValue;
  if (field === 'height') {
    const ft = parseInt(document.getElementById('pf-input-ft')?.value);
    const inch = parseInt(document.getElementById('pf-input-in')?.value);
    if (!isFinite(ft) || ft < 3 || ft > 8 || !isFinite(inch) || inch < 0 || inch > 11) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Enter valid height');
      return;
    }
    newValue = ft * 12 + inch;
  } else {
    const inp = document.getElementById('pf-input');
    if (!inp) return;
    newValue = inp.value;
    if (field === 'age' || field === 'weight') {
      newValue = parseFloat(newValue);
      if (!isFinite(newValue) || newValue <= 0) {
        if (typeof window.showLogToast === 'function') window.showLogToast('Enter a valid number');
        return;
      }
    }
    if (field === 'name' && (!newValue || !newValue.trim())) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Name cannot be empty');
      return;
    }
  }

  profile[field] = newValue;
  window.profile = profile;
  try { localStorage.setItem('user-profile', JSON.stringify(profile)); } catch (e) {}

  const m = document.getElementById('profileFieldModal');
  if (m) m.remove();
  const rows = document.getElementById('profileRowsSheet');
  if (rows) rows.remove();
  setTimeout(openProfileRows, 60);

  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.updateMacroSummary === 'function') window.updateMacroSummary();

  if (typeof window.showLogToast === 'function') window.showLogToast('Saved');
}

export function openBudgetEditModal() {
  const profile = getProfile();
  if (!profile) return;
  const existing = document.getElementById('budgetEditModal');
  if (existing) existing.remove();

  const current = profile.weeklyBudget || 0;
  const modal = document.createElement('div');
  modal.id = 'budgetEditModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;';
  modal.innerHTML = `
    <div style="background:var(--bg-card);border-radius:16px;width:100%;max-width:400px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h2 style="margin:0;font-size:18px;color:var(--text-primary);">Weekly grocery budget</h2>
        <button onclick="document.getElementById('budgetEditModal').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text-tertiary);padding:4px 8px;line-height:1;">✕</button>
      </div>
      <p style="color:var(--text-secondary);font-size:13px;margin:0 0 16px 0;line-height:1.5;">
        Sorrel filters the Shopping list to fit this budget, prioritizing essentials.
      </p>
      <label style="display:block;font-size:12px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:6px;">Amount per week</label>
      <div style="position:relative;margin-bottom:18px;">
        <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px;color:var(--text-secondary);font-weight:600;">$</span>
        <input id="budget-edit-input" type="number" inputmode="decimal" min="0" step="5" value="${current.toFixed(0)}"
               style="width:100%;padding:14px 14px 14px 32px;border:2px solid var(--accent-primary);border-radius:10px;font-size:18px;font-weight:700;color:var(--text-primary);background:var(--bg-input);font-family:inherit;">
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="document.getElementById('budgetEditModal').remove()"
                style="flex:1;padding:12px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;">
          Cancel
        </button>
        <button onclick="saveBudgetEdit()"
                style="flex:1.4;padding:12px;background:var(--accent-gradient);color:white;border:none;border-radius:10px;cursor:pointer;font-size:14px;font-weight:700;">
          Save
        </button>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  setTimeout(() => {
    const inp = document.getElementById('budget-edit-input');
    if (inp) { inp.focus(); inp.select(); }
  }, 50);
}

export function saveBudgetEdit() {
  const inp = document.getElementById('budget-edit-input');
  const profile = getProfile();
  if (!inp || !profile) return;
  const v = parseFloat(inp.value);
  if (!isFinite(v) || v < 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Enter a valid amount');
    return;
  }
  profile.weeklyBudget = v;
  window.profile = profile;
  try { localStorage.setItem('user-profile', JSON.stringify(profile)); } catch (e) {}
  const modal = document.getElementById('budgetEditModal');
  if (modal) modal.remove();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.renderDynamicShopping === 'function') {
    try { window.renderDynamicShopping(); } catch (e) {}
  }
  if (typeof window.showLogToast === 'function') window.showLogToast(`Budget set to $${v.toFixed(0)}/week`);
}
