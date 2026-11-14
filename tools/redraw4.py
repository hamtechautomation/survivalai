#!/usr/bin/env python3
"""Fourth (last) batch of redraws of older diagrams, in the shared .dg style.
Run:  python3 tools/redraw4.py   (safe to run again), then re-split the multi-panel ones:
  node tools/split-panels.js sections/agriculture.html fig-swale-ag:2:1 fig-aquaponics:2:1
  node tools/split-panels.js sections/navigation.html fig-sky-signposts:2:1
  node tools/split-panels.js sections/nbc.html fig-blast:2:1
Every label is taken from the diagram it replaces, the section text beside it, or (star positions)
real right ascension and declination. Corrections are listed in docs/DIAGRAMS.md
("Redrawn diagrams, fourth batch").
Left as they are, on purpose: the illustrated plant cards, the two decorative scenes, the
interactive foraging wheel, the compass rose, the box-breathing widget, and the heat and temper
colour charts (their colours are the information).
"""
import os, re, math
from redraw import T, AH, lead, num, fig
from redraw2 import F as F2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = {}


def panel(x, y, w, h, title=None, sub=None):
    s = '<rect class="dg-panel" x="%s" y="%s" width="%s" height="%s" rx="9"/>' % (x, y, w, h)
    if title: s += T(x + w / 2, y + 20, title, 'dg-th', 'mid')
    if sub: s += T(x + w / 2, y + 34, sub, 'dg-ts', 'mid')
    return s


def box(x, y, w, h, cls='dg-panel'):
    return '<rect class="%s" x="%s" y="%s" width="%s" height="%s" rx="8"/>' % (cls, x, y, w, h)


def arrow(d, aid, cls='dg-arrow'):
    return '<path class="%s" d="%s" marker-end="url(#ah-%s)"/>' % (cls, d, aid)


# 1 ── Soil texture triangle (USDA classes, drawn exactly) ───────────────────────────
b = AH('st')
L0, R0, A0 = (52, 296), (352, 296), (202, 296 - 300 * math.sqrt(3) / 2)
def P(sand, clay):
    silt = 100 - sand - clay
    return ((sand * L0[0] + silt * R0[0] + clay * A0[0]) / 100, (sand * L0[1] + silt * R0[1] + clay * A0[1]) / 100)
CLASSES = [  # (name, polygon in (sand, clay), fill class, label position (sand, clay))
    ('Clay', [(45, 40), (20, 40), (0, 60), (0, 100), (45, 55)], 'dg-earth', (22, 58)),
    ('Silty clay', [(20, 40), (0, 40), (0, 60)], 'dg-debris', (6, 45)),
    ('Sandy clay', [(65, 35), (45, 35), (45, 55)], 'dg-debris', (51, 41)),
    ('Clay loam', [(45, 27), (20, 27), (20, 40), (45, 40)], 'dg-key', (32, 33)),
    ('Silty clay loam', [(20, 27), (0, 27), (0, 40), (20, 40)], 'dg-earth', (6, 33)),
    ('Sandy clay loam', [(80, 20), (52, 20), (45, 27), (45, 35), (65, 35)], 'dg-earth', (58, 27)),
    ('Loam', [(43, 7), (23, 27), (45, 27), (52, 20), (52, 7)], 'dg-green', (40, 16)),
    ('Silt loam', [(50, 0), (20, 0), (8, 12), (0, 12), (0, 27), (23, 27)], 'dg-key', (20, 12)),
    ('Silt', [(20, 0), (0, 0), (0, 12), (8, 12)], 'dg-debris', (7, 4)),
    ('Sandy loam', [(70, 0), (50, 0), (43, 7), (52, 7), (52, 20), (80, 20), (85, 15)], 'dg-debris', (63, 8)),
    ('Loamy sand', [(85, 0), (70, 0), (85, 15), (90, 10)], 'dg-key', None),
    ('Sand', [(100, 0), (85, 0), (90, 10)], 'dg-earth', None)]
for name, poly, cls, lab in CLASSES:
    pts = ' '.join('%.1f,%.1f' % P(*q) for q in poly)
    b += '<polygon class="%s" points="%s" data-hl="%s" opacity="%s"/>' % (cls, pts, name.lower().replace(' ', '-'), '.95' if name == 'Loam' else '.55')
for name, poly, cls, lab in CLASSES:
    if lab:
        x, y = P(*lab); words = name.split(' ')
        if len(words) == 3: words = [words[0] + ' ' + words[1], words[2]]
        for k, w in enumerate(words):
            b += T(round(x, 1), round(y + 4 + (k - (len(words) - 1) / 2) * 12, 1), w, 'dg-tb dg-tb-sm' if name == 'Loam' else 'dg-ts', 'mid', name.lower().replace(' ', '-'))
x, y = P(88, 6); b += lead(40, 236, x, y) + T(8, 226, 'Loamy', 'dg-ts', hl='loamy-sand') + T(8, 238, 'sand', 'dg-ts', hl='loamy-sand')
x, y = P(95, 2); b += lead(28, 270, x, y) + T(8, 262, 'Sand', 'dg-ts', hl='sand')
b += '<polygon class="dg-line" fill="none" points="%.1f,%.1f %.1f,%.1f %.1f,%.1f"/>' % (L0 + R0 + A0)
for v in (20, 40, 60, 80):
    x, y = P(100 - v, v); b += T(round(x - 6, 1), round(y + 4, 1), str(v), 'dg-ts', 'end')            # clay, left edge
    x, y = P(0, 100 - v); b += T(round(x + 6, 1), round(y + 4, 1), str(v), 'dg-ts')                   # silt, right edge
    x, y = P(v, 0); b += T(round(x, 1), round(y + 15, 1), str(v), 'dg-ts', 'mid')                      # sand, bottom
b += T(180, 66, '% CLAY', 'dg-tb dg-tb-sm', 'end') + T(224, 66, '% SILT', 'dg-tb dg-tb-sm') + T(202, 326, '% SAND', 'dg-tb dg-tb-sm', 'mid')
ex = P(40, 20)
b += '<path class="dg-key-s" d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" stroke-width="1.4" stroke-dasharray="4 3"/>' % (
    ex + P(80, 20) + ex + P(40, 0) + ex + P(0, 60))
b += '<circle class="dg-keyf" cx="%.1f" cy="%.1f" r="5"/>' % ex
b += T(8, 30, 'EXAMPLE', 'dg-th') + T(8, 46, 'jar test gives', 'dg-ts') + T(8, 62, '40% sand', 'dg-t') + T(8, 76, '40% silt', 'dg-t') + T(8, 90, '20% clay', 'dg-t')
b += T(8, 106, '→ LOAM', 'dg-tb', hl='loam') + T(436, 30, 'follow each %', 'dg-ts', 'end') + T(436, 42, 'along its own', 'dg-ts', 'end') + T(436, 54, 'lines; where', 'dg-ts', 'end') + T(436, 66, 'they meet is', 'dg-ts', 'end') + T(436, 78, 'your soil type', 'dg-ts', 'end')
F['soiltri'] = fig('fig-soiltri', '0 0 444 334', 'Soil texture triangle with the twelve USDA soil classes; an example of 40% sand, 40% silt and 20% clay falls in loam',
    b, 'Measure the layers from a jar test, then find where the three percentages meet. <strong>Loam</strong> (green) is the gardener’s ideal. Towards the clay corner soil holds water and gets waterlogged. Towards sand it drains too fast. Silty soils pack down hard. Every soil is improved by adding organic matter.')

# 2 ── Four-year rotation ───────────────────────────────────────────────────────────
b = AH('ro')
FAM = [('LEGUMES', 'beans, peas', 'dg-green', 'fix nitrogen'), ('LEAVES', 'brassicas, lettuce', 'dg-key', 'want nitrogen'),
       ('FRUITS', 'tomatoes, peppers', 'dg-red', 'heavy feeders'), ('ROOTS', 'carrots, beets, onion', 'dg-earth', 'moderate')]
