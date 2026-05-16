// HTML utilities. Extracted from index.html line 11102.

export function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
}

// Short alias matching patch-IIFE closure naming. The IIFEs (V162-V1631)
// each re-declared a local `esc()` that did this same escape but only
// for `& < > "` (not single quotes). Use escapeHtml semantics — safer
// and there's no observable difference in the modal/card output paths
// that consumed `esc()`.
export const esc = escapeHtml;
