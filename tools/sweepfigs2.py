#!/usr/bin/env python3
"""Second batch of sweep figures (November 2026), and the clean-up of ASCII-art blocks that a drawn
figure on the same page already shows. Re-runnable:  python3 tools/sweepfigs2.py"""
import os, re, math
import sweepfigs as S
from sweepfigs import Fig, figure, page, place, swap_block, drop, PAGES

def after_para(name, start):
    s = page(name); i = s.index(start); j = s.index('</p>', i) + 4
    return s[i:j] + '\n'
def after_block(name, start, close):
    s = page(name); i = s.index(start); j = s.index(close, i) + len(close)
    return s[i:j] + '\n'
def del_block(name, inside):
    s = page(name)
    for pat in (r'[ \t]*<div class="diagram">(?:(?!</div>).)*?%s.*?</div>\n', r'[ \t]*<pre[^>]*>(?:(?!</pre>).)*?%s.*?</pre>\n'):
        m = re.search(pat % re.escape(inside), s, re.S)
        if m:
            PAGES[name] = s[:m.start()] + s[m.end():]; return True
    return False
def copy_fig(src, src_id, new_id, caption=None):
    s = page(src); i = s.index('<figure class="dg" id="%s">' % src_id); j = s.index('</figure>', i) + 9
    h = s[i:j].replace('id="%s"' % src_id, 'id="%s"' % new_id)
    h = re.sub(r'id="(ah-[^"]+)"', lambda m: 'id="%s-%s"' % (m.group(1), new_id), h)
    h = re.sub(r'url\(#(ah-[^)]+)\)', lambda m: 'url(#%s-%s)' % (m.group(1), new_id), h)
    if caption: h = re.sub(r'<figcaption>.*?</figcaption>', '<figcaption>%s</figcaption>' % caption, h, flags=re.S)
    return h + '\n'

def zones():
    f = Fig('fig-zones', 444, 290)
    f.t(222, 18, 'DEFENSIBLE SPACE AROUND A HOUSE (PLAN)', 'dg-th', 'mid')
    cx, cy = 222, 150
    for r, cls in [(108, 'dg-earth'), (66, 'dg-green'), (30, 'dg-panel')]:
        f.a('<ellipse class="%s" cx="%g" cy="%g" rx="%g" ry="%g" opacity=".55"/>' % (cls, cx, cy, r * 1.9, r))
    f.a('<ellipse class="dg-line" cx="%g" cy="%g" rx="%g" ry="%g" fill="none" stroke-dasharray="4 3"/>' % (cx, cy, 30 * 1.9, 30))
    f.r(cx - 22, cy - 14, 44, 28, 'dg-key', 2); f.t(cx, cy + 4, 'house', 'dg-tb dg-tb-sm', 'mid')
    f.t(cx, 62, 'Zone 2 · 10–30 m: thin trees, lift low branches, short grass', 'dg-ts', 'mid')
    f.t(cx, 104, 'Zone 1 · 1.5–10 m: lean, green, watered; no woodpiles', 'dg-ts', 'mid')
    f.t(cx, 200, 'Zone 0 (dashed) · 0–1.5 m: gravel, stone — nothing that burns', 'dg-ts', 'mid')
    for x, y in [(56, 84), (60, 222), (388, 84), (386, 222)]: f.c(x, y, 9, 'dg-green')
    f.t(222, 282, 'Embers start most house fires: screen vents (≤3 mm mesh), clear gutters and decks.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Plan of defensible space: zone 0 within 1.5 m of the house is gravel and stone; zone 1 to 10 m is lean, green and watered; zone 2 to 30 m has thinned trees, lifted branches and short grass'),
        'Distances are for flat ground; double the outer zone on slopes, where fire runs uphill fast. These rings reduce the chance a house catches; they don’t make it safe to stay when told to go.')
    place('disasters', f.fid, fig, '    <h2>4. Flood</h2>')

def chimney():
    f = Fig('fig-chimney', 444, 220)
    f.t(222, 18, 'CHIMNEY HEIGHT — THE 3-2-10 RULE', 'dg-th', 'mid')
    f.p('M40 196 L190 86 L340 196', 'dg-line', extra=' fill="none"'); f.l(30, 196, 414, 196, 'dg-guide')
    f.r(268, 60, 22, 100, 'dg-earth')                                     # chimney through roof slope
    f.l(268, 143, 268, 143, 'dg-thin')
    f.l(300, 143, 300, 60, 'dg-thin', True); f.l(300, 60, 300, 143, 'dg-thin', True); f.t(306, 106, '≥ 0.9 m (3 ft) above', 'dg-ts'); f.t(306, 118, 'where it leaves the roof', 'dg-ts')
    f.l(190, 86, 279, 86, 'dg-guide'); f.l(279, 86, 279, 60, 'dg-red-s'); f.t(262, 76, '≥ 0.6 m (2 ft) higher', 'dg-ts', 'end')
    f.l(190, 172, 279, 172, 'dg-thin', True); f.l(279, 172, 190, 172, 'dg-thin', True); f.t(234, 186, 'anything within 3 m (10 ft)', 'dg-ts', 'mid')
    f.t(150, 70, 'ridge', 'dg-ts', 'end')
    fig = figure(f.fid, f.svg('A chimney through a pitched roof must rise at least 0.9 m above where it leaves the roof and at least 0.6 m higher than the ridge or anything else within 3 m'),
        'Too short a chimney draws badly, smokes the room and can drop sparks on the roof. Sweep it at least once a year when burning wood daily.')
    s = page('shelter'); i = s.index('<h2>5. Passive Solar Design</h2>')
    place('shelter', f.fid, fig, '    <h2>5. Passive Solar Design</h2>')

def candling():
    f = Fig('fig-candling', 444, 180)
    f.t(222, 18, 'CANDLING EGGS — HOLD TO A BRIGHT TORCH IN THE DARK', 'dg-th', 'mid')
    for i, (h, sub) in enumerate([('DAY 7', 'veins: alive'), ('DAY 14', 'dark mass'), ('DAY 18', 'stop turning'), ('CLEAR', 'infertile: remove')]):
        cx = 58 + i * 110
        f.a('<ellipse cx="%g" cy="96" rx="34" ry="44" style="fill:#f2c26b;stroke:#c9a227"/>' % cx)
        f.p('M%g 62 q34 -6 0 -16 q-34 10 0 16' % cx, '', extra=' style="fill:#ffe9b0"')     # air cell at blunt end (top)
        if i == 0:
            f.c(cx, 100, 4, '', ' style="fill:#7a2a12"')
            for a in range(0, 360, 45): f.p('M%g 100 q%g %g %g %g' % (cx, 10 * math.cos(math.radians(a)), 10 * math.sin(math.radians(a)), 22 * math.cos(math.radians(a + 20)), 22 * math.sin(math.radians(a + 20))), '', extra=' style="fill:none;stroke:#a33a1a;stroke-width:1.2"')
        if i == 1: f.a('<ellipse cx="%g" cy="104" rx="22" ry="26" style="fill:#5a2a14"/>' % cx)
        if i == 2: f.a('<ellipse cx="%g" cy="102" rx="30" ry="36" style="fill:#3a1a0c"/>' % cx); f.p('M%g 58 q34 -2 0 -10 q-34 4 0 10' % cx, '', extra=' style="fill:#ffe9b0"')
        f.t(cx, 156, h, 'dg-tb dg-tb-sm', 'mid'); f.t(cx, 170, sub, 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Candling eggs: on day 7 a spider of blood vessels; on day 14 a dark mass with a growing air cell; on day 18 almost all dark; a clear egg is infertile', 'dg-truecolor'),
        'Remove clear eggs at day 7–10, and any with a blood ring (a red circle, no spider) — the embryo has died. Stop turning at day 18 and raise the humidity for hatching.')
    place('animal', f.fid, fig, '    <h2>3. Goats — Milk &amp; Meat</h2>')

