// Top banner — priority cascade: recovery → trial → weekly adjustment → baseline.
// Lifted from index.html L18129-18399. Reads profile/state via window.Sorrel.

import { todayISO } from '../utils/dates.js';

function getCurrentWeekKey() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function computeWeeklyAdjustment() {
  const profile = window.Sorrel.getProfile();
  if (!profile || !profile.targetCalories) return null;

  const state = window.Sorrel.loadState();
  const log = (state && state.weightLog) ? state.weightLog : [];

  if (!log || log.length < 7) {
    return {
      label: 'Building your baseline',
      headline: 'Logging this week to learn your trend',
      detail: `Sorrel adjusts macros based on your real weight pattern, not a guess. After 2 weeks of consistent weigh-ins, we'll start fine-tuning. ${log.length}/14 weigh-ins so far.`
    };
  }

  const recent = log.slice(-7).map(e => e.weight).filter(w => w > 0);
  const prior = log.slice(-14, -7).map(e => e.weight).filter(w => w > 0);
  if (recent.length < 4 || prior.length < 4) {
    return {
      label: 'Trend forming',
      headline: 'Keep logging — adjustment coming next week',
      detail: 'Need a couple more weigh-ins to compare this week to last.'
    };
  }

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const priorAvg = prior.reduce((a, b) => a + b, 0) / prior.length;
  const deltaLb = recentAvg - priorAvg;

  const goal = profile.goal || 'maintain';
  const isLossGoal = ['lose', 'lose_fat_moderate', 'moderate_fatloss', 'fat_loss'].includes(goal);
  const isGainGoal = ['gain', 'lean_gain'].includes(goal);

  let label, headline, detail;
  if (isLossGoal) {
    if (deltaLb <= -0.5) {
      label = 'On track';
      headline = `Down ${Math.abs(deltaLb).toFixed(1)}lb this week — holding the line`;
      detail = 'Your weekly avg moved in the right direction. Macros stay as-is.';
    } else if (deltaLb < 0.5) {
      label = 'Stalled';
      headline = 'Weight flat this week — small calorie nudge';
      detail = 'Trimming 100 cal/day to restart the drop. Watch for the new target on the Plan tab.';
    } else {
      label = 'Trend up';
      headline = `Up ${deltaLb.toFixed(1)}lb — pulling calories back`;
      detail = 'A week up means the deficit slipped. Lowering target by 150 cal/day.';
    }
  } else if (isGainGoal) {
    if (deltaLb >= 0.3) {
      label = 'On track';
      headline = `Up ${deltaLb.toFixed(1)}lb this week — keep building`;
      detail = 'Your weekly avg is climbing slowly. Macros stay as-is.';
    } else if (deltaLb > -0.3) {
      label = 'Stalled';
      headline = 'Weight flat this week — adding fuel';
      detail = 'Bumping target by 100 cal/day to restart the build.';
    } else {
      label = 'Trend down';
      headline = `Down ${Math.abs(deltaLb).toFixed(1)}lb — boosting intake`;
      detail = 'Adding 150 cal/day to get back to a positive balance.';
    }
  } else {
    label = 'Maintaining';
    headline = `Weight ${deltaLb >= 0 ? 'up' : 'down'} ${Math.abs(deltaLb).toFixed(1)}lb — within range`;
    detail = 'Maintenance mode. Macros stay as-is unless trend persists 2+ weeks.';
  }

  return { label, headline, detail };
}

function computeRecoverySignal() {
  const todayKey = todayISO();
  if (!todayKey) return null;

  const state = window.Sorrel.loadState();
  const sleepLog = (state && state.sleepLog) ? state.sleepLog : null;
  if (sleepLog && Array.isArray(sleepLog) && sleepLog.length > 0) {
    const latest = sleepLog[sleepLog.length - 1];
    if (latest && typeof latest.hours === 'number' && latest.hours < 6) {
      return {
        icon: '😴',
        message: `Slept ${latest.hours.toFixed(1)}h last night — focus on protein and skip the late caffeine.`
      };
    }
  }

  const exerciseLog = (state && state.exerciseLog) ? state.exerciseLog : null;
  if (exerciseLog && Array.isArray(exerciseLog) && exerciseLog.length > 0) {
    const last = exerciseLog[exerciseLog.length - 1];
    if (last && last.date === todayKey && last.intensity === 'high') {
      return {
        icon: '💪',
        message: 'Hard training session today — prioritize carbs in your next meal for recovery.'
      };
    }
  }

  return null;
}

