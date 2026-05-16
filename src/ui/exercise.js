// Exercise (Train) tab — cardio + strength log, rest timer, weekly stats.
// Lifted from index.html L13767-14492 + L17983.
//
// State via window.Sorrel.training.{getExerciseLog,saveExerciseLog,ensureDateEntry}.
// Cardio/strength database from src/data/exercises.js.
// updateTrainRecoveryBanner / renderHealthRecovery / calculateDailyTotals stay
// in monolith for now (cross-tab/recovery system) — called via window.
// Modal open/close handlers deferred to slice 7.

import { cardioDatabase, strengthDatabase } from '../data/exercises.js';
import { toLocalISO, todayISO } from '../utils/dates.js';
import { formatDiaryDate } from '../features/diary.js';
import { appState } from '../state/accessors.js';
import {
  ensureRecoveryState, computeRecoveryBaseline, getRecoveryLevel,
  getTodaysIntensityRecommendation,
} from '../features/training.js';

let bysetSession = { mode: 'quick', sets: [] };
let restTimerInterval = null;
let restTimerSeconds = 0;
let lastDeletedExercise = null;

function getLog() {
  window.Sorrel.training.loadExerciseLog();
  return window.Sorrel.training.getExerciseLog();
}

function save() {
  window.Sorrel.training.saveExerciseLog();
}

function updateCardioSummary(minutes, calories) {
  const el = document.getElementById('cardio-summary');
  if (el) el.textContent = `${minutes} minutes • ${calories} calories burned`;
}

function updateStrengthSummary(sets, reps) {
  const el = document.getElementById('strength-summary');
  if (el) el.textContent = `${sets} sets • ${reps} total reps`;
}

