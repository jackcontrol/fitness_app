// Hydration tracking — lifted from V163 IIFE (index.html L33594-33649).
//
// Storage: window.state.hydrationByDate[dayKey] = count (0..8). The
// migration flag `__sorrelV163HydrationMigrated` resets the count once
// per local day. Glasses-per-day capped at 8.

import { localDateKey, todayISO } from '../utils/dates.js';
import { appState, appProfile, saveAll } from '../state/accessors.js';
import { toast } from '../ui/helpers/toast.js';
import { getHydrationSchedule } from './routine.js';

const GLASS_IDS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'];

export function hydrateCount() {
  const st = ensureStateShape();
  const d = localDateKey();
  if (st.__sorrelV163HydrationMigrated !== d) {
    st.hydrationByDate[d] = 0;
    st.__sorrelV163HydrationMigrated = d;
    st.hydration = { h1: false, h2: false, h3: false, h4: false, h5: false, h6: false, h7: false, h8: false };
    saveAll();
  }
  return Math.max(0, Math.min(8, Number(st.hydrationByDate[d] || 0)));
}

function ensureStateShape() {
  const st = appState();
  if (!st) return { hydrationByDate: {}, hydration: {} };
  if (!st.hydrationByDate || typeof st.hydrationByDate !== 'object') st.hydrationByDate = {};
  if (!st.hydration || typeof st.hydration !== 'object') st.hydration = {};
  return st;
}

export function ensureHydrationToday() {
  const count = hydrateCount();
  const st = ensureStateShape();
  st.hydrationDate = localDateKey();
  st.hydration = { h1: false, h2: false, h3: false, h4: false, h5: false, h6: false, h7: false, h8: false };
  GLASS_IDS.forEach((id, idx) => {
    st.hydration[id] = idx < count;
    const cb = document.getElementById(id);
    if (cb) cb.checked = st.hydration[id];
  });
}

export function updateHydrationProgress() {
  ensureHydrationToday();
  const count = hydrateCount();
  const total = 8;
  const prof = appProfile() || {};
  const goal = Number(prof.waterOz || prof.waterGoal || 104) || 104;
  const ozPer = Math.round(goal / total);
  const totalOz = count * ozPer;
  const badge = document.getElementById('hydration-badge');
  if (badge) {
    badge.textContent = `${count}/${total}`;
    badge.className = count >= total ? 'badge badge-success' : 'badge badge-warning';
  }
  const waterToday = document.getElementById('water-today');
  if (waterToday) waterToday.textContent = `${totalOz}oz`;
  const bar = document.getElementById('hydration-progress');
  if (bar) {
    bar.style.width = `${Math.round((count / total) * 100)}%`;
    bar.style.background = '#0a7d5a';
  }
}

let waterGuard = 0;

export function logOneGlass() {
  const now = Date.now();
  if (now - waterGuard < 1000) return;
  waterGuard = now;
  const st = ensureStateShape();
  const d = localDateKey();
  const count = hydrateCount();
  if (count >= 8) { toast('All glasses logged for today'); return; }
  st.hydrationByDate[d] = count + 1;
  saveAll();
  updateHydrationProgress();
  try { if (typeof window.renderHydrationSchedule === 'function') window.renderHydrationSchedule(); } catch (e) {}
  try { if (typeof window.renderPlanNextSteps === 'function') window.renderPlanNextSteps(); } catch (e) {}
  const prof = appProfile() || {};
  const ozPer = Math.round((Number(prof.waterOz || prof.waterGoal || 104) || 104) / 8);
  toast('+' + ozPer + 'oz logged · ' + st.hydrationByDate[d] + '/8 today');
}

export function undoLastGlass() {
  const st = ensureStateShape();
  const d = localDateKey();
  const count = hydrateCount();
  if (count <= 0) { toast('Nothing to undo'); return; }
  st.hydrationByDate[d] = count - 1;
  saveAll();
  updateHydrationProgress();
  try { if (typeof window.renderHydrationSchedule === 'function') window.renderHydrationSchedule(); } catch (e) {}
  try { if (typeof window.renderPlanNextSteps === 'function') window.renderPlanNextSteps(); } catch (e) {}
}

export function resetWaterToday() {
  const st = ensureStateShape();
  const d = localDateKey();
  st.hydrationByDate[d] = 0;
  saveAll();
  updateHydrationProgress();
  try { if (typeof window.renderHydrationSchedule === 'function') window.renderHydrationSchedule(); } catch (e) {}
  try { if (typeof window.renderPlanNextSteps === 'function') window.renderPlanNextSteps(); } catch (e) {}
}

export function renderHydrationSchedule() {
  ensureHydrationToday();
  const profile = appProfile();
  if (!profile || !profile.waterOz) {
    console.log('⚠️ No profile or waterOz for hydration schedule');
    return;
  }
  const container = document.getElementById('hydration-items');
  const goalText = document.getElementById('water-goal-text');
  if (!container) {
    console.log('⚠️ hydration-items element not found');
    return;
  }
  if (goalText && goalText.textContent === '💧 Daily Goal') {
    goalText.textContent = `💧 ${profile.waterOz}oz Daily Goal`;
  }
  const schedule = getHydrationSchedule();
  let html = '';
  schedule.forEach(checkpoint => {
    html += `
      <label for="${checkpoint.id}" class="checklist-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 12px; min-height: 48px; border-bottom: 1px solid #d8d2c4; cursor: pointer; box-sizing: border-box;">
        <input type="checkbox" id="${checkpoint.id}"
               onchange="toggleHydration('${checkpoint.id}')"
               style="width: 24px; height: 24px; cursor: pointer; flex-shrink: 0;">
        <span style="flex: 1; font-size: 14px;">
          <strong style="color: #0a7d5a;">${checkpoint.time}</strong>
          <span style="color: #5a6573; margin-left: 8px;">${checkpoint.amount}</span>
        </span>
      </label>
    `;
  });
  container.innerHTML = html;
  const st = appState();
  if (st && st.hydration) {
    schedule.forEach(checkpoint => {
      const cb = document.getElementById(checkpoint.id);
      if (cb && st.hydration[checkpoint.id]) cb.checked = true;
    });
    updateHydrationProgress();
  }
}

export function toggleHydration(checkpointId) {
  ensureHydrationToday();
  const st = ensureStateShape();
  const cb = document.getElementById(checkpointId);
  if (!cb) return;
  st.hydration[checkpointId] = cb.checked;
  const count = GLASS_IDS.filter(id => st.hydration[id]).length;
  st.hydrationByDate[todayISO()] = count;
  saveAll();
  updateHydrationProgress();
}
