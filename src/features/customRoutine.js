// Custom routine item CRUD — lifted from V163 IIFE (L33678-33717).
//
// Storage: localStorage key 'sorrel-custom-routine-items' (array of
// {text, time, done, createdAt}). Also mirrored to
// state.customRoutineItems for consistency with old reads.
// Renderer (renderCustomRoutineItems) lives in src/ui/routine.js.

import { appState, saveAll } from '../state/accessors.js';
import { toast } from '../ui/helpers/toast.js';

const STORAGE_KEY = 'sorrel-custom-routine-items';

export function customItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) || [];
  } catch (e) {}
  const st = appState();
  return st && Array.isArray(st.customRoutineItems) ? st.customRoutineItems : [];
}

export function saveCustomItems(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) {}
  const st = appState();
  if (st) st.customRoutineItems = items;
  saveAll();
}

export function addCustomRoutineItem() {
  const input = document.getElementById('custom-routine-input');
  const timeInput = document.getElementById('custom-routine-time');
  const text = input ? input.value.trim() : '';
  const time = timeInput ? (timeInput.value || '12:00') : '12:00';
  if (!text) { toast('Add a routine item first'); return false; }
  const items = customItems();
  items.push({ text, time, done: false, createdAt: Date.now() });
  saveCustomItems(items);
  if (input) input.value = '';
  if (typeof window.renderCustomRoutineItems === 'function') window.renderCustomRoutineItems();
  toast('Routine item added');
  return false;
}

export function toggleCustomRoutineItem(idx) {
  const items = customItems();
  if (!items[idx]) return;
  items[idx].done = !items[idx].done;
  saveCustomItems(items);
  if (typeof window.renderCustomRoutineItems === 'function') window.renderCustomRoutineItems();
}

export function removeCustomRoutineItem(idx) {
  const items = customItems();
  items.splice(idx, 1);
  saveCustomItems(items);
  if (typeof window.renderCustomRoutineItems === 'function') window.renderCustomRoutineItems();
}

// Capture-phase click delegate for the routine card. Installed once
// from main.js bootstrap. Matches V163 event handler at L33710-33717.
export function installCustomRoutineHandlers() {
  document.addEventListener('click', (e) => {
    const add = e.target && e.target.closest && e.target.closest('#custom-routine-card button');
    if (add && (add.textContent || '').trim() === 'Add') {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      addCustomRoutineItem();
      return;
    }
    const t = e.target && e.target.closest && e.target.closest('[data-sorrel-custom-toggle]');
    if (t) {
      e.preventDefault();
      e.stopPropagation();
      toggleCustomRoutineItem(Number(t.getAttribute('data-sorrel-custom-toggle')));
      return;
    }
    const r = e.target && e.target.closest && e.target.closest('[data-sorrel-custom-remove]');
    if (r) {
      e.preventDefault();
      e.stopPropagation();
      removeCustomRoutineItem(Number(r.getAttribute('data-sorrel-custom-remove')));
    }
  }, true);
}
