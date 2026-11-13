#!/usr/bin/env python3
"""Second batch of redraws of older diagrams, in the shared .dg style.
Run:  python3 tools/redraw2.py   (safe to run again), then re-split the multi-panel ones:
  node tools/split-panels.js sections/build-power.html fig-blade:2:1
  node tools/split-panels.js sections/build-water.html fig-swale:2:1
  node tools/split-panels.js sections/nbc.html fig-decon:3:2
Every label is taken from the diagram it replaces or from the section text beside it.
Corrections are listed in docs/DIAGRAMS.md ("Redrawn diagrams, second batch").
"""
import os, re, math
from redraw import T, AH, lead, num, fig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = {}


def foil(cx, cy, L, ang, cls='dg-key'):
    """Aerofoil of chord L, leading edge at left, rotated nose-up by ang degrees about its centre."""
    h = L * 0.11
    d = 'M%.1f %.1f C%.1f %.1f %.1f %.1f %.1f %.1f C%.1f %.1f %.1f %.1f %.1f %.1f Z' % (
        -L / 2, 0, -L / 2 + L * .06, -h * 1.5, L * .2, -h * 1.6, L / 2, 0, L * .2, h * .35, -L / 2 + L * .06, h * .55, -L / 2, 0)
    return '<path class="%s" d="%s" transform="translate(%.1f %.1f) rotate(%.1f)"/>' % (cls, d, cx, cy, -ang)


# 1 ── Wind blade: aerofoil + twist (two panels) ──────────────────────────────────
b = AH('bl')
b += '<rect class="dg-panel" x="2" y="2" width="216" height="200" rx="9"/>' + T(110, 22, 'THE BLADE IN SECTION', 'dg-th', 'mid') + T(110, 36, 'seen end-on, from the tip', 'dg-ts', 'mid')
b += ''.join('<path class="dg-blue-s" d="M8 %d L40 %d" marker-end="url(#ah-bl)"/>' % (y, y) for y in (96, 110, 124)) + T(10, 146, 'wind', 'dg-ts')
b += '<g data-hl="suction">' + '<path class="dg-key" d="M46 112 C52 78 120 70 206 116 C150 120 80 124 46 112 Z"/></g>'
b += '<path class="dg-red-s" d="M46 112 C52 78 120 70 206 116" data-hl="suction"/><path class="dg-blue-s" d="M46 112 C80 124 150 120 206 116" data-hl="pressure"/>'
b += '<path class="dg-key-s" d="M112 92 L112 50" marker-end="url(#ah-bl)"/>' + T(122, 58, 'LIFT', 'dg-tb')
b += T(10, 68, 'curved face:', 'dg-tb', hl='suction') + T(10, 81, 'low pressure', 'dg-ts', hl='suction')
b += T(10, 172, 'flatter face: higher pressure', 'dg-tb', hl='pressure') + lead(150, 168, 140, 122)
b += T(46, 192, 'leading edge', 'dg-ts', 'mid') + lead(46, 184, 46, 116) + T(204, 192, 'trailing edge', 'dg-ts', 'end') + lead(196, 184, 204, 120)
b += '<rect class="dg-panel" x="226" y="2" width="216" height="200" rx="9"/>' + T(334, 22, 'THE TWIST', 'dg-th', 'mid') + T(334, 36, 'steep at the hub, nearly flat at the tip', 'dg-ts', 'mid')
for i, (name, ang, note) in enumerate((('root', 25, '≈25°'), ('middle', 10, '≈10°'), ('tip', 4, '≈3–5°'))):
    y = 70 + i * 46
    b += '<line class="dg-guide" x1="250" y1="%d" x2="420" y2="%d"/>' % (y, y)
    b += foil(330, y, 74, ang)
    b += '<path class="dg-thin" d="M%d %d A 34 34 0 0 0 %.1f %.1f"/>' % (364, y, 330 + 34 * math.cos(math.radians(ang)), y - 34 * math.sin(math.radians(ang)))
    b += T(244, y + 4, name, 'dg-tb') + T(434, y + 4, note, 'dg-tb', 'end')
b += T(334, 196, 'dashed line = the plane the blade spins in', 'dg-ts', 'mid')
F['blade'] = fig('fig-blade', '0 0 444 206', 'Wind turbine blade: aerofoil section with its low- and high-pressure faces, and the twist from root to tip',
    b, 'The tip travels much faster than the root, so it meets the wind at a flatter angle. Twisting the blade from about 25° at the root to 3–5° at the tip keeps every part of it meeting the wind at the angle that gives most lift.')

