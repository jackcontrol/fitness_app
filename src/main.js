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
import {
  nextPage as profileNextPage,
  prevPage as profilePrevPage,
  skipDetailedAssessment as profileSkipDetailedAssessment,
  openProfileModal,
  closeProfileModal,
  openProfileEdit,
  closeProfileEditModal,
} from './ui/modals/profile-controller.js';
import { checkProfile } from './bootstrap/checkProfile.js';
import {
  submitProfileAssessment,
  detectPatternFromProfile,
  generateOptimalWeek,
  rehydrateMealMethods,
  calculateBMR,
  getActivityMultiplier,
  calculateHydration,
  calculateCalories,
  calculateMacros,
  updateHeaderWithProfile,
  calculateRedFlagScore,
  fillDemoData,
} from './features/assessment.js';
import {
  openQuickStartModal,
  qsPick,
  commitQuickStart,
  browseAnonymously,
  openQuickGoalModal,
  selectQuickGoalPace,
  saveQuickGoal,
} from './ui/modals/quickStart.js';
import {
  closeFoodSearch,
  searchFoods,
  renderSearchResults,
  selectFood,
  parseServing,
  servingRatio,
  addFoodToMeal,
  addFoodToMealDirect,
  searchFoodsWithRemote,
  showAllFoods, setActiveTab, updateFoodDetailNutrition, closeFoodDetail,
  ensureDateEntry, saveFoodDiary, addToRecent, refreshAfterFoodLog,
} from './ui/foodSearch.js';
import { openWeightLogModal, saveWeightFromModal } from './ui/modals/weightLog.js';

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
  renderHydrationSchedule, toggleHydration,
} from './features/hydration.js';
import {
  nextMeal, nextRoutineAction, nextLogAction, usefulLogsLeft,
} from './features/coaching.js';
import {
  purchaseCost, weeklyCost, pantryHas, normalizeItems,
  buildItemsFromWeekPlan, shoppingItems,
  generateShoppingList, parseIngredientString, analyzeStoreRecommendations,
  calculateWeeklyIngredients,
} from './features/shopping.js';
import { breakfastRecipes } from './data/breakfasts.js';
import { lunchRecipes } from './data/lunches.js';
import { recipes as dinnerRecipes } from './data/dinners.js';
import { snackOptions } from './data/snacks.js';
import { mealForSlot, recipeDbs, ingredientFor, calculateMealMacros } from './features/recipes.js';
import { estimateMealCost } from './features/budget.js';
import { getRecoveryLevel, getEffectiveMacrosForToday } from './features/training.js';
import { renderHealthRecovery } from './ui/exercise.js';
import { renderCustomRoutineItems } from './ui/routine.js';
import { renderPlanNextSteps, renderPlanWeightChip, getMealTimingGuide, updateMainPagePlanner, viewRecipe, inferLunchInstructions } from './ui/plan.js';
import {
  calculateDailyTotals, renderFoodDiary, renderMealFoods,
  updateMacroSummary, changeDiaryDate,
} from './ui/diary.js';
import { renderDynamicShopping } from './ui/shopping.js';
import { renderProgressTab, renderPatternBadge } from './ui/progress.js';
import { closeById } from './ui/modals/helpers.js';
import { mountShell } from './ui/shell.js';
import { installSwitchTab, switchTab } from './ui/render.js';
import { appState, appProfile, saveAll, saveQuiet, saveProfileQuiet } from './state/accessors.js';
import { getCurrentWeekKey, todayISO as _todayISO } from './utils/dates.js';
import { toast } from './ui/helpers/toast.js';
import { esc } from './utils/html.js';
import { $, qa, byId } from './utils/dom.js';
import { money } from './utils/format.js';
import { TAXONOMY } from './data/taxonomy.js';

import { renderTopBanner } from './ui/topbanner.js';
import {
  offLoadPersistentCache, offSavePersistentCache, normalizeOFFProduct,
  offLookupBarcode, offSearchByText, offSearchByTextDebounced,
  logFoodByBarcode, offCacheStats, offClearCache,
} from './api/openFoodFacts.js';
import {
  renderMealPlanner, swapBreakfastForDay, closeBreakfastSwapModal,
  recalculateRotation, renderBudgetTracker, renderBudgetOptimizationPanel,
} from './ui/mealPlanner.js';

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
window.saveTrialState = trial.saveTrialState;
window.subscribePro = trial.subscribePro;
window.updateTrialBanner = trial.updateTrialBanner;
window.showPaywallModal = modals.paywall.showPaywallModal;