def crosses():
    f = Fig('fig-crosses', 444, 250)
    f.t(222, 18, 'WHICH CROPS CROSS? (SAME SPECIES ONLY)', 'dg-th', 'mid')
    groups = [('Brassica oleracea', ['cabbage', 'kale', 'broccoli', 'cauliflower', 'sprouts', 'kohlrabi']), ('Brassica rapa', ['turnip', 'Chinese cabbage', 'pak choi']),
              ('Cucurbita pepo', ['courgette', 'marrow', 'acorn squash', 'pumpkins (most)']), ('Cucurbita maxima', ['Hubbard', 'kabocha', 'giant pumpkins']),
              ('Cucurbita moschata', ['butternut', 'crookneck']), ('Daucus carota', ['carrot', 'wild carrot!'])]
    for i, (sp, kinds) in enumerate(groups):
        x0, y0 = 10 + (i % 3) * 144, 30 + (i // 3) * 108
        f.r(x0, y0, 136, 100, 'dg-panel', 10); f.t(x0 + 68, y0 + 18, '<tspan class="dg-it">%s</tspan>' % sp, 'dg-tb dg-tb-sm', 'mid')
        f.lines(x0 + 68, y0 + 34, kinds, 'dg-ts', 'mid', 11.5)
    f.t(222, 248, 'Same box: they cross. Different boxes: they don’t.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Crossing groups: cabbage, kale, broccoli, cauliflower, sprouts and kohlrabi all cross; turnip, Chinese cabbage and pak choi cross; three squash species each cross only within themselves; carrots cross with wild carrot'),
        'To keep a variety pure, grow only one variety from each box in flower at a time, or isolate by the distances in the table (or bag and hand-pollinate squash flowers).')
    place('agriculture', f.fid, fig, '    <h3>Seed Storage Protocol</h3>')

def chestnut():
    f = Fig('fig-chestnut', 444, 220)
    f.t(222, 18, 'SWEET CHESTNUT (EAT) vs HORSE CHESTNUT (POISONOUS)', 'dg-th', 'mid')
    for i, (h, good) in enumerate([('SWEET CHESTNUT', 1), ('HORSE CHESTNUT (conker)', 0)]):
        x0 = 10 + i * 216
        f.r(x0, 28, 208, 186, 'dg-okbg' if good else 'dg-badbg', 10); f.t(x0 + 104, 46, h, 'dg-ok' if good else 'dg-bad', 'mid')
        cx = x0 + 56
        if good:
            f.c(cx, 110, 30, 'dg-green');
            for a in range(0, 360, 12): f.l(cx + 30 * math.cos(math.radians(a)), 110 + 30 * math.sin(math.radians(a)), cx + 44 * math.cos(math.radians(a)), 110 + 44 * math.sin(math.radians(a)), 'dg-green-s', extra=' stroke-width="1"')
            f.p('M%g 110 q10 -16 20 0 l-10 16z M%g 110 q10 -16 20 0 l-10 16z' % (cx - 26, cx + 6), '', extra=' style="fill:#8a5a2b;stroke:#5a3a1a"')
            f.p('M%g 150 l70 -4 l-70 -8 q-10 6 0 12z' % (x0 + 116), 'dg-green'); f.t(x0 + 154, 172, 'single leaf,', 'dg-ts', 'mid'); f.t(x0 + 154, 184, 'saw-toothed', 'dg-ts', 'mid')
            f.t(cx, 172, 'dense fine spines', 'dg-ts', 'mid'); f.t(cx, 184, '2–3 flat nuts', 'dg-ts', 'mid'); f.t(cx, 196, 'tufted tip', 'dg-ts', 'mid')
        else:
            f.c(cx, 110, 30, 'dg-green')
            for a in range(0, 360, 40): f.l(cx + 30 * math.cos(math.radians(a)), 110 + 30 * math.sin(math.radians(a)), cx + 38 * math.cos(math.radians(a)), 110 + 38 * math.sin(math.radians(a)), 'dg-green-s', extra=' stroke-width="2"')
            f.c(cx, 110, 15, '', ' style="fill:#7a3a14;stroke:#4a200a"'); f.c(cx - 4, 106, 6, '', ' style="fill:#d9c49a"')
            for k in range(5):
                a = math.radians(-90 + k * 50 - 100)
                f.a('<ellipse class="dg-green" cx="%g" cy="%g" rx="22" ry="7" transform="rotate(%g %g %g)"/>' % (x0 + 150 + 22 * math.cos(a), 120 + 22 * math.sin(a), math.degrees(a), x0 + 150 + 22 * math.cos(a), 120 + 22 * math.sin(a)))
            f.t(x0 + 154, 172, '5–7 leaflets', 'dg-ts', 'mid'); f.t(x0 + 154, 184, 'like a hand', 'dg-ts', 'mid')
            f.t(cx, 172, 'few thick spikes', 'dg-ts', 'mid'); f.t(cx, 184, 'one round nut', 'dg-ts', 'mid'); f.t(cx, 196, 'pale patch', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Sweet chestnut has a husk covered in dense fine spines holding two or three flattened nuts with a pointed tufted tip, and single long saw-toothed leaves; horse chestnut has a husk with a few short thick spikes holding one round shiny nut with a pale patch, and leaves of five to seven leaflets spread like a hand'),
        'Horse chestnuts (conkers) cause vomiting and worse. If the nut is round and smooth all over with no pointed tip, don’t eat it.')
    place('climate', f.fid, fig, '      <p>Mushrooms: see the')