# 2 ── Swales: plan + section (two panels) ───────────────────────────────────────
b = AH('sw')
b += '<rect class="dg-panel" x="2" y="2" width="216" height="214" rx="9"/>' + T(110, 22, 'FROM ABOVE', 'dg-th', 'mid')
for i, y in enumerate((60, 112, 164)):
    wave = 'M14 %d C60 %d 100 %d 150 %d S200 %d 206 %d' % (y, y - 10, y + 10, y, y - 6, y)
    b += '<path class="dg-guide" d="%s" transform="translate(0 -9)"/>' % wave
    b += '<path class="dg-water" d="%s" style="fill:none;stroke-width:7" transform="translate(0 -3)"/>' % wave
    b += '<path class="dg-earth" d="%s" style="fill:none;stroke-width:8" transform="translate(0 7)"/>' % wave
    b += ''.join('<circle class="dg-green" cx="%d" cy="%d" r="5"/>' % (x, y + 8 + (3 if x > 100 else -3)) for x in (40, 84, 128, 172))
    if i < 2: b += '<path class="dg-blue-s" d="M206 %d q8 26 0 46" marker-end="url(#ah-sw)"/>' % (y - 2)
b += T(14, 200, 'swale ', 'dg-ts') + '<rect class="dg-water" x="46" y="193" width="16" height="6"/>' + T(68, 200, 'berm + trees', 'dg-ts') + '<rect class="dg-earth" x="138" y="193" width="16" height="6"/>'
b += T(196, 40, 'overflow', 'dg-ts', 'end')
b += '<path class="dg-arrow" d="M20 34 L20 50" marker-end="url(#ah-sw)"/>' + T(26, 44, 'downhill', 'dg-ts')
b += '<rect class="dg-panel" x="226" y="2" width="216" height="214" rx="9"/>' + T(334, 22, 'CUT THROUGH', 'dg-th', 'mid')
ground = 'M232 64 L296 88 Q300 112 314 114 Q328 112 332 98 Q352 74 372 106 L436 128'
b += '<path class="dg-earth" d="%s L436 206 L232 206 Z"/>' % ground
b += '<path class="dg-water" d="M298 100 Q302 112 314 113 Q326 112 330 100 Z"/>'
b += '<path class="dg-thin" d="M352 80 L352 64"/><circle class="dg-green" cx="352" cy="58" r="10"/>'
b += ''.join('<path class="dg-blue-s" d="M%d 118 L%d 150" marker-end="url(#ah-sw)"/>' % (x, x + 4) for x in (302, 314, 326))
b += '<path class="dg-blue-s" d="M246 58 Q266 70 290 84" marker-end="url(#ah-sw)"/>' + T(234, 44, 'rain runs off', 'dg-ts') + T(234, 56, 'the slope', 'dg-ts')
b += T(314, 172, 'soaks in slowly', 'dg-tb', 'mid') + T(314, 186, 'and recharges the soil', 'dg-ts', 'mid')
b += T(296, 132, 'swale: level', 'dg-ts', 'end') + T(390, 74, 'berm', 'dg-tb') + T(390, 87, 'trees here', 'dg-ts')
b += T(240, 98, 'uphill', 'dg-ts') + T(436, 118, 'downhill', 'dg-ts', 'end')
F['swale'] = fig('fig-swale', '0 0 444 220', 'Swales on contour: plan view of level trenches with tree-planted berms, and a cross-section showing water soaking in',
    b, 'A swale is dug <strong>dead level along the contour</strong>, so water stops and soaks in instead of running off. The spoil makes a berm on the downhill side, where trees get the water. Each swale overflows at a stable point to the next one down.')

# 3 ── Disputes: one ladder (replaces two flowcharts that disagreed) ──────────────
b = AH('dp')
STEPS = [('1', 'TALK IT OUT', 'the two people, privately,', 'within 24 hours'),
         ('2', 'MEDIATION', 'a neutral third party; each side', 'is heard, said back, common ground'),
         ('3', 'COUNCIL HEARING', 'within 3 days; both sides, witnesses;', 'written decision with reasons'),
         ('4', 'ONE APPEAL', 'only with new information; whole', 'group decides if council is split')]
