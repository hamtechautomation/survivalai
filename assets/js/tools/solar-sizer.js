/* BunkerBot Solar Sizer: <div data-bb-tool="solar"></div>. Off-grid / backup solar sizing for UK sun. Offline. */
(function () {
  'use strict';
  // Approx. daily kWh/m² on a south-facing panel at optimum tilt (PVGIS-style monthly averages), by UK latitude band.
  var SUN = {
    s: ['South England & Wales', [1.1, 1.9, 2.8, 4.0, 4.6, 4.7, 4.7, 4.2, 3.4, 2.3, 1.4, 0.9]],
    n: ['Midlands, North England, N. Wales', [0.9, 1.6, 2.6, 3.8, 4.5, 4.5, 4.4, 3.9, 3.0, 2.0, 1.1, 0.7]],
    sc: ['Scotland & Northern Ireland', [0.6, 1.3, 2.4, 3.6, 4.4, 4.4, 4.2, 3.6, 2.7, 1.6, 0.8, 0.5]]
  };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var APP = [ // name, watts, default hours/day, default qty, surge factor
    ['Phone charging', 10, 2, 2, 1], ['LED bulbs (8 W)', 8, 5, 3, 1], ['Wi-Fi router', 10, 24, 1, 1], ['Laptop', 50, 3, 1, 1],
    ['Fridge (A-rated, avg draw)', 40, 24, 0, 5], ['Chest freezer (avg draw)', 35, 24, 1, 5], ['CPAP machine (no humidifier)', 40, 8, 0, 1],
    ['TV (LED 40")', 60, 3, 0, 1], ['Radio / comms', 5, 6, 1, 1], ['Gas boiler pump & controls', 100, 6, 0, 3],
    ['Water pump (well/borehole)', 500, 0.5, 0, 3], ['Power tools (drill)', 600, 0.25, 0, 2], ['Electric blanket', 60, 2, 0, 1],
    ['Kettle (2 kW) ⚠️', 2000, 0.15, 0, 1], ['Microwave (800 W)', 1200, 0.2, 0, 1]
  ];
  function S(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('bbSolar.' + k)); localStorage.setItem('bbSolar.' + k, JSON.stringify(v)); } catch (e) { return null; } }
  function r(n, step) { return Math.ceil(n / step) * step; }
  function mount(root) {
    if (root.__bb) return; root.__bb = 1; root.classList.add('bb-tool', 'bb-solar');
    var st = S('s') || { band: 'n', month: 9, days: 2, chem: 'lfp', volt: 24, rows: APP.map(function (a) { return [a[3], a[2]]; }) };
    root.innerHTML = '<h3>Solar & Battery Sizer</h3><p class="bb-sub">List what you need to run. You get panel, battery, inverter and charge-controller sizes for the <b>worst month you need to cover</b> in your part of the UK.</p>' +
      '<div class="bb-row"><div class="bb-field"><label>Where</label><select data-k="band">' + Object.keys(SUN).map(function (k) { return '<option value="' + k + '">' + SUN[k][0] + '</option>'; }).join('') + '</select></div>' +
      '<div class="bb-field"><label>Design month (worst you must cover)</label><select data-k="month">' + MON.map(function (m, i) { return '<option value="' + i + '">' + m + '</option>'; }).join('') + '</select></div>' +
      '<div class="bb-field"><label>Days of battery autonomy</label><select data-k="days"><option>1</option><option>2</option><option>3</option><option>5</option></select></div>' +
      '<div class="bb-field"><label>Battery</label><select data-k="chem"><option value="lfp">LiFePO₄ (90% usable)</option><option value="pb">Lead-acid / AGM (50% usable)</option></select></div>' +
      '<div class="bb-field"><label>System voltage</label><select data-k="volt"><option>12</option><option>24</option><option>48</option></select></div></div>' +
      '<div class="bb-card" style="overflow-x:auto"><table><thead><tr><th>Appliance</th><th class="bb-num">Watts</th><th class="bb-num">Qty</th><th class="bb-num">Hours/day</th><th class="bb-num">Wh/day</th></tr></thead><tbody class="bb-so-rows"></tbody></table></div>' +
      '<div class="bb-grid bb-so-stats" style="margin-top:12px"></div><div class="bb-so-chart" style="margin-top:12px"></div><div class="bb-so-notes"></div>';
    root.querySelector('.bb-so-rows').innerHTML = APP.map(function (a, i) { return '<tr><td>' + a[0] + '</td><td class="bb-num">' + a[1] + '</td><td class="bb-num"><input aria-label="' + a[0].replace(/&/g, '&amp;').replace(/"/g, '&quot;') + ' quantity" type="number" min="0" max="20" data-q="' + i + '" style="width:64px;min-height:32px;padding:4px 6px"></td><td class="bb-num"><input aria-label="' + a[0].replace(/&/g, '&amp;').replace(/"/g, '&quot;') + ' hours per day" type="number" min="0" max="24" step="0.25" data-h="' + i + '" style="width:72px;min-height:32px;padding:4px 6px"></td><td class="bb-num" data-wh="' + i + '"></td></tr>'; }).join('');
    root.querySelectorAll('[data-k]').forEach(function (el) { var k = el.getAttribute('data-k'); el.value = st[k]; el.addEventListener('change', function () { st[k] = (k === 'band' || k === 'chem') ? el.value : +el.value; S('s', st); calc(); }); });
    root.querySelectorAll('[data-q]').forEach(function (el) { var i = +el.getAttribute('data-q'); el.value = st.rows[i][0]; el.addEventListener('input', function () { st.rows[i][0] = Math.max(0, +el.value || 0); S('s', st); calc(); }); });
    root.querySelectorAll('[data-h]').forEach(function (el) { var i = +el.getAttribute('data-h'); el.value = st.rows[i][1]; el.addEventListener('input', function () { st.rows[i][1] = Math.min(24, Math.max(0, +el.value || 0)); S('s', st); calc(); }); });
    function calc() {
      var wh = 0, peak = 0, surge = 0, kettle = false;
      APP.forEach(function (a, i) { var q = st.rows[i][0], h = st.rows[i][1], w = a[1] * q * h; wh += w; root.querySelector('[data-wh="' + i + '"]').textContent = w ? Math.round(w) : '–';
        if (q) { peak += a[1] * q; surge = Math.max(surge, a[1] * (a[4] - 1)); if (a[1] >= 1000) kettle = true; } });
      var psh = SUN[st.band][1][st.month], eff = 0.75; // wiring, temperature, dirt, controller and inverter losses
      var pv = wh / (psh * eff), dod = st.chem === 'lfp' ? 0.9 : 0.5, batt = wh * st.days / dod / 0.92;
      var inv = (peak * 1.25) + surge, ctrl = pv / st.volt * 1.25;
      var jun = SUN[st.band][1][5];
      root.querySelector('.bb-so-stats').innerHTML =
        '<div class="bb-stat"><b>' + (wh / 1000).toFixed(2) + ' kWh</b><span>daily use</span></div>' +
        '<div class="bb-stat"><b>' + r(pv, 50).toLocaleString('en-GB') + ' W</b><span>solar panels for ' + MON[st.month] + ' (' + psh + ' sun-hours)</span></div>' +
        '<div class="bb-stat"><b>' + (r(batt, 100) / 1000).toFixed(1) + ' kWh</b><span>battery (' + st.days + ' days, ' + (st.chem === 'lfp' ? 'LiFePO₄' : 'lead-acid') + ') ≈ ' + Math.ceil(batt / st.volt) + ' Ah at ' + st.volt + ' V</span></div>' +
        '<div class="bb-stat"><b>' + r(inv, 100).toLocaleString('en-GB') + ' W</b><span>pure-sine inverter (continuous, incl. motor start-up)</span></div>' +
        '<div class="bb-stat"><b>' + r(ctrl, 5) + ' A</b><span>MPPT charge controller at ' + st.volt + ' V</span></div>';
      var mx = Math.max.apply(null, SUN[st.band][1]);
      root.querySelector('.bb-so-chart').innerHTML = '<div class="bb-card"><div class="bb-lbl" style="margin-bottom:6px">What ' + r(pv, 50) + ' W of panels produces each month vs your ' + (wh / 1000).toFixed(2) + ' kWh/day</div><div style="display:flex;gap:4px;align-items:flex-end;height:120px" role="img" aria-label="Monthly output chart">' +
        SUN[st.band][1].map(function (v, i) { var out = r(pv, 50) * v * eff, ok = out >= wh; return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end"><div title="' + MON[i] + ': ' + (out / 1000).toFixed(2) + ' kWh/day" style="width:100%;height:' + (v / mx * 100) + '%;background:' + (ok ? 'var(--bb-accent)' : 'var(--bb-red)') + ';border-radius:4px 4px 0 0;opacity:' + (i === st.month ? 1 : 0.7) + '"></div><small style="font-size:10.5px;color:var(--bb-mute)">' + MON[i][0] + '</small></div>'; }).join('') +
        '</div><p class="bb-note" style="margin:6px 0 0">Amber = covers your daily use; red = shortfall (battery or a generator makes up the difference). June gives ' + (jun / psh).toFixed(1) + '× the output of ' + MON[st.month] + '.</p></div>';
      var n = '';
      if (kettle) n += '<div class="bb-warn">⚠️ Kettles, microwaves and heaters are hard on off-grid systems: they need a big inverter and battery. Boil water on gas or a wood stove instead.</div>';
      if (st.month >= 10 || st.month <= 1) n += '<div class="bb-note">UK winter sun is 4–7× weaker than summer. Many people size for <b>October–February with a small generator top-up</b> rather than buying panels for December.</div>';
      if (pv <= 800) n += '<div class="bb-ok">Under 800 W: a compliant <b>plug-in solar</b> kit is legal in GB from 27 Aug 2026, but it shuts off in a power cut. For backup you need a battery and inverter with off-grid (island) mode.</div>';
      n += '<p class="bb-note">Sun-hours are approximate long-term averages for a south-facing panel at the best tilt. For your exact roof, use the free EU <b>PVGIS</b> calculator. Grid-connected systems need a G98/G99 notification and an MCS installer for export payments. See <a href="solar-power.html">Solar & Power</a>.</p>';
      root.querySelector('.bb-so-notes').innerHTML = n;
    }
    calc();
  }
  function init() { document.querySelectorAll('[data-bb-tool="solar"]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.BBSolar = { mount: mount };
})();

/* a11y: link each .bb-field <label> to its control so screen readers announce it (shared, idempotent) */
(function () {
  if (window.bbLabelFix) return;
  var n = 0;
  window.bbLabelFix = function (root) {
    (root || document).querySelectorAll('.bb-tool .bb-field').forEach(function (f) {
      var l = f.querySelector('label'), c = f.querySelector('input,select,textarea');
      if (!l || !c || l.htmlFor || l.contains(c)) return;
      if (!c.id) c.id = 'bbf-' + (++n);
      l.htmlFor = c.id;
    });
  };
  function go() {
    window.bbLabelFix();
    if (window.MutationObserver) new MutationObserver(function () { window.bbLabelFix(); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
