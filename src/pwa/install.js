// PWA install prompt — beforeinstallprompt handler + custom install button.
// Lifted from monolith S19 L20985-21120.

let deferredPrompt = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
  });
}

function showInstallButton() {
  if (document.getElementById('pwa-install-btn')) return;

  const button = document.createElement('button');
  button.id = 'pwa-install-btn';
  button.innerHTML = '📱 Install App';
  button.style.cssText = `
    position:fixed;bottom:80px;right:20px;background:linear-gradient(135deg,#0a7d5a,#10b981);
    color:white;border:none;padding:12px 20px;border-radius:25px;font-weight:600;cursor:pointer;
    box-shadow:0 4px 12px rgba(10,125,90,0.4);z-index:1000;animation:pwa-pulse 2s infinite;
  `;
  button.onclick = installPWA;
  document.body.appendChild(button);

  if (!document.getElementById('pwa-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pwa-animation-style';
    style.textContent = `@keyframes pwa-pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }`;
    document.head.appendChild(style);
  }
}

function hideInstallButton() {
  const button = document.getElementById('pwa-install-btn');
  if (button) button.remove();
}

export async function installPWA() {
  if (!deferredPrompt) {
    alert('App is already installed or install is not available on this device.');
    return;
  }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  hideInstallButton();
}

export function isInstalledPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

export function displayPWAStatus() {
  const installed = isInstalledPWA();
  return `
    <div style="padding:16px;background:${installed ? '#d4edda' : '#fef3c7'};border-radius:8px;margin-bottom:16px;">
      <div style="font-weight:600;margin-bottom:8px;color:${installed ? '#155724' : '#856404'};">
        ${installed ? '✅ App Installed' : '📱 Install Available'}
      </div>
      <div style="font-size:13px;color:${installed ? '#155724' : '#856404'};">
        ${installed
          ? 'Running as installed app with offline support'
          : 'Install this app for offline access and faster loading'}
      </div>
      ${!installed ? `
        <button onclick="installPWA()" style="margin-top:12px;width:100%;padding:10px;background:#0a7d5a;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;">📱 Install Now</button>
      ` : ''}
    </div>
  `;
}