// Batch B — weight subsystem.
window.getCurrentWeekKey = getCurrentWeekKey;
window.logWeight = (weightLb, dateISO) => {
  const s = window.state || loadState();
  if (!window.state) window.state = s;
  progress.ensureAdaptiveState(s);
  progress.logWeight(s, weightLb, dateISO);
  if (typeof window.saveState === 'function') window.saveState();
  if (window.profile) {
    window.profile.weight = parseFloat(weightLb);
    try { localStorage.setItem('user-profile', JSON.stringify(window.profile)); } catch (e) {}
  }
  if (typeof window.maybeRecalibrate === 'function') window.maybeRecalibrate();
};
window.get7DayAverage = () => {
  const s = window.state || loadState();
  return progress.get7DayAverage(s);
};
window.getWeeklyWeightChange = () => {
  const s = window.state || loadState();
  return progress.getWeeklyWeightChange(s);
};
window.projectGoalDate = () => {
  const s = window.state || loadState();
  const p = window.profile;
  return progress.projectGoalDate(s, p);
};

// Batch C — hydration rendering.
window.renderHydrationSchedule = renderHydrationSchedule;
window.toggleHydration = toggleHydration;

// Batch D — meal-macro + cost helpers.
window.calculateMealMacros = (meal, mealType) => calculateMealMacros(meal, mealType, window.profile);
window.estimateMealCost = estimateMealCost;

// Batch F — adaptive recalibration.
window.maybeRecalibrate = () => {
  const s = window.state || loadState();
  if (!window.state) window.state = s;
  const p = window.profile;
  const adj = progress.maybeRecalibrate(s, p);
  if (typeof window.saveState === 'function') window.saveState();
  if (p) { try { localStorage.setItem('user-profile', JSON.stringify(p)); } catch (e) {} }
  if (adj) {
    if (typeof window.updateMacroSummary === 'function') {
      try { window.updateMacroSummary(); } catch (e) {}
    }
    if (typeof window.updateMainPagePlanner === 'function') {
      try { window.updateMainPagePlanner(); } catch (e) {}
    }
  }
  return adj;
};

// Batch I — assessment helpers.
window.calculateRedFlagScore = calculateRedFlagScore;
window.fillDemoData = fillDemoData;

// Batch H — Open Food Facts API.
window.offLoadPersistentCache = offLoadPersistentCache;
window.offSavePersistentCache = offSavePersistentCache;
window.normalizeOFFProduct = normalizeOFFProduct;
window.offLookupBarcode = offLookupBarcode;
window.offSearchByText = offSearchByText;
window.offSearchByTextDebounced = offSearchByTextDebounced;
window.logFoodByBarcode = logFoodByBarcode;
window.offCacheStats = offCacheStats;
window.offClearCache = offClearCache;

// Batch G — food-search support fns.
window.showAllFoods = showAllFoods;
window.setActiveTab = setActiveTab;
window.updateFoodDetailNutrition = updateFoodDetailNutrition;
window.closeFoodDetail = closeFoodDetail;
window.ensureDateEntry = ensureDateEntry;
window.saveFoodDiary = saveFoodDiary;
window.addToRecent = addToRecent;
window.refreshAfterFoodLog = refreshAfterFoodLog;

// Batch E — meal-planner + budget render cluster.
window.renderMealPlanner = renderMealPlanner;
window.swapBreakfastForDay = swapBreakfastForDay;
window.closeBreakfastSwapModal = closeBreakfastSwapModal;
window.recalculateRotation = recalculateRotation;
window.renderBudgetTracker = renderBudgetTracker;
window.renderBudgetOptimizationPanel = renderBudgetOptimizationPanel;
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

// 8.2b — cheap shims for already-lifted functions missing from window.
window.calculateDailyTotals = calculateDailyTotals;
window.renderFoodDiary = renderFoodDiary;
window.renderMealFoods = renderMealFoods;
window.updateMacroSummary = updateMacroSummary;
window.changeDiaryDate = changeDiaryDate;
window.closeAddCardio   = () => closeById('addCardioModal');
window.closeAddStrength = () => closeById('addStrengthModal');

// 8.3 — lifted functions replacing monolith definitions via window overrides.
window.generateShoppingList = generateShoppingList;
window.parseIngredientString = parseIngredientString;
window.analyzeStoreRecommendations = analyzeStoreRecommendations;
window.getRecoveryLevel = getRecoveryLevel;
window.renderHealthRecovery = renderHealthRecovery;

// Long-tail cross-tab helpers — shadow monolith definitions.
window.getLoggingStreak = () => progress.getLoggingStreak();
window.getEffectiveMacrosForToday = getEffectiveMacrosForToday;
window.getMealTimingGuide = getMealTimingGuide;
window.renderProgress = renderPatternBadge;
window.renderProgressTab = renderProgressTab;
window.renderMorningStrip = () => {
  const el = document.getElementById('plan-morning-strip');
  if (el) el.style.display = 'none';
};
window.updateMainPagePlanner = updateMainPagePlanner;
// Wrap so callers can omit the state argument (monolith + plan.js pass none).
// Resolves state from window.state, falling back to a fresh load.
window.ensureAdaptiveState = (state) => {
  const s = state || window.state || loadState();
  if (!window.state) window.state = s;
  return progress.ensureAdaptiveState(s);
};

