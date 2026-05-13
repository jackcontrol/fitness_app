// Banner UI helpers. Lifted from index.html:
//   updateBaselineBanner    L13064
//   updateTrialBanner       L10161
//   updateTrainRecoveryBanner L17983
//   updateIntelligenceBanners L18086 (shim)
//
// Reads window.profile + window.state (published by monolith patch IIFEs at
// L33171+). Calls trial + intensity helpers via window.Sorrel.* or window.*.

import { ensureTrialState, getTrialDaysLeft } from '../../features/trial.js';

export function updateBaselineBanner() {
  const banner = document.getElementById('baseline-banner');
  if (!banner) return;
  const profile = window.profile;
  if (!profile) {
    banner.style.display = 'none';
    return;
  }
  const state = window.state;
  const weighIns = (state && state.weightLog) ? state.weightLog.length : 0;
  if (weighIns >= 14) {
    banner.style.display = 'none';
    return;
  }
  banner.style.display = '';
  const detail = document.getElementById('baseline-banner-detail');
  if (detail) {
    if (weighIns === 0) {
      detail.textContent = 'Log your weight and meals daily — your plan starts adapting after 14 weigh-ins.';
    } else {
      detail.textContent = `${weighIns} of 14 weigh-ins logged. Your plan adapts after week 2.`;
    }
  }
}

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

export function updateTrainRecoveryBanner() {
  const banner = document.getElementById('train-recovery-banner');
  if (!banner) return;

  const rec = (typeof window.getTodaysIntensityRecommendation === 'function')
    ? window.getTodaysIntensityRecommendation()
    : null;
  const labelEl = document.getElementById('train-recovery-label');
  const recEl = document.getElementById('train-recovery-recommendation');
  const emojiEl = document.getElementById('train-recovery-emoji');

  if (rec && rec.label) {
    if (emojiEl) emojiEl.textContent = rec.emoji || '⚡';
    if (labelEl) labelEl.textContent = rec.label;
    if (recEl) recEl.textContent = rec.training || 'Tap for full recovery details.';
    banner.style.display = 'flex';
    banner.style.background = `linear-gradient(135deg, ${rec.color || '#0a7d5a'} 0%, ${rec.color || '#10b981'}dd 100%)`;
  } else {
    if (emojiEl) emojiEl.textContent = '⚡';
    if (labelEl) labelEl.textContent = 'Tap to set up recovery tracking';
    if (recEl) recEl.textContent = 'Sync HRV from Whoop / Oura, or log manually in Health → Recovery.';
    banner.style.display = 'flex';
  }
}

// v1.5 compatibility shim. Real work is in renderMorningStrip + renderTopBanner.
export function updateIntelligenceBanners() {
  if (!window.profile) return;
  if (typeof window.renderMorningStrip === 'function') window.renderMorningStrip();
  if (typeof window.renderTopBanner === 'function') window.renderTopBanner();
}
