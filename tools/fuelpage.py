#!/usr/bin/env python3
"""Builds sections/fuel.html ("Making Fuel") the first time, by moving Salvage §10–15 into a page of
its own with new diagrams and the biodiesel calculator; on later runs it only redraws the figures.
Run:  python3 tools/fuelpage.py"""
import os, re, math
import sweepfigs as S
from sweepfigs import Fig, figure, page, PAGES, drop
from sweepfigs2 import copy_fig
ROOT = S.ROOT

# ───────────────────────────────────────────────────────────── figures
def fuelmap():
    f = Fig('fig-fuelmap', 444, 282)
    f.t(222, 18, 'WHICH FUEL CAN GO IN WHICH ENGINE?', 'dg-th', 'mid')
    cols = [('PETROL ENGINE', '(spark ignition)', [('petrol', 'stabilised: 1–2 years', 0), ('ethanol', 'E10 as is; E85+ re-jet', 1), ('wood gas', '100%; ~35% less power', 1), ('biogas / propane', 'gas mixer; scrub H₂S', 1)]),
            ('DIESEL ENGINE', '(compression ignition)', [('diesel', 'years if dry + biocide', 0), ('biodiesel', 'B100 warm; blend cold', 1), ('veg oil (SVO)', 'old IDI only, two tanks', 1), ('kerosene', '+ 2-stroke oil 1:200', 0), ('wood gas', 'dual-fuel, ~70% gas', 1)]),
            ('STOVES & HEAT', '(burners, forges)', [('dry wood', 'under 20% moisture', 1), ('charcoal', 'clean, hot, smokeless', 1), ('biogas', 'cooking burners', 1), ('waste motor oil', 'drip heaters only', 0)])]
    for i, (h, sub, rows) in enumerate(cols):
        x0 = 8 + i * 146
        f.r(x0, 30, 138, 236, 'dg-panel', 10); f.t(x0 + 69, 48, h, 'dg-tb dg-tb-sm', 'mid'); f.t(x0 + 69, 61, sub, 'dg-ts', 'mid')
        for k, (n, note, make) in enumerate(rows):
            y = 74 + k * 37
            f.r(x0 + 8, y, 122, 32, 'dg-green' if make else 'dg-key', 6)
            f.t(x0 + 14, y + 13, n, 'dg-tb dg-tb-sm'); f.t(x0 + 14, y + 26, note, 'dg-ts', extra=' style="font-size:8.6px"')
    f.t(222, 279, 'Green = you can make it yourself. Amber = stored or salvaged only.', 'dg-ts', 'mid')
    return figure(f.fid, f.svg('Which fuels suit which engines: petrol engines take petrol, ethanol, wood gas and biogas; diesel engines take diesel, biodiesel, straight veg oil in old indirect-injection engines, kerosene with two-stroke oil, and wood gas as dual fuel; stoves take dry wood, charcoal, biogas and, in drip heaters only, waste motor oil'),
        'You cannot make petrol or diesel themselves. Everything green is a substitute that needs the engine, the fuel or both to be prepared — the sections below say how.')