for i, (n, h, l1, l2) in enumerate(STEPS):
    y = 14 + i * 82
    b += '<rect class="dg-panel" x="100" y="%d" width="236" height="58" rx="9"/>' % y + num(118, y + 22, n) + T(134, y + 26, h, 'dg-tb')
    b += T(134, y + 41, l1, 'dg-ts') + T(134, y + 53, l2, 'dg-ts')
    if i < 3:
        b += '<path class="dg-arrow" d="M218 %d L218 %d" marker-end="url(#ah-dp)"/>' % (y + 60, y + 80) + T(226, y + 74, 'no agreement', 'dg-ts')
        b += '<path class="dg-green-s" d="M338 %d L352 %d" marker-end="url(#ah-dp)"/>' % (y + 29, y + 29)
        b += '<rect class="dg-okbg" x="356" y="%d" width="84" height="34" rx="8"/>' % (y + 12) + T(398, y + 26, 'agreed', 'dg-ok') + T(398, y + 39, 'write it down', 'dg-ts', 'mid')
b += '<path class="dg-red-s" d="M98 40 Q72 40 72 110 Q72 190 96 192" stroke-dasharray="5 4" marker-end="url(#ah-dp)"/>' + T(4, 100, 'danger,', 'dg-ts') + T(4, 112, 'violence or', 'dg-ts') + T(4, 124, 'children:', 'dg-ts') + T(4, 140, 'straight', 'dg-tb') + T(4, 153, 'to council', 'dg-tb')
F['disputes'] = fig('fig-disputes', '0 0 444 340', 'Dispute ladder: talk it out within 24 hours, then mediation, then a council hearing within 3 days, then one appeal',
    b, 'Most disputes end at step 1 or 2. Write down every stage, including agreements. The council serves the whole group, not either side: its first job is to keep the group together while being fair.')

# 4 ── Fever thresholds ───────────────────────────────────────────────────────────
b = ''
X = lambda t: 26 + (t - 36) * 64
BANDS = [(36, 38, 'dg-green', 'normal'), (38, 39.5, 'dg-key', 'fever'), (39.5, 40.5, 'dg-earth', 'high'), (40.5, 41.5, 'dg-red', 'danger'), (41.5, 42, 'dg-red', '')]
for a, z, cls, name in BANDS:
    b += '<rect class="%s" x="%.0f" y="30" width="%.0f" height="26"%s/>' % (cls, X(a), X(z) - X(a), ' style="fill-opacity:.9"' if a == 41.5 else '')
    if name: b += T((X(a) + X(z)) / 2, 22, name, 'dg-tb', 'mid')
for t, f in ((36, '96.8'), (38, '100.4'), (39.5, '103'), (40.5, '105'), (41.5, '107')):
    b += '<line class="dg-line" x1="%.0f" y1="56" x2="%.0f" y2="64"/>' % (X(t), X(t)) + T(X(t), 78, ('%g °C' % t), 'dg-tb', 'mid') + T(X(t), 91, f + ' °F', 'dg-ts', 'mid')
ROWS = [('dg-key', '38–39.5 °C', 'Fluids and rest.', 'Up to about 39 °C a fever helps fight infection.'),
        ('dg-earth', '39.5–40.5 °C', 'Cool (not cold) damp cloths, light clothing,', 'small sips. Yarrow or elderflower tea.'),
        ('dg-red', 'over 40.5 °C', 'Act now: cool cloths to armpits, groin', 'and forehead. Get medical help.'),
        ('dg-red', 'over 41.5 °C', 'Life-threatening. This high is usually heat', 'stroke, not infection: cool fast (Medical §4).')]
for i, (cls, rng, t1, t2) in enumerate(ROWS):
    y = 116 + i * 32
    b += '<rect class="%s" x="8" y="%d" width="14" height="14" rx="3"/>' % (cls, y - 11) + T(28, y, rng, 'dg-tb') + T(124, y, t1, 'dg-ts') + T(124, y + 13, t2, 'dg-ts')
F['fever'] = fig('fig-fever', '0 0 444 228', 'Fever temperature scale with what to do at each level',
    b, '<strong>Cool, never cold:</strong> ice or cold water makes a feverish person shiver, and shivering makes heat. Willow bark and meadowsweet work like aspirin, so the same rule applies: <strong>not for anyone under 16</strong>.')

