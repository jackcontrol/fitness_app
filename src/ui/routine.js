// Routine tab — circadian routine (wake/bedtime, morning/evening cards, sunlight log).
// Lifted from index.html:
//   ensureRoutineState L17728, minutesFrom L17734, formatTime12 L17743,
//   renderRoutineTab L17750, updateRoutineTime L17863,
//   renderHealthRoutineFull L18451, parseTimeForInput L18529,
//   formatTimeFromInput L18546, updateRoutineTimeFromInput L18557,
//   renderHomeRoutineCards L18572, renderHealthSunlight L28583.
//
// State reads via window.Sorrel.loadState() / getProfile().
// Mutations write through loadState()'s returned object, then saveState().
// logSunlight() click handler stays in monolith until slice 8.

import { todayISO } from '../utils/dates.js';

function ensureRoutineState() {
  const state = window.Sorrel.loadState();
  if (!state.routine) {
    state.routine = { wakeTime: '07:00', bedtime: '22:30' };
  }
  return state;
}

function minutesFrom(timeStr, deltaMin) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + deltaMin;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

function formatTime12(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + period;
}

function parseTimeForInput(timeStr) {
  if (!timeStr) return '07:00';
  if (/^\d{1,2}:\d{2}$/.test(timeStr) && !/AM|PM/i.test(timeStr)) {
    return timeStr.padStart(5, '0');
  }
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return '07:00';
  let h = parseInt(m[1]);
  const min = m[2];
  const ampm = (m[3] || '').toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return String(h).padStart(2, '0') + ':' + min;
}

function formatTimeFromInput(t24) {
  const m = t24.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return t24;
  let h = parseInt(m[1]);
  const min = m[2];
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return h + ':' + min + ' ' + ampm;
}

