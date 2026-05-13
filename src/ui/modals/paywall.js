// Paywall modal — lifted from index.html L10068-10143.
//
// Dynamic factory: builds DOM and appends to body on each call. No
// persistent template, no mount(). Inline onclick handlers reference
// global `subscribePro` (still in monolith) and DOM removal of
// `paywallModal` element.
//
// Depends on `getTrialDaysLeft` (window shim from src/features/trial.js).

export function showPaywallModal(opts) {
  opts = opts || {};
  const existing = document.getElementById('paywallModal');
  if (existing) existing.remove();

  const sheet = document.createElement('div');
  sheet.id = 'paywallModal';
  sheet.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  if (!opts.expired) {
    sheet.onclick = (e) => { if (e.target === sheet) sheet.remove(); };
  }

  const daysLeft = typeof window.getTrialDaysLeft === 'function' ? window.getTrialDaysLeft() : 0;

  sheet.innerHTML = `
    <div style="background:var(--bg-card);max-width:440px;width:100%;border-radius:20px;padding:30px 26px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;">
      <div style="font-size:48px;margin-bottom:8px;line-height:1;">🌿</div>

      ${opts.expired ? `
        <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:var(--text-primary);">Your 90-day trial ended</h2>
        <p style="margin:0 0 24px 0;color:var(--text-secondary);font-size:14px;line-height:1.5;">
          You've used the adaptive protocol for 90 days. Subscribe to keep your plan adapting, or continue with the generic protocol — your data stays yours either way.
        </p>
      ` : `
        <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:var(--text-primary);">Sorrel Pro</h2>
        <p style="margin:0 0 24px 0;color:var(--text-secondary);font-size:14px;line-height:1.5;">
          ${daysLeft > 0 ? `${daysLeft} days left in your free trial. ` : ''}Keep your adaptive plan, weekly retrospectives, and recovery-aware coaching.
        </p>
      `}

      <div style="text-align:left;background:var(--bg-elevated);border-radius:14px;padding:16px;margin-bottom:18px;">
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:var(--text-primary);">
          <span style="color:var(--accent-primary);font-weight:700;">✓</span>
          <span><strong>Adaptive macros</strong> — recalibrates weekly based on actual progress</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:var(--text-primary);">
          <span style="color:var(--accent-primary);font-weight:700;">✓</span>
          <span><strong>Recovery-aware coaching</strong> — protein/carbs adjust to your sleep & HRV</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:var(--text-primary);">
          <span style="color:var(--accent-primary);font-weight:700;">✓</span>
          <span><strong>30-day retrospective</strong> — beautifully animated story of your journey</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:var(--text-primary);">
          <span style="color:var(--accent-primary);font-weight:700;">✓</span>
          <span><strong>AI photo + voice logging</strong> — log meals in seconds</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;font-size:13px;color:var(--text-primary);">
          <span style="color:var(--accent-primary);font-weight:700;">✓</span>
          <span><strong>Weekly review automation</strong> — Sunday reflections that actually help</span>
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-bottom:14px;">
        <button onclick="subscribePro('annual')" style="flex:1;padding:16px 12px;background:var(--accent-gradient,var(--accent-gradient));color:white;border:none;border-radius:12px;cursor:pointer;font-weight:700;box-shadow:0 2px 8px rgba(10,125,90,0.25);">
          <div style="font-size:13px;opacity:0.9;font-weight:600;">Annual</div>
          <div style="font-size:18px;margin-top:2px;">$79.99<span style="font-size:12px;opacity:0.85;">/yr</span></div>
          <div style="font-size:11px;opacity:0.85;margin-top:2px;">Save 33%</div>
        </button>
        <button onclick="subscribePro('monthly')" style="flex:1;padding:16px 12px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:12px;cursor:pointer;font-weight:700;">
          <div style="font-size:13px;color:var(--text-tertiary);font-weight:600;">Monthly</div>
          <div style="font-size:18px;margin-top:2px;">$9.99<span style="font-size:12px;color:var(--text-tertiary);">/mo</span></div>
          <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px;">Cancel anytime</div>
        </button>
      </div>

      <button onclick="document.getElementById('paywallModal').remove();" style="background:none;border:none;color:var(--text-tertiary);font-size:13px;cursor:pointer;padding:10px;text-decoration:underline;">
        ${opts.expired ? 'Continue with generic protocol' : 'Maybe later'}
      </button>
    </div>
  `;

  document.body.appendChild(sheet);
  return sheet;
}

export function closePaywall() {
  const el = document.getElementById('paywallModal');
  if (el) el.remove();
}
