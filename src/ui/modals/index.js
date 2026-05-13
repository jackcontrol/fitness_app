// Modal barrel — mount() injects each lifted template into the DOM if it
// isn't already there (ensureMounted is idempotent). Wire from main.js
// bootstrap after DOMContentLoaded.
//
// Each lifted template is a verbatim copy of the monolith inline HTML.
// While monolith inline HTML still exists, ensureMounted no-ops on first
// call and modals coexist. Post-slice-8 strip, the lifted templates fill
// the gap with the same IDs / event handler wiring.
//
// Deferred to slice 8: profileModal (~1028 LOC, onboarding-coupled),
// weeklyPlanModal + swapModal inline duplicates (dynamic, built inside
// functions), paywallModal + aiPhotoLogModal + voiceLogModal (dynamic).

import * as customFood from './customFood.js';
import * as swap from './swap.js';
import * as recipeRating from './recipeRating.js';
import * as exercise from './exercise.js';
import * as food from './food.js';
import * as barcode from './barcode.js';
import * as imageRecognition from './imageRecognition.js';
import * as photoComparison from './photoComparison.js';
import * as paywall from './paywall.js';
import * as weeklyPlan from './weeklyPlan.js';
import * as voiceLog from './voiceLog.js';
import * as aiPhotoLog from './aiPhotoLog.js';
import * as profile from './profile.js';

export function mountAll() {
  customFood.mount();
  swap.mount();
  recipeRating.mount();
  exercise.mount();
  food.mount();
  barcode.mount();
  imageRecognition.mount();
  photoComparison.mount();
}

export {
  customFood, swap, recipeRating, exercise,
  food, barcode, imageRecognition, photoComparison,
  paywall, weeklyPlan, voiceLog, aiPhotoLog, profile,
};
