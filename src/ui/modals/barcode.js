// Barcode scanner modal. Lifted from index.html L2525-2557.
//
// Quagga lifecycle (start/stop on open/close) stays in monolith for 7B —
// tightly coupled to scanner state. This module provides template + close.

import { ensureMounted, closeById } from './helpers.js';

const MODAL_ID = 'barcodeScannerModal';

const TEMPLATE = `
<div class="modal" id="barcodeScannerModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">📷 Scan Barcode</h2>
<button onclick="closeBarcodeScanner()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="padding: 16px; background: #e3f2fd; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #1976d2;">
      📱 <strong>Point your camera at a barcode</strong> on any packaged food product
    </div>
<div id="barcode-scanner-container" style="position: relative; width: 100%; max-width: 100%; margin-bottom: 16px;">
<video id="barcode-video" style="width: 100%; border-radius: 8px; background: #000;"></video>
<canvas id="barcode-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></canvas>
</div>
<div id="barcode-status" style="padding: 12px; background: #f4f1ec; border-radius: 8px; margin-bottom: 16px; text-align: center; font-weight: 600;">
      Initializing camera...
    </div>
<div style="border-top: 1px solid #d8d2c4; padding-top: 16px;">
<label style="display: block; margin-bottom: 8px; font-weight: 600;">Or enter barcode manually:</label>
<div style="display: flex; gap: 8px;">
<input id="manual-barcode-input" placeholder="Enter UPC/EAN code" style="flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 15px;" type="text"/>
<button onclick="lookupManualBarcode()" style="padding: 12px 20px; background: #0a7d5a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Lookup</button>
</div>
</div>
<div class="btn-group" style="margin-top: 16px;">
<button class="btn" onclick="closeBarcodeScanner()" style="background: var(--text-tertiary);">Cancel</button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(MODAL_ID, TEMPLATE);
}

export const close = () => closeById(MODAL_ID);