# 5 ── Fallout shelter ─────────────────────────────────────────────────────────────
b = ''
b += '<path class="dg-earth" d="M2 120 L442 120 L442 236 L2 236 Z"/>'
b += '<path class="dg-earth" d="M52 120 Q60 76 92 70 L92 120 Z M392 120 Q384 76 352 70 L352 120 Z" style="fill-opacity:1"/>'
b += '<path class="dg-line" d="M92 120 L92 54 L352 54 L352 120 M80 56 L222 6 L364 56"/>' + T(222, 84, 'ground floor: wood frame PF 2–4, brick ~10', 'dg-ts', 'mid')
b += '<rect class="dg-panel" x="92" y="120" width="260" height="96"/>'
b += ''.join('<circle class="dg-redf" cx="%d" cy="%d" r="2.2"/>' % (x, y) for x, y in ((130, 26), (180, 14), (262, 18), (310, 36), (20, 114), (40, 110), (410, 112), (430, 116), (150, 32), (360, 46), (70, 72), (380, 64)))
b += T(10, 22, 'fallout', 'dg-tb') + T(10, 34, 'settles on roofs', 'dg-ts') + T(10, 46, 'and ground', 'dg-ts')
b += '<rect class="dg-debris" x="112" y="160" width="96" height="10" rx="2"/><path class="dg-line" d="M118 170 L118 214 M202 170 L202 214"/>'
b += '<rect class="dg-earth" x="110" y="146" width="100" height="14" rx="3"/><rect class="dg-key" x="112" y="136" width="96" height="10" rx="2"/>'
b += ''.join('<circle class="dg-white" cx="%d" cy="204" r="6"/>' % x for x in (138, 158, 178))
b += '<rect class="dg-water" x="300" y="184" width="16" height="30" rx="3"/><rect class="dg-water" x="320" y="184" width="16" height="30" rx="3"/>' + '<rect class="dg-debris" x="258" y="194" width="34" height="20" rx="2"/>'
b += T(360, 140, 'basement', 'dg-th') + T(360, 154, 'PF 10–100', 'dg-tb') + T(360, 168, 'more earth over', 'dg-ts') + T(360, 180, 'it = more PF', 'dg-ts')
b += T(160, 230, 'core: table piled with mattresses, books, earth', 'dg-ts', 'mid')
b += T(318, 178, 'water', 'dg-ts', 'mid') + T(275, 188, 'food', 'dg-ts', 'mid')
b += T(10, 140, 'earth banked', 'dg-tb') + T(10, 152, 'against walls', 'dg-ts') + T(10, 164, 'and windows', 'dg-ts')
F['shelter'] = fig('fig-falloutshelter', '0 0 444 238', 'Improvised fallout shelter: basement with earth banked against the walls and a core of heavy material over a table',
    b, 'Mass and distance stop radiation: get as far below ground and as far from the outside walls as you can, and put heavy material between you and the fallout. <strong>Stay at least 24 hours</strong>; two weeks if you can. Protection factors are from the table above.')

# 6 ── Decontamination: six panels ───────────────────────────────────────────────
ZONES = [('1 DIRTY', 'dg-badbg', ['outside, or', 'the sick room', '', 'nothing from here', 'goes further in']),
         ('2 STRIP', 'dg-badbg', ['PPE off, in order:', '1 boot covers', '2 gown, rolled', '   inside out', '3 gloves, peeled', '4 sanitise hands', '5 face shield', '6 mask, by straps', '7 sanitise hands']),
         ('3 WASH', 'dg-hdrbg', ['soap and water;', 'shampoo hair,', 'no conditioner;', 'nasal rinse;', 'scrub fingernails', '', 'step through a', 'bleach 1:10 foot', 'tray on the way out']),
         ('4 DISINFECT', 'dg-hdrbg', ['put on clean,', 'stored clothes', '', 'surfaces:', 'bleach 1:10', 'skin and hands:', '70%+ alcohol']),
         ('5 CLEAN', 'dg-okbg', ['living space', 'food preparation', 'children', '', 'soap and water is', 'the main decon', 'tool']),
         ('6 WASTE', 'dg-hdrbg', ['double-bag', 'used PPE, seal', 'and label', '', 'bodily waste at', 'least 50 m from', 'water; burn it', 'if you can'])]
