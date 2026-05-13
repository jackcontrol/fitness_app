import './styles/main.css';

import Chart from 'chart.js/auto';
import Quagga from '@ericblade/quagga2';

import {
  getProfile, saveProfile, clearProfile,
  loadState, saveState, defaultState, ensure,
} from './state/index.js';

import {
  canonicalDietType, canonicalAllergens, classifyForVegan,
  getBudget, setBudget,
  fasting, diary, plan, progress, training, customFoods,
  trial, routine,
} from './features/index.js';

import {
  showLogToast, showUndoToast,
  updateBaselineBanner, updateTrialBanner,
  updateTrainRecoveryBanner, updateIntelligenceBanners,
  updateStats,
} from './ui/helpers/index.js';

import './ui/topbanner.js';

window.Chart = Chart;
window.Quagga = Quagga;

window.Sorrel = {
  getProfile, saveProfile, clearProfile,
  loadState, saveState, defaultState, ensure,
  canonicalDietType, canonicalAllergens, classifyForVegan,
  getBudget, setBudget,
  fasting, diary, plan, progress, training, customFoods,
  trial, routine,
  helpers: {
    showLogToast, showUndoToast,
    updateBaselineBanner, updateTrialBanner,
    updateTrainRecoveryBanner, updateIntelligenceBanners,
    updateStats,
  },
};

// Expose lifted helpers under their original names so slice 5 modules and
// other window.* callers find them. Monolith's bare-identifier calls
// (e.g. `showLogToast(...)`) still resolve to monolith's own function
// declarations via script scope, so the two versions coexist until slice 8.
window.showLogToast = showLogToast;
window.showUndoToast = showUndoToast;
window.updateBaselineBanner = updateBaselineBanner;
window.updateTrialBanner = updateTrialBanner;
window.updateTrainRecoveryBanner = updateTrainRecoveryBanner;
window.updateIntelligenceBanners = updateIntelligenceBanners;
window.updateStats = updateStats;
window.checkTrialExpiry = trial.checkTrialExpiry;
window.ensureTrialState = trial.ensureTrialState;
window.getTrialDaysLeft = trial.getTrialDaysLeft;
window.isAdaptiveUnlocked = trial.isAdaptiveUnlocked;
window.getTodaysIntensityRecommendation = training.getTodaysIntensityRecommendation;
window.getHydrationSchedule = routine.getHydrationSchedule;
// getDayData mutates state[category][dayKey] in place. Read monolith's
// live state (published on window by patch IIFEs at L33171+) to keep
// mutations visible to monolith; fall back to a fresh loadState() snapshot
// only when window.state is not yet available.
window.getDayData = (category) => {
  const state = window.state || loadState();
  return plan.getDayData(state, category);
};

function bootstrap() {
  const profile = getProfile();
  const state = loadState();
  const mountIds = ['app', 'root', 'sorrel-root', 'main-content'];
  const mount = mountIds.map(id => document.getElementById(id)).find(Boolean);
  if (mount) {
    const banner = document.createElement('div');
    banner.dataset.sorrelBanner = '1';
    banner.style.cssText = 'padding:6px 10px;font:12px ui-monospace,monospace;background:#0a7d5a;color:#fff;';
    banner.textContent = `Sorrel modules loaded — profile: ${profile ? 'yes' : 'no'}, state keys: ${Object.keys(state).length}`;
    mount.prepend(banner);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
