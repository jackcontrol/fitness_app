// Coaching helpers — lifted from V1617 IIFE (L36465-36516).
//
// nextMeal / nextRoutineAction / nextLogAction / usefulLogsLeft drive
// the Plan tab's "Today's next steps" card (renderPlanNextSteps).

import { appState, appProfile } from '../state/accessors.js';
import { localDateKey } from '../utils/dates.js';

function currentWeekDayIndex() {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}

function getTodayPlanDay() {
  const p = appProfile();
  const plan = p && Array.isArray(p.weekPlan) ? p.weekPlan : [];
  if (!plan.length) return null;
  return plan[Math.min(plan.length - 1, currentWeekDayIndex())] || plan[0];
}

function mealName(slot) {
  return (slot && slot.meal && slot.meal.name) || (slot && slot.name) || (slot && slot.key) || 'planned meal';
}

function mealTimeLabel(type) {
  return type === 'breakfast' ? '8:00 AM'
    : type === 'lunch' ? '12:30 PM'
    : type === 'dinner' ? '6:30 PM'
    : '3:30 PM';
}

export function nextMeal() {
  const day = getTodayPlanDay();
  if (!day) return { type: 'meal', name: 'Review today’s meal plan', time: '' };
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  const slots = [
    { type: 'breakfast', due: 8, slot: day.breakfast },
    { type: 'lunch', due: 12.5, slot: day.lunch },
    { type: 'snack', due: 15.5, slot: day.snack },
    { type: 'dinner', due: 18.5, slot: day.dinner },
  ];
  const pick = slots.find((s) => h <= s.due + 1) || slots[slots.length - 1];
  return { type: pick.type, name: mealName(pick.slot), time: mealTimeLabel(pick.type) };
}

export function nextRoutineAction() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < 9.5) return 'Get morning light for 5–10 minutes.';
  if (h < 12) return 'Hydrate and follow your morning routine.';
  if (h < 15) return 'Take a short walk or movement break.';
  if (h < 17.5) return 'Check hydration and plan dinner timing.';
  if (h < 20) return 'Finish the last meal about 3 hours before bed.';
  if (h < 21.5) return 'Dim lights and lower stimulation.';
  if (h < 22.25) return 'Wind down: screens off, reading, or light stretching.';
  return 'Keep bedtime consistent tonight.';
}

export function nextLogAction() {
  const st = appState() || {};
  const d = localDateKey();
  if (!st.weightLog || !st.weightLog[d]) return 'Weight is the next useful log.';
  const sun = (st.sunlightLog || {})[d] || {};
  if (!sun.morning && !sun.midday) return 'Sunlight is the next useful log.';
  const hyd = (st.hydrationByDate || {})[d] || (st.hydration || {})[d] || {};
  const oz = Number(hyd.oz || 0);
  if (oz < 16) return 'Water is the next useful log.';
  return 'Log your next planned meal when you eat it.';
}

export function usefulLogsLeft() {
  const st = appState() || {};
  const d = localDateKey();
  let left = 0;
  if (!st.weightLog || !st.weightLog[d]) left++;
  const sun = (st.sunlightLog || {})[d] || {};
  if (!sun.morning && !sun.midday) left++;
  const hyd = (st.hydrationByDate || {})[d] || {};
  if (Number(hyd.oz || 0) < 16) left++;
  const meals = (st.meals || {})[d] || {};
  if (!meals.breakfast && !meals.lunch && !meals.dinner && !meals.snack && !meals.snacks) left++;
  return left;
}
