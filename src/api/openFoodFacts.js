// Open Food Facts API client — barcode + text search with session,
// persistent, and negative caches. Lifted from monolith (S19 Batch H).
//
// `window.foodDatabase` is mutated by `logFoodByBarcode` to keep barcode
// lookups discoverable via existing search flow.

import { OFF_CONFIG } from '../data/api-config.js';

const offSessionCache = new Map();
const offNegativeCache = new Map();

export function offLoadPersistentCache() {
  try {
    const raw = localStorage.getItem('off-cache');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    console.warn('OFF cache load failed:', e);
    return {};
  }
}

export function offSavePersistentCache(cache) {
  try {
    if (typeof window.safeLocalStorageSet === 'function') {
      window.safeLocalStorageSet('off-cache', JSON.stringify(cache));
    } else {
      localStorage.setItem('off-cache', JSON.stringify(cache));
    }
  } catch (e) {
    try {
      const keys = Object.keys(cache);
      const keep = keys.slice(Math.floor(keys.length / 2));
      const trimmed = {};
      keep.forEach(k => { trimmed[k] = cache[k]; });
      localStorage.setItem('off-cache', JSON.stringify(trimmed));
    } catch (e2) {
      console.warn('OFF cache save failed even after trim:', e2);
    }
  }
}

export function normalizeOFFProduct(product, barcodeOrQueryId) {
  if (!product || typeof product !== 'object') return null;
  const name = product.product_name || product.product_name_en || '';
  if (!name) return null;

  const brand = (product.brands || '').split(',')[0].trim();
  const nutriments = product.nutriments || {};

  let calories = nutriments['energy-kcal_serving'];
  let protein = nutriments['proteins_serving'];
  let carbs = nutriments['carbohydrates_serving'];
  let fat = nutriments['fat_serving'];
  let servingLabel = product.serving_size || '1 serving';

  const has100g = (
    typeof nutriments['energy-kcal_100g'] === 'number' ||
    typeof nutriments['proteins_100g'] === 'number'
  );
  const hasServing = (
    typeof calories === 'number' || typeof protein === 'number'
  );

  if (!hasServing && has100g) {
    calories = nutriments['energy-kcal_100g'];
    protein = nutriments['proteins_100g'];
    carbs = nutriments['carbohydrates_100g'];
    fat = nutriments['fat_100g'];
    servingLabel = '100g';
  }

  if (typeof calories !== 'number' && typeof protein !== 'number') return null;

  const rounded = {
    calories: Math.round(calories || 0),
    protein: Math.round(protein || 0),
    carbs: Math.round(carbs || 0),
    fat: Math.round(fat || 0),
  };

  const displayName = brand ? (brand + ' ' + name).slice(0, 80) : name.slice(0, 80);
  const id = 'off_' + (barcodeOrQueryId || product.code || product._id || Date.now());

  return {
    id,
    name: displayName,
    brand: brand || null,
    servings: [servingLabel],
    baseServing: servingLabel,
    calories: rounded.calories,
    protein: rounded.protein,
    carbs: rounded.carbs,
    fat: rounded.fat,
    category: product.categories_tags && product.categories_tags[0]
      ? product.categories_tags[0].replace(/^en:/, '').replace(/-/g, ' ')
      : 'packaged',
    source: 'openfoodfacts',
    barcode: product.code || null,
  };
}

async function offFetch(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OFF_CONFIG.timeout);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': OFF_CONFIG.userAgent,
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('OFF API returned ' + response.status);
    return await response.json();
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') throw new Error('Request timed out');
    throw e;
  }
}

export async function offLookupBarcode(barcode) {
  if (!barcode || typeof barcode !== 'string') return null;
  const clean = barcode.replace(/\D/g, '');
  if (!clean || clean.length < 6 || clean.length > 14) return null;

  if (offSessionCache.has(clean)) return offSessionCache.get(clean);

  const negTime = offNegativeCache.get(clean);
  if (negTime && (Date.now() - negTime) < OFF_CONFIG.negativeCacheTTL) return null;

  const persistent = offLoadPersistentCache();
  if (persistent[clean]) {
    offSessionCache.set(clean, persistent[clean]);
    return persistent[clean];
  }

  const url = 'https://world.openfoodfacts.org/api/v2/product/' + clean + '.json';
  let data;
  try {
    data = await offFetch(url);
  } catch (e) {
    console.warn('OFF barcode lookup failed:', e.message);
    return null;
  }

  if (!data || data.status !== 1 || !data.product) {
    offNegativeCache.set(clean, Date.now());
    return null;
  }

  const normalized = normalizeOFFProduct(data.product, clean);
  if (!normalized) {
    offNegativeCache.set(clean, Date.now());
    return null;
  }

  offSessionCache.set(clean, normalized);
  persistent[clean] = normalized;
  offSavePersistentCache(persistent);
  return normalized;
}

let _offSearchTimeout = null;

export async function offSearchByText(query, opts) {
  opts = opts || {};
  const limit = opts.limit || 15;
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  const clean = query.trim().toLowerCase();
  const cacheKey = 'q:' + clean;
  if (offSessionCache.has(cacheKey)) return offSessionCache.get(cacheKey);

  const url = 'https://world.openfoodfacts.org/cgi/search.pl' +
              '?search_terms=' + encodeURIComponent(clean) +
              '&search_simple=1&action=process&json=1' +
              '&sort_by=unique_scans_n' +
              '&page_size=' + limit;

  let data;
  try {
    data = await offFetch(url);
  } catch (e) {
    console.warn('OFF text search failed:', e.message);
    return [];
  }

  if (!data || !Array.isArray(data.products)) return [];

  const results = data.products
    .map(p => normalizeOFFProduct(p, p.code || p._id))
    .filter(p => p !== null);

  offSessionCache.set(cacheKey, results);
  if (offSessionCache.size > OFF_CONFIG.sessionCacheMax) {
    const oldestKey = offSessionCache.keys().next().value;
    offSessionCache.delete(oldestKey);
  }
  return results;
}

export function offSearchByTextDebounced(query) {
  return new Promise((resolve, reject) => {
    if (_offSearchTimeout) clearTimeout(_offSearchTimeout);
    _offSearchTimeout = setTimeout(() => {
      offSearchByText(query).then(resolve).catch(reject);
    }, OFF_CONFIG.searchDebounce);
  });
}

export async function logFoodByBarcode(barcode, mealName) {
  if (typeof window.showLogToast === 'function') window.showLogToast('Looking up barcode…');
  const product = await offLookupBarcode(barcode);
  if (!product) {
    if (typeof window.showLogToast === 'function') {
      window.showLogToast('Barcode not found — add as custom food');
    }
    return false;
  }
  if (window.foodDatabase) window.foodDatabase[product.id] = product;
  if (window.foodDiary) {
    window.foodDiary.currentMeal = mealName || window.foodDiary.currentMeal || 'snacks';
  }
  if (typeof window.selectFood === 'function') window.selectFood(product.id);
  return true;
}

export function offCacheStats() {
  const persistent = offLoadPersistentCache();
  return {
    session: offSessionCache.size,
    negative: offNegativeCache.size,
    persistent: Object.keys(persistent).length,
  };
}

export function offClearCache() {
  offSessionCache.clear();
  offNegativeCache.clear();
  try { localStorage.removeItem('off-cache'); } catch (e) {}
}
