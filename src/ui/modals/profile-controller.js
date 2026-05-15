// Profile modal controller — page navigation + post-mount listener wiring.
// Lifted from monolith index.html L1392-1586 (the 3 inline <script> blocks
// inside the profileModal HTML). saveProfile wrapper just calls
// window.saveProfileReal which monolith still defines at L17352.

let currentPage = 1;

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(n) {
  currentPage = n;
}

export function nextPage(event) {
  if (event) event.preventDefault();

  const pages = document.querySelectorAll('.form-page');
  if (pages.length === 0) return;

  if (currentPage === 1) {
    const name = document.getElementById('userName')?.value?.trim();
    const age = parseInt(document.getElementById('userAge')?.value);
    const weight = parseInt(document.getElementById('userWeight')?.value);
    if (!name) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Enter your name');
      else alert('Please enter your name');
      return;
    }
    if (!age || age < 13 || age > 100) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Enter a valid age (13-100)');
      else alert('Please enter a valid age');
      return;
    }
    if (!weight || weight < 80) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Enter a valid weight (80+ lbs)');
      else alert('Please enter a valid weight');
      return;
    }
  }

  if (currentPage === 8) {
    const checked = document.querySelectorAll('#cuisineGrid input[type="checkbox"]:checked');
    if (checked.length < 2) {
      if (typeof window.showLogToast === 'function') window.showLogToast('Select at least 2 cuisines');
      else alert('Please select at least 2 cuisines');
      return;
    }
    if (typeof window.saveProfile === 'function') {
      window.saveProfile();
    } else {
      setTimeout(() => {
        if (typeof window.saveProfile === 'function') window.saveProfile();
        else alert('Error: Save function not loaded. Please refresh and try again.');
      }, 1000);
    }
    return;
  }

  if (currentPage >= pages.length) return;

  pages[currentPage - 1].classList.remove('active');
  pages[currentPage - 1].style.display = 'none';
  currentPage++;
  if (currentPage <= pages.length) {
    pages[currentPage - 1].classList.add('active');
    pages[currentPage - 1].style.display = 'block';
    document.querySelectorAll('.page-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentPage - 1);
    });
  }
}

export function prevPage() {
  if (currentPage <= 1) return;
  const pages = document.querySelectorAll('.form-page');
  pages[currentPage - 1].classList.remove('active');
  pages[currentPage - 1].style.display = 'none';
  currentPage--;
  pages[currentPage - 1].classList.add('active');
  pages[currentPage - 1].style.display = 'block';
  document.querySelectorAll('.page-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentPage - 1);
  });
}

export function skipDetailedAssessment() {
  const setIf = (id, value) => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = value;
  };
  const setRadio = (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el) el.checked = true;
  };
  setRadio('hasInjuries', 'no');
  setIf('chronicCondition', 'none');
  setIf('yearsTraining', '2-3years');
  setIf('experienceLevel', 'intermediate');
  setIf('sleepHours', '7-8');
  setIf('sleepQuality', 'good');
  setIf('stressLevel', 'moderate');
  setIf('energyLevel', 'good');

  window.__skipAssessment = true;
  const currentActive = document.querySelector('.form-page.active');
  if (currentActive) {
    currentActive.classList.remove('active');
    currentActive.style.display = 'none';
  }
  const target = document.querySelector('.form-page[data-page="6"]');
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  }
  document.querySelectorAll('.page-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === 5);
  });
  currentPage = 6;
}

// Lifted from monolith L15069. Resets form to page 1 + opens modal.
export function openProfileModal() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.style.display = 'flex';

  const formPages = document.querySelectorAll('.form-page');
  formPages.forEach((page, index) => {
    if (index === 0) {
      page.classList.add('active');
      page.style.display = 'block';
    } else {
      page.classList.remove('active');
      page.style.display = 'none';
    }
  });
  currentPage = 1;
  document.querySelectorAll('.page-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === 0);
  });

  const resultsPage = document.getElementById('resultsPage');
  if (resultsPage) resultsPage.style.display = 'none';
}

