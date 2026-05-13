// Image recognition modal. Lifted from index.html L2559-2608.
//
// AI photo flow (capturePhoto / uploadPhoto / processUploadedImage /
// takeFoodPhoto) stays in monolith for 7B. Template + close lifted.

import { ensureMounted, closeById } from './helpers.js';

const MODAL_ID = 'imageRecognitionModal';

const TEMPLATE = `
<div class="modal" id="imageRecognitionModal">
<div class="modal-content" style="max-width: 600px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">📸 Identify Food</h2>
<button onclick="closeImageRecognition()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="padding: 16px; background: #e8f5e9; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #2e7d32;">
      🤖 <strong>AI-powered food recognition</strong> - Take a photo or upload an image
    </div>
<div style="display: flex; gap: 12px; margin-bottom: 16px;">
<button onclick="capturePhoto()" style="flex: 1; padding: 16px; background: white; border: 2px solid #0a7d5a; color: #0a7d5a; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">📷 Take Photo</button>
<button onclick="uploadPhoto()" style="flex: 1; padding: 16px; background: white; border: 2px solid #0a7d5a; color: #0a7d5a; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">📁 Upload Image</button>
</div>
<input accept="image/*" id="food-image-input" onchange="processUploadedImage()" style="display: none;" type="file"/>
<div id="food-image-preview" style="display: none; margin-bottom: 16px;">
<img id="food-preview-img" style="width: 100%; border-radius: 8px; max-height: 300px; object-fit: cover;"/>
</div>
<div id="food-camera-container" style="display: none; margin-bottom: 16px;">
<video autoplay="" id="food-camera-video" style="width: 100%; border-radius: 8px;"></video>
<button onclick="takeFoodPhoto()" style="width: 100%; margin-top: 12px; padding: 16px; background: #0a7d5a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">📸 Capture</button>
</div>
<div id="food-recognition-results" style="display: none;">
<div style="padding: 16px; background: #f4f1ec; border-radius: 8px; margin-bottom: 16px;">
<div style="font-weight: 600; margin-bottom: 12px; font-size: 16px;">🎯 Identified Foods:</div>
<div id="food-predictions-list"></div>
</div>
<div style="padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 13px; color: #856404;">💡 <strong>Tip:</strong> Nutrition values are estimates. Adjust serving size as needed.</div>
</div>
<div id="image-recognition-status" style="padding: 12px; background: #f4f1ec; border-radius: 8px; text-align: center; font-weight: 600;">Choose an option above to get started</div>
<div class="btn-group" style="margin-top: 16px;">
<button class="btn" onclick="closeImageRecognition()" style="background: var(--text-tertiary);">Cancel</button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(MODAL_ID, TEMPLATE);
}

export const close = () => closeById(MODAL_ID);