export function renderCardioList(exercises) {
  const container = document.getElementById('cardio-exercises-list');
  if (!container) return;

  if (!exercises || exercises.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: #94a0ad;">
        <div style="font-size: 48px; margin-bottom: 12px;">🏃</div>
        <div>No cardio logged yet</div>
        <div style="font-size: 13px; margin-top: 8px;">Click above to add your first cardio session</div>
      </div>
    `;
    updateCardioSummary(0, 0);
    return;
  }

  let html = '';
  let totalMinutes = 0;
  let totalCalories = 0;

  exercises.forEach((exercise, index) => {
    totalMinutes += exercise.duration;
    totalCalories += exercise.calories;

    const cardioInfo = cardioDatabase[exercise.exerciseId];
    const icon = cardioInfo ? cardioInfo.icon : '🏃';

    html += `
      <div style="padding: 14px; background: white; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 15px; color: #1a2332; margin-bottom: 4px;">
              ${icon} ${exercise.name}
            </div>
            <div style="font-size: 13px; color: #5a6573;">
              ${exercise.duration} min • ${exercise.calories} calories burned
            </div>
            ${exercise.notes ? `<div style="font-size: 12px; color: #94a0ad; margin-top: 4px; font-style: italic;">"${exercise.notes}"</div>` : ''}
          </div>
          <button onclick="deleteCardioExercise(${index})"
                  style="background: #dc2626; color: white; border: none; padding: 10px 14px; min-height: 40px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
            Delete
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateCardioSummary(totalMinutes, totalCalories);
}

export function renderStrengthList(exercises) {
  const container = document.getElementById('strength-exercises-list');
  if (!container) return;

  if (!exercises || exercises.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; color: #94a0ad;">
        <div style="font-size: 48px; margin-bottom: 12px;">💪</div>
        <div>No strength training logged yet</div>
        <div style="font-size: 13px; margin-top: 8px;">Click above to add your first exercise</div>
      </div>
    `;
    updateStrengthSummary(0, 0);
    return;
  }

  let html = '';
  let totalSets = 0;
  let totalReps = 0;

  exercises.forEach((exercise, index) => {
    totalSets += exercise.sets;
    totalReps += exercise.sets * exercise.reps;

    const strengthInfo = strengthDatabase[exercise.exerciseId];
    const icon = strengthInfo ? strengthInfo.icon : '💪';
    const volume = exercise.sets * exercise.reps * exercise.weight;

    html += `
      <div style="padding: 14px; background: white; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 15px; color: #1a2332; margin-bottom: 4px;">
              ${icon} ${exercise.name}
            </div>
            <div style="font-size: 13px; color: #5a6573;">
              ${exercise.sets} sets × ${exercise.reps} reps @ ${exercise.weight} lbs
            </div>
            <div style="font-size: 12px; color: #0891b2; font-weight: 600; margin-top: 2px;">
              Volume: ${volume.toLocaleString()} lbs
            </div>
            ${exercise.notes ? `<div style="font-size: 12px; color: #94a0ad; margin-top: 4px; font-style: italic;">"${exercise.notes}"</div>` : ''}
          </div>
          <button onclick="deleteStrengthExercise(${index})"
                  style="background: #dc2626; color: white; border: none; padding: 10px 14px; min-height: 40px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
            Delete
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateStrengthSummary(totalSets, totalReps);
}

function calculateTotalCaloriesBurned() {
  const log = getLog();
  const dateEntry = log.entries[log.currentDate];
  if (!dateEntry) return 0;

  let total = 0;
  if (dateEntry.cardio) {
    dateEntry.cardio.forEach(ex => total += ex.calories);
  }
  if (dateEntry.strength) {
    dateEntry.strength.forEach(ex => {
      const volume = ex.sets * ex.reps * ex.weight;
      total += Math.round(volume / 100);
    });
  }
  return total;
}

export function updateExerciseSummary() {
  const log = getLog();
  const diary = window.Sorrel.diary.getDiary();
  const caloriesBurned = calculateTotalCaloriesBurned();

  let foodCalories = 0;
  if (diary.currentDate === log.currentDate && typeof window.calculateDailyTotals === 'function') {
    const totals = window.calculateDailyTotals();
    foodCalories = totals.calories;
  }

  const netCalories = foodCalories - caloriesBurned;

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('exercise-calories-burned', caloriesBurned);
  set('exercise-net-calories', Math.round(netCalories));
  set('exercise-food-cals', Math.round(foodCalories));
  set('exercise-burn-cals', caloriesBurned);
}

export function updateWeeklyStats() {
  const log = getLog();
  const today = new Date(log.currentDate + 'T00:00:00');
  let workouts = 0;
  let calories = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = toLocalISO(date);

    if (log.entries[dateStr]) {
      const entry = log.entries[dateStr];
      if ((entry.cardio && entry.cardio.length > 0) || (entry.strength && entry.strength.length > 0)) {
        workouts++;
      }
      if (entry.cardio) {
        entry.cardio.forEach(ex => calories += ex.calories);
      }
    }
  }

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('weekly-workouts', workouts);
  set('weekly-calories', calories);
}

export function renderExerciseLog() {
  const log = getLog();
  const dateEl = document.getElementById('exercise-current-date');
  if (dateEl) dateEl.textContent = formatDiaryDate(log.currentDate);

  if (typeof window.updateTrainRecoveryBanner === 'function') window.updateTrainRecoveryBanner();
  if (typeof window.renderHealthRecovery === 'function') window.renderHealthRecovery('train-recovery-content');

  let dateEntry = log.entries[log.currentDate];
  if (!dateEntry) {
    window.Sorrel.training.ensureDateEntry(log.currentDate);
    dateEntry = log.entries[log.currentDate];
  }

  renderCardioList(dateEntry.cardio);
  renderStrengthList(dateEntry.strength);
  updateExerciseSummary();
  updateWeeklyStats();
}

export function updateCardioCalories() {
  const exerciseId = document.getElementById('cardio-exercise-selector').value;
  const duration = parseInt(document.getElementById('cardio-duration').value) || 0;
  const exercise = cardioDatabase[exerciseId];
  if (!exercise) return;
  const calories = Math.round(exercise.calsPerMin * duration);
  const el = document.getElementById('cardio-calories-estimate');
  if (el) el.textContent = calories;
}

export function addCardioExercise() {
  const exerciseId = document.getElementById('cardio-exercise-selector').value;
  const duration = parseInt(document.getElementById('cardio-duration').value);
  const notes = document.getElementById('cardio-notes').value.trim();

  if (!duration || duration <= 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Enter a valid duration');
    else alert('Please enter a valid duration');
    return;
  }

  const exercise = cardioDatabase[exerciseId];
  if (!exercise) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Pick an exercise');
    else alert('Please pick an exercise');
    return;
  }
  const calories = Math.round((exercise.calsPerMin || 0) * duration);

  const entry = {
    exerciseId,
    name: exercise.name,
    duration,
    calories,
    notes,
    timestamp: new Date().toISOString()
  };

  const log = getLog();
  window.Sorrel.training.ensureDateEntry(log.currentDate);
  log.entries[log.currentDate].cardio.push(entry);

  save();
  renderExerciseLog();
  if (typeof window.closeAddCardio === 'function') window.closeAddCardio();

  if (typeof window.showLogToast === 'function') {
    window.showLogToast(duration + ' min · ' + calories + ' cal logged');
  }
}

