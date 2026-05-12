// Custom foods — user-defined food items.
// Extracted from index.html lines 15387-15403.
//
// Storage key: 'custom-foods' (independent of tracker-state and food-diary).
// Each food: { id, name, serving, calories, protein, carbs, fat, ... }
//
// DOM rendering and the add/edit modal live in the diary UI module
// (slice 5/7). This module is DOM-free.

const KEY = 'custom-foods';

let foods = [];

export function loadCustomFoods() {
  try {
    const raw = localStorage.getItem(KEY);
    foods = raw ? JSON.parse(raw) : [];
  } catch (e) {
    foods = [];
  }
  return foods;
}

export function saveCustomFoods() {
  try {
    localStorage.setItem(KEY, JSON.stringify(foods));
    return true;
  } catch (e) {
    console.warn('saveCustomFoods failed:', e && e.message);
    return false;
  }
}

export function getCustomFoods() {
  return foods;
}

export function addCustomFood(food) {
  if (!food || !food.name) return null;
  const id = food.id || ('custom_' + Date.now());
  const entry = { ...food, id };
  foods.push(entry);
  saveCustomFoods();
  return entry;
}

export function deleteCustomFood(foodId) {
  const idx = foods.findIndex((f) => f.id === foodId);
  if (idx < 0) return false;
  foods.splice(idx, 1);
  saveCustomFoods();
  return true;
}

export function findCustomFood(foodId) {
  return foods.find((f) => f.id === foodId) || null;
}
