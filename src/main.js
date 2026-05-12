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
} from './features/index.js';

window.Chart = Chart;
window.Quagga = Quagga;

window.Sorrel = {
  getProfile, saveProfile, clearProfile,
  loadState, saveState, defaultState, ensure,
  canonicalDietType, canonicalAllergens, classifyForVegan,
  getBudget, setBudget,
  fasting, diary, plan, progress, training, customFoods,
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