def tick():
    f = Fig('fig-tick', 444, 170)
    f.t(222, 18, 'REMOVING A TICK', 'dg-th', 'mid')
    for i, (h, ok) in enumerate([('YES: grip at the skin, pull up', 1), ('NO: squeeze, twist, burn, smother', 0)]):
        x0 = 10 + i * 216
        f.r(x0, 28, 208, 136, 'dg-okbg' if ok else 'dg-badbg', 10); f.t(x0 + 104, 46, h, 'dg-ok' if ok else 'dg-bad', 'mid')
        f.p('M%g 128 H%g' % (x0 + 20, x0 + 188), 'dg-earth', extra=' stroke-width="0"'); f.r(x0 + 16, 126, 176, 22, 'dg-earth')
        cx = x0 + 104
        f.a('<ellipse cx="%g" cy="108" rx="16" ry="12" style="fill:#4a2a1a;stroke:#2a1a0a"/>' % cx); f.p('M%g 120 v8' % cx, 'dg-line')
        if ok:
            f.p('M%g 124 l-34 -60 M%g 124 l34 -60' % (cx - 3, cx + 3), 'dg-line', extra=' fill="none" stroke-width="3"'); f.l(cx, 92, cx, 62, 'dg-key-s', True)
            f.t(cx, 158, 'fine tweezers, steady pull', 'dg-ts', 'mid')
        else:
            f.p('M%g 106 l-40 -30 M%g 106 l40 -30' % (cx - 16, cx + 16), 'dg-red-s', extra=' fill="none"'); f.p('M%g 74 a20 10 0 1 1 30 0' % (cx - 15), 'dg-red-s', True, ' fill="none"')
            f.t(cx, 158, 'pushes infected fluid into you', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Remove a tick by gripping it right at the skin with fine tweezers and pulling straight up steadily; do not squeeze its body, twist, burn or smother it'),
        'Then wash the bite and note the date. A spreading red ring over the next month (often a “bull’s-eye”), or flu-like illness, needs antibiotics — doxycycline for adults.')
    place('climate', f.fid, fig, '    <h3>UK Emergency Contacts &amp; Frequencies</h3>')

def sparks():
    f = Fig('fig-sparks', 444, 210)
    f.t(222, 18, 'SPARK TEST — WHAT THE STREAM LOOKS LIKE', 'dg-th', 'mid')
    kinds = [('MILD STEEL', 'long, few forks', 0, '#ffcf6b', 120), ('HIGH CARBON', 'short, bursting', 6, '#fff6d0', 80), ('CAST IRON', 'short, dull red', 1, '#e07a3a', 50), ('STAINLESS', 'few, orange', 0, '#f0a050', 40)]
    for i, (h, sub, bursts, col, ln) in enumerate(kinds):
        x0 = 10 + i * 108
        f.r(x0, 28, 100, 176, 'dg-panel', 8); f.t(x0 + 50, 46, h, 'dg-tb dg-tb-sm', 'mid')
        ox, oy = x0 + 14, 170
        for k in range(9):
            a = math.radians(-58 + k * 4 + (k % 3) * 2)
            L = ln * (0.6 + 0.4 * ((k * 37) % 10) / 10)
            ex, ey = ox + L * math.cos(a), oy + L * math.sin(a)
            f.l(ox, oy, ex, ey, '', extra=' style="stroke:%s;stroke-width:1.2"' % col)
            for b in range(bursts if k % 2 == 0 else 0):
                ba = a + math.radians(-60 + b * 24)
                f.l(ex, ey, ex + 7 * math.cos(ba), ey + 7 * math.sin(ba), '', extra=' style="stroke:%s;stroke-width:1"' % col)
        f.c(ox, oy, 6, 'dg-white'); f.t(x0 + 50, 192, sub, 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Spark streams from a grinding wheel: mild steel gives long straight sparks with few forks; high-carbon steel short sparks with many bursting stars; cast iron short dull red sparks; stainless a few short orange ones', 'dg-truecolor'),
        'Test in dim light against a known piece of each if you can. More carbon = shorter, brighter, more bursts. High-carbon is what hardens for blades and chisels.')
    place('metallurgy', f.fid, fig, '    <h3>Other Identification Tests</h3>')

def sandcast():
    f = Fig('fig-sandcast', 444, 230)
    f.t(222, 18, 'SAND MOULD — COPE AND DRAG', 'dg-th', 'mid')
    f.r(60, 40, 324, 74, 'dg-wood'); f.r(60, 114, 324, 74, 'dg-wood')
    f.r(70, 46, 304, 64, 'dg-earth'); f.r(70, 118, 304, 64, 'dg-earth')
    f.l(50, 114, 394, 114, 'dg-red-s', extra=' stroke-dasharray="6 4"'); f.t(392, 108, 'parting line', 'dg-ts', 'end')
    f.p('M170 114 h104 a14 14 0 0 1 0 28 h-104 a14 14 0 0 1 0 -28z', 'dg-panel'); f.t(222, 132, 'cavity (pattern removed)', 'dg-ts', 'mid')
    f.r(100, 40, 14, 74, 'dg-panel'); f.r(100, 114, 70, 10, 'dg-panel'); f.t(96, 34, 'pour here (sprue)', 'dg-ts', 'end')
    f.p('M100 24 h14 l-4 16 h-6z', 'dg-key'); f.l(107, 22, 107, 40, 'dg-red-s', True)
    f.r(304, 40, 14, 74, 'dg-panel'); f.t(311, 34, 'riser', 'dg-ts', 'mid')
    f.t(30, 80, 'cope', 'dg-tb dg-tb-sm'); f.t(30, 154, 'drag', 'dg-tb dg-tb-sm'); f.t(140, 200, 'runner feeds the cavity from below', 'dg-ts', 'mid')
    f.t(222, 222, 'All sand dry-ish and the mould vented — moisture + molten metal = steam explosion.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('A two-part sand mould: the cope on top and the drag below meet at the parting line around the cavity left by the pattern; metal is poured down the sprue, along a runner into the cavity, and rises into a riser that feeds shrinkage'),
        'Ram the sand firmly round the pattern in the drag, dust the joint with dry parting powder (fine dry sand or talc), ram the cope, lift it off, take out the pattern, cut sprue, runner and riser, and close up before pouring.')
    swap_block('metallurgy', f.fid, fig, 'SAND CASTING — CROSS SECTION')

