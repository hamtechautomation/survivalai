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

  /* ── Plant or lookalike? A flip-card game using the guide's own lookalike drawings ──
     The front shows only the plant (name, verdict and the tell-tale notes hidden); pick
     which one it is and the card turns over to the full panel. Cards come from the
     <template id="lk-cards"> written by tools/lookalike_game.py. */
  function lookalike(box) {
    const tpl = document.getElementById('lk-cards'); if (!tpl) return;
    const all = [...tpl.content.querySelectorAll('svg')].map(svg => ({ svg, group: svg.dataset.group, name: svg.dataset.name, verdict: svg.dataset.verdict, safe: svg.dataset.safe === '1' }));
    box.innerHTML =
      '<p class="calc-title">Plant or lookalike?</p><p class="calc-sub">Look at the plant, decide which one it is, then turn the card. Practice for your eye only: in the field, be 100% certain or don’t eat it.</p>' +
      '<div class="lk-play"><div class="lk-stage"><div class="lk-card"><div class="lk-face lk-front"></div><div class="lk-face lk-back"></div></div></div>' +
      '<div class="lk-side"><p class="lk-q">Which is it?</p><div class="lk-choices"></div><div class="lk-res" aria-live="polite"></div>' +
      '<div class="calc-btns"><button type="button" class="dg-ctl-btn lk-next" hidden>Next card →</button></div>' +
      '<p class="lk-score"></p></div></div>';
    const card = $(box, '.lk-card'), front = $(box, '.lk-front'), back = $(box, '.lk-back'), choices = $(box, '.lk-choices'), res = $(box, '.lk-res'), next = $(box, '.lk-next'), score = $(box, '.lk-score');
    let deck = [], k = 0, right = 0, missed = [], streak = 0;
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    function frontOf(svg) {
      const c = svg.cloneNode(true);
      c.querySelectorAll('text').forEach(t => { const y = +t.getAttribute('y'); if (y < 62 || y > 186) t.remove(); });
      c.querySelectorAll('.dg-okbg, .dg-badbg').forEach(r => r.remove());
      c.removeAttribute('aria-label'); c.setAttribute('aria-label', 'A plant to identify');
      return c;
    }
    function deal() {
      if (k >= deck.length) return finish();
      const cur = deck[k];
      card.classList.remove('turned'); res.innerHTML = ''; next.hidden = true;
      front.innerHTML = ''; front.appendChild(frontOf(cur.svg));
      back.innerHTML = ''; back.appendChild(cur.svg.cloneNode(true));
      $(box, '.lk-q').textContent = 'Card ' + (k + 1) + ' of ' + deck.length + ': which is it?';
      choices.innerHTML = shuffle(all.filter(c => c.group === cur.group)).map(c => '<button type="button" class="lk-choice" data-n="' + c.name + '">' + c.name + '</button>').join('');
      choices.querySelectorAll('button').forEach(b => b.disabled = false);
      score.textContent = 'Score ' + right + ' / ' + k + (streak > 2 ? ' · streak ' + streak : '');
    }
    function answer(btn) {
      const cur = deck[k], ok = btn.dataset.n === cur.name;
      choices.querySelectorAll('button').forEach(b => { b.disabled = true; if (b.dataset.n === cur.name) b.classList.add('ok'); });
      if (!ok) { btn.classList.add('bad'); missed.push(cur.name); streak = 0; } else { right++; streak++; }
      card.classList.add('turned');
      const tells = [...cur.svg.querySelectorAll('text')].filter(t => +t.getAttribute('y') > 186).map(t => t.textContent.trim()).filter(Boolean).reduce((acc, t) => acc ? acc + (/^[a-z(]/.test(t) ? ' ' : ' · ') + t : t, '');
      res.innerHTML = (ok ? '<b class="mo-yes">Right.</b> ' : '<b class="mo-no">No</b> — ') + 'it’s <b>' + cur.name + '</b>: <span class="' + (cur.safe ? 'lk-safe' : 'lk-toxic') + '">' + cur.verdict.toLowerCase() + '</span>.<br><span class="lk-tells">Tells: ' + tells + '</span>';
      k++; next.hidden = false; next.textContent = k >= deck.length ? 'See your score →' : 'Next card →';
      score.textContent = 'Score ' + right + ' / ' + k + (streak > 2 ? ' · streak ' + streak : '');
      next.focus({ preventScroll: true });
    }
    function finish() {
      card.classList.remove('turned');
      front.innerHTML = '<div class="lk-done"><b>' + right + ' / ' + deck.length + '</b><span>' + (right === deck.length ? 'Every one right.' : 'Look again at: ' + missed.join(', ')) + '</span></div>';
      choices.innerHTML = ''; res.innerHTML = 'Even a perfect score here is not enough to forage on. Use every tell together, and if any one doesn’t fit, leave it.';
      $(box, '.lk-q').textContent = 'Finished';
      next.hidden = false; next.textContent = '↺ Play again';
    }
    function start() { deck = shuffle(all.slice()); k = 0; right = 0; missed = []; streak = 0; deal(); }
    choices.addEventListener('click', e => { const b = e.target.closest('.lk-choice'); if (b && !b.disabled) answer(b); });
    next.addEventListener('click', () => { if (k >= deck.length && $(box, '.lk-done')) start(); else deal(); });
    start();
  }

  /* ── Machines that run: one cycle position f (0…1) drives every part of the drawing ──
     machine() gives each one Play/Pause, a speed slider and a phase readout; it pauses
     itself off screen and starts paused for reduced motion. Each drawing follows the
     diagram and text it sits beside. */
  function machine(box, o) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.innerHTML = '<p class="calc-title">' + o.title + '</p><p class="calc-sub">' + o.sub + '</p>' +
      '<svg class="calc-chart mc-svg" viewBox="' + o.vb + '" role="img" aria-label="' + o.label + '"></svg>' +
      '<div class="mc-phases">' + o.phases.map((ph, i) => '<span data-p="' + i + '"><b>' + (i + 1) + '</b> ' + ph[0] + '</span>').join('') + '</div>' +
      '<p class="mc-now" aria-live="polite"></p>' +
      '<div class="calc-btns"><button type="button" class="dg-ctl-btn mc-play"></button>' +
      '<label class="mc-speed">speed <input type="range" min="0.1" max="1" step="0.05" value="' + (o.speed || 0.5) + '" aria-label="Speed"></label>' +
      '<button type="button" class="dg-ctl-btn mc-step">Next stage ▸</button></div>';
    const svg = $(box, '.mc-svg'), now = $(box, '.mc-now'), play = $(box, '.mc-play'), sp = $(box, '.mc-speed input');
    let f = 0, run = !reduce, visible = true, last = null, raf = null, shown = -1;
    const stages = o.phases.map(ph => ph[2]);            // start of each stage, as a fraction of the cycle
    function stageOf(x) { let k = 0; stages.forEach((a, i) => { if (x >= a) k = i; }); return k; }
    function paint() {
      svg.innerHTML = o.draw(f);
      const k = stageOf(f);
      if (k !== shown) { shown = k; box.querySelectorAll('.mc-phases span').forEach((e, i) => e.classList.toggle('on', i === k)); now.textContent = o.phases[k][1]; }
    }
    function tick(t) {
      raf = null;
      if (last != null) f = (f + (t - last) / 1000 / o.period * +sp.value) % 1;
      last = t; paint();
      if (run && visible) raf = requestAnimationFrame(tick); else last = null;
    }
    const setBtn = () => { play.textContent = run ? '❚❚ Pause' : '▶ Run'; };
    play.addEventListener('click', () => { run = !run; setBtn(); if (run && !raf) raf = requestAnimationFrame(tick); });
    $(box, '.mc-step').addEventListener('click', () => { run = false; setBtn(); const k = (stageOf(f) + 1) % stages.length; f = stages[k] + 0.001; paint(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && run && !raf) { last = null; raf = requestAnimationFrame(tick); } }).observe(svg);
    setBtn(); paint(); if (run) raf = requestAnimationFrame(tick);
  }
  const P = (x, y) => x.toFixed(1) + ' ' + y.toFixed(1);
  const TX = (x, y, t, c, a) => '<text class="' + (c || 'dg-ts') + (a ? ' dg-' + a : '') + '" x="' + x + '" y="' + y + '">' + t + '</text>';

  // Four-stroke engine: crank angle 0–720°, TDC at 0. Slider-crank geometry for the piston.
  function engine(box) {
    const cx = 222, cy = 252, r = 34, L = 100, head = 66;
    machine(box, { title: 'Four-stroke engine, running', sub: 'Two turns of the crank for every power stroke. Watch the valves and the spark.', vb: '0 0 444 320', label: 'A four-stroke engine running: intake, compression, power and exhaust', period: 2.4, speed: 0.35,
      phases: [['Intake', 'Intake: the piston goes down and draws in fuel and air through the open intake valve.', 0], ['Compression', 'Compression: both valves shut; the piston squeezes the mixture.', .25],
               ['Power', 'Power: the spark fires; burning gas drives the piston down — the only stroke that makes work.', .5], ['Exhaust', 'Exhaust: the exhaust valve opens; the piston pushes the burnt gas out.', .75]],
      draw(f) {
        const th = f * 720, a = th * Math.PI / 180;
        const pinY = cy - (r * Math.cos(a) + Math.sqrt(L * L - Math.pow(r * Math.sin(a), 2))), top = pinY - 16;
        const kx = cx + r * Math.sin(a), ky = cy - r * Math.cos(a);
        const lift = (lo, hi) => th > lo && th < hi ? 9 * Math.sin((th - lo) / (hi - lo) * Math.PI) : 0;
        const vi = lift(0, 190), ve = lift(530, 720);
        const ph = th < 180 ? 0 : th < 360 ? 1 : th < 540 ? 2 : 3;
        const gas = ['calc-gas-in', 'calc-gas-in', 'calc-gas-burn', 'calc-gas-out'][ph], gop = ph === 1 ? .55 + .4 * (th - 180) / 180 : ph === 2 ? 1 - .7 * (th - 360) / 180 : ph === 3 ? .5 : .35 + .3 * th / 180;
        let g = '';
        g += '<rect class="dg-panel" x="150" y="40" width="144" height="200" rx="4"/>';                                   // block
        g += '<rect class="' + gas + '" x="172" y="' + head + '" width="100" height="' + (top - head).toFixed(1) + '" opacity="' + gop.toFixed(2) + '"/>';
        g += '<path class="dg-line" d="M170 ' + head + ' V230 M274 ' + head + ' V230"/>';                                     // cylinder walls
        g += '<path class="dg-line" d="M150 ' + head + ' H190 M204 ' + head + ' H240 M254 ' + head + ' H294"/>';             // head with two ports
        g += '<path class="dg-water" d="M120 26 H182 V' + head + ' H170 V38 H120 Z" opacity=".5"/><path class="dg-earth" d="M262 ' + head + ' V26 H324 V38 H274 V' + head + ' Z" opacity=".5"/>';
        g += TX(124, 20, 'intake', 'dg-ts') + TX(320, 20, 'exhaust', 'dg-ts', 'end');
        g += '<g class="mc-valve"><path class="dg-line" d="M197 18 V' + (head - 2 + vi).toFixed(1) + '"/><path class="dg-key" d="M189 ' + (head - 4 + vi).toFixed(1) + ' H205 L201 ' + (head + vi).toFixed(1) + ' H193 Z"/></g>';
        g += '<g class="mc-valve"><path class="dg-line" d="M247 18 V' + (head - 2 + ve).toFixed(1) + '"/><path class="dg-key" d="M239 ' + (head - 4 + ve).toFixed(1) + ' H255 L251 ' + (head + ve).toFixed(1) + ' H243 Z"/></g>';
        g += '<rect class="dg-white" x="216" y="44" width="12" height="20" rx="2" opacity=".8"/>';                           // spark plug
        if (th > 352 && th < 392) g += '<path class="calc-spark" d="M222 70 l4 7 l7 -1 l-5 6 l4 7 l-8 -3 l-5 6 l0 -8 l-7 -3 l7 -3 z"/>';
        if (vi > 2) for (let k = 0; k < 3; k++) { const yy = 30 + ((f * 2400 + k * 13) % 36); g += '<circle class="calc-dotin" cx="' + (176 + k * 3) + '" cy="' + yy.toFixed(1) + '" r="2"/>'; }
        if (ve > 2) for (let k = 0; k < 3; k++) { const yy = 60 - ((f * 2400 + k * 13) % 36); g += '<circle class="calc-dotout" cx="' + (266 + k * 3) + '" cy="' + yy.toFixed(1) + '" r="2"/>'; }
        g += '<rect class="dg-key" x="174" y="' + top.toFixed(1) + '" width="96" height="30" rx="3"/><path class="dg-thin" d="M174 ' + (top + 7).toFixed(1) + ' H270 M174 ' + (top + 12).toFixed(1) + ' H270"/>';  // piston + rings
        g += '<circle class="dg-panel" cx="' + cx + '" cy="' + cy + '" r="48"/><circle class="dg-line" cx="' + cx + '" cy="' + cy + '" r="48" fill="none"/>';
        g += '<path class="dg-wood" d="M' + P(cx - 5, cy) + ' L' + P(kx - 5, ky) + ' L' + P(kx + 5, ky) + ' L' + P(cx + 5, cy) + ' Z" opacity=".9"/>';
        g += '<path class="dg-line" style="stroke-width:7" d="M' + P(kx, ky) + ' L' + P(cx, pinY) + '"/><circle class="dg-keyf" cx="' + cx + '" cy="' + pinY.toFixed(1) + '" r="4"/><circle class="dg-keyf" cx="' + kx.toFixed(1) + '" cy="' + ky.toFixed(1) + '" r="4.5"/><circle class="dg-line" cx="' + cx + '" cy="' + cy + '" r="5"/>';
        g += TX(330, 120, 'piston', 'dg-tb') + TX(330, 200, 'connecting rod', 'dg-ts') + TX(330, 264, 'crankshaft', 'dg-ts') + TX(36, 120, 'cylinder', 'dg-ts') + TX(36, 60, 'spark plug ↘', 'dg-ts');
        g += TX(222, 316, 'crank ' + Math.round(th % 720) + '° of 720°', 'dg-ts', 'mid');
        return g;
      } });
  }

  // Single-chamber bellows feeding a forge: lift (flap opens, air in), push (flap shuts, air out).
  function forge(box) {
    machine(box, { title: 'Bellows and forge, working', sub: 'One bellows blows only on the push. Watch the flap valve and the fire.', vb: '0 0 444 250', label: 'A single-chamber bellows blowing a forge fire', period: 2.6, speed: 0.6,
      phases: [['Lift', 'Lift: the top board rises, the intake flap swings open and air fills the bellows.', 0], ['Push', 'Push: the flap shuts, air is forced out of the nozzle into the fire and the coals flare.', .5]],
      draw(f) {
        const push = f >= .5, k = push ? (f - .5) / .5 : f / .5;
        const ang = push ? 22 * (1 - k) : 22 * k;           // top board angle about the hinge at the nozzle end
        const hx = 226, hy = 150, len = 190, rad = ang * Math.PI / 180;
        const tx = hx - len * Math.cos(rad), ty = hy - 18 - len * Math.sin(rad);
        const blast = push ? Math.sin(k * Math.PI) : 0;
        let g = '<rect class="dg-earth" x="0" y="214" width="444" height="36" opacity=".5"/>';
        g += '<path class="dg-leather" d="M' + P(hx, hy - 18) + ' L' + P(tx, ty) + ' L' + P(hx - len, hy) + ' L' + P(hx, hy) + ' Z" opacity=".55"/>';    // leather sides
        g += '<path class="dg-wood" d="M' + P(hx - len, hy) + ' L' + P(hx, hy) + ' L' + P(hx, hy + 8) + ' L' + P(hx - len, hy + 8) + ' Z"/>';               // bottom board
        g += '<path class="dg-wood-s" style="stroke-width:8" d="M' + P(hx, hy - 18) + ' L' + P(tx, ty) + '"/>';                                           // top board
        const vx = hx - 120 * Math.cos(rad), vy = hy - 18 - 120 * Math.sin(rad);
        const open = !push && k < .95;
        g += '<path class="dg-leather" d="M' + P(vx - 8, vy + 2) + ' l' + (open ? '4 12' : '16 0') + '" style="stroke:#c9a15a;stroke-width:3;fill:none"/>' + TX(vx - 30, vy - 14, open ? 'flap open' : 'flap shut', 'dg-ts');
        if (open) for (let i = 0; i < 3; i++) { const t2 = (f * 6 + i / 3) % 1; g += '<circle class="calc-dotin" cx="' + (vx - 6 + i * 4).toFixed(1) + '" cy="' + (vy - 26 + 26 * t2).toFixed(1) + '" r="2"/>'; }
        g += '<path class="dg-line" d="M' + hx + ' ' + (hy - 12) + ' H300 V176 H318" style="stroke-width:6"/>';                                         // nozzle + tuyere
        if (blast > .05) for (let i = 0; i < 4; i++) { const t2 = (f * 8 + i / 4) % 1; const x = hx + 90 * t2; g += '<circle class="calc-dotin" cx="' + Math.min(x, 300).toFixed(1) + '" cy="' + (x < 300 ? hy - 12 : hy - 12 + (x - 300) * 1.4).toFixed(1) + '" r="2.2"/>'; }
        g += '<path class="dg-panel" d="M308 150 H430 V214 H308 Z"/><path class="dg-line" d="M308 150 H430 V214 H308 Z" fill="none"/>';                  // forge
        const glow = .35 + .65 * blast;
        g += '<ellipse class="calc-coal" cx="369" cy="158" rx="54" ry="14" opacity="' + glow.toFixed(2) + '"/>';
        for (let i = 0; i < 9; i++) g += '<circle class="dg-debris" cx="' + (322 + i * 11) + '" cy="' + (158 + (i % 2) * 4) + '" r="6"/>';
        g += '<path class="calc-flame" d="M330 150 q10 ' + (-22 - 40 * blast).toFixed(1) + ' 20 0 q10 ' + (-28 - 46 * blast).toFixed(1) + ' 20 0 q10 ' + (-20 - 40 * blast).toFixed(1) + ' 20 0 q10 ' + (-26 - 36 * blast).toFixed(1) + ' 18 0 Z" opacity="' + (.5 + .5 * blast).toFixed(2) + '"/>';
        if (blast > .4) for (let i = 0; i < 4; i++) { const t2 = (f * 5 + i / 4) % 1; g += '<circle class="calc-spk" cx="' + (340 + i * 18 + 8 * Math.sin(i + f * 20)).toFixed(1) + '" cy="' + (140 - 70 * t2).toFixed(1) + '" r="1.6" opacity="' + (1 - t2).toFixed(2) + '"/>'; }
        g += TX(36, 200, 'hinged at the nozzle end', 'dg-ts') + TX(318, 236, 'air in through the tuyere', 'dg-ts') + TX(36, 24, push ? 'PUSH' : 'LIFT', 'dg-big');
        return g;
      } });
  }

  // Lift pump: piston with a flap valve, foot valve at the bottom of the cylinder.
  function handpump(box) {
    machine(box, { title: 'Hand pump, working', sub: 'A piston and two flap valves. The handle lifts the piston; water comes out on every upstroke.', vb: '0 0 444 300', label: 'A hand piston pump: foot valve and piston valve lifting water', period: 2.4, speed: 0.6,
      phases: [['Upstroke', 'Upstroke: the piston valve shuts and lifts the water above it out of the spout; the foot valve opens and fresh water follows the piston up.', 0],
               ['Downstroke', 'Downstroke: the foot valve shuts; the piston valve opens and the piston slides down through the water, ready to lift again.', .5]],
      draw(f) {
        const up = f < .5, k = up ? f / .5 : (f - .5) / .5;
        const py = up ? 190 - 90 * (.5 - .5 * Math.cos(k * Math.PI)) : 100 + 90 * (.5 - .5 * Math.cos(k * Math.PI));   // piston position
        let g = '<rect class="dg-earth" x="0" y="232" width="444" height="68" opacity=".45"/><rect class="dg-water" x="130" y="262" width="184" height="36" opacity=".55"/>';
        g += '<rect class="dg-water" x="204" y="200" width="36" height="96" opacity=".6"/>';                               // water in the riser below the foot valve
        g += '<rect class="dg-water" x="194" y="' + (py + 10).toFixed(1) + '" width="56" height="' + (200 - py - 10).toFixed(1) + '" opacity=".6"/>';      // water following the piston
        if (py > 130) g += '<rect class="dg-water" x="194" y="128" width="56" height="' + (py - 128).toFixed(1) + '" opacity=".6"/>';   // water above the piston, up to the spout
        g += '<path class="dg-line" d="M192 40 V200 M252 40 V128 M252 140 V200 M192 200 H204 M240 200 H252 M204 200 V296 M240 200 V296" style="stroke-width:3"/>';
        g += '<path class="dg-line" d="M252 128 H290 L298 140 M252 140 H286" style="stroke-width:3"/>';                         // spout
        if (up && k > .1) { g += '<path class="dg-blue-s mc-pour" d="M294 140 Q300 170 302 230" style="stroke-width:' + (2 + 4 * Math.sin(k * Math.PI)).toFixed(1) + '"/>'; }
        g += '<rect class="dg-water" x="282" y="232" width="40" height="10" rx="3" opacity=".5"/>';
        const fo = up ? 1 : 0, po = up ? 0 : 1;          // foot valve open on the upstroke, piston valve open on the downstroke
        g += '<path class="dg-key-s" d="M206 200 ' + (fo ? 'L214 188' : 'L222 200') + ' M238 200 ' + (fo ? 'L230 188' : 'L222 200') + '" style="stroke-width:3"/>';
        g += '<rect class="dg-key" x="194" y="' + py.toFixed(1) + '" width="56" height="10" rx="2"/>';
        g += '<path class="dg-panel" d="M216 ' + py.toFixed(1) + ' h12 v10 h-12 z"/><path class="dg-key-s" d="M216 ' + py.toFixed(1) + (po ? ' l6 -8 M228 ' + py.toFixed(1) + ' l-6 -8' : ' l12 0') + '" style="stroke-width:2.5"/>';
        const rt = py - 70;                                   // the rod moves with the piston
        g += '<path class="dg-line" d="M222 ' + py.toFixed(1) + ' V' + rt.toFixed(1) + '" style="stroke-width:3"/>';
        const px0 = 160, py0 = 60, hx = px0 - (222 - px0) * 1.6, hy = py0 - (rt - py0) * 1.6;   // lever about a pivot: handle down, rod up
        g += '<path class="dg-line" d="M160 60 L150 108 M160 60 L170 108" style="stroke-width:2.5"/>';
        g += '<path class="dg-wood-s" style="stroke-width:7" d="M' + P(hx, hy) + ' L' + P(222, rt) + '"/><circle class="dg-keyf" cx="160" cy="60" r="4.5"/>';
        g += TX(20, 74, 'handle', 'dg-tb') + TX(300, 70, 'piston valve', 'dg-ts') + TX(300, 84, (po ? 'open' : 'shut'), 'dg-tb') + TX(300, 200, 'foot valve', 'dg-ts') + TX(300, 214, (fo ? 'open' : 'shut'), 'dg-tb') + TX(136, 290, 'well water', 'dg-ts');
        return g;
      } });
  }

  // Hydraulic ram: drive water speeds up, slams the waste valve, the surge opens the delivery valve.
  function ram(box) {
    machine(box, { title: 'Hydraulic ram pump, working', sub: 'Two moving valves, no power. Each beat sends a little water uphill; most runs to waste.', vb: '0 0 444 260', label: 'A hydraulic ram pump: drive pipe, waste valve, delivery valve and air chamber', period: 1.6, speed: 0.4,
      phases: [['Water speeds up', 'Water rushes down the drive pipe and out through the open waste valve, getting faster.', 0],
               ['Waste valve slams', 'The flow gets fast enough to slam the waste valve shut. The moving water has to stop suddenly…', .45],
               ['Surge goes uphill', '…so the pressure jumps, forces the delivery valve open, and pushes water into the air chamber and up the delivery pipe.', .52],
               ['Reset', 'The surge is spent: the delivery valve drops shut, the waste valve falls open, and it all starts again.', .8]],
      draw(f) {
        const speed = f < .45 ? f / .45 : f < .52 ? 1 : f < .8 ? .2 : .1;
        const waste = f < .45 ? 1 : f < .8 ? 0 : (f - .8) / .2;            // 1 open, 0 shut
        const deliv = f >= .52 && f < .8 ? Math.sin((f - .52) / .28 * Math.PI) : 0;
        let g = '<path class="dg-earth" d="M0 60 L120 60 L330 200 L444 200 L444 260 L0 260 Z" opacity=".45"/>';
        g += '<rect class="dg-water" x="8" y="40" width="96" height="24" opacity=".7"/>' + TX(12, 34, 'stream / source', 'dg-ts');
        g += '<path class="dg-water" d="M96 58 L276 178 L276 192 L92 68 Z" opacity=".55"/>';     // drive pipe
        g += '<path class="dg-blue-s mc-flow" d="M98 63 L272 184" style="--fs:' + (speed > .05 ? (1.2 / speed).toFixed(2) : 99) + 's;stroke-dashoffset:' + (-f * 600 * speed).toFixed(1) + '" stroke-dasharray="6 9"/>';
        g += '<rect class="dg-panel" x="270" y="170" width="70" height="30" rx="4"/><rect class="dg-line" x="270" y="170" width="70" height="30" rx="4" fill="none"/>';
        g += '<path class="dg-key" d="M282 ' + (164 - 6 * (1 - waste)).toFixed(1) + ' h20 v6 h-20 z"/>' + TX(264, 224, 'waste valve: ' + (waste > .5 ? 'open' : 'SHUT'), waste > .5 ? 'dg-ts' : 'dg-tb', 'end');
        if (waste > .5 && speed > .2) for (let i = 0; i < 4; i++) { const t2 = (f * 8 + i / 4) % 1; g += '<circle class="calc-dotin" cx="' + (292 + (i - 1.5) * 4).toFixed(1) + '" cy="' + (162 - 26 * t2 * speed).toFixed(1) + '" r="2"/>'; }
        const lvl = 112 - 26 * (f >= .52 && f < .9 ? Math.sin(Math.min(1, (f - .52) / .3) * Math.PI / 2) : 0);
        g += '<rect class="dg-line" x="312" y="80" width="26" height="90" rx="10" fill="none"/><rect class="dg-water" x="314" y="' + lvl.toFixed(1) + '" width="22" height="' + (168 - lvl).toFixed(1) + '" opacity=".7"/>' + TX(344, 92, 'air chamber', 'dg-ts') + TX(344, 106, 'air squeezed,', 'dg-ts') + TX(344, 120, 'keeps flow steady', 'dg-ts');
        g += '<path class="dg-key" d="M316 ' + (172 - 6 * deliv).toFixed(1) + ' h18 v5 h-18 z"/>' + TX(344, 186, 'delivery valve: ' + (deliv > .1 ? 'OPEN' : 'shut'), deliv > .1 ? 'dg-tb' : 'dg-ts');
        g += '<path class="dg-line" d="M325 80 V40 L430 10" style="stroke-width:5"/><path class="dg-blue-s" d="M325 80 V40 L430 10" stroke-dasharray="4 7" style="stroke-dashoffset:' + (-f * 60).toFixed(1) + ';stroke-width:2"/>';
        g += TX(436, 50, 'up to the tank', 'dg-ts', 'end') + TX(150, 140, 'drive pipe', 'dg-ts');
        if (f >= .45 && f < .55) g += '<text class="dg-big dg-mid mc-bang" x="306" y="244">CLACK</text>';
        return g;
      } });
  }

  const KINDS = { fallout, bleach, rain, solar, sun, morse, lookalike, engine, forge, handpump, ram };
  document.querySelectorAll('.calc[data-calc]').forEach(box => {
    const f = KINDS[box.dataset.calc]; if (!f || box.dataset.ready) return;
    box.dataset.ready = '1'; f(box);
  });
})();
