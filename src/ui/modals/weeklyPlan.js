// Weekly plan modal — lifted from index.html L32031-32321.
//
// Dynamic factory: builds modal HTML from window.profile.weekPlan and
// appends to body. Inline onclick handlers reference global functions
// still owned by monolith: closeWeeklyPlanModal, toggleModalDay,
// switchTab, viewRecipe, swapMeal. Those stay in monolith and resolve
// via window scope.

function getProfile() {
  return window.profile || (window.Sorrel && window.Sorrel.getProfile && window.Sorrel.getProfile());
}

export function openWeeklyPlanModal(targetDay) {
  const profile = getProfile();
  if (!profile || !profile.weekPlan) {
    alert('No weekly plan available');
    return;
  }

  if (typeof targetDay !== 'number') {
    const jsDay = new Date().getDay();
    targetDay = jsDay === 0 ? 7 : jsDay;
  }

  const modalHTML = `
    <div id="weeklyPlanModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: white; border-radius: 16px; max-width: 700px; width: 100%; max-height: 90vh; display: flex; flex-direction: column;">
        <div style="padding: 24px; border-bottom: 2px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; color: #1a2332; font-size: 24px;">🗓️ Your Weekly Meal Plan</h2>
            <p style="margin: 8px 0 0 0; color: #5a6573; font-size: 14px;">
              Weekly Cost: <strong style="color: #0a7d5a;">$${profile.weeklyBudget.toFixed(2)}</strong> |
              Target: <strong>${profile.targetCalories} cal</strong> | ${profile.protein}p / ${profile.carbs}c / ${profile.fat}f per day
            </p>
            ${(() => {
              const avgCalories = Math.round(profile.weekPlan.reduce((sum, day) => sum + day.actualMacros.calories, 0) / 7);
              const weeklyDeficit = (profile.targetCalories - avgCalories) * 7;

              if (profile.goal && profile.weight && profile.goalWeight) {
                const weightDiff = profile.goalWeight - profile.weight;
                const poundsToGo = Math.abs(weightDiff);
                const weeksToGoal = Math.abs(weeklyDeficit) > 0
                  ? Math.ceil((poundsToGo * 3500) / Math.abs(weeklyDeficit))
                  : null;

                if (weeksToGoal && weeksToGoal > 0 && weeksToGoal < 200) {
                  const months = Math.floor(weeksToGoal / 4.3);
                  let timeDisplay;
                  if (weeksToGoal < 4) {
                    timeDisplay = `${weeksToGoal} week${weeksToGoal !== 1 ? 's' : ''}`;
                  } else if (months < 12) {
                    timeDisplay = `${months} month${months !== 1 ? 's' : ''}`;
                  } else {
                    const years = Math.floor(months / 12);
                    timeDisplay = `${years} year${years !== 1 ? 's' : ''}`;
                  }
                  const deficitText = weeklyDeficit > 0 ? `+${Math.abs(weeklyDeficit)}` : `${weeklyDeficit}`;
                  return `
                    <p style="margin: 8px 0 0 0; color: #0a7d5a; font-size: 13px; font-weight: 500;">
                      📊 Avg: ${avgCalories} cal/day (${deficitText} cal/week) •
                      🎯 Est. ${Math.abs(poundsToGo).toFixed(1)} lbs to goal in ~${timeDisplay}
                    </p>
                  `;
                }
              }

              const deficitText = weeklyDeficit > 0 ? `+${Math.abs(weeklyDeficit)}` : `${weeklyDeficit}`;
              return `
                <p style="margin: 8px 0 0 0; color: #0a7d5a; font-size: 13px; font-weight: 500;">
                  📊 Weekly Average: ${avgCalories} cal/day (${deficitText} cal/week vs target)
                </p>
              `;
            })()}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <button onclick="closeWeeklyPlanModal();switchTab('shopping');"
                    style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap;">
              🛒 Shopping list
            </button>
            <button onclick="closeWeeklyPlanModal()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad; line-height: 1; padding: 8px 12px; min-width: 44px; min-height: 44px;">&times;</button>
          </div>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 20px;">
          ${profile.weekPlan.map((day) => `
            <div class="day-accordion" id="modal-day-${day.day}" style="margin-bottom: 12px; border: 1px solid #d8d2c4; border-radius: 8px; overflow: hidden; background: white;">
              <div class="day-header" onclick="toggleModalDay(${day.day})" style="padding: 16px; background: #f4f1ec; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; user-select: none;">
                <div>
                  <div style="font-size: 16px; font-weight: 600; color: #1a2332;">${day.dayName}</div>
                  <div style="font-size: 13px; color: #5a6573; margin-top: 4px;">
                    ${day.actualMacros.calories} cal |
                    ${day.actualMacros.protein}p |
                    ${day.actualMacros.carbs}c |
                    ${day.actualMacros.fat}f
                  </div>
                </div>
                <div class="day-chevron" style="font-size: 20px; transition: transform 0.3s; color: #0a7d5a;">▼</div>
              </div>

              <div class="day-content" id="modal-content-${day.day}" style="display: none; padding: 16px; background: white;">
                <div style="padding: 12px; background: var(--bg-elevated); margin-bottom: 10px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">🍳 ${day.breakfast.meal.name || day.breakfast.meal.key}</div>
                      <div style="font-size: 13px; color: #5a6573;">
                        ${Math.round((day.breakfast.macros.protein * 4) + (day.breakfast.macros.carbs * 4) + (day.breakfast.macros.fat * 9))} cal |
                        ${day.breakfast.macros.protein}p / ${day.breakfast.macros.carbs}c / ${day.breakfast.macros.fat}f
                      </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button onclick="viewRecipe('breakfast', ${day.day})" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                        📖 Recipe
                      </button>
                      <button onclick="swapMeal(${day.day}, 'breakfast')" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                        Swap
                      </button>
                    </div>
                  </div>
                  <div id="recipe-breakfast-${day.day}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #d8d2c4;"></div>
                </div>

                <div style="padding: 12px; background: var(--bg-elevated); margin-bottom: 10px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">🥗 ${day.lunch.meal.name || day.lunch.meal.key}</div>
                      <div style="font-size: 13px; color: #5a6573;">
                        ${Math.round((day.lunch.macros.protein * 4) + (day.lunch.macros.carbs * 4) + (day.lunch.macros.fat * 9))} cal |
                        ${day.lunch.macros.protein}p / ${day.lunch.macros.carbs}c / ${day.lunch.macros.fat}f
                      </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button onclick="viewRecipe('lunch', ${day.day})" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                        📖 Recipe
                      </button>
                      <button onclick="swapMeal(${day.day}, 'lunch')" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                        Swap
                      </button>
                    </div>
                  </div>
                  <div id="recipe-lunch-${day.day}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #d8d2c4;"></div>
                </div>

                <div style="padding: 12px; background: var(--bg-elevated); margin-bottom: 10px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">🍽️ ${day.dinner.meal.name || day.dinner.meal.key}</div>
                      <div style="font-size: 13px; color: #5a6573;">
                        ${Math.round((day.dinner.macros.protein * 4) + (day.dinner.macros.carbs * 4) + (day.dinner.macros.fat * 9))} cal |
                      ${day.dinner.macros.protein}p / ${day.dinner.macros.carbs}c / ${day.dinner.macros.fat}f
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button onclick="viewRecipe('dinner', ${day.day})" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                      📖 Recipe
                    </button>
                    <button onclick="swapMeal(${day.day}, 'dinner')" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                      Swap
                    </button>
                  </div>
                </div>
                <div id="recipe-dinner-${day.day}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #d8d2c4;"></div>
              </div>

              <div style="padding: 12px; background: var(--bg-elevated); margin-bottom: 12px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; color: #1a2332; margin-bottom: 4px;">🥤 ${day.snack.meal.name}</div>
                    <div style="font-size: 13px; color: #5a6573;">
                      ${Math.round((day.snack.meal.protein * 4) + (day.snack.meal.carbs * 4) + (day.snack.meal.fat * 9))} cal |
                      ${day.snack.meal.protein}p / ${day.snack.meal.carbs}c / ${day.snack.meal.fat}f
                    </div>
                  </div>
                  <button onclick="swapMeal(${day.day}, 'snack')" style="padding: 10px 14px; min-height: 40px; background: #0a7d5a; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                    Swap
                  </button>
                </div>

                <div style="margin-top: 12px; padding: 12px; background: #e7f5ee; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                    <div style="color: #1a2332; font-weight: 500;">
                      Total: ${day.actualMacros.calories} cal |
                      ${day.actualMacros.protein}p |
                      ${day.actualMacros.carbs}c |
                      ${day.actualMacros.fat}f
                    </div>
                    <div style="color: #0a7d5a; font-weight: 600;">
                      $${day.totalCost.toFixed(2)}
                    </div>
                  </div>

                  ${(() => {
                    const calDiff = day.actualMacros.calories - profile.targetCalories;
                    const proteinDiff = day.actualMacros.protein - profile.protein;
                    const carbsDiff = day.actualMacros.carbs - profile.carbs;
                    const fatDiff = day.actualMacros.fat - profile.fat;

                    const formatDiff = (value, unit) => {
                      if (value > 0) return `<span style="color: #e74c3c;">+${value}${unit}</span>`;
                      if (value < 0) return `<span style="color: #27ae60;">${value}${unit}</span>`;
                      return `<span style="color: #95a5a6;">±0${unit}</span>`;
                    };

                    return `
                      <div style="font-size: 12px; color: #5a6573; padding-top: 8px; border-top: 1px solid #ddd;">
                        <strong>vs Target:</strong>
                        ${formatDiff(calDiff, ' cal')} |
                        ${formatDiff(proteinDiff, 'p')} |
                        ${formatDiff(carbsDiff, 'c')} |
                        ${formatDiff(fatDiff, 'f')}
                      </div>
                    `;
                  })()}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const existingModal = document.getElementById('weeklyPlanModal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  setTimeout(() => {
    if (typeof window.toggleModalDay === 'function') window.toggleModalDay(targetDay);
    const dayEl = document.getElementById('modal-day-' + targetDay);
    if (dayEl && typeof dayEl.scrollIntoView === 'function') {
      dayEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

export function closeWeeklyPlanModal() {
  const modal = document.getElementById('weeklyPlanModal');
  if (modal) modal.remove();
}