export function deleteCardioExercise(index) {
  const log = getLog();
  const arr = log.entries[log.currentDate] && log.entries[log.currentDate].cardio;
  if (!arr || !arr[index]) return;

  lastDeletedExercise = {
    type: 'cardio',
    date: log.currentDate,
    index,
    entry: { ...arr[index] },
    expiresAt: Date.now() + 6000
  };

  arr.splice(index, 1);
  save();
  renderExerciseLog();

  if (typeof window.showUndoToast === 'function') {
    window.showUndoToast('Removed ' + (lastDeletedExercise.entry.name || 'cardio'), undoLastExerciseDelete);
  }
}

function undoLastExerciseDelete() {
  if (!lastDeletedExercise || Date.now() > lastDeletedExercise.expiresAt) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Nothing to undo');
    return;
  }
  const { type, date, index, entry } = lastDeletedExercise;
  const log = getLog();
  window.Sorrel.training.ensureDateEntry(date);
  log.entries[date][type].splice(index, 0, entry);
  lastDeletedExercise = null;
  save();
  renderExerciseLog();
  if (typeof window.showLogToast === 'function') window.showLogToast('Restored');
}

function setStrengthLogMode(mode) {
  bysetSession.mode = mode;

  const quickBtn = document.getElementById('mode-quick-btn');
  const bysetsBtn = document.getElementById('mode-bysets-btn');
  const quickDiv = document.getElementById('strength-quick-mode');
  const bysetsDiv = document.getElementById('strength-bysets-mode');

  if (mode === 'quick') {
    if (quickBtn) { quickBtn.style.background = '#0a7d5a'; quickBtn.style.color = 'white'; quickBtn.style.border = 'none'; }
    if (bysetsBtn) { bysetsBtn.style.background = 'white'; bysetsBtn.style.color = '#0a7d5a'; bysetsBtn.style.border = '1.5px solid #0a7d5a'; }
    if (quickDiv) quickDiv.style.display = '';
    if (bysetsDiv) bysetsDiv.style.display = 'none';
  } else {
    if (bysetsBtn) { bysetsBtn.style.background = '#0a7d5a'; bysetsBtn.style.color = 'white'; bysetsBtn.style.border = 'none'; }
    if (quickBtn) { quickBtn.style.background = 'white'; quickBtn.style.color = '#0a7d5a'; quickBtn.style.border = '1.5px solid #0a7d5a'; }
    if (quickDiv) quickDiv.style.display = 'none';
    if (bysetsDiv) bysetsDiv.style.display = '';
  }
}

function addCurrentSet() {
  const reps = parseInt(document.getElementById('byset-reps').value);
  const weight = parseInt(document.getElementById('byset-weight').value);

  if (!reps || reps <= 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Enter valid reps');
    return;
  }

  bysetSession.sets.push({ reps, weight });
  renderBysetList();
  startRestTimer(120);
}

