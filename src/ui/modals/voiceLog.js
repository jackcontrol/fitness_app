// Voice log modal — lifted from index.html L12424-12455.
//
// Dynamic factory: builds modal DOM and appends to body. The Web Speech
// API wiring (toggleVoiceListening, submitVoiceTranscript, closeVoiceLog)
// stays in monolith and is invoked via inline onclick handlers that
// resolve through window scope.

export function renderVoiceLogModal() {
  const existing = document.getElementById('voiceLogModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'voiceLogModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:10000;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;';
  modal.innerHTML = `
    <div style="background:var(--bg-card);border-radius:20px 20px 0 0;width:100%;max-width:600px;padding:20px 20px 32px;max-height:85vh;overflow-y:auto;box-shadow:0 -4px 20px rgba(0,0,0,0.15);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="margin:0;font-size:18px;color:var(--text-primary);">🎤 Voice log</h2>
        <button onclick="closeVoiceLog()" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-tertiary);padding:8px 12px;min-width:44px;min-height:44px;line-height:1;">✕</button>
      </div>
      <div id="voice-log-body">
        <div style="text-align:center;padding:20px 8px;">
          <div onclick="toggleVoiceListening()" id="voice-mic-btn" style="display:inline-flex;align-items:center;justify-content:center;width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,var(--accent-deep) 0%,var(--accent-primary) 50%,var(--accent-secondary) 100%);cursor:pointer;box-shadow:0 8px 24px rgba(10,125,90,0.25);transition:transform 0.15s ease,box-shadow 0.3s ease;">
            <div style="font-size:48px;color:#faf8f3;">🎤</div>
          </div>
          <div id="voice-status" style="margin-top:18px;font-size:15px;color:var(--text-primary);font-weight:500;">Tap to start speaking</div>
          <div style="margin-top:6px;font-size:12px;color:var(--text-tertiary);">Try: "I had a chicken sandwich and a Diet Coke"</div>
        </div>
        <div id="voice-transcript" style="display:none;margin-top:16px;padding:14px;background:var(--bg-elevated);border-radius:10px;font-size:14px;color:var(--text-primary);line-height:1.5;font-style:italic;"></div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="closeVoiceLog()" style="flex:1;padding:12px;background:var(--text-tertiary);color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Cancel</button>
          <button id="voice-submit-btn" onclick="submitVoiceTranscript()" disabled style="flex:2;padding:12px;background:var(--accent-primary);color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;opacity:0.5;">Analyze</button>
        </div>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => {
    if (e.target === modal && typeof window.closeVoiceLog === 'function') window.closeVoiceLog();
  });
  document.body.appendChild(modal);
  return modal;
}

export function closeVoiceLog() {
  const el = document.getElementById('voiceLogModal');
  if (el) el.remove();
}
