// Analytics tab — weight/calorie/macro/exercise charts, adherence, weekly comparison.
// Lifted from index.html L14499-15050.
//
// Reads:
//   state.checkins        → window.Sorrel.loadState().checkins
//   foodDiary.entries     → window.Sorrel.diary.getDiary().entries
//   exerciseLog.entries   → window.Sorrel.training.getExerciseLog().entries
//   profile               → window.Sorrel.getProfile()
//   Chart                 → window.Chart (vendored in main.js)

import { toLocalISO } from '../utils/dates.js';

const analyticsState = {
  currentRange: 30,
  charts: {}
};

export function setAnalyticsRange(days) {
  analyticsState.currentRange = days;

  [7, 14, 30, 90].forEach(d => {
    const btn = document.getElementById(`range-${d}`);
    if (btn) {
      if (d === days) {
        btn.style.background = '#0a7d5a';
        btn.style.color = 'white';
      } else {
        btn.style.background = '#e8e2d6';
        btn.style.color = '#495057';
      }
    }
  });

  const periodText = days === 7 ? 'Last 7 Days' :
                     days === 14 ? 'Last 14 Days' :
                     days === 30 ? 'Last 30 Days' : 'Last 90 Days';
  const periodEl = document.getElementById('analytics-period');
  if (periodEl) periodEl.textContent = periodText;

  renderAllAnalytics();
}

function gatherAnalyticsData(days) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const state = window.Sorrel.loadState();
  const diary = window.Sorrel.diary.getDiary();
  const exerciseLog = window.Sorrel.training.getExerciseLog();

  const data = {
    weight: [],
    calories: [],
    macros: { protein: [], carbs: [], fat: [] },
    exercise: [],
    dates: []
  };

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = toLocalISO(d);
    data.dates.push(dateStr);

    const checkin = (state.checkins || []).find(c => c.date.split('T')[0] === dateStr);
    if (checkin) {
      data.weight.push({ date: dateStr, weight: checkin.weight });
    }

    if (diary.entries[dateStr]) {
      const entry = diary.entries[dateStr];
      let dayCalories = 0;
      let dayProtein = 0;
      let dayCarbs = 0;
      let dayFat = 0;

      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        if (entry[meal]) {
          entry[meal].forEach(food => {
            dayCalories += food.calories;
            dayProtein += food.protein;
            dayCarbs += food.carbs;
            dayFat += food.fat;
          });
        }
      });

      if (dayCalories > 0) {
        data.calories.push({ date: dateStr, calories: dayCalories });
        data.macros.protein.push({ date: dateStr, value: dayProtein });
        data.macros.carbs.push({ date: dateStr, value: dayCarbs });
        data.macros.fat.push({ date: dateStr, value: dayFat });
      }
    }

    if (exerciseLog.entries[dateStr]) {
      const entry = exerciseLog.entries[dateStr];
      let dayBurn = 0;

      if (entry.cardio) {
        entry.cardio.forEach(ex => dayBurn += ex.calories);
      }

      if (entry.strength) {
        entry.strength.forEach(ex => {
          const volume = ex.sets * ex.reps * ex.weight;
          dayBurn += Math.round(volume / 100);
        });
      }

      if (dayBurn > 0) {
        data.exercise.push({ date: dateStr, calories: dayBurn });
      }
    }
  }

  return data;
}

function updateSummaryStats(data) {
  const avgCals = data.calories.length > 0
    ? Math.round(data.calories.reduce((sum, d) => sum + d.calories, 0) / data.calories.length)
    : 0;
  const avgCalsEl = document.getElementById('avg-calories');
  if (avgCalsEl) avgCalsEl.textContent = avgCals;

  const totalWorkouts = data.exercise.length;
  const totalEl = document.getElementById('total-workouts');
  if (totalEl) totalEl.textContent = totalWorkouts;

  const avgExercise = data.exercise.length > 0
    ? Math.round(data.exercise.reduce((sum, d) => sum + d.calories, 0) / data.exercise.length)
    : 0;
  const avgNet = avgCals - avgExercise;
  const netEl = document.getElementById('avg-net-cals');
  if (netEl) netEl.textContent = avgNet;

  const loggedEl = document.getElementById('logged-days');
  if (loggedEl) loggedEl.textContent = data.calories.length;
}

