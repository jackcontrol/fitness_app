// Date helpers — local-zone YYYY-MM-DD strings, no UTC drift.
// Extracted from index.html lines 17101-17115.
//
// IMPORTANT: never use Date.prototype.toISOString().slice(0, 10) for "today" —
// that returns UTC and gives the wrong day for users east of UTC.

export function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function toLocalISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function daysBetween(iso1, iso2) {
  const ms = Math.abs(new Date(iso2) - new Date(iso1));
  return Math.round(ms / 86400000);
}

// Extracted from index.html L35666-35681 (winning IIFE definitions).

export function localDateKey(date) {
  const d = date ? new Date(date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

export function weekStart(date) {
  const d = date ? new Date(date) : new Date();
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const jsDay = copy.getDay();
  const diff = (jsDay + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  return copy;
}

export function plusDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
