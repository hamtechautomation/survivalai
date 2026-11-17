#!/usr/bin/env python3
"""Redraws of the ten weakest older diagrams, in the shared .dg style (theme-aware, print-ready,
tap-to-enlarge, draw-in). Run once:  python3 tools/redraw.py   (safe to run again).

Every label is taken from the diagram it replaces or from the section text beside it.
Corrections made on the way are listed in docs/DIAGRAMS.md ("Redrawn diagrams").

Running it again rewrites each figure as a single drawing, so afterwards re-split the multi-panel ones:
  node tools/split-panels.js sections/vehicles.html fig-fourstroke:4:2
  node tools/split-panels.js sections/metallurgy.html fig-bellows:2:1
  node tools/split-panels.js sections/medicine-making.html fig-tincture:3:2
  node tools/split-panels.js sections/build-power.html fig-waterwheels:3:1
"""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def T(x, y, s, c='dg-ts', a='start', hl=None):
    return '<text class="%s%s" x="%s" y="%s"%s>%s</text>' % (c, {'start': '', 'mid': ' dg-mid', 'end': ' dg-end'}[a], x, y, ' data-hl="%s"' % hl if hl else '', s)


def AH(i):
    return '<defs><marker id="ah-%s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>' % i


def lead(x1, y1, x2, y2):
    return '<line class="dg-thin" x1="%s" y1="%s" x2="%s" y2="%s"/><circle class="dg-keyf" cx="%s" cy="%s" r="2.2"/>' % (x1, y1, x2, y2, x2, y2)


def num(x, y, n):
    return '<circle class="dg-keyf" cx="%s" cy="%s" r="9"/>' % (x, y) + T(x, y + 4, str(n), 'dg-num', 'mid')


def G(k, inner):
    return '<g data-hl="%s">%s</g>' % (k, inner)


def fig(fid, vb, label, body, cap):
    return ('<figure class="dg" id="%s">\n      <svg viewBox="%s" role="img" aria-label="%s">%s</svg>\n      <figcaption>%s</figcaption>\n    </figure>' % (fid, vb, label, body, cap))


F = {}

# 1 ── Boot: welt construction, cross-section through the ball of the foot ──────────
b = ''
b += '<path class="dg-guide" d="M150 118 Q150 46 222 44 Q294 46 294 118 Z"/>' + T(222, 92, 'last', 'dg-ts', 'mid') + T(222, 105, '(foot form, taken out)', 'dg-ts', 'mid')
b += G('upper', '<path class="dg-leather" d="M124 150 L124 118 Q124 26 222 24 Q320 26 320 118 L320 150 L308 150 L308 122 Q308 38 222 36 Q136 38 136 122 L136 150 Z"/>'
       '<path class="dg-leather" d="M124 150 L152 150 L152 142 L136 142 Z M320 150 L292 150 L292 142 L308 142 Z"/>')
b += G('insole', '<rect class="dg-key" x="140" y="126" width="164" height="14" rx="2"/>')
b += G('welt', '<rect class="dg-green" x="92" y="150" width="62" height="9" rx="2"/><rect class="dg-green" x="290" y="150" width="62" height="9" rx="2"/>')
b += G('outsole', '<rect class="dg-debris" x="88" y="161" width="268" height="17" rx="3"/>')
b += G('s1', '<path class="dg-stitch" d="M146 128 L146 158 M298 128 L298 158"/>')
b += G('s2', '<path class="dg-stitch dg-stitch2" d="M106 151 L106 177 M338 151 L338 177"/>')
b += '<line class="dg-line" x1="40" y1="186" x2="404" y2="186"/>'
b += T(8, 30, 'UPPER', 'dg-tb', hl='upper') + T(8, 43, 'wet-formed', hl='upper') + T(8, 55, 'leather, edge', hl='upper') + T(8, 67, 'tucked under', hl='upper') + lead(62, 26, 130, 60)
b += T(436, 100, 'INSOLE', 'dg-tb', 'end', 'insole') + T(436, 113, 'medium leather', 'dg-ts', 'end', 'insole') + lead(366, 104, 300, 132)
b += T(8, 122, 'WELT', 'dg-tb', hl='welt') + T(8, 135, 'narrow strip all', hl='welt') + T(8, 147, 'round the edge', hl='welt') + lead(74, 150, 96, 154)
b += T(436, 212, 'OUTSOLE', 'dg-tb', 'end', 'outsole') + T(436, 225, 'heavy veg-tan leather or tyre rubber', 'dg-ts', 'end', 'outsole') + lead(340, 208, 320, 172)
b += T(8, 212, 'stitch 1: upper + insole + welt', 'dg-ts', hl='s1') + T(8, 226, 'stitch 2: welt + outsole only', 'dg-tb', hl='s2')
F['welt'] = fig('fig-welt', '0 0 444 234', 'Welted boot in cross-section: upper, insole, welt and outsole, with the two rows of stitching',
    b, 'The welt is the trick. The outsole is sewn <strong>only to the welt</strong>, never to the upper. When the sole wears through, cut stitch 2, sew on a new sole, and the upper carries on for many more soles.')

