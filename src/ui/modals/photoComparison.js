// Photo comparison modal. Lifted from index.html L3406-3432.
//
// Before/after side-by-side viewer. Image src + dates populated by
// monolith showComparison flow. Template + close lifted.

import { ensureMounted, closeById } from './helpers.js';

const MODAL_ID = 'photoComparisonModal';

const TEMPLATE = `
<div class="modal" id="photoComparisonModal">
<div class="modal-content" style="max-width: 800px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
<h2 style="margin: 0;">Before &amp; After Comparison</h2>
<button onclick="closePhotoComparison()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #94a0ad;">×</button>
</div>
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
<div>
<div style="font-weight: 600; margin-bottom: 8px; text-align: center;">BEFORE</div>
<img id="comparison-before-img" style="width: 100%; border-radius: 8px; border: 1px solid #e8e2d6;"/>
<div id="comparison-before-date" style="text-align: center; font-size: 13px; color: #5a6573; margin-top: 8px;">--</div>
</div>
<div>
<div style="font-weight: 600; margin-bottom: 8px; text-align: center;">AFTER</div>
<img id="comparison-after-img" style="width: 100%; border-radius: 8px; border: 1px solid #e8e2d6;"/>
<div id="comparison-after-date" style="text-align: center; font-size: 13px; color: #5a6573; margin-top: 8px;">--</div>
</div>
</div>
<div style="margin-top: 20px; padding: 16px; background: var(--accent-gradient); border-radius: 8px; color: white; text-align: center;">
<div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">TIME DIFFERENCE</div>
<div id="comparison-days" style="font-size: 28px; font-weight: 700;">0 days</div>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(MODAL_ID, TEMPLATE);
}

export const close = () => closeById(MODAL_ID);
