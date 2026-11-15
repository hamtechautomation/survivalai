#!/usr/bin/env python3
"""Draws the car-alternator generator rig (Salvage §8) with numbered marks matching its five steps,
and puts it after the steps. Run again after editing:  python3 tools/altrig.py"""
import os, math, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
o = []
def a(s): o.append(s)
T = lambda x, y, t, c='dg-ts', an='': a('<text class="%s%s" x="%g" y="%g">%s</text>' % (c, ' dg-' + an if an else '', x, y, t))
def num(x, y, n): a('<circle class="dg-keyf" cx="%g" cy="%g" r="9"/><text class="dg-num dg-mid" x="%g" y="%g">%d</text>' % (x, y, x, y + 4, n))
a('<defs><marker id="ah-alt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>')
T(222, 18, 'CAR-ALTERNATOR GENERATOR RIG', 'dg-th', 'mid')
# base plank
a('<rect class="dg-wood" x="12" y="214" width="330" height="14" rx="2"/>')
a('<rect x="262" y="218" width="56" height="6" rx="3" fill="#1a140c"/>')
# engine
a('<rect class="dg-panel" x="22" y="84" width="128" height="130" rx="8"/>')
for i in range(7): a('<line class="dg-thin" x1="30" y1="%d" x2="58" y2="%d"/>' % (96 + i * 8, 96 + i * 8))
a('<rect class="dg-panel" x="40" y="58" width="44" height="26" rx="4"/>'); T(62, 75, 'fuel', 'dg-ts', 'mid')
T(86, 206, 'small engine', 'dg-tb dg-tb-sm', 'mid')
T(86, 248, 'mower or tiller, 2 hp+, ~3,000 RPM', 'dg-ts', 'mid')
# pulleys and belt
X1, X2, Y, R1, R2 = 108, 300, 146, 40, 15
al = math.asin((R1 - R2) / (X2 - X1))
pt = lambda x, r, s: (x + s * r * math.sin(al), Y - s * r * math.cos(al))
(ax, ay), (bx, by), (cx, cy), (dx, dy) = pt(X1, R1, 1), pt(X2, R2, 1), pt(X2, R2, -1), pt(X1, R1, -1)
a('<circle cx="%g" cy="%g" r="42" fill="#4b5157" stroke="#2a2e32" stroke-width="2"/>' % (X2, Y))
for k in range(8):
    t = k * math.pi / 4; a('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#2a2e32" stroke-width="3"/>' % (X2 + 24 * math.cos(t), Y + 24 * math.sin(t), X2 + 36 * math.cos(t), Y + 36 * math.sin(t)))
a('<path d="M%.1f %.1f L%.1f %.1f A%g %g 0 0 1 %.1f %.1f L%.1f %.1f A%g %g 0 1 1 %.1f %.1f Z" fill="none" stroke="#8a7a66" stroke-width="6" stroke-linejoin="round"/>' % (ax, ay, bx, by, R2, R2, cx, cy, dx, dy, R1, R1, ax, ay))
a('<circle class="dg-panel" cx="%g" cy="%g" r="%g"/><circle class="dg-line" cx="%g" cy="%g" r="%g" fill="none"/><circle class="dg-keyf" cx="%g" cy="%g" r="4"/>' % (X1, Y, R1 - 3, X1, Y, R1 - 9, X1, Y))
a('<circle class="dg-panel" cx="%g" cy="%g" r="%g"/><circle class="dg-keyf" cx="%g" cy="%g" r="3"/>' % (X2, Y, R2 - 3, X2, Y))
T(X2, 204, 'alternator', 'dg-tb dg-tb-sm', 'mid')
T(204, 196, 'big pulley drives small', 'dg-ts', 'mid'); T(204, 208, '2–3× faster', 'dg-ts', 'mid')
# terminals on the alternator: B+ stud and lamp (D+/L) terminal
a('<circle class="dg-redf" cx="318" cy="112" r="4"/>'); T(326, 104, 'B+', 'dg-ts')
a('<circle class="dg-keyf" cx="282" cy="110" r="3.4"/>'); T(277, 102, 'lamp terminal (D+ / L)', 'dg-ts', 'end')
# battery
a('<rect class="dg-panel" x="372" y="170" width="62" height="44" rx="4"/>')
a('<rect class="dg-redf" x="380" y="163" width="12" height="7"/><rect x="414" y="163" width="12" height="7" fill="#9aa"/>')
T(376, 168, '+', 'dg-tb', 'end'); T(420, 160, '−', 'dg-tb', 'mid'); T(403, 197, '12 V', 'dg-tb dg-tb-sm', 'mid')
# output wire with fuse
a('<path class="dg-red-s" fill="none" d="M318 112 V90 H386 V163"/>')
a('<rect x="372" y="104" width="28" height="12" rx="3" fill="#f2c94c" stroke="#c9a227"/>'); T(406, 114, 'fuse', 'dg-ts')
# negative: frame to battery −
a('<path class="dg-line" fill="none" d="M330 178 L350 234 H442 V156 H420 V163"/>'); T(442, 250, 'frame → battery −', 'dg-ts', 'end')
# exciter lamp and switch from battery + (taken from the fuse side) to the lamp terminal
a('<path class="dg-blue-s" fill="none" d="M386 132 H430 V48 H300 V70 M300 82 V96 H282 V110"/>')
a('<circle cx="300" cy="76" r="8" fill="#ffd25a" opacity=".85"/><circle class="dg-line" cx="300" cy="76" r="8" fill="none"/>')
T(312, 72, '3–5 W lamp:', 'dg-ts'); T(312, 83, 'lit = not charging', 'dg-ts')
a('<circle class="dg-white" cx="370" cy="48" r="3"/><circle class="dg-white" cx="392" cy="48" r="3"/><line class="dg-line" x1="370" y1="48" x2="390" y2="38"/>')
T(381, 32, 'switch', 'dg-ts', 'mid')
# numbers
num(36, 72, 1); num(204, 146, 2); num(436, 64, 3); num(358, 98, 4); num(232, 240, 5)
T(245, 244, 'slide to tension', 'dg-ts')
svg = '<svg viewBox="0 0 444 256" role="img" aria-label="A small engine’s big pulley drives a car alternator’s small pulley by a belt; the alternator’s B+ stud charges a 12 V battery through a fuse; a lamp and switch from the battery feed the lamp terminal to excite it; both are bolted to one plank, the alternator in slots for belt tension">' + ''.join(o) + '</svg>'
fig = ('<figure class="dg" id="fig-alt-rig">\n      ' + svg + '\n      <figcaption>The numbers match the steps above. '
       '<strong>Turn the lamp switch off when the engine stops</strong>, or the field slowly drains the battery. Charge into the battery, never straight into equipment.</figcaption>\n    </figure>\n')
p = os.path.join(ROOT, 'sections', 'salvage.html'); s = open(p, encoding='utf-8').read()
s = re.sub(r'    <figure class="dg" id="fig-alt-rig">.*?</figure>\n', '', s, flags=re.S)
anchor = '  <p>Realistic expectations: 400–700&nbsp;W continuous from a mower-engine rig'
assert anchor in s
s = s.replace(anchor, '    ' + fig + anchor, 1)
open(p, 'w', encoding='utf-8').write(s)
print('alternator rig figure placed')