def bd_flow():
    f = Fig('fig-bdflow', 444, 300)
    f.t(222, 18, 'BIODIESEL FROM USED COOKING OIL — EIGHT STAGES', 'dg-th', 'mid')
    steps = [('SETTLE & FILTER', 'days, then cloth'), ('DRY', 'hold at 60 °C'), ('TITRATE', 'how much extra lye'), ('METHOXIDE', 'lye into methanol'),
             ('REACT', '55–60 °C, 1–2 h'), ('SETTLE', '8–24 h'), ('WASH', 'mist water, 3×'), ('DRY & TEST', 'clear; 27/3 test')]
    for i, (h, sub) in enumerate(steps):
        x0, y0 = 8 + (i % 4) * 109, 30 + (i // 4) * 132
        f.r(x0, y0, 102, 124, 'dg-panel', 8); f.num(x0 + 14, y0 + 14, i + 1)
        f.t(x0 + 51, y0 + 104, h, 'dg-tb dg-tb-sm', 'mid'); f.t(x0 + 51, y0 + 117, sub, 'dg-ts', 'mid')
        cx, cy = x0 + 51, y0 + 56
        oil = ' style="fill:#d4a843;opacity:.85"'
        if i in (0, 1, 4, 5, 6, 7):
            f.p('M%g %g v40 a6 6 0 0 0 6 6 h30 a6 6 0 0 0 6 -6 v-40' % (cx - 21, cy - 24), 'dg-line', extra=' fill="none"')
        if i == 0:
            f.r(cx - 19, cy + 4, 38, 16, '', 2, oil); f.r(cx - 19, cy + 16, 38, 4, '', 0, ' style="fill:#5a3a1a"'); f.p('M%g %g l-10 -14 h40 l-10 14z' % (cx - 10, cy - 26), 'dg-thin', extra=' fill="none"')
        if i == 1:
            f.r(cx - 19, cy - 8, 38, 28, '', 2, oil); f.p('M%g %g q4 4 0 8 M%g %g q4 4 0 8' % (cx - 8, cy + 26, cx + 8, cy + 26), 'dg-red-s', extra=' fill="none"')
        if i == 2:
            f.l(cx, cy - 34, cx, cy - 4, 'dg-line', extra=' stroke-width="4"'); f.p('M%g %g h28 l-4 24 h-20z' % (cx - 14, cy + 4), 'dg-line', extra=' fill="none"')
            f.r(cx - 11, cy + 14, 22, 12, '', 0, ' style="fill:#e86fb0"'); f.c(cx, cy, 2, '', ' style="fill:#bcd"')
        if i == 3:
            f.p('M%g %g h24 v34 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4z' % (cx - 12, cy - 18), 'dg-line', extra=' fill="none"'); f.r(cx - 6, cy - 26, 12, 8, 'dg-key', 1)
            f.r(cx - 10, cy, 20, 20, '', 2, ' style="fill:#8fb4d8;opacity:.7"'); f.t(cx + 30, cy - 10, '☠', 'dg-tb', 'mid', ' style="fill:#e06a6a"')
        if i == 4:
            f.r(cx - 19, cy - 8, 38, 28, '', 2, oil); f.p('M%g %g a8 8 0 1 1 8 8' % (cx - 4, cy + 2), 'dg-key-s', True, ' fill="none"'); f.t(cx + 30, cy - 18, '55°', 'dg-ts', 'mid')
        if i == 5:
            f.r(cx - 19, cy - 8, 38, 16, '', 2, oil); f.r(cx - 19, cy + 8, 38, 12, '', 0, ' style="fill:#5a3a1a"')
            f.t(cx, cy + 4, 'fuel', 'dg-ts', 'mid', ' style="fill:#222;font-size:8.5px"'); f.t(cx, cy + 17, 'glycerine', 'dg-ts', 'mid', ' style="fill:#eee;font-size:8px"')
        if i == 6:
            f.r(cx - 19, cy - 2, 38, 22, '', 2, oil); [f.c(cx - 12 + k * 8, cy - 16 + (k % 2) * 6, 1.8, 'dg-blue-s') for k in range(4)]; f.r(cx - 19, cy + 16, 38, 4, '', 0, ' style="fill:#dfe9f2"')
        if i == 7:
            f.r(cx - 19, cy - 8, 38, 28, '', 2, ' style="fill:#f0d070;opacity:.9"')
    return figure(f.fid, f.svg('Eight stages of making biodiesel: settle and filter the oil; dry it at 60 degrees; titrate a sample; dissolve lye in methanol in a sealed container; react at 55–60 degrees for 1–2 hours; settle 8–24 hours so glycerine sinks; wash with misted water three times; dry until clear and pass the 27/3 test', 'dg-truecolor'),
        'Stage 4 is the dangerous one: methoxide is absorbed through skin and blinds. Everything else is patient cooking. The calculator below gives the amounts for your batch.')

def titration():
    f = Fig('fig-titration', 444, 230)
    f.t(222, 18, 'TITRATION — HOW MUCH EXTRA LYE THIS OIL NEEDS', 'dg-th', 'mid')
    f.r(110, 30, 14, 110, 'dg-white', 3); f.r(112, 70, 10, 68, '', 0, ' style="fill:#bcd6ee"'); f.t(130, 46, 'syringe or burette:', 'dg-ts'); f.t(130, 58, '1 g lye per litre of water', 'dg-ts')
    for k in range(9): f.l(110, 40 + k * 12, 104, 40 + k * 12, 'dg-thin')
    f.p('M117 140 v14', 'dg-line'); f.c(117, 160, 2.5, '', ' style="fill:#bcd6ee"')
    f.p('M86 168 h62 l-6 46 h-50z', 'dg-line', extra=' fill="none"'); f.r(90, 184, 54, 28, '', 0, ' style="fill:#e86fb0;opacity:.85"')
    f.t(160, 182, '1 mL oil + 10 mL isopropyl alcohol', 'dg-ts'); f.t(160, 196, '+ 2 drops phenolphthalein', 'dg-ts')
    f.t(160, 214, 'drip, swirl… stays pink 10 s = done', 'dg-tb dg-tb-sm')
    f.r(300, 40, 130, 108, 'dg-panel', 8); f.t(365, 58, 'mL used =', 'dg-tb dg-tb-sm', 'mid'); f.t(365, 74, 'extra grams of lye', 'dg-ts', 'mid'); f.t(365, 86, 'per litre of oil', 'dg-ts', 'mid')
    f.t(365, 108, 'fresh oil ≈ 1 mL', 'dg-ts', 'mid'); f.t(365, 122, 'used oil 2–4 mL', 'dg-ts', 'mid'); f.t(365, 136, 'over 6: poor oil', 'dg-ts', 'mid')
    return figure(f.fid, f.svg('Titration: drip a 1 gram per litre lye solution from a syringe into 1 mL of oil mixed with 10 mL isopropyl alcohol and phenolphthalein until it stays pink for 10 seconds; the millilitres used equal the extra grams of lye per litre of oil', 'dg-truecolor'),
        'Use distilled or rain water and the same lye you will react with. Turmeric works as an improvised indicator (yellow → red) if you have no phenolphthalein, but it’s harder to read.')

def svo():
    f = Fig('fig-svo', 444, 250)
    f.t(222, 18, 'TWO-TANK VEG-OIL CONVERSION', 'dg-th', 'mid')
    f.r(20, 50, 100, 56, 'dg-key', 6); f.t(70, 82, 'diesel tank', 'dg-tb dg-tb-sm', 'mid'); f.t(70, 44, 'start and stop on this', 'dg-ts', 'mid')
    f.r(20, 150, 100, 56, '', 6, ' style="fill:#d4a843;opacity:.6;stroke:#a88"'); f.t(70, 182, 'veg-oil tank', 'dg-tb dg-tb-sm', 'mid')
    f.p('M30 196 q10 -20 20 0 t20 0 t20 0', 'dg-red-s', extra=' fill="none"'); f.t(70, 224, 'heated by engine coolant', 'dg-ts', 'mid')
    f.p('M120 78 H190 V118', 'dg-line', extra=' fill="none"'); f.p('M120 178 H190 V138', 'dg-line', extra=' fill="none"')
    f.c(190, 128, 12, 'dg-panel'); f.t(180, 108, '3-way valve', 'dg-ts', 'end')
    f.p('M202 128 H236', 'dg-line'); f.r(236, 116, 44, 24, 'dg-panel', 4); f.t(258, 154, 'heated filter', 'dg-ts', 'mid'); f.t(258, 166, '10 µm', 'dg-ts', 'mid')
    f.p('M280 128 H320', 'dg-line', True); f.r(320, 106, 104, 44, 'dg-key', 6); f.t(372, 126, 'injection pump', 'dg-tb dg-tb-sm', 'mid'); f.t(372, 140, '(old IDI diesel)', 'dg-ts', 'mid')
    f.p('M372 150 V226 H190 V140', 'dg-guide', True, ' fill="none"'); f.t(280, 240, 'return line to the same tank you’re drawing from', 'dg-ts', 'mid')
    f.t(372, 82, 'switch to oil when', 'dg-ts', 'mid'); f.t(372, 94, 'coolant is hot (~70 °C)', 'dg-ts', 'mid')
    return figure(f.fid, f.svg('Two-tank veg-oil system: a diesel tank for starting and a coolant-heated veg-oil tank feed a three-way valve, then a heated 10 micron filter and the injection pump of an old indirect-injection diesel; the return line goes back to whichever tank is in use'),
        'Purge back to diesel for the last 5 minutes before stopping, so the engine starts cold on diesel. Modern common-rail engines must not run on veg oil at all.')

def ethanol_chain():
    f = Fig('fig-ethchain', 444, 250)
    f.t(222, 18, 'FUEL ETHANOL — FROM CROP TO TANK', 'dg-th', 'mid')
    st = [('FEEDSTOCK', ['grain, potatoes', 'fruit, beet']), ('MASH', ['cook, then', 'malt ~65 °C']), ('FERMENT', ['yeast 3–7 days', '→ about 10%']), ('DISTIL', ['to 90–95%', 'cut foreshots']), ('DRY', ['3A sieve', 'for blending'])]
    for i, (h, rows) in enumerate(st):
        x0 = 8 + i * 87
        f.r(x0, 34, 80, 74, 'dg-panel', 8); f.t(x0 + 40, 54, h, 'dg-tb dg-tb-sm', 'mid'); f.lines(x0 + 40, 74, rows, 'dg-ts', 'mid', 12)
        if i < 4: f.l(x0 + 80, 71, x0 + 87, 71, 'dg-thin', True)
    f.t(222, 134, 'ROUGH YIELDS OF ~95% ETHANOL', 'dg-tb dg-tb-sm', 'mid')
    yl = [('sugar', 0.55), ('wheat / maize', 0.38), ('potatoes', 0.10), ('sugar beet', 0.09), ('apples', 0.05)]
    for i, (n, v) in enumerate(yl):
        y = 146 + i * 18; f.t(130, y + 11, n, 'dg-ts', 'end'); f.r(136, y, v / 0.6 * 250, 13, 'dg-green', 3); f.t(140 + v / 0.6 * 250, y + 11, '%.2f L per kg' % v, 'dg-ts')
    f.t(222, 246, '1 litre of ethanol does the work of about ⅔ litre of petrol.', 'dg-ts', 'mid')
    return figure(f.fid, f.svg('Fuel ethanol chain: feedstock, mash (cook then malt at about 65 degrees), ferment for 3 to 7 days to about 10 percent, distil to 90–95 percent, and dry with a molecular sieve if blending; yields per kilogram: sugar about 0.55 litres, grain about 0.38, potatoes and sugar beet about 0.1, apples about 0.05'),
        'Grain and sugar give the most fuel for the least handling; potatoes and fruit need a lot of mash for little spirit (and fruit makes more methanol). Yields are practical, not theoretical.')

def energy_chart():
    rows = [('Diesel', 38.6), ('Kerosene', 37), ('Petrol', 34.2), ('Veg oil', 34), ('Biodiesel', 33), ('Ethanol', 21.2), ('Methanol', 15.8)]
    f = Fig('fig-fuelenergy', 444, 40 + len(rows) * 24 + 30)
    f.t(222, 18, 'ENERGY IN A LITRE (MJ)', 'dg-th', 'mid')
    X0, X1 = 100, 400
    for i, (n, v) in enumerate(rows):
        y = 32 + i * 24; f.t(X0 - 8, y + 13, n, 'dg-ts', 'end'); f.r(X0, y + 2, v / 40 * (X1 - X0), 15, 'dg-green' if n in ('Veg oil', 'Biodiesel', 'Ethanol') else 'dg-key', 3)
        f.t(X0 + v / 40 * (X1 - X0) + 6, y + 14, '%g' % v, 'dg-ts')
    f.t(222, 40 + len(rows) * 24 + 22, 'Green = can be made locally. A litre of ethanol goes about 60% as far as petrol.', 'dg-ts', 'mid')
    return figure(f.fid, f.svg('Energy per litre: diesel 38.6 MJ, kerosene 37, petrol 34.2, vegetable oil 34, biodiesel 33, ethanol 21.2, methanol 15.8'),
        'Gases are far thinner: a cubic metre of biogas holds about 22 MJ (two-thirds of a litre of petrol), and of wood gas about 5 MJ — which is why gas engines lose power.')

# ───────────────────────────────────────────────────────────── page
def build():
    sal = open(os.path.join(ROOT, 'sections', 'salvage.html'), encoding='utf-8').read()
    fuelp = os.path.join(ROOT, 'sections', 'fuel.html')
    first = not os.path.exists(fuelp)
    if first:
        i = sal.index('  <h2 id="fuel-overview">'); j = sal.index('  <div class="callout callout-tip">', i)
        moved = sal[i:j]
        def sec(idd):
            a = moved.index('<h2 id="%s">' % idd); b = moved.find('<h2 id=', a + 5)
            return moved[a:b if b > 0 else len(moved)]
        def renum(h, n, title=None):
            h = re.sub(r'(<h2 id="[^"]+">)\d+\. ', r'\g<1>%d. ' % n, h, count=1)
            if title: h = re.sub(r'(<h2 id="[^"]+">)\d+\. [^<]*', r'\g<1>%d. %s' % (n, title), h, count=1)
            return re.sub(r'§1([0-5])', lambda m: '§%d' % {'0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 9}[m.group(1)], h)
        ov = renum(sec('fuel-overview'), 1, 'Which Fuel for Which Engine').replace('id="fuel-overview"', 'id="which-fuel"')
        ov = ov.replace('<p>Start with the truth:', '<!--FIG fig-fuelmap-->\n  <p>Start with the truth:', 1)
        bd = renum(sec('biodiesel'), 2)
        bd = bd.replace('  <div class="process-steps">', '  <!--FIG fig-bdflow-->\n  <div class="process-steps">', 1)
        k = bd.index('<p><strong>Using it:</strong>')
        bd = bd[:k] + '<!--FIG fig-titration-->\n  <div class="calc no-print" data-calc="biodiesel"></div>\n\n  <h3>A processor from an old water heater</h3>\n  <!--FIG fig-biodiesel-fuel-->\n  ' + bd[k:]
        sv = renum(sec('svo'), 3).replace("it coke's injectors", 'it cokes injectors') + '  <!--FIG fig-svo-->\n\n'
        et = renum(sec('ethanol'), 4)
        et = et.replace('  <ul>\n    <li><strong>The chain:', '  <!--FIG fig-ethchain-->\n  <ul>\n    <li><strong>The chain:', 1) + '  <!--FIG fig-potstill-fuel-->\n\n'
        wg = renum(sec('woodgas'), 5).replace('The full build is covered in <a href="energy.html#gasification">Energy §5</a>', 'The zones and parts are drawn below; more in <a href="energy.html#gasification">Energy §5</a>') + '  <!--FIG fig-gasifier-fuel-->\n\n'
        st = renum(sec('storage'), 9)
        bg = '''  <h2 id="biogas">6. Biogas</h2>
  <p>A sealed tank of manure and water makes a gas that is 50–70% methane — about 22&nbsp;MJ per cubic metre, two-thirds of a litre of petrol. It is best used where it is made: one cooking burner takes about 0.35–0.45&nbsp;m³ an hour, roughly what one cow’s daily dung gives.</p>
  <ul>
    <li><strong>Engines:</strong> a petrol engine runs on biogas through a simple gas mixer at the air intake; a diesel can dual-fuel with a little diesel as the pilot. Expect less power.</li>
    <li><strong>Scrub it first:</strong> hydrogen sulphide (rotten eggs) corrodes engines and is toxic — pass the gas through rusty steel wool or iron filings. A water trap at the lowest point removes condensate.</li>
    <li><strong>Storage is the problem:</strong> biogas can’t practically be bottled at home; store it at low pressure in a floating drum or gas bag and use it daily.</li>
  </ul>
  <p>Building the digester: <a href="build-power.html#biogas">Power Generation</a> and <a href="energy.html#biogas">Energy</a>.</p>
  <!--FIG fig-biogas-fuel-->

'''
        ch = '''  <h2 id="wood">7. Dry Wood and Charcoal</h2>
  <p>Wood is the fuel everyone can make — if it is dry. Fresh-cut wood is about half water; burning it spends much of its heat boiling that water off, makes tar and smoke, and clogs chimneys. Split it, stack it off the ground under a roof with the sides open, and give it 6–12 months (hardwood) before burning. Below 20% moisture it hisses no more and the ends show cracks.</p>
  <ul>
    <li><strong>Charcoal</strong> is wood with the water and tar baked out: it burns hot and nearly smokeless, which is why forges, gasifiers and indoor braziers (with ventilation — it makes carbon monoxide) use it. A retort turns about a quarter of the wood’s weight into charcoal, and burns the gas it gives off as its own fuel.</li>
    <li><strong>Hardwood vs softwood:</strong> by weight they give much the same heat; by volume hardwood lasts about twice as long in the stove.</li>
  </ul>
  <!--FIG fig-retort-fuel-->

  <h2 id="energy">8. How Far a Litre Goes</h2>
  <!--FIG fig-fuelenergy-->

'''
        body = ov + bd + sv + et + wg + bg + ch + st
        head = sal[:sal.index('<div class="content-wrapper">')]
        head = head.replace('Salvage, Rebuild &amp; Fuel — The Last Light Survival Guide', 'Making Fuel — The Last Light Survival Guide').replace('<span class="page-title">Salvage, Rebuild &amp; Fuel</span>', '<span class="page-title">Making Fuel</span>')
        head = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Making fuel when the pumps are dry: which fuels suit which engines, biodiesel from used cooking oil (with a batch calculator), straight veg oil, fuel ethanol, wood gas, biogas, dry wood and charcoal, and keeping fuel usable.">', head)
        h1 = re.search(r'(<h1[^>]*>)(<svg.*?</svg>)', sal).group(0)
        icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:1.4rem;height:1.4rem;flex-shrink:0;color:var(--amber)"><path d="M4 7h11l3 3v10H4z"/><path d="M7 7V4h5"/><path d="M8 13l5 4M13 13l-5 4"/><path d="M20 12c-1 2-1 3 0 3s1-1 0-3z"/></svg>'
        top = '''<div class="content-wrapper">

  <div class="section-header">
    <h1 style="display:flex;align-items:center;gap:.5rem">%s Making Fuel</h1>
    <p class="section-desc">When the pumps run dry, engines still run — on the right substitute. This section is honest about what you can and can’t make: biodiesel from used cooking oil, straight veg oil in old diesels, fuel ethanol from grain or sugar, wood gas, biogas, and the oldest fuels of all, dry wood and charcoal.</p>
    <div class="section-meta">
      <span class="meta-item">📅 Updated: <span data-updated="2026-11"></span></span>
      <span class="meta-item">⏱️ <span id="reading-time"></span></span>
      <span class="meta-item">
        <span class="badge badge-warning">Intermediate–Advanced</span>
        <span class="badge badge-info" style="margin-left:.3rem">All Zones</span>
      </span>
    </div>
  </div>

  <nav class="toc" aria-label="Page contents">
    <div class="toc-title">Contents</div>
    <ol>
      <li><a href="#which-fuel">Which Fuel for Which Engine</a></li>
      <li><a href="#biodiesel">Biodiesel from Waste Vegetable Oil</a></li>
      <li><a href="#svo">Running Diesels on Straight Vegetable Oil</a></li>
      <li><a href="#ethanol">Alcohol Fuel (Ethanol)</a></li>
      <li><a href="#woodgas">Wood Gas for Engines</a></li>
      <li><a href="#biogas">Biogas</a></li>
      <li><a href="#wood">Dry Wood and Charcoal</a></li>
      <li><a href="#energy">How Far a Litre Goes</a></li>
      <li><a href="#storage">Fuel Storage, Stabilising &amp; Rotation</a></li>
    </ol>
  </nav>

  <div class="callout callout-info">
    <span class="callout-icon">📚</span>
    <div class="callout-content">
      <strong>Bundled references for this section</strong>
      <p>Three books in the <a href="../pdfs/index.html">PDF library</a> back this page and are indexed for Bunker Bot: the FEMA <em>Simplified Wood Gas Generator</em> plans, the NREL <em>Biodiesel Handling &amp; Use Guide</em>, and <em>Fuel from Farms</em> (small-scale ethanol, US DOE).</p>
    </div>
  </div>

''' % icon
        tail = '''  <div class="callout callout-tip">
    <span class="callout-icon">🔗</span>
    <div class="callout-content">
      <strong>Related sections</strong>
      <p><a href="salvage.html">Salvage &amp; Rebuild</a> (generators, batteries) · <a href="vehicles.html">Vehicles</a> (engines, gasifier vehicles) · <a href="energy.html">Energy</a> (fuel storage safety, stoves) · <a href="build-power.html">Power Generation</a> (biogas digester) · <a href="chemistry.html">Chemistry</a> (lye, distillation, charcoal)</p>
    </div>
  </div>

  <nav class="section-pagination no-print" aria-label="Section navigation">
    <a href="salvage.html" class="pagination-btn pagination-prev">← Salvage &amp; Rebuild</a>
    <a href="../index.html" class="pagination-btn pagination-home">⚡ Home</a>
    <a href="build-power.html" class="pagination-btn pagination-next">Power Generation →</a>
  </nav>
</div>
</main>

<script src="../assets/js/shared-progress.js"></script>
<script src="../assets/js/app.js"></script>
</body>
</html>
'''
        open(fuelp, 'w', encoding='utf-8').write(head + top + body + tail)
        # Salvage: leave a pointer where the fuel sections were
        pointer = '''  <h2 id="fuel-overview">10. Making Fuel</h2>
  <div class="callout callout-amber">
    <span class="callout-icon">⛽</span>
    <div class="callout-content">
      <strong>Fuel now has its own page</strong>
      <p>Biodiesel (with a batch calculator), straight veg oil, ethanol, wood gas, biogas, charcoal and fuel storage are all in <a href="fuel.html">Making Fuel</a>, with diagrams for each.</p>
    </div>
  </div>

'''
        sal = sal[:i] + pointer + sal[j:]
        sal = re.sub(r'      <li><a href="#fuel-overview">.*?<li><a href="#storage">[^\n]*\n', '      <li><a href="#fuel-overview">Making Fuel (moved)</a></li>\n', sal, flags=re.S)
        sal = sal.replace('Salvage, Rebuild &amp; Fuel', 'Salvage &amp; Rebuild')
        sal = sal.replace('and make biodiesel, ethanol and wood gas.', 'and where to find the fuel-making guide.')
        sal = sal.replace(', and making the fuels you can actually make — and being honest about the ones you can\'t.', '. Making fuel has its own page.')
        sal = sal.replace('<a href="build-power.html" class="pagination-btn pagination-next">Power Generation →</a>', '<a href="fuel.html" class="pagination-btn pagination-next">Making Fuel →</a>')
        open(os.path.join(ROOT, 'sections', 'salvage.html'), 'w', encoding='utf-8').write(sal)
    # (re)draw figures
    s = open(fuelp, encoding='utf-8').read()
    PAGES['fuel'] = s
    figs = {'fig-fuelmap': fuelmap(), 'fig-bdflow': bd_flow(), 'fig-titration': titration(), 'fig-svo': svo(), 'fig-ethchain': ethanol_chain(), 'fig-fuelenergy': energy_chart(),
            'fig-biodiesel-fuel': copy_fig('vehicles', 'fig-biodiesel', 'fig-biodiesel-fuel'), 'fig-potstill-fuel': copy_fig('chemistry', 'fig-potstill', 'fig-potstill-fuel'),
            'fig-gasifier-fuel': copy_fig('vehicles', 'fig-gasifier', 'fig-gasifier-fuel'), 'fig-biogas-fuel': copy_fig('build-power', 'fig-biogas', 'fig-biogas-fuel'),
            'fig-retort-fuel': copy_fig('chemistry', 'fig-retort', 'fig-retort-fuel')}
    s = PAGES['fuel']
    for fid, html in figs.items():
        s = re.sub(r'[ \t]*<figure class="dg[^"]*" id="%s">.*?</figure>\n' % re.escape(fid), '', s, flags=re.S)
        mark = '<!--FIG %s-->' % fid
        assert mark in s, fid
        s = s.replace(mark, mark + '\n  ' + html.rstrip('\n'), 1)
    open(fuelp, 'w', encoding='utf-8').write(s)
    print('fuel page', 'created' if first else 'figures redrawn')

if __name__ == '__main__':
    build()
