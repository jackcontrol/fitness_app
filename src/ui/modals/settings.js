// Settings sheet — bottom-sheet UI for non-daily management surfaces.
// Lifted from monolith S19 L19414 (openSettingsSheet) trimmed to v1.4.1
// item set: Profile only. Routes to existing window.openProfileEdit
// (full assessment) — openProfileRows + openProfileFieldEdit deep tail
// deferred (would need ~400 LOC of inline-edit cluster lifts).

const VERSION = 'v1.5.3';

const ITEMS = [
  { id: 'profile', emoji: '👤', label: 'Profile & Goals', detail: 'Edit your targets and info', type: 'profile' },
];

export function openSettingsSheet() {
  const existing = document.getElementById('settingsSheet');
  if (existing) existing.remove();

  const sheet = document.createElement('div');
  sheet.id = 'settingsSheet';
  sheet.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;';

  sheet.innerHTML = `
    <div style="background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-width:600px;padding:20px 20px 32px;max-height:80vh;overflow-y:auto;box-shadow:0 -4px 20px rgba(0,0,0,0.1);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <h2 style="margin:0;font-size:20px;color:var(--text-primary);">⚙️ Settings &amp; More</h2>
        <button onclick="document.getElementById('settingsSheet').remove()"
                style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-tertiary);padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        ${ITEMS.map(item => `
          <button onclick="navigateFromSettingsSheet('${item.id}','${item.type}')"
                  style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;text-align:left;color:var(--text-primary);">
            <div style="font-size:24px;line-height:1;">${item.emoji}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:15px;color:var(--text-primary);">${item.label}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${item.detail}</div>
            </div>
            <div style="color:var(--text-tertiary);font-size:18px;">›</div>
          </button>
        `).join('')}
      </div>

      <div style="margin-top:18px;padding:18px 16px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:12px;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
          <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#064e3b 0%,#0a7d5a 50%,#10b981 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;">
            <div style="width:3px;height:18px;background:#faf8f3;border-radius:1.5px;"></div>
            <div style="width:6px;height:6px;background:#faf8f3;border-radius:50%;position:absolute;bottom:11px;left:21px;"></div>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:17px;color:var(--text-primary);letter-spacing:-0.01em;">Sorrel</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:1px;">Nutrition that adapts to you</div>
          </div>
          <div style="font-size:11px;color:var(--text-tertiary);">${VERSION}</div>
        </div>
        <div style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:14px;">Made with care · Build ${VERSION}-sorrel</div>
      </div>
    </div>
  `;

  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.remove(); });
  document.body.appendChild(sheet);
}

export function navigateFromSettingsSheet(id, type) {
  const sheet = document.getElementById('settingsSheet');
  if (sheet) sheet.remove();
  setTimeout(() => {
    if (type === 'profile') {
      if (typeof window.openProfileRows === 'function') window.openProfileRows();
      else if (typeof window.openProfileEdit === 'function') window.openProfileEdit();
      else if (typeof window.openProfileModal === 'function') window.openProfileModal();
    } else if (typeof window.switchTab === 'function') {
      window.switchTab(id);
    }
  }, 50);
}