// Lifted from monolith L15099. Closes modal + triggers downstream renders.
export function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';

  try {
    if (typeof window.renderDynamicShopping === 'function') window.renderDynamicShopping();
  } catch (e) { console.warn('renderDynamicShopping error:', e); }

  try {
    const p = window.profile;
    if (p && p.waterOz && typeof window.renderHydrationSchedule === 'function') {
      window.renderHydrationSchedule();
    }
  } catch (e) { console.warn('renderHydrationSchedule error:', e); }

  try {
    if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  } catch (e) { console.warn('updateMainPagePlanner error:', e); }

  try { if (typeof window.updateIntelligenceBanners === 'function') window.updateIntelligenceBanners(); } catch (e) {}
  try { if (typeof window.renderPlanWeightChip === 'function') window.renderPlanWeightChip(); } catch (e) {}

  try {
    if (typeof window.updateHeaderWithProfile === 'function') window.updateHeaderWithProfile();
  } catch (e) { console.warn('updateHeaderWithProfile error:', e); }
}

// Lifted from monolith L15803. Settings → Profile & Goals close handler.
export function closeProfileEditModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('active');
  const closeBtn = document.getElementById('profileModalClose');
  if (closeBtn) closeBtn.style.display = 'none';
  const heading = document.querySelector('#profileModal .modal-content h2');
  if (heading) heading.textContent = 'Welcome to Sorrel';
  const subtitle = document.getElementById('modal-subtitle');
  if (subtitle) subtitle.textContent = 'Nutrition that adapts to you';
}

// Lifted from monolith L15814. Reopens modal in edit mode from Settings.
export function openProfileEdit() {
  currentPage = 1;

  const pages = document.querySelectorAll('.form-page');
  const dots = document.querySelectorAll('.page-dot');

  pages.forEach((page, index) => {
    if (index === 0) page.classList.add('active');
    else page.classList.remove('active');
  });

  dots.forEach((dot, index) => {
    if (index === 0) dot.classList.add('active');
    else dot.classList.remove('active');
  });

  const closeBtn = document.getElementById('profileModalClose');
  if (closeBtn) closeBtn.style.display = 'block';
  const heading = document.querySelector('#profileModal .modal-content h2');
  if (heading) heading.textContent = 'Edit profile';
  const subtitle = document.getElementById('modal-subtitle');
  if (subtitle) subtitle.textContent = 'Update your goals and information';

  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('active');

  const p = window.profile;
  if (p) {
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
    set('userName', p.name || '');
    set('userAge', p.age || '');
    set('userWeight', p.weight || '');

    if (p.height) {
      const feet = Math.floor(p.height / 12);
      const inches = p.height % 12;
      set('heightFeet', feet);
      set('heightInches', inches);
    } else {
      const hf = document.getElementById('heightFeet');
      if (hf) hf.value = hf.value || 5;
      const hi = document.getElementById('heightInches');
      if (hi) hi.value = hi.value || 8;
    }

    set('userGender', p.gender || 'male');
    set('userActivity', p.activity || 'moderate');
    set('userGoal', p.goal || 'maintain');

    if (p.cuisines) {
      document.querySelectorAll('#cuisineGrid input[type="checkbox"]').forEach((cb) => {
        cb.checked = p.cuisines.includes(cb.value);
      });
    }

    if (p.weeklyBudget) set('weeklyBudget', p.weeklyBudget);

    if (p.selectedStores) {
      document.querySelectorAll('#storeGrid input[type="checkbox"]').forEach((cb) => {
        cb.checked = p.selectedStores.includes(cb.value);
      });
    }
  }
}

// Wires DOM listeners that the inline <script> blocks used to install:
// - userGender change → toggle hormonal-men / hormonal-women visibility
// - motivationLevel input → mirror value into motivationOutput
function installModalListeners() {
  const genderEl = document.getElementById('userGender');
  const hormonalMen = document.getElementById('hormonal-men');
  const hormonalWomen = document.getElementById('hormonal-women');
  if (genderEl && hormonalMen && hormonalWomen) {
    const sync = () => {
      const v = genderEl.value;
      hormonalMen.style.display = v === 'male' ? 'block' : 'none';
      hormonalWomen.style.display = v === 'female' ? 'block' : 'none';
    };
    genderEl.addEventListener('change', sync);
    sync();
  }

  const range = document.getElementById('motivationLevel');
  const output = document.getElementById('motivationOutput');
  if (range && output) {
    range.addEventListener('input', () => { output.textContent = range.value; });
  }
}

export function install() {
  installModalListeners();
  currentPage = 1;
}
