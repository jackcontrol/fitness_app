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