CX, CY, RR = 96, 168, 62
for i, (n, ex_, cls, note) in enumerate(FAM):
    a = math.radians(90 - i * 90); x, y = CX + RR * math.cos(a), CY - RR * math.sin(a)
    b += '<g data-hl="f%d"><circle class="%s" cx="%.1f" cy="%.1f" r="30"/>' % (i, cls, x, y) + T(round(x, 1), round(y + 4, 1), n, 'dg-tb dg-tb-sm', 'mid') + '</g>'
    a2, a3 = math.radians(90 - i * 90 - 30), math.radians(90 - i * 90 - 60)
    b += '<path class="dg-arrow" d="M%.1f %.1f A %d %d 0 0 1 %.1f %.1f" marker-end="url(#ah-ro)"/>' % (CX + RR * math.cos(a2), CY - RR * math.sin(a2), RR, RR, CX + RR * math.cos(a3), CY - RR * math.sin(a3))
b += T(96, 30, 'THE CYCLE', 'dg-th', 'mid') + T(96, 46, 'each bed moves on', 'dg-ts', 'mid') + T(96, 58, 'one step a year', 'dg-ts', 'mid')
b += T(96, 268, 'never the same family in the', 'dg-ts', 'mid') + T(96, 280, 'same bed two years running', 'dg-ts', 'mid')
GX, GY, CW, RH = 232, 54, 52, 52
b += T(GX + 2 * CW, 30, 'FOUR BEDS, STAGGERED', 'dg-th', 'mid')
for c, bed in enumerate('ABCD'):
    b += T(GX + c * CW + CW / 2, GY - 6, 'BED ' + bed, 'dg-tb dg-tb-sm', 'mid')
for r in range(4):
    b += T(GX - 6, GY + r * RH + RH / 2 + 4, 'Yr %d' % (r + 1), 'dg-ts', 'end')
    for c in range(4):
        f = (r + c) % 4; n, ex_, cls, note = FAM[f]
        b += '<g data-hl="f%d"><rect class="%s" x="%d" y="%d" width="%d" height="%d" rx="6"/>' % (f, cls, GX + c * CW + 2, GY + r * RH + 2, CW - 4, RH - 4) + T(GX + c * CW + CW / 2, GY + r * RH + RH / 2 + 4, n.title(), 'dg-ts', 'mid') + '</g>'
b += T(GX + 2 * CW, GY + 4 * RH + 18, 'every year all four families are grown', 'dg-ts', 'mid')
F['rotation'] = fig('fig-rotation', '0 0 444 290', 'Four-year crop rotation: legumes, then leaves, then fruits, then roots; four beds each start at a different point so every family is grown every year',
    b, 'Leaves follow legumes to use the nitrogen they leave behind; fruits come next, then roots, then legumes again to rebuild the soil. Staggering the beds means you grow every family every year, and pests and diseases of one family never find it in the same place twice.')

# 3 ── Companion planting cards ─────────────────────────────────────────────────────
b = ''
CMP = [('TOMATO', 'basil, carrot, marigold', 'fennel, brassicas'), ('CORN', 'beans, squash', 'tomato'),
       ('BEANS', 'carrot, corn', 'onion, garlic'), ('SQUASH', 'nasturtium, corn', 'potato'),
       ('ONION', 'carrot, beet, chamomile', 'beans, peas'), ('CARROT', 'leek, sage, onion', 'dill'),
       ('BRASSICAS', 'dill, celery, marigold', 'tomato, fennel'), ('THREE SISTERS', 'corn + beans + squash', None)]
