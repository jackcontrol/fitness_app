// Cold-start dispatcher. Lifted verbatim from monolith index.html L15149-15364.
// Renders onboarding choice when no profile, migrates old schema, kicks off
// returning-user UI render chain. Called from monolith's window 'load'
// handler at L24751 via window.checkProfile.
//
// Module reads/writes the live `profile` binding through window.profile
// (state bridge setter at index.html L7483 updates monolith's let binding).
// Downstream UI fns are checked via typeof window.X === 'function' so
// modules can override them with shims.

export function checkProfile() {
  const saved = localStorage.getItem('user-profile');
  const mainSection = document.getElementById('main-weekly-plan-section');

  if (!saved) {
    if (mainSection) {
      mainSection.innerHTML = `
        <div style="text-align: center; padding: 32px 20px;">
          <div style="font-size: 56px; margin-bottom: 12px;">🥗</div>
          <h2 style="color: #1a2332; margin-bottom: 8px; font-size: 24px;">Welcome</h2>
          <p style="color: #5a6573; margin-bottom: 28px; font-size: 15px; line-height: 1.5; max-width: 380px; margin-left: auto; margin-right: auto;">
            Two ways to start. Pick whichever fits you better — you can always switch later.
          </p>

          <!-- Quick start (recommended for most users) -->
          <div style="background: var(--accent-gradient); color: white; padding: 24px; border-radius: 14px; max-width: 440px; margin: 0 auto 14px; text-align: left; box-shadow: 0 4px 14px rgba(10,125,90,0.25);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <strong style="font-size: 16px;">⚡ Quick start</strong>
              <span style="font-size: 11px; background: rgba(255,255,255,0.25); padding: 3px 8px; border-radius: 10px; font-weight: 600;">60 seconds</span>
            </div>
            <p style="font-size: 13px; opacity: 0.95; margin: 0 0 14px 0; line-height: 1.4;">
              Sex, weight, target, activity. Get a sensible plan you can refine later as the algorithm learns.
            </p>
            <button onclick="openQuickStartModal()" style="width: 100%; padding: 14px; background: white; color: #0a7d5a; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 700;">
              Start in 60 seconds →
            </button>
          </div>

          <!-- Full assessment (power user path) -->
          <div style="background: white; border: 1px solid #e8e2d6; padding: 20px; border-radius: 14px; max-width: 440px; margin: 0 auto 14px; text-align: left;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <strong style="font-size: 15px; color: #1a2332;">📋 Full assessment</strong>
              <span style="font-size: 11px; background: #f4f1ec; padding: 3px 8px; border-radius: 10px; font-weight: 600; color: #5a6573;">~5 min</span>
            </div>
            <p style="font-size: 13px; color: #5a6573; margin: 0 0 12px 0; line-height: 1.4;">
              47 data points for protocol-based meal planning (Doucette, Israetel, Mitchell). For serious dieters who want the elite tier from day 1.
            </p>
            <button onclick="openProfileModal()" style="width: 100%; padding: 12px; background: white; color: #0a7d5a; border: 1.5px solid #0a7d5a; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600;">
              Take full assessment
            </button>
          </div>

          <!-- Anonymous browse path -->
          <button onclick="browseAnonymously()" style="background: none; border: none; color: #94a0ad; cursor: pointer; font-size: 13px; text-decoration: underline; margin-top: 10px;">
            Just let me look around first
          </button>
        </div>
      `;
    }
    return;
  }

  try {
    const parsedProfile = JSON.parse(saved);

    if (!parsedProfile.weekPlan || parsedProfile.defaultBreakfast || parsedProfile.favoriteLunches || parsedProfile.favoriteDinners) {
      localStorage.removeItem('user-profile');
      window.profile = null;
      alert('Your profile has been updated to the new system! Please complete the quick setup again.');

      if (mainSection) {
        mainSection.innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
            <h2 style="color: #0a7d5a; margin-bottom: 12px; font-size: 28px;">Welcome to Sorrel</h2>
            <p style="color: #5a6573; margin-bottom: 32px; font-size: 16px;">Nutrition that adapts to you. Set up your personalized plan in just 2 minutes.</p>
            <button onclick="openProfileModal()" style="background: var(--accent-gradient); color: white; border: none; padding: 18px 40px; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(10, 125, 90, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              🚀 Get Started Now
            </button>
            <p style="color: #94a0ad; margin-top: 16px; font-size: 14px;">No credit card required • Takes less than 2 minutes</p>
          </div>
        `;
      }

      const modal = document.getElementById('profileModal');
      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
      return;
    }

    window.profile = parsedProfile;

    // v1.4.1 — auto-correct foodDiary.currentDate drift to today on load.
    try {
      const todayStr = (typeof window.todayISO === 'function')
        ? window.todayISO()
        : new Date().toISOString().slice(0, 10);
      const fd = window.foodDiary;
      if (fd && fd.currentDate !== todayStr) {
        fd.currentDate = todayStr;
        if (typeof window.ensureDateEntry === 'function') window.ensureDateEntry(todayStr);
      }
    } catch (e) {}

    // v1.4.2 — one-time sweep of ghost _sourcePlan entries (see monolith
    // comments at L15282 in pre-lift index.html).
    try {
      const MIGRATION_KEY = 'sorrel-migration-v142-sourceplan-sweep';
      const alreadySwept = localStorage.getItem(MIGRATION_KEY) === 'done';
      const fd = window.foodDiary;
      if (!alreadySwept && fd && fd.entries) {
        let removed = 0;
        Object.keys(fd.entries).forEach((date) => {
          const dayEntry = fd.entries[date];
          if (!dayEntry) return;
          ['breakfast', 'lunch', 'dinner', 'snacks'].forEach((slot) => {
            const arr = dayEntry[slot];
            if (!Array.isArray(arr)) return;
            const filtered = arr.filter((e) => {
              if (e && e._sourcePlan) { removed++; return false; }
              return true;
            });
            if (filtered.length !== arr.length) dayEntry[slot] = filtered;
          });
        });
        try {
          localStorage.setItem('food-diary', JSON.stringify({
            entries: fd.entries,
            recentFoods: fd.recentFoods,
            favoriteFoods: fd.favoriteFoods,
          }));
        } catch (e) {}
        try { localStorage.setItem(MIGRATION_KEY, 'done'); } catch (e) {}
        if (removed > 0) console.log(`🧹 v1.4.2 sweep: removed ${removed} phantom planned-meal entries.`);
      }
    } catch (e) { console.warn('v1.4.2 sweep failed:', e); }

    // v1.4 pattern computation — keyed by algorithm version.
    const PATTERN_ALGO_VERSION = 'v1.4.1';
    const p = window.profile;
    const needsPatternUpdate = (!p.pattern
                                || !Array.isArray(p.patternReasoning)
                                || p.patternReasoning.length === 0
                                || p.patternAlgorithmVersion !== PATTERN_ALGO_VERSION);
    if (needsPatternUpdate && typeof window.detectPatternFromProfile === 'function') {
      try {
        const r = window.detectPatternFromProfile(p);
        p.pattern = r.pattern;
        p.patternScore = r.score;
        p.patternReasoning = r.reasoning;
        p.patternDescription = r.description;
        p.patternAlgorithmVersion = PATTERN_ALGO_VERSION;
        try { localStorage.setItem('user-profile', JSON.stringify(p)); } catch (e) {}
      } catch (e) {
        console.warn('Pattern compute failed:', e);
      }
    }

    if (typeof window.rehydrateMealMethods === 'function') {
      window.rehydrateMealMethods();
    }

    if (typeof window.updateHeaderWithProfile === 'function') window.updateHeaderWithProfile();
    if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();

    if (typeof window.updateIntelligenceBanners === 'function') window.updateIntelligenceBanners();
    if (typeof window.renderPlanWeightChip === 'function') window.renderPlanWeightChip();

    if (p.waterOz && typeof window.renderHydrationSchedule === 'function') {
      window.renderHydrationSchedule();
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    localStorage.removeItem('user-profile');
    window.profile = null;

    if (mainSection) {
      mainSection.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <h2 style="color: #0a7d5a; margin-bottom: 12px; font-size: 28px;">Profile Error</h2>
          <p style="color: #5a6573; margin-bottom: 32px; font-size: 16px;">Let's create a new profile</p>
          <button onclick="openProfileModal()" style="background: var(--accent-gradient); color: white; border: none; padding: 18px 40px; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(10, 125, 90, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            🚀 Get Started Now
          </button>
        </div>
      `;
    }
  }
}
