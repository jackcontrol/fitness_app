// Profile state — load/save the user profile from localStorage.
// The legacy `let profile` variable (~line 2000 in index.html) is lexically scoped
// to its script block. This module provides the same operations as pure functions
// so they can be used without relying on global scope access.
//
// During Phase 3 module extraction, replace direct reads of `profile` in
// render functions with getProfile() from this module.

const PROFILE_KEY = 'user-profile';

export function getProfile() {
  try {
    var raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
