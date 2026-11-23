#!/usr/bin/env node
/* The Last Light Survival Guide — site checks
   ---------------------------------------------------------------
   Catches the kinds of breakage that have slipped in before:
     files    — broken internal links/anchors, service-worker precache entries
                that don't exist (one missing file stops offline install),
                section pages not using the standard page layout, emergency
                cards / urgent search entries pointing at missing sections,
                missing book covers, and site-wide counts ("29 sections",
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
  const [path_, anchor] = href.split('#');
  const file = path_.split('?')[0];          // gear.html?for=van → gear.html
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
    // #sos and #sos-<card> open Emergency mode (emergency.js), so they must name a real card.
    const sos = /^#sos(?:-([a-z]+))?$/.exec(href);
    if (sos) { if (sos[1] && !new RegExp("id: ['\"]" + sos[1] + "['\"]").test(read('assets/js/emergency.js'))) fail('links', `${page} → ${href}: no emergency card "${sos[1]}"`); continue; }
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

/* ── 3b. Search metadata (tools/seo.py) on every public page ────── */
for (const page of htmlPages.filter(p => p !== 'pdfs/index.html')) {
  const head = read(page).split('</head>')[0];
  if (!/<meta name="description" content="[^"]{50,}">/.test(head)) fail('seo', `${page}: no meta description (50+ characters)`);
  if ((head.match(/rel="canonical"/g) || []).length !== 1 || !head.includes('<!-- seo:start'))
    fail('seo', `${page}: search metadata missing or duplicated — run python3 tools/seo.py`);
}
for (const f of ['sitemap.xml', 'llms.txt']) if (!exists(f)) fail('seo', `${f} missing — run python3 tools/seo.py`);

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
  const files = [...htmlPages, 'llms.txt', 'README.md', 'manifest.json', 'build-packages.sh', 'assets/js/bunker-bot.js']
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
    if (p.includes('sections/')) {
      // "If this is happening now" / "Start here" strip: present, and every card leads somewhere.
      const strip = await page.evaluate(() => {
        const n = document.querySelector('.now-strip'); if (!n) return 'missing';
        const bad = [...n.querySelectorAll('a.now-card')].filter(a => !document.getElementById(a.getAttribute('href').slice(1))).map(a => a.getAttribute('href'));
        return bad.length ? 'broken links ' + bad.join(' ') : n.querySelectorAll('.now-card').length >= 2 ? '' : 'too few cards';
      });
      if (strip) fail('now-strip', `${p}: ${strip}`);
      // Wide tables stack into cards on a phone and no stacked table pokes out sideways.
      const tw = await page.evaluate(() => [...document.querySelectorAll('table.tbl-stack')].filter(t => t.getBoundingClientRect().right > innerWidth + 2).length);
      if (tw) fail('tables', `${p}: ${tw} stacked table(s) wider than the phone`);
    }
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
      document.querySelectorAll('svg.dg-legacy, figure.dg svg').forEach(svg => {
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

  // Daylight mode: every top-level block is flipped, and true-colour art is flipped back.
  const dayCtx = await browser.newContext({ viewport: { width: 1100, height: 800 } });
  await dayCtx.addInitScript(() => { try { localStorage.setItem('display-mode', 'mode-day'); } catch (e) {} });
  const day = await dayCtx.newPage();
  await day.goto(BASE_URL + 'sections/climate.html');
  await day.waitForTimeout(300);
  const dayState = await day.evaluate(() => {
    const f = el => el ? getComputedStyle(el).filter : '';
    return { on: document.body.classList.contains('mode-day'), main: f(document.querySelector('.main-content')), side: f(document.getElementById('sidebar')),
             plant: f(document.querySelector('.plant-card svg')), theme: (document.querySelector('meta[name="theme-color"]') || {}).content };
  });
  if (!dayState.on) fail('daylight', 'saved Daylight mode was not applied on load');
  if (!/invert/.test(dayState.main) || !/invert/.test(dayState.side)) fail('daylight', 'content or sidebar is not flipped to light');
  if (!/invert/.test(dayState.plant)) fail('daylight', 'plant identification art is not kept in its true colours');
  if (dayState.theme !== '#f5f8f7') fail('daylight', `browser toolbar colour is ${dayState.theme}, expected the light page colour`);
  await dayCtx.close();

  // Split figures: panels side by side on a wide screen, stacked on a phone.
  await desk.goto(BASE_URL + 'sections/climate.html');
  await desk.waitForTimeout(200);
  const wideCols = await desk.$eval('#fig-look-umbel .dg-cols', e => getComputedStyle(e).gridTemplateColumns.split(' ').length).catch(() => 0);
  if (wideCols !== 3) fail('panels', `lookalike comparison shows ${wideCols} column(s) on a wide screen, expected 3`);
  await page.goto(BASE_URL + 'sections/climate.html');
  await page.waitForTimeout(200);
  const phoneCols = await page.$eval('#fig-look-umbel .dg-cols', e => getComputedStyle(e).gridTemplateColumns.split(' ').length).catch(() => 0);
  if (phoneCols !== 1) fail('panels', `lookalike comparison shows ${phoneCols} column(s) on a phone, expected 1 (stacked)`);

  // Full-screen step player: enlarging a step-by-step diagram gives controls; arrow keys step; closing hands the step back.
  await desk.goto(BASE_URL + 'sections/knots.html');
  await desk.waitForTimeout(300);
  await desk.click('#fig-bowline .dg-steps-list li:nth-child(1)');
  await desk.evaluate(() => document.querySelector('#fig-bowline svg').dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await desk.waitForTimeout(200);
  const lbp = await desk.evaluate(() => { const l = document.querySelector('.dg-lb'); return l && l.classList.contains('open') && l.classList.contains('is-player') && !l.querySelector('.dg-lb-steps').hidden; });
  if (!lbp) fail('fullscreen-player', 'enlarging a step-by-step diagram did not open the full-screen player');
  else {
    await desk.keyboard.press('ArrowRight'); await desk.keyboard.press('ArrowRight');
    const pos = await desk.$eval('.dg-lb-pos', e => e.textContent);
    if (pos !== 'Step 3 of 5') fail('fullscreen-player', `after two right-arrows the player says "${pos}"`);
    await desk.keyboard.press('Escape'); await desk.waitForTimeout(150);
    const back = await desk.$eval('#fig-bowline .dg-ctl-pos', e => e.textContent);
    if (back !== 'Step 3 of 5') fail('fullscreen-player', `the page did not pick up the step on close (shows "${back}")`);
  }

  // Knots: each of the six has a working step player, and the drawings are the generated ones.
  await desk.goto(BASE_URL + 'sections/knots.html');
  await desk.waitForTimeout(300);
  for (const id of ['fig-bowline', 'fig-clove', 'fig-tautline', 'fig-sheetbend', 'fig-trucker', 'fig-reef']) {
    const st = await desk.evaluate(i => { const f = document.getElementById(i); if (!f) return null;
      return { steps: +f.dataset.steps, items: f.querySelectorAll('.dg-steps-list li').length, ctl: !!f.querySelector('.dg-ctl'), full: !!document.getElementById(i + '-full'), rope: f.querySelectorAll('use.kn-a, use.kn-b').length }; }, id);
    if (!st) { fail('knots', `${id} is missing from knots.html`); continue; }
    if (st.steps !== st.items) fail('knots', `${id}: ${st.steps} frames but ${st.items} written steps`);
    if (!st.ctl || !st.full || st.rope < 3) fail('knots', `${id}: step player or rope drawing did not render`);
  }
  if ((await desk.$$('.knot-card')).length !== 6) fail('knots', 'the "Which knot?" chooser should have six cards');

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

  // Calculators: each one renders and reacts to its inputs.
  for (const [pg, kind, sel, val] of [['nbc', 'fallout', 'input[type=range]', '500'], ['food', 'bleach', 'input[type=number]', '40'], ['food', 'rain', 'input[type=number]', '1000'], ['energy', 'solar', 'input[type=number]', '1100']]) {
    await desk.goto(BASE_URL + 'sections/' + pg + '.html');
    const ok = await desk.waitForSelector(`.calc[data-calc=${kind}] .calc-ov`, { timeout: 5000 }).catch(() => null);
    if (!ok) { fail('calc', `${pg}.html: ${kind} calculator did not render`); continue; }
    const before = await desk.$eval(`.calc[data-calc=${kind}] .calc-ov`, e => e.textContent);
    await desk.$eval(`.calc[data-calc=${kind}] ${sel}`, (e, v) => { e.value = v; e.dispatchEvent(new Event('input')); }, val);
    const after = await desk.$eval(`.calc[data-calc=${kind}] .calc-ov`, e => e.textContent);
    if (before === after || /NaN|—/.test(after)) fail('calc', `${pg}.html: ${kind} calculator did not update (${before} → ${after})`);
  }
  // Fixed numbers from the page text: 20 L clear water, 5–6% bleach = 43 drops; 550 Wh/day = 275 Ah at 12 V.
  await desk.goto(BASE_URL + 'sections/food.html'); await desk.waitForSelector('.calc[data-calc=bleach] .calc-ov');
  if (await desk.$eval('.calc[data-calc=bleach] [data-o=drops]', e => e.textContent) !== '43 drops') fail('calc', 'bleach dose for 20 L is not 43 drops');
  await desk.goto(BASE_URL + 'sections/energy.html'); await desk.waitForSelector('.calc[data-calc=solar] .calc-ov');
  if (await desk.$eval('.calc[data-calc=solar] [data-o=bat]', e => e.textContent) !== '275 Ah at 12 V') fail('calc', 'solar battery for 550 Wh/day is not 275 Ah (the page’s worked example)');

  // Sun clock: London midsummer noon sun stands about 62° high; the overhang shades the window then.
  await desk.goto(BASE_URL + 'sections/shelter.html'); await desk.waitForSelector('.calc[data-calc=sun] .calc-ov', { timeout: 5000 }).catch(() => fail('calc', 'shelter.html: sun clock did not render'));
  if (await desk.$('.calc[data-calc=sun]')) {
    await desk.$eval('.calc[data-calc=sun] input[id$=d]', e => { e.value = 172; e.dispatchEvent(new Event('input')); });
    await desk.$eval('.calc[data-calc=sun] input[id$=t]', e => { e.value = 12; e.dispatchEvent(new Event('input')); });
    const alt = await desk.$eval('.calc[data-calc=sun] [data-o=alt]', e => e.textContent), win = await desk.$eval('.calc[data-calc=sun] [data-o=win]', e => e.textContent);
    if (!alt.startsWith('62°') || win !== '0%') fail('calc', `sun clock: London midsummer noon gives "${alt}", window ${win}`);
  }
  // Morse trainer renders the code for SOS.
  await desk.goto(BASE_URL + 'sections/communications.html');
  const mo = await desk.waitForSelector('.calc[data-calc=morse] .mo-code .mo-ch', { timeout: 5000 }).catch(() => null);
  if (!mo) fail('calc', 'communications.html: Morse trainer did not render');
  else if (await desk.$$eval('.calc[data-calc=morse] .mo-code i', a => a.map(i => i.className).join(' ')) !== 'mo-dot mo-dot mo-dot mo-dash mo-dash mo-dash mo-dot mo-dot mo-dot') fail('calc', 'Morse trainer does not show SOS as ··· ––– ···');

  // Knots tie themselves: switching to "Watch it tie" shows the drawing; at the end every rope piece is fully laid.
  await desk.goto(BASE_URL + 'sections/knots.html'); await desk.waitForTimeout(300);
  for (const id of ['fig-bowline', 'fig-clove', 'fig-tautline', 'fig-sheetbend', 'fig-reef']) {
    if (!(await desk.$('#' + id + ' .kn-mode'))) { fail('knots', `${id}: no "Watch it tie" switch`); continue; }
    await desk.click('#' + id + ' .kn-mode [data-m=tie]');
    await desk.$eval('#' + id + ' .kn-bar input', e => { e.value = 1000; e.dispatchEvent(new Event('input')); });
    const r = await desk.$eval('#' + id, f => ({ shown: !f.querySelector('.kn-tie').hidden, notLaid: [...f.querySelectorAll('.kn-front .ks-r')].filter(p => parseFloat(p.style.strokeDashoffset) > 0.5).length }));
    if (!r.shown || r.notLaid) fail('knots', `${id}: tie view ${r.shown ? '' : 'not shown, '}${r.notLaid} rope pieces not laid at the end`);
  }

  // Plant or lookalike?: nine cards; answering turns the card and scores it.
  await desk.goto(BASE_URL + 'sections/climate.html');
  if (!(await desk.waitForSelector('.calc[data-calc=lookalike] .lk-choice', { timeout: 5000 }).catch(() => null))) fail('game', 'climate.html: lookalike game did not deal a card');
  else {
    const n = await desk.$eval('#lk-cards', t => t.content.querySelectorAll('svg').length);
    if (n !== 9) fail('game', `lookalike game has ${n} cards, expected 9`);
    const hidden = await desk.$eval('.lk-front svg', s => [...s.querySelectorAll('text')].some(t => +t.getAttribute('y') < 62));
    if (hidden) fail('game', 'the front of a lookalike card still shows its name or verdict');
    await desk.click('.lk-choice >> nth=0');
    if (!(await desk.$('.lk-card.turned'))) fail('game', 'answering did not turn the card');
  }
  // Moon dial: a known date. 15 Nov 2026 is six days after new moon: waxing crescent, about a third lit.
  { const mp = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await mp.clock.install({ time: new Date('2026-11-15T20:00:00') });
    await mp.goto(BASE_URL + 'sections/navigation.html');
    const ok = await mp.waitForSelector('.calc[data-calc=moon] .mn-name', { timeout: 5000 }).catch(() => null);
    const name = ok ? await mp.$eval('.calc[data-calc=moon] .mn-name', e => e.textContent) : '';
    const pct = ok ? await mp.$eval('.calc[data-calc=moon] .mn-pct', e => e.textContent) : '';
    if (name !== 'Waxing crescent' || !/^3\d% lit/.test(pct)) fail('calc', `moon dial for 15 Nov 2026 says "${name}", "${pct}"`);
    await mp.close(); }
  // Seasons wheel opens on this month; constellation finder puts Capella high in the ENE from London at 10 pm in mid-November.
  { const mp = await browser.newPage({ viewport: { width: 1280, height: 900 }, timezoneId: 'Europe/London' });
    await mp.clock.install({ time: new Date('2026-11-15T22:00:00Z') });
    await mp.goto(BASE_URL + 'sections/climate.html');
    const sw = await mp.waitForSelector('.calc[data-calc=seasons] .sw-month', { timeout: 5000 }).catch(() => null);
    const mo = sw ? await sw.textContent() : '', chips = sw ? await mp.$$eval('.calc[data-calc=seasons] .sw-chips span', a => a.map(x => x.textContent)) : [];
    if (mo !== 'November' || !chips.includes('Rosehips')) fail('calc', `seasons wheel opens on "${mo}" with ${chips.join(', ')}`);
    await mp.goto(BASE_URL + 'sections/navigation.html');
    const sk = await mp.waitForSelector('.calc[data-calc=stars] .sk-up-now b', { timeout: 5000 }).catch(() => null);
    const up = sk ? await mp.$eval('.calc[data-calc=stars] .sk-up-now', e => e.textContent) : '';
    if (!/Capella ENE, 5\d° up/.test(up)) fail('calc', `constellation finder from London: "${up}"`);
    await mp.click('.calc[data-calc=stars] .sk-up'); await mp.clock.runFor(200);
    if (!/straight up/.test(await mp.$eval('.calc[data-calc=stars] .sk-read', e => e.textContent))) fail('calc', 'constellation finder: Overhead did not look up');
    await mp.close(); }
  // Exploded views come apart and explain the part tapped.
  for (const [pg, v] of [['energy', 'stove'], ['build-water', 'well'], ['build-water', 'biosand'], ['energy', 'pma']]) {
    await desk.goto(BASE_URL + 'sections/' + pg + '.html');
    const sel = `.calc[data-calc=explode][data-view=${v}]`;
    if (!(await desk.waitForSelector(sel + ' .ex-ly', { timeout: 5000, state: 'attached' }).catch(() => null))) { fail('calc', `${pg}.html: ${v} exploded view did not draw`); continue; }
    await desk.click(sel + ' .ex-go');
    await desk.$eval(sel + ' .ex-ly', e => e.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const r = await desk.$eval(sel, b => [b.classList.contains('ex-open-v'), b.querySelector('.ex-info').textContent]);
    if (!r[0] || !/\. \S/.test(r[1])) fail('calc', `${v} exploded view: open ${r[0]}, info "${r[1]}"`);
  }
  // Generator matcher: pedal + treadmill motor gives ~50 W at ~700 RPM; a hand-cranked car alternator gives nothing (its field eats it).
  await desk.goto(BASE_URL + 'sections/energy.html');
  if (await desk.waitForSelector('.calc[data-calc=genmatch] .calc-ov', { timeout: 5000 }).catch(() => null)) {
    const g = sel => desk.$$eval('.calc[data-calc=genmatch] .calc-ov', a => a.map(x => x.textContent));
    let v = await g();
    if (!/^7\d\d RPM/.test(v[0]) || !/≈ (4\d|5\d|6\d) W/.test(v[2])) fail('calc', `generator matcher, pedal + treadmill: ${v.join(' | ')}`);
    await desk.selectOption('.calc[data-calc=genmatch] select >> nth=0', 'hand'); await desk.selectOption('.calc[data-calc=genmatch] select >> nth=1', 'alternator');
    v = await g();
    if (!/nothing/.test(v[2])) fail('calc', `generator matcher, hand crank + alternator should give nothing: ${v[2]}`);
  } else fail('calc', 'energy.html: generator matcher did not render');
  await desk.goto(BASE_URL + 'sections/build-power.html');
  if (!(await desk.waitForSelector('.calc[data-calc=genwave] .gw-svg path', { timeout: 5000, state: 'attached' }).catch(() => null))) fail('calc', 'build-power.html: generator animation did not draw');
  // Water chooser: river water with a stove says boil; sea water without fire says do not drink.
  await desk.goto(BASE_URL + 'sections/food.html');
  if (await desk.waitForSelector('.calc[data-calc=watertreat] .wt-step', { timeout: 5000 }).catch(() => null)) {
    const steps = () => desk.$$eval('.calc[data-calc=watertreat] .wt-step b', a => a.map(x => x.textContent).join(' / '));
    if (!/Boil it: a rolling boil for 1 minute/.test(await steps())) fail('calc', `water chooser, river + stove: ${await steps()}`);
    await desk.selectOption('.calc[data-calc=watertreat] select >> nth=0', 'sea');
    await desk.uncheck('.calc[data-calc=watertreat] .wt-chk input >> nth=0');
    if (!/Do not drink it/.test(await steps())) fail('calc', `water chooser, sea without fire: ${await steps()}`);
  } else fail('calc', 'food.html: water chooser did not render');
  // Biodiesel calculator: 20 L at titration 2 with NaOH → (3.5 + 2) × 20 ÷ 0.99 ≈ 111 g, methanol 4 L.
  await desk.goto(BASE_URL + 'sections/fuel.html');
  if (await desk.waitForSelector('.calc[data-calc=biodiesel] .calc-ov', { timeout: 5000 }).catch(() => null)) {
    const v = await desk.$$eval('.calc[data-calc=biodiesel] .calc-ov', a => a.map(x => x.textContent));
    if (!/^111 g NaOH/.test(v[0]) || !/^4 L/.test(v[1])) fail('calc', `biodiesel calculator for 20 L, titration 2: ${v.join(' | ')}`);
  } else fail('calc', 'fuel.html: biodiesel calculator did not render');
  // Water flow: follows the page's head table (3 m on 25 mm MDPE ≈ 8 L/min, 0.29 bar).
  await desk.goto(BASE_URL + 'sections/build-water.html');
  if (await desk.waitForSelector('.calc[data-calc=waterflow] .calc-ov', { timeout: 5000 }).catch(() => null)) {
    const v = await desk.$$eval('.calc[data-calc=waterflow] .calc-ov', a => a.map(x => x.textContent));
    if (!v[0].startsWith('0.29 bar') || !/≈ (8|9)/.test(v[1])) fail('calc', `water flow at 3 m: ${v.join(' | ')}`);
  } else fail('calc', 'build-water.html: water-flow calculator did not render');

  // Machines run and step through their stages.
  for (const [pg, kind] of [['vehicles', 'engine'], ['metallurgy', 'forge'], ['build-water', 'handpump'], ['projects', 'ram'], ['climate', 'fronts'], ['climate', 'firelay']]) {
    await desk.goto(BASE_URL + 'sections/' + pg + '.html');
    if (!(await desk.waitForSelector(`.calc[data-calc=${kind}] .mc-svg *`, { timeout: 5000, state: "attached" }).catch(() => null))) { fail('machines', `${pg}.html: ${kind} did not draw`); continue; }
    const a = await desk.$eval(`.calc[data-calc=${kind}] .mc-phases .on`, e => e.textContent);
    await desk.click(`.calc[data-calc=${kind}] .mc-step`);
    const b = await desk.$eval(`.calc[data-calc=${kind}] .mc-phases .on`, e => e.textContent);
    if (a === b) fail('machines', `${kind}: "Next stage" did not move on`);
  }
  // Living sky (Navigation): draws, says the moon phase, and is not treated as an enlargeable diagram.
  await desk.goto(BASE_URL + 'sections/navigation.html'); await desk.waitForTimeout(300);
  const sky = await desk.evaluate(() => ({ svg: !!document.querySelector('.sky-panel .home-sky svg'), note: (document.querySelector('.sky-panel .sky-note') || {}).textContent || '', zoom: !!document.querySelector('.home-sky .dg-zoomable, .sky-panel > .dg-enlarge') }));
  if (!sky.svg || !/moon|lit/.test(sky.note) || sky.zoom) fail('home-sky', `navigation sky: drawn ${sky.svg}, note "${sky.note}", enlarge ${sky.zoom}`);

  // Home bunker scene: animating, and not treated as an enlargeable diagram.
  await desk.goto(BASE_URL + 'index.html'); await desk.waitForTimeout(300);
  const hero = await desk.evaluate(() => ({ svg: !!document.querySelector('.hero-scene svg.scene'), running: document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('.hero-scene')).length, zoom: !!document.querySelector('.hero-scene .dg-zoomable, .hero-scene .dg-enlarge') }));
  if (!hero.svg || !hero.running || hero.zoom) fail('home-scene', `home scene: drawn ${hero.svg}, ${hero.running} animations, enlarge ${hero.zoom}`);

  // New step players exist and have controls.
  await desk.goto(BASE_URL + 'sections/medical.html'); await desk.waitForTimeout(300);
  for (const id of ['fig-cpr-steps', 'fig-choking-steps', 'fig-splint-steps', 'fig-tourniquet-steps', 'fig-recovery-steps'])
    if (!(await desk.$('#' + id + ' .dg-ctl'))) fail('players', `medical.html: ${id} has no controls`);

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
