import './styles/main.css';

import Chart from 'chart.js/auto';
import Quagga from '@ericblade/quagga2';

import {
  getProfile, saveProfile, clearProfile,
  loadState, saveState, defaultState, ensure,
} from './state/index.js';

import {
  canonicalDietType, canonicalAllergens, classifyForVegan,
  getBudget, setBudget,
  fasting, diary, plan, progress, training, customFoods,
  trial, routine,
} from './features/index.js';

import {
  showLogToast, showUndoToast,
  updateBaselineBanner, updateTrialBanner,
  updateTrainRecoveryBanner, updateIntelligenceBanners,
  updateStats,
} from './ui/helpers/index.js';

import * as modals from './ui/modals/index.js';

import { logSunlight, renderHealthSunlightStable, sunlightMap } from './features/sunlight.js';

// 8.2a survivor lifts.
import {
  customItems, saveCustomItems,
  addCustomRoutineItem, toggleCustomRoutineItem, removeCustomRoutineItem,
  installCustomRoutineHandlers,
} from './features/customRoutine.js';
import {
  hydrateCount, ensureHydrationToday, updateHydrationProgress,
  logOneGlass, undoLastGlass, resetWaterToday,
} from './features/hydration.js';
import {
  nextMeal, nextRoutineAction, nextLogAction, usefulLogsLeft,
} from './features/coaching.js';
import {
  purchaseCost, weeklyCost, pantryHas, normalizeItems,
  buildItemsFromWeekPlan, shoppingItems,
} from './features/shopping.js';
import { mealForSlot, recipeDbs, ingredientFor } from './features/recipes.js';
import { renderCustomRoutineItems } from './ui/routine.js';
import { renderPlanNextSteps, renderPlanWeightChip } from './ui/plan.js';
import { appState, appProfile, saveAll, saveQuiet, saveProfileQuiet } from './state/accessors.js';
import { toast } from './ui/helpers/toast.js';
import { esc } from './utils/html.js';
import { $, qa, byId } from './utils/dom.js';
import { money } from './utils/format.js';
import { TAXONOMY } from './data/taxonomy.js';

import './ui/topbanner.js';

window.Chart = Chart;
window.Quagga = Quagga;

window.Sorrel = {
  getProfile, saveProfile, clearProfile,
  loadState, saveState, defaultState, ensure,
  canonicalDietType, canonicalAllergens, classifyForVegan,
  getBudget, setBudget,
  fasting, diary, plan, progress, training, customFoods,
  trial, routine,
  helpers: {
    showLogToast, showUndoToast,
    updateBaselineBanner, updateTrialBanner,
    updateTrainRecoveryBanner, updateIntelligenceBanners,
    updateStats,
  },
};

// Expose lifted helpers under their original names so slice 5 modules and
// other window.* callers find them. Monolith's bare-identifier calls
// (e.g. `showLogToast(...)`) still resolve to monolith's own function
// declarations via script scope, so the two versions coexist until slice 8.
window.showLogToast = showLogToast;
window.showUndoToast = showUndoToast;
window.updateBaselineBanner = updateBaselineBanner;
window.updateTrialBanner = updateTrialBanner;
window.updateTrainRecoveryBanner = updateTrainRecoveryBanner;
window.updateIntelligenceBanners = updateIntelligenceBanners;
window.updateStats = updateStats;
window.checkTrialExpiry = trial.checkTrialExpiry;
window.ensureTrialState = trial.ensureTrialState;
window.getTrialDaysLeft = trial.getTrialDaysLeft;
window.isAdaptiveUnlocked = trial.isAdaptiveUnlocked;
window.getTodaysIntensityRecommendation = training.getTodaysIntensityRecommendation;
window.getHydrationSchedule = routine.getHydrationSchedule;
// getDayData mutates state[category][dayKey] in place. Read monolith's
// live state (published on window by patch IIFEs at L33171+) to keep
// mutations visible to monolith; fall back to a fresh loadState() snapshot
// only when window.state is not yet available.
window.getDayData = (category) => {
  const state = window.state || loadState();
  return plan.getDayData(state, category);
};

// Sunlight helpers — idle until slice 8.2 IIFE collapse. Monolith's
// IIFE-local copies at L36211 / L36222 still drive the live code path.
window.sorrelLogSunlightLifted = logSunlight;
window.sorrelRenderHealthSunlightLifted = renderHealthSunlightStable;
window.sorrelSunlightMapLifted = sunlightMap;