def hydro(fid):
    f = Fig(fid, 444, 240)
    f.t(222, 18, 'MICRO-HYDRO LAYOUT', 'dg-th', 'mid')
    f.p('M10 82 H32', 'dg-blue-s', extra=' stroke-width="6" opacity=".7"'); f.t(10, 66, 'stream', 'dg-ts')
    f.r(30, 72, 40, 22, 'dg-water'); f.t(50, 108, 'intake + screen', 'dg-ts', 'mid')
    f.r(84, 74, 40, 26, 'dg-panel'); f.t(104, 66, 'settling tank', 'dg-ts', 'mid')
    f.p('M124 88 C200 96 260 140 316 186', 'dg-line', extra=' fill="none" stroke-width="5"'); f.t(208, 112, 'penstock pipe — few bends, no air traps', 'dg-ts')
    f.c(336, 192, 18, 'dg-panel'); for_ = None
    for k in range(10): a = math.radians(k * 36); f.c(336 + 16 * math.cos(a), 192 + 16 * math.sin(a), 3.5, 'dg-key')
    f.l(316, 186, 326, 190, 'dg-blue-s'); f.t(314, 232, 'nozzle → Pelton wheel', 'dg-ts', 'end')
    f.r(366, 182, 40, 20, 'dg-key', 4); f.t(410, 178, 'generator', 'dg-ts', 'end')
    f.p('M340 212 q20 10 60 6', 'dg-blue-s', True, ' fill="none"'); f.t(440, 236, 'tailrace', 'dg-ts', 'end')
    f.l(20, 72, 20, 192, 'dg-thin', True); f.l(20, 192, 20, 72, 'dg-thin', True); f.l(14, 192, 318, 192, 'dg-guide')
    f.t(28, 140, 'HEAD', 'dg-tb dg-tb-sm'); f.t(28, 154, '(vertical drop)', 'dg-ts')
    fig = figure(f.fid, f.svg('Micro-hydro: water taken from a screened intake passes through a settling tank into a penstock pipe running downhill to a nozzle that drives a Pelton wheel and generator; the water returns to the stream by a tailrace; the head is the vertical drop from intake to nozzle'),
        'Power ≈ head (m) × flow (L/s) × 5 watts, roughly. The head counts, not the pipe length — but a long, narrow pipe loses much of it to friction.')
    return f, fig

def box_cooker():
    f = Fig('fig-boxcooker', 444, 220)
    f.t(222, 18, 'SOLAR BOX COOKER — CROSS-SECTION', 'dg-th', 'mid')
    f.r(90, 100, 264, 100, 'dg-wood'); f.r(112, 112, 220, 84, '', 0, ' style="fill:#2a2a24;stroke:#888"')
    f.r(116, 116, 212, 76, '', 0, ' style="fill:#c9ced4"'); f.t(222, 130, 'foil-lined inner box', 'dg-ts', 'mid', ' style="fill:#223"')
    f.r(186, 150, 72, 40, '', 6, ' style="fill:#111;stroke:#555"'); f.t(222, 174, 'black pot', 'dg-ts', 'mid')
    f.l(96, 100, 348, 100, 'dg-blue-s', extra=' stroke-width="3"'); f.t(86, 98, 'glass / clear lid', 'dg-ts', 'end')
    f.p('M348 100 L410 36', 'dg-line', extra=' stroke-width="4"'); f.t(396, 30, 'reflector', 'dg-ts', 'end')
    for k in range(3): f.l(150 + k * 50, 30, 210 + k * 40, 96, 'dg-key-s', True)
    f.p('M380 52 L300 140', 'dg-key-s', True)
    f.t(100, 214, 'insulation (paper, straw, wool) between the boxes', 'dg-ts')
    f.l(100, 204, 100, 190, 'dg-thin')
    fig = figure(f.fid, f.svg('Solar box cooker: an inner foil-lined box sits inside an outer box with insulation between, a black pot inside, a clear glass lid on top, and a foil reflector flap angled to throw more sun in'),
        'Reaches about 120–150 °C in full sun — enough to cook slowly and to pasteurise water. Turn it to face the sun every half hour or so.')
    swap_block('energy', f.fid, fig, 'Reflective flap')

def drawbore():
    f = Fig('fig-drawbore', 444, 200)
    f.t(222, 18, 'MORTISE & TENON, DRAWBORED', 'dg-th', 'mid')
    f.r(40, 40, 70, 150, 'dg-wood'); f.r(70, 90, 40, 50, 'dg-panel'); f.t(75, 34, 'post with mortise', 'dg-ts', 'mid')
    f.r(110, 92, 200, 46, 'dg-wood'); f.r(72, 94, 40, 42, 'dg-wood'); f.t(220, 160, 'beam with tenon', 'dg-ts', 'mid')
    f.c(90, 115, 6, 'dg-line', ' fill="none"'); f.t(52, 210 - 14, '', 'dg-ts')
    f.c(86, 115, 5, 'dg-red', ''); f.l(90, 60, 90, 109, 'dg-thin'); f.t(98, 58, 'hole in the post', 'dg-ts')
    f.l(86, 150, 86, 120, 'dg-thin', True); f.t(96, 178, 'hole in the tenon set 2 mm closer to the shoulder', 'dg-ts')
    f.p('M330 115 h60', 'dg-key-s', True); f.t(340, 104, 'the peg pulls the', 'dg-ts'); f.t(340, 130, 'shoulder tight', 'dg-ts')
    f.l(110, 90, 110, 140, 'dg-red-s')
    fig = figure(f.fid, f.svg('A drawbored mortise and tenon: the hole through the tenon is offset about 2 mm towards the shoulder from the hole in the post, so driving a tapered oak peg through pulls the joint tight'),
        'Mark the tenon’s hole through the post’s hole, take the joint apart, and drill the tenon a hair closer to its shoulder. A tapered, riven-oak peg then drags the joint shut and keeps it shut as the timber dries.')
    swap_block('build-structures', f.fid, fig, 'MORTISE &amp; TENON')
    sh = copy_fig('build-structures', f.fid, 'fig-drawbore-sh')
    drop('shelter', 'fig-drawbore-sh')
    s = page('shelter')
    if '<!--fig-drawbore-sh-->' in s:
        PAGES['shelter'] = s.replace('<!--fig-drawbore-sh-->', '<!--fig-drawbore-sh-->\n    ' + sh, 1)
    else:
        m = re.search(r'[ \t]*<div class="diagram">(?:(?!</div>).)*?TENON \(the tongue\).*?</div>\n', s, re.S)
        PAGES['shelter'] = s[:m.start()] + '    <!--fig-drawbore-sh-->\n    ' + sh + s[m.end():]

def mirror():
    f = Fig('fig-mirror', 444, 190)
    f.t(222, 18, 'AIMING A SIGNAL MIRROR', 'dg-th', 'mid')
    f.c(40, 40, 14, '', ' style="fill:#ffd25a"'); f.t(40, 70, 'sun', 'dg-ts', 'mid')
    f.r(120, 90, 30, 40, 'dg-white', 3); f.t(135, 148, 'mirror', 'dg-ts', 'mid')
    f.p('M150 104 l30 -4 v34 l-30 -4', 'dg-line', extra=' fill="none"'); f.t(160, 160, 'eye behind it', 'dg-ts')
    f.p('M220 92 l12 22 M232 114 l12 -22', 'dg-line', extra=' stroke-width="3"'); f.t(232, 140, 'V of two fingers', 'dg-ts', 'mid')
    f.c(232, 104, 4, '', ' style="fill:#ffd25a"')
    f.l(52, 46, 128, 98, 'dg-key-s', True); f.l(150, 106, 228, 104, 'dg-key-s', True); f.l(240, 100, 410, 54, 'dg-key-s', True)
    f.p('M396 46 l20 -6 l4 6 l-20 6z', 'dg-line'); f.t(436, 80, 'aircraft / target', 'dg-ts', 'end')
    f.t(222, 182, 'Tilt until the bright spot sits on your fingers, then rock it gently across the target.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Aiming a signal mirror: hold a V of two fingers out towards the target, tilt the mirror until the reflected sun spot lands on the fingers, and the flash then reaches the target beyond'),
        'A flash can be seen 15–50 km away. Sweep the horizon even when you can’t see anyone — searchers may see you first. Don’t dazzle a pilot on final approach.')
    place('communications', f.fid, fig, '    <h3>Ground-to-Air Signals</h3>')

