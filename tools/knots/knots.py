"""The knots themselves: geometry + crossing marks. See rope.py for how they are checked and drawn.

Crossing marks are written in the order the rope meets each crossing, starting from the
strand's first point. O = this pass goes over, U = under. Sources for each structure are
in docs/DIAGRAMS.md ("Knots").
"""
from rope import Strand, Knot


def tf(pts, cx, cy, k=1.0, rot=0):
    """Scale about the design origin, optionally rotate 90 degrees clockwise, then move to (cx, cy)."""
    out = []
    for x, y in pts:
        if rot == 90: x, y = -y, x
        out.append((cx + k * x, cy + k * y))
    return out


# ── BOWLINE ────────────────────────────────────────────────────────────────
# One rope. Crossings, in the order the rope meets them from the standing part:
#   collar(O)  nip(U)  [round the hole:] tail-in(U) tail-out(O) rabbit-in(O) rabbit-out(U)  nip(O)  loop-leg x tail(U)
#   ...big loop...  rabbit-in(U) rabbit-out(O)  collar(U)  x loop-leg(O)  tail-in(O)  tail-out(U)
# Check: after "up through the hole" alone the three crossings alternate, i.e. an overhand knot,
# which is the textbook test that the hole was made the right way round.
_BOW = [(0, -112), (0, -80), (0, -30), (4, 8), (26, 32), (56, 24), (66, -4), (50, -26), (24, -32), (0, -30), (-24, -27),
        (-48, -10), (-64, 30), (-62, 75), (-36, 112), (12, 124), (54, 106), (66, 70), (56, 44), (46, 26), (40, -2), (37, -31),
        (33, -58), (19, -84), (0, -93), (-16, -86), (-24, -64), (-20, -46), (-13, -29), (-5, -17), (4, -6), (15, 8), (20, 28),
        (18, 52), (14, 72)]
BOW_MARKS = 'OUUOOUOU' 'UOUOOU'
BOW_STEPS = [18, 22, 27, 34]          # control-point index the working end has reached after each step


def bowline(cx, cy, k=1.0):
    return Knot([Strand('rope', tf(_BOW, cx, cy, k), BOW_MARKS, 'a')], 'bowline')


# ── SHEET BEND ─────────────────────────────────────────────────────────────
# Same structure as the bowline (it is a bowline with the loop cut), mirror-imaged and turned on its side.
# B (blue) is the bight; A (tan) is the rope that does the travelling.
#   A: up through the bight(U)  itself(O)  over top leg(O)  behind both(U U)  across the front(O)  under itself(U)  over top leg(O)
_SB_A = _BOW[:12] + [(-66, 14)]
_SB_B = [(64, 128), (62, 90)] + _BOW[18:] + [(8, 110), (6, 128)]


def sheet_bend(cx, cy, k=1.0):
    a = Strand('A', tf(_SB_A, cx, cy, k, 90), 'UOOUUOUO', 'a')
    b = Strand('B', tf(_SB_B, cx, cy, k, 90), 'OUOUUO', 'b')
    return Knot([b, a], 'sheet bend')


# ── REEF (SQUARE) KNOT and its bad twin, the granny ────────────────────────
# Six crossings. A comes from the left, B is the bight on the right.
#   A: up through B's bight (U), over its leg (O), round behind both legs (U U), back over (O), down through (U)
# The reef is point-symmetric (turn it half a turn AND flip it over: same knot). That fixes the marks.
_RF_A = [(-150, -14), (-90, -14), (-45, -15), (0, -22), (42, -30), (72, -22), (84, 0), (72, 22), (42, 30), (0, 22), (-45, 15), (-90, 14), (-150, 14)]
_RF_B = [(-x, y) for x, y in _RF_A]


def reef(cx, cy, k=1.0, granny=False):
    a = Strand('A', tf(_RF_A, cx, cy, k), 'UOUOUO' if granny else 'UOUUOU', 'a')
    b = Strand('B', tf(_RF_B, cx, cy, k), 'OUOUOU' if granny else 'OUOOUO', 'b')
    return Knot([b, a], 'granny' if granny else 'reef')


# ── CLOVE HITCH (on a vertical post; the post hides the back of each turn) ──
_CL = [(-150, 26), (-80, 24), (-30, 18), (0, 10), (30, 2), (40, 10), (30, 20), (0, 30), (-30, 40), (-40, 38), (-30, 32), (0, -4), (30, -42),
       (40, -50), (30, -56), (0, -50), (-30, -40), (-40, -34), (-30, -28), (0, -24), (30, -20), (80, -20), (150, -20)]
CL_BEHIND = [(4, 10), (12, 18)]
CL_STEPS = [9, 17, 22]


def clove(cx, cy, k=1.0):
    return Knot([Strand('rope', tf(_CL, cx, cy, k), 'UOOU', 'a', behind=CL_BEHIND)], 'clove hitch')


# ── TAUT-LINE HITCH (ABOK 1856: two turns inside the loop, one outside, all the same way) ──
_TL = [(16, 90), (120, 90), (300, 90), (392, 90), (418, 95), (426, 110), (414, 122), (388, 124), (340, 146), (270, 154), (232, 146), (220, 118),
       (224, 90), (230, 62), (246, 60), (254, 90), (258, 116), (272, 120), (282, 90), (288, 62), (304, 60), (312, 90), (314, 118), (302, 134),
       (262, 138), (226, 134), (202, 126), (184, 110), (176, 90), (172, 62), (154, 60), (146, 90), (146, 116), (158, 130), (182, 132), (200, 116), (206, 106)]
TL_MARKS = 'OUUOUO' 'U' 'OUOU' 'OO' 'OU' 'U'
TL_STEPS = [11, 22, 32, 36]


def tautline(cx=0, cy=0, k=1.0):
    return Knot([Strand('rope', tf(_TL, cx, cy, k), TL_MARKS, 'a')], 'taut-line hitch')


if __name__ == '__main__':
    for f in (lambda: bowline(0, 0), lambda: sheet_bend(0, 0), lambda: reef(0, 0), lambda: reef(0, 0, granny=True), lambda: clove(0, 0), lambda: tautline()):
        try: print(f().describe())
        except ValueError as e: print('FAIL', e)
