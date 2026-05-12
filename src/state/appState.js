// App state — the transient state object persisted as 'tracker-state' in localStorage.
// The legacy `let state` variable (~line 9930 in index.html) is the runtime copy.
// This module provides load/save helpers for the state object.
//
// The v1.6.26 architectural fix created window.state as an alias for the lexical `state`.
// During Phase 3 extraction, state mutations should go through setStateField() so
// localStorage is always updated atomically.

const STATE_KEY = 'tracker-state';

export function loadState() {
  try {
    var raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch (e) {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

export function defaultState() {
  return {
    weightLog: [],
    pantry: {},
    hydrationByDate: {},
    exerciseLog: [],
    foodDiary: {},
  };
}
