#!/usr/bin/env node
/* Splits a multi-panel diagram (one <svg> holding several .dg-panel boxes) into one <svg> per
   panel inside <div class="dg-cols">, so the panels sit side by side on a wide screen and stack
   on a phone (see ".dg-cols" in assets/css/style.css).

   Nothing is redrawn: each new <svg> holds the same elements and simply looks at its own panel
   through its viewBox. Which panel an element belongs to is measured in a real browser.

   Usage (with the site served on :8765):
     node tools/split-panels.js sections/climate.html fig-look-garlic:3:1 fig-look-umbel:3:1
   Each target is  figure-id : columns on a wide screen : columns on a phone.  Already-split
   figures are left alone, so it is safe to run again.                                        */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const [page, ...targets] = process.argv.slice(2);
if (!page || !targets.length) { console.error('usage: split-panels.js <page.html> <id:cols:colsSmall> ...'); process.exit(2); }

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 }, javaScriptEnabled: false });   // the page's own scripts would decorate the SVG
  const p = await ctx.newPage();
  await p.goto((process.env.BASE_URL || 'http://localhost:8765/') + page);
  await p.waitForTimeout(300);
  let src = fs.readFileSync(path.join(ROOT, page), 'utf8');
  for (const t of targets) {
    const [id, cols, sm] = t.split(':');
    const out = await p.evaluate(id => {
      const fig = document.getElementById(id);
      if (!fig) return { err: 'not found' };
      if (fig.querySelector('.dg-cols')) return { skip: true };
      const svg = fig.querySelector('svg');
      const kids = [...svg.children];
      const panels = kids.filter(k => k.tagName === 'rect' && k.classList.contains('dg-panel'));
      if (panels.length < 2) return { err: 'needs at least two .dg-panel rects' };
      const boxes = panels.map(r => r.getBBox());
      const defs = kids.filter(k => k.tagName === 'defs').map(k => k.outerHTML).join('');
      const groups = boxes.map(() => []);
      for (const k of kids) {
        if (k.tagName === 'defs') continue;
        let bb; try { bb = k.getBBox(); } catch (e) { continue; }
        const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
        let best = 0, bd = Infinity;
        boxes.forEach((r, i) => {          // inside a panel = distance 0; otherwise the nearest panel
          const dx = Math.max(r.x - cx, 0, cx - (r.x + r.width)), dy = Math.max(r.y - cy, 0, cy - (r.y + r.height));
          const d = Math.hypot(dx, dy); if (d < bd) { bd = d; best = i; }
        });
        groups[best].push(k);
      }
      const clean = el => { const c = el.cloneNode(true); [c, ...c.querySelectorAll('*')].forEach(n => { n.classList.remove('dgd', 'dgf', 'dgo', 'hl', 'dg-off'); if (!n.getAttribute('class')) n.removeAttribute('class');
        ['tabindex', 'pathLength', 'data-dg-pl'].forEach(a => n.removeAttribute(a)); if (n.style) { ['--dg-d', '--dg-fo', '--dg-op'].forEach(v => n.style.removeProperty(v)); if (!n.getAttribute('style')) n.removeAttribute('style'); } }); return c.outerHTML; };
      const svgs = boxes.map((r, i) => {
        const name = (groups[i].find(k => k.tagName === 'text') || { textContent: '' }).textContent.trim();
        // the drawing area is the panel plus anything of its own that pokes outside it
        let x0 = r.x - 2, y0 = r.y - 2, x1 = r.x + r.width + 2, y1 = r.y + r.height + 2;
        return `<svg viewBox="${+x0.toFixed(1)} ${+y0.toFixed(1)} ${+(x1 - x0).toFixed(1)} ${+(y1 - y0).toFixed(1)}" role="img" aria-label="${name.replace(/"/g, '&quot;')}">${i === 0 ? defs : ''}${groups[i].map(clean).join('')}</svg>`;
      });
      return { svgs, label: svg.getAttribute('aria-label') || '' };
    }, id);
    if (out.skip) { console.log(id, 'already split'); continue; }
    if (out.err) { console.error(id, out.err); process.exitCode = 1; continue; }
    const at = src.indexOf(`id="${id}"`);
    const figStart = src.lastIndexOf('<figure', at);
    const s0 = src.indexOf('<svg', at), s1 = src.indexOf('</svg>', s0) + 6;
    const head = src.slice(figStart, s0).replace(/class="dg(\s[^"]*)?"/, (m, rest) => `class="dg dg-multi${rest || ''}"`);
    const div = `<div class="dg-cols" style="--cols:${cols};--cols-sm:${sm || 1}" role="group" aria-label="${out.label.replace(/"/g, '&quot;')}">\n        ` + out.svgs.join('\n        ') + '\n      </div>';
    src = src.slice(0, figStart) + head + div + src.slice(s1);
    console.log(id, '→', out.svgs.length, 'panels');
  }
  fs.writeFileSync(path.join(ROOT, page), src);
  await b.close();
})();
