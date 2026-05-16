// Intermittent fasting — state machine + persistence.
// Extracted from index.html lines 15060-15209.
//
// Storage key: 'fasting-state' (localStorage). Independent from the central
// tracker-state since fasting has its own lifecycle and dashboard.
//
// DOM rendering, the per-second timer, and the schedule input handler are
// NOT in this module — those live in the fasting UI module (slice 5/7).
// This module only owns state, persistence, and pure math.

const FASTING_KEY = 'fasting-state';

function defaultFastingState() {
  return {
    isActive: false,
    startTime: null,   // ISO string when active
    schedule: '16:8',  // fast_hours:eat_hours
    streak: 0,
    longestStreak: 0,
    history: [],       // [{ startTime, endTime, hours }]
  };
}

let state = defaultFastingState();

export function loadFasting() {
  try {
    const raw = localStorage.getItem(FASTING_KEY);
    if (!raw) return state;
    const parsed = JSON.parse(raw);
    state.isActive     = parsed.isActive || false;
    state.startTime    = parsed.startTime || null;
    state.schedule     = parsed.schedule || '16:8';
    state.streak       = parsed.streak || 0;
    state.longestStreak = parsed.longestStreak || 0;
    state.history      = Array.isArray(parsed.history) ? parsed.history : [];
  } catch (e) {
    state = defaultFastingState();
  }
  return state;
}

export function saveFasting() {
  try {
    localStorage.setItem(FASTING_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('saveFasting failed:', e && e.message);
    return false;
  }
}

export function getFasting() {
  return state;
}

export function setSchedule(schedule) {
  if (typeof schedule !== 'string' || !schedule.includes(':')) return false;
  state.schedule = schedule;
  saveFasting();
  return true;
}

export function startFast() {
  state.isActive = true;
  state.startTime = new Date().toISOString();
  saveFasting();
  return state;
}

// End the active fast. Updates history + streak math.
// Returns { hours, completed, streak, longestStreak } summary for the caller.
// Returns null if no fast was active.
export function endFast() {
  if (!state.isActive) return null;
  const endTime = new Date();
  const startTime = new Date(state.startTime);
  const hours = (endTime - startTime) / (1000 * 60 * 60);

  state.history.push({
    startTime: state.startTime,
    endTime: endTime.toISOString(),
    hours,
  });

  const targetHours = parseTargetHours(state.schedule);
  const completed = hours >= targetHours;
  if (completed) {
    state.streak += 1;
    if (state.streak > state.longestStreak) state.longestStreak = state.streak;
  } else {
    state.streak = 0;
  }

  state.isActive = false;
  state.startTime = null;
  saveFasting();
  return {
    hours,
    completed,
    streak: state.streak,
    longestStreak: state.longestStreak,
  };
}

// ─── Pure helpers (no side effects, safe to import anywhere) ────────────────

export function parseTargetHours(schedule) {
  if (typeof schedule !== 'string') return 16;
  const parts = schedule.split(':');
  const n = parseInt(parts[0], 10);
  return Number.isFinite(n) && n > 0 ? n : 16;
}

// Returns elapsed time of the active fast in milliseconds, or 0 when inactive.
export function elapsedMs(fastingState) {
  const s = fastingState || state;
  if (!s.isActive || !s.startTime) return 0;
  return Date.now() - new Date(s.startTime).getTime();
}

// Returns { hours, minutes, display } for the elapsed time. Used by the UI
// timer in slice 5; placed here so the formatting logic stays pure-testable.
export function formatElapsed(ms) {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const display = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  return { hours, minutes, display };
}