def cr_box():
    f = Fig('fig-crbox', 444, 210)
    f.t(222, 18, 'BOX-FAN AIR CLEANER (CORSI–ROSENTHAL CUBE)', 'dg-th', 'mid')
    x0, y0, w = 150, 70, 130
    f.p('M%g %g h%g l30 -24 h-%g z' % (x0, y0, w, w), 'dg-panel')
    f.r(x0, y0, w, 110, 'dg-white', 0, ' style="fill:#e8e2c8"'); f.p('M%g %g l30 -24 v110 l-30 24z' % (x0 + w, y0), '', extra=' style="fill:#c9c3a8;stroke:#888"')
    for k in range(1, 10): f.l(x0 + k * 13, y0 + 4, x0 + k * 13, y0 + 106, '', extra=' style="stroke:#b3ab88"')
    f.c(x0 + 80, y0 - 12, 30, '', ' style="fill:#333;stroke:#888;transform:scale(1,.35);transform-box:fill-box;transform-origin:center"')
    f.t(x0 + 96, 36, 'box fan on top, blowing up', 'dg-ts'); f.l(x0 + 80, y0 - 34, x0 + 80, 26, 'dg-key-s', True)
    for y in (100, 140):
        f.l(60, y, 140, y, 'dg-blue-s', True); f.l(390, y, 320, y, 'dg-blue-s', True)
    f.t(60, 92, 'dirty air in', 'dg-ts'); f.t(350, 196, '4 MERV-13 filters taped into a cube,', 'dg-ts', 'end'); f.t(350, 208 - 2, 'arrows pointing inward; card on the bottom', 'dg-ts', 'end')
    fig = figure(f.fid, f.svg('A Corsi-Rosenthal cube: four furnace filters taped into a cube with a cardboard base and a box fan on top blowing upward, so room air is pulled in through all four filters'),
        'Clears wildfire smoke and dust from a room far faster than a single filter. The filter arrows show airflow: they must point into the cube, towards the fan.')
    s = page('projects'); i = s.index('<strong>Box-fan filter'); j = s.index('</div>\n    </div>', i) + len('</div>\n    </div>')
    place('projects', f.fid, fig, s[i - 0:j][:0] + s[s.rindex('<div class="callout callout-tip">', 0, i):j] + '\n', before=False)

def media():
    rows = [('Archival paper', 200, 500), ('M-DISC (claimed)', 100, 1000), ('Gold DVD-R', 50, 100), ('Ordinary DVD-R', 10, 25), ('HDD, spun up yearly', 5, 10), ('USB stick', 5, 10), ('SSD, unpowered', 1, 5)]
    f = Fig('fig-media', 444, 40 + len(rows) * 24 + 34)
    f.t(222, 18, 'HOW LONG STORED DATA LASTS (YEARS, LOG SCALE)', 'dg-th', 'mid')
    X0, X1 = 150, 424
    sx = lambda v: X0 + math.log10(v) / 3 * (X1 - X0)
    for k in (1, 10, 100, 1000): f.l(sx(k), 30, sx(k), 34 + len(rows) * 24, 'dg-guide'); f.t(sx(k), 48 + len(rows) * 24, str(k), 'dg-ts', 'mid')
    for i, (n, a, b) in enumerate(rows):
        y = 34 + i * 24; f.t(X0 - 8, y + 13, n, 'dg-ts', 'end'); f.r(sx(a), y + 3, max(4, sx(b) - sx(a)), 14, 'dg-green' if a >= 50 else 'dg-key', 3)
    f.t(222, 66 + len(rows) * 24, 'Keep two kinds, in two places, and copy everything to fresh media every few years.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Rough storage lifetimes: archival paper centuries; M-DISC claimed up to a thousand years; gold DVD-R 50–100; ordinary DVD-R 10–25; hard drives and USB sticks 5–10; an unpowered SSD 1–5'),
        'Lifetimes assume cool, dry, dark storage. A device you can’t power or read is a dead archive: store a reader (and a way to run it) with the data, and print what matters most.')
    place('knowledge', f.fid, fig, '    <h3>Essential Offline Digital Libraries</h3>')

def still(fid):
    f = Fig(fid, 444, 220)
    f.t(222, 18, 'SIMPLE POT STILL — ALWAYS OPEN AT THE END', 'dg-th', 'mid')
    f.p('M40 120 h120 v70 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10z', 'dg-panel'); f.r(44, 150, 112, 46, 'dg-water'); f.t(100, 214, 'boiler (gentle heat)', 'dg-ts', 'mid')
    f.p('M60 120 q40 -28 80 0', 'dg-line', extra=' fill="none"'); f.t(100, 98, 'lid, sealed with flour paste', 'dg-ts', 'mid')
    f.p('M100 100 V70 H220 L250 96', 'dg-line', extra=' fill="none" stroke-width="4"'); f.t(160, 62, 'tube (copper, no lead solder)', 'dg-ts', 'mid')
    f.r(240, 92, 110, 90, 'dg-water', 6); f.t(295, 196, 'cold water bucket', 'dg-ts', 'mid')
    f.p('M250 96 ' + ' '.join('q%g 8 %g 16' % (40 if k % 2 == 0 else -40, 0) for k in range(5)) + ' L366 178', 'dg-line', extra=' fill="none" stroke-width="3"')
    f.l(366, 178, 390, 178, 'dg-line', extra=' stroke-width="3"'); f.r(380, 180, 30, 30, 'dg-white', 3); f.t(395, 174, 'open jar', 'dg-ts', 'mid')
    f.t(290, 44, 'Never sealed: a blocked tube', 'dg-tb dg-tb-sm'); f.t(290, 58, 'on a closed pot can burst it', 'dg-ts')
    return f

def pressure_bandage():
    f = Fig('fig-pib', 444, 190)
    f.t(222, 18, 'PRESSURE IMMOBILISATION — NERVE-POISON SNAKES ONLY', 'dg-th', 'mid')
    f.p('M30 120 C80 100 300 100 370 112 L404 104 L410 136 L372 132 C300 144 80 144 30 136z', 'dg-panel')
    for k in range(16):
        x = 60 + k * 19; f.p('M%g 104 l14 40' % x, 'dg-key-s', extra=' stroke-width="5" opacity=".75"')
    f.c(200, 122, 4, 'dg-redf'); f.t(200, 166, 'bite', 'dg-ts', 'mid'); f.l(200, 158, 200, 128, 'dg-thin')
    f.l(60, 82, 340, 82, 'dg-thin', True); f.t(200, 74, 'start at the fingers or toes, wrap up the whole limb', 'dg-ts', 'mid')
    f.r(30, 150, 380, 6, 'dg-wood', 2); f.t(380, 172, 'splint', 'dg-ts', 'end')
    f.t(222, 186, 'Firm as for a sprain; a finger just slides under. Keep them still.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Pressure immobilisation: a broad firm bandage wrapped from the fingers or toes up the whole limb over the bite, then a splint, for bites from elapid snakes such as cobras, mambas, coral and Australian snakes'),
        'Only for snakes whose venom attacks nerves (elapids). Never for vipers and rattlesnakes: pressure on their venom worsens tissue damage. Never a tourniquet. Leave it on until antivenom is ready.')
    place('medical', f.fid, fig, '    <h3>Signs of Systemic Envenomation (Seek Emergency Care)</h3>')

