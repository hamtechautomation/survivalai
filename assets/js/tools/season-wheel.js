/* BunkerBot Season Wheel: <div data-bb-tool="season-wheel"></div>. UK year at a glance: foraging, fishing, game, growing, hazards. Offline. */
(function () {
  'use strict';
  var CATS = [['forage', 'Foraging', '#3fae5a'], ['fish', 'Fishing', '#4a9fd8'], ['game', 'Game & deer (England)', '#c0763a'], ['grow', 'Growing', '#b6c94a'], ['hazard', 'Hazards', '#dc3c32']];
  // [cat, name, start, end, note]; months as 1–12 with fractions (e.g. 8.37 = 12 Aug); end is inclusive-ish
  var D = [
    ['forage', 'Wild garlic', 3, 5.99, 'Damp woods; don\'t confuse with lords-and-ladies or lily of the valley'], ['forage', 'Nettle tops', 3, 6.5, 'Young tops; cook to remove the sting'],
    ['forage', 'Elderflower', 5.5, 6.99, 'Cordial, fritters'], ['forage', 'Bilberries', 7, 8.99, 'Moorland edges'], ['forage', 'Blackberries', 8, 9.99, 'Hedges everywhere'],
    ['forage', 'Elderberries', 8.5, 9.99, 'Always cook; raw berries cause sickness'], ['forage', 'Hazelnuts', 9, 10.5, 'Beat the squirrels'], ['forage', 'Sloes, rosehips', 9.5, 11.99, 'Rosehips: remove the irritant hairs'],
    ['forage', 'Sweet chestnuts', 10, 11.5, 'Roast; not horse chestnuts (conkers are toxic)'], ['forage', 'Mushrooms (experts only)', 8, 11.99, 'Deadly lookalikes. Never eat on one guide\'s say-so'],
    ['forage', 'Sea beet, samphire', 4, 8.99, 'Coast; samphire Jul–Aug'],
    ['fish', 'Coarse rivers CLOSED', 3.45, 6.5, '15 Mar – 15 Jun (England); stillwaters and canals vary'], ['fish', 'Coarse rivers open', 6.5, 3.44, '16 Jun – 14 Mar'],
    ['fish', 'Brown trout (typical)', 3.5, 9.99, 'Roughly mid-Mar to end-Sep; check your area\'s byelaws'],
    ['fish', 'Bass: catch & release only', 2, 3.99, '1 Feb – 31 Mar; 42 cm minimum, 3 a day otherwise'], ['fish', 'Mackerel (shore)', 6, 9.5, 'Summer shoals'], ['fish', 'Cod & whiting (shore)', 10.5, 2.5, 'Winter beach and pier fishing'],
    ['game', 'Rabbit & woodpigeon', 1, 12.99, 'All year (pigeon under general licence conditions)'], ['game', 'Red grouse', 8.37, 12.32, '12 Aug – 10 Dec'], ['game', 'Partridge', 9, 2.03, '1 Sep – 1 Feb'],
    ['game', 'Pheasant', 10, 2.03, '1 Oct – 1 Feb'], ['game', 'Woodcock', 10, 1.99, '1 Oct – 31 Jan (England & Wales)'], ['game', 'Duck & goose (inland)', 9, 1.99, '1 Sep – 31 Jan (to 20 Feb below high-water mark)'],
    ['game', 'Roe buck', 4, 10.99, '1 Apr – 31 Oct'], ['game', 'Roe / fallow / red / sika does & hinds', 11, 3.99, '1 Nov – 31 Mar'], ['game', 'Red / fallow / sika stags', 8, 4.99, '1 Aug – 30 Apr'],
    ['grow', 'Sow potatoes', 3, 4.99, 'Earlies late Mar, maincrop Apr'], ['grow', 'Sow beans, peas, roots', 3.5, 6.5, 'Under cover first in the north'],
    ['grow', 'Plant brassicas for winter', 5, 7.5, 'Kale and leeks stand all winter'], ['grow', 'Main harvest', 7, 10.99, 'Store roots in sand; dry beans'], ['grow', 'Sow broad beans, garlic', 10, 11.99, 'Overwinter for early crops'],
    ['grow', 'Lambing / kidding', 2, 4.99, 'Smallholders: peak workload'],
    ['hazard', 'Storms & gales', 10, 3.5, 'Named storms peak Nov–Feb'], ['hazard', 'Snow & ice', 12, 3.5, 'Uplands Nov–Apr'], ['hazard', 'River flooding', 10, 2.99, 'Also summer flash floods'],
    ['hazard', 'Heat-health alerts', 6, 9.5, 'UKHSA alerts June–Sept'], ['hazard', 'Moorland wildfire', 3, 8.99, 'Peak in dry springs'], ['hazard', 'Ticks (Lyme)', 3, 10.99, 'Check daily in bracken and grass'],
    ['hazard', 'Adders active', 3, 9.99, 'Basking in spring sun']
  ];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function inMonth(it, m) { var s = it[2], e = it[3], a = m, b = m + 0.999; return s <= e ? (b >= s && a <= e) : (b >= s || a <= e); }
  function polar(cx, cy, r, mon) { var a = (mon - 1) / 12 * 2 * Math.PI - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arc(cx, cy, r, s, e) { // s,e in month units (1..13)
    var p0 = polar(cx, cy, r, s), p1 = polar(cx, cy, r, e), large = (e - s) > 6 ? 1 : 0;
    return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
  }
  function mount(root) {
    if (root.__bb) return; root.__bb = 1; root.classList.add('bb-tool', 'bb-wheel');
    var now = new Date().getMonth() + 1, sel = now, on = {}; CATS.forEach(function (c) { on[c[0]] = true; });
    root.innerHTML = '<h3>The UK Year: Season Wheel</h3><p class="bb-sub">What\'s in season, what\'s open, what to plant and what to watch out for. Tap a month.</p>' +
      '<div class="bb-tabs bb-wh-f">' + CATS.map(function (c) { return '<button class="on" data-c="' + c[0] + '"><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + c[2] + ';margin-right:6px"></i>' + c[1] + '</button>'; }).join('') + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"><div class="bb-wh-svg" style="flex:1 1 320px;max-width:520px"></div><div class="bb-wh-list" style="flex:1 1 260px" aria-live="polite"></div></div>' +
      '<p class="bb-note">Seasons are for England unless stated; Scotland and Wales differ for some species. Fishing needs an EA rod licence and permission. Shooting needs the right licence or certificate and the landowner\'s permission. See <a href="hunting-trapping.html">Hunting</a>, <a href="fishing.html">Fishing</a> and <a href="smallholding.html">Smallholding</a>.</p>';
    root.querySelectorAll('[data-c]').forEach(function (b) { b.onclick = function () { var c = b.getAttribute('data-c'); on[c] = !on[c]; b.classList.toggle('on', on[c]); draw(); }; });
    function draw() {
      var cx = 200, cy = 200, cats = CATS.filter(function (c) { return on[c[0]]; }), ringW = Math.min(26, 120 / Math.max(1, cats.length));
      var svg = '<svg viewBox="0 0 400 400" role="img" aria-label="Season wheel; month list follows" style="width:100%;height:auto;display:block">';
      for (var m = 1; m <= 12; m++) {
        var p0 = polar(cx, cy, 195, m), p1 = polar(cx, cy, 195, m + 1), lp = polar(cx, cy, 182, m + 0.5);
        svg += '<path d="M' + cx + ' ' + cy + ' L' + p0[0] + ' ' + p0[1] + ' A195 195 0 0 1 ' + p1[0] + ' ' + p1[1] + ' Z" fill="' + (m === sel ? 'rgba(245,158,11,.18)' : (m % 2 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.06)')) + '" stroke="rgba(255,255,255,.08)" data-m="' + m + '" style="cursor:pointer"><title>' + MON[m - 1] + '</title></path>';
        svg += '<text x="' + lp[0] + '" y="' + lp[1] + '" fill="' + (m === now ? '#f59e0b' : '#a9b0a8') + '" font-size="12" font-weight="' + (m === sel ? 700 : 400) + '" text-anchor="middle" dominant-baseline="middle" style="pointer-events:none">' + MON[m - 1] + '</text>';
      }
      cats.forEach(function (c, ci) {
        var items = D.filter(function (d) { return d[0] === c[0]; }), r0 = 165 - ci * (ringW + 4), lanes = Math.min(4, items.length), lw = ringW / lanes;
        items.forEach(function (it, k) {
          var r = r0 - (k % lanes) * lw - lw / 2, s = it[2], e = it[3] + 0.01, segs = s <= e ? [[s, e]] : [[s, 13], [1, e]];
          segs.forEach(function (sg) { svg += '<path d="' + arc(cx, cy, r, sg[0], Math.min(sg[1], 12.999 + 1)) + '" stroke="' + c[2] + '" stroke-width="' + Math.max(2, lw - 1.5) + '" fill="none" stroke-linecap="butt" opacity="' + (inMonth(it, sel) ? 1 : 0.35) + '" style="pointer-events:none"/>'; });
        });
      });
      var ni = polar(cx, cy, 60, sel + 0.5);
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="#121816" stroke="rgba(255,255,255,.12)"/><text x="' + cx + '" y="' + (cy - 4) + '" fill="#ece8dc" font-size="18" font-weight="700" text-anchor="middle">' + MON[sel - 1] + '</text><text x="' + cx + '" y="' + (cy + 14) + '" fill="#a9b0a8" font-size="10" text-anchor="middle">' + (sel === now ? 'this month' : 'selected') + '</text></svg>';
      root.querySelector('.bb-wh-svg').innerHTML = svg;
      root.querySelectorAll('.bb-wh-svg [data-m]').forEach(function (p) { p.addEventListener('click', function () { sel = +p.getAttribute('data-m'); draw(); }); });
      var list = '<div class="bb-card"><div class="bb-row" style="margin:0 0 6px;justify-content:space-between"><b style="font-size:17px">' + MON[sel - 1] + '</b><span><button class="w-prev" aria-label="Previous month">◀</button> <button class="w-next" aria-label="Next month">▶</button></span></div>';
      cats.forEach(function (c) { var its = D.filter(function (d) { return d[0] === c[0] && inMonth(d, sel); }); if (!its.length) return;
        list += '<div style="margin:8px 0 2px;color:' + c[2] + ';font-weight:600;font-size:13px">' + c[1] + '</div><ul style="margin:0;padding-left:18px">' + its.map(function (i) { return '<li><b>' + i[1] + '</b><br><small style="color:var(--bb-mute)">' + i[4] + '</small></li>'; }).join('') + '</ul>'; });
      list += '</div>';
      root.querySelector('.bb-wh-list').innerHTML = list;
      root.querySelector('.w-prev').onclick = function () { sel = sel === 1 ? 12 : sel - 1; draw(); };
      root.querySelector('.w-next').onclick = function () { sel = sel === 12 ? 1 : sel + 1; draw(); };
    }
    draw();
  }
  function init() { document.querySelectorAll('[data-bb-tool="season-wheel"]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.BBSeasonWheel = { mount: mount };
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
