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
