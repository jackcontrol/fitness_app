// Diary tab — food log render, meal cards, daily totals, macro summary, multi-add.
// Lifted from index.html: L10865-11358 + L12793-12966 + L13612-13668.
//
// State via window.Sorrel.diary feature module.
// Modal handlers (openFoodSearch / editFoodEntry / deleteFoodEntry / showQuickAdd
// / showMacroExplain) stay in monolith for now — slice 7.
// Cross-tab helpers (refreshAfterFoodLog, showLogToast, getEffectiveMacrosForToday,
// foodDatabase, getLoggingStreak) called via window.

import { todayISO, toLocalISO } from '../utils/dates.js';
import { escapeHtml } from '../utils/html.js';
import { formatDiaryDate } from '../features/diary.js';

let multiAddState = { active: false, selected: [] };

function getDiary() {
  window.Sorrel.diary.loadDiary();
  return window.Sorrel.diary.getDiary();
}

function save() {
  window.Sorrel.diary.saveDiary();
}

function ensureDate(dateStr) {
  return window.Sorrel.diary.ensureDateEntry(dateStr);
}

function addToRecent(foodId) {
  if (foodId) window.Sorrel.diary.addToRecent(foodId);
}

function updateMealCalories(mealName, calories) {
  const elem = document.getElementById(`${mealName}-calories`);
  if (elem) elem.textContent = `${Math.round(calories)} cals`;
}

function getYesterdayMealEntries(mealName) {
  const diary = getDiary();
  if (!diary || !diary.entries) return [];
  const today = todayISO();
  if (!today) return [];
  const todayDate = new Date(today + 'T00:00:00');
  const yesterdayDate = new Date(todayDate.getTime() - 86400000);
  const yesterdayISO = toLocalISO(yesterdayDate);
  const dateEntry = diary.entries[yesterdayISO];
  if (!dateEntry || !dateEntry[mealName]) return [];
  return dateEntry[mealName];
}

function repeatYesterdayMeal(mealName) {
  const entries = getYesterdayMealEntries(mealName);
  if (!entries || entries.length === 0) return;

  const diary = getDiary();
  ensureDate(diary.currentDate);
  const todayEntry = diary.entries[diary.currentDate];
  if (!todayEntry[mealName]) todayEntry[mealName] = [];

  entries.forEach(e => {
    todayEntry[mealName].push({ ...e });
  });

  save();
  renderFoodDiary();

  if (typeof window.showLogToast === 'function') {
    window.showLogToast(`Added ${entries.length} food${entries.length !== 1 ? 's' : ''} from yesterday`);
  }
}

export function initSwipeToDelete(container) {
  if (!container) return;
  const rows = container.querySelectorAll('.diary-row-front');
  rows.forEach(row => {
    if (row.dataset.swipeInit === '1') return;
    row.dataset.swipeInit = '1';

    let startX = 0, startY = 0, currentX = 0;
    let isSwiping = false, gestureDir = null;
    const REVEAL = 88;
    const THRESHOLD = 44;

    const onStart = (e) => {
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX;
      startY = t.clientY;
      currentX = startX;
      isSwiping = true;
      gestureDir = null;
      row.style.transition = 'none';
    };

    const onMove = (e) => {
      if (!isSwiping) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (gestureDir === null) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          gestureDir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        }
      }

      if (gestureDir === 'v') return;

      if (gestureDir === 'h') {
        if (e.cancelable) e.preventDefault();
        const isOpen = row.dataset.swipeOpen === '1';
        const baseX = isOpen ? -REVEAL : 0;
        let nextX = baseX + dx;
        if (nextX > 0) nextX = 0;
        if (nextX < -REVEAL * 1.2) nextX = -REVEAL * 1.2;
        currentX = nextX;
        row.style.transform = 'translateX(' + nextX + 'px)';
      }
    };

    const onEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;
      row.style.transition = 'transform 0.2s ease';

      if (currentX < -THRESHOLD) {
        row.style.transform = 'translateX(-' + REVEAL + 'px)';
        row.dataset.swipeOpen = '1';
      } else {
        row.style.transform = 'translateX(0)';
        row.dataset.swipeOpen = '0';
      }
    };

    row.addEventListener('touchstart', onStart, { passive: true });
    row.addEventListener('touchmove', onMove, { passive: false });
    row.addEventListener('touchend', onEnd, { passive: true });
    row.addEventListener('touchcancel', onEnd, { passive: true });

    row.addEventListener('click', (e) => {
      if (row.dataset.swipeOpen === '1') {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        e.stopPropagation();
        row.style.transition = 'transform 0.2s ease';
        row.style.transform = 'translateX(0)';
        row.dataset.swipeOpen = '0';
      }
    }, true);
  });
}