# 2 ── Downdraft wood gasifier ────────────────────────────────────────────────────
b = AH('gas')
b += '<path class="dg-line" d="M40 22 L160 22 L160 150 L124 182 L140 216 L160 216 L160 252 L40 252 L40 216 L60 216 L76 182 L40 150 Z"/>'
b += '<path class="dg-earth" d="M42 24 L158 24 L158 86 L42 86 Z"/>' + T(100, 46, 'FUEL HOPPER', 'dg-tb', 'mid') + T(100, 60, 'hardwood chunks,', 'dg-ts', 'mid') + T(100, 73, '2–3 in across', 'dg-ts', 'mid')
b += '<path class="dg-debris" d="M42 88 L158 88 L158 118 L42 118 Z" opacity=".75"/>' + T(100, 107, 'DRYING', 'dg-tb', 'mid')
b += '<path class="dg-debris" d="M42 120 L158 120 L158 149 L42 149 Z"/>' + T(100, 139, 'PYROLYSIS', 'dg-tb', 'mid')
b += '<path class="dg-red" d="M44 152 L156 152 L123 181 L77 181 Z"/>' + T(100, 171, 'BURN', 'dg-tb', 'mid')
b += '<path class="dg-key" d="M77 184 L123 184 L138 214 L62 214 Z"/>' + T(100, 204, 'REDUCE', 'dg-tb', 'mid')
b += '<line class="dg-line" x1="50" y1="218" x2="150" y2="218" stroke-dasharray="6 4"/>' + T(100, 240, 'ash', 'dg-ts', 'mid')
b += '<path class="dg-blue-s" d="M8 166 L62 166" marker-end="url(#ah-gas)"/>' + T(6, 158, 'air in', 'dg-ts')
b += T(168, 107, '100–300 °C', 'dg-t') + T(168, 120, 'moisture driven out')
b += T(168, 139, '300–500 °C', 'dg-t') + T(168, 152, 'wood gives off tar gas')
b += T(168, 171, '900–1100 °C at the throat', 'dg-t') + T(168, 184, 'tar is burnt up')
b += T(168, 203, 'CO₂ + H₂O + C → CO + H₂', 'dg-t') + T(168, 216, 'the useful gas is made here', 'dg-ts')
b += T(168, 240, 'perforated steel grate', 'dg-ts')
# gas train along the bottom
b += '<path class="dg-key-s" d="M160 262 L160 280 L206 280" marker-end="url(#ah-gas)"/>'
b += '<path class="dg-key-s" d="M214 280 q6 -16 12 0 t12 0 t12 0 t12 0 t12 0"/>' + num(244, 302, 1) + T(244, 326, 'cooling pipe', 'dg-tb', 'mid') + T(244, 339, '10–15 ft of 2 in', 'dg-ts', 'mid')
b += '<path class="dg-key-s" d="M276 280 L296 280"/><path class="dg-water" d="M296 272 h22 v22 q-11 8 -22 0 z"/>' + num(307, 312, 2) + T(307, 336, 'trap', 'dg-tb', 'mid') + T(307, 349, 'drain daily', 'dg-ts', 'mid')
b += '<path class="dg-key-s" d="M318 280 L356 280"/><rect class="dg-panel" x="356" y="264" width="50" height="32" rx="5"/>' + ''.join('<circle class="dg-guide" cx="%d" cy="%d" r="1.6"/>' % (364 + (k % 5) * 8, 272 + (k // 5) * 8) for k in range(15))
b += num(381, 312, 3) + T(381, 336, 'filter', 'dg-tb', 'mid') + T(381, 349, 'sawdust or hay', 'dg-ts', 'mid')
b += '<path class="dg-key-s" d="M406 280 L436 280" marker-end="url(#ah-gas)"/>' + T(436, 244, 'to engine', 'dg-tb', 'end') + T(436, 257, 'air intake', 'dg-ts', 'end')
b += T(120, 296, 'hot gas out', 'dg-ts', 'mid')
F['gasifier'] = fig('fig-gasifier', '0 0 444 356', 'Downdraft wood gasifier: fuel dries, chars, burns at the throat and is reduced to fuel gas, which is cooled, trapped and filtered before the engine',
    b, 'Wood moves <strong>down</strong> through four zones and the gas leaves at the bottom, so tar has to pass through the hottest part and is burnt. This throat type ran over a million vehicles in the 1940s; FEMA’s 1989 emergency design is a simpler, throatless version of the same idea. The gas is mostly <strong>carbon monoxide: it kills</strong>. Run it outdoors only.')

# 3 ── Biodiesel processor ────────────────────────────────────────────────────────
b = AH('bio')
b += '<path class="dg-line" d="M150 60 Q150 44 222 44 Q294 44 294 60 L294 230 Q294 246 222 246 Q150 246 150 230 Z"/>'
b += '<path class="dg-key" d="M152 78 L292 78 L292 168 L152 168 Z"/>' + T(222, 116, 'BIODIESEL', 'dg-tb', 'mid') + T(222, 130, 'golden, floats', 'dg-ts', 'mid')
b += '<path class="dg-debris" d="M152 170 L292 170 L292 230 Q292 244 222 244 Q152 244 152 230 Z"/>' + T(222, 196, 'GLYCERIN', 'dg-tb', 'mid') + T(222, 210, 'dark, sinks', 'dg-ts', 'mid')
b += '<line class="dg-guide" x1="152" y1="169" x2="292" y2="169"/>'
b += '<path class="dg-red-s" d="M166 226 L278 226" stroke-dasharray="7 4"/>'
b += '<path class="dg-line" d="M222 246 L222 276"/><path class="dg-key" d="M214 262 L230 272 L230 262 L214 272 Z"/>'
# circulation loop on the right
b += '<path class="dg-blue-s" d="M294 214 L330 214 L330 74 L296 74" marker-end="url(#ah-bio)"/><circle class="dg-panel" cx="330" cy="144" r="13"/>' + T(330, 148, 'P', 'dg-tb', 'mid')
# inputs
b += '<path class="dg-arrow" d="M150 22 L170 22 L170 44" marker-end="url(#ah-bio)"/>' + num(30, 30, 1) + T(44, 26, 'oil in', 'dg-tb') + T(44, 39, 'filtered and dry')
b += num(30, 226, 2) + T(44, 222, 'heat to 55 °C', 'dg-tb') + T(44, 235, 'and hold it there') + lead(132, 226, 164, 226)
b += '<path class="dg-arrow" d="M352 30 L274 30 L274 44" marker-end="url(#ah-bio)"/>' + num(366, 30, 3) + T(380, 26, 'methoxide', 'dg-tb') + T(380, 39, 'in')
b += num(366, 144, 4) + T(380, 140, 'circulate', 'dg-tb') + T(380, 153, '1–2 hours')
b += num(30, 100, 5) + T(44, 96, 'settle 8+ h', 'dg-tb') + T(44, 109, 'two layers form') + lead(126, 104, 154, 150)
b += num(254, 280, 6) + T(268, 276, 'drain the glycerin first,', 'dg-tb') + T(268, 289, 'from the bottom valve')
F['biodiesel'] = fig('fig-biodiesel', '0 0 444 298', 'Appleseed biodiesel processor: a heated tank with a circulation pump; biodiesel floats on glycerin after settling',
    b, 'An old water heater does all of it: heat, mix, settle, drain. <strong>Methoxide (methanol + lye) is the dangerous step</strong>: mix it sealed and outdoors, gloves and goggles on, no flame anywhere near. The numbers follow the steps below; washing and drying come after.')

# 4 ── Four-stroke cycle (four panels) ────────────────────────────────────────────
b = AH('4s')
STROKES = [('1 INTAKE', 'piston down,', 'intake valve open', 'in'), ('2 COMPRESSION', 'piston up, both', 'valves shut (~8:1)', 'co'), ('3 POWER', 'spark fires, burn', 'drives piston down', 'po'), ('4 EXHAUST', 'piston up again,', 'exhaust valve open', 'ex')]
for i, (name, l1, l2, k) in enumerate(STROKES):
    x0 = 4 + i * 110; cx = x0 + 52
    b += '<rect class="dg-panel" x="%d" y="4" width="104" height="218" rx="9"/>' % x0
    top = {'in': 96, 'co': 62, 'po': 92, 'ex': 66}[k]                      # y of the piston crown
    gas = {'in': 'dg-water', 'co': 'dg-water', 'po': 'dg-red', 'ex': 'dg-debris'}[k]
    b += '<rect class="%s" x="%d" y="42" width="44" height="%d"%s/>' % (gas, cx - 22, top - 42, ' style="fill-opacity:.75"' if k == 'co' else '')
    b += '<path class="dg-line" d="M%d 38 L%d 132 M%d 38 L%d 132 M%d 38 L%d 38"/>' % (cx - 24, cx - 24, cx + 24, cx + 24, cx - 24, cx + 24)
    b += '<rect class="dg-key" x="%d" y="%d" width="44" height="16" rx="2"/>' % (cx - 22, top)
    crx = cx + {'in': 9, 'co': -9, 'po': 9, 'ex': -9}[k]; cry = 150 + {'in': 0, 'co': -4, 'po': 2, 'ex': -4}[k]
    b += '<line class="dg-line" x1="%d" y1="%d" x2="%d" y2="%d"/><circle class="dg-thin" cx="%d" cy="152" r="13"/><circle class="dg-keyf" cx="%d" cy="%d" r="3"/>' % (cx, top + 16, crx, cry, cx, crx, cry)
    # valves: intake left, exhaust right; open = dropped into the cylinder
    for side, opened in ((-1, k == 'in'), (1, k == 'ex')):
        vx = cx + side * 12; vy = 46 if opened else 39
        b += '<path class="%s" d="M%d 26 L%d %d M%d %d L%d %d"/>' % ('dg-key-s' if opened else 'dg-line', vx, vx, vy, vx - 6, vy, vx + 6, vy)
    if k == 'po': b += '<path class="dg-keyf" d="M%d 44 l3 7 l7 1 l-5 5 l2 8 l-7 -4 l-7 4 l2 -8 l-5 -5 l7 -1 z"/>' % cx
    else: b += '<line class="dg-thin" x1="%d" y1="28" x2="%d" y2="40"/>' % (cx, cx)
    if k == 'in': b += '<path class="dg-blue-s" d="M%d 20 L%d 32" marker-end="url(#ah-4s)"/>' % (cx - 34, cx - 17) + T(x0 + 6, 16, 'air + fuel', 'dg-ts')
    if k == 'ex': b += '<path class="dg-arrow" d="M%d 30 L%d 14" marker-end="url(#ah-4s)"/>' % (cx + 16, cx + 30) + T(cx + 46, 30, 'out', 'dg-ts', 'end')
    down = k in ('in', 'po')
    b += '<path class="dg-arrow" d="M%d %d L%d %d" marker-end="url(#ah-4s)"/>' % ((cx - 36, 70, cx - 36, 104) if down else (cx - 36, 104, cx - 36, 70))
    b += T(cx, 186, name, 'dg-tb dg-tb-sm', 'mid') + T(cx, 200, l1, 'dg-ts', 'mid') + T(cx, 212, l2, 'dg-ts', 'mid')
F['fourstroke'] = fig('fig-fourstroke', '0 0 444 226', 'Four-stroke engine cycle: intake, compression, power, exhaust',
    b, 'Suck, squeeze, bang, blow. Only <strong>one stroke in four makes power</strong>; a flywheel carries the engine through the other three. No fuel, no air, no spark or no compression means one of these strokes is failing, which is where fault-finding starts.')

# 5 ── Bellows: lift and push (two panels) ────────────────────────────────────────
b = AH('bel')
for i, (name, opened) in enumerate((('LIFT: fills', True), ('PUSH: blows', False))):
    x0 = 4 + i * 220
    b += '<rect class="dg-panel" x="%d" y="4" width="216" height="196" rx="9"/>' % x0 + T(x0 + 108, 24, name, 'dg-th', 'mid')
    hy = 60 if opened else 96                                    # height of the handle end of the top board
    b += '<path class="dg-leather" d="M%d 128 L%d %d L%d 128 Z"/>' % (x0 + 44, x0 + 186, hy + 8, x0 + 186)
    b += ''.join('<line class="dg-thin" x1="%d" y1="128" x2="%d" y2="%d"/>' % (x0 + 44, x0 + 186, hy + 8 + (128 - hy - 8) * f) for f in (0.25, 0.5, 0.75))
    b += '<rect class="dg-debris" x="%d" y="128" width="150" height="9" rx="2"/>' % (x0 + 40)                      # bottom board, fixed
    b += '<path class="dg-debris" d="M%d 122 L%d %d L%d %d L%d 130 Z"/>' % (x0 + 40, x0 + 190, hy, x0 + 190, hy + 9, x0 + 40)   # top board
    b += '<path class="dg-line" d="M%d %d L%d %d"/>' % (x0 + 190, hy + 4, x0 + 210, hy + 4) + T(x0 + 188, hy - 8, 'handle', 'dg-ts', 'end')
    b += '<path class="dg-line" d="M%d 120 L%d 126 L%d 132 L%d 138 Z"/>' % (x0 + 40, x0 + 14, x0 + 14, x0 + 40)                # nozzle
    mx, my = x0 + 124, hy + 4 + (126 - hy - 4) * (190 - 124) / 150.0                                                          # intake hole, on the top board
    if opened:
        b += '<path class="dg-key-s" d="M%d %d L%d %d"/>' % (mx - 9, my + 6, mx + 6, my + 20) + '<path class="dg-blue-s" d="M%d %d L%d %d" marker-end="url(#ah-bel)"/>' % (mx, my - 26, mx, my + 2)
        b += T(mx + 8, my - 22, 'air in', 'dg-ts') + '<path class="dg-key-s" d="M%d 122 L%d 136"/>' % (x0 + 42, x0 + 42)
        b += '<path class="dg-arrow" d="M%d %d L%d %d" marker-end="url(#ah-bel)"/>' % (x0 + 204, hy + 44, x0 + 204, hy + 14)
        b += T(x0 + 108, 170, 'intake flap opens', 'dg-tb', 'mid') + T(x0 + 108, 184, 'nozzle flap shut', 'dg-ts', 'mid')
    else:
        b += '<path class="dg-key-s" d="M%d %d L%d %d"/>' % (mx - 9, my + 5, mx + 9, my + 3) + '<path class="dg-key-s" d="M%d 123 L%d 131"/>' % (x0 + 42, x0 + 50)
        b += '<path class="dg-blue-s" d="M%d 129 L%d 129" marker-end="url(#ah-bel)"/>' % (x0 + 36, x0 + 8)
        b += '<path class="dg-arrow" d="M%d %d L%d %d" marker-end="url(#ah-bel)"/>' % (x0 + 204, hy - 34, x0 + 204, hy - 6)
        b += T(x0 + 108, 170, 'intake flap shut', 'dg-ts', 'mid') + T(x0 + 108, 184, 'air out to the fire', 'dg-tb', 'mid')
    b += T(x0 + 12, 112, 'nozzle', 'dg-ts') + T(x0 + 118, 150, 'fixed board', 'dg-ts', 'mid')
F['bellows'] = fig('fig-bellows', '0 0 444 204', 'Single bellows in two states: lifting the handle fills it through the intake flap; pushing down blows air out of the nozzle',
    b, 'Two boards about <strong>30 × 50 cm</strong>, hinged at the nozzle end, with pleated leather sides and two leather flap valves: a 5–7 cm intake hole in the top board and a 2–3 cm nozzle. One bellows blows only on the push. For a steady blast, join <strong>two</strong> to one tuyere with a Y-pipe and work them in turn.')

# 6 ── Box-of-dirt forge ──────────────────────────────────────────────────────────
b = AH('jb')
b += '<path class="dg-earth" d="M70 84 L176 84 Q190 84 196 100 Q208 134 222 134 Q236 134 248 100 Q254 84 268 84 L374 84 L374 196 L70 196 Z"/>'
b += '<path class="dg-debris" d="M60 78 L70 78 L70 196 L374 196 L374 78 L384 78 L384 206 L60 206 Z"/>'
b += '<path class="dg-red" d="M200 100 Q210 128 222 128 Q234 128 244 100 Q232 78 222 62 Q212 78 200 100 Z"/><path class="dg-key" d="M210 104 Q216 122 222 122 Q228 122 234 104 Q228 92 222 82 Q216 92 210 104 Z"/>'
b += ''.join('<circle class="dg-dark" cx="%d" cy="%d" r="3.2"/>' % (x, y) for x, y in ((204, 98), (214, 110), (230, 110), (240, 98), (222, 116), (196, 90), (248, 90)))
b += '<rect class="dg-panel" x="14" y="112" width="192" height="11" rx="3"/><path class="dg-blue-s" d="M0 117 L40 117" marker-end="url(#ah-jb)"/>'
b += '<path class="dg-line" d="M234 96 L330 62" stroke-width="5"/><path class="dg-key-s" d="M226 99 L246 92" stroke-width="5"/>'
b += T(8, 100, 'AIR', 'dg-tb') + T(8, 142, 'bellows, hair dryer') + T(8, 154, 'or a fan')
b += T(112, 74, 'steel pipe tuyere, 2–3 cm', 'dg-ts', 'mid') + lead(112, 78, 120, 112)
b += T(336, 56, 'workpiece', 'dg-tb') + T(336, 69, 'tip in the heart')
b += T(222, 30, 'FIREPOT', 'dg-th', 'mid') + T(222, 44, 'a bowl 10–15 cm across', 'dg-ts', 'mid') + lead(222, 48, 222, 60)
b += T(296, 150, 'packed clay and sand,', 'dg-t', 'mid') + T(296, 164, 'half and half', 'dg-ts', 'mid')
b += T(8, 186, 'wooden', 'dg-ts') + T(8, 198, 'box', 'dg-ts') + lead(46, 190, 64, 190)
b += '<path class="dg-thin" d="M60 222 L384 222 M60 217 v10 M384 217 v10"/>' + T(222, 238, 'at least 40 cm wide, 20 cm deep', 'dg-ts', 'mid')
F['jabod'] = fig('fig-jabod', '0 0 444 244', 'Box-of-dirt forge in cross-section: a wooden box packed with clay and sand, a bowl-shaped firepot and an air pipe entering from the side',
    b, '“Just a box of dirt.” The packed fill insulates the wood from the fire, and the bowl holds the charcoal in a deep, hot heart right at the end of the air pipe. An hour or two to build, and hot enough to forge mild steel.')

# 7 ── Pit latrine ────────────────────────────────────────────────────────────────
b = AH('lt')
b += '<path class="dg-earth" d="M2 128 L442 128 L442 316 L2 316 Z"/>'
b += '<path class="dg-water" d="M2 290 L442 290 L442 316 L2 316 Z"/>' + T(12, 308, 'water table', 'dg-t')
b += '<rect class="dg-panel" x="170" y="136" width="104" height="112"/>'
b += '<path class="dg-debris" d="M160 136 L170 136 L170 172 L160 172 Z M274 136 L284 136 L284 172 L274 172 Z"/>'
b += '<rect class="dg-debris" x="150" y="122" width="144" height="12" rx="2"/><rect class="dg-dark" x="204" y="121" width="26" height="14" rx="3"/>'
b += '<path class="dg-thin" d="M158 122 L158 44 L286 30 L286 122"/><path class="dg-line" d="M150 46 L294 30"/>'
b += '<rect class="dg-blue-s" x="258" y="12" width="12" height="124" rx="2" style="fill:none"/><path class="dg-key-s" d="M254 12 L274 12"/>'
b += '<path class="dg-blue-s" d="M217 104 L217 148" marker-end="url(#ah-lt)"/><path class="dg-blue-s" d="M264 110 L264 26" marker-end="url(#ah-lt)"/>'
b += T(12, 40, 'SHELTER', 'dg-tb') + T(12, 53, 'posts with tarp or boards') + lead(140, 50, 162, 70)
b += T(432, 20, 'fly screen', 'dg-tb', 'end') + T(432, 33, 'vent pipe, 0.5 m above roof', 'dg-ts', 'end') + lead(330, 16, 276, 14)
b += T(12, 112, 'slab with squat hole', 'dg-ts') + lead(118, 116, 152, 126)
b += T(300, 152, 'lined top 60 cm', 'dg-tb') + T(300, 165, 'brick or stone') + lead(296, 156, 280, 156)
b += T(222, 196, 'PIT', 'dg-th', 'mid') + T(222, 212, '1 × 1 m, 2 m deep', 'dg-ts', 'mid') + T(222, 226, 'unlined below: soaks away', 'dg-ts', 'mid')
b += '<path class="dg-thin" d="M130 250 L130 288 M124 250 h12 M124 288 h12"/>' + T(122, 266, 'at least', 'dg-tb', 'end') + T(122, 280, '1.5 m', 'dg-tb', 'end')
b += T(300, 266, 'serves 5 people 1–3 years', 'dg-ts')
F['pit'] = fig('fig-pitlatrine', '0 0 444 318', 'Ventilated pit latrine in cross-section: shelter, slab, vent pipe with fly screen, lined upper pit, and the gap above the water table',
    b, 'Air is drawn down the squat hole and up the vent pipe, taking the smell with it; flies head for the light at the top of the pipe and are trapped by the screen. Dig it <strong>at least 30 m from any water source and downhill of it</strong>. If water seeps in while you dig, stop and move.')

# 8 ── Gravity-fed rainwater ──────────────────────────────────────────────────────
b = AH('gv')
b += '<line class="dg-line" x1="2" y1="250" x2="442" y2="250"/>'
b += '<path class="dg-line" d="M24 250 L24 110 L150 110 L150 250"/><path class="dg-line" d="M12 112 L87 56 L162 112"/>'
b += '<path class="dg-blue-s" d="M160 112 L172 112 L172 136"/><rect class="dg-key" x="164" y="136" width="16" height="44" rx="3"/><path class="dg-thin" d="M172 180 L172 214" marker-end="url(#ah-gv)"/>'
b += '<path class="dg-blue-s" d="M180 142 L300 150"/>'
b += '<rect class="dg-line" x="300" y="128" width="78" height="62" rx="4" style="fill:none"/><rect class="dg-water" x="302" y="142" width="74" height="46"/>'
b += '<path class="dg-thin" d="M308 190 L308 250 M370 190 L370 250 M308 250 L370 190 M370 250 L308 190"/>'
b += '<path class="dg-blue-s" d="M339 190 L339 262 L60 262 L60 232"/><path class="dg-blue-s" d="M339 262 L436 262" stroke-dasharray="7 5"/>'
b += '<circle class="dg-keyf" cx="60" cy="230" r="5"/><path class="dg-line" d="M60 230 L46 230 L46 238"/>'
b += '<path class="dg-thin" d="M408 142 L408 230 M402 142 h12 M402 230 h12"/>' + T(436, 94, '3 m of head', 'dg-th', 'end') + T(436, 109, '= 0.3 bar at the tap', 'dg-tb', 'end')
b += '<line class="dg-guide" x1="68" y1="230" x2="400" y2="230"/><line class="dg-guide" x1="380" y1="142" x2="400" y2="142"/>'
b += num(87, 40, 1) + T(102, 44, 'roof catches rain', 'dg-tb')
b += num(206, 122, 2) + T(220, 118, 'first flush', 'dg-tb') + T(220, 131, 'dirty first water') + T(180, 226, 'to drain', 'dg-ts')
b += num(392, 186, 3) + T(339, 162, 'raised tank', 'dg-tb', 'mid') + T(339, 176, '1000 L IBC', 'dg-ts', 'mid')
b += num(60, 206, 4) + T(74, 210, 'tap', 'dg-tb')
b += T(436, 278, 'drip irrigation', 'dg-ts', 'end') + T(200, 278, 'buried pipe', 'dg-ts', 'mid')
F['gravity'] = fig('fig-gravity', '0 0 444 286', 'Gravity-fed rainwater system: roof, first-flush diverter, raised tank, and buried pipe to a tap and drip irrigation',
    b, 'No pump. <strong>Every metre</strong> the water surface stands above the tap gives about <strong>0.1 bar</strong> of pressure. The tank has to sit below the gutter so it fills, and above the tap so it flows.')

# 9 ── Tincture, five steps (six panels with the ratio) ───────────────────────────
b = ''
STEPS = [('1 HERB', '1 part dried herb', 'by weight (50 g)', 'crumbled'), ('2 ALCOHOL', '5 parts spirit,', '60–70% (250 ml);', 'cover the herb'),
         ('3 STEEP', 'seal, keep dark,', 'shake once a day', '4–6 weeks'), ('4 STRAIN', 'through muslin;', 'press the herb dry', ''),
         ('5 BOTTLE', 'dark glass; label', 'plant, date, strength', 'keeps 2–5 years'), ('', '', '', '')]
for i, (name, l1, l2, l3) in enumerate(STEPS):
    x0 = 4 + (i % 3) * 147; y0 = 4 + (i // 3) * 132; cx = x0 + 70
    b += '<rect class="dg-panel" x="%d" y="%d" width="141" height="126" rx="9"/>' % (x0, y0)
    if i == 5:
        b += T(cx, y0 + 34, '1 : 5', 'dg-big', 'mid') + T(cx, y0 + 54, 'herb to alcohol', 'dg-tb', 'mid') + T(cx, y0 + 76, 'at least 40% alcohol;', 'dg-ts', 'mid') + T(cx, y0 + 89, '60–70% is best', 'dg-ts', 'mid') + T(cx, y0 + 110, 'vodka is 40%', 'dg-ts', 'mid')
        continue
    jar = lambda fill, lid=True: ('<path class="dg-line" d="M%d %d L%d %d Q%d %d %d %d L%d %d Q%d %d %d %d Z" style="fill:none"/>' % (cx - 16, y0 + 22, cx - 16, y0 + 62, cx - 16, y0 + 68, cx - 10, y0 + 68, cx + 10, y0 + 68, cx + 16, y0 + 68, cx + 16, y0 + 62)
                                 + '<path class="dg-line" d="M%d %d L%d %d"/>' % (cx + 16, y0 + 62, cx + 16, y0 + 22) + fill + ('<rect class="dg-debris" x="%d" y="%d" width="38" height="7" rx="2"/>' % (cx - 19, y0 + 15) if lid else ''))
    herb = ''.join('<path class="dg-green" d="M%d %d q5 -7 10 0 q-5 6 -10 0 z"/>' % (cx - 14 + (k % 3) * 9, y0 + 62 - (k // 3) * 8) for k in range(6))
    if i == 0: b += '<path class="dg-line" d="M%d %d Q%d %d %d %d" style="fill:none"/>' % (cx - 26, y0 + 44, cx, y0 + 80, cx + 26, y0 + 44) + ''.join('<path class="dg-green" d="M%d %d q6 -8 12 0 q-6 7 -12 0 z"/>' % (cx - 18 + (k % 3) * 12, y0 + 52 - (k // 3) * 9) for k in range(6))
    if i == 1: b += jar('<rect class="dg-key" x="%d" y="%d" width="30" height="34" style="fill-opacity:.5"/>' % (cx - 15, y0 + 32) + herb, lid=False) + '<path class="dg-key-s" d="M%d %d q8 2 10 14"/>' % (cx - 34, y0 + 12)
    if i == 2: b += jar('<rect class="dg-key" x="%d" y="%d" width="30" height="34"/>' % (cx - 15, y0 + 32) + herb) + '<path class="dg-thin" d="M%d %d q-8 10 0 20 M%d %d q8 10 0 20"/>' % (cx - 26, y0 + 34, cx + 26, y0 + 34)
    if i == 3: b += ('<path class="dg-line" d="M%d %d L%d %d L%d %d Z" style="fill:none"/>' % (cx - 24, y0 + 20, cx + 24, y0 + 20, cx, y0 + 46) + '<path class="dg-guide" d="M%d %d L%d %d M%d %d L%d %d"/>' % (cx - 14, y0 + 26, cx + 14, y0 + 26, cx - 8, y0 + 34, cx + 8, y0 + 34)
                     + '<path class="dg-keyf" d="M%d %d q3 6 0 9 q-3 -3 0 -9 z"/>' % (cx, y0 + 50) + '<rect class="dg-key" x="%d" y="%d" width="30" height="8" rx="2"/>' % (cx - 15, y0 + 62))
    if i == 4: b += ('<path class="dg-debris" d="M%d %d L%d %d L%d %d L%d %d L%d %d L%d %d Z"/>' % (cx - 5, y0 + 14, cx + 5, y0 + 14, cx + 5, y0 + 26, cx + 14, y0 + 36, cx + 14, y0 + 68, cx - 14, y0 + 68)
                     + '<path class="dg-debris" d="M%d %d L%d %d L%d %d"/>' % (cx - 14, y0 + 68, cx - 14, y0 + 36, cx - 5, y0 + 26) + '<rect class="dg-white" x="%d" y="%d" width="22" height="14" rx="1"/>' % (cx - 11, y0 + 44))
    b += T(cx, y0 + 86, name, 'dg-tb', 'mid') + T(cx, y0 + 99, l1, 'dg-ts', 'mid') + T(cx, y0 + 110, l2, 'dg-ts', 'mid') + (T(cx, y0 + 121, l3, 'dg-ts', 'mid') if l3 else '')
F['tincture'] = fig('fig-tincture', '0 0 444 266', 'Making a tincture in five steps: herb, alcohol, steep, strain, bottle',
    b, 'The alcohol both draws the active compounds out of the plant and preserves them. Dark glass keeps sunlight from breaking them down. The spent herb can go on the compost.')

# 10 ── Water wheels (three panels) ───────────────────────────────────────────────
b = AH('ww')
def wheel(cx, cy, r, buckets=False):
    import math
    o = '<circle class="dg-line" cx="%d" cy="%d" r="%d" style="fill:none"/><circle class="dg-keyf" cx="%d" cy="%d" r="4"/>' % (cx, cy, r, cx, cy)
    for k in range(8):
        a = math.radians(k * 45 + 10); x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        o += '<line class="dg-thin" x1="%d" y1="%d" x2="%.0f" y2="%.0f"/>' % (cx, cy, x, y)
        if buckets: o += '<path class="dg-key-s" d="M%.0f %.0f l%.0f %.0f"/>' % (x, y, 9 * math.cos(a + 1.9), 9 * math.sin(a + 1.9))
        else: o += '<path class="dg-key-s" d="M%.0f %.0f L%.0f %.0f"/>' % (cx + (r - 9) * math.cos(a), cy + (r - 9) * math.sin(a), cx + (r + 5) * math.cos(a), cy + (r + 5) * math.sin(a))
    return o
W3 = [('OVERSHOT', 'up to ~85% efficient', 'needs a drop: high', 'head, small flow'), ('UNDERSHOT', '~25–35% efficient', 'sits in the stream:', 'low head, big flow'), ('PELTON', '~85%+ efficient', 'piped jet: very high', 'head, small flow')]
for i, (name, eff, l1, l2) in enumerate(W3):
    x0 = 4 + i * 147; cx = x0 + 70
    b += '<rect class="dg-panel" x="%d" y="4" width="141" height="208" rx="9"/>' % x0 + T(cx, 24, name, 'dg-th', 'mid')
    if i == 0:
        b += wheel(cx + 6, 96, 38, True) + '<path class="dg-water" d="M%d 42 L%d 42 L%d 50 L%d 50 Z"/>' % (x0 + 6, cx + 2, cx + 2, x0 + 6) + '<path class="dg-blue-s" d="M%d 50 q10 4 12 16" marker-end="url(#ah-ww)"/>' % (cx + 2)
        b += '<path class="dg-water" d="M%d 140 L%d 140 L%d 146 L%d 146 Z"/>' % (x0 + 30, x0 + 135, x0 + 135, x0 + 30) + T(x0 + 10, 38, 'flume', 'dg-ts')
    if i == 1:
        b += wheel(cx, 92, 38) + '<path class="dg-water" d="M%d 118 L%d 118 L%d 146 L%d 146 Z"/>' % (x0 + 6, x0 + 135, x0 + 135, x0 + 6) + '<path class="dg-blue-s" d="M%d 132 L%d 132" marker-end="url(#ah-ww)"/>' % (x0 + 16, x0 + 122)
    if i == 2:
        b += wheel(cx + 10, 98, 28, True) + '<path class="dg-blue-s" d="M%d 40 L%d 40 L%d 110 L%d 120" stroke-width="5"/>' % (x0 + 8, x0 + 20, x0 + 20, x0 + 34) + '<path class="dg-blue-s" d="M%d 122 L%d 124" marker-end="url(#ah-ww)"/>' % (x0 + 36, cx - 14)
        b += T(x0 + 28, 44, 'pipe from', 'dg-ts') + T(x0 + 28, 56, 'high up', 'dg-ts') + T(cx + 10, 146, 'cups split the jet', 'dg-ts', 'mid')
    b += T(cx, 168, eff, 'dg-tb', 'mid') + T(cx, 184, l1, 'dg-ts', 'mid') + T(cx, 197, l2, 'dg-ts', 'mid')
F['wheels'] = fig('fig-waterwheels', '0 0 444 216', 'Three water wheels compared: overshot, undershot and Pelton',
    b, '<strong>Head</strong> is how far the water falls; <strong>flow</strong> is how much there is. An overshot wheel uses the weight of falling water; an undershot wheel only the push of the current, so it wastes most of it; a Pelton wheel turns a long drop in a pipe into a fast jet.')


# ── swap them in ─────────────────────────────────────────────────────────────────
def swap(page, legacy_marker, wrap_start, wrap_end, html_, fid):
    p = os.path.join(ROOT, 'sections', page); s = open(p, encoding='utf-8').read()
    if 'id="%s"' % fid in s:                       # already redrawn: refresh it in place
        i = s.rfind('<figure', 0, s.index('id="%s"' % fid)); j = s.index('</figure>', i) + 9
        open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'refreshed'
    k = s.index(legacy_marker)
    i = s.rfind(wrap_start, 0, k); assert i >= 0, (page, wrap_start)
    e = s.index('</svg>', k)
    j = e
    for part in wrap_end: j = s.index(part, j) + len(part)
    open(p, 'w', encoding='utf-8').write(s[:i] + html_ + s[j:]); return 'replaced'


JOBS = [('textiles.html', 'aria-label="Boot cross-section diagram', '<figure class="svg-figure">', ['</figure>'], 'welt', 'fig-welt'),
        ('vehicles.html', 'FEMA DOWNDRAFT WOOD GASIFIER', '<div class="diagram-wrap">', ['</figure>', '</div>'], 'gasifier', 'fig-gasifier'),
        ('vehicles.html', 'APPLESEED BIODIESEL PROCESSOR', '<div class="diagram-wrap">', ['</figure>', '</div>'], 'biodiesel', 'fig-biodiesel'),
        ('vehicles.html', 'FOUR-STROKE ENGINE CYCLE', '<div class="diagram-wrap">', ['</figure>', '</div>'], 'fourstroke', 'fig-fourstroke'),
        ('metallurgy.html', 'aria-label="Bellows construction diagra', '<div class="svg-wrap">', ['</div>', '</div>'], 'bellows', 'fig-bellows'),
        ('metallurgy.html', 'aria-labelledby="jabod-title"', '<figure class="svg-diagram"', ['</figure>'], 'jabod', 'fig-jabod'),
        ('food.html', 'aria-labelledby="latrine-title"', '<figure class="svg-diagram"', ['</figure>'], 'pit', 'fig-pitlatrine'),
        ('build-water.html', 'aria-label="Gravity water distribution system schematic"', '<figure class="svg-diagram">', ['</figure>'], 'gravity', 'fig-gravity'),
        ('medicine-making.html', 'TINCTURE PREPARATION', '<figure class="svg-diagram">', ['</figure>'], 'tincture', 'fig-tincture'),
        ('build-power.html', 'WATER WHEEL TYPES', '<figure class="svg-diagram">', ['</figure>'], 'wheels', 'fig-waterwheels')]

if __name__ == '__main__':
    for page, marker, ws, we, key, fid in JOBS:
        print('%-22s %-16s %s' % (page, fid, swap(page, marker, ws, we, F[key], fid)))
