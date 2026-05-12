// Dietary classification — canonical diet type resolution and vegan ingredient classifier.
// Extracted from index.html (v1.6.28 patch ~line 38383, v1.6.29 patch ~line 39041).
//
// Key invariants:
//   - Always call canonicalDietType(profile) — never read profile.dietType directly.
//   - Plant-confirmed scan runs first; longest phrases first within each category.
//   - classifyForVegan returns one of 5 states, never a boolean.

import { TAXONOMY } from '../data/taxonomy.js';

// ─── Diet type resolution ────────────────────────────────────────────────────

export function canonicalDietType(p) {
  if (!p) return 'omnivore';
  var src = p.dietType ||
            (Array.isArray(p.diets) && p.diets[0]) ||
            p.diet || p.dietPreference || p.dietaryPreference || p.primaryDiet || 'omnivore';
  var s = String(src).toLowerCase().trim();
  if (s === 'vegan' || s === 'plant-based' || s === 'plant based') return 'vegan';
  if (s === 'vegetarian' || s === 'lacto-ovo' || s === 'lacto ovo') return 'vegetarian';
  if (s === 'pescatarian' || s === 'pescetarian') return 'pescatarian';
  return 'omnivore';
}

export function canonicalAllergens(p) {
  if (!p) return [];
  var out = [];
  ['allergens', 'allergies', 'dietaryRestrictions', 'restrictions'].forEach(function (k) {
    var v = p[k];
    if (Array.isArray(v)) {
      v.forEach(function (x) { out.push(String(x).toLowerCase().trim()); });
    } else if (typeof v === 'string') {
      v.split(/[,;]/).forEach(function (x) { out.push(x.toLowerCase().trim()); });
    }
  });
  return out.filter(Boolean);
}

// ─── Word-boundary matching ─────────────────────────────────────────────────

function tokenize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