// Lifted modal factories — dormant copies. Monolith owns the active
// definitions; these aliases let callers route through the lifted
// module if they reach for window.sorrel*Lifted explicitly.
window.sorrelShowPaywallModalLifted = modals.paywall.showPaywallModal;
// V1622 reconciled — openWeeklyPlanModal is now the live version.
window.openWeeklyPlanModal = modals.weeklyPlan.openWeeklyPlanModal;
window.closeWeeklyPlanModal = modals.weeklyPlan.closeWeeklyPlanModal;
window.sorrelV1622EnsureWeekPlan = modals.weeklyPlan.ensureWeekPlan;
window.sorrelV1622CurrentPlanDayIndex = modals.weeklyPlan.currentDayIndex;
window.sorrelV1622OpenRecipe = modals.weeklyPlan.openRecipeModal;
window.sorrelV1622OpenSwap = modals.weeklyPlan.openSwapModal;
window.sorrelV1622ChooseSwap = modals.weeklyPlan.chooseSwap;
window.sorrelV1622ToggleLock = modals.weeklyPlan.toggleLock;
window.sorrelV1622ClearLocks = modals.weeklyPlan.clearLocks;
window.sorrelV1622RepeatMeal = modals.weeklyPlan.repeatMeal;
window.sorrelV1622UndoRepeat = modals.weeklyPlan.undoRepeat;
window.sorrelV1622ValidateWeek = modals.weeklyPlan.validateWeek;
window.sorrelV1622OpenWeek = modals.weeklyPlan.openWeek;
window.sorrelOpenWeeklyPlanModalLifted = modals.weeklyPlan.openWeeklyPlanModal;
window.sorrelCloseWeeklyPlanModalLifted = modals.weeklyPlan.closeWeeklyPlanModal;
window.sorrelShowSwapModalLifted = modals.swap.showSwapModal;
window.sorrelCloseSwapModalLifted = modals.swap.closeSwapModal;
window.sorrelRenderVoiceLogModalLifted = modals.voiceLog.renderVoiceLogModal;
window.sorrelCloseVoiceLogLifted = modals.voiceLog.closeVoiceLog;
window.sorrelOpenAIPhotoLogLifted = modals.aiPhotoLog.openAIPhotoLog;
window.sorrelCloseAIPhotoLogLifted = modals.aiPhotoLog.closeAIPhotoLog;
window.sorrelOpenProfileLifted = modals.profile.openProfile;
window.sorrelCloseProfileLifted = modals.profile.closeProfile;

// 8.2a — patch-IIFE survivor shims. Module loads AFTER monolith
// script parse, so these window.* assignments override the IIFE's own
// `window.X = ...` lines once the IIFEs are deleted in 8.2b. For now
// the IIFEs still run and last-write-wins (still IIFE) holds.
window.renderCustomRoutineItems = renderCustomRoutineItems;
window.addCustomRoutineItem = addCustomRoutineItem;
window.toggleCustomRoutineItem = toggleCustomRoutineItem;
window.removeCustomRoutineItem = removeCustomRoutineItem;
window.ensureHydrationToday = ensureHydrationToday;
window.updateHydrationProgress = updateHydrationProgress;
window.logOneGlass = logOneGlass;
window.undoLastGlass = undoLastGlass;
window.resetWaterToday = resetWaterToday;
window.renderPlanNextSteps = renderPlanNextSteps;
window.renderPlanWeightChip = renderPlanWeightChip;
window.logSunlight = logSunlight;
window.renderHealthSunlight = renderHealthSunlightStable;
window.sorrelHydrateCountLifted = hydrateCount;
window.sorrelNextMealLifted = nextMeal;
window.sorrelNextRoutineActionLifted = nextRoutineAction;
window.sorrelNextLogActionLifted = nextLogAction;
window.sorrelUsefulLogsLeftLifted = usefulLogsLeft;
window.sorrelMealForSlotLifted = mealForSlot;
window.sorrelRecipeDbsLifted = recipeDbs;
window.sorrelIngredientForLifted = ingredientFor;
window.sorrelPurchaseCostLifted = purchaseCost;
window.sorrelWeeklyCostLifted = weeklyCost;
window.sorrelPantryHasLifted = pantryHas;
window.sorrelNormalizeItemsLifted = normalizeItems;
window.sorrelBuildItemsFromWeekPlanLifted = buildItemsFromWeekPlan;
window.sorrelShoppingItemsLifted = shoppingItems;
window.sorrelAppStateLifted = appState;
window.sorrelAppProfileLifted = appProfile;
window.sorrelSaveAllLifted = saveAll;
window.sorrelSaveQuietLifted = saveQuiet;
window.sorrelSaveProfileQuietLifted = saveProfileQuiet;
window.sorrelToastLifted = toast;
window.sorrelEscLifted = esc;
window.sorrelMoneyLifted = money;
window.sorrelDollarLifted = $;
window.sorrelQaLifted = qa;
window.sorrelByIdLifted = byId;

// V1628 survivors — diet + budget public surface.
window.sorrelGetBudget = getBudget;
window.sorrelSetBudget = setBudget;
window.sorrelCanonicalDietType = canonicalDietType;
window.sorrelCanonicalAllergens = canonicalAllergens;
// V1629 survivor — vegan classifier.
window.sorrelClassifyForVegan = classifyForVegan;
window.sorrelTaxonomy = TAXONOMY;

function bootstrap() {
  const profile = getProfile();
  const state = loadState();
  modals.mountAll();
  modals.weeklyPlan.mount();
  // Capture-phase delegate for custom routine card buttons.
  // Safe to install before IIFE deletion: V163 IIFE also installs one,
  // both handlers fire but the V163 handler short-circuits via
  // stopImmediatePropagation, so only one CRUD path runs per click.
  installCustomRoutineHandlers();
  const mountIds = ['app', 'root', 'sorrel-root', 'main-content'];
  const mount = mountIds.map(id => document.getElementById(id)).find(Boolean);
  if (mount) {
    const banner = document.createElement('div');
    banner.dataset.sorrelBanner = '1';
    banner.style.cssText = 'padding:6px 10px;font:12px ui-monospace,monospace;background:#0a7d5a;color:#fff;';
    banner.textContent = `Sorrel modules loaded — profile: ${profile ? 'yes' : 'no'}, state keys: ${Object.keys(state).length}`;
    mount.prepend(banner);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