function renderWeightChart(weightData) {
  const canvas = document.getElementById('weightChart');
  const emptyDiv = document.getElementById('weight-chart-empty');
  if (!canvas) return;

  if (!weightData || weightData.length === 0) {
    canvas.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }

  canvas.style.display = 'block';
  if (emptyDiv) emptyDiv.style.display = 'none';

  if (analyticsState.charts.weight) analyticsState.charts.weight.destroy();

  const ctx = canvas.getContext('2d');
  analyticsState.charts.weight = new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: weightData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Weight (lbs)',
        data: weightData.map(d => d.weight),
        borderColor: '#0a7d5a',
        backgroundColor: 'rgba(10, 125, 90, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0a7d5a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { callback: v => v + ' lbs', font: { size: 11 } },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderCalorieChart(calorieData) {
  const canvas = document.getElementById('calorieChart');
  const emptyDiv = document.getElementById('calorie-chart-empty');
  if (!canvas) return;

  if (!calorieData || calorieData.length === 0) {
    canvas.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }

  canvas.style.display = 'block';
  if (emptyDiv) emptyDiv.style.display = 'none';

  if (analyticsState.charts.calories) analyticsState.charts.calories.destroy();

  const profile = window.Sorrel.getProfile();
  const calorieGoal = profile ? (profile.targetCalories || profile.calories || 2200) : 2200;

  const ctx = canvas.getContext('2d');
  analyticsState.charts.calories = new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: calorieData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Calories Consumed',
        data: calorieData.map(d => d.calories),
        borderColor: '#e76f51',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#e76f51',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }, {
        label: 'Goal',
        data: calorieData.map(() => calorieGoal),
        borderColor: '#0891b2',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top', labels: { font: { size: 11 }, padding: 10 } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { callback: v => v + ' cal', font: { size: 11 } },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderMacroCharts(macroData) {
  const canvas = document.getElementById('macroChart');
  const canvas2 = document.getElementById('macroTotalChart');
  const emptyDiv = document.getElementById('macro-chart-empty');
  if (!canvas || !canvas2) return;

  if (!macroData.protein.length && !macroData.carbs.length && !macroData.fat.length) {
    canvas.style.display = 'none';
    canvas2.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }

  canvas.style.display = 'block';
  canvas2.style.display = 'block';
  if (emptyDiv) emptyDiv.style.display = 'none';

  const avgProtein = macroData.protein.length > 0
    ? Math.round(macroData.protein.reduce((sum, d) => sum + d.value, 0) / macroData.protein.length)
    : 0;
  const avgCarbs = macroData.carbs.length > 0
    ? Math.round(macroData.carbs.reduce((sum, d) => sum + d.value, 0) / macroData.carbs.length)
    : 0;
  const avgFat = macroData.fat.length > 0
    ? Math.round(macroData.fat.reduce((sum, d) => sum + d.value, 0) / macroData.fat.length)
    : 0;

  const totalProtein = Math.round(macroData.protein.reduce((sum, d) => sum + d.value, 0));
  const totalCarbs = Math.round(macroData.carbs.reduce((sum, d) => sum + d.value, 0));
  const totalFat = Math.round(macroData.fat.reduce((sum, d) => sum + d.value, 0));

  if (analyticsState.charts.macros) analyticsState.charts.macros.destroy();
  if (analyticsState.charts.macrosTotal) analyticsState.charts.macrosTotal.destroy();

  const ctx = canvas.getContext('2d');
  analyticsState.charts.macros = new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [avgProtein, avgCarbs, avgFat],
        backgroundColor: ['#dc2626', '#d97706', '#0891b2'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 8 } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: { label: ctx => ctx.label + ': ' + ctx.parsed + 'g' }
        }
      }
    }
  });

  const ctx2 = canvas2.getContext('2d');
  analyticsState.charts.macrosTotal = new window.Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [totalProtein, totalCarbs, totalFat],
        backgroundColor: ['#dc2626', '#d97706', '#0891b2'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 8 } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: { label: ctx => ctx.label + ': ' + ctx.parsed + 'g' }
        }
      }
    }
  });
}