def kfm():
    f = Fig('fig-kfm', 444, 220)
    f.t(222, 18, 'KEARNY FALLOUT METER — SIDE VIEW', 'dg-th', 'mid')
    f.r(120, 40, 200, 160, 'dg-panel', 6); f.t(124, 214, 'metal can (a food tin works)', 'dg-ts')
    f.r(110, 34, 220, 10, 'dg-white', 2); f.r(190, 34, 60, 10, 'dg-water'); f.t(336, 40, 'clear window', 'dg-ts')
    f.l(140, 64, 300, 64, 'dg-line', extra=' stroke-width="3"'); f.t(326, 68, 'insulating support', 'dg-ts')
    f.l(214, 64, 186, 140, 'dg-thin'); f.l(226, 64, 254, 140, 'dg-thin'); f.t(326, 100, 'threads', 'dg-ts')
    f.r(166, 140, 34, 34, 'dg-key', 2); f.r(240, 140, 34, 34, 'dg-key', 2); f.t(220, 166, '↔', 'dg-tb', 'mid')
    f.t(326, 152, 'foil leaves:', 'dg-ts'); f.t(326, 164, 'repel when charged', 'dg-ts')
    f.r(196, 182, 48, 12, 'dg-white', 2); f.t(326, 190, 'desiccant', 'dg-ts')
    f.t(40, 100, 'Charge it,', 'dg-ts'); f.t(40, 112, 'read the gap,', 'dg-ts'); f.t(40, 124, 'expose 1–4 min,', 'dg-ts'); f.t(40, 136, 'read again.', 'dg-ts')
    fig = figure(f.fid, f.svg('A Kearny fallout meter: inside a metal can with a clear window, two foil leaves hang on threads from an insulating support; charged alike they swing apart, and radiation lets the charge leak so the gap closes; a desiccant keeps the air dry'),
        'The drop in the gap over a timed exposure gives the dose rate from the calibration table in <em>Nuclear War Survival Skills</em> (bundled), which has full-size patterns. Build and test it before you need it.')
    swap_block('nbc', f.fid, fig, 'KFM CONSTRUCTION')

def faraday():
    f = Fig('fig-faraday', 444, 200)
    f.t(222, 18, 'NESTED FARADAY STORAGE', 'dg-th', 'mid')
    f.r(70, 50, 300, 140, 'dg-panel', 8); f.r(64, 40, 312, 14, 'dg-line', 3); f.t(220, 36, 'tight metal lid, seam taped with metal tape', 'dg-ts', 'mid')
    f.r(100, 70, 240, 104, 'dg-earth', 4); f.t(220, 86, 'cardboard lining — nothing touches the metal', 'dg-ts', 'mid')
    f.r(130, 98, 180, 64, 'dg-panel', 4); f.t(220, 112, 'inner tin or ammo can', 'dg-ts', 'mid')
    f.r(136, 122, 168, 30, 'dg-water', 4); f.t(220, 141, 'radio in a bag, wrapped in foil', 'dg-ts', 'mid')
    f.t(220, 196, 'Galvanised bin outside · no ground wire · test with a phone call (it should not ring)', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Nested Faraday storage: a radio wrapped in foil inside a small metal tin, insulated with cardboard inside a galvanised bin with a tight lid taped at the seam; no ground wire'),
        'Each conductive layer, separated by insulation, adds shielding. Keep spare batteries, chargers and cables inside too — and don’t wire it to earth.')
    swap_block('nbc', f.fid, fig, 'FARADAY CAGE — METAL TRASH CAN METHOD')

def layers():
    f = Fig('fig-layers', 444, 250)
    f.t(222, 18, 'LAYERED DEFENCE — DETECT EARLY, DELAY, THEN STOP', 'dg-th', 'mid')
    cx, cy = 222, 140
    for r, cls, t, sub in [(104, 'dg-panel', 'OUTER 100–300 m', 'lookouts, trails watched'), (74, 'dg-earth', 'MIDDLE 30–100 m', 'tripwire alarms, thorns, ditch'), (44, 'dg-green', 'INNER 0–30 m', 'fence, lights, dogs')]:
        f.a('<ellipse class="%s" cx="%g" cy="%g" rx="%g" ry="%g" opacity=".7"/>' % (cls, cx, cy, r * 1.9, r))
        f.t(cx, cy - r + 14, t, 'dg-tb dg-tb-sm', 'mid'); f.t(cx, cy - r + 26, sub, 'dg-ts', 'mid')
    f.r(cx - 20, cy - 2, 40, 26, 'dg-key', 3); f.t(cx, cy + 15, 'core', 'dg-tb dg-tb-sm', 'mid')
    fig = figure(f.fid, f.svg('Layered defence rings around a home: outer 100–300 m with lookouts; middle 30–100 m with alarms, thorn hedges and ditches; inner 0–30 m with fences, lights and dogs; the hardened core in the centre'),
        'Each ring buys time to wake people, gather and talk before anyone reaches the door. Mark safe paths for your own people and map every alarm.')
    swap_block('security', f.fid, fig, 'LAYERED DEFENSE CONCEPT')

def weaves():
    f = Fig('fig-weaves', 444, 204)
    f.t(222, 18, 'PLAIN WEAVE vs TWILL', 'dg-th', 'mid')
    for i, (h, fn) in enumerate([('PLAIN — over 1, under 1', lambda r, c: (r + c) % 2 == 0), ('TWILL — over 2, under 1, step 1', lambda r, c: (c - r) % 3 != 2)]):
        x0 = 20 + i * 214
        f.t(x0 + 92, 40, h, 'dg-tb dg-tb-sm', 'mid')
        for r in range(8):
            for c in range(10):
                x, y = x0 + c * 18, 50 + r * 16
                if fn(r, c): f.r(x, y + 2, 18, 12, '', 0, ' style="fill:#d4a843;stroke:#7a5a1a"')       # weft on top
                else: f.r(x + 3, y, 12, 16, '', 0, ' style="fill:#6fa3d8;stroke:#2a4a6a"')          # warp on top
    f.t(222, 198, 'blue = warp (on the loom), gold = weft (the shuttle thread)', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Plain weave: each weft thread goes over one warp and under the next, alternating each row, giving a checkerboard; twill: over two, under one, shifting one thread each row, giving diagonal ribs', 'dg-truecolor'),
        'Plain weave is the easiest and toughest for its weight. Twill drapes better and hides dirt — denim and most work cloth are twill.')
    swap_block('textiles', f.fid, fig, 'PLAIN WEAVE (over 1, under 1)')

