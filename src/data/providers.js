// Grocery delivery providers + store info.
// Extracted from index.html lines 27666-27682 (deliveryProviders)
// and 28041-28046 (storeInfo).

export const deliveryProviders = {
  instacart: {
    name: 'Instacart',
    baseUrl: 'https://www.instacart.com',
    supported: true
  },
  amazon: {
    name: 'Amazon Fresh',
    baseUrl: 'https://www.amazon.com/alm/storefront',
    supported: true
  },
  walmart: {
    name: 'Walmart+',
    baseUrl: 'https://www.walmart.com/grocery',
    supported: true
  }
};

export const storeInfo = {
  aldi: { name: 'Aldi', emoji: '🥇', color: '#e76f51', description: 'Best for proteins & produce' },
  walmart: { name: 'Walmart', emoji: '🥈', color: '#0891b2', description: 'Best for grains & pantry' },
  costco: { name: 'Costco', emoji: '🥉', color: '#95E1D3', description: 'Best for bulk items' },
  specialty: { name: 'Specialty Store', emoji: '🌟', color: '#a78bfa', description: 'Whole Foods, Trader Joe\'s, etc.' }
};
