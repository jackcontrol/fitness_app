// Patch-IIFE closure wrappers consolidated.
//
// Inside the 19 patch IIFEs (V162-V1631), each re-declared local helpers
// that pulled the live `state` / `profile` from window scope:
//
//   function appState(){ try { if (typeof state !== 'undefined') return state; } catch(e){} return null; }
//   function appProfile(){ try { if (typeof profile !== 'undefined') return profile; } catch(e){} return null; }
//   function saveAll(){
//     try { if (typeof saveState === 'function') saveState(); } catch(e) {}
//     try { const p = appProfile(); if (p) localStorage.setItem('user-profile', JSON.stringify(p)); } catch(e) {}
//   }
//
// Consolidated here, reading window.state / window.profile (monolith
// publishes them at L33171+). Behavior identical.

import { saveState as saveStateModule } from './appState.js';
import { saveProfile as saveProfileModule } from './profile.js';

export function appState() {
  try {
    if (window.state) return window.state;
  } catch (e) {}
  return null;
}

export function appProfile() {
  try {
    if (window.profile) return window.profile;
  } catch (e) {}
  return null;
}

export function saveAll() {
  try {
    if (typeof window.saveState === 'function') {
      window.saveState();
    } else {
      const s = appState();
      if (s) saveStateModule(s);
    }
  } catch (e) {}
  try {
    const p = appProfile();
    if (p) saveProfileModule(p);
  } catch (e) {}
}

// Silent save without UI feedback. Used by patches that mutate state
// inside an event handler where toast feedback would be redundant.
export function saveQuiet() {
  saveAll();
}

export function saveProfileQuiet() {
  try {
    const p = appProfile();
    if (p) saveProfileModule(p);
  } catch (e) {}
}
