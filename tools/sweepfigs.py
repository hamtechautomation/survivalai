#!/usr/bin/env python3
"""Figures added by the all-sections accuracy sweep (November 2026). Each one is drawn here in the
guide's shared diagram style (.dg-* classes), placed at a text anchor, and replaces any older copy
of itself, so the script can be re-run after edits:  python3 tools/sweepfigs.py
Some replace ASCII-art blocks (<div class="diagram"> / <pre>) that said the same thing less clearly."""
import os, re, math, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Fig:
    def __init__(s, fid, w, h):
        s.fid, s.w, s.h, s.o = fid, w, h, []
        s.ah = 'ah-' + fid
    def a(s, x): s.o.append(x); return s
    def t(s, x, y, txt, cls='dg-ts', anchor=None, extra=''):
        return s.a('<text class="%s%s" x="%g" y="%g"%s>%s</text>' % (cls, ' dg-' + anchor if anchor else '', x, y, extra, txt))
    def lines(s, x, y, rows, cls='dg-ts', anchor=None, dy=12):
        for i, r in enumerate(rows): s.t(x, y + i * dy, r, cls, anchor)
    def r(s, x, y, w, h, cls='dg-panel', rx=0, extra=''):
        return s.a('<rect class="%s" x="%g" y="%g" width="%g" height="%g"%s%s/>' % (cls, x, y, w, h, ' rx="%g"' % rx if rx else '', extra))
    def l(s, x1, y1, x2, y2, cls='dg-thin', arrow=False, extra=''):
        return s.a('<line class="%s" x1="%g" y1="%g" x2="%g" y2="%g"%s%s/>' % (cls, x1, y1, x2, y2, ' marker-end="url(#%s)"' % s.ah if arrow else '', extra))
    def p(s, d, cls='dg-line', arrow=False, extra=''):
        return s.a('<path class="%s" d="%s"%s%s/>' % (cls, d, ' marker-end="url(#%s)"' % s.ah if arrow else '', extra))
    def c(s, cx, cy, r, cls='dg-line', extra=''):
        return s.a('<circle class="%s" cx="%g" cy="%g" r="%g"%s/>' % (cls, cx, cy, r, extra))
    def num(s, x, y, n):
        return s.a('<circle class="dg-keyf" cx="%g" cy="%g" r="9"/><text class="dg-num dg-mid" x="%g" y="%g">%s</text>' % (x, y, x, y + 4, n))
    def svg(s, aria, cls=''):
        defs = '<defs><marker id="%s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>' % s.ah
        return '<svg viewBox="0 0 %g %g"%s role="img" aria-label="%s">%s%s</svg>' % (s.w, s.h, ' class="%s"' % cls if cls else '', html.escape(aria, quote=True), defs, ''.join(s.o))

def figure(fid, svg, caption):
    return '<figure class="dg" id="%s">\n      %s\n      <figcaption>%s</figcaption>\n    </figure>\n' % (fid, svg, caption)

PAGES = {}
def page(name):
    if name not in PAGES:
        PAGES[name] = open(os.path.join(ROOT, 'sections', name + '.html'), encoding='utf-8').read()
    return PAGES[name]
def drop(name, fid):
    PAGES[name] = re.sub(r'[ \t]*<figure class="dg[^"]*" id="%s">.*?</figure>\n' % re.escape(fid), '', page(name), flags=re.S)
def place(name, fid, fig, anchor, before=True):
    drop(name, fid)
    s = page(name)
    assert s.count(anchor) == 1, (name, anchor[:60], s.count(anchor))
    PAGES[name] = s.replace(anchor, ('    ' + fig + anchor) if before else (anchor + '\n    ' + fig), 1)
def swap_block(name, fid, fig, inside):
    """Replace the ASCII <div class="diagram"> or <pre> block that contains `inside` (or an earlier copy of the figure)."""
    s = page(name)
    if ('id="%s"' % fid) in s:
        drop(name, fid); s = page(name)
        assert ('<!--%s-->' % fid) in s, fid
        PAGES[name] = s.replace('<!--%s-->' % fid, '<!--%s-->\n    ' % fid + fig, 1); return
    for pat in (r'[ \t]*<div class="diagram">(?:(?!</div>).)*?%s.*?</div>\n', r'[ \t]*<pre[^>]*>(?:(?!</pre>).)*?%s.*?</pre>\n'):
        m = re.search(pat % re.escape(inside), s, re.S)
        if m:
            PAGES[name] = s[:m.start()] + '    <!--%s-->\n    ' % fid + fig + s[m.end():]; return
    raise SystemExit('no ASCII block with %r on %s' % (inside, name))

def person(f, x, y, s=1.0, cls='dg-line'):
    """A simple standing figure, feet at (x, y)."""
    f.c(x, y - 46 * s, 6 * s, cls + '" fill="none')
    f.p('M%g %gV%g M%g %gL%g %g M%g %gL%g %g M%g %gL%g %g M%g %gL%g %g' % (x, y - 40 * s, y - 18 * s, x, y - 18 * s, x - 7 * s, y, x, y - 18 * s, x + 7 * s, y,
        x, y - 34 * s, x - 9 * s, y - 24 * s, x, y - 34 * s, x + 9 * s, y - 24 * s), cls, extra=' fill="none"')

