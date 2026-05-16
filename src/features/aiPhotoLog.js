// AI photo log downstream — file → resize → API → review → confirm.
// Lifted from monolith S19 L7716-8093. Reads window.aiPhotoSession
// (initialized by src/ui/modals/aiPhotoLog.js#openAIPhotoLog), routes
// addFoodToMealDirect / renderFoodDiary / updateMainPagePlanner / showLogToast
// via window.* (defensive — boot order independent).

import { AI_PHOTO_CONFIG } from '../data/api-config.js';

export function escapeAIText(s) {
  return String(s || '').replace(/[<>&"']/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;' }[c]));
}

export async function handleAIPhotoFile(event) {
  const file = event.target && event.target.files && event.target.files[0];
  if (!file) return;

  const modal = document.getElementById('aiPhotoLogModal');
  if (modal) {
    const inner = modal.querySelector('div');
    if (inner) {
      inner.innerHTML = `
        <h2 style="margin:0 0 16px 0;font-size:20px;color:#1a2332;">🤖 Analyzing photo…</h2>
        <div style="padding:30px;">
          <div style="display:inline-block;width:48px;height:48px;border:4px solid #eee;border-top-color:#0a7d5a;border-radius:50%;animation:aispin 0.8s linear infinite;"></div>
        </div>
        <p style="color:#5a6573;font-size:13px;margin:0;line-height:1.4;">Identifying foods and estimating macros. 5–15 seconds.</p>
        <style>@keyframes aispin { to { transform: rotate(360deg); } }</style>
      `;
    }
  }

  try {
    const resized = await resizeImageForAI(file);
    if (!window.aiPhotoSession) window.aiPhotoSession = { mealName: 'snacks', foods: [] };
    window.aiPhotoSession.imageDataUrl = resized.dataUrl;
    const foods = await callAIPhotoAnalysis(resized.base64, resized.mediaType);
    if (!foods || foods.length === 0) {
      showAIPhotoError("Couldn't identify any foods. Try a clearer shot or use search.");
      return;
    }
    window.aiPhotoSession.foods = foods;
    showAIPhotoReview();
  } catch (err) {
    console.error('AI photo analysis failed:', err);
    showAIPhotoError(err.message || 'Something went wrong. Check your connection and try again.');
  }
}

export function resizeImageForAI(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read photo file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode photo.'));
      img.onload = () => {
        const maxDim = AI_PHOTO_CONFIG.maxImageDimension;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h / w) * maxDim); w = maxDim; }
          else       { w = Math.round((w / h) * maxDim); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', AI_PHOTO_CONFIG.jpegQuality);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mediaType: 'image/jpeg', dataUrl });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function callAIPhotoAnalysis(base64, mediaType) {
  const prompt = `You are a nutrition analysis assistant. Analyze this food photo and identify each distinct food item visible.

For each food, estimate:
- name: the food name (be specific)
- servingDescription: a realistic visual estimate of the portion shown
- calories: estimated calories for the portion shown (integer)
- protein: grams of protein (integer)
- carbs: grams of carbs (integer)
- fat: grams of fat (integer)

Return ONLY valid JSON in this exact format:
{"foods": [{"name": "...", "servingDescription": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}]}`;

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_PHOTO_CONFIG.model,
      max_tokens: AI_PHOTO_CONFIG.maxTokens,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: prompt },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`API request failed (${response.status}). ${errText.slice(0, 100)}`);
  }

  const data = await response.json();
  const textBlocks = (data.content || []).filter(b => b.type === 'text');
  const fullText = textBlocks.map(b => b.text || '').join('\n').trim();
  if (!fullText) throw new Error('Empty response from AI.');

  const cleaned = fullText.replace(/```json\s*|```/g, '').trim();
  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI response was not valid JSON.');
    parsed = JSON.parse(match[0]);
  }
  if (!parsed || !Array.isArray(parsed.foods)) throw new Error('AI response did not contain a foods array.');

  return parsed.foods.map(f => ({
    name: String(f.name || 'Unknown food').slice(0, 80),
    servingDescription: String(f.servingDescription || '1 serving').slice(0, 40),
    calories: Math.max(0, Math.round(Number(f.calories) || 0)),
    protein: Math.max(0, Math.round(Number(f.protein) || 0)),
    carbs: Math.max(0, Math.round(Number(f.carbs) || 0)),
    fat: Math.max(0, Math.round(Number(f.fat) || 0)),
  })).filter(f => f.calories > 0);
}