export function renderMealFoods(mealName, foods, isFirstUseEver) {
  const container = document.getElementById(`${mealName}-foods`);
  if (!container) return;

  if (!foods || foods.length === 0) {
    const showHint = isFirstUseEver && mealName === 'breakfast';

    if (showHint) {
      container.innerHTML = `
        <div onclick="openFoodSearch('${mealName}')"
             style="padding: 22px 16px; text-align: center; background: linear-gradient(135deg, #e7f5ee, #fafbfc); border-radius: 8px; border: 2px dashed #0a7d5a; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;"
             onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px rgba(10,125,90,0.18)';"
             onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none';">
          <div style="font-size: 36px; margin-bottom: 8px;">👋</div>
          <div style="font-weight: 700; color: #1a2332; margin-bottom: 6px; font-size: 16px;">Log your first food</div>
          <div style="font-size: 13px; color: #5a6573; line-height: 1.4; max-width: 280px; margin: 0 auto 14px;">
            Search a food, pick a serving, save. Most logs take under 5 seconds.
          </div>
          <button onclick="event.stopPropagation();openFoodSearch('${mealName}')"
                  style="padding: 10px 22px; min-height: 44px; background: var(--accent-gradient); color: white; border: none; border-radius: 24px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 3px 10px rgba(10,125,90,0.3);">
            + Log breakfast
          </button>
          <div style="font-size: 11px; color: #94a0ad; margin-top: 12px;">
            Your most-used foods will appear here as Recents for instant logging.
          </div>
        </div>
      `;
    } else {
      const yesterdayEntries = getYesterdayMealEntries(mealName);
      const hasYesterday = yesterdayEntries && yesterdayEntries.length > 0;

      container.innerHTML = `
        <div style="padding: 14px; text-align: center; color: #94a0ad; font-size: 13px;">
          <span style="opacity: 0.6;">No foods logged.</span>
          <button onclick="openFoodSearch('${mealName}')" style="margin-left:6px;background:none;border:none;color:#0a7d5a;font-weight:600;cursor:pointer;font-size:13px;">+ Add</button>
        </div>
        ${hasYesterday ? `
          <div onclick="repeatYesterdayMeal('${mealName}')"
               style="margin:0 12px 12px 12px;padding:10px 14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:background 0.15s,transform 0.1s;"
               onmouseover="this.style.background='var(--accent-soft)'" onmouseout="this.style.background='var(--bg-elevated)'">
            <div style="font-size:20px;line-height:1;">↻</div>
            <div style="flex:1;min-width:0;text-align:left;">
              <div style="font-size:13px;font-weight:600;color:var(--text-primary);">Repeat yesterday</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">${escapeHtml(yesterdayEntries.map(e => e.name).slice(0, 3).join(', '))}${yesterdayEntries.length > 3 ? '…' : ''}</div>
            </div>
            <div style="font-size:12px;color:var(--accent-primary);font-weight:600;">Add all</div>
          </div>
        ` : ''}
      `;
    }
    updateMealCalories(mealName, 0);
    return;
  }

  let html = '';
  let totalCals = 0;

  foods.forEach((entry, index) => {
    totalCals += entry.calories;
    const rowId = mealName + '-row-' + index;

    const foodDatabase = window.foodDatabase;
    const isEditable = !entry._sourcePlan && entry.foodId && typeof foodDatabase !== 'undefined' && foodDatabase[entry.foodId];

    html += `
      <div class="diary-row-wrap" data-meal="${mealName}" data-index="${index}"
           style="position:relative;overflow:hidden;border-bottom:1px solid #f0f0f0;background:#dc2626;">
        <div onclick="deleteFoodEntry('${mealName}', ${index})"
             style="position:absolute;right:0;top:0;bottom:0;width:88px;background:#dc2626;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;cursor:pointer;z-index:1;">
          🗑️ Delete
        </div>
        <div id="${rowId}" class="diary-row-front"
             style="position:relative;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:white;z-index:2;transform:translateX(0);transition:transform 0.2s ease;touch-action:pan-y;">
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:14px;color:#1a2332;margin-bottom:2px;">
              ${entry.name}${entry._sourcePlan ? ' <span style="font-size:10px;color:var(--accent-primary);font-weight:500;background:var(--accent-soft);padding:2px 6px;border-radius:4px;margin-left:4px;">PLANNED</span>' : ''}
            </div>
            <div style="font-size:12px;color:#5a6573;">
              ${entry.serving} × ${entry.quantity} = ${entry.calories} cal | ${entry.protein}p ${entry.carbs}c ${entry.fat}f
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0;">
            ${isEditable ? `<button onclick="editFoodEntry('${mealName}', ${index})"
                    style="background:#0a7d5a;color:white;border:none;padding:10px 14px;min-height:40px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">
              Edit
            </button>` : ''}
            <button onclick="deleteFoodEntry('${mealName}', ${index})"
                    style="background:#dc2626;color:white;border:none;padding:10px 14px;min-height:40px;min-width:40px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">
              ×
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateMealCalories(mealName, totalCals);

  initSwipeToDelete(container);
}

export function renderFoodDiary() {
  const diary = getDiary();
  const dateEl = document.getElementById('diary-current-date');
  if (dateEl) dateEl.textContent = formatDiaryDate(diary.currentDate);

  const banner = document.getElementById('diary-streak-banner');
  if (banner) {
    const streak = (typeof window.getLoggingStreak === 'function') ? window.getLoggingStreak() : 0;
    const today = todayISO();
    const isViewingToday = diary.currentDate === today;
    const todayHasEntries = today && diary.entries[today] && (
      (diary.entries[today].breakfast || []).length +
      (diary.entries[today].lunch || []).length +
      (diary.entries[today].dinner || []).length +
      (diary.entries[today].snacks || []).length
    ) > 0;

    if (streak >= 2) {
      const atRisk = isViewingToday && !todayHasEntries;
      banner.style.display = 'block';
      banner.innerHTML = `
        <div style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;padding:14px 16px;border-radius:12px;display:flex;align-items:center;gap:14px;">
          <div style="font-size:28px;line-height:1;">🔥</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:16px;font-weight:700;">${streak}-day logging streak</div>
            <div style="font-size:12px;opacity:0.92;margin-top:2px;">
              ${atRisk ? "Log a meal today to keep it going" : "Keep it up — consistency wins"}
            </div>
          </div>
        </div>
      `;
    } else if (streak === 1 && isViewingToday) {
      banner.style.display = 'block';
      banner.innerHTML = `
        <div style="background:#fff8e1;border:1px solid #ffe082;color:#5d4037;padding:12px 16px;border-radius:12px;display:flex;align-items:center;gap:12px;">
          <div style="font-size:24px;">🌱</div>
          <div style="flex:1;font-size:13px;">
            <strong>Day 1 logged.</strong> Log tomorrow to start a streak.
          </div>
        </div>
      `;
    } else {
      banner.style.display = 'none';
      banner.innerHTML = '';
    }
  }

  let dateEntry = diary.entries[diary.currentDate];
  if (!dateEntry) {
    ensureDate(diary.currentDate);
    dateEntry = diary.entries[diary.currentDate];
  }

  const totalEntries = (dateEntry.breakfast || []).length +
                       (dateEntry.lunch || []).length +
                       (dateEntry.dinner || []).length +
                       (dateEntry.snacks || []).length;
  const isFirstUseEver = totalEntries === 0 &&
                          (!diary.recentFoods || diary.recentFoods.length === 0);

  renderMealFoods('breakfast', dateEntry.breakfast, isFirstUseEver);
  renderMealFoods('lunch', dateEntry.lunch, isFirstUseEver);
  renderMealFoods('dinner', dateEntry.dinner, isFirstUseEver);
  renderMealFoods('snacks', dateEntry.snacks, isFirstUseEver);

  updateMacroSummary();
}

export function calculateDailyTotals() {
  const diary = getDiary();
  const dateEntry = diary.entries[diary.currentDate];
  if (!dateEntry) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
    if (dateEntry[meal]) {
      dateEntry[meal].forEach(entry => {
        totals.calories += entry.calories;
        totals.protein += entry.protein;
        totals.carbs += entry.carbs;
        totals.fat += entry.fat;
      });
    }
  });
  return totals;
}

export function updateMacroSummary() {
  const totals = calculateDailyTotals();
  const profile = window.Sorrel.getProfile();
  if (!profile) return;

  const diary = getDiary();
  let goals;
  const viewingToday = diary.currentDate === todayISO();
  if (viewingToday && typeof window.getEffectiveMacrosForToday === 'function') {
    const effective = window.getEffectiveMacrosForToday();
    if (effective) {
      goals = {
        calories: effective.calories || profile.targetCalories || profile.calories || 2200,
        protein: effective.protein || profile.protein || 165,
        carbs: effective.carbs || profile.carbs || 220,
        fat: effective.fat || profile.fat || 73,
        adjusted: !!effective.adjusted,
        level: effective.level
      };
    }
  }
  if (!goals) {
    goals = {
      calories: profile.targetCalories || profile.calories || 2200,
      protein: profile.protein || 165,
      carbs: profile.carbs || 220,
      fat: profile.fat || 73,
      adjusted: false
    };
  }

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const setWidth = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.style.width = value;
  };

  setText('diary-calories-consumed', Math.round(totals.calories));
  setText('diary-calories-goal', goals.calories);
  setText('diary-protein', Math.round(totals.protein) + 'g');
  setText('diary-protein-goal', '/ ' + goals.protein + 'g');
  setText('diary-carbs', Math.round(totals.carbs) + 'g');
  setText('diary-carbs-goal', '/ ' + goals.carbs + 'g');
  setText('diary-fat', Math.round(totals.fat) + 'g');
  setText('diary-fat-goal', '/ ' + goals.fat + 'g');

  const proteinPercent = Math.min((totals.protein / goals.protein) * 100, 100);
  const carbsPercent = Math.min((totals.carbs / goals.carbs) * 100, 100);
  const fatPercent = Math.min((totals.fat / goals.fat) * 100, 100);
  setWidth('diary-protein-bar', proteinPercent + '%');
  setWidth('diary-carbs-bar', carbsPercent + '%');
  setWidth('diary-fat-bar', fatPercent + '%');

  const goalElement = document.getElementById('diary-calories-goal');
  if (goalElement) {
    const existingBadge = document.getElementById('diary-recovery-badge');
    if (existingBadge) existingBadge.remove();

    if (goals.adjusted && goals.level) {
      const levelEmojis = { optimal: '🟢', good: '🟡', low: '🟠', depleted: '🔴' };
      const levelLabels = { optimal: 'optimal recovery', good: 'good recovery', low: 'low recovery', depleted: 'depleted' };
      const badge = document.createElement('span');
      badge.id = 'diary-recovery-badge';
      badge.title = "Today's targets adjusted for " + (levelLabels[goals.level] || goals.level);
      badge.style.cssText = 'display:inline-block;margin-left:8px;padding:2px 8px;background:#fef3c7;border-radius:10px;font-size:11px;font-weight:600;color:#856404;cursor:help;';
      badge.textContent = (levelEmojis[goals.level] || '⚡') + ' adjusted';
      goalElement.parentNode.insertBefore(badge, goalElement.nextSibling);
    }
  }

  const ringProtein = document.getElementById('ring-protein');
  const ringCarbs   = document.getElementById('ring-carbs');
  const ringFat     = document.getElementById('ring-fat');

  if (ringProtein || ringCarbs || ringFat) {
    const fillArc = (radius, pct) => {
      const circumference = 2 * Math.PI * radius;
      const filled = Math.min(Math.max(pct, 0), 1) * circumference;
      return `${filled.toFixed(1)} ${(circumference - filled).toFixed(1)}`;
    };

    if (ringProtein) ringProtein.setAttribute('stroke-dasharray', fillArc(86, totals.protein / goals.protein));
    if (ringCarbs)   ringCarbs.setAttribute('stroke-dasharray',   fillArc(68, totals.carbs   / goals.carbs));
    if (ringFat)     ringFat.setAttribute('stroke-dasharray',     fillArc(50, totals.fat     / goals.fat));

    const calCurrent  = document.getElementById('rings-cal-current');
    const calTargetEl = document.getElementById('rings-cal-target');
    const pTargetEl   = document.getElementById('rings-protein-target');
    const cTargetEl   = document.getElementById('rings-carbs-target');
    const fTargetEl   = document.getElementById('rings-fat-target');
    const pCurrentEl  = document.getElementById('protein-today');
    const cCurrentEl  = document.getElementById('carbs-today');
    const fCurrentEl  = document.getElementById('fat-today');

    if (calCurrent)  calCurrent.textContent  = Math.round(totals.calories);
    if (calTargetEl) calTargetEl.textContent = goals.calories;
    if (pTargetEl)   pTargetEl.textContent   = goals.protein;
    if (cTargetEl)   cTargetEl.textContent   = goals.carbs;
    if (fTargetEl)   fTargetEl.textContent   = goals.fat;
    if (pCurrentEl)  pCurrentEl.textContent  = Math.round(totals.protein) + 'g';
    if (cCurrentEl)  cCurrentEl.textContent  = Math.round(totals.carbs)   + 'g';
    if (fCurrentEl)  fCurrentEl.textContent  = Math.round(totals.fat)     + 'g';

    const legacyCal = document.getElementById('calories-today');
    if (legacyCal) legacyCal.textContent = Math.round(totals.calories);
  }
}

function toggleMultiAddMode() {
  multiAddState.active = !multiAddState.active;
  if (!multiAddState.active) multiAddState.selected = [];
  updateMultiAddBar();
  let activeTabId = null;
  for (const id of ['tab-all','tab-recent','tab-favorites','tab-quick']) {
    const el = document.getElementById(id);
    if (el && el.style.background === 'rgb(102, 126, 234)') { activeTabId = id; break; }
  }
  if (activeTabId === 'tab-recent' && typeof window.showRecentFoodsInSearch === 'function') window.showRecentFoodsInSearch();
  else if (activeTabId === 'tab-favorites' && typeof window.showFavoriteFoodsInSearch === 'function') window.showFavoriteFoodsInSearch();
  else if (activeTabId === 'tab-quick' && typeof window.showQuickAddInSearch === 'function') window.showQuickAddInSearch();
  else if (typeof window.showAllFoods === 'function') window.showAllFoods();
}

function toggleMultiAddItem(foodId) {
  const idx = multiAddState.selected.indexOf(foodId);
  if (idx >= 0) multiAddState.selected.splice(idx, 1);
  else multiAddState.selected.push(foodId);
  updateMultiAddBar();
  const row = document.getElementById('food-row-' + foodId);
  if (row) {
    const checked = multiAddState.selected.includes(foodId);
    row.style.background = checked ? '#e8f0ff' : 'white';
    row.style.borderLeft = checked ? '4px solid #0a7d5a' : '4px solid transparent';
    const checkmark = row.querySelector('.multi-add-check');
    if (checkmark) checkmark.textContent = checked ? '✓' : '';
  }
}

function updateMultiAddBar() {
  let bar = document.getElementById('multi-add-bar');
  const toggleBtn = document.getElementById('multi-add-toggle');

  if (toggleBtn) {
    toggleBtn.textContent = multiAddState.active ? '✕ Cancel' : '☰ Multi-add';
    toggleBtn.style.background = multiAddState.active ? '#dc2626' : '';
    toggleBtn.style.color = multiAddState.active ? 'white' : '';
  }

  if (multiAddState.active && multiAddState.selected.length > 0) {
    const diary = getDiary();
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'multi-add-bar';
      bar.style.cssText = 'position:sticky;bottom:0;left:0;right:0;background:var(--accent-gradient);color:white;padding:14px 16px;border-radius:12px;display:flex;align-items:center;gap:12px;box-shadow:0 -4px 12px rgba(0,0,0,0.1);margin-top:12px;z-index:10;';
      const resultsContainer = document.getElementById('food-search-results');
      if (resultsContainer && resultsContainer.parentNode) {
        resultsContainer.parentNode.insertBefore(bar, resultsContainer.nextSibling);
      }
    }
    bar.innerHTML = `
      <div style="flex:1;font-weight:600;font-size:14px;">${multiAddState.selected.length} selected</div>
      <button onclick="commitMultiAdd()" style="padding:10px 18px;background:white;color:#0a7d5a;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;">
        Add to ${(diary.currentMeal || '').charAt(0).toUpperCase() + (diary.currentMeal || '').slice(1)}
      </button>
    `;
  } else if (bar) {
    bar.remove();
  }
}

function commitMultiAdd() {
  if (multiAddState.selected.length === 0) return;

  const diary = getDiary();
  ensureDate(diary.currentDate);
  const mealKey = diary.currentMeal;
  const foodDatabase = window.foodDatabase || {};

  multiAddState.selected.forEach(foodId => {
    const food = foodDatabase[foodId];
    if (!food) return;
    const entry = {
      foodId,
      name: food.name,
      serving: food.baseServing,
      quantity: 1,
      calories: Math.round(food.calories || 0),
      protein: Math.round(food.protein || 0),
      carbs: Math.round(food.carbs || 0),
      fat: Math.round(food.fat || 0)
    };
    diary.entries[diary.currentDate][mealKey].push(entry);
    addToRecent(foodId);
  });

  save();

  const count = multiAddState.selected.length;
  multiAddState = { active: false, selected: [] };

  if (typeof window.closeFoodSearch === 'function') window.closeFoodSearch();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();

  if (typeof window.showLogToast === 'function') {
    window.showLogToast(`Added ${count} food${count === 1 ? '' : 's'}`);
  }
}

function getYesterdayISO() {
  const diary = getDiary();
  const d = new Date(diary.currentDate + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return toLocalISO(d);
}

function getYesterdayMealEntriesForCurrent() {
  const diary = getDiary();
  const yesterday = getYesterdayISO();
  const dayEntry = diary.entries[yesterday];
  const mealKey = diary.currentMeal;
  if (!dayEntry || !dayEntry[mealKey] || dayEntry[mealKey].length === 0) return null;
  return dayEntry[mealKey];
}

function updateCopyYesterdayUI() {
  const btn = document.getElementById('copy-yesterday-btn');
  if (!btn) return;
  const entries = getYesterdayMealEntriesForCurrent();
  if (entries && entries.length > 0) {
    btn.style.display = '';
    btn.textContent = `📋 Copy yesterday (${entries.length} item${entries.length === 1 ? '' : 's'})`;
  } else {
    btn.style.display = 'none';
  }
}

function copyYesterdayMeal() {
  const entries = getYesterdayMealEntriesForCurrent();
  if (!entries || entries.length === 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Nothing to copy from yesterday');
    return;
  }

  const diary = getDiary();
  ensureDate(diary.currentDate);
  const mealKey = diary.currentMeal;

  entries.forEach(srcEntry => {
    const cloned = {
      foodId: srcEntry.foodId,
      name: srcEntry.name,
      serving: srcEntry.serving,
      quantity: srcEntry.quantity,
      calories: srcEntry.calories,
      protein: srcEntry.protein,
      carbs: srcEntry.carbs,
      fat: srcEntry.fat
    };
    diary.entries[diary.currentDate][mealKey].push(cloned);
    if (cloned.foodId) addToRecent(cloned.foodId);
  });

  save();
  if (typeof window.closeFoodSearch === 'function') window.closeFoodSearch();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.showLogToast === 'function') window.showLogToast(`Copied ${entries.length} item${entries.length === 1 ? '' : 's'} from yesterday`);
}

function addQuickCalories() {
  const calories = parseFloat(document.getElementById('quick-calories').value) || 0;
  const protein = parseFloat(document.getElementById('quick-protein').value) || 0;
  const carbs = parseFloat(document.getElementById('quick-carbs').value) || 0;
  const fat = parseFloat(document.getElementById('quick-fat').value) || 0;

  if (calories === 0) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Enter at least calories');
    else alert('Please enter calories');
    return;
  }

  const entry = {
    foodId: 'quick_add_' + Date.now(),
    name: 'Quick Add',
    serving: 'N/A',
    quantity: 1,
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat)
  };

  const diary = getDiary();
  ensureDate(diary.currentDate);
  diary.entries[diary.currentDate][diary.currentMeal].push(entry);

  save();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.closeFoodSearch === 'function') window.closeFoodSearch();
}

function copyYesterdayMeals() {
  const diary = getDiary();
  const yesterday = new Date(diary.currentDate + 'T00:00:00');
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalISO(yesterday);

  if (!diary.entries[yesterdayStr]) {
    if (typeof window.showLogToast === 'function') window.showLogToast('No foods logged yesterday');
    else alert('No foods logged yesterday');
    return;
  }

  if (!confirm('Copy all meals from yesterday to today?')) return;

  ensureDate(diary.currentDate);

  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
    if (diary.entries[yesterdayStr][meal]) {
      diary.entries[diary.currentDate][meal] =
        JSON.parse(JSON.stringify(diary.entries[yesterdayStr][meal]));
    }
  });

  save();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.showLogToast === 'function') window.showLogToast('Meals copied from yesterday');
  else alert('Meals copied from yesterday');
}

export function changeDiaryDate(days) {
  const diary = getDiary();
  const d = new Date(diary.currentDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const newDate = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
  diary.currentDate = newDate;
  // Keep monolith's foodDiary in sync so its food-log functions target the right date.
  if (window.foodDiary) window.foodDiary.currentDate = newDate;
  ensureDate(newDate);
  renderFoodDiary();
}

export function openFoodSearch(mealName) {
  // Sync to monolith's foodDiary — its food-log functions (addFoodFromSearch etc.) read from it.
  if (window.foodDiary) {
    window.foodDiary.currentMeal = mealName;
    window.foodDiary.editingEntry = null;
  }
  // Reset multi-add state so each session starts clean.
  multiAddState = { active: false, selected: [] };

  const cap = mealName.charAt(0).toUpperCase() + mealName.slice(1);
  const mealEl = document.getElementById('food-search-meal-name');
  const quickEl = document.getElementById('quick-add-meal-name');
  if (mealEl) mealEl.textContent = cap;
  if (quickEl) quickEl.textContent = cap;
  const searchInput = document.getElementById('food-search-input');
  if (searchInput) searchInput.value = '';

  const recentFoods = window.foodDiary ? window.foodDiary.recentFoods : [];
  let willFocusInput = false;
  if (recentFoods && recentFoods.length > 0) {
    if (typeof window.showRecentFoodsInSearch === 'function') window.showRecentFoodsInSearch();
  } else {
    if (typeof window.showAllFoods === 'function') window.showAllFoods();
    willFocusInput = true;
  }

  if (typeof window.updateCopyYesterdayUI === 'function') window.updateCopyYesterdayUI();
  if (typeof window.updateMultiAddBar === 'function') window.updateMultiAddBar();

  const modal = document.getElementById('foodSearchModal');
  if (modal) modal.style.display = 'block';

  if (willFocusInput) {
    setTimeout(() => {
      const input = document.getElementById('food-search-input');
      if (input) input.focus();
    }, 100);
  }
}

export const render = renderFoodDiary;

// --- Slice 15 Phase A: B2/B3 food mutation lifts ---
// Source: index.html L10700-10792 (B2 logPlannedMeal/unlogPlannedMeal) and
// L11116-11193 (B3 editFoodEntry/lastDeletedEntry/deleteFoodEntry/undoLastDelete).
// Body preserved verbatim from monolith; state read via window.foodDiary /
// window.profile / window.state to match the slice-14 bridge.

export function logPlannedMeal(mealType, dayIdx) {
  const profile = window.profile;
  if (!profile || !profile.weekPlan || !profile.weekPlan[dayIdx]) return;
  const planned = profile.weekPlan[dayIdx][mealType];
  if (!planned || !planned.meal || !planned.macros) return;

  const foodDiary = window.foodDiary;
  if (!foodDiary) return;
  // v1.4: Always log to TODAY, not foodDiary.currentDate.
  const today = todayISO();
  if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(today);

  const m = planned.macros;
  const mealName = planned.meal.name || (mealType.charAt(0).toUpperCase() + mealType.slice(1));

  let slotKey = mealType;
  if (mealType === 'snack') slotKey = 'snacks';

  if (!foodDiary.entries[today][slotKey]) {
    foodDiary.entries[today][slotKey] = [];
  }
  const slot = foodDiary.entries[today][slotKey];

  // v1.4.1 idempotence — if today already has a _sourcePlan entry for this
  // meal, don't push another.
  const alreadyLogged = slot.some(e => e && e._sourcePlan && e.name === mealName);
  if (alreadyLogged) {
    if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
    if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
    return;
  }

  const entry = {
    foodId: 'planned-' + mealType + '-' + Date.now(),
    name: mealName,
    serving: '1 serving (planned)',
    quantity: 1,
    calories: m.calories || 0,
    protein: m.protein || 0,
    carbs: m.carbs || 0,
    fat: m.fat || 0,
    timestamp: Date.now(),
    _sourcePlan: true
  };
  slot.push(entry);
  // v1.6.2: explicit plan-log marker for UI state reliability.
  const state = window.state;
  if (state) {
    if (!state.plannedMealLog) state.plannedMealLog = {};
    if (!state.plannedMealLog[today]) state.plannedMealLog[today] = {};
    state.plannedMealLog[today][mealType] = mealName;
  }
  console.log(`📝 Logged: type=${mealType} → slot=${slotKey} · name="${entry.name}" · ${entry.calories}cal`);

  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.showLogToast === 'function') window.showLogToast(`✓ ${entry.name} logged`);
}

export function unlogPlannedMeal(mealType, mealName) {
  const foodDiary = window.foodDiary;
  if (!foodDiary || !foodDiary.entries) return;
  const today = todayISO();
  const dayEntry = foodDiary.entries[today];
  if (!dayEntry) return;

  let slotKey = mealType;
  if (mealType === 'snack') slotKey = 'snacks';
  const slot = dayEntry[slotKey] || [];

  // v1.4.1 — remove ALL _sourcePlan entries matching this meal name.
  for (let i = slot.length - 1; i >= 0; i--) {
    if (slot[i] && slot[i]._sourcePlan && slot[i].name === mealName) {
      slot.splice(i, 1);
    }
  }
  const state = window.state;
  if (state && state.plannedMealLog && state.plannedMealLog[today]) {
    delete state.plannedMealLog[today][mealType];
  }

  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (typeof window.showLogToast === 'function') window.showLogToast(`↶ Unlogged ${mealName}`);
}

export function editFoodEntry(mealName, entryIndex) {
  const foodDiary = window.foodDiary;
  if (!foodDiary) return;
  const dateEntry = foodDiary.entries[foodDiary.currentDate];
  const entry = dateEntry && dateEntry[mealName] && dateEntry[mealName][entryIndex];
  if (!entry) return;

  // Planned meals route back to Plan tab — they don't edit through food detail.
  if (entry._sourcePlan) {
    if (typeof window.showLogToast === 'function') {
      window.showLogToast('Planned meal — tap Undo on the Plan tab to remove, or delete here to clear');
    }
    return;
  }

  // Quick-add entries aren't in foodDatabase — surface a graceful message.
  const foodDatabase = window.foodDatabase || {};
  if (!entry.foodId || !foodDatabase[entry.foodId]) {
    if (typeof window.showLogToast === 'function') {
      window.showLogToast("Quick-add entries can't be edited — delete and re-add");
    }
    return;
  }

  foodDiary.editingEntry = { meal: mealName, index: entryIndex };
  foodDiary.currentMeal = mealName;

  if (typeof window.selectFood === 'function') window.selectFood(entry.foodId);

  const qtyInput = document.getElementById('num-servings');
  if (qtyInput) qtyInput.value = entry.quantity;
  if (typeof window.updateFoodDetailNutrition === 'function') window.updateFoodDetailNutrition();
}

// Stash the most recent deletion so Undo can restore it.
let lastDeletedEntry = null;

export function deleteFoodEntry(mealName, entryIndex) {
  const foodDiary = window.foodDiary;
  if (!foodDiary) return;
  const arr = foodDiary.entries[foodDiary.currentDate] && foodDiary.entries[foodDiary.currentDate][mealName];
  if (!arr || !arr[entryIndex]) return;

  lastDeletedEntry = {
    date: foodDiary.currentDate,
    meal: mealName,
    index: entryIndex,
    entry: { ...arr[entryIndex] },
    expiresAt: Date.now() + 6000
  };

  arr.splice(entryIndex, 1);
  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.showUndoToast === 'function') {
    window.showUndoToast('Removed ' + (lastDeletedEntry.entry.name || 'entry'), undoLastDelete);
  }
}

export function undoLastDelete() {
  if (!lastDeletedEntry || Date.now() > lastDeletedEntry.expiresAt) {
    if (typeof window.showLogToast === 'function') window.showLogToast('Nothing to undo');
    return;
  }
  const foodDiary = window.foodDiary;
  if (!foodDiary) return;
  const { date, meal, index, entry } = lastDeletedEntry;
  if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(date);
  foodDiary.entries[date][meal].splice(index, 0, entry);
  lastDeletedEntry = null;
  if (typeof window.saveFoodDiary === 'function') window.saveFoodDiary();
  if (typeof window.refreshAfterFoodLog === 'function') window.refreshAfterFoodLog();
  if (typeof window.showLogToast === 'function') window.showLogToast('Restored');
}

// Expose for inline onclick handlers in monolith HTML.
window.openFoodSearch = openFoodSearch;
window.repeatYesterdayMeal = repeatYesterdayMeal;
window.toggleMultiAddMode = toggleMultiAddMode;
window.toggleMultiAddItem = toggleMultiAddItem;
window.updateMultiAddBar = updateMultiAddBar;
window.commitMultiAdd = commitMultiAdd;
window.updateCopyYesterdayUI = updateCopyYesterdayUI;
window.copyYesterdayMeal = copyYesterdayMeal;
window.addQuickCalories = addQuickCalories;
window.copyYesterdayMeals = copyYesterdayMeals;
window.logPlannedMeal = logPlannedMeal;
window.unlogPlannedMeal = unlogPlannedMeal;
window.editFoodEntry = editFoodEntry;
window.deleteFoodEntry = deleteFoodEntry;
window.undoLastDelete = undoLastDelete;
