// State + profile accessors. Post-nuke (S20): main.js bootstrap calls
// loadAccessors() to populate window.state / window.profile from localStorage.
// Modules read via appState() / appProfile() and reassign with
// `window.profile = X` (legacy convention preserved).

import { loadState as loadStateLS, saveState as saveStateLS } from './appState.js';
import { getProfile as getProfileLS, saveProfile as saveProfileLS } from './profile.js';

export function loadAccessors() {
  try {
    if (!window.state) window.state = loadStateLS();
    if (!window.profile) window.profile = getProfileLS();
  } catch (e) {}
  return { state: window.state, profile: window.profile };
}

export function appState() {
  try {
    if (window.state) return window.state;
  } catch (e) {}
  const s = loadStateLS();
  try { window.state = s; } catch (e) {}
  return s;
}

export function appProfile() {
  try {
    if (window.profile) return window.profile;
  } catch (e) {}
  const p = getProfileLS();
  try { window.profile = p; } catch (e) {}
  return p;
}

export function saveAll() {
  try {
    const s = window.state;
    if (s) saveStateLS(s);
  } catch (e) {}
  try {
    const p = window.profile;
    if (p) saveProfileLS(p);
  } catch (e) {}
}

export const saveQuiet = saveAll;

export function saveProfileQuiet() {
  try {
    const p = window.profile;
    if (p) saveProfileLS(p);
  } catch (e) {}
}