for i, (n, good, bad) in enumerate(CMP):
    x, y = 2 + (i % 2) * 222, 2 + (i // 2) * 70
    b += '<g data-hl="c%d">' % i + box(x, y, 218, 64, 'dg-okbg' if bad is None else 'dg-panel') + T(x + 12, y + 20, n, 'dg-tb')
    b += T(x + 12, y + 38, '✓ ' + good, 'dg-t dg-okt')
    b += (T(x + 12, y + 55, '✗ ' + bad, 'dg-t dg-badt') if bad else T(x + 12, y + 55, 'corn holds up beans; squash shades', 'dg-ts')) + '</g>'
F['companion'] = fig('fig-companion', '0 0 444 284', 'Companion planting: for seven crops, which plants help them and which to keep away, plus the three sisters of corn, beans and squash',
    b,
    '✓ grow within 2–3 ft for pest confusion and pollination; ✗ keep apart. The table below gives the reasons and more pairs.')

# 4 ── Swale: same drawing as Water Systems, own id ──────────────────────────────────
F['swale'] = F2['swale'].replace('id="fig-swale"', 'id="fig-swale-ag"').replace('ah-sw', 'ah-sa')

# 5 ── Aquaponics (two panels) ─────────────────────────────────────────────────────
b = AH('aq')
b += panel(2, 2, 250, 290, 'MEDIA-BED SYSTEM')
b += '<g data-hl="bed"><rect class="dg-debris" x="24" y="66" width="170" height="60" rx="4"/>' + ''.join('<circle class="dg-white" cx="%d" cy="%d" r="3" opacity=".45"/>' % (32 + (k * 37) % 150, 74 + (k * 23) % 46) for k in range(36))
b += ''.join('<path class="dg-green-s" d="M%d 66 l0 -18 M%d 56 l-7 -6 M%d 52 l7 -6"/>' % (x, x, x) for x in (50, 90, 130, 170)) + '</g>'
b += '<g data-hl="siphon"><rect class="dg-water" x="150" y="80" width="14" height="46"/><rect class="dg-line" x="146" y="76" width="22" height="40" rx="4" fill="none"/></g>'
b += '<g data-hl="tank"><rect class="dg-water" x="24" y="196" width="200" height="74" rx="6"/>' + ''.join('<path class="dg-key" d="M%d %d q10 -7 20 0 q-10 7 -20 0 Z M%d %d l-6 -5 l0 10 Z"/>' % (x, y, x, y) for x, y in ((60, 228), (110, 244), (160, 222))) + '</g>'
b += '<g data-hl="pump"><rect class="dg-green" x="196" y="240" width="20" height="20" rx="4"/></g>'
b += arrow('M206 238 L206 140 Q206 100 196 96', 'aq', 'dg-blue-s') + arrow('M157 128 L157 190', 'aq', 'dg-blue-s')
b += T(109, 146, 'GROW BED: gravel or', 'dg-tb dg-tb-sm', 'mid', 'bed') + T(109, 160, 'expanded clay', 'dg-ts', 'mid', 'bed')
b += T(150, 180, 'BELL SIPHON', 'dg-tb dg-tb-sm', 'end', 'siphon')
b += T(124, 286, 'FISH TANK 1,000+ L', 'dg-tb dg-tb-sm', 'mid', 'tank')
b += T(190, 255, 'pump', 'dg-ts', 'end', 'pump')
b += panel(258, 2, 184, 290, 'THE NITROGEN CYCLE')
CYC = [('FISH', 'excrete ammonia (NH₃)', 'dg-water'), ('NITROSOMONAS', 'bacteria → nitrite (NO₂⁻)', 'dg-earth'),
       ('NITROBACTER', 'bacteria → nitrate (NO₃⁻)', 'dg-earth'), ('PLANTS', 'take up nitrate as food', 'dg-green'), ('CLEAN WATER', 'flows back to the fish', 'dg-water')]
for i, (h, t_, cls) in enumerate(CYC):
    y = 44 + i * 50
    b += box(270, y, 160, 38, cls) + T(350, y + 16, h, 'dg-tb dg-tb-sm', 'mid')
    b += T(350, y + 30, t_, 'dg-ts', 'mid')
    if i < 4: b += arrow('M350 %d L350 %d' % (y + 39, y + 49), 'aq')
F['aquaponics'] = fig('fig-aquaponics', '0 0 444 294', 'Media-bed aquaponics: a pump lifts fish-tank water into a gravel grow bed, a bell siphon drains it back; the nitrogen cycle turns fish ammonia into nitrate for the plants',
    b, 'Fish waste feeds the plants; the plants and the bacteria in the gravel clean the water for the fish. The bell siphon floods and drains the bed automatically, with no moving parts. Stock about 1 fish per 40&nbsp;L of tank.')

# 6 ── Community perimeter, plan ──────────────────────────────────────────────────
b = ''
b += '<g data-hl="outer"><rect class="dg-green" x="20" y="34" width="404" height="244" rx="40" opacity=".35"/><rect class="dg-green-s" x="20" y="34" width="404" height="244" rx="40" fill="none" stroke-dasharray="10 5"/></g>'
b += '<g data-hl="obst">' + ''.join('<path class="dg-red-s" d="M%d %d l6 6 m0 -6 l-6 6" stroke-width="1.6"/>' % (x, y) for x in range(52, 400, 26) for y in (60, 246)) + ''.join('<path class="dg-red-s" d="M%d %d l6 6 m0 -6 l-6 6" stroke-width="1.6"/>' % (x, y) for x in (44, 394) for y in range(90, 230, 26)) + '</g>'
b += '<g data-hl="wall"><rect class="dg-line" x="92" y="84" width="260" height="144" rx="4" fill="none" stroke-width="5"/></g>'
b += '<g data-hl="gate"><rect class="dg-panel" x="204" y="224" width="36" height="9"/><path class="dg-key-s" d="M204 228 l8 -12 M240 228 l-8 -12"/></g>'
for x, y, a in ((92, 84, 135), (352, 84, 45), (92, 228, 225), (352, 228, 315)):
    a0, a1 = math.radians(a - 50), math.radians(a + 50)
    b += '<g data-hl="tower"><path class="dg-key" d="M%d %d L%.1f %.1f A 46 46 0 0 1 %.1f %.1f Z" opacity=".35"/>' % (x, y, x + 46 * math.cos(a1), y - 46 * math.sin(a1), x + 46 * math.cos(a0), y - 46 * math.sin(a0))
    b += '<rect class="dg-key" x="%d" y="%d" width="14" height="14"/></g>' % (x - 7, y - 7)
b += '<g data-hl="bldg"><rect class="dg-debris" x="150" y="118" width="60" height="38"/><rect class="dg-debris" x="232" y="118" width="64" height="38"/><rect class="dg-debris" x="182" y="170" width="80" height="30"/></g>'
b += T(222, 22, 'COMMUNITY PERIMETER — FROM ABOVE', 'dg-th', 'mid')
b += T(222, 104, 'LAYER 2: WALL', 'dg-tb', 'mid', 'wall')
b += T(30, 300, 'LAYER 1 (100–200 m out): thorny hedge, ditch and berm', 'dg-ts', hl='outer')
b += T(30, 314, '✕ obstacle belt: abatis, dragon’s teeth, hedgehogs', 'dg-ts', hl='obst')
b += T(30, 328, '■ watchtower at every corner, fields of view overlap', 'dg-ts', hl='tower')
b += T(222, 216, 'GATE: one choke point, covered by two towers', 'dg-ts', 'mid', 'gate') + T(30, 342, '▭ buildings inside: Layer 3, hardened', 'dg-ts', hl='bldg')
F['perimeter'] = fig('fig-perimeter', '0 0 444 350', 'Community perimeter from above: outer hedge, ditch and berm with an obstacle belt, an inner wall with watchtowers at each corner whose views overlap, a single gate, and buildings inside',
    b, 'Layers buy time: anyone approaching meets the hedge and ditch, then the obstacle belt, then the wall, all in view of at least two towers. Keep one gate, and make sure the towers can see it.')

# 7 ── Off-grid solar wiring ───────────────────────────────────────────────────────
b = AH('so')
def blk(x, y, w, h, title, lines, cls, k):
    s = '<g data-hl="%s">' % k + box(x, y, w, h, cls) + T(x + w / 2, y + 18, title, 'dg-tb dg-tb-sm', 'mid')
    return s + ''.join(T(x + w / 2, y + 32 + j * 12, l, 'dg-ts', 'mid') for j, l in enumerate(lines)) + '</g>'
def fuse(x, y, vert=False):
    return '<rect class="dg-key" x="%d" y="%d" width="%d" height="%d" rx="2"/>' % ((x - 4, y - 8, 8, 16) if vert else (x - 8, y - 4, 16, 8))
b += blk(8, 44, 112, 78, 'SOLAR PANELS', ['12–48 V DC', 'series or parallel'], 'dg-water', 'pv')
b += '<g data-hl="pv">' + ''.join('<rect class="dg-line" x="%d" y="%d" width="22" height="10" fill="none" stroke-width="1"/>' % (22 + c * 28, 94 + r * 13) for c in range(3) for r in range(2)) + '</g>'
b += blk(166, 44, 112, 78, 'CHARGE', ['CONTROLLER', 'MPPT or PWM', 'stops overcharging'], 'dg-panel', 'cc')
b += blk(324, 44, 112, 78, 'BATTERY BANK', ['12 / 24 / 48 V', 'lead-acid or LiFePO₄', '100–400 Ah'], 'dg-key', 'bat')
b += blk(166, 196, 112, 78, 'INVERTER', ['DC → AC', 'pure sine for', 'everything'], 'dg-panel', 'inv')
b += blk(8, 196, 112, 78, 'AC LOADS', ['120 / 240 V', 'appliances'], 'dg-panel', 'ac')
b += blk(324, 196, 112, 78, 'DC LOADS', ['12 V lights,', 'USB, fans'], 'dg-panel', 'dc')
for (x1, x2) in ((120, 166), (278, 324)):
    b += '<path class="dg-red-s" d="M%d 74 L%d 74"/><path class="dg-line" d="M%d 92 L%d 92"/>' % (x1, x2, x1, x2) + fuse((x1 + x2) / 2, 74)
b += '<path class="dg-red-s" d="M360 122 L360 164 L248 164 L248 196"/><path class="dg-line" d="M372 122 L372 176 L262 176 L262 196"/>' + fuse(360, 142, True)
b += '<path class="dg-red-s" d="M400 122 L400 196"/><path class="dg-line" d="M412 122 L412 196"/>' + fuse(400, 160, True)
b += '<path class="dg-key-s" d="M166 235 L120 235" stroke-width="3"/><path class="dg-key-s" d="M166 245 L120 245" stroke-width="3" stroke-dasharray="2 3"/>'
b += T(222, 22, 'OFF-GRID SOLAR — HOW IT IS WIRED', 'dg-th', 'mid')
b += '<path class="dg-red-s" d="M10 300 l20 0"/>' + T(36, 304, 'positive (+)', 'dg-ts') + '<path class="dg-line" d="M110 300 l20 0"/>' + T(136, 304, 'negative (−)', 'dg-ts')
b += '<path class="dg-key-s" d="M210 300 l20 0" stroke-width="3"/>' + T(236, 304, 'AC', 'dg-ts') + fuse(272, 300) + T(286, 304, 'fuse or breaker', 'dg-ts')
b += T(8, 322, 'Fuse every positive wire, as close to the battery as you can.', 'dg-ts') + T(8, 334, 'Size each wire for the current it carries.', 'dg-ts')
F['solar'] = fig('fig-solar', '0 0 444 342', 'Off-grid solar wiring: panels to charge controller to battery bank; the battery feeds DC loads directly and AC loads through an inverter; a fuse on every positive wire',
    b, 'Power flows from the panels through the charge controller into the battery; everything else runs from the battery. A pure-sine inverter runs anything. A modified-sine one is cheaper, but motors run hotter on it and some electronics and chargers will not work properly.')

# 8–9 ── Turning star charts ────────────────────────────────────────────────────
NORTH = {'Polaris': (2.530, 89.26, 2.0), 'Dubhe': (11.062, 61.75, 1.8), 'Merak': (11.031, 56.38, 2.3), 'Phecda': (11.897, 53.69, 2.4), 'Megrez': (12.257, 57.03, 3.3),
         'Alioth': (12.900, 55.96, 1.8), 'Mizar': (13.399, 54.93, 2.2), 'Alkaid': (13.792, 49.31, 1.9),
         'Yildun': (17.537, 86.59, 4.3), 'eUMi': (16.766, 82.04, 4.2), 'zUMi': (15.734, 77.79, 4.3), 'hUMi': (16.292, 75.76, 4.9), 'Kochab': (14.845, 74.16, 2.1), 'Pherkad': (15.345, 71.83, 3.0),
         'Capella': (5.278, 46.00, 0.1), 'Deneb': (20.690, 45.28, 1.3), 'Caph': (0.153, 59.15, 2.3), 'Schedar': (0.675, 56.54, 2.2), 'gCas': (0.945, 60.72, 2.4), 'Ruchbah': (1.430, 60.24, 2.7), 'Segin': (1.907, 63.67, 3.4)}
SOUTH = {'Acrux': (12.443, -63.10, 0.8), 'Mimosa': (12.795, -59.69, 1.3), 'Gacrux': (12.519, -57.11, 1.6), 'dCru': (12.252, -58.75, 2.8),
         'aCen': (14.660, -60.83, -0.3), 'bCen': (14.064, -60.37, 0.6), 'Canopus': (6.399, -52.70, -0.7), 'Achernar': (1.629, -57.24, 0.5),
         'eCar': (8.375, -59.51, 1.9), 'dVel': (8.745, -54.71, 2.0), 'kVel': (9.368, -55.01, 2.5), 'iCar': (9.285, -59.28, 2.2)}
def rstar(m): return max(1.6, 4.6 - 0.9 * m)
def sky(fid, stars, cx, cy, k, base, sign, lines, labels, extra, spin, title, horizon, label, cap):
    """Azimuthal projection about the celestial pole. sign=-1: RA runs clockwise (facing north)."""
    pos = {}
    for n, (ra, dec, mag) in stars.items():
        r = k * (90 - abs(dec)); th = math.radians(base + sign * ra * 15)
        pos[n] = (cx + r * math.cos(th), cy - r * math.sin(th), mag)
    rim = k * 48
    s = AH(fid[-5:])
    s += '<circle class="dg-panel" cx="%d" cy="%d" r="%.1f"/>' % (cx, cy, rim)
    s += ''.join('<circle class="dg-guide" cx="%d" cy="%d" r="%.1f" opacity=".5"/>' % (cx, cy, k * d) for d in (15, 30, 45))
    g = ''
    for a, z, cls in lines:
        g += '<line class="%s" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke-width="1.4"/>' % (cls, pos[a][0], pos[a][1], pos[z][0], pos[z][1])
    g += extra(pos)
    g += ''.join('<circle class="dg-white" cx="%.1f" cy="%.1f" r="%.1f"/>' % (x, y, rstar(m)) for x, y, m in pos.values())
    for text, cls, at, dx, dy, hl in labels:
        x, y = (pos[at][0], pos[at][1]) if isinstance(at, str) else at
        g += '<g class="dg-sky-lab">%s</g>' % T(round(x + dx, 1), round(y + dy, 1), text, cls, 'mid', hl)
    s += '<g class="dg-skyturn %s" style="transform-origin:%dpx %dpx">%s</g>' % (spin, cx, cy, g)
    s += horizon
    s += T(222, 18, title, 'dg-th', 'mid')
    return fig(fid, '0 0 444 444', label, s, cap)

def north_extra(p):
    dx, dy = p['Dubhe'][0] - p['Merak'][0], p['Dubhe'][1] - p['Merak'][1]
    return ('<path class="dg-key-s" d="M%.1f %.1f L%.1f %.1f" stroke-dasharray="5 4" stroke-width="1.6" data-hl="pointer"/>' % (p['Dubhe'][0] + dx * .2, p['Dubhe'][1] + dy * .2, p['Polaris'][0], p['Polaris'][1])
            + '<circle class="dg-key-s" cx="%.1f" cy="%.1f" r="9" fill="none"/>' % (p['Polaris'][0], p['Polaris'][1]))
NL = [('Dubhe', 'Merak', 'dg-thin'), ('Merak', 'Phecda', 'dg-thin'), ('Phecda', 'Megrez', 'dg-thin'), ('Megrez', 'Dubhe', 'dg-thin'), ('Megrez', 'Alioth', 'dg-thin'), ('Alioth', 'Mizar', 'dg-thin'), ('Mizar', 'Alkaid', 'dg-thin'),
      ('Polaris', 'Yildun', 'dg-thin'), ('Yildun', 'eUMi', 'dg-thin'), ('eUMi', 'zUMi', 'dg-thin'), ('zUMi', 'hUMi', 'dg-thin'), ('hUMi', 'Pherkad', 'dg-thin'), ('Pherkad', 'Kochab', 'dg-thin'), ('Kochab', 'zUMi', 'dg-thin'),
      ('Caph', 'Schedar', 'dg-thin'), ('Schedar', 'gCas', 'dg-thin'), ('gCas', 'Ruchbah', 'dg-thin'), ('Ruchbah', 'Segin', 'dg-thin')]
NLAB = [('POLARIS', 'dg-tb', 'Polaris', 0, -14, 'pointer'), ('BIG DIPPER', 'dg-tb dg-tb-sm', 'Megrez', 0, -16, None), ('pointers', 'dg-ts', 'Merak', -10, 16, 'pointer'),
        ('LITTLE DIPPER', 'dg-ts', 'Kochab', 0, 20, None), ('CASSIOPEIA', 'dg-tb dg-tb-sm', 'gCas', 0, -14, None), ('the W', 'dg-ts', 'gCas', 0, 22, None), ('Capella', 'dg-ts', 'Capella', 0, 16, None), ('Deneb', 'dg-ts', 'Deneb', 0, 16, None)]
HZ_N = (T(222, 436, 'N — horizon (Polaris stands as high as your latitude)', 'dg-ts', 'mid') + T(14, 226, 'W', 'dg-tb') + T(430, 226, 'E', 'dg-tb', 'end')
        + T(14, 46, 'facing north', 'dg-ts') + T(430, 46, 'the sky turns ↺', 'dg-ts', 'end') + T(430, 58, 'round Polaris', 'dg-ts', 'end'))
F['skynorth'] = sky('fig-sky-north', NORTH, 222, 226, 4.0, 321, -1, NL, NLAB, north_extra, 'dg-sky-ccw', 'NORTHERN SKY — LOOKING NORTH', HZ_N,
    'Northern sky facing north: the Big Dipper’s two pointer stars lead to Polaris; Cassiopeia’s W is on the other side; the stars turn anticlockwise around Polaris',
    'Follow the Big Dipper’s two <strong>pointer stars</strong> about 5 times their gap to <strong>Polaris</strong>, which is within 1° of true north. When the Dipper is low, use Cassiopeia’s W on the opposite side. The whole sky turns anticlockwise round Polaris once a day; here, once every 2 minutes (hover or tap to pause). Polaris itself barely moves.')

def south_extra(p):
    gx, gy, ax, ay = p['Gacrux'][0], p['Gacrux'][1], p['Acrux'][0], p['Acrux'][1]
    ex, ey = ax + (ax - gx) * 4.5, ay + (ay - gy) * 4.5
    mx, my = (p['aCen'][0] + p['bCen'][0]) / 2, (p['aCen'][1] + p['bCen'][1]) / 2
    return ('<path class="dg-key-s" d="M%.1f %.1f L%.1f %.1f" stroke-dasharray="5 4" stroke-width="1.6" data-hl="cross"/>' % (ax, ay, ex, ey)
            + '<path class="dg-blue-s" d="M%.1f %.1f L%d %d" stroke-dasharray="3 4" stroke-width="1.4" data-hl="pointers"/>' % (mx, my, 222, 222)
            + '<path class="dg-line" d="M214 222 l16 0 M222 214 l0 16" stroke-width="1.6"/>'
            + '<ellipse class="dg-white" cx="%.1f" cy="%.1f" rx="14" ry="9" opacity=".25"/>' % (222 + 4.2 * 20.2 * math.cos(math.radians(-127.5 + 5.39 * 15)), 222 - 4.2 * 20.2 * math.sin(math.radians(-127.5 + 5.39 * 15)))
            + '<ellipse class="dg-white" cx="%.1f" cy="%.1f" rx="8" ry="5" opacity=".25"/>' % (222 + 4.2 * 17.2 * math.cos(math.radians(-127.5 + 0.88 * 15)), 222 - 4.2 * 17.2 * math.sin(math.radians(-127.5 + 0.88 * 15))))
SL = [('Acrux', 'Gacrux', 'dg-thin'), ('Mimosa', 'dCru', 'dg-thin'), ('eCar', 'iCar', 'dg-guide'), ('dVel', 'kVel', 'dg-guide')]
LMC = (222 + 4.2 * 20.2 * math.cos(math.radians(-127.5 + 5.39 * 15)), 222 - 4.2 * 20.2 * math.sin(math.radians(-127.5 + 5.39 * 15)))
SMC = (222 + 4.2 * 17.2 * math.cos(math.radians(-127.5 + 0.88 * 15)), 222 - 4.2 * 17.2 * math.sin(math.radians(-127.5 + 0.88 * 15)))
SLAB = [('SOUTHERN', 'dg-tb dg-tb-sm', 'Gacrux', 46, -4, 'cross'), ('CROSS', 'dg-tb dg-tb-sm', 'Gacrux', 46, 9, 'cross'), ('POINTERS', 'dg-tb dg-tb-sm', 'aCen', -6, -14, 'pointers'), ('α and β Centauri', 'dg-ts', 'aCen', 0, 18, 'pointers'),
        ('Canopus', 'dg-ts', 'Canopus', 0, 16, None), ('Achernar', 'dg-ts', 'Achernar', 0, 16, None), ('False Cross:', 'dg-ts', 'kVel', 0, -12, None), ('dimmer, no pointers', 'dg-ts', 'eCar', 0, 18, None),
        ('Magellanic Clouds', 'dg-ts', (LMC[0] / 2 + SMC[0] / 2, LMC[1] / 2 + SMC[1] / 2), 0, 26, None), ('SOUTH POLE', 'dg-tb dg-tb-sm', (222, 222), 0, 22, 'cross'), ('(no bright star)', 'dg-ts', (222, 222), 0, 34, 'cross')]
HZ_S = (T(222, 436, 'S — horizon (the pole stands as high as your latitude)', 'dg-ts', 'mid') + T(14, 226, 'E', 'dg-tb') + T(430, 226, 'W', 'dg-tb', 'end')
        + T(14, 46, 'facing south', 'dg-ts') + T(430, 46, 'the sky turns ↻', 'dg-ts', 'end') + T(430, 58, 'round the pole', 'dg-ts', 'end'))
F['skysouth'] = sky('fig-sky-south', SOUTH, 222, 222, 4.2, -127.5, 1, SL, SLAB, south_extra, 'dg-sky-cw', 'SOUTHERN SKY — LOOKING SOUTH', HZ_S,
    'Southern sky facing south: extend the Southern Cross’s long axis about 4.5 times to the south celestial pole; the pointer stars confirm it is the real cross; the sky turns clockwise around the pole',
    'Extend the <strong>Southern Cross</strong>’s long axis about 4.5 times its length to find the south celestial pole, then drop straight down to the horizon for due south. A line from between the <strong>pointers</strong> meets it near the same spot. The False Cross is bigger, dimmer and has no pointers. The sky turns clockwise round the pole; here, once every 2 minutes.')

# 10 ── Star signposts (two panels) ─────────────────────────────────────────────────
def flat(stars, ra0, dec0, cx, cy, k):
    c = math.cos(math.radians(dec0)); out = {}
    for n, (ra, dec, m) in stars.items():
        out[n] = (cx - (ra - ra0) * 15 * c * k, cy - (dec - dec0) * k, m)
    return out
b = AH('sg')
b += panel(2, 2, 216, 300, 'SPRING: ARC TO ARCTURUS')
ARC = {'Dubhe': (11.062, 61.75, 1.8), 'Merak': (11.031, 56.38, 2.3), 'Phecda': (11.897, 53.69, 2.4), 'Megrez': (12.257, 57.03, 3.3), 'Alioth': (12.900, 55.96, 1.8),
       'Mizar': (13.399, 54.93, 2.2), 'Alkaid': (13.792, 49.31, 1.9), 'Arcturus': (14.261, 19.18, -0.05)}
p = flat(ARC, 12.6, 40, 128, 140, 4.0)
for a, z in (('Dubhe', 'Merak'), ('Merak', 'Phecda'), ('Phecda', 'Megrez'), ('Megrez', 'Dubhe'), ('Megrez', 'Alioth'), ('Alioth', 'Mizar'), ('Mizar', 'Alkaid')):
    b += '<line class="dg-thin" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (p[a][0], p[a][1], p[z][0], p[z][1])
b += '<path class="dg-key-s" d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" stroke-dasharray="5 4" stroke-width="1.6" marker-end="url(#ah-sg)"/>' % (
    p['Alkaid'][0] - 4, p['Alkaid'][1] + 6, p['Alkaid'][0] - 30, p['Arcturus'][1] - 50, p['Arcturus'][0] + 6, p['Arcturus'][1] - 8)
b += ''.join('<circle class="dg-white" cx="%.1f" cy="%.1f" r="%.1f"/>' % (x, y, rstar(m)) for x, y, m in p.values())
b += T(round(p['Megrez'][0]), round(p['Megrez'][1]) - 14, 'BIG DIPPER', 'dg-tb dg-tb-sm', 'mid') + T(round(p['Arcturus'][0]), round(p['Arcturus'][1]) + 20, 'ARCTURUS', 'dg-tb', 'mid')
b += T(110, 262, 'follow the curve of the handle', 'dg-ts', 'mid') + T(110, 274, 'away from the bowl to the', 'dg-ts', 'mid') + T(110, 286, 'bright orange star', 'dg-ts', 'mid')
b += panel(226, 2, 216, 300, 'WINTER: ORION')
ORI = {'Betelgeuse': (5.919, 7.41, 0.5), 'Rigel': (5.242, -8.20, 0.1), 'Bellatrix': (5.418, 6.35, 1.6), 'Saiph': (5.796, -9.67, 2.1),
       'Alnitak': (5.679, -1.94, 1.8), 'Alnilam': (5.604, -1.20, 1.7), 'Mintaka': (5.533, -0.30, 2.2), 'Sirius': (6.752, -16.72, -1.5)}
p = flat(ORI, 5.95, -5, 334, 118, 5.4)
for a, z in (('Betelgeuse', 'Alnitak'), ('Bellatrix', 'Mintaka'), ('Alnitak', 'Saiph'), ('Mintaka', 'Rigel'), ('Betelgeuse', 'Bellatrix'), ('Alnitak', 'Alnilam'), ('Alnilam', 'Mintaka')):
    b += '<line class="dg-thin" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (p[a][0], p[a][1], p[z][0], p[z][1])
dx, dy = p['Alnitak'][0] - p['Mintaka'][0], p['Alnitak'][1] - p['Mintaka'][1]
b += '<path class="dg-key-s" d="M%.1f %.1f L%.1f %.1f" stroke-dasharray="5 4" stroke-width="1.6" marker-end="url(#ah-sg)"/>' % (p['Alnitak'][0] + dx * .4, p['Alnitak'][1] + dy * .4, p['Sirius'][0] + 8, p['Sirius'][1] - 6)
b += ''.join('<circle class="dg-white" cx="%.1f" cy="%.1f" r="%.1f"/>' % (x, y, rstar(m)) for x, y, m in p.values())
b += T(round(p['Betelgeuse'][0]), round(p['Betelgeuse'][1]) - 10, 'Betelgeuse', 'dg-ts', 'mid') + T(round(p['Rigel'][0]), round(p['Rigel'][1]) + 16, 'Rigel', 'dg-ts', 'mid')
b += T(round(p['Mintaka'][0]) + 10, round(p['Mintaka'][1]) - 8, 'BELT', 'dg-tb dg-tb-sm') + T(round(p['Sirius'][0]), round(p['Sirius'][1]) + 20, 'SIRIUS', 'dg-tb', 'mid')
b += T(334, 250, 'the belt rises due east and', 'dg-ts', 'mid') + T(334, 262, 'sets due west; follow it down', 'dg-ts', 'mid') + T(334, 274, 'to Sirius, the brightest star,', 'dg-ts', 'mid') + T(334, 286, 'which crosses due south', 'dg-ts', 'mid')
F['signposts'] = fig('fig-sky-signposts', '0 0 444 304', 'Two star signposts: in spring follow the arc of the Big Dipper’s handle to Arcturus; in winter Orion’s belt rises due east and sets due west and points down to Sirius',
    b, 'Seen facing south with north at the top. Orion’s belt sits almost exactly on the celestial equator, so anywhere on Earth it rises due east and sets due west.')

# 11 ── Blast effects by yield (two panels) ─────────────────────────────────────────
b = ''
b += panel(2, 2, 440, 176, 'HOW FAR EACH EFFECT REACHES', 'airburst, drawn to scale')
YLD = [('1 kt', None, 0.45, None), ('10 kt', None, 1.0, 1.1), ('100 kt', 0.25, 2.1, 2.8), ('1 Mt', 0.6, 4.6, 7.0)]
SX = lambda mi: 66 + mi * 50
for i, (y_, fb, p5, burn) in enumerate(YLD):
    y = 50 + i * 26
    b += T(56, y + 9, y_, 'dg-tb dg-tb-sm', 'end')
    if burn: b += '<rect class="dg-earth" x="66" y="%d" width="%.1f" height="12" rx="3" data-hl="burn"/>' % (y, SX(burn) - 66)
    b += '<rect class="dg-key" x="66" y="%d" width="%.1f" height="12" rx="3" data-hl="p5"/>' % (y, SX(p5) - 66)
    if fb: b += '<rect class="dg-red" x="66" y="%d" width="%.1f" height="12" rx="2" data-hl="fb"/>' % (y, SX(fb) - 66)
b += '<line class="dg-thin" x1="66" y1="152" x2="416" y2="152"/>' + ''.join('<line class="dg-thin" x1="%d" y1="149" x2="%d" y2="155"/>' % (SX(m), SX(m)) + T(SX(m), 167, '%d mi' % m if m else '0', 'dg-ts', 'mid') for m in range(0, 8))
b += '<rect class="dg-red" x="252" y="56" width="12" height="10" data-hl="fb"/>' + T(270, 65, 'fireball', 'dg-ts', hl='fb')
b += '<rect class="dg-key" x="252" y="74" width="12" height="10" data-hl="p5"/>' + T(270, 83, '5 psi: most houses collapse', 'dg-ts', hl='p5')
b += '<rect class="dg-earth" x="252" y="92" width="12" height="10" data-hl="burn"/>' + T(270, 101, '3rd-degree burns (clear day)', 'dg-ts', hl='burn')
b += panel(2, 186, 440, 236, 'WHAT TO EXPECT — 1 Mt AIRBURST')
ZN = [(1.5, 'dg-red', '0–1.5 mi: fireball and 20 psi+; almost no survival above ground'), (3, 'dg-red', '1.5–3 mi: ~10 psi; most buildings collapse'),
      (5, 'dg-key', '3–5 mi: ~5 psi; houses collapse; shelter saves lives'), (10, 'dg-water', '5–10 mi: 1–3 psi; windows blown in — flying glass'), (11, 'dg-green', '10+ mi: light damage; ground bursts bring heavy fallout')]
GX, GY, k = 22, 404, 17
for i in range(len(ZN) - 1, -1, -1):
    r = ZN[i][0] * k
    b += '<path class="%s" d="M%d %d L%d %.1f A %.1f %.1f 0 0 1 %.1f %d Z" opacity="%s" data-hl="z%d"/>' % (ZN[i][1], GX, GY, GX, GY - r, r, r, GX + r, GY, '.25' if i == 4 else '.45', i)
b += '<circle class="dg-keyf" cx="%d" cy="%d" r="4"/>' % (GX, GY) + T(GX + 4, GY - 6, 'GZ', 'dg-tb dg-tb-sm')
for i, (mi, cls, t_) in enumerate(ZN):
    y = 222 + i * 30
    b += '<rect class="%s" x="226" y="%d" width="12" height="12" rx="2" data-hl="z%d"/>' % (cls, y - 10, i)
    parts = t_.split('; ', 1)
    b += T(244, y, parts[0], 'dg-tb dg-tb-sm', hl='z%d' % i) + T(244, y + 13, parts[1], 'dg-ts', hl='z%d' % i)
b += T(226, 378, 'Fallout drifts downwind for hundreds', 'dg-ts') + T(226, 390, 'of miles. A dirty bomb is an ordinary', 'dg-ts') + T(226, 402, 'blast; contamination may cover only', 'dg-ts') + T(226, 414, 'a few city blocks.', 'dg-ts')
F['blast'] = fig('fig-blast', '0 0 444 424', 'Nuclear blast effects: bars showing how far the fireball, 5 psi blast and third-degree burns reach for 1 kiloton to 1 megaton airbursts, and the damage zones around a 1 megaton airburst',
    b, 'Blast falls off quickly with distance; burns reach further on a clear day. Outside the blast zone the danger is <strong>fallout</strong>, and getting into the best shelter you can reach within minutes is what saves lives (see Fallout, below).')

# 12 ── De-escalation ladder ────────────────────────────────────────────────────────
b = AH('de')
b += box(130, 6, 184, 30, 'dg-hdrbg') + T(222, 26, 'CONFLICT DETECTED', 'dg-tb', 'mid') + arrow('M222 38 L222 52', 'de')
b += '<path class="dg-key" d="M222 54 L312 84 L222 114 L132 84 Z"/>' + T(222, 82, 'Is violence', 'dg-tb dg-tb-sm', 'mid') + T(222, 96, 'imminent?', 'dg-tb dg-tb-sm', 'mid')
b += T(222, 130, 'posturing, raised voices, weapons in sight?', 'dg-ts', 'mid')
b += arrow('M312 84 L338 84', 'de', 'dg-red-s') + T(320, 76, 'yes', 'dg-ts') + box(340, 58, 100, 54, 'dg-badbg') + T(390, 78, 'SEPARATE', 'dg-tb dg-tb-sm', 'mid') + T(390, 92, 'move them apart;', 'dg-ts', 'mid') + T(390, 104, 'clear onlookers', 'dg-ts', 'mid')
b += '<path class="dg-arrow" d="M406 114 L406 171 L374 171" marker-end="url(#ah-de)"/>' + T(412, 146, 'then', 'dg-ts')
b += arrow('M222 136 L222 148', 'de') + T(230, 146, 'no', 'dg-ts')
STP = [('1', 'SEPARATE AND COOL DOWN', 'neutral places, no audience, at least 20 minutes'), ('2', 'LISTEN TO EACH ALONE', '“What happened?” — no interrupting, no judging'),
       ('3', 'JOINT SESSION', 'name the needs, not the positions: “you both need X”'), ('4', 'AGREEMENT', 'write it down and both sign')]
for i, (n, h, l) in enumerate(STP):
    y = 150 + i * 56
    b += box(70, y, 302, 42, 'dg-okbg' if i == 3 else 'dg-panel') + num(88, y + 21, n) + T(104, y + 18, h, 'dg-tb dg-tb-sm') + T(104, y + 33, l, 'dg-ts')
    if i < 3: b += arrow('M222 %d L222 %d' % (y + 43, y + 55), 'de')
F['deescalate'] = fig('fig-deescalate', '0 0 444 376', 'Conflict de-escalation: if violence is imminent, separate the people and remove the audience first; then cool down for at least 20 minutes, listen to each alone, hold a joint session about needs, and write down the agreement',
    b, 'Safety first, talking second. Nobody resolves anything while angry and watched, so cool-down and privacy come before any discussion.')

# 13 ── Bug-out decision ─────────────────────────────────────────────────────────
b = AH('bo')
Q = [('Immediate danger to life where you are?', 'fire, flood, attack, collapse'), ('Water, food and shelter secure for 72 h+?', 'for the whole group'),
     ('Routes out open and safe?', 'not flooded, hostile or gridlocked'), ('Safe destination confirmed?', 'contact made, they expect you')]
OUT = [('yes', 'GO NOW', 'do not wait', 'dg-badbg', 'dg-red-s'), ('yes', 'STAY', 'monitor and prepare', 'dg-okbg', 'dg-green-s'),
       ('no', 'SHELTER IN PLACE', 'fortify, conserve', 'dg-okbg', 'dg-green-s'), ('yes', 'BUG OUT', 'tell others the route', 'dg-key', 'dg-key-s')]
for i, ((q, sub), (lab, h, s2, cls, acls)) in enumerate(zip(Q, OUT)):
    y = 34 + i * 70
    b += box(8, y, 262, 46, 'dg-panel') + num(24, y + 23, i + 1) + T(40, y + 21, q, 'dg-tb dg-tb-sm') + T(40, y + 36, sub, 'dg-ts')
    b += arrow('M272 %d L318 %d' % (y + 23, y + 23), 'bo', acls) + T(284, y + 17, lab, 'dg-ts')
    b += box(320, y + 2, 118, 42, cls) + T(379, y + 20, h, 'dg-tb dg-tb-sm', 'mid') + T(379, y + 35, s2, 'dg-ts', 'mid')
    if i < 3: b += arrow('M139 %d L139 %d' % (y + 47, y + 68), 'bo') + T(146, y + 62, 'yes' if i == 2 else 'no', 'dg-ts')
y = 34 + 3 * 70
b += arrow('M139 %d L139 %d' % (y + 47, y + 68), 'bo') + T(146, y + 62, 'no', 'dg-ts')
b += box(60, y + 70, 158, 42, 'dg-okbg') + T(139, y + 88, 'SHELTER IN PLACE', 'dg-tb dg-tb-sm', 'mid') + T(139, y + 103, 'keep finding options', 'dg-ts', 'mid')
b += T(222, 20, 'BUG OUT OR STAY? — ASK IN ORDER', 'dg-th', 'mid')
F['bugout'] = fig('fig-bugout', '0 0 444 362', 'Bug-out decision: immediate danger means go now; otherwise stay if supplies are secure for 72 hours; leave only if routes are safe and a destination is confirmed; otherwise shelter in place',
    b, 'Staying is the default: moving exposes you to hazards you cannot predict. Only an immediate threat, or a safe route <em>and</em> a confirmed destination, should move you. Never bug out without somewhere to go.')

# 14 ── Tunic layout (two panels) ───────────────────────────────────────────────────
b = ''
b += panel(2, 2, 270, 296, 'CUTTING LAYOUT', 'all straight cuts except the neck')
b += '<g data-hl="body"><rect class="dg-key" x="18" y="48" width="74" height="180" rx="2"/><rect class="dg-key" x="100" y="48" width="74" height="180" rx="2"/></g>'
b += '<path class="dg-panel" d="M42 48 Q55 66 68 48 Z"/>'
b += T(55, 140, 'FRONT', 'dg-tb dg-tb-sm', 'mid', 'body') + T(137, 140, 'BACK', 'dg-tb dg-tb-sm', 'mid', 'body')
b += '<g data-hl="sleeve"><path class="dg-earth" d="M184 48 L258 48 L246 154 L196 154 Z"/><path class="dg-earth" d="M184 160 L258 160 L246 266 L196 266 Z" opacity=".8"/></g>'
b += T(221, 100, 'SLEEVE', 'dg-tb dg-tb-sm', 'mid', 'sleeve') + T(221, 214, 'SLEEVE', 'dg-tb dg-tb-sm', 'mid', 'sleeve')
b += '<g data-hl="gusset"><rect class="dg-green" x="40" y="256" width="24" height="24"/><rect class="dg-green" x="72" y="256" width="24" height="24"/></g>' + T(104, 272, 'GUSSETS ~4 in square', 'dg-ts', hl='gusset')
b += T(55, 70, 'neck', 'dg-ts', 'mid') + T(96, 244, 'each: shoulders + 4 in wide', 'dg-ts', 'mid', 'body')
b += T(137, 290, 'length = shoulder to hem', 'dg-ts', 'mid', 'body') if False else ''
b += panel(278, 2, 164, 296, 'SEWN UP')
b += '<g data-hl="body"><path class="dg-key" d="M330 70 L390 70 L390 250 L330 250 Z"/></g>'
b += '<g data-hl="sleeve"><path class="dg-earth" d="M330 70 L290 160 L306 166 L330 116 Z M390 70 L430 160 L414 166 L390 116 Z"/></g>'
b += '<g data-hl="gusset"><path class="dg-green" d="M330 116 L322 104 L330 96 Z M390 116 L398 104 L390 96 Z"/></g>'
b += '<path class="dg-panel" d="M348 70 Q360 84 372 70 Z"/>'
b += T(360, 270, 'gusset in each armpit', 'dg-ts', 'mid', 'gusset') + T(360, 282, 'lets the arm move freely', 'dg-ts', 'mid', 'gusset')
F['tunic'] = fig('fig-tunic', '0 0 444 300', 'Tunic from rectangles: front and back body pieces, two tapered sleeves and two small square gussets; sewn up, with a gusset under each arm',
    b, 'Two body rectangles, two tapered sleeves, two small square gussets. Sew front to back at the shoulders, set in the sleeves with a gusset at each armpit, then sew the sides and sleeve seams. Scale the rectangles to fit anyone; belt it at the waist.')

# 15 ── Sashiko ────────────────────────────────────────────────────────────────────
b = ''
def swatch(x, title, inner, k):
    return '<g data-hl="%s">' % k + '<rect class="dg-water" x="%d" y="30" width="134" height="134" rx="6" opacity=".55"/>' % x + inner + T(x + 67, 184, title, 'dg-tb', 'mid') + '</g>'
ST = 'class="dg-thin" stroke-dasharray="6 4"'
g1 = ''.join('<line %s x1="%d" y1="40" x2="%d" y2="154" style="stroke:#f4f1e8;stroke-width:2"/>' % (ST, x, x) for x in range(24, 138, 19)) + ''.join('<line %s x1="12" y1="%d" x2="126" y2="%d" style="stroke:#f4f1e8;stroke-width:2"/>' % (ST, y, y) for y in range(49, 164, 19))
g2 = ''.join('<line %s x1="%d" y1="40" x2="%d" y2="154" style="stroke:#f4f1e8;stroke-width:2"/>' % (ST, x, x + 114) for x in range(-90, 120, 22)) + ''.join('<line %s x1="%d" y1="154" x2="%d" y2="40" style="stroke:#f4f1e8;stroke-width:2"/>' % (ST, x, x + 114) for x in range(-90, 120, 22))
g3 = ''
for row in range(5):
    for col in range(5):
        cx, cy = 12 + col * 28 + (14 if row % 2 else 0), 58 + row * 24
        for rr in (13, 8, 3.5):
            g3 += '<path %s style="stroke:#f4f1e8;stroke-width:2" d="M%.1f %.1f A %.1f %.1f 0 0 1 %.1f %.1f"/>' % (ST, cx - rr, cy, rr, rr, cx + rr, cy)
def clip(x, inner, cid):
    return ('<clipPath id="sk-%s"><rect x="%d" y="30" width="134" height="134" rx="6"/></clipPath><g clip-path="url(#sk-%s)"><g transform="translate(%d 0)">%s</g></g>'
            % (cid, x, cid, x, inner.replace('y1="40"', 'y1="30"').replace('y2="154"', 'y2="164"')))
b += swatch(6, 'Straight grid', clip(6, g1, 'c1'), 's1') + swatch(155, 'Diagonal grid', clip(155, g2, 'c2'), 's2') + swatch(304, 'Waves (seikaiha)', clip(304, g3, 'c3'), 's3')
b += T(222, 18, 'RUNNING STITCH OVER A PATCH OR THIN SPOT', 'dg-th', 'mid')
b += T(222, 206, 'stitch before the cloth fails: knees, elbows, seat', 'dg-ts', 'mid')
F['sashiko'] = fig('fig-sashiko', '0 0 444 214', 'Three sashiko reinforcement patterns in running stitch: a straight grid, a diagonal grid, and overlapping waves (seikaiha)',
    b, 'Twenty minutes of running stitch at a thin spot saves rebuilding a garment later. Layer patches underneath and stitch through them all (Japanese <em>boro</em> repair) to keep clothes going for years.')

# 16 ── Cargo bike ─────────────────────────────────────────────────────────────────
b = ''
RW, FW = (110, 196), (290, 196)
b += '<line class="dg-line" x1="10" y1="236" x2="434" y2="236"/>'
b += ''.join('<circle class="dg-line" cx="%d" cy="%d" r="40" fill="none"/><circle class="dg-thin" cx="%d" cy="%d" r="4" fill="none"/>' % (x, y, x, y) for x, y in (RW, FW))
b += '<path class="dg-line" d="M110 196 L176 196 L160 124 L110 196 M160 124 L262 124 L176 196 M262 124 L290 196 M258 112 L270 112 M262 124 L258 108 M160 124 L156 112 M148 112 L168 112" stroke-width="3"/>'
b += '<g data-hl="frame"><path class="dg-key" d="M168 130 L250 130 L180 186 Z"/></g>'
b += '<g data-hl="rear"><path class="dg-line" d="M80 132 L150 132 M88 132 L110 196" stroke-width="2"/><rect class="dg-earth" x="80" y="140" width="52" height="46" rx="6"/><rect class="dg-key" x="86" y="112" width="58" height="20" rx="3"/></g>'
b += '<g data-hl="front"><path class="dg-line" d="M268 150 L300 150 M296 150 L290 196" stroke-width="2"/><rect class="dg-earth" x="272" y="156" width="34" height="34" rx="5"/></g>'
b += '<g data-hl="trailer"><path class="dg-line" d="M74 196 L40 200 L4 200" stroke-width="2"/><rect class="dg-earth" x="-2" y="166" width="44" height="34" rx="4"/><circle class="dg-line" cx="22" cy="218" r="16" fill="none"/></g>'
b += T(222, 20, 'LOADING A BIKE — keep weight low and centred', 'dg-th', 'mid')
b += T(112, 50, 'REAR RACK + PANNIERS', 'dg-tb dg-tb-sm', 'mid', 'rear') + T(112, 64, 'the heaviest load; the rack’s', 'dg-ts', 'mid', 'rear') + T(112, 76, 'rating covers the panniers', 'dg-ts', 'mid', 'rear') + T(112, 88, '(often about 25 kg / 55 lb)', 'dg-ts', 'mid', 'rear') + lead(112, 94, 112, 112)
b += T(330, 50, 'FRONT LOW PANNIERS', 'dg-tb dg-tb-sm', 'mid', 'front') + T(330, 64, 'about 15 kg / 33 lb;', 'dg-ts', 'mid', 'front') + T(330, 76, 'mounted low they steady', 'dg-ts', 'mid', 'front') + T(330, 88, 'the steering', 'dg-ts', 'mid', 'front') + lead(320, 94, 296, 156)
b += T(200, 146, 'FRAME BAG', 'dg-ts', 'mid', 'frame')
b += T(8, 262, 'TRAILER: hitched at the rear axle; a two-wheel', 'dg-ts', hl='trailer') + T(8, 274, 'trailer takes the bulky loads (often ~45 kg / 100 lb)', 'dg-ts', hl='trailer')
b += T(8, 296, 'Together: 200+ lb.', 'dg-tb dg-tb-sm') + T(118, 296, 'Check the load rating stamped on each part.', 'dg-ts')
F['cargobike'] = fig('fig-cargobike', '-6 0 450 304', 'Loading a bicycle: rear rack with panniers for the heaviest load, low front panniers, dense items in a frame bag, and a trailer hitched at the rear axle',
    b, 'Load the rear first, then the front, keeping weight low, centred and even left to right. Pack heavy, dense items low in the panniers and the frame bag. Too much weight up high or at the back makes the front light and the steering wander.')


# ── swap them in ─────────────────────────────────────────────────────────────────
def swap(page, marker, html_, fid):
    p = os.path.join(ROOT, 'sections', page); s = open(p, encoding='utf-8').read()
    if 'id="%s"' % fid in s:
        i = s.rfind('<figure', 0, s.index('id="%s"' % fid)); j = s.index('</figure>', i) + 9
        open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'refreshed'
    k = s.index(marker); m = s.rfind('<svg', 0, k); e = s.index('</svg>', k) + 6
    assert 'dg-legacy' in s[m:s.index('>', m)], (page, marker)
    fo, fc = s.rfind('<figure', 0, m), s.rfind('</figure>', 0, m)
    if fo > fc and s.index('</figure>', e) - e < 2500:
        i, j = fo, s.index('</figure>', e) + 9
    else:
        i, j = m, e
    open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'replaced'


JOBS = [('agriculture.html', 'aria-label="Soil texture triangle', 'soiltri'),
        ('agriculture.html', 'aria-label="4-year crop rotation', 'rotation'),
        ('agriculture.html', 'aria-label="Companion planting wheel', 'companion'),
        ('agriculture.html', 'aria-label="Swale on contour', 'swale'),
        ('agriculture.html', 'aria-label="Basic aquaponics', 'aquaponics'),
        ('build-structures.html', 'COMMUNITY DEFENSIVE PERIMETER', 'perimeter'),
        ('energy.html', '>SOLAR PANELS<', 'solar'),
        ('navigation.html', 'NORTHERN HEMISPHERE — LOOKING NORTH', 'skynorth'),
        ('navigation.html', 'SOUTHERN HEMISPHERE — LOOKING SOUTH', 'skysouth'),
        ('navigation.html', 'aria-label="Northern Hemisphere Star Chart', 'signposts'),
        ('nbc.html', 'Blast Radius Comparison by Yield', 'blast'),
        ('psychology.html', 'aria-label="Conflict de-escalation', 'deescalate'),
        ('security.html', 'EMERGENCY SITUATION', 'bugout'),
        ('textiles.html', 'aria-label="Medieval tunic', 'tunic'),
        ('textiles.html', 'aria-label="Three sashiko', 'sashiko'),
        ('vehicles.html', 'BICYCLE CARGO SETUP', 'cargobike')]

if __name__ == '__main__':
    for page, marker, key in JOBS:
        fid = re.search(r'id="([^"]+)"', F[key]).group(1)
        print('%-22s %-20s %s' % (page, fid, swap(page, marker, F[key], fid)))
