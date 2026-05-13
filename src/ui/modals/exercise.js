// Exercise modals — addCardioModal + addStrengthModal.
// Lifted from index.html L2969-3008 + L3010-3117.
//
// open/save logic is in src/ui/exercise.js (slice 5 lifted) — these stay
// idle. This module provides template injection + close, so slice 8 can
// strip monolith HTML.

import { ensureMounted, closeById } from './helpers.js';

const CARDIO_ID = 'addCardioModal';
const STRENGTH_ID = 'addStrengthModal';

const CARDIO_TEMPLATE = `
<div class="modal" id="addCardioModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Add Cardio Exercise</h2>
<button onclick="closeAddCardio()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Exercise Type</label>
<select id="cardio-exercise-selector" onchange="updateCardioCalories()" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;">
</select>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Duration (minutes)</label>
<input id="cardio-duration" min="1" onchange="updateCardioCalories()" style="width: 100%; padding: 12px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="30"/>
</div>
<div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #e76f51 0%, #d65a3f 100%); border-radius: 12px; color: white; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">ESTIMATED CALORIES BURNED</div>
<div id="cardio-calories-estimate" style="font-size: 36px; font-weight: 700;">240</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">calories</div>
</div>
<div style="margin-bottom: 20px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Notes (optional)</label>
<textarea id="cardio-notes" placeholder="How did it feel? Any PRs?" rows="2" style="width: 100%; padding: 12px; border: 1px solid #e8e2d6; border-radius: 8px; font-size: 14px; font-family: inherit;"></textarea>
</div>
<div class="btn-group">
<button class="btn" onclick="addCardioExercise()" style="flex: 1;">Add Cardio</button>
<button class="btn-secondary" onclick="closeAddCardio()" style="padding: 12px 20px;">Cancel</button>
</div>
</div>
</div>
`;

const STRENGTH_TEMPLATE = `
<div class="modal" id="addStrengthModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Add Strength Exercise</h2>
<button onclick="closeAddStrength()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="margin-bottom: 16px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Exercise</label>
<select id="strength-exercise-selector" onchange="updateLastSessionCard()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;">
</select>
</div>
<div id="last-session-card" style="display:none; padding: 12px 14px; background: #e7f5ee; border-left: 4px solid #0a7d5a; border-radius: 8px; margin-bottom: 14px; font-size: 13px;">
<div style="font-weight: 600; color: #0a7d5a; margin-bottom: 4px;">📊 Last session</div>
<div id="last-session-content" style="color: var(--text-primary); line-height: 1.4;"></div>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 14px;">
<button id="mode-quick-btn" onclick="setStrengthLogMode('quick')" style="flex: 1; padding: 10px; min-height: 44px; background: #0a7d5a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">⚡ Quick log</button>
<button id="mode-bysets-btn" onclick="setStrengthLogMode('bysets')" style="flex: 1; padding: 10px; min-height: 44px; background: white; color: #0a7d5a; border: 1.5px solid #0a7d5a; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">📋 Track each set</button>
</div>
<div id="strength-quick-mode">
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Sets</label>
<input id="strength-sets" min="1" oninput="updateStrengthVolume()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="3"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Reps</label>
<input id="strength-reps" min="1" oninput="updateStrengthVolume()" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="10"/>
</div>
<div>
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Weight (lbs)</label>
<input id="strength-weight" min="0" oninput="updateStrengthVolume()" step="5" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 15px;" type="number" value="135"/>
</div>
</div>
<div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); border-radius: 12px; color: white; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">TOTAL VOLUME</div>
<div id="strength-volume-display" style="font-size: 36px; font-weight: 700;">4,050</div>
<div style="font-size: 13px; opacity: 0.8; margin-top: 4px;">
<span id="strength-total-reps">30</span> total reps × <span id="strength-weight-display">135</span> lbs
</div>
</div>
</div>
<div id="strength-bysets-mode" style="display: none;">
<div style="background: #f4f1ec; padding: 14px; border-radius: 10px; margin-bottom: 12px;">
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
<div>
<label style="display: block; font-size: 12px; color: #5a6573; margin-bottom: 4px;">Reps</label>
<input id="byset-reps" min="1" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 16px;" type="number" value="10"/>
</div>
<div>
<label style="display: block; font-size: 12px; color: #5a6573; margin-bottom: 4px;">Weight (lbs)</label>
<input id="byset-weight" min="0" step="5" style="width: 100%; padding: 12px; min-height: 48px; border: 2px solid #0a7d5a; border-radius: 8px; font-size: 16px;" type="number" value="135"/>
</div>
</div>
<button onclick="addCurrentSet()" style="width: 100%; padding: 14px; background: var(--accent-gradient); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 15px; min-height: 48px;">✓ Log this set &amp; start rest timer</button>
</div>
<div id="rest-timer-card" style="display: none; padding: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; color: white; margin-bottom: 12px; text-align: center;">
<div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">REST TIMER</div>
<div id="rest-timer-display" style="font-size: 32px; font-weight: 700; line-height: 1;">02:00</div>
<div style="display: flex; gap: 8px; margin-top: 10px;">
<button onclick="adjustRestTimer(-15)" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">−15s</button>
<button onclick="adjustRestTimer(15)" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">+15s</button>
<button onclick="stopRestTimer()" style="flex: 1; padding: 8px; min-height: 40px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">Skip</button>
</div>
</div>
<div style="background: white; border: 1px solid #e8e2d6; border-radius: 10px; margin-bottom: 14px;">
<div style="padding: 10px 14px; border-bottom: 1px solid #e8e2d6; font-weight: 600; font-size: 13px; color: #1a2332;">Sets logged this session</div>
<div id="byset-list">
<div style="padding: 14px; text-align: center; color: #94a0ad; font-size: 13px;">No sets logged yet — add your first set above</div>
</div>
</div>
</div>
<div style="margin-bottom: 20px;">
<label style="display: block; margin-bottom: 6px; font-weight: 600; color: #1a2332;">Notes (optional)</label>
<textarea id="strength-notes" placeholder="Form notes, how it felt, PRs, etc." rows="2" style="width: 100%; padding: 12px; border: 1px solid #e8e2d6; border-radius: 8px; font-size: 14px; font-family: inherit;"></textarea>
</div>
<div class="btn-group">
<button class="btn" onclick="addStrengthExercise()" style="flex: 1; min-height: 48px;">Save Workout</button>
<button class="btn-secondary" onclick="closeAddStrength()" style="padding: 12px 20px; min-height: 48px;">Cancel</button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(CARDIO_ID, CARDIO_TEMPLATE);
  ensureMounted(STRENGTH_ID, STRENGTH_TEMPLATE);
}

export const closeAddCardio = () => closeById(CARDIO_ID);
export const closeAddStrength = () => closeById(STRENGTH_ID);
