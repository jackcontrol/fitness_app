// Progress tab — weight summary, pattern badge, photo grid.
// Lifted from index.html:
//   renderProgressTab L17948, renderProgress L25704.
//
// renderProgressPhotos is shared with premium tab — imported from premium.js.
// updateStats stays in monolith (cross-tab counters) — called via window.

import { renderProgressPhotos } from './premium.js';

function renderWeightSummary() {
  const wSum = document.getElementById('progress-weight-summary');
  if (!wSum) return;

  const state = window.Sorrel.loadState();
  const profile = window.Sorrel.getProfile();
  const log = (state && state.weightLog) ? state.weightLog : [];

  if (log.length === 0) {
    wSum.innerHTML = `<div style="font-style:italic;">No weight logged yet. Daily weigh-ins drive Sorrel's adaptive macros.</div>`;
    return;
  }

  const latest = log[log.length - 1];
  const trend = window.Sorrel.progress.getTrendWeight(state, profile);

  wSum.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px;">
      <div>
        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;">Latest</div>
        <div style="font-size:24px;font-weight:700;color:var(--text-primary);font-variant-numeric:tabular-nums;line-height:1.2;">${latest.weight} lb</div>
      </div>
      ${trend ? `
        <div style="text-align:right;">
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;">7-day avg</div>
          <div style="font-size:18px;font-weight:600;color:var(--accent-primary);font-variant-numeric:tabular-nums;">${trend.toFixed(1)} lb</div>
        </div>
      ` : ''}
    </div>
    <div style="font-size:12px;color:var(--text-tertiary);margin-top:8px;">${log.length} weigh-in${log.length !== 1 ? 's' : ''} total</div>`;
}

export function renderPatternBadge() {
  const profile = window.Sorrel.getProfile();
  if (!profile) return;

  let patternClass = '';
  let patternName = '';
  let patternDesc = '';

  if (profile.pattern === 'C') {
    patternClass = 'pattern-c';
    patternName = 'Pattern C';
    patternDesc = profile.patternDescription || 'High cortisol / Overtraining - Recovery protocol active';
  } else if (profile.pattern === 'B') {
    patternClass = 'pattern-b';
    patternName = 'Pattern B';
    patternDesc = profile.patternDescription || 'Minor overreaching - Small adjustments recommended';
  } else if (profile.pattern === 'A-') {
    patternClass = 'pattern-a';
    patternName = 'Pattern A-';
    patternDesc = profile.patternDescription || 'Minor optimization suggested';
  } else {
    patternClass = 'pattern-a';
    patternName = 'Pattern A';
    patternDesc = profile.patternDescription || 'Healthy recovery status';
  }

  const reasoning = Array.isArray(profile.patternReasoning) ? profile.patternReasoning : [];
  const whyCard = reasoning.length > 0 ? `
    <div style="margin-top:14px;padding:12px;background:var(--bg-elevated,#f4f1ec);border-radius:10px;border:1px solid var(--border-subtle,#e0d8cc);cursor:pointer;"
         onclick="(function(el){var b=el.querySelector('.pattern-why-body');var t=el.querySelector('.pattern-why-toggle');if(b.style.display==='block'){b.style.display='none';t.textContent='Show ▾';}else{b.style.display='block';t.textContent='Hide ▴';}})(this)">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;color:var(--text-primary);">
        <span>🧠 Why this pattern?</span>
        <span class="pattern-why-toggle" style="font-size:12px;color:var(--text-tertiary);font-weight:500;">Show ▾</span>
      </div>
      <div class="pattern-why-body" style="display:none;margin-top:10px;">
        ${reasoning.map(r => `
          <div style="padding:10px;margin-top:6px;background:white;border-left:3px solid var(--accent-primary,#0a7d5a);border-radius:6px;font-size:13px;line-height:1.5;color:var(--text-secondary);">
            ${r}
          </div>
        `).join('')}
        <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary);font-style:italic;line-height:1.5;">
          Pattern is based on your assessment. As you log weight, recovery, and adherence over time, the protocol auto-adjusts within your pattern bracket.
        </div>
      </div>
    </div>
  ` : '';

  const display = document.getElementById('pattern-display');
  if (display) {
    display.innerHTML = `
      <span class="pattern-badge ${patternClass}">${patternName}</span>
      <p style="color: #5a6573; margin-top: 12px; line-height: 1.6;">${patternDesc}</p>
      ${whyCard}
    `;
  }
}

export function renderProgressTab() {
  renderWeightSummary();
  if (typeof window.updateStats === 'function') window.updateStats();
  renderPatternBadge();
}

export function render() {
  renderProgressTab();
  renderProgressPhotos();
}
