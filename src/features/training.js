// Training — exercise log (cardio + strength) state + persistence.
// Extracted from index.html lines 13692-13727 (state, init, save).
//
// Storage key: 'exercise-log' (independent of tracker-state).
// Cardio entries: { exerciseId, minutes, calories, time }
// Strength entries: { exerciseId, sets: [{ reps, weight }] }
//
// DOM rendering (renderExerciseLog, renderCardioList, etc.) lives in the
// training UI module (slice 5). This module is DOM-free.

import { todayISO } from '../utils/dates.js';

const LOG_KEY = 'exercise-log';

function defaultLog() {
  return {
    entries: {},                  // { 'YYYY-MM-DD': { cardio: [], strength: [] } }
    currentDate: todayISO(),
    currentExerciseType: 'cardio',
  };
}

let log = defaultLog();

export function loadExerciseLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      log.entries = parsed.entries || {};
    }
  } catch (e) {
    // Leave defaults on parse error.
  }
  ensureDateEntry(log.currentDate);
  return log;
}

export function saveExerciseLog() {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify({ entries: log.entries }));
    return true;
  } catch (e) {
    console.warn('saveExerciseLog failed:', e && e.message);
    return false;
  }
}

export function getExerciseLog() {
  return log;
}

export function ensureDateEntry(dateStr) {
  if (!log.entries[dateStr]) {
    log.entries[dateStr] = { cardio: [], strength: [] };
  }
  return log.entries[dateStr];
}

export function changeExerciseDate(days) {
  const date = new Date(log.currentDate + 'T00:00:00');
  date.setDate(date.getDate() + days);
  log.currentDate = date.getFullYear() + '-' +
                    String(date.getMonth() + 1).padStart(2, '0') + '-' +
                    String(date.getDate()).padStart(2, '0');
  ensureDateEntry(log.currentDate);
  return log.currentDate;
}

export function setExerciseType(type) {
  log.currentExerciseType = type === 'strength' ? 'strength' : 'cardio';
  return log.currentExerciseType;
}

// Add a cardio entry for the current date. Returns the appended entry.
export function addCardio(entry) {
  const day = ensureDateEntry(log.currentDate);
  day.cardio.push(entry);
  saveExerciseLog();
  return entry;
}

// Add a strength entry for the current date. Returns the appended entry.
export function addStrength(entry) {
  const day = ensureDateEntry(log.currentDate);
  day.strength.push(entry);
  saveExerciseLog();
  return entry;
}

// Remove by index. Returns the removed entry or null.
export function removeEntry(type, index) {
  const day = log.entries[log.currentDate];
  if (!day || !Array.isArray(day[type])) return null;
  const removed = day[type].splice(index, 1)[0] || null;
  saveExerciseLog();
  return removed;
}

// Sum cardio calories for the current day.
export function dailyCardioCalories() {
  const day = log.entries[log.currentDate];
  if (!day || !Array.isArray(day.cardio)) return 0;
  return day.cardio.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
}

// Sum strength volume (sets * reps * weight) for the current day.
export function dailyStrengthVolume() {
  const day = log.entries[log.currentDate];
  if (!day || !Array.isArray(day.strength)) return 0;
  return day.strength.reduce((total, e) => {
    if (!Array.isArray(e.sets)) return total;
    return total + e.sets.reduce((s, set) => s + (Number(set.reps) || 0) * (Number(set.weight) || 0), 0);
  }, 0);
}

// Recovery-driven training intensity recommendation.
// Lifted from index.html L19334. Pure: takes a recovery level string,
// returns the day's guidance + macro modifiers. Caller resolves recovery
// level via window.getRecoveryLevel (still in monolith).
const INTENSITY_RECS = {
  optimal: {
    level: 'optimal', emoji: '🟢', label: 'Push hard today',
    training: 'Heavy lifting, HIIT, or hard cardio. Your body is primed for performance.',
    nutrition: 'Hit your full carb target. Consider a small surplus pre-workout.',
    proteinMod: 0, carbMod: 0, calMod: 0, color: '#0a7d5a',
  },
  good: {
    level: 'good', emoji: '🟡', label: 'Normal training day',
    training: 'Stick to your planned workout. Listen to your body during warm-ups.',
    nutrition: 'Hit your standard macros — no adjustment needed.',
    proteinMod: 0, carbMod: 0, calMod: 0, color: '#d97706',
  },
  low: {
    level: 'low', emoji: '🟠', label: 'Ease up',
    training: 'Active recovery, lighter weights, or shorter session. No PRs today.',
    nutrition: 'Bump protein 10% to support repair. Drop fat 10% to keep calories steady.',
    proteinMod: 0.10, carbMod: 0, calMod: 0, color: '#f59e0b',
  },
  depleted: {
    level: 'depleted', emoji: '🔴', label: 'Rest day',
    training: 'Skip intense training. Walk, stretch, or take a sauna. Recovery is the work today.',
    nutrition: 'Lower carbs by 15% (less glucose needed). Keep protein high. Calories down ~150.',
    proteinMod: 0.05, carbMod: -0.15, calMod: -150, color: '#dc2626',
  },
};

export function getIntensityRecommendation(level) {
  return INTENSITY_RECS[level] || null;
}

export function getTodaysIntensityRecommendation() {
  const level = (typeof window.getRecoveryLevel === 'function') ? window.getRecoveryLevel() : null;
  return getIntensityRecommendation(level);
}
