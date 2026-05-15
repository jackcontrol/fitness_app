// Weight log modal — log today's weight + show trend/weekly change + recent entries.
// Lifted from monolith (Session 18). Reads window.profile + window.state.weightLog.
// Downstream calls via window.* (ensureAdaptiveState, getTrendWeight,
// getWeeklyWeightChange, logWeight, showLogToast, updateMainPagePlanner — all
// either monolith function-decl auto-on-window or already shimmed in main.js).

export function openWeightLogModal() {
  if (typeof window.ensureAdaptiveState === 'function') window.ensureAdaptiveState();

  const profile = window.profile;
  const state = window.state || {};
  const currentWeight = profile ? profile.weight : '';
  const trendWeight = (typeof window.getTrendWeight === 'function') ? window.getTrendWeight() : null;
  const weeklyChange = (typeof window.getWeeklyWeightChange === 'function') ? window.getWeeklyWeightChange() : 0;
  const weightLog = Array.isArray(state.weightLog) ? state.weightLog : [];
  const recentEntries = weightLog.slice(-7).reverse();

  const modal = document.createElement('div');
  modal.id = 'weightLogModal';
  modal.className = 'modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="margin:0;font-size:22px;">⚖️ Log Weight</h2>
        <button onclick="document.getElementById('weightLogModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>

      <div style="background:var(--accent-gradient);color:white;padding:16px;border-radius:12px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:12px;opacity:0.9;">Trend weight</div>
            <div style="font-size:28px;font-weight:700;">${trendWeight ? trendWeight + ' lb' : '—'}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;opacity:0.9;">This week</div>
            <div style="font-size:20px;font-weight:600;">${weeklyChange === 0 ? '—' : (weeklyChange > 0 ? '+' : '') + weeklyChange + ' lb'}</div>
          </div>
        </div>
      </div>

      <label style="display:block;margin-bottom:8px;font-weight:600;font-size:14px;color:#1a2332;">Today's weight (lb)</label>
      <div style="display:flex;gap:8px;margin-bottom:20px;">
        <input id="weightInput" type="number" step="0.1" placeholder="${currentWeight || '180.0'}"
               style="flex:1;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:16px;">
        <button onclick="saveWeightFromModal()"
                style="padding:12px 20px;background:#0a7d5a;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
          Save
        </button>
      </div>

      ${recentEntries.length > 0 ? `
        <div style="margin-top:20px;">
          <div style="font-size:13px;color:#5a6573;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:10px;">Recent entries</div>
          ${recentEntries.map(e => `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
              <span style="color:#5a6573;font-size:14px;">${e.date}</span>
              <span style="font-weight:600;">${e.weight} lb</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  document.body.appendChild(modal);
  // Force layout flush before activating to enable CSS transitions.
  void modal.offsetWidth;
  modal.classList.add('active');
}

export function saveWeightFromModal() {
  const input = document.getElementById('weightInput');
  if (!input || !input.value) return;
  const w = parseFloat(input.value);
  if (isNaN(w) || w < 50 || w > 700) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Weight must be 50-700 lb');
    else alert('Weight must be 50-700 lb');
    return;
  }
  if (typeof window.logWeight === 'function') window.logWeight(w);
  const modal = document.getElementById('weightLogModal');
  if (modal) modal.remove();

  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
}

export function mount() {}
