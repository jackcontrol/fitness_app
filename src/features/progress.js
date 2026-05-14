// Progress — photo gallery (own localStorage) + weight tracking helpers
// over state.weightLog.
// Extracted from index.html lines 15215-15389 (photos) and 17094-17231 (weight).
//
// Storage key: 'progress-photos' (independent of tracker-state).
// Weight log lives on state.weightLog; ensure(state, 'weightLog', []) is
// guaranteed by ensureAdaptiveState() — call before first read.

import { ensure } from '../state/appState.js';
import { todayISO, toLocalISO, daysBetween } from '../utils/dates.js';
import { getDiary } from './diary.js';

const PHOTOS_KEY = 'progress-photos';

// ─── Photo gallery ──────────────────────────────────────────────────────────

let photos = [];

export function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    photos = raw ? JSON.parse(raw) : [];
  } catch (e) {
    photos = [];
  }
  return photos;
}

export function savePhotos() {
  try {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
    return true;
  } catch (e) {
    console.warn('savePhotos failed:', e && e.message);
    return false;
  }
}

export function getPhotos() {
  return photos;
}

// Add a photo from a data URL (base64). Returns the new photo object.
export function addPhoto(dataUrl) {
  if (!dataUrl) return null;
  const photo = {
    id: Date.now(),
    date: new Date().toISOString(),
    data: dataUrl,
  };
  photos.push(photo);
  savePhotos();
  return photo;
}

export function deletePhoto(photoId) {
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx < 0) return false;
  photos.splice(idx, 1);
  savePhotos();
  return true;
}

// ─── Weight log + adaptive math ─────────────────────────────────────────────
// These helpers operate on the appState object passed in; the caller is
// responsible for saveState() after mutations.

export function ensureAdaptiveState(state) {
  ensure(state, 'weightLog', []);
  ensure(state, 'adherenceLog', {});
  ensure(state, 'macroAdjustments', []);
  if (state.lastRecalibration === undefined) state.lastRecalibration = null;
  return state;
}

// Upsert one weight entry per day. Latest entry for a given date wins.
// Caller persists via saveState() and saveProfile() if profile.weight tracked.
export function logWeight(state, weightLb, dateISO) {
  ensureAdaptiveState(state);
  const date = dateISO || todayISO();
  const w = parseFloat(weightLb);
  if (!Number.isFinite(w)) return null;
  state.weightLog = state.weightLog.filter((e) => e.date !== date);
  state.weightLog.push({ date, weight: w });
  state.weightLog.sort((a, b) => a.date.localeCompare(b.date));
  return { date, weight: w };
}

// Exponentially-weighted moving average. alpha=0.1 ≈ 10-day window.
export function getTrendWeight(state, profile) {
  ensureAdaptiveState(state);
  if (state.weightLog.length === 0) return profile ? profile.weight : null;
  if (state.weightLog.length === 1) return state.weightLog[0].weight;
  const alpha = 0.1;
  let trend = state.weightLog[0].weight;
  for (let i = 1; i < state.weightLog.length; i++) {
    trend = alpha * state.weightLog[i].weight + (1 - alpha) * trend;
  }
  return Math.round(trend * 10) / 10;
}

// Simple 7-day average of latest entries.
export function get7DayAverage(state) {
  ensureAdaptiveState(state);
  if (state.weightLog.length === 0) return null;
  const recent = state.weightLog.slice(-7);
  const sum = recent.reduce((s, e) => s + e.weight, 0);
  return Math.round((sum / recent.length) * 10) / 10;
}

// Trend delta normalized to a weekly rate.
export function getWeeklyWeightChange(state) {
  ensureAdaptiveState(state);
  if (state.weightLog.length < 2) return 0;
  const weekAgoISO = toLocalISO(new Date(Date.now() - 7 * 86400000));
  const latest = state.weightLog[state.weightLog.length - 1];
  let baseline = state.weightLog[0];
  for (const entry of state.weightLog) {
    if (entry.date <= weekAgoISO) baseline = entry;
    else break;
  }
  const days = daysBetween(baseline.date, latest.date);
  if (days === 0) return 0;
  const totalChange = latest.weight - baseline.weight;
  return Math.round((totalChange * 7 / days) * 10) / 10;
}

// Projected ETA to target weight at current rate. Returns null when not
// converging (no rate, zero rate, or moving the wrong direction).
export function projectGoalDate(state, profile) {
  if (!profile || !profile.targetWeight) return null;
  const current = getTrendWeight(state, profile);
  if (!current) return null;
  const weeklyRate = getWeeklyWeightChange(state);
  if (Math.abs(weeklyRate) < 0.1) return null;
  const needed = profile.targetWeight - current;
  if ((needed > 0 && weeklyRate < 0) || (needed < 0 && weeklyRate > 0)) return null;
  const weeks = Math.abs(needed / weeklyRate);
  return new Date(Date.now() + weeks * 7 * 86400000);
}

// Consecutive days with at least one food entry ending today (or yesterday if
// today has nothing yet — don't break a streak at 7 AM).
export function getLoggingStreak() {
  const foodDiary = getDiary();
  if (!foodDiary || !foodDiary.entries) return 0;

  const hasEntries = (iso) => {
    const e = foodDiary.entries[iso];
    if (!e) return false;
    return ((e.breakfast || []).length + (e.lunch || []).length +
            (e.dinner || []).length + (e.snacks || []).length) > 0;
  };

  const today = todayISO();
  let streak = 0;
  const cursor = new Date();
  if (!hasEntries(today)) cursor.setDate(cursor.getDate() - 1);

  for (let i = 0; i < 365; i++) {
    const iso = toLocalISO(cursor);
    if (hasEntries(iso)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
