// Food diary — state + persistence.
// Extracted from index.html lines 10780-10850 (state, init, save, format).
//
// Storage key: 'food-diary' (localStorage). Owns entries, recentFoods,
// favoriteFoods. Independent from tracker-state — diary has its own
// lifecycle and is written on every food log.
//
// DOM rendering (renderFoodDiary, renderMealFoods, search modals, etc.)
// lives in the diary UI module (slice 5). This module is DOM-free.

import { todayISO } from '../utils/dates.js';

const DIARY_KEY = 'food-diary';

function defaultDiary() {
  return {
    entries: {},           // { 'YYYY-MM-DD': { breakfast: [], lunch: [], dinner: [], snacks: [] } }
    currentDate: todayISO(),
    recentFoods: [],       // last 20 foods used
    favoriteFoods: [],     // user-saved favorites
    currentMeal: 'breakfast',
    currentFood: null,
    editingEntry: null,
  };
}

let diary = defaultDiary();

export function loadDiary() {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      diary.entries = parsed.entries || {};
      diary.recentFoods = parsed.recentFoods || [];
      diary.favoriteFoods = parsed.favoriteFoods || [];
    }
  } catch (e) {
    // Leave defaults in place on parse error.
  }
  ensureDateEntry(diary.currentDate);
  return diary;
}

export function saveDiary() {
  try {
    const payload = JSON.stringify({
      entries: diary.entries,
      recentFoods: diary.recentFoods,
      favoriteFoods: diary.favoriteFoods,
    });
    localStorage.setItem(DIARY_KEY, payload);
    return true;
  } catch (e) {
    console.warn('saveDiary failed:', e && e.message);
    return false;
  }
}

export function getDiary() {
  return diary;
}

// Ensure a date entry exists with empty meal arrays. Mutates in place.
// Returns the entry for the given date.
export function ensureDateEntry(dateStr) {
  if (!diary.entries[dateStr]) {
    diary.entries[dateStr] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
  }
  return diary.entries[dateStr];
}

// Change the active date by +/- N days and ensure that entry exists.
// Returns the new currentDate.
export function changeDiaryDate(days) {
  const date = new Date(diary.currentDate + 'T00:00:00');
  date.setDate(date.getDate() + days);
  diary.currentDate = date.getFullYear() + '-' +
                      String(date.getMonth() + 1).padStart(2, '0') + '-' +
                      String(date.getDate()).padStart(2, '0');
  ensureDateEntry(diary.currentDate);
  return diary.currentDate;
}

// Add a food entry to a meal slot for the current date. Pushes to recents,
// caps recents at 20.
export function addFoodEntry(mealName, foodEntry) {
  const day = ensureDateEntry(diary.currentDate);
  if (!Array.isArray(day[mealName])) day[mealName] = [];
  day[mealName].push(foodEntry);

  if (foodEntry && foodEntry.id) addToRecent(foodEntry.id);
  saveDiary();
  return day[mealName];
}

// Remove a food entry from a meal slot by index. Returns the removed entry.
export function removeFoodEntry(mealName, entryIndex) {
  const day = diary.entries[diary.currentDate];
  if (!day || !Array.isArray(day[mealName])) return null;
  const removed = day[mealName].splice(entryIndex, 1)[0] || null;
  saveDiary();
  return removed;
}

// Push a food id to the front of recentFoods (deduped, max 20).
export function addToRecent(foodId) {
  if (!foodId) return;
  diary.recentFoods = [foodId].concat(
    diary.recentFoods.filter((id) => id !== foodId)
  ).slice(0, 20);
  saveDiary();
}

// Toggle a food id in favoriteFoods. Returns the new favorite state (true/false).
export function toggleFavorite(foodId) {
  if (!foodId) return false;
  const idx = diary.favoriteFoods.indexOf(foodId);
  if (idx >= 0) {
    diary.favoriteFoods.splice(idx, 1);
    saveDiary();
    return false;
  }
  diary.favoriteFoods.push(foodId);
  saveDiary();
  return true;
}

// Format a YYYY-MM-DD date string for diary header display.
// "Today" / "Yesterday" / "Tomorrow" relative to system time, else readable date.
export function formatDiaryDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
