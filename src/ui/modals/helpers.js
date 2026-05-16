// Modal helpers — bridge pattern that survives slice 7B → 8.
//
// While monolith inline HTML still exists (slice 7B): ensureMounted is a
// no-op because the element already lives at parse time. open/close just
// toggle display, matching monolith semantics exactly.
//
// After slice 8 strips monolith HTML: ensureMounted injects the lifted
// template on first open. Same display-toggle API. Idempotent.

export function ensureMounted(id, html) {
  let el = document.getElementById(id);
  if (el) return el;
  const wrap = document.createElement('div');
  wrap.innerHTML = html.trim();
  el = wrap.firstElementChild;
  if (!el) return null;
  document.body.appendChild(el);
  return el;
}

export function openById(id, html) {
  const el = ensureMounted(id, html);
  if (el) el.style.display = 'block';
  return el;
}

export function closeById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
  return el;
}
