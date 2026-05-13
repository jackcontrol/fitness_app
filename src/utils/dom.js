// DOM helpers extracted from index.html patch IIFE (L33389, L34692, L34693).
// NOTE: $ takes an *id*, not a selector — matches monolith convention.

export const $ = (id) => document.getElementById(id);

export const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const byId = (id) => document.getElementById(id);
