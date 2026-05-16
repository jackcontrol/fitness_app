// Feature barrel — re-exports every feature module so main.js can pull
// them under a single namespace.
//
// Pure-helper modules (diet, budget) re-export at the top level so callers
// get the same names as before (`canonicalDietType`, `getBudget`, etc.).
// Stateful modules are exposed as namespaces to avoid collisions with each
// other (e.g. both diary and training have `ensureDateEntry`).
export * from './diet.js';
export * from './budget.js';
export * as fasting from './fasting.js';
export * as diary from './diary.js';
export * as plan from './plan.js';
export * as progress from './progress.js';
export * as training from './training.js';
export * as customFoods from './customFoods.js';
export * as trial from './trial.js';
export * as routine from './routine.js';
