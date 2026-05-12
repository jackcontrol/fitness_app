// External API config — Open Food Facts + AI photo recognition.
// Extracted from index.html lines 11525-11540 (OFF_CONFIG) and 11947-11952 (AI_PHOTO_CONFIG).

export const OFF_CONFIG = {
  // Identify ourselves so OFF can contact us if we cause problems
  userAgent: 'Sorrel/1.2 (mobile-app; nutrition-tracker)',
  
  // 8s timeout — longer than typical mobile API to handle slow connections
  timeout: 8000,
  
  // Debounce for text search — prevents firing on every keystroke
  searchDebounce: 350,
  
  // Cache sizes
  sessionCacheMax: 100,    // last N lookups stay in memory
  
  // How long a "not found" result stays cached (don't re-query unknown barcodes)
  negativeCacheTTL: 24 * 60 * 60 * 1000,  // 24 hours
};

export const AI_PHOTO_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1500,
  maxImageDimension: 1024, // resize photos so longest side <= 1024px
  jpegQuality: 0.85
};