function renderBysetList() {
  const container = document.getElementById('byset-list');
  if (!container) return;

  if (bysetSession.sets.length === 0) {
    container.innerHTML = '<div style="padding: 14px; text-align: center; color: #94a0ad; font-size: 13px;">No sets logged yet — add your first set above</div>';
    return;
  }

  let totalVolume = 0;
  let html = '';
  bysetSession.sets.forEach((s, i) => {
    totalVolume += s.reps * s.weight;
    html += `
      <div style="padding: 12px 14px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 12px;">
        <div style="background: #0a7d5a; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0;">${i + 1}</div>
        <div style="flex: 1; font-size: 14px; color: #1a2332;">
          <strong>${s.reps}</strong> reps × <strong>${s.weight}</strong> lbs
          <span style="color: #94a0ad; font-size: 12px; margin-left: 6px;">(${s.reps * s.weight} vol)</span>
        </div>
        <button onclick="removeBysetSet(${i})" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 20px; padding: 4px 8px; min-width: 36px; min-height: 36px;">×</button>
      </div>
    `;
  });
  html += `
    <div style="padding: 12px 14px; background: #f4f1ec; font-size: 13px; color: var(--text-secondary); display: flex; justify-content: space-between;">
      <span><strong>${bysetSession.sets.length}</strong> sets logged</span>
      <span><strong>${totalVolume.toLocaleString()}</strong> total volume</span>
    </div>
  `;
  container.innerHTML = html;
}

function removeBysetSet(index) {
  bysetSession.sets.splice(index, 1);
  renderBysetList();
}

function updateRestTimerDisplay() {
  const display = document.getElementById('rest-timer-display');
  if (!display) return;
  const mins = Math.floor(Math.max(0, restTimerSeconds) / 60);
  const secs = Math.max(0, restTimerSeconds) % 60;
  display.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

function startRestTimer(seconds) {
  stopRestTimer();
  restTimerSeconds = seconds;

  const card = document.getElementById('rest-timer-card');
  if (card) card.style.display = '';

  updateRestTimerDisplay();

  restTimerInterval = setInterval(() => {
    restTimerSeconds--;
    updateRestTimerDisplay();
    if (restTimerSeconds <= 0) {
      stopRestTimer();
      if (typeof window.showLogToast === 'function') window.showLogToast('Rest done — next set');
      try {
        if (typeof Audio !== 'undefined') {
          const beep = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
          beep.play().catch(() => {});
        }
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } catch (e) {}
    }
  }, 1000);
}

function adjustRestTimer(delta) {
  restTimerSeconds = Math.max(0, restTimerSeconds + delta);
  updateRestTimerDisplay();
}

function stopRestTimer() {
  if (restTimerInterval) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
  }
  const card = document.getElementById('rest-timer-card');
  if (card) card.style.display = 'none';
}

function updateStrengthVolume() {
  const sets = parseInt(document.getElementById('strength-sets').value) || 0;
  const reps = parseInt(document.getElementById('strength-reps').value) || 0;
  const weight = parseInt(document.getElementById('strength-weight').value) || 0;

  const totalReps = sets * reps;
  const volume = totalReps * weight;

  const v = document.getElementById('strength-volume-display');
  if (v) v.textContent = volume.toLocaleString();
  const r = document.getElementById('strength-total-reps');
  if (r) r.textContent = totalReps;
  const w = document.getElementById('strength-weight-display');
  if (w) w.textContent = weight;
}

