#!/usr/bin/env node
/* The Last Light Survival Guide — site checks
   ---------------------------------------------------------------
   Catches the kinds of breakage that have slipped in before:
     files    — broken internal links/anchors, service-worker precache entries
                that don't exist (one missing file stops offline install),
                section pages not using the standard page layout, emergency
                cards / urgent search entries pointing at missing sections,
                missing book covers, and site-wide counts ("28 sections",
                "33 bundled books") that disagree with the real files.
     browser  — every page fits a 390px phone screen with no script errors,
                Prev/Next walks the guide in menu order, emergency mode and
                search work.

   Run locally:   python3 -m http.server 8765 &   node tests/site-check.js
   Files only:    node tests/site-check.js --static
   CI:            .github/workflows/site-check.yml                        */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.SITE_URL || 'http://localhost:8765/';
const STATIC_ONLY = process.argv.includes('--static');
const failures = [];
const fail = (check, msg) => failures.push(`[${check}] ${msg}`);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));

const htmlPages = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
  ...fs.readdirSync(path.join(ROOT, 'sections')).filter(f => f.endsWith('.html')).map(f => 'sections/' + f),
  'pdfs/index.html',
];
const sectionPages = htmlPages.filter(f => f.startsWith('sections/'));

/* Load a browser script into a sandbox and return its window. */
function loadScript(file, extra = {}) {
  const win = { location: { pathname: '/' }, ...extra };
  const ctx = { window: win, document: { readyState: 'complete', getElementById: () => null, addEventListener() {}, querySelector: () => null },
    sessionStorage: { getItem() {}, setItem() {} }, history: { replaceState() {} }, console };
  ctx.location = win.location;
  vm.createContext(ctx);
  vm.runInContext(read(file), ctx);
  return win;
}
const idsIn = html => new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1]));
function resolveTarget(fromFile, href) {
  const [file, anchor] = href.split('#');
  const target = file ? path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), file)) : fromFile;
  return { target, anchor };
}
function checkTarget(check, from, href) {
  const { target, anchor } = resolveTarget(from, href);
  if (!exists(target)) return fail(check, `${from} → ${href}: file ${target} does not exist`);
  if (anchor && target.endsWith('.html') && !idsIn(read(target)).has(anchor)) fail(check, `${from} → ${href}: no id="${anchor}" in ${target}`);
}

/* ── 1. Internal links and anchors ───────────────────────────────── */
for (const page of htmlPages) {
  const html = read(page).replace(/<script[\s\S]*?<\/script>/g, '');      // static markup only
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(href) || href === '#' || href.startsWith('/')) continue;
    // PDFs, map data and release zips are built/shipped separately (gitignored)
    if (/\.pdf(#|$)/.test(href) || /\.pmtiles$/.test(href) || href.startsWith('downloads/')) continue;
    checkTarget('links', page, href);
  }
}