b = ''
for i, (h, cls, lines) in enumerate(ZONES):
    x0 = 4 + (i % 3) * 147; y0 = 4 + (i // 3) * 166; cx = x0 + 70
    b += '<rect class="dg-panel" x="%d" y="%d" width="141" height="160" rx="9"/>' % (x0, y0)
    b += '<rect class="%s" x="%d" y="%d" width="121" height="20" rx="7"/>' % (cls, x0 + 10, y0 + 8) + T(cx, y0 + 22, h, 'dg-tb', 'mid')
    b += ''.join(T(x0 + 14, y0 + 44 + k * 13, ln, 'dg-ts' if not ln[:1].isdigit() or h.startswith('2') else 'dg-ts') for k, ln in enumerate(lines) if ln)
F['decon'] = fig('fig-decon', '0 0 444 336', 'Decontamination station: dirty, strip, wash, disinfect and clean zones, with waste handling',
    b, 'One way only: <strong>1 → 2 → 3 → 4 → 5</strong>, never back. Used PPE goes from zone 2 to the waste (6). Bleach 1:10 means 1 part bleach to 9 parts water; make it fresh each day.')

# 7 ── Hand-dug well ──────────────────────────────────────────────────────────────
b = AH('wl')
b += '<rect class="dg-earth" x="2" y="60" width="440" height="40" style="fill-opacity:.5"/><rect class="dg-earth" x="2" y="100" width="440" height="140"/>'
b += '<rect class="dg-water" x="2" y="240" width="440" height="80"/><line class="dg-blue-s" x1="2" y1="240" x2="442" y2="240" stroke-dasharray="7 5"/>'
b += '<rect class="dg-panel" x="186" y="60" width="72" height="260"/>'
b += '<rect class="dg-water" x="186" y="250" width="72" height="70"/>'
b += '<rect class="dg-debris" x="176" y="60" width="10" height="100"/><rect class="dg-debris" x="258" y="60" width="10" height="100"/>'
b += ''.join('<rect class="dg-debris" x="%d" y="%d" width="10" height="13" rx="1"/>' % (x, y) for x in (176, 258) for y in range(164, 318, 18))
b += '<rect class="dg-debris" x="164" y="48" width="116" height="12" rx="2"/><path class="dg-line" d="M222 48 L222 22 M222 26 L246 16"/><rect class="dg-key" x="214" y="30" width="16" height="18" rx="2"/>'
b += '<line class="dg-thin" x1="222" y1="60" x2="222" y2="300"/>'
b += ''.join('<path class="dg-blue-s" d="M%d %d L%d %d" marker-end="url(#ah-wl)"/>' % (x1, y, x2, y) for x1, x2, y in ((140, 172, 280), (304, 272, 290)))
b += '<path class="dg-thin" d="M150 60 L150 160 M144 60 h12 M144 160 h12"/>' + T(142, 106, 'top 3 m', 'dg-tb', 'end') + T(142, 119, 'sealed with', 'dg-ts', 'end') + T(142, 131, 'dense mortar', 'dg-ts', 'end')
b += T(142, 200, 'below: open', 'dg-tb', 'end') + T(142, 213, 'joints let', 'dg-ts', 'end') + T(142, 225, 'water in', 'dg-ts', 'end')
b += T(300, 30, 'concrete lid and', 'dg-tb') + T(300, 43, 'hand pump keep out', 'dg-ts') + T(300, 55, 'dirt and animals', 'dg-ts')
b += T(300, 116, 'surface water would', 'dg-ts') + T(300, 128, 'carry dirt down here;', 'dg-ts') + T(300, 140, 'the seal stops it', 'dg-ts')
b += T(436, 256, 'water table', 'dg-tb', 'end') + '<path class="dg-thin" d="M186 336 L258 336 M186 331 v10 M258 331 v10"/>' + T(222, 352, '1.2 m inside', 'dg-ts', 'mid')
b += T(10, 82, 'topsoil', 'dg-ts') + T(10, 180, 'subsoil', 'dg-ts')
F['well'] = fig('fig-well', '0 0 444 358', 'Hand-dug well in cross-section: sealed lining for the top 3 metres, open-jointed lining below the water table, lid and hand pump',
    b, 'Water gets in low down and dirt is kept out high up. Never work alone in a well: shafts collapse, and gas collects at the bottom.')

# 8 ── Fixed-dome biogas digester ─────────────────────────────────────────────────
b = AH('bg')
b += '<path class="dg-earth" d="M2 70 L442 70 L442 246 L2 246 Z"/>'
b += '<path class="dg-panel" d="M126 214 L126 140 Q126 92 220 92 Q314 92 314 140 L314 214 Z"/>'
b += '<path class="dg-debris" d="M128 150 L312 150 L312 212 L128 212 Z"/>' + T(226, 174, 'SLURRY', 'dg-tb', 'mid') + T(226, 188, 'manure, food scraps,', 'dg-ts', 'mid') + T(226, 200, 'crop waste + water', 'dg-ts', 'mid')
b += '<path class="dg-key" d="M128 148 L128 140 Q128 94 220 94 Q312 94 312 140 L312 148 Z" style="fill-opacity:.35"/>' + T(220, 124, 'GAS  CH₄ + CO₂', 'dg-tb', 'mid')
b += '<rect class="dg-panel" x="18" y="48" width="62" height="22" rx="3"/>' + T(49, 40, 'mixing pit', 'dg-ts', 'mid')
b += '<path class="dg-line" d="M66 70 L136 200" stroke-width="7" style="opacity:.6"/>'
b += '<rect class="dg-panel" x="334" y="96" width="78" height="118"/><rect class="dg-debris" x="336" y="116" width="74" height="96"/>'
b += '<path class="dg-line" d="M314 200 L336 200" stroke-width="10" style="opacity:.6"/>'
b += '<path class="dg-arrow" d="M374 112 L374 70 L434 70" marker-end="url(#ah-bg)"/>' + T(436, 48, 'slurry out', 'dg-tb', 'end') + T(436, 61, '= fertiliser', 'dg-ts', 'end')
b += '<path class="dg-key-s" d="M220 94 L220 22 L300 22" marker-end="url(#ah-bg)"/><rect class="dg-key" x="212" y="38" width="16" height="12" rx="2"/>'
b += T(304, 18, 'gas to stove', 'dg-tb') + T(304, 31, 'pressure-relief valve', 'dg-ts')
b += '<path class="dg-red-s" d="M296 168 L330 150" marker-end="url(#ah-bg)"/>' + T(373, 228, 'gas pushes slurry', 'dg-ts', 'mid') + T(373, 240, 'up into here', 'dg-ts', 'mid')
b += '<path class="dg-thin" d="M104 70 L104 214 M98 70 h12 M98 214 h12"/>' + T(96, 146, '1–2 m', 'dg-tb', 'end')
b += T(10, 128, 'inlet:', 'dg-tb') + T(10, 141, 'waste +', 'dg-ts') + T(10, 153, 'water', 'dg-ts')
F['biogas'] = fig('fig-biogas', '0 0 444 252', 'Fixed-dome biogas digester: a buried brick dome where slurry makes gas, with an inlet, a gas outlet and a displacement chamber',
    b, 'As gas collects under the dome it pushes slurry up into the outlet chamber; as you burn the gas, the slurry flows back and keeps the pressure steady. Sealed except for the gas pipe. Biogas burns: <strong>no flames near the dome</strong>, and never go into an empty digester.')

# 9 ── Cob wall ───────────────────────────────────────────────────────────────────
b = AH('cb')
b += '<path class="dg-earth" d="M2 206 L442 206 L442 290 L2 290 Z"/>'
b += '<path class="dg-debris" d="M144 206 L304 206 L296 284 L152 284 Z"/>' + ''.join('<circle class="dg-panel" cx="%d" cy="%d" r="%d"/>' % (x, y, r) for x, y, r in ((170, 226, 11), (200, 236, 13), (232, 226, 11), (262, 238, 13), (288, 224, 9), (176, 262, 12), (212, 266, 12), (248, 262, 12), (280, 260, 9)))
b += '<rect class="dg-panel" x="150" y="168" width="148" height="38" rx="3"/>' + ''.join('<path class="dg-thin" d="M%d 168 L%d 206"/>' % (x, x) for x in (186, 222, 262))
b += '<rect class="dg-earth" x="164" y="62" width="120" height="106" style="fill-opacity:1"/>' + ''.join('<path class="dg-thin" d="M%d %d l14 -4"/>' % (x, y) for x in (174, 204, 236, 262) for y in (78, 104, 130))
b += '<rect class="dg-white" x="158" y="62" width="6" height="106"/><rect class="dg-key" x="284" y="62" width="6" height="106"/>'
roof = lambda x: 26 + (340 - x) * 0.2
b += '<path class="dg-debris" d="M340 20 L60 76 L60 84 L340 28 Z"/>'
b += ''.join('<path class="dg-blue-s" d="M%d %.0f L%d %.0f"/>' % (x, roof(x) - 30, x, roof(x) - 12) for x in (110, 170, 230, 290))
b += '<path class="dg-blue-s" d="M60 88 L60 140" stroke-dasharray="4 5" marker-end="url(#ah-cb)"/>' + T(66, 140, 'drips clear', 'dg-ts') + T(66, 152, 'of the wall', 'dg-ts')
b += '<path class="dg-thin" d="M60 112 L158 112 M60 107 v10 M158 107 v10"/>' + T(109, 102, 'overhang 60 cm+', 'dg-tb', 'mid')
b += '<path class="dg-thin" d="M158 158 L290 158 M158 153 v10 M290 153 v10"/>' + T(224, 150, '45 cm min, 60 better', 'dg-ts', 'mid')
b += T(224, 100, 'COB', 'dg-th', 'mid') + T(224, 116, 'sand, clay,', 'dg-ts', 'mid') + T(224, 128, 'straw, water', 'dg-ts', 'mid')
b += T(10, 172, 'lime plaster', 'dg-tb') + T(10, 185, 'outside: breathes,', 'dg-ts') + T(10, 197, 'sheds rain', 'dg-ts') + lead(84, 168, 158, 140)
b += T(434, 104, 'clay plaster', 'dg-tb', 'end') + T(434, 117, 'inside', 'dg-ts', 'end') + lead(372, 110, 290, 110)
b += T(434, 180, 'stone plinth: cob', 'dg-tb', 'end') + T(434, 193, 'starts 30 cm+ up', 'dg-ts', 'end') + lead(350, 184, 298, 186)
b += T(434, 248, 'rubble trench:', 'dg-tb', 'end') + T(434, 261, 'stone, no mortar;', 'dg-ts', 'end') + T(434, 273, 'water drains away', 'dg-ts', 'end')
F['cob'] = fig('fig-cob', '0 0 444 292', 'Cob wall in cross-section: rubble trench, stone plinth, thick cob wall with lime and clay plasters, and a wide roof overhang',
    b, '“A good hat and good boots”: a wide roof overhang keeps rain off the wall, and the plinth keeps its foot out of splash and rising damp. Cob stays strong as long as it stays dry.')


# ── swap them in ─────────────────────────────────────────────────────────────────
def swap(page, marker, html_, fid, nth=0):
    p = os.path.join(ROOT, 'sections', page); s = open(p, encoding='utf-8').read()
    ids = [m.start() for m in re.finditer(r'id="%s"' % re.escape(fid), s)]
    if len(ids) > nth:
        i = s.rfind('<figure', 0, ids[nth]); j = s.index('</figure>', i) + 9
        open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'refreshed'
    k = s.index(marker); m = s.rfind('<svg', 0, k); e = s.index('</svg>', k) + 6
    fo, fc = s.rfind('<figure', 0, m), s.rfind('</figure>', 0, m)
    if fo > fc and s.index('</figure>', e) - e < 2500:           # the old svg sits in its own figure: replace the whole figure
        i, j = fo, s.index('</figure>', e) + 9
    else:
        i, j = m, e
    open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'replaced'


JOBS = [('build-power.html', 'WIND TURBINE BLADE', 'blade', 'fig-blade', 0),
        ('build-water.html', 'aria-label="Swale', 'swale', 'fig-swale', 0),
        ('governance.html', 'CONFLICT REPORTED', 'disputes', 'fig-disputes', 0),
        ('governance.html', 'DISPUTE ARISES', 'disputes2', 'fig-disputes-print', 0),
        ('medicine-making.html', 'FEVER TEMPERATURE', 'fever', 'fig-fever', 0),
        ('nbc.html', 'Above-grade structure (PF', 'shelter', 'fig-falloutshelter', 0),
        ('nbc.html', 'font-family="system-ui">Decontamination', 'decon', 'fig-decon', 0),
        ('build-water.html', 'aria-label="Well cross', 'well', 'fig-well', 0),
        ('build-power.html', 'FIXED DOME BIOGAS', 'biogas', 'fig-biogas', 0),
        ('build-structures.html', 'COB WALL CROSS-SECTION', 'cob', 'fig-cob', 0)]
F['disputes2'] = F['disputes'].replace('id="fig-disputes"', 'id="fig-disputes-print"').replace('ah-dp', 'ah-dq')

if __name__ == '__main__':
    for page, marker, key, fid, nth in JOBS:
        print('%-22s %-20s %s' % (page, fid, swap(page, marker, F[key], fid, nth)))