// Slice 15.1 — shims missed by Phase B sweep.
// renderTopBanner: monolith bare-callers (renderProgress paths, intelligence
// banners cascade) need window.renderTopBanner. Module reads window.Sorrel.* internally.
window.renderTopBanner = renderTopBanner;
// getTrendWeight: module signature is (state, profile). Monolith bare-callers
// pass nothing. Wrap to pull from window.state / window.profile.
window.getTrendWeight = () => progress.getTrendWeight(window.state, window.profile);
window.renderDynamicShopping = renderDynamicShopping;

// Session 16 — profileModal HTML lifted to src/ui/modals/profile.js.
// Inline <script> logic (nextPage/prevPage/skipDetailedAssessment) lifted
// to src/ui/modals/profile-controller.js. Wire as window.* so the
// onclick="nextPage()" attributes in the mounted template resolve, and
// so monolith's L16590 fillDemoData / L17696 saveProfileReal callers find
// the same names.
window.nextPage = profileNextPage;
window.prevPage = profilePrevPage;
window.skipDetailedAssessment = profileSkipDetailedAssessment;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.openProfileEdit = openProfileEdit;
window.closeProfileEditModal = closeProfileEditModal;
window.checkProfile = checkProfile;

// Session 17 — assessment + quick-modal cluster lifted from monolith.
// `window.saveProfile` is reassigned here (was state-persist via Sorrel
// namespace, never set on window). After this line, `window.saveProfile`
// is the 47-field form-submit handler invoked by profile modal's submit
// button (onclick="saveProfile(event)").
window.saveProfile = submitProfileAssessment;
window.saveProfileReal = submitProfileAssessment;
window.detectPatternFromProfile = detectPatternFromProfile;
window.generateOptimalWeek = generateOptimalWeek;
window.rehydrateMealMethods = rehydrateMealMethods;
window.calculateBMR = calculateBMR;
window.getActivityMultiplier = getActivityMultiplier;
window.calculateHydration = calculateHydration;
window.calculateCalories = calculateCalories;
window.calculateMacros = calculateMacros;
window.updateHeaderWithProfile = updateHeaderWithProfile;
window.openQuickStartModal = openQuickStartModal;
window.qsPick = qsPick;
window.commitQuickStart = commitQuickStart;
window.browseAnonymously = browseAnonymously;
window.openQuickGoalModal = openQuickGoalModal;
window.selectQuickGoalPace = selectQuickGoalPace;
window.saveQuickGoal = saveQuickGoal;

// Session 18 — food search subsystem.
window.closeFoodSearch = closeFoodSearch;
window.searchFoods = searchFoods;
window.renderSearchResults = renderSearchResults;
window.selectFood = selectFood;
window.parseServing = parseServing;
window.servingRatio = servingRatio;
window.addFoodToMeal = addFoodToMeal;
window.addFoodToMealDirect = addFoodToMealDirect;
window.searchFoodsWithRemote = searchFoodsWithRemote;
window.viewRecipe = viewRecipe;
window.inferLunchInstructions = inferLunchInstructions;
window.openWeightLogModal = openWeightLogModal;
window.saveWeightFromModal = saveWeightFromModal;
window.swapMeal = modals.swap.swapMeal;
window.getAlternativeMeals = modals.swap.getAlternativeMeals;
window.confirmSwap = modals.swap.confirmSwap;
window.closeSwapModal = modals.swap.closeSwapModal;
window.showSwapModal = modals.swap.showSwapModal;
// saveState + todayISO needed by lifted quick-goal flow.
// calculateMealMacros still in monolith — generateOptimalWeek reaches it via window.
// calculateWeeklyIngredients + recipe DBs lifted from data modules, shimmed for assessment.js.
window.saveState = saveState;
window.calculateWeeklyIngredients = calculateWeeklyIngredients;
window.breakfastRecipes = breakfastRecipes;
window.lunchRecipes = lunchRecipes;
window.recipes = dinnerRecipes;
window.snackOptions = snackOptions;
window.todayISO = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// Inject nav + section DOM before DOMContentLoaded fires so monolith
// boot() callbacks find their target elements when they run.
mountShell();

function bootstrap() {
  const profile = getProfile();
  const state = loadState();

  // Hoist bridge globals for monolith code paths that read window.state / window.profile.
  window.profile = profile;
  window.state = state;

  modals.mountAll();
  modals.weeklyPlan.mount();
  installCustomRoutineHandlers();

  installSwitchTab();  // window.switchTab → lifted render.js router
  const tab = location.hash.replace('#', '') || 'plan';
  switchTab(tab);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js');
  });
}