# ─────────────────────────────────────────────────────────────── 1. Car in floodwater (Disasters)
def car_escape():
    f = Fig('fig-car-escape', 444, 300)
    f.t(222, 18, 'CAR IN WATER — S · W · C · O', 'dg-th', 'mid')
    panels = [('1', 'SEATBELT', 'off — everyone'), ('2', 'WINDOW', 'open or break it now'), ('3', 'CHILDREN', 'out first, oldest first'), ('4', 'OUT', 'onto the roof, then to the bank')]
    for i, (n, h, sub) in enumerate(panels):
        x0, y0 = 12 + (i % 2) * 216, 30 + (i // 2) * 132
        f.r(x0, y0, 204, 124, 'dg-panel', 8)
        wl = y0 + 92 - i * 14                       # water rises panel by panel
        f.r(x0 + 2, wl, 200, y0 + 122 - wl, 'dg-water', 0, ' opacity=".7"')
        cx, cy = x0 + 92, y0 + 100
        f.p('M%g %gh118l-8 -20h-20l-16 -18h-46l-16 18h-24z' % (cx - 62, cy), 'dg-line', extra=' fill="none"')
        f.c(cx - 34, cy + 2, 8, 'dg-line', ' fill="none"'); f.c(cx + 34, cy + 2, 8, 'dg-line', ' fill="none"')
        win = 'M%g %gh18l14 -16h-20z' % (cx - 18, cy - 20)
        if n == '1':
            f.p(win, 'dg-thin', extra=' fill="none"')
            f.c(cx - 6, cy - 30, 4, 'dg-line', ' fill="none"')
            f.l(cx - 12, cy - 30, cx + 2, cy - 18, 'dg-red-s'); f.t(cx + 76, cy - 24, 'click', 'dg-ts', 'mid')
        if n == '2':
            f.p('M%g %gl6 -16' % (cx - 4, cy - 24), 'dg-key-s'); f.t(cx + 64, cy - 36, 'window down,', 'dg-ts', 'mid')
            f.t(cx + 64, cy - 24, 'or hit a corner', 'dg-ts', 'mid')
        if n == '3':
            f.c(cx + 2, cy - 44, 5, 'dg-line', ' fill="none"'); f.p('M%g %gl-4 14' % (cx + 2, cy - 39), 'dg-line')
            f.l(cx + 12, cy - 40, cx + 40, cy - 52, 'dg-key-s', True)
        if n == '4':
            person(f, cx - 8, cy - 38, 0.42); f.l(cx + 22, cy - 46, cx + 74, cy - 30, 'dg-key-s', True)
            f.p('M%g %gh-34l34 -34z' % (x0 + 203, y0 + 122), 'dg-green')
        f.num(x0 + 16, y0 + 16, n); f.t(x0 + 30, y0 + 20, h, 'dg-tb dg-tb-sm'); f.t(x0 + 30, y0 + 33, sub, 'dg-ts')
    f.t(222, 296, 'Do it in the first minute, while the windows still work. Don’t wait for it to fill.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Escaping a car in water: 1 seatbelt off, 2 window open or broken at once, 3 children out first, 4 out onto the roof and away to the bank; the water rises in each panel'),
        '<strong>Seatbelt, Window, Children, Out.</strong> Electric windows often keep working for a minute or two; a sinking car is hard to leave once the water is above the windows. The old advice to wait for the car to fill so the door opens “once the pressure equalises” costs lives.')
    place('disasters', f.fid, fig, '    <h3>Phase 3 — After Flooding</h3>')

# ─────────────────────────────────────────────────────────────── 2. Birth emergency positions (Pregnancy)
def birth_positions():
    f = Fig('fig-birth-positions', 444, 236)
    f.t(222, 18, 'THREE EMERGENCY POSITIONS', 'dg-th', 'mid')
    w = 140
    for i, (h, sub) in enumerate([('CORD COMES FIRST', 'knees to chest, hips up'), ('STUCK SHOULDERS', 'knees back + press here'), ('HEAVY BLEEDING', 'rub the womb hard')]):
        x0 = 8 + i * (w + 4)
        f.r(x0, 28, w, 200, 'dg-panel', 8); f.t(x0 + w / 2, 46, h, 'dg-tb dg-tb-sm', 'mid'); f.t(x0 + w / 2, 222, sub, 'dg-ts', 'mid')
    # 1 knee-chest: knees on floor, chest and head down, hips highest
    x = 8
    f.l(x + 10, 180, x + 130, 180, 'dg-guide')
    f.c(x + 30, 170, 8, 'dg-line', ' fill="none"')                               # head on floor
    f.p('M%g %g L%g %g L%g %g' % (x + 38, 168, x + 92, 120, x + 98, 178), 'dg-line', extra=' fill="none"')  # back up to hips, thigh down
    f.p('M%g %gh26' % (x + 98, 178), 'dg-line')                                   # lower leg on floor
    f.p('M%g %gl-6 14' % (x + 52, 156), 'dg-line')                                # arm
    f.l(x + 92, 104, x + 92, 86, 'dg-key-s', True); f.t(x + 100, 84, 'hips up', 'dg-ts')
    f.t(x + 70, 200, 'lift baby off the cord', 'dg-ts', 'mid')
    # 2 McRoberts: on back, knees to chest; arrow above pubic bone
    x = 152
    f.l(x + 10, 182, x + 130, 182, 'dg-guide')
    f.c(x + 22, 168, 8, 'dg-line', ' fill="none"')
    f.p('M%g %g L%g %g' % (x + 30, 172, x + 92, 176), 'dg-line')                  # torso flat
    f.p('M%g %g L%g %g L%g %g' % (x + 92, 176, x + 66, 118, x + 100, 104), 'dg-line', extra=' fill="none"')  # thigh pulled back, shin up
    f.p('M%g %g L%g %g' % (x + 44, 160, x + 64, 124), 'dg-thin')                  # helper's pull (arm)
    f.l(x + 92, 132, x + 86, 162, 'dg-red-s', True); f.t(x + 98, 132, 'press', 'dg-ts'); f.t(x + 98, 144, 'above the', 'dg-ts'); f.t(x + 98, 156, 'pubic bone', 'dg-ts')
    f.t(x + 70, 200, 'helpers hold knees back', 'dg-ts', 'mid')
    # 3 fundal massage: belly profile with womb and circling hand
    x = 296
    f.p('M%g %g C%g %g %g %g %g %g' % (x + 20, 186, x + 30, 110, x + 110, 110, x + 124, 186), 'dg-line', extra=' fill="none"')
    f.c(x + 72, 150, 20, 'dg-red', '')
    f.t(x + 72, 154, 'womb', 'dg-ts', 'mid')
    f.p('M%g %g a24 10 0 1 1 1 0' % (x + 48, 116), 'dg-key-s', arrow=True, extra=' fill="none"')
    f.t(x + 72, 88, 'firm circles', 'dg-ts', 'mid')
    f.t(x + 72, 200, 'until it feels hard', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Three birth emergencies: cord prolapse — knees to chest with hips raised; stuck shoulders — on her back with knees pulled hard back and pressure just above the pubic bone; heavy bleeding — firm circular rubbing on the top of the womb'),
        'Each buys time; none replaces skilled help. <strong>Cord first:</strong> hips up, lift the baby’s part off the cord and keep holding it. <strong>Stuck shoulders:</strong> knees right back, pressure just above the pubic bone (not on the top of the belly), never pull hard on the head. <strong>Bleeding:</strong> rub the top of the womb until it hardens, and put the baby to the breast.')
    place('maternal', f.fid, fig, '    <h2>4. Postpartum Care (Mother)</h2>')

