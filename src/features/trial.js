// Trial state — 90-day free trial gating for adaptive features.
// Lifted from index.html L10013-10063.
//
// Storage key: 'sorrel-trial' (independent of tracker-state).
// Shape: { startedAt, dismissedExpiryModal, isPro, plan? }
//
// showPaywallModal stays in monolith until slice 7B; checkTrialExpiry calls
// it via window.* so the circular dep resolves at runtime.

const TRIAL_KEY = 'sorrel-trial';
export const TRIAL_DAYS = 90;

export function ensureTrialState() {
  let trial;
  try {
    const stored = localStorage.getItem(TRIAL_KEY);
    trial = stored ? JSON.parse(stored) : null;
  } catch (e) { trial = null; }

  if (!trial) {
    trial = {
      startedAt: Date.now(),
      dismissedExpiryModal: false,
      isPro: false,
    };
    try { localStorage.setItem(TRIAL_KEY, JSON.stringify(trial)); } catch (e) {}
  }
  return trial;
}

export function getTrialDaysLeft() {
  const trial = ensureTrialState();
  if (trial.isPro) return Infinity;
  const elapsed = (Date.now() - trial.startedAt) / 86400000;
  return Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
}

export function isAdaptiveUnlocked() {
  const trial = ensureTrialState();
  if (trial.isPro) return true;
  return getTrialDaysLeft() > 0;
}

export function saveTrialState(trial) {
  try { localStorage.setItem(TRIAL_KEY, JSON.stringify(trial)); } catch (e) {}
}

export function checkTrialExpiry() {
  const trial = ensureTrialState();
  if (trial.isPro) return;
  const daysLeft = getTrialDaysLeft();
  if (daysLeft > 0) return;

  if (!trial.dismissedExpiryModal) {
    if (typeof window.showPaywallModal === 'function') {
      window.showPaywallModal({ expired: true });
    }
    trial.dismissedExpiryModal = true;
    saveTrialState(trial);
  }
}

// Subscription stub — will integrate with App Store IAP / Stripe in v2.
export function subscribePro(plan) {
  alert('Sorrel Pro subscription via the App Store launches with v1.0 release. For now, subscribing simulates the upgrade for testing.');
  const trial = ensureTrialState();
  trial.isPro = true;
  trial.plan = plan;
  saveTrialState(trial);
  const modal = document.getElementById('paywallModal');
  if (modal) modal.remove();
  if (typeof window.updateTrialBanner === 'function') window.updateTrialBanner();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
}

// Persistent trial banner on Plan tab. During trial: subtle "X days left"
// (only surfaces in the last 14 days). After expiry: prominent CTA.
export function updateTrialBanner() {
  const banner = document.getElementById('trial-banner');
  if (!banner) return;

  const trial = ensureTrialState();
  if (trial.isPro) {
    banner.style.display = 'none';
    return;
  }

  const daysLeft = getTrialDaysLeft();

  if (daysLeft > 0) {
    if (daysLeft > 14) {
      banner.style.display = 'none';
      return;
    }
    banner.style.display = '';
    banner.innerHTML = `
      <div onclick="showPaywallModal()" style="cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(135deg,var(--accent-soft) 0%,var(--bg-card) 100%);border:1px solid var(--accent-primary);border-radius:10px;margin-bottom:12px;">
        <div style="font-size:20px;line-height:1;flex-shrink:0;">⏳</div>
        <div style="flex:1;min-width:0;font-size:13px;color:var(--text-primary);">
          <strong>${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left</strong> in your adaptive trial
        </div>
        <div style="font-size:12px;color:var(--accent-primary);font-weight:600;flex-shrink:0;">View plans ›</div>
      </div>
    `;
  } else {
    banner.style.display = '';
    banner.innerHTML = `
      <div onclick="showPaywallModal()" style="cursor:pointer;display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,#fef3c7 0%,#fff8e1 100%);border:1px solid #f59e0b;border-radius:10px;margin-bottom:12px;">
        <div style="font-size:22px;line-height:1;flex-shrink:0;">🔒</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;color:#5d4037;font-weight:700;">Adaptive features paused</div>
          <div style="font-size:12px;color:#856404;margin-top:2px;line-height:1.4;">Subscribe to resume your adaptive plan</div>
        </div>
        <div style="font-size:13px;color:#856404;font-weight:700;flex-shrink:0;">Plans ›</div>
      </div>
    `;
  }
}
