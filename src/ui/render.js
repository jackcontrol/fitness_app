// Tab orchestrator. Replaces monolith switchTab (index.html L28442) in slice 8.
// During slice 5: monolith's switchTab remains the live router. This module
// is prepared for slice 8, where main.js will call `installSwitchTab()` to
// take over.
//
// Each tab dynamic-imports so Vite code-splits per tab: initial load fetches
// only the default (plan) tab; others lazy-fetch on first click.

const tabs = {
  plan:      () => import('./plan.js'),
  diary:     () => import('./diary.js'),
  exercise:  () => import('./exercise.js'),
  progress:  () => import('./progress.js'),
  shopping:  () => import('./shopping.js'),
  analytics: () => import('./analytics.js'),
  premium:   () => import('./premium.js'),
  routine:   () => import('./routine.js'),
};

function setActiveNav(tab) {
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  try {
    if (typeof event !== 'undefined' && event && event.target) {
      const t = (typeof event.target.closest === 'function')
        ? event.target.closest('.nav button')
        : null;
      if (t) t.classList.add('active');
    }
  } catch (e) {}

  const navButtons = document.querySelectorAll('.nav button');
  let alreadyActive = false;
  for (const btn of navButtons) {
    if (btn.classList.contains('active')) { alreadyActive = true; break; }
  }
  if (!alreadyActive) {
    for (const btn of navButtons) {
      const onclick = btn.getAttribute('onclick') || '';
      if (onclick.includes("switchTab('" + tab + "')")) {
        btn.classList.add('active');
        break;
      }
    }
  }

  const target = document.getElementById(tab);
  if (target) target.classList.add('active');
}

// Per-tab post-render side effects mirrored from monolith switchTab (L28442).
// Each entry can call window.* helpers that still live in the monolith — those
// disappear when their owning code lifts in slice 7/8.
async function runTabSideEffects(tab) {
  if (tab === 'plan') {
    if (typeof window.updateMacroSummary === 'function') window.updateMacroSummary();
    if (typeof window.updateIntelligenceBanners === 'function') window.updateIntelligenceBanners();
    if (typeof window.renderPlanWeightChip === 'function') window.renderPlanWeightChip();
    if (typeof window.renderPlanNextSteps === 'function') window.renderPlanNextSteps();
    if (typeof window.updateBaselineBanner === 'function') window.updateBaselineBanner();
    if (typeof window.updateTrialBanner === 'function') window.updateTrialBanner();
    if (typeof window.checkTrialExpiry === 'function') window.checkTrialExpiry();
  } else if (tab === 'routine') {
    if (typeof window.renderCustomRoutineItems === 'function') window.renderCustomRoutineItems();
  }
}

export async function switchTab(tab) {
  setActiveNav(tab);
  if (!tabs[tab]) return;
  const mod = await tabs[tab]();
  if (mod && typeof mod.render === 'function') mod.render();
  await runTabSideEffects(tab);
}

export function initialTab() {
  const hash = (location.hash || '').replace(/^#/, '');
  if (hash && tabs[hash]) return hash;
  return 'plan';
}

// Slice 8: call this from main.js to take over from monolith's switchTab.
// While monolith is live (slice 5), DO NOT call — leave monolith owning runtime.
export function installSwitchTab() {
  window.switchTab = switchTab;
}