# ─────────────────────────────────────────────────────────────── 3. START triage (Medical, replaces ASCII)
def start_triage():
    f = Fig('fig-start', 444, 400)
    f.t(222, 18, 'START TRIAGE — UNDER 60 SECONDS EACH', 'dg-th', 'mid')
    tags = {'GREEN': '#3f9a5c', 'RED': '#c9473f', 'YELLOW': '#d4a843', 'BLACK': '#222'}
    def box(y, txt): f.r(20, y, 196, 34, 'dg-panel', 6); f.t(118, y + 21, txt, 'dg-tb dg-tb-sm', 'mid')
    def tag(x, y, col, sub):
        ink = ' style="fill:%s"' % ('#fff' if col in ('RED', 'BLACK', 'GREEN') else '#222')
        f.r(x, y, 96, 30, '', 6, ' style="fill:%s;stroke:#888"' % tags[col]); f.t(x + 48, y + 13, col, 'dg-tb dg-tb-sm', 'mid', ink)
        f.t(x + 48, y + 25, sub, 'dg-ts', 'mid', ink)
    rows = [(34, 'Can they walk?', 'yes', 'GREEN', 'minor — later'),
            (94, 'Breathing?', None, None, None),
            (164, 'Breathing over 30 a minute?', 'yes', 'RED', 'immediate'),
            (224, 'Radial pulse, refill ≤ 2 s?', 'no', 'RED', 'immediate'),
            (284, 'Obeys simple commands?', 'no', 'RED', 'immediate')]
    for y, q, ans, col, sub in rows:
        box(y, q)
        if col:
            f.l(216, y + 17, 300, y + 17, 'dg-thin', True); f.t(258, y + 12, ans, 'dg-ts', 'mid'); tag(306, y + 2, col, sub)
    for y1, y2, lab in [(68, 94, 'no'), (128, 164, 'yes'), (198, 224, 'no'), (258, 284, 'yes'), (318, 344, 'yes')]:
        f.l(118, y1, 118, y2, 'dg-thin', True); f.t(126, (y1 + y2) / 2 + 4, lab, 'dg-ts')
    tag(70, 346, 'YELLOW', 'delayed')
    # not breathing branch
    f.l(216, 111, 252, 111, 'dg-thin', True); f.t(234, 105, 'no', 'dg-ts', 'mid')
    f.r(258, 88, 178, 46, 'dg-panel', 6); f.t(347, 105, 'Open airway: breathing?', 'dg-tb dg-tb-sm', 'mid'); f.t(347, 123, 'yes → RED      no → BLACK', 'dg-ts', 'mid')
    f.t(222, 394, 'Re-check everyone every 15–30 minutes; people move between colours.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('START triage flowchart: walking — green; not breathing after opening the airway — black, breathing once opened — red; breathing over 30 a minute — red; no radial pulse or refill over 2 seconds — red; cannot obey commands — red; otherwise yellow'),
        'The only treatments during triage: open the airway, and stop catastrophic bleeding. Tag, move on, and come back. Children use a modified version (JumpSTART) — give five rescue breaths to a child who isn’t breathing but has a pulse.')
    swap_block('medical', f.fid, fig, 'START TRIAGE ALGORITHM')