/* ── 2. Service-worker precache: every entry must exist ─────────── */
{
  const sw = read('sw.js');
  const list = sw.slice(sw.indexOf('const PRECACHE = ['), sw.indexOf('];', sw.indexOf('const PRECACHE = [')));
  for (const m of list.matchAll(/'([^']+)'/g)) {
    const u = m[1];
    if (u === '/') continue;
    if (!exists(u.replace(/^\//, ''))) fail('precache', `sw.js lists ${u} but the file does not exist — the offline install would fail`);
  }
}

/* ── 3. Section pages use the standard page layout ──────────────── */
for (const page of sectionPages) {
  const html = read(page);
  if (!/<nav id="sidebar" class="sidebar"/.test(html)) fail('layout', `${page}: sidebar missing class="sidebar" (renders full-screen)`);
  if (!/class="(site-header|top-bar)"/.test(html)) fail('layout', `${page}: no page header (no menu button on phones)`);
  if (!/id="main-content"/.test(html)) fail('layout', `${page}: no #main-content`);
  if (!/assets\/js\/app\.js/.test(html)) fail('layout', `${page}: doesn't load app.js`);
}

/* ── 4. Emergency cards and urgent search entries point at real sections ── */
{
  const em = loadScript('assets/js/emergency.js', { LastLight: {} });
  const cards = em.LastLight.emergencyData || [];
  if (cards.length < 10) fail('emergency', `only ${cards.length} emergency cards loaded`);
  for (const c of cards) {
    if (!c.steps || !c.steps.length) fail('emergency', `card ${c.id} has no steps`);
    checkTarget('emergency', 'index.html', c.more);
  }
  const src = read('assets/js/search.js');
  for (const m of src.matchAll(/\{ id:'(sos-[^']+)'[^}]*?file:'([^']*)', anchor:'([^']*)'/g)) {
    checkTarget('search', 'index.html', m[2] + m[3]);
  }
  const ids = new Set(cards.map(c => c.id));
  for (const m of src.matchAll(/sos:'([a-z]+)'/g)) if (!ids.has(m[1])) fail('search', `search entry links to emergency card "${m[1]}" which doesn't exist`);
}

/* ── 5. Book catalogue: covers exist ────────────────────────────── */
const books = loadScript('assets/js/library-data.js').LIBRARY_PDFS || [];
for (const b of books) if (!exists('assets/covers/' + b.file.replace(/\.pdf$/, '.jpg'))) fail('covers', `no cover for ${b.file} (run make-covers.sh)`);

/* ── 6. Counts on the site match reality ────────────────────────── */
{
  const truth = { sections: sectionPages.length, books: books.length };
  const files = [...htmlPages, 'README.md', 'manifest.json', 'build-packages.sh', 'assets/js/bunker-bot.js']
    .filter(f => !/changelog|RELEASE-NOTES/i.test(f));                     // history describes past releases
  const rules = [
    { re: /\b(\d+) (?:main |core |guide )?sections\b/g, want: truth.sections, what: 'sections' },
    { re: /\b(\d+) (?:bundled |reference |bundled reference )?(?:reference books|bundled books|bundled PDFs|PDF books|PDFs)\b/gi, want: truth.books, what: 'bundled books' },
  ];
  for (const f of files) {
    const text = read(f).replace(/<script[\s\S]*?<\/script>/g, '');
    for (const r of rules) for (const m of text.matchAll(r.re)) {
      if (+m[1] !== r.want) fail('counts', `${f}: says "${m[0]}" but there are ${r.want} ${r.what}`);
    }
  }
}

/* ── Browser checks ─────────────────────────────────────────────── */
async function browserChecks() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { fail('browser', 'playwright not installed — npm i playwright'); return; }
  const browser = await chromium.launch();
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await phone.newPage();
  let errors = [];
  page.on('pageerror', e => errors.push(e.message));

  for (const p of htmlPages) {
    errors = [];
    const res = await page.goto(BASE_URL + p, { waitUntil: 'load' }).catch(e => ({ status: () => 0, err: e }));
    if (!res || res.status() >= 400) { fail('browser', `${p}: HTTP ${res && res.status()}`); continue; }
    await page.waitForTimeout(250);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    if (w > 392) fail('phone-width', `${p}: ${w}px wide on a 390px phone (content sticks out sideways)`);
    for (const e of errors) fail('js-error', `${p}: ${e}`);
  }

  // Prev/Next walks the guide in menu order and never repeats a page.
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desk.goto(BASE_URL + 'sections/food.html');
  const seen = [];
  for (let i = 0; i < 60; i++) {
    const here = new URL(desk.url()).pathname;
    if (seen.includes(here)) { fail('prev-next', `Next loops back to ${here}`); break; }
    seen.push(here);
    const next = await desk.$('.pagination-next');
    if (!next) break;
    await Promise.all([desk.waitForNavigation(), next.click()]);
  }
  if (seen.filter(s => s.includes('/sections/')).length !== sectionPages.length) {
    fail('prev-next', `following Next from the first section visits ${seen.filter(s => s.includes('/sections/')).length} of ${sectionPages.length} sections`);
  }

  // Emergency mode opens and renders every card; search ranks emergencies first.
  await desk.goto(BASE_URL + 'index.html#sos-bleeding');
  await desk.waitForSelector('.sos:not([hidden]) .sos-title', { timeout: 5000 }).catch(() => fail('emergency', '#sos-bleeding did not open emergency mode'));
  await desk.goto(BASE_URL + 'index.html');
  await desk.waitForFunction(() => window.guideSearch, null, { timeout: 8000 }).catch(() => fail('search', 'search.js never loaded'));
  const top = await desk.evaluate(() => window.guideSearch ? (window.guideSearch('bleeding')[0] || {}).id : null);
  if (top !== 'sos-bleeding') fail('search', `"bleeding" top result is ${top}, expected the urgent bleeding entry`);

  // Diagrams: Enlarge opens a full-screen copy, Esc closes it; tapping a
  // tagged feature highlights its matching part; draw-in cleans up after itself.
  await desk.goto(BASE_URL + 'sections/climate.html');
  await desk.waitForTimeout(300);
  if (!(await desk.$('#fig-look-garlic .dg-enlarge'))) fail('diagrams', 'climate.html: no Enlarge button on the lookalike diagram');
  else {
    await desk.click('#fig-look-garlic .dg-enlarge');
    const open = await desk.$eval('.dg-lb', l => l.classList.contains('open') && !!l.querySelector('svg')).catch(() => false);
    if (!open) fail('diagrams', 'Enlarge did not open the full-screen view');
    await desk.keyboard.press('Escape');
    if (await desk.$eval('.dg-lb', l => l.classList.contains('open')).catch(() => false)) fail('diagrams', 'Esc did not close the full-screen view');
    await desk.$eval('#fig-look-garlic', f => f.scrollIntoView({ block: 'center' }));
    await desk.waitForTimeout(3200);
    if (await desk.$('#fig-look-garlic svg.dg-anim, #fig-look-garlic [data-dg-pl]')) fail('diagrams', 'draw-in animation never finished / cleaned up');
    await desk.click('#fig-look-garlic text[data-hl="c1-spots"]');
    const n = await desk.$$eval('#fig-look-garlic .hl', a => a.length);
    if (n < 2) fail('diagrams', `tapping "Often dark spots" highlighted ${n} element(s), expected label + spots`);
  }

  // Diagram quality on every section: no label may stick out of its drawing area.
  for (const pg of sectionPages) {
    await desk.goto(BASE_URL + pg);
    await desk.waitForTimeout(120);
    const clipped = await desk.evaluate(() => {
      document.querySelectorAll('details').forEach(d => d.open = true);
      const bad = [];
      document.querySelectorAll('svg.dg-legacy, figure.dg > svg').forEach(svg => {
        const r = svg.getBoundingClientRect(); if (r.width < 20) return;
        const vb = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
        const sc = Math.min(r.width / vb[2], r.height / vb[3]);
        const ox = r.left + (r.width - vb[2] * sc) / 2, oy = r.top + (r.height - vb[3] * sc) / 2;
        svg.querySelectorAll('text').forEach(t => {
          const tr = t.getBoundingClientRect(); if (tr.width < 1 || !t.textContent.trim() || getComputedStyle(t).opacity === '0') return;
          const over = Math.max(ox - tr.left, tr.right - (ox + vb[2] * sc), oy - tr.top, tr.bottom - (oy + vb[3] * sc)) / sc;
          if (over > 2) bad.push(t.textContent.trim().slice(0, 30));
        });
      });
      return bad;
    });
    if (clipped.length) fail('diagram-labels', `${pg}: ${clipped.length} label(s) cut off at the edge of a diagram, e.g. "${clipped[0]}"`);
  }

  // Display modes: Night mode must put the red gel over everything and convert the
  // content to red; print must flip the older light-on-dark diagrams.
  const night = await browser.newContext({ viewport: { width: 1100, height: 800 } });
  await night.addInitScript(() => { try { localStorage.setItem('display-mode', 'mode-nv'); } catch (e) {} });
  const nv = await night.newPage();
  await nv.goto(BASE_URL + 'sections/metallurgy.html');
  await nv.waitForTimeout(300);
  const nvState = await nv.evaluate(() => {
    const gel = getComputedStyle(document.body, '::after');
    return { on: document.body.classList.contains('mode-nv'), gel: gel.mixBlendMode === 'multiply' && gel.position === 'fixed' && gel.backgroundColor === 'rgb(255, 0, 0)',
             filter: !!document.getElementById('ll-nv') && getComputedStyle(document.querySelector('.main-content')).filter.includes('ll-nv'),
             note: [...document.querySelectorAll('.nv-note')].every(n => getComputedStyle(n).display !== 'none') };
  });
  if (!nvState.on) fail('night-mode', 'saved Night mode was not applied on load');
  if (!nvState.gel) fail('night-mode', 'the red gel overlay (body::after, multiply) is missing — colours will leak');
  if (!nvState.filter) fail('night-mode', 'content is not passed through the #ll-nv red filter');
  if (!nvState.note) fail('night-mode', 'colour charts do not show their "cannot be read in Night mode" note');
  await nv.emulateMedia({ media: 'print' });
  const pr = await nv.evaluate(() => ({ legacy: [...document.querySelectorAll('svg.dg-legacy:not(.dg-truecolor)')].every(s => getComputedStyle(s).filter.includes('invert')),
                                        gel: getComputedStyle(document.body, '::after').display }));
  if (!pr.legacy) fail('print', 'older light-on-dark diagrams are not flipped for print');
  if (pr.gel !== 'none') fail('print', 'the Night-mode red gel would print');
  await night.close();

  // Step-by-step diagrams: Next advances the step and swaps what is shown.
  await desk.goto(BASE_URL + 'sections/navigation.html');
  await desk.waitForTimeout(300);
  if (!(await desk.$('#fig-polaris .dg-ctl'))) fail('players', 'navigation.html: Polaris step diagram has no controls');
  else {
    await desk.click('#fig-polaris .dg-ctl-btn[data-a="play"]');   // pause any auto-play
    await desk.click('#fig-polaris .dg-steps-list li:nth-child(1)');
    await desk.click('#fig-polaris .dg-ctl-btn[data-a="next"]');
    const pos = await desk.$eval('#fig-polaris .dg-ctl-pos', e => e.textContent);
    if (pos !== 'Step 2 of 4') fail('players', `after Next the Polaris diagram says "${pos}"`);
    const hiddenNow = await desk.$$eval('#fig-polaris [data-s="4-4"]', a => a.every(e => e.classList.contains('dg-off')));
    if (!hiddenNow) fail('players', 'step 4 parts are visible on step 2');
  }

  await browser.close();
}

(async () => {
  if (!STATIC_ONLY) await browserChecks();
  if (failures.length) {
    console.error(`\n✗ ${failures.length} problem(s):\n` + failures.map(f => '  ' + f).join('\n'));
    process.exit(1);
  }
  console.log(`✓ All site checks passed (${htmlPages.length} pages${STATIC_ONLY ? ', files only' : ''}).`);
})();
