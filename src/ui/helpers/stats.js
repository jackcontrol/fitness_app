// Cross-tab stat counters. Lifted from index.html L28402.
//
// Updates hydration badge/bar, evening badge, shopping badge, days-active.
// Reads window.state (monolith publishes via L33171+ patches), pulls
// getDayData + getHydrationSchedule from window.* (lifted into
// src/features/{plan,routine}.js but accessed via window for monolith
// compatibility). shoppingCategories is a monolith-only global.

export function updateStats() {
  const state = window.state || {};
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const getDayData = (typeof window.getDayData === 'function') ? window.getDayData : () => ({});
  const getHydrationSchedule = (typeof window.getHydrationSchedule === 'function') ? window.getHydrationSchedule : null;

  const hydrationData = getDayData('hydration') || {};
  const hydrationComplete = Object.values(hydrationData).filter(Boolean).length;
  const hydrationPercent = Math.round((hydrationComplete / 8) * 100);
  set('hydration-badge', `${hydrationComplete}/8`);
  const progressBar = document.getElementById('hydration-progress');
  if (progressBar) progressBar.style.width = `${hydrationPercent}%`;

  if (getHydrationSchedule) {
    const schedule = getHydrationSchedule();
    const waterToday = schedule.reduce((sum, item) => sum + (hydrationData[item.id] ? item.oz : 0), 0);
    set('water-today', `${waterToday}oz`);
  }

  const eveningData = getDayData('evening') || {};
  const eveningComplete = Object.values(eveningData).filter(Boolean).length;
  set('evening-badge', `${eveningComplete}/11`);

  const shoppingCategories = window.shoppingCategories;
  if (Array.isArray(shoppingCategories)) {
    const totalShoppingItems = shoppingCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const shoppingComplete = state.shopping ? Object.values(state.shopping).filter(Boolean).length : 0;
    set('shopping-badge', `${shoppingComplete}/${totalShoppingItems}`);
  }

  set('days-active', state.currentDay || 0);
}