export function showAIPhotoReview() {
  const modal = document.getElementById('aiPhotoLogModal');
  if (!modal) return;
  const inner = modal.querySelector('div');
  if (!inner) return;
  const session = window.aiPhotoSession || { foods: [] };

  const totalCal = session.foods.reduce((s, f) => s + f.calories, 0);
  const totalP = session.foods.reduce((s, f) => s + f.protein, 0);
  const totalC = session.foods.reduce((s, f) => s + f.carbs, 0);
  const totalF = session.foods.reduce((s, f) => s + f.fat, 0);

  inner.style.maxHeight = '90vh';
  inner.style.overflowY = 'auto';
  inner.style.textAlign = 'left';
  inner.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <h2 style="margin:0;font-size:20px;color:#1a2332;">Review &amp; save</h2>
      <button onclick="document.getElementById('aiPhotoLogModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
    </div>
    ${session.imageDataUrl ? `
      <div style="margin-bottom:14px;border-radius:10px;overflow:hidden;max-height:180px;display:flex;justify-content:center;background:#f0f0f0;">
        <img src="${session.imageDataUrl}" style="max-height:180px;max-width:100%;object-fit:contain;">
      </div>
    ` : ''}
    <div id="aiFoodsList">
      ${session.foods.map((f, i) => `
        <div style="border:1px solid #e8e2d6;border-radius:10px;padding:12px;margin-bottom:8px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <input type="checkbox" id="aifood-${i}" checked style="margin-top:3px;width:18px;height:18px;cursor:pointer;flex-shrink:0;">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;color:#1a2332;font-size:14px;">${escapeAIText(f.name)}</div>
              <div style="font-size:11px;color:#94a0ad;margin-top:2px;">~${escapeAIText(f.servingDescription)}</div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
                <label style="font-size:11px;color:#5a6573;">×</label>
                <input type="number" id="aimult-${i}" value="1" min="0.25" max="10" step="0.25" onchange="updateAIPhotoTotals()" style="width:60px;padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:13px;">
                <span style="font-size:11px;color:#94a0ad;">servings</span>
              </div>
              <div style="font-size:11px;color:#5a6573;margin-top:6px;" id="aimacros-${i}">${f.calories} cal · P ${f.protein} · C ${f.carbs} · F ${f.fat}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="background:#f4f1ec;border-radius:10px;padding:12px;margin:14px 0;">
      <div style="font-size:11px;color:#5a6573;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">Selected total</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <div style="font-size:22px;font-weight:700;color:#1a2332;" id="aiTotalCal">${totalCal} cal</div>
        <div style="font-size:12px;color:#5a6573;" id="aiTotalMacros">P ${totalP}g · C ${totalC}g · F ${totalF}g</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;">
      <button onclick="document.getElementById('aiPhotoLogModal').remove();window.openAIPhotoLog&&window.openAIPhotoLog('${session.mealName}');" style="flex:1;padding:12px;background:white;color:#5a6573;border:1px solid #e8e2d6;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px;">↻ Retry</button>
      <button onclick="confirmAIPhotoLog()" style="flex:2;padding:12px;background:linear-gradient(135deg,#0a7d5a,#10b981);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;">Save to ${session.mealName}</button>
    </div>
  `;
}

export function updateAIPhotoTotals() {
  const session = window.aiPhotoSession;
  if (!session) return;
  let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
  session.foods.forEach((f, i) => {
    const cb = document.getElementById('aifood-' + i);
    const mult = document.getElementById('aimult-' + i);
    const macros = document.getElementById('aimacros-' + i);
    const m = parseFloat((mult && mult.value) || '1') || 1;
    const cal = Math.round(f.calories * m);
    const p = Math.round(f.protein * m);
    const c = Math.round(f.carbs * m);
    const fa = Math.round(f.fat * m);
    if (macros) macros.textContent = `${cal} cal · P ${p} · C ${c} · F ${fa}`;
    if (cb && cb.checked) {
      totalCal += cal; totalP += p; totalC += c; totalF += fa;
    }
  });
  const totalCalEl = document.getElementById('aiTotalCal');
  const totalMacrosEl = document.getElementById('aiTotalMacros');
  if (totalCalEl) totalCalEl.textContent = `${totalCal} cal`;
  if (totalMacrosEl) totalMacrosEl.textContent = `P ${totalP}g · C ${totalC}g · F ${totalF}g`;
}

export function confirmAIPhotoLog() {
  const session = window.aiPhotoSession;
  if (!session) return;
  const mealName = session.mealName;
  const mealIdMap = { breakfast: 'm0', lunch: 'm1', dinner: 'm2', snacks: 'm3' };
  const mealId = mealIdMap[mealName] || 'm0';
  const ts = Date.now();
  let savedCount = 0;
  const foodDatabase = window.foodDatabase;

  session.foods.forEach((f, i) => {
    const cb = document.getElementById('aifood-' + i);
    if (!cb || !cb.checked) return;
    const mult = document.getElementById('aimult-' + i);
    const m = parseFloat((mult && mult.value) || '1') || 1;
    const id = `ai_${ts}_${i}`;
    if (foodDatabase) {
      foodDatabase[id] = {
        id, name: f.name, category: 'ai-photo',
        calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat,
        baseServing: f.servingDescription,
        servings: [f.servingDescription],
        source: 'ai-photo',
      };
    }
    if (typeof window.addFoodToMealDirect === 'function') {
      window.addFoodToMealDirect(mealId, id, 0, m);
      savedCount++;
    }
  });

  const modal = document.getElementById('aiPhotoLogModal');
  if (modal) modal.remove();
  if (typeof window.renderFoodDiary === 'function') window.renderFoodDiary();
  if (typeof window.updateMainPagePlanner === 'function') window.updateMainPagePlanner();
  if (savedCount > 0 && typeof window.showLogToast === 'function') {
    window.showLogToast(`Added ${savedCount} food${savedCount > 1 ? 's' : ''} to ${mealName}`);
  } else if (typeof window.showLogToast === 'function') {
    window.showLogToast('No foods selected');
  }
}

export function showAIPhotoError(message) {
  const modal = document.getElementById('aiPhotoLogModal');
  if (!modal) return;
  const inner = modal.querySelector('div');
  if (!inner) return;
  const session = window.aiPhotoSession || {};
  inner.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      <h2 style="margin:0;font-size:20px;color:#1a2332;">⚠️ Couldn't analyze</h2>
      <button onclick="document.getElementById('aiPhotoLogModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
    </div>
    <p style="color:#5a6573;font-size:14px;margin:0 0 18px 0;line-height:1.5;">${escapeAIText(message)}</p>
    <div style="display:flex;gap:8px;">
      <button onclick="document.getElementById('aiPhotoLogModal').remove();" style="flex:1;padding:12px;background:white;color:#5a6573;border:1px solid #e8e2d6;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px;">Cancel</button>
      <button onclick="document.getElementById('aiPhotoLogModal').remove();window.openAIPhotoLog&&window.openAIPhotoLog('${session.mealName || ''}');" style="flex:1;padding:12px;background:linear-gradient(135deg,#0a7d5a,#10b981);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;">Try again</button>
    </div>
  `;
}
