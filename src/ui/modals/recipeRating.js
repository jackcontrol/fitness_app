// Recipe rating modal. Lifted from index.html L2380-2406 (HTML) +
// L26231-26330 (open/close/save).
//
// open + save couple to monolith globals (currentRatingRecipe,
// breakfastOptions, lunchRecipes, recipes, eveningOptions, state.recipeRatings).
// Lift template + close only; logic stays in monolith for 7B.

import { ensureMounted, closeById } from './helpers.js';

const MODAL_ID = 'recipeRatingModal';

const TEMPLATE = `
<div class="modal" id="recipeRatingModal">
<div class="modal-content" style="max-width: 500px;">
<h2 id="ratingModalTitle">Rate This Recipe</h2>
<p style="color: #5a6573; margin-bottom: 20px;">Share your thoughts and help personalize your experience!</p>
<div id="ratingRecipeName" style="font-size: 18px; font-weight: 600; margin-bottom: 16px; text-align: center;"></div>
<div style="text-align: center; margin-bottom: 20px;">
<div id="ratingStars" style="font-size: 48px; cursor: pointer; user-select: none;">
<span class="star" data-rating="1">☆</span>
<span class="star" data-rating="2">☆</span>
<span class="star" data-rating="3">☆</span>
<span class="star" data-rating="4">☆</span>
<span class="star" data-rating="5">☆</span>
</div>
<div id="ratingLabel" style="color: #5a6573; font-size: 14px; margin-top: 8px;">Tap to rate</div>
</div>
<div style="margin-bottom: 20px;">
<label style="display: block; font-weight: 600; margin-bottom: 8px;">Personal Notes (Optional)</label>
<textarea id="ratingNotes" placeholder="What did you like? What would you change? Any tips for next time?" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical;"></textarea>
</div>
<div class="btn-group">
<button class="btn" onclick="closeRatingModal()" style="background: var(--text-tertiary);">Cancel</button>
<button class="btn" onclick="saveRating()">Save Rating</button>
</div>
</div>
</div>
`;

export function mount() {
  ensureMounted(MODAL_ID, TEMPLATE);
}

export function close() {
  closeById(MODAL_ID);
}
