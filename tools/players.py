#!/usr/bin/env python3
"""Step-by-step animated diagrams ("players"): Polaris, shadow stick, tourniquet, recovery position.
Run:  python3 tools/players.py   (safe to run again). New players live in tools/players2.py,
which imports the helpers below. See .dg-player / .mv in assets/css/style.css and setupPlayers in app.js.
"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Step-by-step animated diagrams ("players"). Elements carry data-s="a" (from step a on)
# or data-s="a-b" (steps a..b). Elements hidden at the last step also get class
# dg-notlast so print / no-JS show the finished state.
import re, random
def T(x, y, s, c='dg-ts', mid=True, **kw):
    extra = ''.join(f' {k.replace("_", "-")}="{v}"' for k, v in kw.items())
    return f'<text class="{c}{" dg-mid" if mid else ""}" x="{x}" y="{y}"{extra}>{s}</text>'
def S(rng, inner, n):
    a, _, b = str(rng).partition('-')
    a = int(a); b = int(b) if b else n
    cls = ' class="dg-notlast"' if b < n else ''
    return f'<g data-s="{a}-{b}"{cls}>{inner}</g>'

def MV(inner, frm, ox, oy, t=0.9, d=0.1, fo=None):
    st = f'transform-origin:{ox}px {oy}px;--from:{frm};--mv-t:{t}s;--mv-d:{d}s' + (f';--from-o:{fo}' if fo is not None else '')
    return f'<g class="mv" style="{st}">{inner}</g>'
def DRAW(path_attrs, t=0.8, d=0.3):
    import re as _re
    path_attrs = _re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} mv-draw"', path_attrs, count=1)
    return f'<path pathLength="1" style="--mv-t:{t}s;--mv-d:{d}s" {path_attrs}/>'

def player(fid, n, vb, label, body, steps, cap):
    lis = ''.join(f'<li>{s}</li>' for s in steps)
    return (f'    <figure class="dg dg-player" id="{fid}" data-steps="{n}">\n'
            f'      <svg viewBox="{vb}" role="img" aria-label="{label}">{body}</svg>\n'
            f'      <ol class="dg-steps-list">{lis}</ol>\n'
            f'      <figcaption>{cap}</figcaption>\n    </figure>\n')

# ── A. Finding north from the Plough ─────────────────────────────────────────
n = 4
random.seed(7)
b = '<rect class="dg-sky" x="0" y="0" width="444" height="236" rx="10"/>'
b += ''.join(f'<circle class="dg-star-f" cx="{random.randint(8, 436)}" cy="{random.randint(8, 214)}" r="{random.choice((0.7, 0.9, 1.1))}"/>' for _ in range(70))
DIP = {'Alkaid': (430, 146), 'Mizar': (404, 134), 'Alioth': (378, 138), 'Megrez': (350, 154), 'Phecda': (362, 190), 'Merak': (330, 198), 'Dubhe': (312, 172)}
M, D = DIP['Merak'], DIP['Dubhe']
dx, dy = D[0] - M[0], D[1] - M[1]
P = (D[0] + 5 * dx, D[1] + 5 * dy)                     # Polaris: 5 x the pointer gap beyond Dubhe
order = ['Alkaid', 'Mizar', 'Alioth', 'Megrez', 'Dubhe', 'Merak', 'Phecda', 'Megrez']
b += S(1, f'<polyline class="dg-const" points="{" ".join(f"{DIP[k][0]},{DIP[k][1]}" for k in order)}"/>' + T(384, 116, 'the Plough / Big Dipper', 'dg-ts'), n)
b += ''.join(f'<circle class="dg-star" cx="{x}" cy="{y}" r="3.2"/>' for x, y in DIP.values())
b += S(2, f'<circle class="dg-key-s" cx="{M[0]}" cy="{M[1]}" r="8"/><circle class="dg-key-s" cx="{D[0]}" cy="{D[1]}" r="8"/>' + T(M[0] + 2, M[1] + 22, 'Merak', 'dg-ts') + T(D[0] - 12, D[1] + 4, 'Dubhe', 'dg-ts dg-end', mid=False) + T(250, 200, 'the two pointers', 'dg-th'), n)
ticks = ''.join(f'<circle class="dg-keyf" cx="{D[0] + k * dx}" cy="{D[1] + k * dy}" r="2"/>' + T(D[0] + k * dx + 10, D[1] + k * dy + 4, str(k) + '×', 'dg-ts', mid=False) for k in range(1, 5))
b += S(3, f'<line class="dg-key-s dg-dash" x1="{M[0]}" y1="{M[1]}" x2="{P[0]}" y2="{P[1]}"/>' + ticks, n)
UMI = [P, (P[0] - 22, P[1] + 10), (P[0] - 36, P[1] + 30), (P[0] - 44, P[1] + 56), (P[0] - 70, P[1] + 58), (P[0] - 74, P[1] + 82), (P[0] - 48, P[1] + 84), (P[0] - 44, P[1] + 56)]
b += S(4, f'<polyline class="dg-const dg-const-f" points="{" ".join(f"{x},{y}" for x, y in UMI)}"/>' + ''.join(f'<circle class="dg-star" cx="{x}" cy="{y}" r="1.8"/>' for x, y in UMI[1:7])
       + T(P[0] - 60, P[1] + 106, 'Little Dipper', 'dg-ts'), n)
b += f'<circle class="dg-star" cx="{P[0]}" cy="{P[1]}" r="3.4"/>'
b += S(4, f'<circle class="dg-key-s" cx="{P[0]}" cy="{P[1]}" r="10"/>' + T(P[0] + 16, P[1] + 4, 'POLARIS', 'dg-th', mid=False)
       + f'<line class="dg-guide" x1="{P[0]}" y1="{P[1] + 12}" x2="{P[0]}" y2="236"/>', n)
b += '<rect class="dg-land" x="0" y="236" width="444" height="34"/>'
b += S(4, T(P[0], 258, 'N', 'dg-big') + T(40, 258, 'W ←', 'dg-tb') + T(404, 258, '→ E', 'dg-tb') + T(P[0] + 40, 256, 'true north', 'dg-ts', mid=False), n)
FIG_POLARIS = player('fig-polaris', n, '0 0 444 270', 'Finding Polaris from the two pointer stars of the Plough', b,
    ['Find the Plough (Big Dipper): seven stars shaped like a saucepan. It may be on its side or upside down.',
     'Take the two stars on the outer edge of the pan, away from the handle. These are the pointers.',
     'Follow the line from Merak through Dubhe for about five times the gap between them.',
     'You reach Polaris, a medium-bright star with no bright neighbours. Straight below it on the horizon is true north.'],
    'The Plough circles Polaris through the night and the year, so the picture can be rotated any way round. The pointers always point at Polaris. Polaris sits as high above the horizon as your latitude (about 50–58° in the UK).')

# ── B. Shadow-stick method (seen from above, north up) ───────────────────────
n = 4
STK, A, B = (232, 196), (132, 106), (212, 92)
b = '<rect class="dg-earth" x="2" y="2" width="440" height="252" rx="10" opacity=".55"/>'
b += f'<circle class="dg-line" cx="{STK[0]}" cy="{STK[1]}" r="4"/>' + T(STK[0] + 10, STK[1] + 16, 'stick', 'dg-ts', mid=False)
def sun(x, y): return f'<circle class="dg-key" cx="{x}" cy="{y}" r="11"/>' + ''.join(f'<line class="dg-key-s" x1="{x + 15 * c}" y1="{y + 15 * s}" x2="{x + 20 * c}" y2="{y + 20 * s}"/>' for c, s in ((1, 0), (-1, 0), (0, 1), (0, -1), (.7, .7), (-.7, .7), (.7, -.7), (-.7, -.7)))
b += S('1-1', sun(404, 226) + f'<line class="dg-shadow" x1="{STK[0]}" y1="{STK[1]}" x2="{A[0]}" y2="{A[1]}"/>', n)
b += S(1, f'<circle class="dg-stone" cx="{A[0]}" cy="{A[1]}" r="7"/>' + T(A[0], A[1] - 14, '1st mark', 'dg-tb'), n)
b += S('2-3', sun(276, 232) + f'<line class="dg-shadow" x1="{STK[0]}" y1="{STK[1]}" x2="{B[0]}" y2="{B[1]}"/>', n)
b += S('2-2', T(340, 120, 'wait 15–20 min:', 'dg-t') + T(340, 136, 'the shadow tip moves', 'dg-ts') + f'<path class="dg-arrow" d="M{A[0] + 14} {A[1] - 26} Q{(A[0] + B[0]) / 2} {A[1] - 44} {B[0] - 10} {B[1] - 22}" marker-end="url(#ah-ss)"/>', n)
b += S(2, f'<circle class="dg-stone" cx="{B[0]}" cy="{B[1]}" r="7"/>' + T(B[0] + 8, B[1] - 14, '2nd mark', 'dg-tb', mid=False), n)
ux, uy = B[0] - A[0], B[1] - A[1]; L = (ux * ux + uy * uy) ** .5; ux, uy = ux / L, uy / L
W0 = (A[0] - ux * 50, A[1] - uy * 50); E0 = (B[0] + ux * 60, B[1] + uy * 60)
b += S(3, f'<line class="dg-key-s" x1="{W0[0]:.0f}" y1="{W0[1]:.0f}" x2="{E0[0]:.0f}" y2="{E0[1]:.0f}"/>' + T(W0[0] - 14, W0[1] + 5, 'W', 'dg-big') + T(E0[0] + 16, E0[1] + 7, 'E', 'dg-big'), n)
MID = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2); nx, ny = uy, -ux                   # perpendicular, pointing north (up)
NP = (MID[0] + nx * 80, MID[1] + ny * 80); SP = (MID[0] - nx * 120, MID[1] - ny * 120)
b += S(4, f'<line class="dg-line" x1="{SP[0]:.0f}" y1="{SP[1]:.0f}" x2="{NP[0]:.0f}" y2="{NP[1]:.0f}" marker-end="url(#ah-ss)"/>' + T(NP[0] + 2, NP[1] - 8, 'N', 'dg-big') + T(SP[0] + 14, SP[1], 'S', 'dg-big'), n)
foot = lambda x, y: f'<ellipse class="dg-foot" cx="{x}" cy="{y}" rx="6" ry="11"/>'
b += S(4, foot(A[0], A[1] + 18) + foot(B[0], B[1] + 18) + T(A[0] - 6, A[1] + 46, 'left foot', 'dg-ts') + T(B[0] + 20, B[1] + 46, 'right foot', 'dg-ts') + T(340, 120, 'stand like this:', 'dg-t') + T(340, 136, 'you face north', 'dg-ts'), n)
b = '<defs><marker id="ah-ss" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>' + b
FIG_SHADOW = player('fig-shadowstick', n, '0 -11 444 267', 'Shadow-stick method seen from above: two shadow-tip marks give a west–east line', b,
    ['Push a straight stick upright in flat, sunny ground. Put a stone on the tip of its shadow.',
     'Wait 15–20 minutes. The shadow tip moves; mark its new position.',
     'The line from the first mark to the second runs west → east.',
     'Stand with your left foot on the first mark and your right foot on the second: you are facing north.'],
    'Seen from above with north at the top. The first mark is always west and the second always east, <strong>in either hemisphere</strong>, because the sun always moves east to west. The longer you wait, the more accurate it is.')

# ── C. Improvised tourniquet (upper arm, side view; shoulder left) ───────────
n = 4
b = '<path class="dg-skin" d="M40 70 Q14 70 14 104 Q14 138 40 138 L380 132 Q404 132 412 116 Q414 104 412 92 Q404 76 380 76 Z"/>'
b += '<path class="dg-thin" d="M396 78 Q384 104 396 130"/>' + T(396, 156, 'elbow', 'dg-ts') + T(396, 168, 'never on a joint', 'dg-ts')
b += T(40, 156, 'shoulder', 'dg-ts')
b += '<ellipse class="dg-red" cx="322" cy="104" rx="14" ry="9"/>'
b += S('1-2', ''.join(f'<path class="dg-red-s" d="M{x} 138 q-2 6 0 10 q2 -4 0 -10"/>' for x in (316, 326))
       + ''.join(f'<circle class="dg-redf mv-drip" style="--mv-d:{dl}s" cx="{x}" cy="146" r="2.4"/>' for x, dl in ((314, 0), (328, 0.7), (321, 1.3))), n)   # blood keeps dripping until it is tight
b += T(338, 70, 'wound', 'dg-ts', mid=False)
BX = 270
b += S('1-2', MV(f'<rect class="dg-band" x="{BX - 9}" y="72" width="18" height="62" rx="3"/>', 'scaleY(0)', BX, 72, 0.9, 0.15)
       + DRAW(f'class="dg-thin" d="M{BX - 9} 100 L{BX + 9} 92"', 0.35, 0.8) + DRAW(f'class="dg-thin" d="M{BX - 9} 116 L{BX + 9} 108"', 0.35, 1.1), n)   # the cloth wraps on, twice
b += S(3, f'<path class="dg-band mv-late" style="--mv-d:1.6s" d="M{BX - 9} 72 Q{BX} 92 {BX - 6} 104 Q{BX} 118 {BX - 9} 134 L{BX + 9} 134 Q{BX + 2} 118 {BX + 6} 104 Q{BX + 2} 92 {BX + 9} 72 Z"/>', n)
b += S('1-1', f'<path class="dg-guide" d="M{BX} 50 L{BX} 66 M322 50 L322 92"/><path class="dg-arrow" d="M{BX + 4} 56 L318 56"/>' + T((BX + 322) / 2, 46, '5–7 cm above', 'dg-tb') + T(BX, 188, 'wide cloth,', 'dg-ts') + T(BX, 200, 'wrapped twice', 'dg-ts'), n)
b += S(2, MV(f'<circle class="dg-knot" cx="{BX}" cy="70" r="7"/>', 'scale(0)', BX, 70, 0.4, 0.1), n)
b += S('2-2', MV(f'<rect class="dg-stick" x="{BX - 56}" y="60" width="112" height="7" rx="3"/>', 'translateY(-46px)', BX, 63, 0.8, 0.5, 0) + T(BX, 40, 'stick on the half knot,', 'dg-ts') + T(BX, 52, 'full knot tied over it', 'dg-ts'), n)
b += S(3, MV(f'<rect class="dg-stick" x="{BX - 4}" y="10" width="8" height="112" rx="3" transform="rotate(70 {BX} 66)"/>', 'rotate(-340deg)', BX, 66, 2.2, 0.15), n)   # turned round and round until tight
b += S('3-3', f'<path class="dg-arrow" d="M{BX - 34} 34 A 40 22 0 1 1 {BX + 34} 34" marker-end="url(#ah-tq)"/>' + T(BX, 188, 'twist until the', 'dg-tb') + T(BX, 202, 'bleeding stops', 'dg-tb'), n)
b += S(4, DRAW(f'class="dg-tie" d="M{BX - 48} 84 Q{BX - 56} 108 {BX - 46} 136"', 0.7, 0.2) + T(184, 182, 'stick end tied down', 'dg-ts', mid=False) + T(184, 194, 'so it can’t unwind', 'dg-ts', mid=False), n)
b += S(4, MV('<rect class="dg-tag" x="70" y="168" width="96" height="30" rx="4"/>' + T(118, 188, 'TK 14:20', 'dg-th'), 'scale(0.4) rotate(-8deg)', 118, 183, 0.5, 0.9, 0), n)
b = '<defs><marker id="ah-tq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>' + b
FIG_TQ = player('fig-tourniquet-steps', n, '0 0 444 214', 'Improvised tourniquet: band above the wound, stick windlass twisted and locked, time written', b,
    ['Wrap a wide strip of cloth twice round the limb, 5–7 cm above the wound (between the wound and the body), not on a joint.',
     'Tie a half knot, lay a strong stick on it, and tie a full knot over the stick.',
     'Twist the stick until the bleeding stops. It will hurt — that is normal.',
     'Tie the stick down so it can’t unwind. Write “TK” and the time where it will be seen. Don’t loosen it.'],
    'Never use rope, wire or anything thin, because it cuts the tissue. Use a commercial tourniquet if you have one. If bleeding continues, put a second band above the first.')

# ── D. Recovery position, seen from above (head left, you kneel at the bottom) ──
n = 4
def head(x, y, tilt=0): return f'<circle class="dg-skin" cx="{x}" cy="{y}" r="15"/>' + (f'<path class="dg-thin" d="M{x - 6} {y + 6} q6 6 12 0"/>' if tilt else '')
def limb(pts, c='dg-limb'): return f'<polyline class="{c}" points="{" ".join(f"{x},{y}" for x, y in pts)}"/>'
torso_back = '<rect class="dg-skin" x="88" y="84" width="124" height="54" rx="20"/>'
b = '<rect class="dg-earth" x="2" y="2" width="440" height="230" rx="10" opacity=".35"/>'
b += '<circle class="dg-you" cx="196" cy="222" r="11"/><path class="dg-you" d="M150 236 Q196 200 242 236"/>' + T(152, 230, 'you, kneeling', 'dg-ts dg-end', mid=False)
# body on back (steps 1–3)
back = head(66, 111) + torso_back
back += limb([(206, 96), (330, 98)]) * 0 or ''
b += S('1-3', back + limb([(206, 126), (332, 128)]), n)                            # near leg stays straight
b += S('1-2', limb([(206, 96), (332, 96)]), n)                                         # far leg straight
b += S('1-3', MV(limb([(98, 134), (98, 184), (52, 184)]) + '<circle class="dg-hand" cx="50" cy="184" r="5"/>', 'rotate(-90deg)', 98, 134, 1.5, 0.15), n)  # near arm swings out to a right angle, palm up
b += S('1-1', limb([(98, 88), (196, 72)]) + '<circle class="dg-hand" cx="200" cy="71" r="5"/>', n)            # far arm by side
b += S('1-1', f'<path class="dg-key-s" d="M98 134 L98 184 L52 184" opacity=".9"/>' + T(150, 172, 'near arm out at', 'dg-tb', mid=False) + T(150, 186, 'a right angle', 'dg-tb', mid=False), n)
b += S('2-3', MV(limb([(98, 88), (138, 116), (84, 124)]) + '<circle class="dg-hand" cx="80" cy="124" r="5"/>', 'rotate(-48deg) scaleX(1.5)', 98, 88, 1.5, 0.15), n)  # far arm folds across the chest to the near cheek
b += S('2-2', '<path class="dg-key-s" d="M98 88 L138 116 L84 124"/>' + T(150, 44, 'far hand against', 'dg-tb', mid=False) + T(150, 58, 'their near cheek', 'dg-tb', mid=False) + '<path class="dg-arrow" d="M148 52 Q110 60 104 104" marker-end="url(#ah-rp)"/>', n)
b += S('3-3', MV(limb([(206, 96), (256, 76), (292, 92)]) + '<circle class="dg-key" cx="256" cy="76" r="6"/>', 'scaleX(1.45) rotate(18deg)', 206, 96, 1.3, 0.15), n)       # far knee comes up
b += S('3-3', T(270, 50, 'bend the far knee up,', 'dg-tb', mid=False) + T(270, 64, 'then pull it towards you', 'dg-tb', mid=False) + DRAW('class="dg-arrow" d="M262 84 Q300 140 270 178" marker-end="url(#ah-rp)"', 0.7, 1.1), n)
# final pose (step 4): on their side facing you
side = head(66, 120, tilt=1) + '<rect class="dg-skin" x="88" y="98" width="124" height="38" rx="16"/>'
side += limb([(206, 112), (334, 114)])                                                 # lower leg straight
side += limb([(206, 128), (238, 176), (306, 178)]) + '<circle class="dg-key" cx="238" cy="176" r="6"/>'   # top leg: hip and knee at right angles
side += limb([(98, 134), (98, 184), (52, 184)])                                        # lower arm still out at right angle
side += limb([(98, 104), (126, 132), (82, 138)]) + '<circle class="dg-hand" cx="80" cy="138" r="5"/>'  # top hand under cheek
b += S(4, MV(side, 'translateY(-18px) scaleY(1.45)', 200, 117, 1.4, 0.1) + '<path class="dg-arrow" d="M44 128 Q30 140 40 152" marker-end="url(#ah-rp)"/>' + T(12, 32, 'head tilted back,', 'dg-tb', mid=False) + T(12, 46, 'mouth pointing down', 'dg-tb', mid=False)
       + T(262, 206, 'top knee at a right angle', 'dg-ts', mid=False) + T(262, 218, 'stops them rolling forward', 'dg-ts', mid=False), n)
b = '<defs><marker id="ah-rp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>' + b
FIG_RP = player('fig-recovery-steps', n, '0 0 444 240', 'Recovery position in four steps, seen from above', b,
    ['Kneel beside them. Put the arm nearest you out at a right angle, palm up.',
     'Bring the far arm across their chest and hold the back of that hand against their near cheek.',
     'Bend the far knee up, then pull on it to roll them towards you.',
     'Tilt the head back so the airway stays open and fluid drains out. Keep checking their breathing.'],
    'Seen from above: they lie on their back with their head on the left, and you kneel at the bottom. If breathing stops, roll them onto their back and start CPR.')

# ── insert ───────────────────────────────────────────────────────────────────
def put(path, fid, fig, anchor, after=True, replace=None):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'    <figure class="dg dg-player" id="%s".*?</figure>\n' % fid, '', s, flags=re.S)
    if replace and replace in s:
        s = s.replace(replace, fig, 1)
    else:
        assert anchor in s, (path, anchor[:50])
        i = s.index(anchor) + (len(anchor) if after else 0)
        s = s[:i] + fig + s[i:]
    open(path, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    NAV = os.path.join(ROOT, 'sections', 'navigation.html'); MED = os.path.join(ROOT, 'sections', 'medical.html')
    s = open(NAV, encoding='utf-8').read()
    m = re.search(r'    <div class="diagram">\n  BIG DIPPER → POLARIS.*?</div>\n', s, re.S)
    if m: s = s[:m.start()] + s[m.end():]; open(NAV, 'w', encoding='utf-8').write(s)
    put(NAV, 'fig-polaris', FIG_POLARIS, '<p>Polaris (the North Star) sits almost exactly at the celestial north pole — it doesn\'t appear to move as the Earth rotates. Finding it gives you true north within 1°.</p>\n\n')
    s = open(NAV, encoding='utf-8').read()
    i = s.index('<h4>Shadow Stick Method</h4>'); j = s.index('</ol>\n', i) + len('</ol>\n')
    open(NAV, 'w', encoding='utf-8').write(s)
    put(NAV, 'fig-shadowstick', FIG_SHADOW, s[i:j])
    s = open(MED, encoding='utf-8').read()
    i = s.index('<h3>Hemorrhage Control — Stop Bleeding First</h3>'); j = s.index('</ol>\n', i) + len('</ol>\n')
    put(MED, 'fig-tourniquet-steps', FIG_TQ, s[i:j])
    s = open(MED, encoding='utf-8').read()
    i = s.index('<h3>If they start breathing: the recovery position</h3>'); j = s.index('</ol>\n', i) + len('</ol>\n')
    put(MED, 'fig-recovery-steps', FIG_RP, s[i:j])
    print('ok', P)
