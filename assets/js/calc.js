/* Live calculators that sit beside the guide's own tables and diagrams.
   A page asks for one with  <div class="calc" data-calc="fallout"></div>;
   app.js loads this file only when such a placeholder exists. Everything is
   worked out in the browser, offline. Each calculator uses the same numbers
   and formulas as the text it sits next to. */
(function () {
  'use strict';
  const $ = (r, s) => r.querySelector(s);
  const fmt = (x, d) => {
    if (!isFinite(x)) return '—';
    const a = Math.abs(x);
    const dp = d != null ? d : a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 1 : a >= 0.1 ? 2 : 3;
    return x.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: dp });
  };
  const num = el => { const v = parseFloat(el.value); return isFinite(v) ? v : 0; };
  const field = (id, label, input, hint) => '<label class="calc-f" for="' + id + '"><span class="calc-l">' + label + '</span>' + input + (hint ? '<span class="calc-hint">' + hint + '</span>' : '') + '</label>';
  const select = (id, opts, sel) => '<select id="' + id + '">' + opts.map(([v, t]) => '<option value="' + v + '"' + (v == sel ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>';
  const out = (k, label, cls) => '<div class="calc-o ' + (cls || '') + '"><span class="calc-ol">' + label + '</span><span class="calc-ov" data-o="' + k + '">—</span></div>';
  let uid = 0;

  /* ── Fallout clock: the 7-10 rule, R(t) = R1 × t^-1.2 ─────────────────── */
  function fallout(box) {
    const u = 'fo' + (++uid);
    const BANDS = [[1000, 1e9, 'lethal in minutes', 'dg-red'], [100, 1000, 'still very dangerous', 'dg-red'], [10, 100, 'dangerous — limit exposure', 'dg-earth'],
                   [1, 10, 'manageable with care', 'dg-key'], [0, 1, 'approaching background', 'dg-green']];
    const W = 444, H = 230, X0 = 46, X1 = 430, Y0 = 16, Y1 = 186;
    const TMIN = 1, TMAX = 2400, RMIN = 0.01, RMAX = 10000;
    const tx = t => X0 + (Math.log10(t) - Math.log10(TMIN)) / (Math.log10(TMAX) - Math.log10(TMIN)) * (X1 - X0);
    const ry = r => Y1 - (Math.log10(Math.max(r, RMIN)) - Math.log10(RMIN)) / (Math.log10(RMAX) - Math.log10(RMIN)) * (Y1 - Y0);
    box.innerHTML =
      '<p class="calc-title">Fallout clock</p><p class="calc-sub">Drag the slider to see how fast fallout radiation fades. The numbers follow the 7-10 rule in the table above.</p>' +
      '<div class="calc-in">' +
        field(u + 'r', 'Reading 1 hour after the blast', '<input id="' + u + 'r" type="number" min="0.1" step="any" value="1000" inputmode="decimal"><span class="calc-u">R/hr</span>') +
        field(u + 'pf', 'Where you are sheltering', select(u + 'pf', [[1, 'In the open (PF 1)'], [3, 'Wood house (PF 2–4)'], [10, 'Brick building (PF 10)'], [40, 'Concrete, centre (PF 20–50)'], [50, 'Basement (PF 10–100)'], [1000, 'Under 3 ft+ earth (PF 1,000+)']], 40)) +
      '</div>' +
      '<label class="calc-slide" for="' + u + 't"><span class="calc-l">Time since the blast: <b data-o="tl">1 hour</b></span><input id="' + u + 't" type="range" min="0" max="1000" value="0" step="1"></label>' +
      '<svg class="calc-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Fallout dose rate against time since the blast, on log scales">' +
        BANDS.map(([a, b, , cls]) => '<rect class="' + cls + '" x="' + X0 + '" y="' + ry(Math.min(b, RMAX)) + '" width="' + (X1 - X0) + '" height="' + (ry(Math.max(a, RMIN)) - ry(Math.min(b, RMAX))) + '" opacity=".22" stroke="none"/>').join('') +
        [[1, '1 h'], [7, '7 h'], [49, '2 days'], [336, '2 weeks'], [2160, '3 months']].map(([t, l]) => '<line class="dg-guide" x1="' + tx(t) + '" y1="' + Y0 + '" x2="' + tx(t) + '" y2="' + Y1 + '"/><text class="dg-ts ' + (t > 1000 ? 'dg-end' : 'dg-mid') + '" x="' + (t > 1000 ? X1 + 4 : tx(t)) + '" y="' + (Y1 + 16) + '">' + l + '</text>').join('') +
        [10000, 1000, 100, 10, 1, 0.1, 0.01].map(r => '<text class="dg-ts dg-end" x="' + (X0 - 5) + '" y="' + (ry(r) + 4) + '">' + (r >= 1 ? fmt(r, 0) : r) + '</text>').join('') +
        '<text class="dg-ts" x="' + X0 + '" y="' + (H - 4) + '">time since the blast →</text><text class="dg-ts dg-end" x="' + X1 + '" y="' + (H - 4) + '">R/hr outside (log scale)</text>' +
        '<path class="dg-key-s calc-curve" d=""/><path class="dg-blue-s calc-curve2" d="" stroke-dasharray="5 4"/>' +
        '<line class="dg-thin calc-vline" y1="' + Y0 + '" y2="' + Y1 + '"/><circle class="dg-keyf calc-dot" r="6"/><circle class="calc-dot2" r="5" fill="#6fa3d8"/>' +
      '</svg>' +
      '<div class="calc-outs">' + out('out', 'Outside now', 'calc-big') + out('in', 'Where you are', 'calc-big') + out('band', 'Outside is') + out('day', 'Dose over the next 24 h where you are') + '</div>' +
      '<p class="calc-legend"><span class="calc-sw calc-sw-a"></span>outside <span class="calc-sw calc-sw-b"></span>inside your shelter</p>';
    const r = $(box, '#' + u + 'r'), pf = $(box, '#' + u + 'pf'), sl = $(box, '#' + u + 't');
    const tOf = v => Math.pow(10, Math.log10(TMIN) + v / 1000 * (Math.log10(TMAX) - Math.log10(TMIN)));
    const dose = (R1, a, b) => R1 * (Math.pow(a, -0.2) - Math.pow(b, -0.2)) / 0.2;      // ∫ R1·t^-1.2 dt
    const label = t => t < 48 ? fmt(t, t < 10 ? 1 : 0) + (fmt(t, 1) === '1' ? ' hour' : ' hours') : t < 24 * 21 ? fmt(t / 24, 1) + ' days' : fmt(t / 24 / 7, 1) + ' weeks';
    function draw() {
      const R1 = Math.max(num(r), 0.001), P = +pf.value, t = tOf(+sl.value);
      let d1 = '', d2 = '';
      for (let i = 0; i <= 80; i++) {
        const tt = tOf(i / 80 * 1000), a = R1 * Math.pow(tt, -1.2);
        d1 += (i ? 'L' : 'M') + tx(tt).toFixed(1) + ' ' + ry(a).toFixed(1);
        d2 += (i ? 'L' : 'M') + tx(tt).toFixed(1) + ' ' + ry(a / P).toFixed(1);
      }
      $(box, '.calc-curve').setAttribute('d', d1); $(box, '.calc-curve2').setAttribute('d', d2);
      const now = R1 * Math.pow(t, -1.2), x = tx(t);
      const vl = $(box, '.calc-vline'); vl.setAttribute('x1', x); vl.setAttribute('x2', x);
      const dt = $(box, '.calc-dot'); dt.setAttribute('cx', x); dt.setAttribute('cy', ry(now));
      const d2c = $(box, '.calc-dot2'); d2c.setAttribute('cx', x); d2c.setAttribute('cy', ry(now / P));
      $(box, '[data-o=tl]').textContent = label(t);
      $(box, '[data-o=out]').textContent = fmt(now) + ' R/hr';
      $(box, '[data-o=in]').textContent = fmt(now / P) + ' R/hr';
      $(box, '[data-o=band]').textContent = BANDS.find(([a, b]) => now >= a && now < b)[2];
      $(box, '[data-o=day]').textContent = fmt(dose(R1, t, t + 24) / P) + ' R';
      sl.setAttribute('aria-valuetext', label(t) + ', ' + fmt(now) + ' R/hr outside');
    }
    [r, pf, sl].forEach(e => e.addEventListener('input', draw)); draw();
  }

  /* ── Bleach dose for drinking water (EPA table, as on the page) ────────── */
  function bleach(box) {
    const u = 'bl' + (++uid);
    // drops per US gallon for clear water, from the EPA table the page uses; one drop ≈ 1/16 mL
    const STR = [['6', '5–6% (household)', 8], ['8.25', '8.25% (strong)', 6], ['1', '1% (diluted)', 40]];
    box.innerHTML =
      '<p class="calc-title">Bleach dose calculator</p><p class="calc-sub">Plain, unscented bleach only. Doses match the table above.</p>' +
      '<div class="calc-in">' +
        field(u + 'v', 'How much water', '<input id="' + u + 'v" type="number" min="0" step="any" value="20" inputmode="decimal">' + select(u + 'u', [['L', 'litres'], ['gal', 'US gallons']], 'L')) +
        field(u + 's', 'Bleach strength', select(u + 's', STR.map(([v, t]) => [v, t]), '6')) +
        field(u + 'c', 'The water is', select(u + 'c', [['1', 'Clear'], ['2', 'Cloudy (filter first)']], '1')) +
      '</div>' +
      '<div class="calc-drops" aria-hidden="true"></div>' +
      '<div class="calc-outs">' + out('drops', 'Add', 'calc-big') + out('ml', 'Or measure') + out('wait', 'Then wait') + '</div>' +
      '<p class="calc-note">After waiting it should smell faintly of chlorine. If not, dose again and wait 15 more minutes.</p>';
    const v = $(box, '#' + u + 'v'), un = $(box, '#' + u + 'u'), s = $(box, '#' + u + 's'), c = $(box, '#' + u + 'c');
    function draw() {
      const gal = un.value === 'gal' ? num(v) : num(v) / 3.785;
      const per = STR.find(x => x[0] === s.value)[2] * +c.value;
      const drops = gal * per, ml = drops / 16;
      $(box, '[data-o=drops]').textContent = drops < 400 ? fmt(Math.ceil(drops), 0) + ' drops' : fmt(ml, ml < 10 ? 1 : 0) + ' mL';
      $(box, '[data-o=ml]').textContent = ml < 15 ? fmt(ml, 1) + ' mL (' + fmt(ml / 5, 2) + ' tsp)' : fmt(ml / 5, 1) + ' teaspoons (' + fmt(ml, 0) + ' mL)';
      $(box, '[data-o=wait]').textContent = c.value === '2' ? '30 min (60 if cold)' : '30 minutes';
      const n = Math.min(Math.ceil(drops), 40);
      $(box, '.calc-drops').innerHTML = Array.from({ length: n }, (_, i) => '<i style="--i:' + i + '"></i>').join('') + (drops > 40 ? '<b>+' + fmt(Math.ceil(drops) - 40, 0) + '</b>' : '');
    }
    [v, un, s, c].forEach(e => e.addEventListener('input', draw)); draw();
  }

  /* ── Rainwater yield: area × rain × 0.623 gal (sq ft·in), × roof runoff ─── */
  function rain(box) {
    const u = 'rw' + (++uid);
    box.innerHTML =
      '<p class="calc-title">Rainwater yield</p><p class="calc-sub">How much a roof collects, and how big a first-flush pipe it needs.</p>' +
      '<div class="calc-in">' +
        field(u + 'a', 'Roof area (as seen from above)', '<input id="' + u + 'a" type="number" min="0" step="any" value="500" inputmode="decimal">' + select(u + 'au', [['ft', 'sq ft'], ['m', 'm²']], 'ft')) +
        field(u + 'r', 'Rain', '<input id="' + u + 'r" type="number" min="0" step="any" value="1" inputmode="decimal">' + select(u + 'ru', [['in', 'inches'], ['mm', 'mm']], 'in')) +
        field(u + 'k', 'Roof', select(u + 'k', [['1', 'Ideal (as in the formula above)'], ['0.9', 'Metal'], ['0.8', 'Clay or concrete tile'], ['0.75', 'Asphalt shingle']], '0.9'), 'some water always splashes off or soaks in') +
        field(u + 'p', 'People drinking from it', '<input id="' + u + 'p" type="number" min="1" step="1" value="4" inputmode="numeric">') +
      '</div>' +
      '<div class="calc-tank" aria-hidden="true"><i></i></div>' +
      '<div class="calc-outs">' + out('y', 'Collected', 'calc-big') + out('ff', 'First-flush pipe should hold') + out('days', 'Drinking water for') + '</div>';
    const a = $(box, '#' + u + 'a'), au = $(box, '#' + u + 'au'), r = $(box, '#' + u + 'r'), ru = $(box, '#' + u + 'ru'), k = $(box, '#' + u + 'k'), p = $(box, '#' + u + 'p');
    function draw() {
      const sqft = au.value === 'm' ? num(a) * 10.764 : num(a), inch = ru.value === 'mm' ? num(r) / 25.4 : num(r);
      const gal = sqft * inch * 0.623 * +k.value, L = gal * 3.785;
      $(box, '[data-o=y]').textContent = fmt(gal, 0) + ' gal · ' + fmt(L, 0) + ' L';
      const ffg = sqft / 1000 * 10;
      $(box, '[data-o=ff]').textContent = fmt(ffg, 1) + ' gal · ' + fmt(ffg * 3.785, 0) + ' L';
      const days = gal / Math.max(1, num(p));            // 1 gallon per person per day, the page's minimum
      $(box, '[data-o=days]').textContent = fmt(days, 0) + ' days at 1 gal/person/day';
      $(box, '.calc-tank i').style.setProperty('--f', Math.min(1, gal / 2000).toFixed(3));
    }
    [a, au, r, ru, k, p].forEach(e => e.addEventListener('input', draw)); draw();
  }

  /* ── Solar sizing: the page's three steps ─────────────────────────────── */
  function solar(box) {
    const u = 'so' + (++uid);
    box.innerHTML =
      '<p class="calc-title">Solar sizing</p><p class="calc-sub">The three steps above, worked out for you. Start with your daily use from the load table.</p>' +
      '<div class="calc-in">' +
        field(u + 'w', 'Daily use', '<input id="' + u + 'w" type="number" min="0" step="any" value="550" inputmode="decimal"><span class="calc-u">Wh/day</span>') +
        field(u + 'h', 'Peak sun hours', '<input id="' + u + 'h" type="number" min="0.5" step="0.5" value="4" inputmode="decimal"><span class="calc-u">h/day</span>', 'winter figure for your area') +
        field(u + 'd', 'Days without sun to cover', '<input id="' + u + 'd" type="number" min="1" step="1" value="3" inputmode="numeric">') +
        field(u + 'v', 'System voltage', select(u + 'v', [['12', '12 V'], ['24', '24 V'], ['48', '48 V']], '12')) +
        field(u + 'b', 'Battery type', select(u + 'b', [['0.5', 'Lead-acid (use 50%)'], ['0.8', 'LiFePO₄ (use 80%)']], '0.5')) +
      '</div>' +
      '<div class="calc-outs">' + out('pv', 'Panels', 'calc-big') + out('bat', 'Battery bank', 'calc-big') + out('cc', 'Charge controller') + out('wh', 'Battery capacity') + '</div>' +
      '<p class="calc-note">Panels: daily Wh ÷ sun hours ÷ 0.85, plus 25%. Battery: daily Wh × days ÷ usable fraction. Controller: panel watts ÷ voltage, plus 25%.</p>';
    const w = $(box, '#' + u + 'w'), h = $(box, '#' + u + 'h'), d = $(box, '#' + u + 'd'), v = $(box, '#' + u + 'v'), b = $(box, '#' + u + 'b');
    function draw() {
      const Wh = num(w), PSH = Math.max(num(h), 0.1), V = +v.value;
      const pv = Wh / PSH / 0.85 * 1.25, cap = Wh * Math.max(num(d), 1) / +b.value;
      $(box, '[data-o=pv]').textContent = fmt(Math.round(pv / 10) * 10, 0) + ' W';
      $(box, '[data-o=bat]').textContent = fmt(Math.ceil(cap / V), 0) + ' Ah at ' + V + ' V';
      $(box, '[data-o=cc]').textContent = fmt(Math.ceil(pv / V * 1.25), 0) + ' A';
      $(box, '[data-o=wh]').textContent = fmt(cap, 0) + ' Wh';
    }
    [w, h, d, v, b].forEach(e => e.addEventListener('input', draw)); draw();
  }

  const KINDS = { fallout, bleach, rain, solar };
  document.querySelectorAll('.calc[data-calc]').forEach(box => {
    const f = KINDS[box.dataset.calc]; if (!f || box.dataset.ready) return;
    box.dataset.ready = '1'; f(box);
  });
})();
