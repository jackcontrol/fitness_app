// AI photo log modal — lifted from index.html L11963-12012.
//
// Public entry only. The downstream flow (handleAIPhotoFile,
// resizeImageForAI, callAIPhotoAnalysis, showAIPhotoReview,
// confirmAIPhotoLog, escapeAIText, updateAIPhotoTotals) stays in the
// monolith; inline onclick/onchange handlers resolve via window scope.
// Slice 8.2 will pull the full flow into modules. Until then this lift
// is dormant — monolith owns the active definition.
//
// `aiPhotoSession` is a global initialized here so monolith's followers
// see it. We write to window explicitly because the module runs in
// strict mode.

export function openAIPhotoLog(mealName) {
  if (!mealName) {
    const h = new Date().getHours();
    if (h < 11) mealName = 'breakfast';
    else if (h < 15) mealName = 'lunch';
    else if (h < 21) mealName = 'dinner';
    else mealName = 'snacks';
  }

  window.aiPhotoSession = { mealName, foods: [], imageDataUrl: null };

  const existing = document.getElementById('aiPhotoLogModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'aiPhotoLogModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;max-width:480px;width:100%;padding:24px;text-align:center;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h2 style="margin:0;font-size:20px;color:#1a2332;">🤖 AI photo log</h2>
        <button onclick="document.getElementById('aiPhotoLogModal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a0ad;padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>
      <p style="color:#5a6573;font-size:13px;margin:0 0 20px 0;line-height:1.4;">
        Snap a photo of your meal. AI will identify foods and estimate macros for ${mealName}. You'll review before saving.
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <label style="display:block;cursor:pointer;">
          <input type="file" id="aiPhotoFileInput" accept="image/*" capture="environment" style="display:none;" onchange="handleAIPhotoFile(event)">
          <div style="padding:18px;background:var(--accent-gradient);color:white;border-radius:12px;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px;">
            📷 Take photo
          </div>
        </label>
        <label style="display:block;cursor:pointer;">
          <input type="file" id="aiPhotoGalleryInput" accept="image/*" style="display:none;" onchange="handleAIPhotoFile(event)">
          <div style="padding:14px;background:white;color:#0a7d5a;border:1.5px solid #0a7d5a;border-radius:12px;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:10px;">
            🖼️ Choose from gallery
          </div>
        </label>
      </div>
      <p style="color:#94a0ad;font-size:11px;margin:14px 0 0 0;line-height:1.4;">
        AI estimates are approximations. You can edit serving sizes before saving.
      </p>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  return modal;
}

export function closeAIPhotoLog() {
  const el = document.getElementById('aiPhotoLogModal');
  if (el) el.remove();
}