export function renderTopBanner() {
  const slot = document.getElementById('plan-top-banner');
  const profile = window.Sorrel.getProfile();
  if (!slot || !profile) return;

  const adaptive = (typeof window.isAdaptiveUnlocked === 'function') ? window.isAdaptiveUnlocked() : true;
  const today = todayISO();

  const pickBanner = () => {
    if (adaptive) {
      const recovery = computeRecoverySignal();
      const dismissed = localStorage.getItem('recovery-banner-dismissed-' + today) === '1';
      if (recovery && !dismissed) {
        return {
          kind: 'recovery',
          icon: recovery.icon,
          text: recovery.message,
          bg: '#fff8e1',
          border: '#ffe082',
          textColor: '#5d4037',
          dismissKey: 'recovery-banner-dismissed-' + today
        };
      }
    }

    if (typeof window.getTrialBannerData === 'function') {
      try {
        const trial = window.getTrialBannerData();
        if (trial && trial.show) {
          return {
            kind: 'trial',
            icon: '✨',
            text: trial.message || 'Trial ending soon — go Pro to keep adaptive features.',
            bg: 'linear-gradient(135deg,var(--accent-soft) 0%,var(--bg-card) 80%)',
            border: 'var(--accent-primary)',
            textColor: 'var(--text-primary)',
            actionLabel: 'See Pro',
            action: "switchTab('progress')"
          };
        }
      } catch (e) {}
    }

    if (adaptive) {
      const adj = computeWeeklyAdjustment();
      const weekKey = getCurrentWeekKey();
      const dismissed = localStorage.getItem('weekly-adjustment-dismissed') === weekKey;
      if (adj && !dismissed) {
        return {
          kind: 'weekly',
          icon: '🧠',
          label: adj.label,
          text: adj.headline,
          subtext: adj.detail,
          bg: 'linear-gradient(135deg,var(--accent-soft) 0%,var(--bg-card) 70%)',
          border: 'var(--accent-primary)',
          textColor: 'var(--text-primary)',
          dismissKey: 'weekly-adjustment-dismissed',
          dismissValue: weekKey
        };
      }
    }

    const state = window.Sorrel.loadState();
    const weightCount = ((state && state.weightLog) || []).length;
    const baselineDismissKey = 'baseline-banner-dismissed-' + getCurrentWeekKey();
    const baselineDismissed = localStorage.getItem(baselineDismissKey) === '1';
    if (weightCount < 14 && !baselineDismissed) {
      return {
        kind: 'baseline',
        icon: '🌱',
        label: 'Building your baseline',
        text: `Sorrel adapts to your real weight pattern. ${weightCount}/14 weigh-ins so far.`,
        bg: 'linear-gradient(135deg,var(--accent-soft) 0%,var(--bg-card) 100%)',
        border: 'var(--accent-primary)',
        textColor: 'var(--text-primary)',
        dismissKey: baselineDismissKey,
        dismissValue: '1'
      };
    }

    return null;
  };

  const banner = pickBanner();
  if (!banner) {
    slot.style.display = 'none';
    return;
  }

  const labelHtml = banner.label ? `
    <div style="font-size:11px;color:var(--accent-deep);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:3px;">${banner.label}</div>
  ` : '';

  const subtextHtml = banner.subtext ? `
    <div style="font-size:12px;color:var(--text-secondary);margin-top:5px;line-height:1.5;">${banner.subtext}</div>
  ` : '';

  const actionHtml = banner.actionLabel ? `
    <button onclick="${banner.action}" style="flex-shrink:0;padding:8px 14px;background:var(--accent-primary);color:white;border:none;border-radius:14px;cursor:pointer;font-size:12px;font-weight:700;">
      ${banner.actionLabel}
    </button>
  ` : '';

  const dismissHtml = banner.dismissKey ? `
    <button onclick="dismissTopBanner('${banner.dismissKey}', ${JSON.stringify(banner.dismissValue || '1')})" style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:18px;padding:4px 8px;flex-shrink:0;line-height:1;">✕</button>
  ` : '';

  slot.style.display = 'block';
  slot.style.background = banner.bg;
  slot.style.border = `1px solid ${banner.border}`;
  slot.innerHTML = `
    <div style="padding:13px 16px;display:flex;align-items:flex-start;gap:12px;">
      <div style="font-size:22px;line-height:1;flex-shrink:0;">${banner.icon}</div>
      <div style="flex:1;min-width:0;color:${banner.textColor};">
        ${labelHtml}
        <div style="font-size:13px;font-weight:600;line-height:1.4;">${banner.text}</div>
        ${subtextHtml}
      </div>
      ${actionHtml}
      ${dismissHtml}
    </div>
  `;
}

export function dismissTopBanner(key, value) {
  const v = (typeof value === 'string') ? value : JSON.stringify(value || '1');
  try { localStorage.setItem(key, v); } catch (e) {}

  try {
    const weekKey = getCurrentWeekKey();
    if (String(key).indexOf('baseline-banner-dismissed') === 0 || key === 'weekly-adjustment-dismissed') {
      localStorage.setItem('weekly-adjustment-dismissed', weekKey);
      localStorage.setItem('baseline-banner-dismissed-' + weekKey, '1');
    }
  } catch (e) {}

  renderTopBanner();
}

export function dismissWeeklyAdjustment() {
  localStorage.setItem('weekly-adjustment-dismissed', getCurrentWeekKey());
  const card = document.getElementById('weekly-adjustment-card');
  if (card) card.style.display = 'none';
}

export function dismissRecoveryBanner() {
  const todayKey = todayISO();
  localStorage.setItem('recovery-banner-dismissed-' + todayKey, '1');
  const banner = document.getElementById('recovery-cross-link-banner');
  if (banner) banner.style.display = 'none';
}

// Expose for inline onclick handlers in monolith HTML.
window.dismissTopBanner = dismissTopBanner;
window.dismissWeeklyAdjustment = dismissWeeklyAdjustment;
window.dismissRecoveryBanner = dismissRecoveryBanner;
