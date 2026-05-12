// JSDOM-based smoke test runner for Sorrel.
// Loads index.html, waits for scripts to execute, then runs all version smoke suites.
// Requires: npm install jsdom
//
// Usage:  node test/smoke-runner.js [path-to-html]
//
// Exit code 0 = all suites pass; non-zero = failures found.

import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const htmlPath = process.argv[2] || resolve(process.cwd(), 'index.html');
const html = readFileSync(htmlPath, 'utf8');

const virtualConsole = new VirtualConsole();
// Suppress noisy output; surface only errors
virtualConsole.on('jsdomError', (e) => { if (!String(e).includes('Not implemented')) console.error('[jsdom]', e); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'https://localhost/',
  resources: undefined,
  virtualConsole,
});

// Allow scripts to execute and async initialisation to settle
await new Promise((r) => setTimeout(r, 2000));

const win = dom.window;
const suites = [
  'sorrelRunV1623Smoke',
  'sorrelRunV1626Smoke',
  'sorrelRunV1627Smoke',
  'sorrelRunV1628Smoke',
  'sorrelRunV1629Smoke',
  'sorrelRunV1630Smoke',
  'sorrelRunV1631Smoke',
];

let totalPass = 0;
let totalFail = 0;
let anyFailed = false;

for (const name of suites) {
  if (typeof win[name] !== 'function') {
    console.log(`${name}: SKIP (function not found)`);
    continue;
  }
  const r = win[name]();
  const status = r.pass ? 'PASS' : 'FAIL';
  console.log(`${name}: ${r.passed}/${r.total} ${status}`);
  if (!r.pass) {
    anyFailed = true;
    r.failures.forEach((f) => console.log(`  ✗ ${f}`));
  }
  totalPass += r.passed;
  totalFail += r.failed;
}

console.log(`\nTotal: ${totalPass} passed, ${totalFail} failed`);
process.exit(anyFailed ? 1 : 0);