function updateLastSessionCard() {
  const exerciseIdEl = document.getElementById('strength-exercise-selector');
  const exerciseId = exerciseIdEl ? exerciseIdEl.value : null;
  if (!exerciseId) return;

  const card = document.getElementById('last-session-card');
  const content = document.getElementById('last-session-content');
  if (!card || !content) return;

  const log = getLog();
  let mostRecent = null;
  let mostRecentDate = null;
  if (log && log.entries) {
    const dates = Object.keys(log.entries).sort().reverse();
    for (const date of dates) {
      const day = log.entries[date];
      if (!day || !day.strength) continue;
      const found = day.strength.find(e => e.exerciseId === exerciseId);
      if (found) { mostRecent = found; mostRecentDate = date; break; }
    }
  }

  if (!mostRecent) {
    card.style.display = 'none';
    return;
  }

  card.style.display = '';

  let summary = '';
  if (mostRecent.setLog && Array.isArray(mostRecent.setLog) && mostRecent.setLog.length > 0) {
    const setStrs = mostRecent.setLog.map(s => `${s.reps}×${s.weight}`);
    summary = setStrs.join(' · ');
    const totalVol = mostRecent.setLog.reduce((sum, s) => sum + s.reps * s.weight, 0);
    summary += ` <span style="color:var(--text-tertiary);">(vol ${totalVol.toLocaleString()})</span>`;
  } else {
    summary = `${mostRecent.sets} sets × ${mostRecent.reps} reps @ ${mostRecent.weight} lbs`;
    summary += ` <span style="color:var(--text-tertiary);">(vol ${(mostRecent.sets * mostRecent.reps * mostRecent.weight).toLocaleString()})</span>`;
  }

  const days = Math.floor((Date.now() - new Date(mostRecentDate).getTime()) / 86400000);
  const dateStr = days === 0 ? 'earlier today' : days === 1 ? 'yesterday' : days + ' days ago';

  const lastWeight = mostRecent.weight || (mostRecent.setLog && mostRecent.setLog[0] && mostRecent.setLog[0].weight) || 0;
  const lastReps = mostRecent.reps || (mostRecent.setLog && mostRecent.setLog[0] && mostRecent.setLog[0].reps) || 0;
  if (lastWeight) {
    const w = document.getElementById('strength-weight');
    if (w) w.value = lastWeight;
    const bw = document.getElementById('byset-weight');
    if (bw) bw.value = lastWeight;
  }
  if (lastReps) {
    const r = document.getElementById('strength-reps');
    if (r) r.value = lastReps;
    const br = document.getElementById('byset-reps');
    if (br) br.value = lastReps;
  }

  content.innerHTML = `
    <div>${summary}</div>
    <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px;">${dateStr}</div>
  `;
}

export function addStrengthExercise() {
  const exerciseId = document.getElementById('strength-exercise-selector').value;
  const notes = document.getElementById('strength-notes').value.trim();
  const exercise = strengthDatabase[exerciseId];
  if (!exercise) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Pick an exercise');
    else alert('Pick an exercise');
    return;
  }

  let entry;

  if (bysetSession.mode === 'bysets' && bysetSession.sets.length > 0) {
    const setLog = [...bysetSession.sets];
    const totalReps = setLog.reduce((s, x) => s + x.reps, 0);
    const totalVolume = setLog.reduce((s, x) => s + x.reps * x.weight, 0);
    const topSet = setLog.reduce((max, s) => s.weight > max.weight ? s : max, setLog[0]);

    entry = {
      exerciseId,
      name: exercise.name,
      setLog,
      sets: setLog.length,
      reps: Math.round(totalReps / setLog.length),
      weight: topSet.weight,
      totalVolume,
      notes,
      timestamp: new Date().toISOString()
    };
  } else {
    const sets = parseInt(document.getElementById('strength-sets').value);
    const reps = parseInt(document.getElementById('strength-reps').value);
    const weight = parseInt(document.getElementById('strength-weight').value);

    if (!sets || sets <= 0 || !reps || reps <= 0) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Enter valid sets and reps');
      else alert('Please enter valid sets and reps');
      return;
    }

    entry = {
      exerciseId,
      name: exercise.name,
      sets,
      reps,
      weight,
      totalVolume: sets * reps * weight,
      notes,
      timestamp: new Date().toISOString()
    };
  }

  const log = getLog();
  window.Sorrel.training.ensureDateEntry(log.currentDate);
  log.entries[log.currentDate].strength.push(entry);

  save();

  bysetSession = { mode: 'quick', sets: [] };
  stopRestTimer();

  renderExerciseLog();
  if (typeof window.closeAddStrength === 'function') window.closeAddStrength();

  if (typeof window.showLogToast === 'function') {
    const setCount = entry.setLog ? entry.setLog.length : entry.sets;
    window.showLogToast('Logged ' + setCount + ' sets · ' + (entry.totalVolume || 0).toLocaleString() + ' total volume');
  }
}

export function deleteStrengthExercise(index) {
  const log = getLog();
  const arr = log.entries[log.currentDate] && log.entries[log.currentDate].strength;
  if (!arr || !arr[index]) return;

  lastDeletedExercise = {
    type: 'strength',
    date: log.currentDate,
    index,
    entry: { ...arr[index] },
    expiresAt: Date.now() + 6000
  };

  arr.splice(index, 1);
  save();
  renderExerciseLog();

  if (typeof window.showUndoToast === 'function') {
    window.showUndoToast('Removed ' + (lastDeletedExercise.entry.name || 'exercise'), undoLastExerciseDelete);
  }
}