export function renderRoutineTab() {
  const state = ensureRoutineState();
  const container = document.getElementById('routine-content');
  if (!container) return;

  const profile = window.Sorrel.getProfile();
  const { wakeTime, bedtime } = state.routine;

  const coffeeTime = minutesFrom(wakeTime, 90);
  const dimLightsTime = minutesFrom(bedtime, -120);
  const screenOffTime = minutesFrom(bedtime, -60);
  const lastMealTime = minutesFrom(bedtime, -180);

  const morningHydrateOz = (profile && profile.waterOz)
    ? Math.round(profile.waterOz / 8)
    : 16;

  const bedHour = parseInt(bedtime.split(':')[0]);
  const wakeHour = parseInt(wakeTime.split(':')[0]);
  const bedtimeNudge = (bedHour < 21 || bedHour > 23)
    ? '💡 Most adults thrive with 10-11 PM bedtime. Consistency matters more than exact time.' : null;
  const wakeNudge = (wakeHour < 5 || wakeHour > 8)
    ? '💡 Most adults thrive with 6-8 AM wake. Adjust to your schedule but keep it consistent.' : null;

  container.innerHTML = `
    <div class="card">
      <div class="card-header">⏰ Set Your Schedule</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div>
          <label style="font-size:12px;color:#5a6573;display:block;margin-bottom:4px;">Wake time</label>
          <input type="time" value="${wakeTime}" onchange="updateRoutineTime('wakeTime', this.value)"
                 style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:15px;">
        </div>
        <div>
          <label style="font-size:12px;color:#5a6573;display:block;margin-bottom:4px;">Bedtime</label>
          <input type="time" value="${bedtime}" onchange="updateRoutineTime('bedtime', this.value)"
                 style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:15px;">
        </div>
      </div>
      ${bedtimeNudge ? `<div style="margin-top:10px;padding:10px;background:#fff8e1;border-radius:6px;font-size:12px;color:#e65100;">${bedtimeNudge}</div>` : ''}
      ${wakeNudge ? `<div style="margin-top:10px;padding:10px;background:#fff8e1;border-radius:6px;font-size:12px;color:#e65100;">${wakeNudge}</div>` : ''}
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-header">🌅 Optimal Morning Routine</div>
      <div style="padding:12px;background:#fff8e1;border-left:4px solid #ffa726;border-radius:6px;margin-bottom:12px;font-size:13px;line-height:1.5;">
        <strong>The first 60 minutes set the next 16 hours.</strong> The cortisol awakening response is a single 30-minute neural event that anchors alertness, immune function, and tonight's melatonin release. Five common habits each disrupt one mechanism in this window.
      </div>
      ${[
        { time: wakeTime, activity: '⏰ Wake — sit up immediately', detail: 'Reclining keeps the brainstem in sleep-adjacent arousal. Sitting forward raises locus coeruleus alertness output.', locked: true, key: true },
        { time: minutesFrom(wakeTime, 2), activity: '📵 Phone stays in another room', detail: 'Morning dopamine is at its lowest baseline of the day. Scrolling spends peak dopamine on micro-rewards before any real task.', key: true },
        { time: minutesFrom(wakeTime, 5), activity: `💧 Hydrate (${morningHydrateOz} oz water)`, detail: 'Replace overnight fluid loss before any caffeine.' },
        { time: minutesFrom(wakeTime, 10), activity: '☀️ 20 min outside — direct sunlight, no window, no sunglasses', detail: 'Light has to hit melanopsin cells for the suprachiasmatic nucleus to fire cortisol. Through glass needs 50× longer. A phone screen is hundreds of times too dim.', key: true },
        { time: minutesFrom(wakeTime, 30), activity: '🚶 Walk while outside (optional)', detail: 'Light + movement amplifies the cortisol pulse. Don\'t look directly at the sun — peripheral light is what matters.' },
        { time: minutesFrom(wakeTime, 45), activity: '❄️ Cold shower (1-3 min)', detail: 'Sustains the alertness state and provides a clean dopamine bump without a crash.', key: true },
        { time: coffeeTime, activity: '☕ First coffee (delayed 90+ min)', detail: 'Adenosine is the sleep-pressure molecule that cortisol clears naturally. Coffee at minute 10 blocks adenosine receptors before clearance happens — receptors flood at hour 2-3, you crash at 11am.', key: true },
        { time: minutesFrom(wakeTime, 105), activity: '🥐 Breakfast' },
        { time: minutesFrom(wakeTime, 120), activity: '💼 Start deep work — single task only', detail: 'The prefrontal cortex boots last. Each task-switch in the boot window leaves attention residue that fragments focus all day.', key: true }
      ].map(block => `
        <div style="display:flex;flex-direction:column;gap:4px;padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="min-width:90px;font-weight:700;color:#0a7d5a;font-size:14px;">${formatTime12(block.time)}</div>
            <div style="flex:1;font-size:14px;color:#1a2332;font-weight:600;">${block.activity}</div>
            ${block.key ? '<span style="font-size:11px;color:#0a7d5a;font-weight:600;background:#e7f5ee;padding:2px 8px;border-radius:10px;">KEY</span>' : ''}
          </div>
          ${block.detail ? `<div style="font-size:12px;color:#777;margin-left:102px;line-height:1.4;">${block.detail}</div>` : ''}
        </div>
      `).join('')}
      <div style="margin-top:14px;padding:12px;background:#e8f5e9;border-left:4px solid #0a7d5a;border-radius:6px;font-size:13px;line-height:1.5;">
        <strong style="color:#0a7d5a;">Minimum effective dose:</strong> 20 minutes outside, phone in another room. That single change addresses all five mechanisms simultaneously — light fires the pulse, posture amplifies it, no caffeine yet means it cooperates, no phone protects dopamine, no notifications means no multitasking.
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-header">🌙 Optimal Evening Routine</div>
      ${[
        { time: lastMealTime, activity: '🍽️ Last meal (3hr pre-bed)', key: true },
        { time: dimLightsTime, activity: '💡 Dim lights — lamps only' },
        { time: screenOffTime, activity: '📱 Blue light off / use glasses', key: true },
        { time: minutesFrom(bedtime, -45), activity: '🛁 Hot shower or bath (10-15 min)', key: true },
        { time: minutesFrom(bedtime, -30), activity: '📖 Wind-down activity' },
        { time: minutesFrom(bedtime, -15), activity: '🌡️ Cool bedroom (65-68°F)' },
        { time: bedtime, activity: '💤 Bed', locked: true }
      ].map(block => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <div style="min-width:90px;font-weight:700;color:#10b981;font-size:14px;">${formatTime12(block.time)}</div>
          <div style="flex:1;font-size:14px;color:#1a2332;">${block.activity}</div>
          ${block.key ? '<span style="font-size:11px;color:#10b981;font-weight:600;background:#f3e5f5;padding:2px 8px;border-radius:10px;">KEY</span>' : ''}
        </div>
      `).join('')}
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-header">🔬 Science Behind the Times</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">
        <div style="padding:10px;background:#e7f5ee;border-left:3px solid #0a7d5a;border-radius:6px;margin-bottom:8px;">
          <strong>90-min coffee delay:</strong> Caffeine blocks adenosine receptors but doesn't reduce adenosine. Delaying until adenosine has cleared naturally prevents the afternoon crash.
        </div>
        <div style="padding:10px;background:#fff8e1;border-left:3px solid #ffa726;border-radius:6px;margin-bottom:8px;">
          <strong>Morning sun within 60 min:</strong> Sets suprachiasmatic nucleus (your master circadian clock), triggers a cortisol peak that lasts all day, and begins the melatonin timer for 14-16hr later.
        </div>
        <div style="padding:10px;background:#f3e5f5;border-left:3px solid #9c27b0;border-radius:6px;">
          <strong>2hr light dimming:</strong> Bright overhead light suppresses melatonin for ~90 min. Dimming well before bed lets natural sleep pressure build.
        </div>
      </div>
    </div>
  `;
}

export function updateRoutineTime(field, value) {
  const state = ensureRoutineState();
  state.routine[field] = value;
  window.Sorrel.saveState(state);
  renderRoutineTab();
  renderHomeRoutineCards();
}

export function renderHealthRoutineFull() {
  const state = ensureRoutineState();
  const profile = window.Sorrel.getProfile();
  const { wakeTime, bedtime } = state.routine;

  const morningHydrateOz = (profile && profile.waterOz) ? Math.round(profile.waterOz / 8) : 16;
  const coffeeTime = minutesFrom(wakeTime, 90);
  const dimLightsTime = minutesFrom(bedtime, -120);
  const screenOffTime = minutesFrom(bedtime, -60);
  const lastMealTime = minutesFrom(bedtime, -180);

  const stepRow = (time, activity, detail) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border-subtle);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;color:var(--text-primary);font-weight:500;">${activity}</div>
          ${detail ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.4;">${detail}</div>` : ''}
        </div>
        <div style="font-size:12px;color:var(--accent-primary);font-weight:600;font-variant-numeric:tabular-nums;flex-shrink:0;">${time}</div>
      </div>
    </div>
  `;

  const morningBody = document.getElementById('health-routine-morning-body');
  if (morningBody) {
    morningBody.innerHTML = `
      <div style="padding:0 4px;">
        ${stepRow(wakeTime, '🌅 Wake', 'Get up at the same time daily — anchors your circadian rhythm')}
        ${stepRow(minutesFrom(wakeTime, 5), `💧 Hydrate (${morningHydrateOz} oz)`, 'Replace overnight fluid loss before caffeine')}
        ${stepRow(minutesFrom(wakeTime, 15), '☀️ Light exposure', '5–10 min outdoor light or bright window — strongest non-pharmacological circadian lever')}
        ${stepRow(minutesFrom(wakeTime, 30), '🚶 Movement', '5–10 min walk, stretching, or light cardio — clears cortisol awakening response')}
        ${stepRow(coffeeTime, '☕ Coffee (if any)', '90 min after waking lets adenosine clear naturally — caffeine works better and you avoid the 2pm crash')}
        ${stepRow(minutesFrom(wakeTime, 120), '🍳 First meal', 'Protein-forward meal (30–40g) — sets satiety and stabilizes blood sugar')}
      </div>
    `;
  }

  const eveningBody = document.getElementById('health-routine-evening-body');
  if (eveningBody) {
    eveningBody.innerHTML = `
      <div style="padding:0 4px;">
        ${stepRow(lastMealTime, '🍽️ Last meal', '3 hours before bed — late meals impair sleep architecture and overnight recovery')}
        ${stepRow(minutesFrom(bedtime, -150), '🚫 Caffeine cutoff', 'No caffeine 8+ hours before bed — protects deep sleep')}
        ${stepRow(dimLightsTime, '💡 Dim lights', 'Bright overhead light suppresses melatonin for ~90 min — switch to lamps or warm bulbs')}
        ${stepRow(screenOffTime, '📵 Screens off', 'Replace with reading, gentle stretching, or conversation')}
        ${stepRow(minutesFrom(bedtime, -30), '🛁 Wind down', 'Warm shower, light reading, or breathwork — signal to your nervous system')}
        ${stepRow(bedtime, '😴 Bedtime', 'Consistent bedtime trains your sleep system — even on weekends')}
      </div>
    `;
  }

  const timesBody = document.getElementById('health-routine-times-body');
  if (timesBody) {
    timesBody.innerHTML = `
      <div style="padding:8px 4px 0 4px;">
        <p style="color:var(--text-secondary);font-size:13px;margin:0 0 14px 0;line-height:1.5;">
          Set your typical wake and bedtimes — Sorrel calculates everything else around them.
        </p>
        <div style="display:flex;gap:14px;">
          <div style="flex:1;">
            <label for="routine-wake-input" style="display:block;font-size:12px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:6px;">Wake time</label>
            <input type="time" id="routine-wake-input" value="${parseTimeForInput(wakeTime)}"
                   onchange="updateRoutineTimeFromInput('wakeTime', this.value)"
                   style="width:100%;padding:12px;font-size:16px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:8px;font-variant-numeric:tabular-nums;">
          </div>
          <div style="flex:1;">
            <label for="routine-bed-input" style="display:block;font-size:12px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:6px;">Bedtime</label>
            <input type="time" id="routine-bed-input" value="${parseTimeForInput(bedtime)}"
                   onchange="updateRoutineTimeFromInput('bedtime', this.value)"
                   style="width:100%;padding:12px;font-size:16px;background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border-subtle);border-radius:8px;font-variant-numeric:tabular-nums;">
          </div>
        </div>
      </div>
    `;
  }
}

export function updateRoutineTimeFromInput(field, t24) {
  const formatted = formatTimeFromInput(t24);
  updateRoutineTime(field, formatted);
  renderHealthRoutineFull();
}

export function renderHomeRoutineCards() {
  renderHealthRoutineFull();
}

export function renderHealthSunlight() {
  const summaryEl = document.getElementById('sunlight-week-summary');
  if (!summaryEl) return;

  const state = window.Sorrel.loadState();
  const today = todayISO();
  const todayLog = (state.sunlightLog && state.sunlightLog[today]) || {};

  const buttonsEl = document.getElementById('sunlight-log-buttons');
  if (buttonsEl) {
    const loggedStyle = 'flex:1;padding:14px;background:var(--accent-primary);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:14px;min-height:48px;';
    const openStyle = 'flex:1;padding:14px;background:var(--bg-card);color:var(--text-primary);border:1.5px solid var(--border-subtle);border-radius:10px;cursor:pointer;font-weight:700;font-size:14px;min-height:48px;';
    buttonsEl.innerHTML = `
      <button onclick="logSunlight('morning')" style="${todayLog.morning ? loggedStyle : openStyle}">
        ${todayLog.morning ? '✓ Morning sun logged' : '🌅 Log morning sun'}
      </button>
      <button onclick="logSunlight('midday')" style="${todayLog.midday ? loggedStyle : openStyle}">
        ${todayLog.midday ? '✓ Midday sun logged' : '☀️ Log midday sun'}
      </button>
    `;
  }

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const log = (state.sunlightLog && state.sunlightLog[iso]) || {};
    days.push({
      label: ['Su','M','T','W','Th','F','Sa'][d.getDay()],
      morning: !!log.morning,
      midday: !!log.midday,
      isToday: i === 0
    });
  }
  const morningHits = days.filter(d => d.morning).length;
  const dayHtml = days.map(d => {
    const outer = d.isToday
      ? 'background:var(--accent-primary);border-radius:8px;padding:5px 3px;margin:-5px -3px;color:white;'
      : '';
    const labelColor = d.isToday ? 'white' : 'var(--text-tertiary)';
    const labelWeight = d.isToday ? '700' : '400';
    const barBg = d.isToday
      ? (d.morning ? 'white' : 'rgba(255,255,255,0.38)')
      : (d.morning ? 'var(--accent-primary)' : 'var(--border-subtle)');
    return `
      <div style="flex:1;text-align:center;${outer}">
        <div style="font-size:11px;color:${labelColor};margin-bottom:4px;font-weight:${labelWeight};">${d.label}</div>
        <div style="height:32px;background:${barBg};border-radius:4px;"></div>
        ${d.isToday ? '<div style="font-size:8px;color:white;font-weight:700;letter-spacing:0.04em;line-height:1;margin-top:3px;">TODAY</div>' : ''}
      </div>`;
  }).join('');
  summaryEl.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:14px;">${dayHtml}</div>
    <div style="font-size:13px;color:var(--text-secondary);text-align:center;">
      Morning sun: <strong style="color:var(--text-primary);">${morningHits} of 7 days</strong>
    </div>
  `;
}

export function render() {
  renderHealthSunlight();
  renderHealthRoutineFull();
  renderRoutineTab();
}

// Expose mutators for inline onclick handlers in monolith HTML.
window.updateRoutineTime = updateRoutineTime;
window.updateRoutineTimeFromInput = updateRoutineTimeFromInput;
