// Toast UI helpers. Lifted verbatim from index.html L12897 (showLogToast)
// and L13584 (showUndoToast). DOM-only. No state deps.

export function showLogToast(message) {
  const existing = document.getElementById('log-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'log-toast';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:140px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 20px;border-radius:24px;font-size:14px;font-weight:600;z-index:10001;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:fadeIn 0.2s ease;';
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2000);
}

// Short alias matching patch-IIFE closure naming. Patches V162-V1631
// all re-defined a local `toast(msg)` wrapper around showLogToast with
// console fallback. Consolidated here.
export function toast(message) {
  try {
    showLogToast(message);
  } catch (e) {
    console.log('[Sorrel]', message);
  }
}

export function showUndoToast(message, undoFn) {
  const existing = document.getElementById('log-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'log-toast';
  toast.style.cssText = 'position:fixed;bottom:140px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 16px;border-radius:24px;font-size:14px;font-weight:600;z-index:10001;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;gap:14px;max-width:90vw;';

  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(msgSpan);

  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'UNDO';
  undoBtn.style.cssText = 'background:transparent;color:#9bd5ff;border:none;font-weight:700;cursor:pointer;padding:6px 10px;font-size:13px;';
  undoBtn.onclick = (e) => {
    e.stopPropagation();
    if (typeof undoFn === 'function') undoFn();
    if (toast.parentNode) toast.remove();
  };
  toast.appendChild(undoBtn);

  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
}
