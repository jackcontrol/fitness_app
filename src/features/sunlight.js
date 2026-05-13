// Sunlight subsystem — lifted from index.html L36205-36261 (winning IIFE).
//
// Reads/writes window.state.sunlightLog. Mutations propagate to monolith
// via shared object identity. Idle until window.logSunlight is invoked
// or wired in main.js — monolith's IIFE-local copy still drives the
// active code path through patch L36211. Slice 8.2 collapses the IIFE.

import { localDateKey, weekStart, plusDays } from '../utils/dates.js';

function appState() {
  try { if (window.state) return window.state; } catch (e) {}
  return null;
}

function saveAll() {
  try { if (typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  try {
    const p = window.profile;
    if (p) localStorage.setItem('user-profile', JSON.stringify(p));
  } catch (e) {}
}

function toast(msg) {
  try {
    if (typeof window.showLogToast === 'function') window.showLogToast(msg);
    else console.log('[Sorrel]', msg);
  } catch (e) {
    console.log('[Sorrel]', msg);
  }
}

export function sunlightMap() {
  const st = appState();
  if (!st) return {};
  if (!st.sunlightLog || typeof st.sunlightLog !== 'object') st.sunlightLog = {};
  return st.sunlightLog;
}

export function logSunlight(period) {
  const log = sunlightMap();
  const key = localDateKey(new Date());
  if (!log[key]) log[key] = {};
  log[key][period === 'midday' ? 'midday' : 'morning'] = true;
  log[key].timestamp = Date.now();
  saveAll();
  renderHealthSunlightStable();
  toast(period === 'midday' ? 'Midday sun logged' : 'Morning sun logged');
  return false;
}

export function renderHealthSunlightStable() {
  const host = document.getElementById('sunlight-tracker');
  if (!host) return;
  const log = sunlightMap();
  const today = localDateKey(new Date());
  const tlog = log[today] || {};
  const start = weekStart(new Date());
  const dayNames = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
  const bars = dayNames.map((label, i) => {
    const date = plusDays(start, i);
    const key = localDateKey(date);
    const isToday = key === today;
    const entry = log[key] || {};
    const done = !!(entry.morning || entry.midday);
    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
        <div style="font-size:10px;color:var(--text-tertiary);font-weight:700;">${label}</div>
        <div style="width:100%;height:28px;border-radius:5px;background:${isToday ? 'rgba(16,185,129,.22)' : 'var(--bg-elevated)'};border:${isToday ? '1px solid rgba(10,125,90,.35)' : '1px solid transparent'};position:relative;overflow:hidden;">
          <div style="position:absolute;left:0;bottom:0;height:${done ? '100%' : '0'};width:100%;background:var(--accent-primary);border-radius:4px;transition:height .2s ease;"></div>
        </div>
        ${isToday ? `<div style="background:var(--accent-primary);color:white;border-radius:999px;padding:2px 8px;font-size:9px;font-weight:900;line-height:1;">TODAY</div>` : `<div style="height:13px;"></div>`}
      </div>`;
  }).join('');
  const morning = !!tlog.morning, midday = !!tlog.midday;
  host.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;margin-bottom:14px;">
        <div style="width:4px;height:18px;background:var(--accent-primary);border-radius:2px;"></div>
        <h3 style="margin:0;font-size:16px;color:var(--text-primary);">☀️ Daily sunlight</h3>
      </div>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.45;margin:0 0 14px;">Morning light exposure anchors your circadian rhythm. Aim for 5–10 min within an hour of waking.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
        <button type="button" data-sorrel-sun="morning" style="min-height:44px;border-radius:10px;border:1px solid ${morning ? 'var(--accent-primary)' : 'var(--border-subtle)'};background:${morning ? 'var(--accent-gradient)' : 'var(--bg-elevated)'};color:${morning ? 'white' : 'var(--text-primary)'};font-weight:800;">${morning ? '✓ Morning sun logged' : '🌅 Log morning sun'}</button>
        <button type="button" data-sorrel-sun="midday" style="min-height:44px;border-radius:10px;border:1px solid ${midday ? 'var(--accent-primary)' : 'var(--border-subtle)'};background:${midday ? 'var(--accent-gradient)' : 'var(--bg-elevated)'};color:${midday ? 'white' : 'var(--text-primary)'};font-weight:800;">${midday ? '✓ Midday sun logged' : '☀️ Log midday sun'}</button>
      </div>
      <div style="display:flex;gap:8px;align-items:flex-start;">${bars}</div>
      <div style="font-size:13px;color:var(--text-secondary);text-align:center;margin-top:8px;">Morning sun: <strong>${Object.keys(log).filter((k) => log[k] && log[k].morning).length}</strong> of 7 days</div>
    </div>`;
  host.querySelectorAll('[data-sorrel-sun]').forEach((btn) => {
    btn.onclick = function () { return logSunlight(this.dataset.sorrelSun); };
  });
}