export const render = renderExerciseLog;

// Exercise tab init — boot from localStorage + ensure today's entry.
// State already loaded via window.Sorrel.training.loadExerciseLog() in
// main.js bootstrap; this just hydrates currentDate's entry slot.
export function initExerciseLog() {
  const log = getLog();
  if (!log.entries[log.currentDate]) {
    window.Sorrel.training.ensureDateEntry(log.currentDate);
  }
}

// Switch between cardio + strength panels inside Exercise tab.
export function switchExerciseTab(type) {
  const log = getLog();
  log.currentExerciseType = type;

  const cardioTab = document.getElementById('exercise-tab-cardio');
  const strengthTab = document.getElementById('exercise-tab-strength');
  const cardioContent = document.getElementById('exercise-cardio-content');
  const strengthContent = document.getElementById('exercise-strength-content');
  if (!cardioTab || !strengthTab || !cardioContent || !strengthContent) return;

  if (type === 'cardio') {
    cardioTab.style.background = '#0a7d5a';
    cardioTab.style.color = 'white';
    strengthTab.style.background = '#e8e2d6';
    strengthTab.style.color = '#495057';
    cardioContent.style.display = 'block';
    strengthContent.style.display = 'none';
  } else {
    strengthTab.style.background = '#0a7d5a';
    strengthTab.style.color = 'white';
    cardioTab.style.background = '#e8e2d6';
    cardioTab.style.color = '#495057';
    strengthContent.style.display = 'block';
    cardioContent.style.display = 'none';
  }
}

export function changeExerciseDate(days) {
  const log = getLog();
  const cur = new Date(log.currentDate + 'T00:00:00');
  cur.setDate(cur.getDate() + days);
  log.currentDate = toLocalISO(cur);
  if (!log.entries[log.currentDate]) {
    window.Sorrel.training.ensureDateEntry(log.currentDate);
  }
  renderExerciseLog();
}