# ─────────────────────────────────────────────────────────────── 4. Hazmat placards (Disasters)
def hazmat():
    f = Fig('fig-hazmat', 444, 272)
    f.t(222, 18, 'HAZARD DIAMONDS ON LORRIES AND TANKS', 'dg-th', 'mid')
    items = [('1', 'EXPLOSIVE', '#f08a24', '#111', 'bomb'), ('2', 'FLAMMABLE GAS', '#d23b2f', '#fff', 'flame'), ('2', 'NON-FLAM. GAS', '#2f8f4e', '#fff', 'cyl'),
             ('2', 'TOXIC GAS', '#f4f1e8', '#111', 'skull'), ('3', 'FLAMMABLE LIQUID', '#d23b2f', '#fff', 'flame'), ('4', 'FLAMMABLE SOLID', 'stripes', '#111', 'flame'),
             ('5', 'OXIDISER', '#f2c94c', '#111', 'ring'), ('6', 'TOXIC', '#f4f1e8', '#111', 'skull'), ('7', 'RADIOACTIVE', 'half', '#111', 'trefoil'),
             ('8', 'CORROSIVE', 'bw', '#111', 'drops'), ('9', 'MISC.', 'stripes9', '#111', '')]
    f.a('<defs><pattern id="hz-str" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(90)"><rect width="5" height="10" fill="#d23b2f"/><rect x="5" width="5" height="10" fill="#f4f1e8"/></pattern>'
        '<pattern id="hz-nine" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#f4f1e8"/><rect width="6" height="12" fill="#111"/></pattern></defs>')
    for i, (n, name, fill, ink, icon) in enumerate(items):
        cx, cy = 42 + (i % 6) * 72, 70 + (i // 6) * 118
        r = 30
        d = 'M%g %gL%g %gL%g %gL%g %gZ' % (cx, cy - r, cx + r, cy, cx, cy + r, cx - r, cy)
        if fill == 'stripes': f.p(d, '', extra=' fill="url(#hz-str)" stroke="#888"')
        elif fill == 'stripes9':
            f.p('M%g %gL%g %gL%g %gL%g %gZ' % (cx, cy - r, cx + r, cy, cx, cy, cx - r, cy), '', extra=' fill="url(#hz-nine)" stroke="none"')
            f.p('M%g %gL%g %gL%g %gL%g %gZ' % (cx - r, cy, cx + r, cy, cx, cy + r, cx - r, cy), '', extra=' fill="#f4f1e8" stroke="none"'); f.p(d, '', extra=' fill="none" stroke="#888"')
        elif fill == 'half':
            f.p('M%g %gL%g %gL%g %gZ' % (cx, cy - r, cx + r, cy, cx - r, cy), '', extra=' fill="#f2c94c"'); f.p('M%g %gL%g %gL%g %gZ' % (cx - r, cy, cx + r, cy, cx, cy + r), '', extra=' fill="#f4f1e8"'); f.p(d, '', extra=' fill="none" stroke="#888"')
        elif fill == 'bw':
            f.p('M%g %gL%g %gL%g %gZ' % (cx, cy - r, cx + r, cy, cx - r, cy), '', extra=' fill="#f4f1e8"'); f.p('M%g %gL%g %gL%g %gZ' % (cx - r, cy, cx + r, cy, cx, cy + r), '', extra=' fill="#111"'); f.p(d, '', extra=' fill="none" stroke="#888"')
        else: f.p(d, '', extra=' fill="%s" stroke="#888"' % fill)
        ic = ink if fill not in ('half', 'bw') else '#111'
        if icon == 'flame': f.p('M%g %gc-6 -6 -2 -12 0 -16c2 6 8 6 6 12c0 3 -3 4 -6 4z' % (cx, cy - 2), '', extra=' fill="%s"' % ic)
        if icon == 'skull': f.c(cx, cy - 10, 6, '', ' fill="%s"' % ic); f.r(cx - 3, cy - 5, 6, 4, '', 0, ' fill="%s"' % ic)
        if icon == 'bomb': f.c(cx - 2, cy - 8, 6, '', ' fill="%s"' % ic); f.p('M%g %gl5 -6' % (cx + 2, cy - 13), '', extra=' stroke="%s" stroke-width="1.6"' % ic)
        if icon == 'cyl': f.r(cx - 4, cy - 18, 8, 15, '', 2, ' fill="%s"' % ic)
        if icon == 'ring': f.c(cx, cy - 10, 6, '', ' fill="none" stroke="%s" stroke-width="2.2"' % ic)
        if icon == 'trefoil':
            for k in range(3):
                a0 = math.radians(-90 + k * 120 - 30); a1 = math.radians(-90 + k * 120 + 30)
                f.p('M%g %gL%g %gA9 9 0 0 1 %g %gZ' % (cx, cy - 10, cx + 9 * math.cos(a0), cy - 10 + 9 * math.sin(a0), cx + 9 * math.cos(a1), cy - 10 + 9 * math.sin(a1)), '', extra=' fill="#111"')
        if icon == 'drops': f.p('M%g %gl-3 6M%g %gl-3 6' % (cx - 6, cy - 16, cx + 4, cy - 16), '', extra=' stroke="#111" stroke-width="2"')
        f.t(cx, cy + 22, n, 'dg-tb', 'mid', ' style="fill:%s"' % ('#fff' if (ink == '#fff' or fill == 'bw') else '#111'))
        f.lines(cx, cy + 46, name.split(' ', 1) if ' ' in name else [name], 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Hazard warning diamonds, classes 1 to 9: orange explosive, red flammable gas, green non-flammable gas, white toxic gas, red flammable liquid, red-and-white striped flammable solid, yellow oxidiser, white toxic, yellow-and-white radioactive, black-and-white corrosive, striped miscellaneous', 'dg-truecolor'),
        'The class number sits at the bottom corner. An orange panel on the vehicle carries the hazard code (top) and the UN number of the substance (bottom) — read it from a distance, upwind, with binoculars if you can, and keep at least 100 m back from a leak of anything you can’t identify.')
    place('disasters', f.fid, fig, '    <h3>Phase 1 — Chemical Release Alert</h3>')

# ─────────────────────────────────────────────────────────────── 5. Stun points (Veterinary)
def stun_points():
    f = Fig('fig-stun', 444, 230)
    f.t(222, 18, 'WHERE TO AIM — THREE SPECIES ARE DIFFERENT', 'dg-th', 'mid')
    for i, h in enumerate(['CATTLE (front)', 'PIG (front)', 'SHEEP / GOAT (side)']):
        f.r(8 + i * 146, 28, 138, 196, 'dg-panel', 8); f.t(77 + i * 146, 46, h, 'dg-tb dg-tb-sm', 'mid')
    # cattle: long head, horns, eyes; X from eyes to opposite horn bases
    cx = 77
    f.p('M%g 70 Q%g 64 %g 70 L%g 160 Q%g 182 %g 160 Z' % (cx - 32, cx, cx + 32, cx + 22, cx, cx - 22), 'dg-line', extra=' fill="none"')
    f.p('M%g 70 q-18 -6 -24 -22 M%g 70 q18 -6 24 -22' % (cx - 30, cx + 30), 'dg-line', extra=' fill="none"')
    f.c(cx - 20, 104, 4, 'dg-line', ' fill="none"'); f.c(cx + 20, 104, 4, 'dg-line', ' fill="none"')
    f.l(cx - 20, 104, cx + 28, 72, 'dg-guide'); f.l(cx + 20, 104, cx - 28, 72, 'dg-guide')
    f.c(cx, 89, 5, 'dg-redf', ''); f.t(cx, 200, 'eye to opposite horn —', 'dg-ts', 'mid'); f.t(cx, 212, 'where the lines cross', 'dg-ts', 'mid')
    # pig: broad head, snout; point on midline ~2 cm above eye line
    cx = 223
    f.p('M%g 74 Q%g 60 %g 74 L%g 150 L%g 150 Z' % (cx - 38, cx, cx + 38, cx + 18, cx - 18), 'dg-line', extra=' fill="none"')
    f.r(cx - 18, 150, 36, 18, 'dg-line', 8, ' fill="none"'); f.c(cx - 6, 159, 2, 'dg-thin'); f.c(cx + 6, 159, 2, 'dg-thin')
    f.c(cx - 20, 112, 4, 'dg-line', ' fill="none"'); f.c(cx + 20, 112, 4, 'dg-line', ' fill="none"')
    f.l(cx - 30, 112, cx + 30, 112, 'dg-guide'); f.c(cx, 100, 5, 'dg-redf', '')
    f.t(cx + 8, 92, '≈2 cm up', 'dg-ts'); f.t(cx, 200, 'midline, a little above', 'dg-ts', 'mid'); f.t(cx, 212, 'the eyes; aim along the spine', 'dg-ts', 'mid')
    # sheep side view: head, ear; poll point aimed toward throat
    x0 = 300
    f.p('M%g 96 Q%g 74 %g 86 L%g 128 Q%g 150 %g 136 L%g 150 L%g 120 Z' % (x0 + 30, x0 + 60, x0 + 86, x0 + 122, x0 + 112, x0 + 92, x0 + 60, x0 + 34), 'dg-line', extra=' fill="none"')
    f.c(x0 + 80, 104, 3.5, 'dg-line', ' fill="none"'); f.p('M%g 90 q-14 -4 -20 6' % (x0 + 56), 'dg-thin', extra=' fill="none"')
    f.c(x0 + 64, 84, 5, 'dg-redf', ''); f.l(x0 + 64, 84, x0 + 82, 140, 'dg-red-s', True)
    f.t(x0 + 75, 200, 'top of the head, aimed', 'dg-ts', 'mid'); f.t(x0 + 75, 212, 'at the throat (behind horns)', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Stunning points: cattle where lines from each eye to the opposite horn base cross; pigs on the midline about 2 cm above the eyes, aimed along the spine; sheep and goats on top of the head, behind any horns, aimed towards the throat'),
        'Restrain the animal calmly first, and be certain of the point before you start. Bleed it within a minute of stunning. These are the standard humane points; check them against a livestock manual (e.g. the Humane Slaughter Association’s guides) before you need them.')
    s = page('veterinary'); i = s.index('<p>For humane slaughter, the goal'); j = s.index('</p>', i) + 4
    anchor = s[i:j]
    place('veterinary', f.fid, fig, anchor + '\n', before=False)


# ─────────────────────────────────────────────────────────────── 6. Quinzhee (Shelter)
def quinzhee():
    f = Fig('fig-quinzhee', 444, 236)
    f.t(222, 18, 'QUINZHEE — CROSS-SECTION', 'dg-th', 'mid')
    gy = 196
    bez = lambda t, a, b, c, d: (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d
    out = lambda t: (bez(t, 40, 40, 404, 404), bez(t, gy, 60, 60, gy))
    inn = lambda t: (bez(t, 84, 84, 360, 360), bez(t, gy, 104, 104, gy))
    snow = ' style="fill:#dfe6ee;stroke:#9aa"'
    f.p('M40 %g C40 60 404 60 404 %g Z' % (gy, gy), '', extra=snow)
    f.p('M84 %g C84 104 360 104 360 %g Z' % (gy, gy), 'dg-panel')
    f.r(220, 156, 140, 40, '', 0, snow); f.t(290, 181, 'sleep up here', 'dg-tb dg-tb-sm', 'mid', ' style="fill:#223"')
    f.r(30, 176, 64, 20, 'dg-panel'); f.l(18, 196, 94, 196, 'dg-line')
    for t in (0.2, 0.35, 0.65, 0.8):
        (x1, y1), (x2, y2) = out(t), inn(t)
        f.l(x1 + (x1 - x2) * 0.25, y1 + (y1 - y2) * 0.25, x2, y2, 'dg-wood-s', extra=' stroke-width="3"')
    (x1, y1) = out(0.2); f.l(x1 - 4, y1 - 4, 120, 44, 'dg-guide'); f.t(124, 40, 'guide sticks 25–30 cm: stop digging', 'dg-ts'); f.t(124, 52, 'when you reach them', 'dg-ts')
    f.r(216, 92, 12, 36, 'dg-panel'); f.l(222, 96, 222, 62, 'dg-thin', True); f.t(232, 70, 'vent hole', 'dg-ts')
    f.p('M128 186 C140 160 160 148 196 142', 'dg-red-s', True, ' fill="none"'); f.t(200, 140, 'warm air rises', 'dg-ts')
    f.p('M88 186 H40', 'dg-blue-s', True); f.t(18, 214, 'low entrance: cold air sinks out', 'dg-ts')
    f.t(222, 230, 'Pile 2 m high, 3 m across · let it set 2 hours · then dig out the inside', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Cross-section of a quinzhee: a snow dome hollowed out until the guide sticks show, walls 25–30 cm thick, a sleeping platform higher than the low entrance so cold air sinks out, and a vent hole in the roof'),
        'Keep the entrance low and the bed high: cold air drains out of the door. Keep the vent open and a shovel inside — and never use a stove or candle in a sealed snow shelter (carbon monoxide).')
    place('shelter', f.fid, fig, '    <h2>3. Long-Term Construction Methods</h2>')

# ─────────────────────────────────────────────────────────────── 7. Crystal radio (Communications)
def crystal_set():
    f = Fig('fig-crystal', 444, 240)
    f.t(222, 18, 'CRYSTAL RADIO — NO BATTERY', 'dg-th', 'mid')
    f.l(20, 40, 300, 40, 'dg-line'); f.c(20, 40, 4, 'dg-white'); f.c(300, 40, 4, 'dg-white'); f.t(160, 34, 'long wire antenna, 10–30 m, high', 'dg-ts', 'mid')
    f.p('M60 40 V110 H120', 'dg-line', extra=' fill="none"')
    f.r(120, 92, 110, 40, 'dg-wood', 18)                                                     # coil former
    for i in range(14): f.l(128 + i * 7, 92, 128 + i * 7, 132, 'dg-key-s', extra=' stroke-width="2"')
    f.p('M150 82 l70 0', 'dg-thin'); f.c(196, 82, 4, 'dg-keyf'); f.l(196, 82, 196, 92, 'dg-line'); f.t(196, 74, 'slider tunes', 'dg-ts', 'mid')
    f.t(175, 150, 'coil: 50–100 turns on a tube', 'dg-ts', 'mid')
    f.p('M230 112 H270', 'dg-line'); f.p('M270 104 l14 8 l-14 8 z M284 104 v16', 'dg-line', extra=' fill="none"'); f.t(277, 96, 'diode', 'dg-ts', 'mid'); f.t(277, 140, '1N34A', 'dg-ts', 'mid')
    f.p('M284 112 H340', 'dg-line'); f.r(340, 98, 34, 28, 'dg-panel', 12); f.t(357, 146, 'crystal', 'dg-ts', 'mid'); f.t(357, 158, 'earpiece', 'dg-ts', 'mid')
    f.p('M374 112 H404 V200 H60 V132', 'dg-line', extra=' fill="none"')
    f.l(60, 132, 120, 132, 'dg-line')
    f.p('M232 200 v16 m-14 0 h28 m-22 6 h16 m-10 6 h4', 'dg-line', extra=' fill="none"'); f.t(250, 232, 'earth: rod in damp soil or a water pipe', 'dg-ts', 'mid')
    f.t(410, 104, '', 'dg-ts')
    fig = figure(f.fid, f.svg('Crystal radio: a long high antenna wire goes to a coil wound on a tube with a slider for tuning, then through a germanium diode to a high-impedance crystal earpiece, and back to an earth rod'),
        'Antenna → coil → diode → earpiece → earth. The antenna and the earth are most of the performance: longer, higher wire and a really damp earth make it louder. Improvised diode: a pencil lead resting lightly on a rusty (blued) razor blade.')
    s = page('communications'); i = s.index('<p>Feed the output to a <strong>high-impedance earpiece'); j = s.index('</p>', i) + 4
    place('communications', f.fid, fig, s[i:j] + '\n', before=False)

# ─────────────────────────────────────────────────────────────── 8. Reading a river (Vehicles)
def river():
    f = Fig('fig-river', 444, 366)
    f.t(222, 18, 'READING A RIVER FROM ABOVE', 'dg-th', 'mid')
    f.p('M20 40 C150 40 250 70 300 150 C340 215 380 230 430 236 L430 284 C360 280 310 260 270 200 C230 140 150 110 20 110 Z', 'dg-water')
    f.p('M20 40 C150 40 250 70 300 150 C340 215 380 230 430 236', 'dg-line', extra=' fill="none"')
    f.p('M20 110 C150 110 230 140 270 200 C310 260 360 280 430 284', 'dg-line', extra=' fill="none"')
    f.p('M30 76 h34', 'dg-blue-s', True); f.t(30, 68, 'flow', 'dg-ts')
    f.p('M246 92 C278 118 298 150 316 186', 'dg-blue-s', True, ' stroke-width="4" fill="none"'); f.num(300, 118, 1)
    f.p('M130 66 l22 10 l-22 10', 'dg-key-s', extra=' fill="none"'); f.num(118, 76, 2)
    f.c(206, 124, 7, 'dg-earth'); f.p('M228 120 l-14 6 l14 6', 'dg-red-s', extra=' fill="none"'); f.num(242, 126, 3)
    f.c(380, 252, 8, 'dg-earth'); f.p('M366 262 a10 8 0 1 0 -4 -14', 'dg-blue-s', True, ' fill="none"'); f.num(398, 252, 4)
    f.p('M276 210 L318 182', 'dg-wood-s', extra=' stroke-width="5"'); f.p('M298 196 l6 -10 M288 202 l-4 -10 M308 190 l8 4', 'dg-wood-s'); f.num(270, 222, 5)
    leg = [('1', 'Fastest, deepest water: outside of the bend'), ('2', 'V pointing downstream: clear channel — run it'), ('3', 'V pointing upstream: a rock — avoid'),
           ('4', 'Eddy: calm water behind a rock — a place to stop'), ('5', 'Strainer (fallen tree): water through, people pinned')]
    for i, (n, t) in enumerate(leg):
        f.num(30, 300 + i * 14, n) if False else f.t(24, 304 + i * 14, '<tspan class="dg-tb dg-tb-sm">%s</tspan>   %s' % (n, t), 'dg-ts')
    fig = figure(f.fid, f.svg('A river bend seen from above: 1 the fastest, deepest water runs on the outside of the bend; 2 a V pointing downstream marks a clear channel; 3 a V pointing upstream marks a rock; 4 calm eddies form behind rocks; 5 a fallen tree is a strainer that lets water through but pins people'),
        'Scout from the bank before you commit. Strainers and low weirs kill more river travellers than rapids do: give them a wide berth, and carry round if you can’t see a clear line.')
    place('vehicles', f.fid, fig, '        <h4>Strainer Hazard</h4>')

# ─────────────────────────────────────────────────────────────── 9. Figure-four deadfall (Food, replaces ASCII)
def figure_four():
    f = Fig('fig-figure4', 444, 250)
    f.t(222, 18, 'FIGURE-FOUR DEADFALL TRIGGER', 'dg-th', 'mid')
    gy = 214
    f.l(20, gy, 424, gy, 'dg-guide')
    f.p('M256 86 L280 76 L428 192 L428 %g L404 %g Z' % (gy, gy), 'dg-earth'); f.t(292, 66, 'heavy rock or log', 'dg-tb dg-tb-sm')
    f.l(230, gy, 230, 108, 'dg-wood-s', extra=' stroke-width="5"')                  # upright
    f.l(262, 90, 146, 158, 'dg-wood-s', extra=' stroke-width="5"')                  # diagonal: holds rock, pivots on upright top, hooks bait stick
    f.l(146, 164, 336, 164, 'dg-wood-s', extra=' stroke-width="5"')                 # bait stick, notched on the upright
    f.c(332, 158, 5, 'dg-keyf'); f.t(246, 196, 'bait under the rock’s edge', 'dg-ts')
    for x, y in [(230, 110), (230, 164), (148, 160)]: f.c(x, y, 4, 'dg-white')
    f.t(238, 206, 'upright', 'dg-ts'); f.t(200, 104, 'diagonal', 'dg-ts', 'end'); f.t(150, 184, 'bait stick', 'dg-ts')
    f.t(40, 52, 'Notches lock the three sticks into a “4”.', 'dg-ts'); f.t(40, 64, 'A tug on the bait lets the diagonal go', 'dg-ts'); f.t(40, 76, 'and the rock drops.', 'dg-ts')
    f.t(222, 242, 'Rock 3–5× the animal’s weight. Keep hands and faces out from under it while setting.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('A figure-four deadfall: an upright stick, a diagonal lever resting on its top and a horizontal bait stick notched together hold up one edge of a heavy rock; when an animal tugs the bait the sticks collapse and the rock falls'),
        'Practise the notches until the trigger holds the weight but trips at a light touch. Check deadfalls and snares at least every 12 hours, and know the law where you are — many traps are illegal outside a genuine emergency.')
    swap_block('food', f.fid, fig, 'Figure-4')

# ─────────────────────────────────────────────────────────────── 10. Calories per bed (Agriculture)
def calories():
    rows = [('Potato', 8750, 26250, 1), ('Cassava', 9900, 24750, 1), ('Sweet potato', 9750, 23400, 1), ('Corn (grain)', 7700, 23100, 0),
            ('Wheat', 6200, 13900, 0), ('Amaranth', 3100, 9400, 0), ('Dry beans', 3100, 7700, 0), ('Winter squash', 2850, 5700, 1)]
    f = Fig('fig-calories', 444, 40 + len(rows) * 26 + 34)
    f.t(222, 18, 'CALORIES FROM 100 SQ FT (9 m²) IN A GOOD YEAR', 'dg-th', 'mid')
    X0, X1, M = 110, 424, 27000
    sx = lambda v: X0 + v / M * (X1 - X0)
    for k in (0, 10000, 20000):
        f.l(sx(k), 30, sx(k), 32 + len(rows) * 26, 'dg-guide'); f.t(sx(k), 46 + len(rows) * 26, '%dk' % (k // 1000), 'dg-ts', 'mid')
    for i, (n, a, b, root) in enumerate(rows):
        y = 34 + i * 26
        f.t(X0 - 8, y + 14, n, 'dg-ts', 'end')
        f.r(sx(a), y + 4, sx(b) - sx(a), 14, 'dg-green' if root else 'dg-key', 3)
    f.t(222, 64 + len(rows) * 26, 'Bars show the range from an ordinary to a very good crop. Green = roots and squash.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Horizontal bars of calories per 100 square feet: potato, cassava and sweet potato highest at roughly 9,000 to 26,000; corn 7,700 to 23,000; wheat 6,000 to 14,000; amaranth and dry beans 3,000 to 9,000; winter squash 3,000 to 6,000'),
        'An adult needs roughly 750,000 calories a year — about 30–90 square metres of potatoes, or several times that in beans. Grow roots for bulk calories and grains and beans for storage and protein.')
    s = page('agriculture'); i = s.index('<p>Realistic garden yields, not record ones.'); j = s.index('</p>', i) + 4
    place('agriculture', f.fid, fig, s[i:j] + '\n', before=False)

# ─────────────────────────────────────────────────────────────── 11. Baseplate compass (Navigation, replaces ASCII)
def compass():
    f = Fig('fig-compass', 444, 310)
    f.t(222, 18, 'PARTS OF A BASEPLATE COMPASS', 'dg-th', 'mid')
    f.r(150, 34, 144, 262, 'dg-panel', 14, ' style="fill-opacity:.55"')
    f.p('M222 40 l12 22 h-24z', 'dg-keyf'); f.l(222, 62, 222, 128, 'dg-key-s')                   # direction of travel arrow
    cx, cy, R = 222, 196, 58
    f.c(cx, cy, R + 8, 'dg-line', ' fill="none"'); f.c(cx, cy, R, 'dg-panel')
    for k in range(0, 360, 10):
        a = math.radians(k - 90); r0 = R + (0 if k % 30 else -2)
        f.l(cx + (R + 1) * math.cos(a), cy + (R + 1) * math.sin(a), cx + (R + 7) * math.cos(a), cy + (R + 7) * math.sin(a), 'dg-thin')
    for k, lab in [(0, 'N'), (90, 'E'), (180, 'S'), (270, 'W')]:
        a = math.radians(k - 90); f.t(cx + (R - 12) * math.cos(a), cy + (R - 12) * math.sin(a) + 4, lab, 'dg-tb dg-tb-sm', 'mid')
    for dx in (-24, -12, 12, 24): f.l(cx + dx, cy - 40, cx + dx, cy + 40, 'dg-guide')                # orienting lines
    f.p('M%g %g l-9 16 h18z' % (cx, cy - 46), 'dg-red', extra=' fill="none"')                      # orienting arrow ("shed")
    f.p('M%g %g l6 30 l-6 4 l-6 -4z' % (cx, cy - 40), 'dg-redf'); f.p('M%g %g l6 -30 l-6 -4 l-6 4z' % (cx, cy + 40), 'dg-white')   # needle
    f.c(cx, cy, 3, 'dg-keyf')
    f.c(258, 96, 16, 'dg-line', ' fill="none"'); f.l(158, 140, 186, 140, 'dg-thin')
    f.l(222, 128, 222, 130, 'dg-thin'); f.l(212, 130, 232, 130, 'dg-key-s')                      # index line
    lab = [(84, 52, 'direction-of-travel arrow', 216, 52), (84, 96, 'magnifier', 242, 96), (84, 130, 'index line: read here', 212, 130),
           (360, 150, 'rotating bezel, 0–360°', 280, 160), (360, 200, 'orienting arrow (“the shed”)', 232, 152), (360, 250, 'needle: red end = north', 228, 172),
           (84, 246, 'orienting lines', 198, 220)]
    for x, y, t, tx, ty in lab:
        if x < 222:
            f.t(x + 60, y + 4, t, 'dg-ts', 'end'); f.l(x + 64, y, tx, ty, 'dg-guide')
        else:
            f.t(x - 56, y + 4, t, 'dg-ts'); f.l(x - 60, y, tx, ty, 'dg-guide')
    f.t(222, 304, '“Put red in the shed”: turn your body until the red needle sits inside the orienting arrow.', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('A baseplate compass: the direction-of-travel arrow on the clear base, a magnifier, an index line where the bearing is read, a rotating bezel marked 0 to 360 degrees, orienting arrow and lines inside it, and a magnetic needle with a red north end'),
        'Point the direction-of-travel arrow at where you want to go, turn the bezel until the orienting arrow lies under the red end of the needle, and read the bearing at the index line.')
    swap_block('navigation', f.fid, fig, 'Direction of travel arrow')

# ─────────────────────────────────────────────────────────────── 12. Discharging a capacitor (Salvage)
def cap_discharge():
    f = Fig('fig-capbleed', 444, 190)
    f.t(222, 18, 'DISCHARGE A CAPACITOR SAFELY', 'dg-th', 'mid')
    for i, (h, sub) in enumerate([('BLEED IT', 'resistor on insulated leads'), ('CHECK IT', 'meter reads 0 V'), ('SHORT IT', 'wire across while you work')]):
        x0 = 8 + i * 146
        f.r(x0, 28, 138, 156, 'dg-panel', 8); f.num(x0 + 16, 44, i + 1); f.t(x0 + 30, 48, h, 'dg-tb dg-tb-sm'); f.t(x0 + 69, 176, sub, 'dg-ts', 'mid')
        cx = x0 + 69
        f.r(cx - 22, 90, 44, 56, 'dg-key', 6); f.t(cx, 124, 'HV', 'dg-tb dg-tb-sm', 'mid'); f.r(cx - 14, 80, 8, 10, 'dg-line', 1); f.r(cx + 6, 80, 8, 10, 'dg-line', 1)
        if i == 0:
            f.p('M%g 80 V64 H%g M%g 64 h6 l3 -6 l6 12 l6 -12 l6 12 l6 -12 l3 6 h6 M%g 64 H%g V80' % (cx - 10, cx - 30, cx - 30, cx + 18, cx + 10), 'dg-line', extra=' fill="none"')
            f.t(cx, 158, '10 kΩ, 5 W+', 'dg-ts', 'mid')
        if i == 1:
            f.r(cx + 26, 60, 34, 28, 'dg-panel', 4); f.t(cx + 43, 79, '0 V', 'dg-tb dg-tb-sm', 'mid')
            f.p('M%g 80 V70 H%g M%g 80 V66 H%g' % (cx - 10, cx + 30, cx + 10, cx + 36), 'dg-thin', extra=' fill="none"')
        if i == 2:
            f.p('M%g 80 C%g 60 %g 60 %g 80' % (cx - 10, cx - 6, cx + 6, cx + 10), 'dg-red-s', extra=' fill="none"')
            f.t(cx, 158, 'leave it clipped on', 'dg-ts', 'mid')
    fig = figure(f.fid, f.svg('Three steps to make a capacitor safe: bleed it through a resistor on insulated leads, confirm zero volts with a meter, then clip a shorting wire across the terminals while you work'),
        'Microwave and motor-start capacitors can kill days after unplugging. A screwdriver across the terminals works but bangs and pits them; a resistor is gentler. One hand only, other hand in your pocket, and check again before touching.')
    s = page('salvage'); i = s.index('<p>Slower killers to respect:'); j = s.index('</p>', i) + 4
    place('salvage', f.fid, fig, s[i:j] + '\n', before=False)

def main():
    car_escape(); birth_positions(); start_triage(); hazmat(); stun_points()
    quinzhee(); crystal_set(); river(); figure_four(); calories(); compass(); cap_discharge()
    for name, s in PAGES.items():
        open(os.path.join(ROOT, 'sections', name + '.html'), 'w', encoding='utf-8').write(s)
    print('figures written:', ', '.join(sorted(PAGES)))

if __name__ == '__main__':
    main()