def stitches():
    f = Fig('fig-stitches', 444, 300)
    f.t(222, 18, 'SIX HAND STITCHES', 'dg-th', 'mid')
    names = ['1 Running', '2 Backstitch', '3 Whipstitch', '4 Blanket', '5 Darning', '6 Ladder']
    for i, n in enumerate(names):
        x0, y0 = 10 + (i % 2) * 216, 28 + (i // 2) * 90
        f.r(x0, y0, 208, 84, 'dg-panel', 8); f.t(x0 + 10, y0 + 16, n, 'dg-tb dg-tb-sm')
        th = 'dg-key-s'
        if i == 0:
            f.r(x0 + 14, y0 + 36, 180, 24, 'dg-earth'); [f.l(x0 + 20 + k * 30, y0 + 48, x0 + 36 + k * 30, y0 + 48, th) for k in range(6)]
        if i == 1:
            f.r(x0 + 14, y0 + 36, 180, 24, 'dg-earth'); [f.l(x0 + 20 + k * 26, y0 + 48, x0 + 44 + k * 26, y0 + 48, th) for k in range(6)]
            f.t(x0 + 120, y0 + 76, 'each stitch goes back to meet the last', 'dg-ts', 'mid')
        if i == 2:
            f.r(x0 + 14, y0 + 30, 180, 14, 'dg-earth'); f.r(x0 + 14, y0 + 46, 180, 14, 'dg-wood')
            [f.l(x0 + 24 + k * 22, y0 + 64, x0 + 34 + k * 22, y0 + 26, th) for k in range(8)]
        if i == 3:
            f.r(x0 + 14, y0 + 30, 180, 24, 'dg-earth')
            f.p('M%g %g ' % (x0 + 20, y0 + 54) + ' '.join('v-14 h24 v14' if False else 'l0 -16 l0 16 h22' for _ in range(7)), th, extra=' fill="none"')
            f.t(x0 + 104, y0 + 76, 'loops lock along the edge', 'dg-ts', 'mid')
        if i == 4:
            f.c(x0 + 104, y0 + 50, 22, 'dg-panel'); [f.l(x0 + 82 + k * 6, y0 + 28, x0 + 82 + k * 6, y0 + 72, 'dg-blue-s', extra=' stroke-width="1.5"') for k in range(8)]
            [f.l(x0 + 80, y0 + 32 + k * 6, x0 + 128, y0 + 32 + k * 6, th, extra=' stroke-width="1.5"' + (' stroke-dasharray="6 6"' if k % 2 else ' stroke-dasharray="6 6" stroke-dashoffset="6"')) for k in range(7)]
            f.t(x0 + 134, y0 + 52, 'weave across', 'dg-ts')
        if i == 5:
            f.r(x0 + 14, y0 + 30, 180, 12, 'dg-earth'); f.r(x0 + 14, y0 + 54, 180, 12, 'dg-earth')
            f.p('M%g %g ' % (x0 + 22, y0 + 42) + ' '.join('l0 12 l20 0 l0 -12 l20 0' for _ in range(4)), th, extra=' fill="none"')
            f.t(x0 + 104, y0 + 80, 'pull tight: the seam vanishes', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Six hand stitches: running stitch in and out; backstitch with each stitch going back to meet the last; whipstitch wrapping over two edges; blanket stitch looping along an edge; darning weaving across a hole; ladder stitch alternating between two folded edges'),
        'Backstitch is the strong seam; running stitch is quick but weak; blanket stitch stops edges fraying; ladder stitch closes a seam invisibly.')
    s = page('textiles')
    if 'id="fig-stitches"' in s:
        drop('textiles', 'fig-stitches'); s = page('textiles'); PAGES['textiles'] = s.replace('<!--fig-stitches-->', '<!--fig-stitches-->\n    ' + fig, 1); return
    i = s.index('        <div class="stitch-demo">'); j = s.index('        <h3>Making Needles</h3>')
    demos = re.findall(r'<span class="stitch-name">(.*?)</span>(.*?)</div>', s[i:j], re.S)
    lis = []
    for name, body in demos:
        txt = [l.strip() for l in body.strip().splitlines() if re.search(r'[a-z]{4}', l) and not re.search(r'[━─│╲╔═└┘←↑·█]{2}', l) and not l.strip().startswith(('Fabric', 'Thread', 'Edge', 'Step', 'Folded'))]
        lis.append('          <li><strong>%s</strong> — %s</li>' % (re.sub(r'^\d+\.\s*', '', name), ' '.join(txt)))
    PAGES['textiles'] = s[:i] + '        <!--fig-stitches-->\n    ' + fig + '        <ul>\n' + '\n'.join(lis) + '\n        </ul>\n\n' + s[j:]

def saddle():
    f = Fig('fig-saddle', 444, 160)
    f.t(222, 18, 'SADDLE STITCH — TWO NEEDLES, ONE THREAD', 'dg-th', 'mid')
    f.r(30, 60, 384, 40, 'dg-wood', 4); f.t(222, 126, 'pre-punched holes 3–4 mm apart', 'dg-ts', 'mid')
    for k in range(8):
        x = 60 + k * 44
        f.c(x, 80, 3, 'dg-panel')
        if k < 7:
            f.l(x + 3, 62, x + 41, 62, 'dg-key-s', extra=' stroke-width="3"'); f.l(x + 3, 98, x + 41, 98, 'dg-blue-s', extra=' stroke-width="3"')
    f.t(30, 52, 'needle A (top)', 'dg-ts'); f.t(30, 116, 'needle B (bottom)', 'dg-ts')
    f.t(222, 150, 'Both needles go through every hole: one broken stitch can’t unzip it.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Saddle stitch: one thread with a needle at each end; both needles pass through every pre-punched hole from opposite sides, so the stitches on top and underneath are continuous'),
        'Wax the thread well; finish by backstitching two or three holes. This is why hand-sewn leather outlasts machine stitching.')
    swap_block('textiles', f.fid, fig, 'SADDLE STITCH')

