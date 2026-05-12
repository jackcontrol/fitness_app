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
