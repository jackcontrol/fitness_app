// Premium tab — Fasting UI + Progress Photos + Custom Foods cards.
// Lifted from index.html: renderPremiumFeatures L15632, renderFastingUI L15179,
// renderProgressPhotos L15276, renderCustomFoods L15470, updatePhotoComparisonSelects L15321.
//
// Reads via window.Sorrel.{fasting,progress,customFoods} feature modules.
// Modal handlers (open/close/save) deferred to slice 7.

function renderFastingUI() {
  const activeDiv = document.getElementById('fasting-active');
  const inactiveDiv = document.getElementById('fasting-inactive');
  if (!activeDiv || !inactiveDiv) return;

  window.Sorrel.fasting.loadFasting();
  const fastingState = window.Sorrel.fasting.getFasting();

  if (fastingState.isActive) {
    activeDiv.style.display = 'block';
    inactiveDiv.style.display = 'none';

    const startTime = new Date(fastingState.startTime);
    const startEl = document.getElementById('fast-start-time');
    if (startEl) startEl.textContent = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const [fastHours] = fastingState.schedule.split(':').map(Number);
    const eatWindowEnd = new Date(startTime);
    eatWindowEnd.setHours(eatWindowEnd.getHours() - fastHours);
    const endEl = document.getElementById('eating-window-end');
    if (endEl) endEl.textContent = eatWindowEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const winEl = document.getElementById('fasting-window-display');
    if (winEl) winEl.textContent =
      `${fastHours} hours (${startTime.toLocaleTimeString()} - ${new Date(startTime.getTime() + fastHours * 60 * 60 * 1000).toLocaleTimeString()})`;
  } else {
    activeDiv.style.display = 'none';
    inactiveDiv.style.display = 'block';
  }

  const streakEl = document.getElementById('fasting-streak');
  if (streakEl) streakEl.textContent = fastingState.streak;
  const longestEl = document.getElementById('fasting-longest');
  if (longestEl) longestEl.textContent = fastingState.longestStreak;
}

function updatePhotoComparisonSelects() {
  const beforeSelect = document.getElementById('before-photo-select');
  const afterSelect = document.getElementById('after-photo-select');
  if (!beforeSelect || !afterSelect) return;

  const photos = window.Sorrel.progress.getPhotos();
  let options = '<option>Select photo...</option>';
  photos.forEach(photo => {
    const date = new Date(photo.date).toLocaleDateString();
    options += `<option value="${photo.id}">${date}</option>`;
  });

  beforeSelect.innerHTML = options;
  afterSelect.innerHTML = options;
}

export function renderProgressPhotos() {
  const grid = document.getElementById('progress-photos-grid');
  const emptyDiv = document.getElementById('progress-photos-empty');
  const comparisonDiv = document.getElementById('photo-comparison');
  const summary = document.getElementById('progress-photos-summary');

  if (!grid) return;

  window.Sorrel.progress.loadPhotos();
  const photos = window.Sorrel.progress.getPhotos();

  if (photos.length === 0) {
    grid.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    if (comparisonDiv) comparisonDiv.style.display = 'none';
    if (summary) summary.textContent = '';
    return;
  }

  grid.style.display = 'grid';
  if (emptyDiv) emptyDiv.style.display = 'none';
  if (comparisonDiv) comparisonDiv.style.display = 'block';
  if (summary) summary.textContent = `${photos.length} photo${photos.length !== 1 ? 's' : ''} stored`;

  let html = '';
  photos.forEach(photo => {
    const date = new Date(photo.date);
    html += `
      <div style="position: relative;">
        <img src="${photo.data}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; border: 1px solid #e8e2d6;">
        <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; text-align: center;">
          ${date.toLocaleDateString()}
        </div>
        <button onclick="deleteProgressPhoto(${photo.id})"
                style="position: absolute; top: 8px; right: 8px; background: rgba(220, 53, 69, 0.9); color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 12px;">
          ×
        </button>
      </div>
    `;
  });

  grid.innerHTML = html;
  updatePhotoComparisonSelects();
}

function renderCustomFoods() {
  const list = document.getElementById('custom-foods-list');
  const emptyDiv = document.getElementById('custom-foods-empty');
  if (!list) return;

  window.Sorrel.customFoods.loadCustomFoods();
  const foods = window.Sorrel.customFoods.getCustomFoods();

  if (foods.length === 0) {
    list.style.display = 'none';
    if (emptyDiv) emptyDiv.style.display = 'block';
    return;
  }

  list.style.display = 'block';
  if (emptyDiv) emptyDiv.style.display = 'none';

  let html = '';
  foods.forEach(food => {
    html += `
      <div style="padding: 14px; background: white; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 15px; color: #1a2332; margin-bottom: 4px;">
              ${food.name}
            </div>
            <div style="font-size: 13px; color: #5a6573;">
              ${food.serving}: ${food.calories} cal | ${food.protein}p ${food.carbs}c ${food.fat}f
            </div>
            <div style="font-size: 11px; color: #94a0ad; margin-top: 4px;">
              Created: ${new Date(food.created).toLocaleDateString()}
            </div>
          </div>
          <button onclick="deleteCustomFood('${food.id}')"
                  style="background: #dc2626; color: white; border: none; padding: 10px 14px; min-height: 40px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
            Delete
          </button>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
}

export function render() {
  renderFastingUI();
  renderProgressPhotos();
  renderCustomFoods();
}

export { renderFastingUI, renderCustomFoods };