def oil_lamp():
    f = Fig('fig-oillamp', 444, 170)
    f.t(222, 18, 'SIMPLE OIL LAMP', 'dg-th', 'mid')
    f.p('M150 100 q72 70 144 0 z', 'dg-panel'); f.p('M158 106 q64 52 128 0 z', '', extra=' style="fill:#c9a227;opacity:.6"')
    f.l(196, 128, 250, 92, 'dg-line', extra=' stroke-width="3"'); f.p('M252 90 q6 -18 0 -30 q-8 14 0 30', '', extra=' style="fill:#ffd25a"')
    f.t(320, 68, 'flame on ~6 mm of wick', 'dg-ts'); f.t(320, 110, 'wick lies in the oil,', 'dg-ts'); f.t(320, 122, 'held up at the lip', 'dg-ts')
    f.t(120, 150, 'any non-porous dish · olive oil or melted fat · never motor oil', 'dg-ts')
    fig = figure(f.fid, f.svg('A simple oil lamp: a shallow dish of oil with a cotton wick lying in the oil and its tip held up at the lip, burning with about 6 mm exposed'),
        'Trim the wick to stop smoking. Stand it on something that won’t burn, away from draughts and anything above it.')
    swap_block('chemistry', f.fid, fig, 'OIL LAMP — SIMPLE RESERVOIR TYPE')

def passive_solar():
    f = Fig('fig-passivesolar', 444, 210)
    f.t(222, 18, 'PASSIVE SOLAR: WINTER SUN IN, SUMMER SUN OUT', 'dg-th', 'mid')
    f.l(20, 186, 424, 186, 'dg-guide'); f.r(150, 80, 180, 106, 'dg-panel'); f.p('M140 80 L240 40 L340 80', 'dg-line', extra=' fill="none"')
    f.l(130, 80, 150, 80, 'dg-line', extra=' stroke-width="4"'); f.t(126, 94, 'overhang', 'dg-ts', 'end')
    f.r(146, 96, 8, 60, 'dg-water'); f.t(126, 128, 'south glass', 'dg-ts', 'end')
    f.r(156, 170, 140, 16, 'dg-earth'); f.t(226, 160, 'thermal mass floor / wall', 'dg-ts', 'mid')
    f.l(30, 60, 140, 82, 'dg-red-s', True); f.t(30, 52, 'summer sun (high): blocked', 'dg-ts')
    f.l(30, 150, 200, 176, 'dg-key-s', True); f.t(30, 144, 'winter sun (low)', 'dg-ts')
    f.t(340, 120, 'insulate', 'dg-ts'); f.t(340, 132, 'the other walls', 'dg-ts')
    fig = figure(f.fid, f.svg('Passive solar house: a roof overhang over south-facing glass blocks the high summer sun but lets the low winter sun in to warm a thermal-mass floor; the other walls are insulated'),
        'Size the overhang with the sun clock below. In the southern hemisphere, swap north for south.')
    swap_block('shelter', f.fid, fig, 'WINTER SUN (low angle)')

def snare():
    f = Fig('fig-snare', 444, 180)
    f.t(222, 18, 'SNARE ON A GAME TRAIL', 'dg-th', 'mid')
    f.l(20, 150, 424, 150, 'dg-guide'); f.p('M40 150 q100 -10 380 0', 'dg-earth', extra=' stroke-width="0"')
    f.l(260, 150, 260, 60, 'dg-wood-s', extra=' stroke-width="5"'); f.t(268, 60, 'firm anchor', 'dg-ts')
    f.p('M260 70 Q220 80 206 96', 'dg-line', extra=' fill="none"'); f.c(206, 112, 18, 'dg-line', ' fill="none"')
    f.l(186, 150, 192, 126, 'dg-wood-s'); f.t(196, 168, 'twig props the loop', 'dg-ts')
    f.l(170, 150, 170, 130, 'dg-thin', True); f.l(170, 130, 170, 150, 'dg-thin', True); f.t(164, 130, '~10 cm up', 'dg-ts', 'end')
    f.t(206, 82, 'loop 8–10 cm (rabbit)', 'dg-ts', 'end')
    f.p('M40 144 h60', 'dg-thin', True); f.t(40, 166, 'animal’s path', 'dg-ts')
    fig = figure(f.fid, f.svg('A snare: a wire loop about 8–10 cm across set about 10 cm above a game trail, propped by a twig and tied to a firm anchor'),
        'Snares are banned in Wales and tightly regulated elsewhere: survival use only, checked at least every 12 hours.')
    swap_block('food', f.fid, fig, 'Fixed point (tree/stake)')

def main():
    zones(); chimney(); candling(); crosses(); chestnut(); tick(); sparks(); sandcast()
    f, fig = hydro('fig-hydro'); swap_block('build-power', f.fid, fig, 'MICRO-HYDRO PELTON SYSTEM LAYOUT')
    f, fig = hydro('fig-hydro-en'); swap_block('energy', f.fid, fig, 'Intake Screen ─── Penstock')
    box_cooker(); drawbore(); mirror(); cr_box(); media()
    f = still('fig-potstill'); fig = figure(f.fid, f.svg('Pot still: a boiler with a sealed lid, a copper tube through a coil in a bucket of cold water, ending in an open collecting jar'),
        'The system must be open at the collecting end — never a closed pressure vessel. Discard the foreshots; drink only the hearts of a grain or sugar wash (see The Cuts).')
    swap_block('chemistry', f.fid, fig, 'POT STILL — COPPER PIPE')
    f = still('fig-still-food'); fig = figure(f.fid, f.svg('Improvised still for water: a covered pot heats dirty water, steam runs through a tube cooled in a bucket of cold water and drips into an open clean jar'),
        'For sea water or chemically polluted water. Throw away the first cupful. The jar must stay open — never seal the pot and tube.')
    swap_block('food', f.fid, fig, 'Boiling Pot')
    pressure_bandage(); kfm(); faraday(); layers(); weaves(); stitches(); saddle(); oil_lamp(); passive_solar(); snare()
    # ASCII blocks already shown by a drawn figure on the same page
    for name, inside in [('energy', 'Charge         │'), ('energy', 'Hot gases rise'), ('food', 'IMPROVISED WATER FILTER'), ('food', 'ROOF SURFACE'), ('food', 'Superstructure'),
                         ('metallurgy', 'JABOD FORGE'), ('metallurgy', 'NAIL HEADER'), ('chemistry', 'RETORT CHARCOAL KILN'), ('shelter', '60cm+ debris'), ('vehicles', '[COMPRESSION]')]:
        print('removed ASCII' if del_block(name, inside) else 'NOT FOUND', name, inside)
    if 'id="fig-gasifier-en"' not in page('energy'):
        swap_block('energy', 'fig-gasifier-en', copy_fig('vehicles', 'fig-gasifier', 'fig-gasifier-en'), 'FUEL HOPPER')
    if 'id="fig-biogas-en"' not in page('energy'):
        swap_block('energy', 'fig-biogas-en', copy_fig('build-power', 'fig-biogas', 'fig-biogas-en'), 'Gas outlet → cooking stove')
    if 'id="fig-rotation-food"' not in page('food'):
        swap_block('food', 'fig-rotation-food', copy_fig('agriculture', 'fig-rotation', 'fig-rotation-food'), 'Year 1   Year 2')
    for name, s in PAGES.items():
        open(os.path.join(S.ROOT, 'sections', name + '.html'), 'w', encoding='utf-8').write(s)
    print('written:', ', '.join(sorted(PAGES)))

if __name__ == '__main__':
    main()