export function renderHealthRecovery(targetId) {
  const destId = targetId || 'train-recovery-content';
  const dest = document.getElementById(destId);
  if (!dest) return;

  ensureRecoveryState();
  const s = appState() || {};
  const baseline = computeRecoveryBaseline();
  const todayEntry = (s.recoveryLog && s.recoveryLog[todayISO()]) || {};
  const rec = getTodaysIntensityRecommendation();

  const past7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const entry = (s.recoveryLog && s.recoveryLog[iso]) || {};
    past7.push({
      day: ['Su','M','T','W','Th','F','Sa'][d.getDay()],
      score: entry.recoveryScore,
      hrv: entry.hrv,
      level: getRecoveryLevel(iso),
      isToday: i === 0,
    });
  }

  const levelColors = { optimal: '#0a7d5a', good: '#d97706', low: '#f59e0b', depleted: '#dc2626' };

  dest.innerHTML = `
    <div class="card">
      <div class="card-header">⚡ Today's Recovery</div>
      ${rec ? `
        <div style="background:linear-gradient(135deg,${rec.color},${rec.color}dd);color:white;padding:18px;border-radius:12px;margin-bottom:14px;">
          <div style="font-size:32px;margin-bottom:6px;">${rec.emoji}</div>
          <div style="font-size:20px;font-weight:700;">${rec.label}</div>
          <div style="font-size:13px;opacity:0.95;margin-top:8px;line-height:1.4;"><strong>Training:</strong> ${rec.training}</div>
          <div style="font-size:13px;opacity:0.95;margin-top:6px;line-height:1.4;"><strong>Nutrition:</strong> ${rec.nutrition}</div>
        </div>
      ` : `
        <div style="padding:16px;background:#f4f1ec;border-radius:10px;margin-bottom:14px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">📊</div>
          <strong>No recovery data yet</strong>
          <div style="font-size:13px;color:#5a6573;margin-top:6px;">Log your HRV or sync from Whoop / Oura / Garmin to see today's recommendation.</div>
        </div>
      `}
      <div style="margin-bottom:14px;">
        <div style="font-size:13px;color:#5a6573;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-weight:600;">7-day recovery</div>
        <div style="display:flex;gap:6px;align-items:flex-end;height:90px;">
          ${past7.map(d => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;${d.isToday ? 'background:var(--accent-soft);border-radius:6px;padding:4px 2px;margin:-4px -2px;' : ''}">
              <div style="width:100%;height:60px;display:flex;align-items:flex-end;">
                <div style="width:100%;background:${d.level ? levelColors[d.level] : (d.isToday ? 'var(--accent-primary)' : '#e0e0e0')};border-radius:4px;height:${d.score ? d.score : (d.hrv && baseline ? Math.min(100, Math.max(20, 50 + (d.hrv - baseline.mean) * 3)) : 25)}%;${d.isToday ? 'box-shadow:0 0 0 2px var(--accent-primary);' : ''}"></div>
              </div>
              <div style="font-size:10px;color:${d.isToday ? 'var(--accent-primary)' : '#5a6573'};font-weight:${d.isToday ? '700' : '400'};">${d.day}</div>
              ${d.isToday ? '<div style="font-size:8px;color:var(--accent-primary);font-weight:700;letter-spacing:0.04em;line-height:1;">TODAY</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ${baseline ? `
        <div style="padding:10px 12px;background:#e7f5ee;border-radius:8px;font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:14px;">
          <strong>Your baseline:</strong> ${baseline.mean} ms HRV (±${baseline.stdDev}, n=${baseline.sampleSize})
        </div>
      ` : ''}
      <button onclick="openRecoveryModal()" style="width:100%;padding:14px;min-height:48px;background:#0a7d5a;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:15px;">
        Log HRV / Recovery →
      </button>
    </div>
    <div class="card" style="margin-top:14px;" id="recovery-guidance-card">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <span>🧠 How recovery adjusts your plan</span>
        <button onclick="event.stopPropagation();toggleRecoveryGuidance()" aria-expanded="${s.recoveryGuidanceExpanded ? 'true' : 'false'}" style="background:var(--bg-elevated);color:var(--accent-primary);border:1.5px solid var(--accent-primary);border-radius:18px;padding:8px 12px;font-size:12px;font-weight:700;cursor:pointer;min-height:36px;">
          ${s.recoveryGuidanceExpanded ? 'Hide details' : 'Show details'}
        </button>
      </div>
      <div id="recovery-guidance-body" style="${s.recoveryGuidanceExpanded ? '' : 'display:none;'}">
        <p style="color:#5a6573;font-size:13px;margin:0 0 8px 0;line-height:1.5;">
          When today's HRV is significantly below your personal baseline, the algorithm reduces today's carbs and overall calories while preserving protein — a one-day override that doesn't permanently change your targets.
        </p>
        <div style="font-size:12px;color:#777;line-height:1.7;">
          <div>🟢 <strong>Optimal</strong> (≥+0.5σ): push hard, full carbs</div>
          <div>🟡 <strong>Good</strong> (±0.5σ): standard plan</div>
          <div>🟠 <strong>Low</strong> (-0.5 to -1.5σ): ease up, +10% protein</div>
          <div>🔴 <strong>Depleted</strong> (&lt;-1.5σ): rest day, -15% carbs, -150 cal</div>
        </div>
      </div>
    </div>
  `;
}

// Expose for inline onclick handlers in monolith HTML.
window.addCardioExercise = addCardioExercise;
window.deleteCardioExercise = deleteCardioExercise;
window.undoLastExerciseDelete = undoLastExerciseDelete;
window.updateCardioCalories = updateCardioCalories;
window.setStrengthLogMode = setStrengthLogMode;
window.addCurrentSet = addCurrentSet;
window.renderBysetList = renderBysetList;
window.removeBysetSet = removeBysetSet;
window.startRestTimer = startRestTimer;
window.adjustRestTimer = adjustRestTimer;
window.stopRestTimer = stopRestTimer;
window.updateRestTimerDisplay = updateRestTimerDisplay;
window.updateStrengthVolume = updateStrengthVolume;
window.updateLastSessionCard = updateLastSessionCard;
window.addStrengthExercise = addStrengthExercise;
window.deleteStrengthExercise = deleteStrengthExercise;
window.renderHealthRecovery = renderHealthRecovery;
