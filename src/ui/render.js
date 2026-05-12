// Tab orchestrator. Replaces monolith switchTab (index.html L28442) in slice 8.
// Currently unused — monolith's switchTab remains live during slice 5.
//
// Each tab is a dynamic import so the production build code-splits per tab:
// initial load fetches only the default (plan) tab; others lazy-fetch on click.

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

export async function switchTab(tab) {
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const navButtons = document.querySelectorAll('.nav button');
  for (const btn of navButtons) {
    const onclick = btn.getAttribute('onclick') || '';
    if (onclick.includes("switchTab('" + tab + "')")) {
      btn.classList.add('active');
      break;
    }
  }

  const target = document.getElementById(tab);
  if (target) target.classList.add('active');

  if (!tabs[tab]) return;
  const mod = await tabs[tab]();
  if (mod && typeof mod.render === 'function') mod.render();
}

export function initialTab() {
  const hash = (location.hash || '').replace(/^#/, '');
  if (hash && tabs[hash]) return hash;
  return 'plan';
}