function renderExerciseChart(exerciseData) {
  const canvas = document.getElementById('exerciseChart');
  const emptyDiv = document.getElementById('exercise-chart-empty');
  if (!canvas) return;

  if (!exerciseData || exerciseData.length === 0) {
    canvas.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }

  canvas.style.display = 'block';
  if (emptyDiv) emptyDiv.style.display = 'none';

  if (analyticsState.charts.exercise) analyticsState.charts.exercise.destroy();

  const ctx = canvas.getContext('2d');
  analyticsState.charts.exercise = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: exerciseData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Calories Burned',
        data: exerciseData.map(d => d.calories),
        backgroundColor: 'rgba(255, 107, 107, 0.7)',
        borderColor: '#e76f51',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => v + ' cal', font: { size: 11 } },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function updateAdherence(data) {
  const totalDays = analyticsState.currentRange;
  const profile = window.Sorrel.getProfile();

  const foodDays = data.calories.length;
  const foodAdherence = Math.round((foodDays / totalDays) * 100);
  const foodEl = document.getElementById('food-adherence');
  if (foodEl) foodEl.textContent = foodAdherence + '%';
  const foodBar = document.getElementById('food-adherence-bar');
  if (foodBar) foodBar.style.width = foodAdherence + '%';

  const exerciseDays = data.exercise.length;
  const exerciseAdherence = Math.round((exerciseDays / totalDays) * 100);
  const exEl = document.getElementById('exercise-adherence');
  if (exEl) exEl.textContent = exerciseAdherence + '%';
  const exBar = document.getElementById('exercise-adherence-bar');
  if (exBar) exBar.style.width = exerciseAdherence + '%';

  if (profile && data.calories.length > 0) {
    let daysOnTarget = 0;
    data.calories.forEach((day, i) => {
      if (data.macros.protein[i] && data.macros.carbs[i] && data.macros.fat[i]) {
        const pDiff = Math.abs(data.macros.protein[i].value - profile.protein) / profile.protein;
        const cDiff = Math.abs(data.macros.carbs[i].value - profile.carbs) / profile.carbs;
        const fDiff = Math.abs(data.macros.fat[i].value - profile.fat) / profile.fat;

        if (pDiff <= 0.10 && cDiff <= 0.10 && fDiff <= 0.10) {
          daysOnTarget++;
        }
      }
    });

    const macroAdherence = Math.round((daysOnTarget / foodDays) * 100);
    const macroEl = document.getElementById('macro-adherence');
    if (macroEl) macroEl.textContent = macroAdherence + '%';
    const macroBar = document.getElementById('macro-adherence-bar');
    if (macroBar) macroBar.style.width = macroAdherence + '%';
  } else {
    const macroEl = document.getElementById('macro-adherence');
    if (macroEl) macroEl.textContent = '0%';
    const macroBar = document.getElementById('macro-adherence-bar');
    if (macroBar) macroBar.style.width = '0%';
  }
}

function updateWeeklyComparison(data) {
  const today = new Date();

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(thisWeekStart.getDate() - 6);
  const thisWeekCals = data.calories.filter(d => new Date(d.date) >= thisWeekStart);
  const thisWeekAvg = thisWeekCals.length > 0
    ? Math.round(thisWeekCals.reduce((sum, d) => sum + d.calories, 0) / thisWeekCals.length)
    : 0;

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - 13);
  const lastWeekEnd = new Date(today);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
  const lastWeekCals = data.calories.filter(d => {
    const date = new Date(d.date);
    return date >= lastWeekStart && date < lastWeekEnd;
  });
  const lastWeekAvg = lastWeekCals.length > 0
    ? Math.round(lastWeekCals.reduce((sum, d) => sum + d.calories, 0) / lastWeekCals.length)
    : 0;

  const thisEl = document.getElementById('this-week-cals');
  if (thisEl) thisEl.textContent = thisWeekAvg;
  const lastEl = document.getElementById('last-week-cals');
  if (lastEl) lastEl.textContent = lastWeekAvg;

  const change = thisWeekAvg - lastWeekAvg;
  const changeText = change > 0 ? '+' + change : change;
  const changeEl = document.getElementById('weekly-change');
  if (changeEl) changeEl.textContent = changeText;
}

export function renderAllAnalytics() {
  const range = analyticsState.currentRange;
  const data = gatherAnalyticsData(range);
  updateSummaryStats(data);
  renderWeightChart(data.weight);
  renderCalorieChart(data.calories);
  renderMacroCharts(data.macros);
  renderExerciseChart(data.exercise);
  updateAdherence(data);
  updateWeeklyComparison(data);
}

export const render = renderAllAnalytics;

// Range buttons in monolith HTML use inline onclick="setAnalyticsRange(7)" etc.
window.setAnalyticsRange = setAnalyticsRange;