export function multiwordHit(haystack, term) {
  var ht = tokenize(haystack);
  var tt = tokenize(term);
  if (!ht.length || !tt.length) return false;
  if (tt.length === 1) return ht.indexOf(tt[0]) >= 0;
  for (var i = 0; i <= ht.length - tt.length; i++) {
    var match = true;
    for (var j = 0; j < tt.length; j++) {
      if (ht[i + j] !== tt[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

// ─── Ingredient classifier ──────────────────────────────────────────────────

function classifyIngredients(ingredientList) {
  if (!Array.isArray(ingredientList) || !ingredientList.length) {
    return { status: 'unknown', confidence: 'low', evidence: [], plantOnlyHits: 0 };
  }
  var evidence = [];
  var plantHits = 0;

  ingredientList.forEach(function (raw) {
    var ing = String(raw || '').toLowerCase();
    if (!ing.trim()) return;

    // STEP A: plant-confirmed — longest phrases first to prevent "milk" false-positive on "almond milk"
    var matchedAsPlant = false;
    Object.keys(TAXONOMY.PLANT_CONFIRMED).forEach(function (cat) {
      var terms = TAXONOMY.PLANT_CONFIRMED[cat].slice().sort(function (a, b) { return b.length - a.length; });
      terms.forEach(function (term) {
        if (multiwordHit(ing, term)) { matchedAsPlant = true; plantHits++; }
      });
    });
    if (matchedAsPlant) {
      evidence.push({ category: 'plant_confirmed', term: ing, source: 'taxonomy' });
      return;
    }

    // STEP B: definite animal
    var definiteHit = false;
    Object.keys(TAXONOMY.DEFINITE_ANIMAL).forEach(function (cat) {
      TAXONOMY.DEFINITE_ANIMAL[cat].forEach(function (term) {
        if (multiwordHit(ing, term)) {
          evidence.push({ category: 'definite_animal', subcategory: cat, term: term, reason: 'contains ' + cat, source: 'taxonomy' });
          definiteHit = true;
        }
      });
    });
    if (definiteHit) return;

    // STEP C: likely animal
    var likelyHit = false;
    Object.keys(TAXONOMY.LIKELY_ANIMAL).forEach(function (cat) {
      TAXONOMY.LIKELY_ANIMAL[cat].forEach(function (term) {
        if (multiwordHit(ing, term)) {
          evidence.push({ category: 'likely_animal', subcategory: cat, term: term, reason: cat.replace(/_/g, ' '), source: 'taxonomy' });
          likelyHit = true;
        }
      });
    });
    if (likelyHit) return;

    // STEP D: source-dependent
    Object.keys(TAXONOMY.SOURCE_DEPENDENT).forEach(function (cat) {
      TAXONOMY.SOURCE_DEPENDENT[cat].forEach(function (term) {
        if (multiwordHit(ing, term)) {
          evidence.push({ category: 'source_dependent', subcategory: cat, term: term, reason: cat.replace(/_/g, ' ') + ' - source-dependent', source: 'taxonomy' });
        }
      });
    });

    // STEP E: alcohol (source-dependent until Barnivore integration)
    Object.keys(TAXONOMY.ALCOHOL_BARNIVORE).forEach(function (cat) {
      TAXONOMY.ALCOHOL_BARNIVORE[cat].forEach(function (term) {
        if (multiwordHit(ing, term)) {
          evidence.push({ category: 'source_dependent', subcategory: 'alcohol_' + cat, term: term, reason: 'alcohol - production may use animal fining agents', source: 'taxonomy_alcohol' });
        }
      });
    });
  });

  var hasDefinite = evidence.some(function (e) { return e.category === 'definite_animal'; });
  var hasLikely   = evidence.some(function (e) { return e.category === 'likely_animal'; });
  var hasSourceDep = evidence.some(function (e) { return e.category === 'source_dependent'; });
  if (hasDefinite)  return { status: 'not_vegan',       confidence: 'high',   evidence, plantOnlyHits: plantHits };
  if (hasLikely)    return { status: 'likely_not_vegan', confidence: 'medium', evidence, plantOnlyHits: plantHits };
  if (hasSourceDep) return { status: 'source_dependent', confidence: 'low',    evidence, plantOnlyHits: plantHits };
  if (plantHits > 0) return { status: 'no_animal_found', confidence: 'medium', evidence, plantOnlyHits: plantHits };
  return { status: 'unknown', confidence: 'low', evidence, plantOnlyHits: plantHits };
}

function classifyFromOFFTags(offProduct) {
  if (!offProduct || !Array.isArray(offProduct.ingredients_analysis_tags)) return null;
  var tags = offProduct.ingredients_analysis_tags;
  if (tags.indexOf('en:non-vegan') >= 0) {
    return { status: 'not_vegan', confidence: 'high', source: 'off',
      message: 'Open Food Facts: contains animal ingredients - not vegan.',
      offTags: { vegan: 'no' }, evidence: [{ category: 'definite_animal', source: 'off_tag' }] };
  }
  if (tags.indexOf('en:maybe-vegan') >= 0) {
    return { status: 'source_dependent', confidence: 'low', source: 'off',
      message: 'Open Food Facts: vegan status uncertain - some ingredients may be animal-derived.',
      offTags: { vegan: 'maybe' }, evidence: [{ category: 'source_dependent', source: 'off_tag' }] };
  }
  if (tags.indexOf('en:vegan') >= 0) {
    return { status: 'no_animal_found', confidence: 'high', source: 'off',
      message: 'Open Food Facts: tagged vegan.',
      offTags: { vegan: 'yes' }, evidence: [{ category: 'plant_confirmed', source: 'off_tag' }] };
  }
  return null;
}

function messageFor(result, foodName) {
  if (result.source === 'off' && result.message) return result.message;
  if (result.status === 'not_vegan') {
    var reasons = (result.evidence || [])
      .filter(function (e) { return e.category === 'definite_animal'; })
      .map(function (e) { return e.subcategory; })
      .filter(function (v, i, a) { return v && a.indexOf(v) === i; })
      .slice(0, 2);
    return 'Contains ' + (reasons.join(', ') || 'animal ingredients') + ' - not vegan.';
  }
  if (result.status === 'likely_not_vegan') return 'Likely not vegan - contains ingredients usually derived from animals.';
  if (result.status === 'source_dependent')  return 'Some ingredients are source-dependent (could be plant- or animal-derived). Check the label or manufacturer to confirm.';
  if (result.status === 'no_animal_found')   return 'No obvious animal-derived ingredients found. Some ingredients may be source-dependent, so this is not a vegan certification.';
  return 'Vegan status unknown - not enough ingredient information.';
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Classify a food object for vegan suitability.
 * Returns { status, confidence, evidence, message } — never a boolean.
 * status: 'not_vegan' | 'likely_not_vegan' | 'source_dependent' | 'no_animal_found' | 'unknown'
 */
export function classifyForVegan(food) {
  if (!food) return { status: 'unknown', confidence: 'low', evidence: [], message: 'No food provided.' };

  if (food.source === 'openfoodfacts' || food.ingredients_analysis_tags) {
    var offResult = classifyFromOFFTags(food);
    if (offResult) {
      offResult.message = messageFor(offResult, food.name || food.product_name);
      return offResult;
    }
  }

  var ingredients = [];
  if (Array.isArray(food.ingredients) && food.ingredients.length) {
    ingredients = food.ingredients.map(function (i) {
      return typeof i === 'string' ? i : (i && (i.name || i.ingredient || i.item)) || '';
    });
  } else if (typeof food.ingredients_text === 'string') {
    ingredients = food.ingredients_text.split(/[,;]/);
  } else if (typeof food.getIngredients === 'function') {
    try {
      var got = food.getIngredients(food.macros || {});
      if (Array.isArray(got)) {
        ingredients = got.map(function (i) {
          return typeof i === 'string' ? i : (i && (i.name || JSON.stringify(i)));
        });
      }
    } catch (e) { /* silent */ }
  }
  if (food.name) ingredients.push(food.name);

  var result = classifyIngredients(ingredients);
  result.source = 'taxonomy';
  result.message = messageFor(result, food.name);

  // Allergen override: dairy/eggs in allergens array is definitive
  if (Array.isArray(food.allergens)) {
    var al = food.allergens.map(function (a) { return String(a).toLowerCase(); });
    var hasAnimalAllergen = al.indexOf('dairy') >= 0 || al.indexOf('eggs') >= 0 || al.indexOf('egg') >= 0;
    if (hasAnimalAllergen && (result.status === 'no_animal_found' || result.status === 'unknown' || result.status === 'source_dependent')) {
      result.status = 'not_vegan';
      result.confidence = 'high';
      result.evidence = (result.evidence || []).concat([{
        category: 'definite_animal',
        subcategory: al.indexOf('dairy') >= 0 ? 'dairy' : 'eggs',
        source: 'curated_allergen',
      }]);
      result.message = messageFor(result, food.name);
    }
  }

  if (food.dietType === 'vegan' && result.status === 'no_animal_found') {
    result.confidence = 'high';
    result.message = 'Curated vegan recipe. No obvious animal-derived ingredients found.';
  }

  return result;
}
