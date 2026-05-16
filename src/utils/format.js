// Format helpers. Extracted from patch IIFE closures (V1617+).

export function money(n) {
  const v = Number(n) || 0;
  return '$' + v.toFixed(2);
}
