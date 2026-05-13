// Time formatters. Extracted from patch IIFE closures (V166/V167+).
//
// fmtTime / minutes24 / timeToMinutes / toInputTime / parseDisplayTime
// were each re-declared inside multiple IIFEs. Consolidated here.

// Returns "HH:MM" (24h) from minutes-since-midnight (0..1439).
export function minutes24(mins) {
  const m = Math.max(0, Math.min(1439, Math.round(Number(mins) || 0)));
  const h = Math.floor(m / 60);
  const r = m % 60;
  return String(h).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

// Parses "HH:MM" (24h) or "H:MM AM/PM" into minutes-since-midnight.
export function timeToMinutes(s) {
  if (typeof s !== 'string') return 0;
  const trimmed = s.trim();
  if (!trimmed) return 0;
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
  if (ampmMatch) {
    let h = Number(ampmMatch[1]) % 12;
    const m = Number(ampmMatch[2]);
    const pm = /pm/i.test(ampmMatch[3]);
    if (pm) h += 12;
    return h * 60 + m;
  }
  const hmMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (hmMatch) {
    return Number(hmMatch[1]) * 60 + Number(hmMatch[2]);
  }
  return 0;
}

// Returns <input type="time"> value "HH:MM" from minutes-since-midnight.
export function toInputTime(mins) {
  return minutes24(mins);
}

// Parses display string ("7:30 AM" / "19:30") to minutes.
export function parseDisplayTime(s) {
  return timeToMinutes(s);
}

// Formats minutes-since-midnight as "H:MM AM/PM" for display.
export function fmtTime(mins) {
  const m = Math.max(0, Math.min(1439, Math.round(Number(mins) || 0)));
  const h24 = Math.floor(m / 60);
  const r = m % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return h12 + ':' + String(r).padStart(2, '0') + ' ' + period;
}
