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

  /* ── Sun clock: where the sun is, the shadow it casts, and what reaches a window ───
     Solar time (noon = sun highest). Declination δ = 23.44°·sin(360/365·(day − 81));
     altitude and azimuth from the usual spherical formulas. Shelter: the overhang shades the
     whole window at noon when depth ≥ window height ÷ tan(altitude). */
  function sun(box) {
    const u = 'sn' + (++uid), view = box.dataset.view || 'shadow', R = Math.PI / 180;
    const now = new Date(), doy0 = Math.round((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateLabel = d => { const x = new Date(2025, 0, d); return x.getDate() + ' ' + MON[x.getMonth()]; };
    const decl = d => 23.44 * Math.sin(2 * Math.PI / 365 * (d - 81));
    function pos(lat, d, h) {
      const p = lat * R, dl = decl(d) * R, H = 15 * (h - 12) * R;
      const sa = Math.sin(p) * Math.sin(dl) + Math.cos(p) * Math.cos(dl) * Math.cos(H), alt = Math.asin(Math.max(-1, Math.min(1, sa)));
      let ca = (Math.sin(dl) - Math.sin(alt) * Math.sin(p)) / (Math.cos(alt) * Math.cos(p) || 1e-9);
      let az = Math.acos(Math.max(-1, Math.min(1, ca))) / R; if (H > 0) az = 360 - az;
      return { alt: alt / R, az };
    }
    function dayLen(lat, d) { const c = -Math.tan(lat * R) * Math.tan(decl(d) * R); return c >= 1 ? 0 : c <= -1 ? 24 : 2 * Math.acos(c) / R / 15; }
    const hm = h => { h = (h + 24) % 24; const H = Math.floor(h), M = Math.round((h - H) * 60); return (M === 60 ? H + 1 : H) + ':' + String(M % 60).padStart(2, '0'); };
    box.innerHTML =
      '<p class="calc-title">Sun clock</p><p class="calc-sub">' + (view === 'house' ? 'Drag the date and time: see the sun’s path, and how much reaches a window under its overhang.' : 'Drag the time and date: see where the sun is and where a stick’s shadow falls.') + '</p>' +
      '<div class="calc-in">' +
        field(u + 'l', 'Latitude: <b data-o="lat"></b>', '<input id="' + u + 'l" type="range" min="-60" max="66" step="0.5" value="51.5">') +
        field(u + 'd', 'Date: <b data-o="date"></b>', '<input id="' + u + 'd" type="range" min="1" max="365" step="1" value="' + doy0 + '">') +
        (view === 'house' ? field(u + 'o', 'Overhang: <b data-o="ov"></b> of window height', '<input id="' + u + 'o" type="range" min="0" max="1.5" step="0.05" value="0.55">') : '') +
      '</div>' +
      '<label class="calc-slide" for="' + u + 't"><span class="calc-l">Sun time: <b data-o="time"></b> <span class="calc-hint" style="display:inline">(noon = sun highest; your clock may differ by an hour or more)</span></span><input id="' + u + 't" type="range" min="0" max="24" step="0.05" value="10"></label>' +
      '<div class="calc-btns"><button type="button" class="dg-ctl-btn" data-a="play">▶ Play the day</button><button type="button" class="dg-ctl-btn" data-a="sum">Midsummer</button><button type="button" class="dg-ctl-btn" data-a="win">Midwinter</button><button type="button" class="dg-ctl-btn" data-a="now">Today</button></div>' +
      '<svg class="calc-chart calc-sun" viewBox="0 0 444 214" role="img" aria-label="Sun path and ' + (view === 'house' ? 'window shading' : 'shadow stick') + '"></svg>' +
      '<div class="calc-outs">' + out('alt', 'Sun height', 'calc-big') + out('dir', 'Sun direction') + out('rise', 'Sunrise · sunset (sun time)') +
        (view === 'house' ? out('win', 'Window in sun at noon') : out('sh', 'Shadow of a 1 m stick')) + '</div>';
    const lat = $(box, '#' + u + 'l'), dt = $(box, '#' + u + 'd'), tm = $(box, '#' + u + 't'), ov = $(box, '#' + u + 'o'), svg = $(box, '.calc-sun');
    const compass = b => ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(((b % 360) + 360) % 360 / 22.5) % 16];
    function draw() {
      const L = +lat.value, D = +dt.value, h = +tm.value, south = L < 0;
      const P = pos(L, D, h), up = P.alt > 0;
      // ── left: the sky, looking towards the equator ──
      const cx = 108, gy = 168, ctr = south ? 0 : 180;
      const X = az => { let a = az - ctr; a = ((a + 540) % 360) - 180; return cx + a * (100 / 135); };
      const Y = alt => gy - Math.max(-8, alt) * (126 / 90);
      const path = d => { let s = '', pen = false; for (let t = 0; t <= 24.001; t += 0.25) { const q = pos(L, d, t); if (q.alt < -1) { pen = false; continue; } const x = X(q.az); if (x < 6 || x > 210) { pen = false; continue; } s += (pen ? 'L' : 'M') + x.toFixed(1) + ' ' + Y(q.alt).toFixed(1); pen = true; } return s; };
      const sumD = south ? 355 : 172, winD = south ? 172 : 355;
      let g = '<rect class="dg-panel" x="2" y="2" width="212" height="196" rx="9"/>';
      g += '<path class="dg-guide" d="' + path(sumD) + '" opacity=".7"/><path class="dg-guide" d="' + path(winD) + '" opacity=".7"/>';
      g += '<path class="dg-key-s" d="' + path(D) + '" stroke-width="2.2" fill="none"/>';
      g += '<rect class="dg-earth" x="4" y="' + gy + '" width="208" height="28" opacity=".7"/><line class="dg-line" x1="4" y1="' + gy + '" x2="212" y2="' + gy + '"/>';
      [[south ? 270 : 90, south ? 'W' : 'E'], [ctr, south ? 'N' : 'S'], [south ? 90 : 270, south ? 'E' : 'W']].forEach(([a, l]) => { g += '<text class="dg-tb dg-mid" x="' + X(a).toFixed(1) + '" y="' + (gy + 18) + '">' + l + '</text>'; });
      g += '<text class="dg-ts" x="12" y="20">facing the equator</text><text class="dg-ts" x="12" y="34">- - midsummer and midwinter</text>';
      if (up) g += '<circle cx="' + X(P.az).toFixed(1) + '" cy="' + Y(P.alt).toFixed(1) + '" r="11" class="calc-sunball"/>';
      else g += '<text class="dg-ts dg-mid" x="108" y="100">the sun is below the horizon</text>';
      // ── right: shadow stick (from above) or a window under an overhang (side view) ──
      g += '<rect class="dg-panel" x="230" y="2" width="212" height="196" rx="9"/>';
      if (view !== 'house') {
        const ox = 336, oy = 102, k = 24;           // 1 m stick = 24 units of shadow per unit of cot(alt)
        g += '<circle class="dg-earth" cx="' + ox + '" cy="' + oy + '" r="80" opacity=".55"/>';
        g += '<text class="dg-ts" x="238" y="20">seen from above</text><text class="dg-ts" x="238" y="34">dots: the shadow tip all day</text><text class="dg-tb dg-mid" x="' + ox + '" y="18">N</text><text class="dg-tb dg-mid" x="' + ox + '" y="194">S</text><text class="dg-tb" x="236" y="' + (oy + 4) + '">W</text><text class="dg-tb dg-end" x="436" y="' + (oy + 4) + '">E</text>';
        let tr = '', pen = false;
        for (let t = 0; t <= 24.001; t += 0.25) { const q = pos(L, D, t); if (q.alt < 4) { pen = false; continue; } const len = Math.min(92, k / Math.tan(q.alt * R)); const bx = Math.sin((q.az + 180) * R), by = -Math.cos((q.az + 180) * R); tr += (pen ? 'L' : 'M') + (ox + bx * len).toFixed(1) + ' ' + (oy + by * len).toFixed(1); pen = true; }
        g += '<path class="dg-guide" d="' + tr + '"/>';
        if (up && P.alt > 1) {
          const len = Math.min(92, k / Math.tan(P.alt * R)), bx = Math.sin((P.az + 180) * R), by = -Math.cos((P.az + 180) * R);
          g += '<line class="calc-shadow" x1="' + ox + '" y1="' + oy + '" x2="' + (ox + bx * len).toFixed(1) + '" y2="' + (oy + by * len).toFixed(1) + '"/><circle class="dg-keyf" cx="' + (ox + bx * len).toFixed(1) + '" cy="' + (oy + by * len).toFixed(1) + '" r="4"/>';
          const sx = Math.sin(P.az * R), sy = -Math.cos(P.az * R);
          g += '<line class="dg-key-s" x1="' + (ox + sx * 30).toFixed(1) + '" y1="' + (oy + sy * 30).toFixed(1) + '" x2="' + (ox + sx * 46).toFixed(1) + '" y2="' + (oy + sy * 46).toFixed(1) + '" stroke-width="1.6" stroke-dasharray="2 3"/>';
        }
        g += '<circle class="dg-wood" cx="' + ox + '" cy="' + oy + '" r="4.5"/>';
      } else {
        const wx = 330, top = 96, H = 52, oh = +ov.value * H, floor = 176;
        const noon = pos(L, D, 12).alt, A = Math.max(0.5, noon) * R;
        g += '<text class="dg-ts" x="238" y="20">window facing the equator, at noon</text>';
        g += '<rect class="dg-earth" x="232" y="' + floor + '" width="208" height="20" opacity=".7"/>';
        g += '<rect class="dg-wood" x="' + (wx - oh) + '" y="' + (top - 8) + '" width="' + (oh + 6) + '" height="7" rx="2"/>';
        g += '<path class="dg-line" d="M' + wx + ' ' + (top - 30) + ' L' + wx + ' ' + top + ' M' + wx + ' ' + (top + H) + ' L' + wx + ' ' + floor + ' M' + wx + ' ' + (top - 30) + ' L438 ' + (top - 30) + '"/>';
        g += '<rect class="dg-water" x="' + (wx - 2) + '" y="' + top + '" width="4" height="' + H + '" opacity=".8"/>';
        if (noon > 0) {
          const edge = top - 1 + oh * Math.tan(A);                 // shadow edge on the window
          const litTop = Math.min(top + H, Math.max(top, edge));
          const lit = (top + H - litTop) / H;
          for (let k2 = 0; k2 < 5; k2++) {
            const ye = top - 14 + k2 * 17, Lr = Math.min(96 / Math.cos(A), (ye - 52) / Math.sin(A));
            if (Lr > 8) g += '<line class="calc-ray" x1="' + (wx - Lr * Math.cos(A)).toFixed(1) + '" y1="' + (ye - Lr * Math.sin(A)).toFixed(1) + '" x2="' + wx + '" y2="' + ye.toFixed(1) + '"/>';
          }
          if (lit > 0) {
            const xa = wx + (floor - litTop) / Math.tan(A), xb = wx + (floor - (top + H)) / Math.tan(A);
            g += '<path class="calc-sunlit" d="M' + wx + ' ' + litTop.toFixed(1) + ' L' + Math.min(438, xa).toFixed(1) + ' ' + (xa > 438 ? (litTop + (438 - wx) * Math.tan(A)).toFixed(1) + ' L438 ' + floor : floor) + ' L' + Math.min(438, xb).toFixed(1) + ' ' + floor + ' L' + wx + ' ' + (top + H) + ' Z"/>';
          }
          g += '<text class="dg-tb" x="238" y="' + (floor + 15) + '">' + (lit > 0.95 ? 'sun fills the window' : lit > 0.05 ? Math.round(lit * 100) + '% of the window in sun' : 'window fully shaded') + '</text>';
          $(box, '[data-o=win]').textContent = Math.round(lit * 100) + '%';
        } else { g += '<text class="dg-ts" x="238" y="' + (floor + 15) + '">sun stays below the horizon</text>'; $(box, '[data-o=win]').textContent = '0%'; }
        const need = 1 / Math.tan((90 - Math.abs(L) + 23.44) * R);
        g += '<text class="dg-ts" x="238" y="40">full summer shade needs ' + Math.max(0, need).toFixed(2) + ' × height</text>';
        $(box, '[data-o=ov]').textContent = (+ov.value).toFixed(2) + '×';
      }
      svg.innerHTML = g;
      $(box, '[data-o=lat]').textContent = Math.abs(L).toFixed(1) + '°' + (L < 0 ? 'S' : 'N');
      $(box, '[data-o=date]').textContent = dateLabel(D);
      $(box, '[data-o=time]').textContent = hm(h);
      $(box, '[data-o=alt]').textContent = up ? Math.round(P.alt) + '° above the horizon' : 'below the horizon';
      $(box, '[data-o=dir]').textContent = up ? compass(P.az) + ' (' + Math.round(P.az) + '°)' : '—';
      const dl = dayLen(L, D);
      $(box, '[data-o=rise]').textContent = dl <= 0 ? 'no sunrise today' : dl >= 24 ? 'sun never sets' : hm(12 - dl / 2) + ' · ' + hm(12 + dl / 2);
      const sh = $(box, '[data-o=sh]'); if (sh) sh.textContent = up && P.alt > 1 ? (1 / Math.tan(P.alt * R)).toFixed(1) + ' m, pointing ' + compass(P.az + 180) : '—';
    }
    let raf = null; const playB = $(box, '[data-a=play]');
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; playB.textContent = '▶ Play the day'; };
    $(box, '.calc-btns').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const S = +lat.value < 0;
      if (b.dataset.a === 'sum') { stop(); dt.value = S ? 355 : 172; }
      else if (b.dataset.a === 'win') { stop(); dt.value = S ? 172 : 355; }
      else if (b.dataset.a === 'now') { stop(); dt.value = doy0; }
      else if (raf) { stop(); return; }
      else {
        const dl = dayLen(+lat.value, +dt.value), a = dl >= 24 ? 0 : 12 - dl / 2, z = dl >= 24 ? 24 : 12 + dl / 2, t0 = performance.now();
        playB.textContent = '❚❚ Pause';
        const step = now => { const f = Math.min(1, (now - t0) / 8000); tm.value = a + (z - a) * f; draw(); if (f < 1) raf = requestAnimationFrame(step); else stop(); };
        raf = requestAnimationFrame(step); return;
      }
      draw();
    });
    [lat, dt, tm, ov].filter(Boolean).forEach(e => e.addEventListener('input', () => { if (e === tm) stop(); draw(); }));
    draw();
  }

  /* ── Morse trainer: hear it, see it, flash it, and a listen-and-decode game ───────
     Timing as on the page: dot 1 unit, dash 3, gap inside a letter 1, between letters 3,
     between words 7. One unit = 1.2 s ÷ words per minute. Sound is made in the browser. */
  const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', '=': '-...-' };
  let actx = null;
  function morse(box) {
    const u = 'mo' + (++uid);
    box.innerHTML =
      '<p class="calc-title">Morse trainer</p><p class="calc-sub">Type a message to hear it and see it flash. Use the lamp to signal with a phone screen, or train your ear with the game.</p>' +
      '<div class="mo-top"><div class="mo-lamp" aria-hidden="true"><i></i></div><div class="mo-main">' +
        field(u + 'x', 'Message', '<input id="' + u + 'x" type="text" maxlength="60" value="SOS" autocomplete="off" autocapitalize="characters" spellcheck="false">') +
        '<div class="mo-code" aria-live="off"></div>' +
        '<div class="calc-btns"><button type="button" class="dg-ctl-btn" data-a="play">▶ Play</button><button type="button" class="dg-ctl-btn" data-a="sos">SOS</button>' +
        '<button type="button" class="dg-ctl-btn" data-a="loop" aria-pressed="false">↻ Repeat</button><button type="button" class="dg-ctl-btn" data-a="torch">Full-screen lamp</button></div>' +
        field(u + 'w', 'Speed: <b data-o="wpm"></b> words a minute', '<input id="' + u + 'w" type="range" min="5" max="25" step="1" value="12">') +
        '<label class="mo-snd"><input type="checkbox" checked data-a="sound"> sound</label>' +
      '</div></div>' +
      '<div class="mo-game"><p class="calc-l">Listen and decode</p><div class="calc-btns"><button type="button" class="dg-ctl-btn" data-g="new">▶ New letter</button><button type="button" class="dg-ctl-btn" data-g="again">↻ Again</button>' +
        select(u + 'lv', [['ETIANMSO', 'Easy: E T I A N M S O'], ['ETIANMSOURDKWGHVFLPJBXCYZQ', 'All letters'], ['0123456789', 'Numbers']], 'ETIANMSO') + '</div>' +
        '<div class="mo-keys"></div><p class="mo-res" aria-live="polite">Press <b>New letter</b>, listen, then tap what you heard.</p></div>';
    const tx = $(box, '#' + u + 'x'), wpm = $(box, '#' + u + 'w'), code = $(box, '.mo-code'), lamp = $(box, '.mo-lamp'), snd = $(box, '[data-a=sound]'), lv = $(box, '#' + u + 'lv');
    let timers = [], looping = false, playing = false, torch = null;
    const unit = () => 1200 / +wpm.value;
    function render() {
      $(box, '[data-o=wpm]').textContent = wpm.value;
      code.innerHTML = tx.value.toUpperCase().split('').map((c, i) => c === ' ' ? '<span class="mo-sp"></span>' : MORSE[c] ? '<span class="mo-ch" data-i="' + i + '"><b>' + c + '</b>' + MORSE[c].split('').map(x => '<i class="' + (x === '.' ? 'mo-dot' : 'mo-dash') + '"></i>').join('') + '</span>' : '').join('');
    }
    function clear() { timers.forEach(clearTimeout); timers = []; playing = false; setLight(false); code.querySelectorAll('.on').forEach(e => e.classList.remove('on')); $(box, '[data-a=play]').textContent = '▶ Play'; }
    function setLight(on) { lamp.classList.toggle('lit', on); if (torch) torch.classList.toggle('lit', on); }
    function beep(t, dur) {
      if (!snd.checked) return;
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const o = actx.createOscillator(), g = actx.createGain(), at = actx.currentTime + t / 1000, d = dur / 1000;
        o.frequency.value = 650; o.connect(g); g.connect(actx.destination);
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(0.25, at + 0.006); g.gain.setValueAtTime(0.25, at + d - 0.006); g.gain.linearRampToValueAtTime(0, at + d);
        o.start(at); o.stop(at + d + 0.02);
      } catch (e) {}
    }
    function schedule(text, onDone) {           // returns total ms
      const U = unit(); let t = 0;
      text.toUpperCase().split('').forEach((c, i) => {
        if (c === ' ') { t += 4 * U; return; }          // 3 already added after the last letter → 7
        const m = MORSE[c]; if (!m) return;
        const chEl = code.querySelector('[data-i="' + i + '"]');
        m.split('').forEach((x, k) => {
          const d = (x === '.' ? 1 : 3) * U, el = chEl && chEl.querySelectorAll('i')[k];
          beep(t, d);
          timers.push(setTimeout(() => { setLight(true); if (el) el.classList.add('on'); if (chEl) chEl.classList.add('on'); }, t));
          timers.push(setTimeout(() => setLight(false), t + d));
          t += d + U;
        });
        t += 2 * U;
      });
      timers.push(setTimeout(() => { code.querySelectorAll('.on').forEach(e => e.classList.remove('on')); onDone && onDone(); }, t + 4 * U));
      return t;
    }
    function play() {
      clear(); playing = true; $(box, '[data-a=play]').textContent = '■ Stop';
      schedule(tx.value, () => { playing = false; $(box, '[data-a=play]').textContent = '▶ Play'; if (looping) play(); });
    }
    function openTorch() {
      torch = document.createElement('div'); torch.className = 'mo-torch'; torch.setAttribute('role', 'dialog'); torch.setAttribute('aria-label', 'Full-screen Morse lamp');
      torch.innerHTML = '<p>' + tx.value.toUpperCase().replace(/</g, '') + ' — tap anywhere to stop</p>';
      document.body.appendChild(torch);
      let wl = null; try { navigator.wakeLock && navigator.wakeLock.request('screen').then(w => wl = w).catch(() => {}); } catch (e) {}
      try { torch.requestFullscreen && torch.requestFullscreen().catch(() => {}); } catch (e) {}
      const close = () => { looping = false; clear(); try { document.fullscreenElement && document.exitFullscreen(); } catch (e) {} if (wl) wl.release().catch(() => {}); torch.remove(); torch = null; };
      torch.addEventListener('click', close);
      looping = true; play();
    }
    box.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'play') { if (playing) { looping = false; $(box, '[data-a=loop]').setAttribute('aria-pressed', 'false'); clear(); } else play(); }
      if (a === 'sos') { tx.value = 'SOS'; render(); play(); }
      if (a === 'loop') { looping = !looping; b.setAttribute('aria-pressed', String(looping)); if (looping && !playing) play(); }
      if (a === 'torch') openTorch();
      const gm = b.dataset.g;
      if (gm === 'new') { game.cur = lv.value[Math.floor(Math.random() * lv.value.length)]; listen(); }
      if (gm === 'again' && game.cur) listen();
      if (b.dataset.k && game.cur) answer(b.dataset.k, b);
    });
    tx.addEventListener('input', () => { clear(); render(); });
    wpm.addEventListener('input', render);
    // ── listen-and-decode game ──
    const game = { cur: null, right: 0, tries: 0, streak: 0 };
    const keys = $(box, '.mo-keys');
    function drawKeys() { keys.innerHTML = lv.value.split('').map(c => '<button type="button" class="mo-key" data-k="' + c + '">' + c + '</button>').join(''); }
    function listen() {
      clear(); keys.querySelectorAll('.mo-key').forEach(k => k.classList.remove('ok', 'bad'));
      const U = unit(); let t = 0;
      MORSE[game.cur].split('').forEach(x => { const d = (x === '.' ? 1 : 3) * U; beep(t, d); timers.push(setTimeout(() => setLight(true), t)); timers.push(setTimeout(() => setLight(false), t + d)); t += d + U; });
      if (!snd.checked) $(box, '.mo-res').textContent = 'Sound is off — watch the lamp.';
    }
    function answer(k, btn) {
      game.tries++;
      const ok = k === game.cur;
      if (ok) { game.right++; game.streak++; } else game.streak = 0;
      btn.classList.add(ok ? 'ok' : 'bad');
      const right = keys.querySelector('[data-k="' + game.cur + '"]'); if (right) right.classList.add('ok');
      $(box, '.mo-res').innerHTML = (ok ? '<b class="mo-yes">Yes!</b> ' : '<b class="mo-no">No</b> — it was <b>' + game.cur + '</b> ') + '<span class="mo-pat">' + MORSE[game.cur].replace(/\./g, '·').replace(/-/g, '–') + '</span> · score ' + game.right + '/' + game.tries + (game.streak > 2 ? ' · streak ' + game.streak + ' 🔥' : '');
      game.cur = null;
    }
    lv.addEventListener('input', drawKeys);
    render(); drawKeys();
  }

  const KINDS = { fallout, bleach, rain, solar, sun, morse };
  document.querySelectorAll('.calc[data-calc]').forEach(box => {
    const f = KINDS[box.dataset.calc]; if (!f || box.dataset.ready) return;
    box.dataset.ready = '1'; f(box);
  });
})();
