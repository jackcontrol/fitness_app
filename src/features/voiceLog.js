// Voice log subsystem — Web Speech API + Claude parsing.
// Lifted from monolith S19 L8155-8480. Module-private session state.
// renderVoiceLogModal lives in src/ui/modals/voiceLog.js; we delegate
// to window.renderVoiceLogModal so layout stays consistent with the
// already-lifted template.

let voiceLogSession = null;
let voiceRecognition = null;

function escapeAIText(s) {
  return String(s || '').replace(/[<>&"']/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;' }[c]));
}

export function openVoiceLog(mealName) {
  if (!mealName) {
    const h = new Date().getHours();
    if (h < 11) mealName = 'breakfast';
    else if (h < 15) mealName = 'lunch';
    else if (h < 21) mealName = 'dinner';
    else mealName = 'snacks';
  }
  voiceLogSession = { mealName, transcript: '', foods: [], isListening: false };
  window.voiceLogSession = voiceLogSession;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showVoiceLogError("Voice log isn't supported in this browser. Try Chrome, Safari, or Edge.");
    return;
  }
  if (typeof window.renderVoiceLogModal === 'function') window.renderVoiceLogModal();
}

export function toggleVoiceListening() {
  if (!voiceLogSession) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  if (voiceLogSession.isListening) {
    if (voiceRecognition) voiceRecognition.stop();
    return;
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = true;
  voiceRecognition.lang = 'en-US';

  const statusEl = document.getElementById('voice-status');
  const transcriptEl = document.getElementById('voice-transcript');
  const micBtn = document.getElementById('voice-mic-btn');
  const submitBtn = document.getElementById('voice-submit-btn');

  voiceRecognition.onstart = () => {
    voiceLogSession.isListening = true;
    if (statusEl) statusEl.textContent = 'Listening… tap mic to stop';
    if (micBtn) {
      micBtn.style.transform = 'scale(1.06)';
      micBtn.style.boxShadow = '0 0 0 8px rgba(16,185,129,0.18), 0 8px 24px rgba(10,125,90,0.35)';
    }
  };
  voiceRecognition.onresult = (event) => {
    let interim = '', final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += t; else interim += t;
    }
    voiceLogSession.transcript = (voiceLogSession.transcript + ' ' + final).trim();
    const show = voiceLogSession.transcript + (interim ? ' ' + interim : '');
    if (transcriptEl) {
      transcriptEl.style.display = 'block';
      transcriptEl.textContent = '"' + show + '"';
    }
    if (submitBtn && voiceLogSession.transcript.length > 0) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  };
  voiceRecognition.onerror = (event) => {
    voiceLogSession.isListening = false;
    if (statusEl) statusEl.textContent = `Couldn't catch that — ${event.error === 'no-speech' ? 'try speaking louder' : 'tap to try again'}`;
    if (micBtn) {
      micBtn.style.transform = 'scale(1)';
      micBtn.style.boxShadow = '0 8px 24px rgba(10,125,90,0.25)';
    }
  };
  voiceRecognition.onend = () => {
    voiceLogSession.isListening = false;
    if (micBtn) {
      micBtn.style.transform = 'scale(1)';
      micBtn.style.boxShadow = '0 8px 24px rgba(10,125,90,0.25)';
    }
    if (statusEl && voiceLogSession.transcript) statusEl.textContent = 'Got it. Review below or tap Analyze.';
    else if (statusEl) statusEl.textContent = 'Tap to start speaking';
  };

  try { voiceRecognition.start(); }
  catch (e) {
    setTimeout(() => { try { voiceRecognition.start(); } catch (e2) {} }, 300);
  }
}

export async function submitVoiceTranscript() {
  if (!voiceLogSession || !voiceLogSession.transcript) return;
  const body = document.getElementById('voice-log-body');
  if (!body) return;

  body.innerHTML = `
    <div style="text-align:center;padding:36px 12px;">
      <div style="display:inline-block;width:54px;height:54px;border:4px solid #eee;border-top-color:#0a7d5a;border-radius:50%;animation:spin 0.9s linear infinite;"></div>
      <div style="margin-top:18px;font-size:15px;color:#1a2332;font-weight:500;">Sorrel is parsing what you said…</div>
      <div style="margin-top:14px;padding:10px 14px;background:#f4f1ec;border-radius:8px;font-size:13px;color:#5a6573;font-style:italic;text-align:left;">"${escapeAIText(voiceLogSession.transcript)}"</div>
    </div>
  `;

  try {
    const foods = await callVoiceAnalysis(voiceLogSession.transcript);
    if (!foods || foods.length === 0) {
      showVoiceLogError("Couldn't identify any foods. Try being more specific.");
      return;
    }
    voiceLogSession.foods = foods;
    showVoiceLogReview();
  } catch (e) {
    showVoiceLogError("Couldn't reach the analysis service. Check your connection and try again.");
  }
}

async function callVoiceAnalysis(transcript) {
  const systemPrompt = `You parse spoken meal descriptions into structured nutrition data.

Return ONLY a JSON array. No prose, no markdown, no preamble.

Each item: {"name": "...", "servingSize": "...", "calories": N, "protein": N, "carbs": N, "fat": N}

Rules: estimate portions reasonably, USDA values, whole grams. If nothing parseable return [].`;

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: transcript }],
    }),
  });
  if (!response.ok) throw new Error('API ' + response.status);

  const data = await response.json();
  const blocks = Array.isArray(data.content) ? data.content : [];
  const text = blocks.map(b => b.type === 'text' ? b.text : '').join('').trim();

  let parsed = null;
  try { parsed = JSON.parse(text); }
  catch (_) {
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (fenceMatch) { try { parsed = JSON.parse(fenceMatch[1]); } catch (_) {} }
    if (!parsed) {
      const arrMatch = text.match(/\[[\s\S]*\]/);
      if (arrMatch) { try { parsed = JSON.parse(arrMatch[0]); } catch (_) {} }
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(item => item && typeof item === 'object' && item.name)
    .map(item => ({
      name: String(item.name).slice(0, 80),
      servingSize: String(item.servingSize || '1 serving').slice(0, 40),
      calories: Math.max(0, Math.round(Number(item.calories) || 0)),
      protein: Math.max(0, Math.round(Number(item.protein) || 0)),
      carbs: Math.max(0, Math.round(Number(item.carbs) || 0)),
      fat: Math.max(0, Math.round(Number(item.fat) || 0)),
    }))
    .filter(item => item.calories > 0);
}

export function showVoiceLogReview() {
  if (!voiceLogSession) return;
  const body = document.getElementById('voice-log-body');
  if (!body) return;

  const mealSlots = [
    { id: 'm0', name: 'Breakfast', emoji: '🥐' },
    { id: 'm1', name: 'Lunch',     emoji: '🥗' },
    { id: 'm2', name: 'Snack',     emoji: '🍿' },
    { id: 'm3', name: 'Dinner',    emoji: '🍽️' },
  ];
  const defaultSlot = voiceLogSession.mealName
    ? (mealSlots.find(s => s.name.toLowerCase() === voiceLogSession.mealName.toLowerCase()) || mealSlots[0])
    : mealSlots[0];
  voiceLogSession.selectedSlot = voiceLogSession.selectedSlot || defaultSlot.id;

  voiceLogSession.foods.forEach((f) => {
    if (f.selected === undefined) f.selected = true;
    if (f.multiplier === undefined) f.multiplier = 1;
  });

  const foodsHtml = voiceLogSession.foods.map((food, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#fafafa;border:1px solid #e8e2d6;border-radius:10px;margin-bottom:8px;">
      <input type="checkbox" id="vfood-${i}" ${food.selected ? 'checked' : ''} onchange="toggleVoiceFoodSelection(${i})" style="width:20px;height:20px;cursor:pointer;flex-shrink:0;">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;color:#1a2332;">${escapeAIText(food.name)}</div>
        <div style="font-size:12px;color:#5a6573;margin-top:2px;">${escapeAIText(food.servingSize)} · ${food.calories} cal · ${food.protein}p / ${food.carbs}c / ${food.fat}f</div>
      </div>
    </div>
  `).join('');

  const slotsHtml = mealSlots.map(slot => `
    <button onclick="selectVoiceMealSlot('${slot.id}')" id="vslot-${slot.id}"
            style="flex:1;padding:8px;background:${voiceLogSession.selectedSlot === slot.id ? '#0a7d5a' : '#fafafa'};color:${voiceLogSession.selectedSlot === slot.id ? 'white' : '#1a2332'};border:1px solid ${voiceLogSession.selectedSlot === slot.id ? '#0a7d5a' : '#e8e2d6'};border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">
      ${slot.emoji} ${slot.name}
    </button>`).join('');

  body.innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;color:#94a0ad;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:8px;">Log into</div>
      <div style="display:flex;gap:6px;">${slotsHtml}</div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;color:#94a0ad;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:8px;">Sorrel heard</div>
      ${foodsHtml}
    </div>
    <div id="voice-totals" style="padding:10px 12px;background:#e7f5ee;border-radius:8px;margin-bottom:14px;font-size:13px;color:#0a7d5a;font-weight:500;"></div>
    <div style="display:flex;gap:10px;">
      <button onclick="closeVoiceLog()" style="flex:1;padding:12px;background:#94a0ad;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Cancel</button>
      <button onclick="confirmVoiceLog()" style="flex:2;padding:12px;background:#0a7d5a;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Save to diary</button>
    </div>
  `;
  updateVoiceTotals();
}

export function selectVoiceMealSlot(slotId) {
  if (!voiceLogSession) return;
  voiceLogSession.selectedSlot = slotId;
  showVoiceLogReview();
}

export function toggleVoiceFoodSelection(idx) {
  if (!voiceLogSession || !voiceLogSession.foods[idx]) return;
  voiceLogSession.foods[idx].selected = !voiceLogSession.foods[idx].selected;
  updateVoiceTotals();
}

export function updateVoiceTotals() {
  if (!voiceLogSession) return;
  const totals = voiceLogSession.foods
    .filter(f => f.selected)
    .reduce((acc, f) => ({
      cal: acc.cal + f.calories * f.multiplier,
      p:   acc.p   + f.protein  * f.multiplier,
      c:   acc.c   + f.carbs    * f.multiplier,
      fat: acc.fat + f.fat      * f.multiplier,
    }), { cal: 0, p: 0, c: 0, fat: 0 });
  const totalsEl = document.getElementById('voice-totals');
  if (totalsEl) totalsEl.textContent = `Total: ${Math.round(totals.cal)} cal · ${Math.round(totals.p)}g protein · ${Math.round(totals.c)}g carbs · ${Math.round(totals.fat)}g fat`;
}

export function confirmVoiceLog() {
  if (!voiceLogSession) return;
  const slot = voiceLogSession.selectedSlot;
  const ts = Date.now();
  const foodDatabase = window.foodDatabase;

  voiceLogSession.foods.filter(f => f.selected).forEach((food, i) => {
    const id = `voice_${ts}_${i}`;
    if (foodDatabase) {
      foodDatabase[id] = {
        name: food.name,
        servings: [{ size: food.servingSize, grams: 100 }],
        calories: food.calories * food.multiplier,
        protein: food.protein * food.multiplier,
        carbs: food.carbs * food.multiplier,
        fat: food.fat * food.multiplier,
      };
    }
    if (typeof window.addFoodToMealDirect === 'function') {
      window.addFoodToMealDirect(slot, id, 0, 1);
    }
  });

  closeVoiceLog();
  if (typeof window.showLogToast === 'function') {
    const n = voiceLogSession?.foods.filter(f => f.selected).length || 0;
    window.showLogToast(`Logged ${n} food${n !== 1 ? 's' : ''}`);
  }
  voiceLogSession = null;
  window.voiceLogSession = null;
}

export function closeVoiceLog() {
  const modal = document.getElementById('voiceLogModal');
  if (modal) modal.remove();
  if (voiceRecognition) {
    try { voiceRecognition.stop(); } catch (_) {}
    voiceRecognition = null;
  }
  voiceLogSession = null;
  window.voiceLogSession = null;
}

export function showVoiceLogError(message) {
  const body = document.getElementById('voice-log-body');
  if (!body) {
    if (typeof window.showLogToast === 'function') window.showLogToast(message);
    else alert(message);
    return;
  }
  body.innerHTML = `
    <div style="text-align:center;padding:30px 12px;">
      <div style="font-size:36px;margin-bottom:14px;">🎤</div>
      <div style="font-size:15px;color:#1a2332;font-weight:500;line-height:1.5;margin-bottom:18px;">${escapeAIText(message)}</div>
      <button onclick="closeVoiceLog()" style="padding:12px 24px;background:#0a7d5a;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Close</button>
    </div>
  `;
}
