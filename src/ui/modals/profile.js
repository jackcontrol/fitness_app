// Profile modal template — lifted verbatim from index.html L1305-2325.
//
// Template-only lift. Onboarding logic (nextPage, prevPage, saveProfile,
// skipDetailedAssessment, the IMMEDIATE modal check IIFE) stays in
// monolith — the inline <script> block at L1327-1587 of the template
// will not auto-execute via innerHTML injection, so when monolith is
// stripped in slice 8.2 that script must be moved into a sibling
// module and called from main.js bootstrap.
//
// For now (slice 8.1): ensureMounted no-ops because monolith's inline
// HTML already exists at parse time. The lifted template is dormant.
// Open/close fns toggle display the same way monolith does.

import { ensureMounted } from './helpers.js';

const TEMPLATE = `
<div class="modal" id="profileModal">
<div class="modal-content">
<button id="profileModalClose" onclick="closeProfileEditModal()" style="display:none;position:absolute;top:14px;right:14px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;color:var(--text-secondary);z-index:5;line-height:1;padding:0;">
      ✕
    </button>
<h2>Welcome to Sorrel</h2>
<p id="modal-subtitle">Nutrition that adapts to you</p>
<div class="page-indicator">
<div class="page-dot active"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
<div class="page-dot"></div>
</div>
<script>
    (function() {
      console.log('⚡ IMMEDIATE modal check...');
      setTimeout(function() {
        const saved = localStorage.getItem('user-profile');
        console.log('💾 Profile exists?', saved ? 'YES' : 'NO');
        let shouldOpenModal = false;
        if (!saved) {
          console.log('📝 No profile found');
          shouldOpenModal = true;
        } else {
          try {
            const profile = JSON.parse(saved);
            if (!profile.weekPlan || profile.defaultBreakfast || profile.favoriteLunches) {
              localStorage.removeItem('user-profile');
              shouldOpenModal = true;
            }
          } catch (e) {
            localStorage.removeItem('user-profile');
            shouldOpenModal = true;
          }
        }
        if (shouldOpenModal) {
          const modal = document.getElementById('profileModal');
          if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            const noProfileMsg = document.getElementById('no-profile-message');
            if (noProfileMsg) noProfileMsg.style.display = 'block';
          }
        } else {
          const noProfileMsg = document.getElementById('no-profile-message');
          if (noProfileMsg) noProfileMsg.style.display = 'none';
        }
      }, 50);
    })();
    let currentPage = 1;
    window.nextPage = function(event) {
      if (event) event.preventDefault();
      const pages = document.querySelectorAll('.form-page');
      if (pages.length === 0) return;
      if (currentPage === 1) {
        const name = document.getElementById('userName') && document.getElementById('userName').value.trim();
        const age = parseInt(document.getElementById('userAge') && document.getElementById('userAge').value);
        const weight = parseInt(document.getElementById('userWeight') && document.getElementById('userWeight').value);
        if (!name) { if (typeof showLogToast === 'function') showLogToast('Enter your name'); else alert('Please enter your name'); return; }
        if (!age || age < 13 || age > 100) { if (typeof showLogToast === 'function') showLogToast('Enter a valid age (13-100)'); else alert('Please enter a valid age'); return; }
        if (!weight || weight < 80) { if (typeof showLogToast === 'function') showLogToast('Enter a valid weight (80+ lbs)'); else alert('Please enter a valid weight'); return; }
      }
      if (currentPage === 8) {
        const checked = document.querySelectorAll('#cuisineGrid input[type="checkbox"]:checked');
        if (checked.length < 2) { if (typeof showLogToast === 'function') showLogToast('Select at least 2 cuisines'); else alert('Please select at least 2 cuisines'); return; }
        if (typeof saveProfile === 'function') saveProfile();
        else setTimeout(function() { if (typeof saveProfile === 'function') saveProfile(); else alert('Error: Save function not loaded.'); }, 1000);
        return;
      }
      if (currentPage >= pages.length) return;
      pages[currentPage - 1].classList.remove('active');
      pages[currentPage - 1].style.display = 'none';
      currentPage++;
      if (currentPage <= pages.length) {
        pages[currentPage - 1].classList.add('active');
        pages[currentPage - 1].style.display = 'block';
        document.querySelectorAll('.page-dot').forEach((dot, idx) => { dot.classList.toggle('active', idx === currentPage - 1); });
      }
    };
    window.prevPage = function() {
      if (currentPage <= 1) return;
      const pages = document.querySelectorAll('.form-page');
      pages[currentPage - 1].classList.remove('active');
      pages[currentPage - 1].style.display = 'none';
      currentPage--;
      pages[currentPage - 1].classList.add('active');
      pages[currentPage - 1].style.display = 'block';
      document.querySelectorAll('.page-dot').forEach((dot, idx) => { dot.classList.toggle('active', idx === currentPage - 1); });
    };
    window.skipDetailedAssessment = function() {
      const setIf = (id, value) => { const el = document.getElementById(id); if (el && !el.value) el.value = value; };
      const setRadio = (name, value) => { const el = document.querySelector('input[name="' + name + '"][value="' + value + '"]'); if (el) el.checked = true; };
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
      if (currentActive) { currentActive.classList.remove('active'); currentActive.style.display = 'none'; }
      const target = document.querySelector('.form-page[data-page="6"]');
      if (target) { target.classList.add('active'); target.style.display = 'block'; }
      document.querySelectorAll('.page-dot').forEach((dot, idx) => { dot.classList.toggle('active', idx === 5); });
    };
    window.saveProfile = function(event) {
      if (event) event.preventDefault();
      if (window.saveProfileReal) window.saveProfileReal(event);
      else if (typeof saveProfileDirect === 'function') saveProfileDirect(event);
      else alert('Error: Profile system not loaded. Please refresh the page.');
    };
    </script>
<form id="profileForm" onsubmit="return false;">
<div class="form-page active" data-page="1">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Demographics &amp; Current State</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Let's start with the basics</p>
<div class="form-group">
<label>Your Name</label>
<input id="userName" placeholder="Enter your name" required="" type="text"/>
</div>
<div class="form-row">
<div class="form-group">
<label>Age</label>
<input id="userAge" max="100" min="13" onfocus="this.select()" placeholder="30" required="" type="number" value="30"/>
</div>
<div class="form-group">
<label>Gender</label>
<select id="userGender" required="">
<option value="male">Male</option>
<option value="female">Female</option>
</select>
</div>
</div>
<div class="form-group">
<label>Height</label>
<div style="display: flex; gap: 12px;">
<input id="heightFeet" max="7" min="4" onfocus="this.select()" placeholder="5" required="" style="flex: 1;" type="number" value="5"/>
<span style="line-height: 48px;">ft</span>
<input id="heightInches" max="11" min="0" onfocus="this.select()" placeholder="8" required="" style="flex: 1;" type="number" value="8"/>
<span style="line-height: 48px;">in</span>
</div>
<small style="color: #5a6573; font-size: 12px;">Click number to change it quickly</small>
</div>
<div class="form-row">
<div class="form-group">
<label>Current Weight (lbs)</label>
<input id="userWeight" max="500" min="80" onfocus="this.select()" placeholder="170" required="" type="number" value="170"/>
</div>
<div class="form-group">
<label>Target Weight (lbs)</label>
<input id="targetWeight" max="500" min="80" onfocus="this.select()" placeholder="Optional" type="number"/>
<small style="color: #94a0ad; font-size: 11px;">Optional - for time-to-goal</small>
</div>
</div>
<div class="form-group">
<label>Body Fat % (if known)</label>
<select id="bodyFatEstimate">
<option value="">I don't know</option>
<option value="very_lean">Very Lean (Men &lt;10%, Women &lt;18%) - Visible abs, vascular</option>
<option value="lean">Lean (Men 10-15%, Women 18-23%) - Flat stomach, some definition</option>
<option value="average">Average (Men 15-20%, Women 23-28%) - Healthy, minimal definition</option>
<option value="above_average">Above Average (Men 20-25%, Women 28-33%) - Some extra weight</option>
<option value="high">High (Men 25-30%, Women 33-38%) - Overweight</option>
<option value="very_high">Very High (Men &gt;30%, Women &gt;38%) - Obese</option>
</select>
</div>
<div class="form-group">
<label>Primary Goal</label>
<select id="userGoal" required="">
<option selected="" value="lose_fat_moderate">Lose Fat (Moderate - 1 lb/week)</option>
<option value="lose_fat_aggressive">Lose Fat (Aggressive - 1.5 lbs/week)</option>
<option value="maintain">Maintain Weight / Body Recomposition</option>
<option value="gain_muscle">Gain Muscle (Lean Bulk)</option>
<option value="performance">Athletic Performance</option>
</select>
</div>
<div class="form-group">
<label>Timeline / Target Date (Optional)</label>
<select id="timeline">
<option value="">No specific timeline</option>
<option value="4_weeks">4 weeks (Special event coming up)</option>
<option value="8_weeks">8 weeks (Short-term goal)</option>
<option value="12_weeks">12 weeks (Standard transformation)</option>
<option value="6_months">6 months (Sustainable change)</option>
<option value="1_year">1 year+ (Long-term lifestyle)</option>
</select>
</div>
<button class="btn" onclick="nextPage()" type="button">Next</button>
<div style="text-align:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle);">
<button onclick="skipDetailedAssessment()" style="background:none;border:none;color:var(--text-secondary);font-size:13px;cursor:pointer;text-decoration:underline;padding:8px;" type="button">
            Skip detailed assessment for now
          </button>
<div style="font-size:11px;color:var(--text-tertiary);margin-top:4px;line-height:1.4;">You'll get a generic plan. Complete it later in Settings for the adaptive protocol.</div>
</div>
</div>
<div class="form-page" data-page="2" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Health &amp; Injury Assessment</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Help us create a safe, effective program</p>
<div class="form-group">
<label>Do you have any current injuries or physical limitations?</label>
<div class="radio-group">
<div class="radio-option"><input checked="" id="injury-none" name="injuries" type="radio" value="none"/><label for="injury-none">No injuries or limitations</label></div>
<div class="radio-option"><input id="injury-minor" name="injuries" type="radio" value="minor"/><label for="injury-minor">Minor issues (doesn't limit most exercises)</label></div>
<div class="radio-option"><input id="injury-moderate" name="injuries" type="radio" value="moderate"/><label for="injury-moderate">Moderate (limits some exercises)</label></div>
<div class="radio-option"><input id="injury-significant" name="injuries" type="radio" value="significant"/><label for="injury-significant">Significant limitations</label></div>
</div>
</div>
<div class="form-group">
<label>If yes, what areas? (Check all that apply)</label>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-lower-back" type="checkbox" value="lower_back"/><label for="injury-lower-back" style="margin: 0; font-size: 14px;">Lower back</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-shoulder" type="checkbox" value="shoulder"/><label for="injury-shoulder" style="margin: 0; font-size: 14px;">Shoulder</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-knee" type="checkbox" value="knee"/><label for="injury-knee" style="margin: 0; font-size: 14px;">Knee</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-hip" type="checkbox" value="hip"/><label for="injury-hip" style="margin: 0; font-size: 14px;">Hip</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-neck" type="checkbox" value="neck"/><label for="injury-neck" style="margin: 0; font-size: 14px;">Neck</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="injury-elbow" type="checkbox" value="elbow"/><label for="injury-elbow" style="margin: 0; font-size: 14px;">Elbow</label></div>
</div>
</div>
<div class="form-group">
<label>Stress Level (affects cortisol &amp; fat storage)</label>
<select id="stressLevel" required="">
<option value="low">Low - Life is pretty calm</option>
<option selected="" value="moderate">Moderate - Normal daily stress</option>
<option value="high">High - Job/family stress is significant</option>
<option value="very_high">Very High - Chronic high stress</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">High stress = cortisol = harder fat loss</small>
</div>
<div class="form-group">
<label>Sleep QUALITY (not just hours - how rested do you feel?)</label>
<select id="sleepQuality" required="">
<option value="9-10">9-10 - Wake up refreshed, great energy</option>
<option selected="" value="7-8">7-8 - Pretty good, occasional rough night</option>
<option value="5-6">5-6 - Not great, often tired</option>
<option value="3-4">3-4 - Poor sleep, chronically tired</option>
<option value="1-2">1-2 - Terrible sleep, major issues</option>
</select>
</div>
<div class="form-group" id="hormonal-men" style="display: none;">
<label>Hormonal Health (Men)</label>
<select id="hormonalHealthMale">
<option value="good">Good - Normal libido, energy, mood</option>
<option value="declining">Declining - Lower libido/energy than before</option>
<option value="poor">Poor - Low libido, fatigue, mood issues</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">Critical for men 35+</small>
</div>
<div class="form-group" id="hormonal-women" style="display: none;">
<label>Menstrual Cycle Regularity (Women)</label>
<select id="hormonalHealthFemale">
<option value="regular">Regular (21-35 days, predictable)</option>
<option value="irregular">Irregular (unpredictable timing)</option>
<option value="absent">Absent (amenorrhea - RED FLAG)</option>
<option value="perimenopause">Perimenopause (transitioning)</option>
<option value="menopause">Menopause (no period 12+ months)</option>
<option value="postpartum">Postpartum (less than 12 months)</option>
<option value="na">N/A (birth control, hysterectomy, etc.)</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">Irregular/absent = too much stress or undereating</small>
</div>
<script>
        document.getElementById('userGender').addEventListener('change', function() {
          const gender = this.value;
          document.getElementById('hormonal-men').style.display = gender === 'male' ? 'block' : 'none';
          document.getElementById('hormonal-women').style.display = gender === 'female' ? 'block' : 'none';
        });
        if (document.getElementById('userGender').value === 'male') {
          document.getElementById('hormonal-men').style.display = 'block';
        } else {
          document.getElementById('hormonal-women').style.display = 'block';
        }
        </script>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="3" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Training History &amp; Performance</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Your training background helps us optimize programming</p>
<div class="form-group">
<label>Years Training Consistently</label>
<select id="yearsTraining" required="">
<option value="0-6months">Less than 6 months</option>
<option value="6-12months">6-12 months</option>
<option value="1-2years">1-2 years</option>
<option selected="" value="2-3years">2-3 years</option>
<option value="3-5years">3-5 years</option>
<option value="5plus">5+ years</option>
</select>
</div>
<div class="form-group">
<label>Training Experience Level</label>
<div class="radio-group">
<div class="radio-option"><input id="exp1" name="experience" type="radio" value="beginner"/><label class="radio-label" for="exp1"><strong>Beginner</strong><small>New to structured training, learning form</small></label></div>
<div class="radio-option"><input checked="" id="exp2" name="experience" type="radio" value="intermediate"/><label class="radio-label" for="exp2"><strong>Intermediate</strong><small>Know basic exercises, train consistently</small></label></div>
<div class="radio-option"><input id="exp3" name="experience" type="radio" value="advanced"/><label class="radio-label" for="exp3"><strong>Advanced</strong><small>Years of experience, understand programming</small></label></div>
</div>
</div>
<div class="form-group">
<label>Current Training Frequency</label>
<select id="currentTrainingDays" required="">
<option value="0">Not currently training</option>
<option value="1-2">1-2 days per week</option>
<option selected="" value="3-4">3-4 days per week</option>
<option value="5-6">5-6 days per week</option>
<option value="7plus">7+ days per week (athlete/competitor)</option>
</select>
</div>
<div class="form-group">
<label>Strength Level (Optional - helps with programming)</label>
<select id="strengthLevel">
<option value="">I don't know / Don't track</option>
<option value="cant_do">Can't do bodyweight movements (push-ups, squats)</option>
<option value="bodyweight">Can do bodyweight movements</option>
<option value="novice">Novice lifter (learning barbell movements)</option>
<option selected="" value="intermediate">Intermediate (Squat/Bench/Dead with decent form)</option>
<option value="advanced">Advanced (Strong for bodyweight, compete/could compete)</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">Rough guideline: Intermediate men = 1.5x BW squat, 1x BW bench, 2x BW deadlift</small>
</div>
<div class="form-group">
<label>Recovery Capacity (How do you bounce back?)</label>
<select id="recoveryCapacity" required="">
<option value="excellent">Excellent - Wake up ready to train hard again</option>
<option selected="" value="good">Good - Recover well with adequate rest</option>
<option value="moderate">Moderate - Need extra recovery between sessions</option>
<option value="poor">Poor - Often sore, tired, need lots of rest</option>
</select>
</div>
<div class="form-group">
<label>Primary Training Focus</label>
<div class="radio-group">
<div class="radio-option"><input checked="" id="focus1" name="focus" type="radio" value="fat_loss"/><label class="radio-label" for="focus1"><strong>Fat Loss</strong><small>Lose body fat while maintaining muscle</small></label></div>
<div class="radio-option"><input id="focus2" name="focus" type="radio" value="strength"/><label class="radio-label" for="focus2"><strong>Strength Building</strong><small>Get stronger, build muscle mass</small></label></div>
<div class="radio-option"><input id="focus3" name="focus" type="radio" value="health"/><label class="radio-label" for="focus3"><strong>Health &amp; Longevity</strong><small>Overall health, mobility, wellness</small></label></div>
<div class="radio-option"><input id="focus4" name="focus" type="radio" value="performance"/><label class="radio-label" for="focus4"><strong>Athletic Performance</strong><small>Training for sport or competition</small></label></div>
</div>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="4" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Nutrition History &amp; Metabolic Status</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Understanding your diet history prevents mistakes</p>
<div class="form-group">
<label>Current Daily Calories (if you track)</label>
<select id="currentCalories">
<option value="">I don't track / don't know</option>
<option value="under1500">Under 1500 calories</option>
<option value="1500-2000">1500-2000 calories</option>
<option value="2000-2500">2000-2500 calories</option>
<option value="2500-3000">2500-3000 calories</option>
<option value="over3000">Over 3000 calories</option>
</select>
</div>
<div class="form-group">
<label>Past Diet Experience</label>
<select id="dietHistory" required="">
<option value="none">Never dieted / First time</option>
<option value="few">Tried a few diets, mixed results</option>
<option selected="" value="many">Multiple diets, yo-yo pattern</option>
<option value="chronic">Chronic dieter, always restricting</option>
</select>
</div>
<div class="form-group">
<label>Weight Fluctuation Pattern (Past 2 years)</label>
<select id="weightPattern" required="">
<option value="stable">Stable - Weight stays within 5-10 lbs</option>
<option value="slow_gain">Slow gain - Gradually increasing</option>
<option selected="" value="yoyo">Yo-yo - Lose weight, regain, repeat</option>
<option value="rapid_gain">Rapid gain - Significant recent weight gain</option>
<option value="cant_lose">Can't lose - Stuck despite efforts (RED FLAG)</option>
</select>
</div>
<div class="form-group">
<label>Metabolic Assessment</label>
<select id="metabolicStatus" required="">
<option value="healthy">Healthy - Lose weight predictably on moderate deficit</option>
<option selected="" value="adapted">Adapted - Weight loss stalls easily, need aggressive deficit</option>
<option value="damaged">Damaged - Can't lose weight even on very low calories (need reverse diet)</option>
<option value="unknown">Unknown - Haven't tried structured dieting</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">If "damaged" - we'll recommend reverse diet first, not fat loss</small>
</div>
<div class="form-group">
<label>Hunger &amp; Satiety Signals</label>
<select id="hungerSignals" required="">
<option value="good">Good - Feel hungry at meals, satisfied after eating</option>
<option selected="" value="moderate">Moderate - Sometimes hungry at wrong times</option>
<option value="poor">Poor - Always hungry OR never hungry (both bad)</option>
<option value="disconnected">Disconnected - Can't tell if I'm hungry or full</option>
</select>
</div>
<div class="form-group">
<label>Relationship with Food</label>
<select id="foodRelationship" required="">
<option value="healthy">Healthy - Food is fuel, no emotional attachment</option>
<option selected="" value="moderate">Moderate - Occasional emotional eating</option>
<option value="problematic">Problematic - Use food for comfort/stress relief</option>
<option value="disordered">Disordered - History of binging, restricting, or ED</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">If disordered - we'll recommend working with specialist</small>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="5" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Lifestyle &amp; Daily Activity</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Your lifestyle affects your nutrition needs</p>
<div class="form-group">
<label>Occupation Type</label>
<select id="occupationType" required="">
<option selected="" value="sedentary">Desk job / Sedentary (sitting most of day)</option>
<option value="light">Light activity (some standing, walking)</option>
<option value="moderate">Moderate activity (on feet most of day)</option>
<option value="active">Active (physical labor, construction, etc.)</option>
<option value="very_active">Very active (athlete, physical trainer, etc.)</option>
</select>
</div>
<div class="form-group">
<label>Daily Step Count (if you track)</label>
<select id="dailySteps">
<option value="">Don't track</option>
<option value="under3000">Under 3,000 steps (very sedentary)</option>
<option value="3000-5000">3,000-5,000 steps (sedentary)</option>
<option selected="" value="5000-8000">5,000-8,000 steps (lightly active)</option>
<option value="8000-10000">8,000-10,000 steps (active)</option>
<option value="10000-15000">10,000-15,000 steps (very active)</option>
<option value="over15000">Over 15,000 steps (extremely active)</option>
</select>
</div>
<input id="sleepHours" type="hidden" value="7-8"/>
<div class="form-group">
<label>Alcohol Consumption</label>
<select id="alcoholIntake" required="">
<option selected="" value="none">None / Rarely (0-1 drinks/week)</option>
<option value="light">Light (2-4 drinks/week)</option>
<option value="moderate">Moderate (5-7 drinks/week)</option>
<option value="heavy">Heavy (8+ drinks/week)</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">Alcohol affects recovery, hormones, and fat loss</small>
</div>
<div class="form-group">
<label>Support System</label>
<select id="supportSystem" required="">
<option value="excellent">Excellent - Family/friends fully support my goals</option>
<option selected="" value="good">Good - Generally supportive environment</option>
<option value="neutral">Neutral - No help but no sabotage</option>
<option value="challenging">Challenging - Home environment makes it hard</option>
</select>
</div>
<div class="form-group">
<label>Current Supplements (if any)</label>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-protein" type="checkbox" value="protein"/><label for="supp-protein" style="margin: 0; font-size: 14px;">Protein powder</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-creatine" type="checkbox" value="creatine"/><label for="supp-creatine" style="margin: 0; font-size: 14px;">Creatine</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-preworkout" type="checkbox" value="preworkout"/><label for="supp-preworkout" style="margin: 0; font-size: 14px;">Pre-workout</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-multivitamin" type="checkbox" value="multivitamin"/><label for="supp-multivitamin" style="margin: 0; font-size: 14px;">Multivitamin</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-omega3" type="checkbox" value="omega3"/><label for="supp-omega3" style="margin: 0; font-size: 14px;">Omega-3 / Fish oil</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="supp-vitd" type="checkbox" value="vitaminD"/><label for="supp-vitd" style="margin: 0; font-size: 14px;">Vitamin D</label></div>
</div>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="6" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Your Specific Goals</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">What matters most to you?</p>
<div class="form-group">
<label>Do you have a specific event or deadline?</label>
<input id="specificEvent" placeholder="e.g., Wedding in June, Beach vacation, Competition, etc." type="text"/>
<small style="color: #94a0ad; font-size: 11px;">Optional but helps with urgency/pacing</small>
</div>
<div class="form-group">
<label>What's Your Top Priority?</label>
<select id="topPriority" required="">
<option selected="" value="aesthetics">Aesthetics - Look good, visible results</option>
<option value="performance">Performance - Get stronger, faster, better at sport</option>
<option value="health">Health - Feel better, improve markers, longevity</option>
<option value="confidence">Confidence - Mental/emotional transformation</option>
</select>
</div>
<div class="form-group">
<label>What's worked for you before? (if anything)</label>
<textarea id="whatWorked" placeholder="e.g., 'Lost 15 lbs on keto', 'Gained strength with 5x5 program', etc." rows="3"></textarea>
</div>
<div class="form-group">
<label>What's your biggest obstacle to success?</label>
<select id="biggestObstacle" required="">
<option value="time">Time - Too busy to prep meals / train consistently</option>
<option value="knowledge">Knowledge - Don't know what to eat / how to train</option>
<option selected="" value="motivation">Motivation - Start strong but can't maintain</option>
<option value="social">Social - Family/friends/work events derail me</option>
<option value="cravings">Cravings - Can't control hunger / food urges</option>
<option value="injury">Injury - Physical limitations hold me back</option>
<option value="stress">Stress - Life stress sabotages consistency</option>
<option value="travel">Travel - Work travel makes it impossible</option>
</select>
</div>
<div class="form-group">
<label>How many times have you "started over"?</label>
<select id="restartCount" required="">
<option value="first">This is my first serious attempt</option>
<option value="few">A few times (2-3)</option>
<option selected="" value="many">Many times (4-10)</option>
<option value="countless">Countless - chronic restart cycle</option>
</select>
<small style="color: #94a0ad; font-size: 11px;">Honesty helps us build sustainability</small>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="7" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Readiness Assessment</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Let's ensure you're set up for success</p>
<div class="form-group">
<label>Current Motivation Level</label>
<div style="display: flex; align-items: center; gap: 12px;">
<span style="font-size: 12px; color: #94a0ad;">Low</span>
<input id="motivationLevel" max="10" min="1" style="flex: 1;" type="range" value="8"/>
<span style="font-size: 12px; color: #94a0ad;">High</span>
<output id="motivationOutput" style="font-weight: 600; color: #0a7d5a; min-width: 30px;">8</output>
</div>
<script>
            document.getElementById('motivationLevel').addEventListener('input', function() {
              document.getElementById('motivationOutput').textContent = this.value;
            });
          </script>
</div>
<div class="form-group">
<label>Time Available for Training (per week)</label>
<select id="timeForTraining" required="">
<option value="minimal">Minimal (1-2 hours/week)</option>
<option value="limited">Limited (3-4 hours/week)</option>
<option selected="" value="moderate">Moderate (5-6 hours/week)</option>
<option value="flexible">Flexible (7-8 hours/week)</option>
<option value="dedicated">Dedicated (9+ hours/week)</option>
</select>
</div>
<div class="form-group">
<label>Time Available for Meal Prep</label>
<select id="timeForMealPrep" required="">
<option value="none">None - Need grab-and-go only</option>
<option value="minimal">Minimal (30 min/week)</option>
<option selected="" value="moderate">Moderate (1-2 hours/week)</option>
<option value="good">Good (2-3 hours/week)</option>
<option value="flexible">Flexible (can prep extensively)</option>
</select>
</div>
<div class="form-group">
<label>Weekly Food Budget</label>
<select id="foodBudget" required="">
<option value="tight">Tight ($50-75/week)</option>
<option value="moderate">Moderate ($75-100/week)</option>
<option selected="" value="comfortable">Comfortable ($100-150/week)</option>
<option value="flexible">Flexible ($150-200/week)</option>
<option value="unlimited">Unlimited (budget not a concern)</option>
</select>
</div>
<div class="form-group">
<label>Compliance Confidence</label>
<select id="complianceConfidence" required="">
<option value="low">Low - I'll probably fall off track</option>
<option value="moderate">Moderate - 50/50 chance of sticking with it</option>
<option selected="" value="good">Good - Usually complete what I start</option>
<option value="high">High - Very committed, rarely quit</option>
</select>
</div>
<div class="form-group">
<label>What would make you quit? (Check all that apply)</label>
<div style="display: flex; flex-direction: column; gap: 8px;">
<div style="display: flex; align-items: center; gap: 8px;"><input id="quit-slow" type="checkbox" value="slow_results"/><label for="quit-slow" style="margin: 0; font-size: 14px;">Results are too slow</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="quit-hard" type="checkbox" value="too_hard"/><label for="quit-hard" style="margin: 0; font-size: 14px;">It's too hard / restrictive</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="quit-social" type="checkbox" value="social_pressure"/><label for="quit-social" style="margin: 0; font-size: 14px;">Social pressure / events</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="quit-plateau" type="checkbox" value="plateau"/><label for="quit-plateau" style="margin: 0; font-size: 14px;">Hit a plateau</label></div>
<div style="display: flex; align-items: center; gap: 8px;"><input id="quit-boring" type="checkbox" value="boring"/><label for="quit-boring" style="margin: 0; font-size: 14px;">Food gets boring</label></div>
</div>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="nextPage()" style="flex: 1;" type="button">Next</button>
</div>
</div>
<div class="form-page" data-page="8" style="display: none;">
<h3 style="margin-bottom: 8px; color: #0a7d5a;">Dietary Preferences</h3>
<p style="color: #94a0ad; font-size: 13px; margin-bottom: 20px;">Final step - customize your meal options</p>
<div class="form-group">
<label>Dietary Preference</label>
<div class="radio-group">
<div class="radio-option"><input checked="" id="diet1" name="diet" type="radio" value="omnivore"/><label class="radio-label" for="diet1"><strong>🍗 Omnivore</strong><small>Eats all foods including meat, fish, dairy, eggs</small></label></div>
<div class="radio-option"><input id="diet2" name="diet" type="radio" value="vegetarian"/><label class="radio-label" for="diet2"><strong>🥚 Vegetarian</strong><small>No meat/fish. Includes dairy and eggs</small></label></div>
<div class="radio-option"><input id="diet3" name="diet" type="radio" value="vegan"/><label class="radio-label" for="diet3"><strong>🌱 Vegan</strong><small>No animal products (100% plant-based)</small></label></div>
</div>
</div>
<div class="form-group">
<label>Food Allergens/Restrictions (check all that apply)</label>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-soy" type="checkbox" value="soy"/>Soy</label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-nuts" type="checkbox" value="nuts"/>Nuts (all)</label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-dairy" type="checkbox" value="dairy"/>Dairy</label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-eggs" type="checkbox" value="eggs"/>Eggs</label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-gluten" type="checkbox" value="gluten"/>Gluten</label>
<label style="display: flex; align-items: center; gap: 8px; font-size: 14px;"><input id="allergen-shellfish" type="checkbox" value="shellfish"/>Shellfish</label>
</div>
</div>
<div class="form-group">
<label>Select Your Favorite Cuisines (choose at least 2)</label>
<div id="cuisineGrid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px;">
<label class="cuisine-option"><input type="checkbox" value="american"/><span>🍔 American</span></label>
<label class="cuisine-option"><input type="checkbox" value="italian"/><span>🍝 Italian</span></label>
<label class="cuisine-option"><input type="checkbox" value="mexican"/><span>🌮 Mexican</span></label>
<label class="cuisine-option"><input type="checkbox" value="chinese"/><span>🥢 Chinese</span></label>
<label class="cuisine-option"><input type="checkbox" value="japanese"/><span>🍱 Japanese</span></label>
<label class="cuisine-option"><input type="checkbox" value="thai"/><span>🍛 Thai</span></label>
<label class="cuisine-option"><input type="checkbox" value="indian"/><span>🍛 Indian</span></label>
<label class="cuisine-option"><input type="checkbox" value="mediterranean"/><span>🥗 Mediterranean</span></label>
<label class="cuisine-option"><input type="checkbox" value="greek"/><span>🧆 Greek</span></label>
<label class="cuisine-option"><input type="checkbox" value="middle_eastern"/><span>🥙 Middle Eastern</span></label>
<label class="cuisine-option"><input type="checkbox" value="korean"/><span>🍜 Korean</span></label>
<label class="cuisine-option"><input type="checkbox" value="healthy"/><span>🥗 Healthy/Clean</span></label>
</div>
</div>
<div class="form-group">
<label>Weekly Food Budget</label>
<select id="weeklyBudget" required="">
<option value="tight">Tight ($50-75/week)</option>
<option selected="" value="moderate">Moderate ($75-100/week)</option>
<option value="comfortable">Comfortable ($100-150/week)</option>
<option value="flexible">Flexible ($150+/week)</option>
</select>
</div>
<div style="display: flex; gap: 12px;">
<button class="btn" onclick="prevPage()" style="background: var(--text-tertiary);" type="button">Back</button>
<button class="btn" onclick="saveProfile();" style="flex: 1;" type="button">Complete Assessment 🎯</button>
</div>
</div>
</form>
<div id="resultsPage" style="display: none;">
<div id="patternAlert"></div>
<div id="resultsContent"></div>
</div>
</div>
</div>
`;

export function mount() {
  return ensureMounted('profileModal', TEMPLATE);
}

export function openProfile() {
  const el = document.getElementById('profileModal');
  if (!el) return null;
  el.classList.add('active');
  el.style.display = 'flex';
  return el;
}

export function closeProfile() {
  const el = document.getElementById('profileModal');
  if (!el) return null;
  el.classList.remove('active');
  el.style.display = 'none';
  return el;
}
