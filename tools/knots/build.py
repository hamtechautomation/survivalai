#!/usr/bin/env python3
"""Builds sections/knots.html. Run:  python3 tools/knots/build.py

Every rope drawing comes from knots.py through rope.py, which refuses to draw a knot
whose crossings do not check out. Text and drawings are generated together so the
numbered steps always match the frames.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import knots as K
from rope import Strand, Knot

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def T(x, y, s, c='dg-ts', a='start'):
    return '<text class="%s%s" x="%s" y="%s">%s</text>' % (c, {'start': '', 'mid': ' dg-mid', 'end': ' dg-end'}[a], x, y, s)


def lead(x1, y1, x2, y2):
    return '<line class="dg-thin" x1="%s" y1="%s" x2="%s" y2="%s"/><circle class="dg-keyf" cx="%s" cy="%s" r="2.2"/>' % (x1, y1, x2, y2, x2, y2)


def arrow_defs(i):
    return '<marker id="ah-%s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker>' % i


def player(fid, vb, label, knot, frames, final, steps, cap, objects='', extra_defs='', final_knot=None):
    """frames: list of (upto, labels_svg) for the tying steps; final: labels for the finished, checked knot.
    upto = list (one entry per strand) of arc lengths, None = whole strand."""
    n = len(frames) + 1
    stops = [[] for _ in knot.strands]
    for upto, _ in frames:
        for i, u in enumerate(upto):
            if u is not None: stops[i].append(u)
    knot.setup(fid.replace('fig-', 'k') + '-', stops)
    body, prev = '', [0] * len(knot.strands)
    for k, (upto, labels) in enumerate(frames, 1):
        body += '<g data-s="%d-%d" class="dg-notlast">%s%s</g>' % (k, k, knot.draw(upto, prev, objects), labels)
        prev = [s.length if u is None else u for s, u in zip(knot.strands, upto)]
    fk = final_knot.setup(fid.replace('fig-', 'k') + 'f-') if final_knot else knot
    full = '<g id="%s-full">%s</g>' % (fid, fk.draw(None, None, objects))
    if final_knot: extra_defs += final_knot.defs_svg()[6:-7]
    body += '<g data-s="%d-%d"><use href="#%s-full"/>%s</g>' % (n, n, fid, final)
    svg = '<svg viewBox="%s" role="img" aria-label="%s">%s<defs>%s%s</defs>%s</svg>' % (vb, label, knot.defs_svg(), extra_defs, full, body)   # body and full are built above, so defs_svg() is complete here
    lis = ''.join('<li>%s</li>' % s for s in steps)
    return ('    <figure class="dg dg-player dg-knot" id="%s" data-steps="%d">\n      %s\n      <ol class="dg-steps-list">%s</ol>\n'
            '      <figcaption>%s</figcaption>\n    </figure>\n' % (fid, n, svg, lis, cap))


def arcs(strand, idxs):
    return [strand.arc_of_ctrl(i) for i in idxs]


# ═══ BOWLINE ═══════════════════════════════════════════════════════════════
def fig_bowline():
    cx, cy, k = 150, 200, 1.7
    kn = K.bowline(cx, cy, k); r = kn.strands[0]
    P = lambda x, y: (cx + k * x, cy + k * y)
    a = arcs(r, K.BOW_STEPS)
    cap = lambda t1, t2='': T(292, 150, t1, 'dg-th') + (T(292, 168, t2, 'dg-t') if t2 else '')
    frames = [([a[0]], cap('Make the hole', 'end’s side on top') + lead(288, 144, *P(40, -34))),
              ([a[1]], cap('Up out of the hole', 'from underneath')),
              ([a[2]], cap('Round the tree', 'behind the standing part')),
              ([a[3]], cap('Back down the hole', 'beside itself'))]
    fin = (T(292, 34, 'standing part', 'dg-tb') + T(292, 48, 'takes the load') + lead(288, 30, *P(4, -108))
           + T(292, 92, 'collar', 'dg-tb') + lead(288, 88, *P(22, -86))
           + T(292, 190, 'the hole grips', 'dg-tb') + T(292, 204, 'both legs') + lead(288, 186, *P(64, -8))
           + T(292, 300, 'tail INSIDE', 'dg-th') + T(292, 316, 'the loop, a hand’s') + T(292, 330, 'width long') + lead(288, 296, *P(20, 70))
           + T(cx + 4, cy + k * 124 + 22, 'fixed loop: will not tighten', 'dg-ts', 'mid'))
    return player('fig-bowline', '0 0 444 440', 'Bowline tied in five steps', kn, frames, fin,
                  ['Make a small loop in the standing part, with the end’s side lying <strong>on top</strong>. This is the “hole”. Leave enough rope below it for the size of loop you want.',
                   '<strong>The rabbit comes up out of the hole:</strong> bring the end up through the small loop from underneath.',
                   '<strong>Round the back of the tree:</strong> pass the end behind the standing part.',
                   '<strong>And back down the hole:</strong> bring the end down through the small loop, beside itself.',
                   'Set it: hold the tail and the near side of the loop together and pull the standing part. Check the tail is inside the loop and at least a hand’s width long.'],
                  'If it falls apart when you pull it tight, the hole was made the wrong way round: the end’s side must lie <strong>on top</strong> of the standing part in step 1.')


# ═══ CLOVE HITCH ═══════════════════════════════════════════════════════════
def fig_clove():
    cx, cy, k = 212, 118, 1.35
    kn = K.clove(cx, cy, k); r = kn.strands[0]
    a = arcs(r, [10, 18, 22])
    a[0] += 16; a[1] += 16                      # pause with the end just back in view, not hidden behind the post
    post = ('<rect class="kn-pole" x="%.0f" y="6" width="%.0f" height="224" rx="7"/>' % (cx - 30 * k, 60 * k)
            + ''.join('<path class="kn-pole-grain" d="M%.0f 14 q5 100 -2 206"/>' % (cx + dx) for dx in (-24, -6, 13, 28)))
    cap = lambda t1, t2='': T(14, 204, t1, 'dg-th') + (T(14, 220, t2, 'dg-t') if t2 else '')
    frames = [([a[0]], cap('Once round the post')),
              ([a[1]], cap('Cross over, round again', 'over the standing part')),
              ([a[2]], cap('Tuck under the crossing'))]
    fin = (T(14, 176, 'standing part', 'dg-tb') + T(14, 190, 'to the load') + T(430, 80, 'end', 'dg-tb', 'end')
           + T(300, 196, 'two turns under', 'dg-th') + T(300, 212, 'one diagonal', 'dg-th') + lead(296, 192, cx + 6, cy + 8)
           + T(14, 30, 'dotted = behind the post'))
    return player('fig-clove', '0 0 444 236', 'Clove hitch tied in four steps', kn, frames, fin,
                  ['Pass the end once round the post.',
                   'Bring it across <strong>over the standing part</strong> and round the post a second time, beside the first turn.',
                   'Tuck the end <strong>under the crossing</strong> you just made, so it comes out between the two turns.',
                   'Pull both ends to snug it down. Check: two turns side by side, both trapped under one diagonal, and the two ends leaving in opposite directions.'],
                  'Front view; the back of each turn is hidden by the post. On a post with a free top you can also drop two loops over it, the second with a half twist.', post)


# ═══ TAUT-LINE HITCH ═══════════════════════════════════════════════════════
def fig_tautline():
    kn = K.tautline(); r = kn.strands[0]
    a = arcs(r, K.TL_STEPS)
    peg = '<circle class="kn-pole" cx="409" cy="108" r="9.5"/>'
    load = T(18, 74, 'to the tent / load', 'dg-ts') + T(409, 146, 'peg', 'dg-ts', 'mid')
    cap = lambda t1, t2='': T(18, 150, t1, 'dg-th') + (T(18, 166, t2, 'dg-t') if t2 else '')
    frames = [([a[0]], load + cap('Round the peg and back')),
              ([a[1]], load + cap('Two turns, working', 'towards the peg')),
              ([a[2]], load + cap('Cross over, one turn', 'on the far side')),
              ([a[3]], load + cap('Tuck under that crossing'))]
    fin = (load + T(18, 150, 'slide to tighten', 'dg-th') + T(18, 166, 'it grips under load', 'dg-t')
           + '<path class="dg-arrow" d="M150 44 L262 44" marker-end="url(#ah-tl)"/><path class="dg-arrow" d="M262 44 L150 44" marker-end="url(#ah-tl)"/>'
           + T(270, 48, '2 turns inside the loop', 'dg-ts') + T(142, 48, '1 outside', 'dg-ts', 'end'))
    return player('fig-tautline', '0 26 444 152', 'Taut-line hitch tied in five steps', kn, frames, fin,
                  ['Pass the end round the peg (or tree) and bring it back beside the standing line.',
                   'Wrap it <strong>twice</strong> round the standing line, working back towards the peg. Both turns sit inside the loop.',
                   'Carry the end across <strong>over its own line</strong> to the far side of your turns, and take one more turn round the standing line, in the same direction.',
                   'Tuck the end under the crossing you just made, then push the three turns together and pull them snug.',
                   'Slide the knot along the standing line to tighten or slacken the guy line. Loaded, it bites and holds; unloaded, it slides.'],
                  'Slips in slick or stiff cord: take <strong>three</strong> turns inside the loop instead of two. Re-snug it after the first hard pull and whenever the line gets wet.',
                  peg, arrow_defs('tl'))


# ═══ SHEET BEND ════════════════════════════════════════════════════════════
def fig_sheetbend():
    cx, cy, k = 232, 150, 1.6
    kn = K.sheet_bend(cx, cy, k); B, A = kn.strands
    P = lambda x, y: (cx - k * y, cy + k * x)                    # same quarter-turn the knot geometry uses
    a = arcs(A, [2, 6, 12])
    cap = lambda t1, t2='': T(16, 30, t1, 'dg-th') + (T(16, 46, t2, 'dg-t') if t2 else '')
    thick = T(16, 268, 'thicker or stiffer rope', 'dg-ts')
    frames = [([None, 0], cap('Bight in the thicker rope') + thick),
              ([None, a[0]], cap('Up through the bight', 'from underneath') + thick),
              ([None, a[1]], cap('Round the back', 'of both legs') + thick),
              ([None, a[2]], cap('Across the front and', 'under itself') + thick)]
    ex, ey = P(-66, 14); bx, by = P(6, 128)
    fin = (T(16, 30, 'both short ends', 'dg-th') + T(16, 46, 'on the same side', 'dg-th') + lead(120, 50, bx + 4, by - 14) + lead(150, 34, ex - 10, ey + 2)
           + thick + T(428, 116, 'pull here', 'dg-tb', 'end') + T(428, 130, 'to set it', 'dg-ts', 'end'))
    return player('fig-sheetbend', '0 0 444 280', 'Sheet bend tied in five steps', kn, frames, fin,
                  ['Make a bight (a U-bend) in the <strong>thicker or stiffer</strong> rope and hold it.',
                   'Bring the thinner rope’s end <strong>up through the bight</strong> from underneath.',
                   'Take it over the bight’s short leg and round the <strong>back of both legs</strong>.',
                   'Bring it across the front and tuck it <strong>under itself</strong>, not back down through the bight.',
                   'Hold the bight and pull the thin rope’s standing part to set it. Check that both short ends are on the same side of the knot.'],
                  'Ends on opposite sides is the “left-handed” sheet bend, which slips sooner. For thin, slick or very different ropes, take the end round the bight <strong>twice</strong> before tucking (double sheet bend).')


# ═══ REEF KNOT ═════════════════════════════════════════════════════════════
def fig_reef():
    cx, cy, k = 222, 96, 1.35
    kn = K.reef(cx, cy, k); B, A = kn.strands
    a = arcs(A, [4, 8, 12])
    cap = lambda t1, t2='': T(222, 22, t1, 'dg-th', 'mid') + (T(222, 38, t2, 'dg-t', 'mid') if t2 else '')
    frames = [([None, 0], cap('Bight in one end')),
              ([None, a[0]], cap('Up through the bight')),
              ([None, a[1]], cap('Round the back of both legs')),
              ([None, a[2]], cap('Back down through the bight', 'beside itself'))]
    fin = (cap('Flat and square')
           + T(24, 148, 'end', 'dg-tb') + T(420, 148, 'end', 'dg-tb', 'end') + T(222, 172, 'both short ends on the same side', 'dg-ts', 'mid')
           + T(24, 62, 'standing', 'dg-ts') + T(420, 62, 'standing', 'dg-ts', 'end'))
    return player('fig-reef', '0 0 444 182', 'Reef knot tied in five steps', kn, frames, fin,
                  ['Make a bight in one end.',
                   'Bring the other end <strong>up through the bight</strong>.',
                   'Take it round the <strong>back of both legs</strong>.',
                   'Bring it <strong>back down through the bight</strong>, so it lies beside its own standing part.',
                   'Pull on all four strands. It should lie flat, each rope’s two parts side by side. In the hand it is quicker to tie as two half knots: <strong>right over left and under, then left over right and under</strong>.'],
                  'The same knot whichever way you tie it. If the second half knot goes the same way as the first, you get a granny (below).')


def fig_reef_vs_granny():
    def panel(granny, x0):
        k = K.reef(x0 + 108, 64, 0.66, granny=granny).setup('gg-' if granny else 'rg-')
        drawn = k.draw()
        b = '<rect class="dg-panel" x="%d" y="2" width="216" height="146" rx="10"/>' % x0 + k.defs_svg() + drawn
        b += ('<rect class="dg-badbg" x="%d" y="12" width="100" height="17" rx="8"/>' % (x0 + 58) + T(x0 + 108, 24.5, 'GRANNY', 'dg-bad', 'mid') if granny
              else '<rect class="dg-okbg" x="%d" y="12" width="100" height="17" rx="8"/>' % (x0 + 58) + T(x0 + 108, 24.5, 'REEF', 'dg-ok', 'mid'))
        l1, l2, l3 = (('ends stick out crossways;', 'one part over, one under', 'slips, then jams') if granny else ('lies flat; each rope’s two', 'parts leave side by side', 'holds a bundle'))
        b += T(x0 + 108, 112, l1, 'dg-ts', 'mid') + T(x0 + 108, 125, l2, 'dg-ts', 'mid') + T(x0 + 108, 140, l3, 'dg-tb', 'mid')
        b += '<circle class="%s" cx="%.0f" cy="%.0f" r="12"/>' % ('kn-warn' if granny else 'kn-good', x0 + 108 + 79 * 0.66, 64 + 14 * 0.66)
        return '<svg viewBox="%d 0 220 150" role="img" aria-label="%s">%s</svg>' % (x0, 'Granny knot: slips, then jams' if granny else 'Reef knot: lies flat', b)
    return ('    <figure class="dg dg-multi" id="fig-reef-granny">\n      <div class="dg-cols" style="--cols:2;--cols-sm:1" role="group" aria-label="Reef knot compared with a granny knot">\n        %s\n        %s\n      </div>\n'
            '      <figcaption>Look where the tan rope’s lower part leaves the blue bight (ringed). In a reef it passes the <strong>same side</strong> as its upper part; in a granny it passes the other side. If you see a granny, undo the top half knot and tie it the other way.</figcaption>\n    </figure>\n' % (panel(False, 0), panel(True, 224)))


# ═══ TRUCKER'S HITCH (a system, drawn as a rope diagram) ═══════════════════
def fig_trucker():
    PTS = [(34, 62), (100, 62), (166, 62), (250, 62), (384, 62), (410, 66), (420, 84), (410, 102), (384, 106), (250, 106), (200, 105),
           (162, 104), (146, 108), (138, 121), (150, 136), (190, 142), (250, 144)]
    def eye():
        e = Strand('eye', [(168, 70), (158, 92), (166, 114), (178, 118), (188, 104), (180, 72)], 'OU', 'a'); e.tip = False
        return e
    main = Strand('line', PTS + [(322, 146)], 'OU', 'a')
    kn = Knot([eye(), main], "trucker's hitch")
    # finished: the free end comes back up and is tied off round the line below the loop
    tied = Strand('line', PTS + [(286, 140), (300, 124), (300, 112)], 'OU', 'a'); tied.tip = False
    kf = Knot([eye(), tied], "trucker's hitch, tied off")
    a = arcs(main, [2, 12, 17])
    anchors = '<circle class="kn-metal" cx="24" cy="62" r="10"/><rect class="kn-pole" x="398" y="40" width="14" height="92" rx="4"/>'
    names = T(8, 40, 'far anchor', 'dg-ts') + T(436, 30, 'near anchor', 'dg-ts', 'end')
    blob = lambda x, y: '<rect class="kn-knot" x="%s" y="%s" width="24" height="19" rx="7"/>' % (x - 12, y - 9.5)
    loopknot = blob(172, 63)
    cap = lambda t1, t2='': T(40, 168, t1, 'dg-th') + (T(40, 184, t2, 'dg-t') if t2 else '')
    frames = [([0, a[0]], names + cap('Fix one end')),
              ([None, a[0]], names + loopknot + cap('Tie a small fixed loop', 'part-way along')),
              ([None, a[1]], names + loopknot + cap('Round the anchor and', 'back through the loop')),
              ([None, a[2]], names + loopknot + cap('Haul back hard')
               + '<path class="dg-key-s" d="M334 146 L376 146" marker-end="url(#ah-tr)"/>' + T(355, 164, 'PULL', 'dg-th', 'mid'))]
    fin = (names + loopknot + blob(300, 106) + cap('Lock it off') + T(318, 128, 'two half hitches', 'dg-tb')
           + ''.join(T(232, y, n_, 'dg-tb', 'mid') for y, n_ in ((54, '1'), (98, '2'), (136, '3')))
           + T(330, 84, '3 strands share the pull', 'dg-ts', 'mid'))
    return player('fig-trucker', '0 16 444 176', "Trucker's hitch set up in five steps", kn, frames, fin,
                  ['Fix one end to the far anchor with a bowline, or a round turn and two half hitches.',
                   'Part-way along, tie a <strong>small fixed loop</strong> in the line. Simplest: fold the line double and tie an overhand knot in the doubled part.',
                   'Take the free end round the near anchor and back <strong>through the loop</strong>.',
                   'Pull the free end back towards the near anchor. The loop works as a pulley: in theory you pull three times as hard as your hand, in practice nearer twice, because rope rubs on rope.',
                   'Pinch the rope where it leaves the loop to hold the tension, then lock it with <strong>two half hitches</strong> round the line just below the loop.'],
                  'The pale blocks stand for knots described in the steps, not drawn strand by strand. An overhand loop jams after a hard pull; an alpine butterfly loop does not, if you know it. Rope sawing on rope wears the loop, so shift its position on a line you use often.',
                  anchors, arrow_defs('tr'), final_knot=kf)


# ═══ ROPE WORDS ════════════════════════════════════════════════════════════
def fig_words():
    bight = Strand('bight', [(18, 34), (60, 34), (84, 40), (94, 56), (84, 72), (60, 78), (18, 78)], '', 'a'); bight.tip = False
    loop = Strand('loop', [(132, 84), (160, 66), (186, 38), (206, 30), (220, 46), (208, 64), (186, 62), (166, 40), (150, 24)], 'UO', 'a'); loop.tip = False
    turn = Strand('turn', [(252, 44), (280, 47), (298, 50), (322, 54), (336, 58), (340, 63), (336, 68), (322, 71), (298, 75), (280, 78), (252, 84)], '', 'a', behind=[(7, 8)]); turn.tip = False
    rt = Strand('round turn', [(352, 30), (376, 34), (388, 37), (412, 42), (424, 46), (428, 51), (424, 56), (412, 58), (388, 62), (380, 66), (388, 70), (412, 75), (424, 79),
                               (428, 84), (424, 89), (412, 91), (388, 95), (376, 97), (352, 102)], '', 'a', behind=[(7, 8), (15, 16)]); rt.tip = False
    kn = Knot([bight, loop, turn, rt], 'rope words').setup('w-')
    posts = '<rect class="kn-pole" x="298" y="20" width="24" height="88" rx="5"/><rect class="kn-pole" x="388" y="14" width="24" height="98" rx="5"/>'
    drawn = kn.draw(objects=posts)
    b = kn.defs_svg() + drawn
    for x, w1, w2 in ((56, 'bight', 'a U-bend, no crossing'), (176, 'loop', 'crosses itself'), (292, 'turn', 'once round'), (398, 'round turn', 'twice round')):
        b += T(x, 130, w1, 'dg-tb', 'mid') + T(x, 144, w2, 'dg-ts', 'mid')
    return ('    <figure class="dg" id="fig-ropewords">\n      <svg viewBox="0 0 444 152" role="img" aria-label="Rope words: bight, loop, turn and round turn">%s</svg>\n'
            '      <figcaption>The <strong>standing part</strong> is the long side that takes the load. The <strong>working end</strong> is the end you tie with; what is left of it after the knot is the <strong>tail</strong>.</figcaption>\n    </figure>\n' % b)


# ═══ PAGE ═════════════════════════════════════════════════════════════════
def thumb(fid, vb):
    return '<svg viewBox="%s" aria-hidden="true" focusable="false"><use href="#%s-full"/></svg>' % (vb, fid)


CHOOSER = [('bowline', 'fig-bowline', '-30 6 360 300', 'A loop that won’t slip', 'Bowline', 'Round a tree, a post, a bucket handle, yourself.'),
           ('clove', 'fig-clove', '52 22 320 192', 'Tie to a post, fast', 'Clove hitch', 'Start a lashing, hang gear, tether to a rail.'),
           ('tautline', 'fig-tautline', '118 34 320 132', 'A line you can tighten', 'Taut-line hitch', 'Tent and tarp guy lines, a washing line.'),
           ('sheetbend', 'fig-sheetbend', '14 24 410 250', 'Join two ropes', 'Sheet bend', 'Different sizes too; or a rope to a tarp corner.'),
           ('trucker', 'fig-trucker', '6 28 432 134', 'Lash a load down hard', 'Trucker’s hitch', 'Cart and roof loads, a ridge line pulled tight.'),
           ('reef', 'fig-reef', '10 30 424 132', 'Tie a bundle or bandage', 'Reef knot', 'Lies flat. Never for joining ropes under load.')]


def facts(use, avoid, undo):
    return ('    <div class="knot-facts">\n      <div class="knot-fact knot-use"><span class="knot-fact-k">Use it for</span>%s</div>\n'
            '      <div class="knot-fact knot-avoid"><span class="knot-fact-k">Don’t trust it when</span>%s</div>\n'
            '      <div class="knot-fact"><span class="knot-fact-k">To untie</span>%s</div>\n    </div>\n' % (use, avoid, undo))


def page():
    cards = ''.join('      <a class="knot-card" href="#%s">%s<span class="knot-card-job">%s</span><span class="knot-card-name">%s</span><span class="knot-card-note">%s</span></a>\n'
                    % (a, thumb(f, vb), job, name, note) for a, f, vb, job, name, note in CHOOSER)
    head = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'page-head.html'), encoding='utf-8').read()
    foot = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'page-foot.html'), encoding='utf-8').read()
    body = '''
  <section id="which-knot">
    <h2>1. Which Knot?</h2>
    <p>Pick the job, not the knot. Each one below is the simplest dependable answer to one job, and each has a way of failing that you should know before you rely on it.</p>
    <div class="knot-grid">
%s    </div>
    <div class="callout callout-red">
      <span class="callout-icon">⚠️</span>
      <div class="callout-content">
        <strong>A knot is not finished until it is dressed and set.</strong>
        Dressed means the strands lie neatly with no stray crossings; set means every strand has been pulled snug. Most knots that fail looked right and were never pulled tight.
        Nothing on this page is enough, on its own, to trust a life to: climbing and rescue knots need a rated rope and someone to check your work in person.
      </div>
    </div>
  </section>

  <section id="rope-words">
    <h2>2. Rope Words</h2>
    <p>Four shapes make every knot. The step-by-step instructions below use these words and no others.</p>
%s  </section>

  <section id="bowline">
    <h2>3. Bowline <span class="knot-tag">the loop that won’t slip</span></h2>
    <p>A fixed loop at the end of a rope. It does not tighten on what it holds, and however hard it has been pulled it unties easily afterwards.</p>
%s%s    <h3>How it fails</h3>
    <ul>
      <li><strong>Shaken loose.</strong> A bowline that is loaded, slackened and flapped about can work itself undone, most of all in stiff or slippery rope. Leave a long tail, and for anything that matters tie the tail round the loop’s near leg with an overhand knot.</li>
      <li><strong>Cannot be untied or adjusted under load.</strong> Take the weight off first.</li>
      <li><strong>Pulled sideways.</strong> It is made for a straight pull on the standing part. Loaded across the loop, or with the loop held wide open over a large object, it can distort and spill.</li>
    </ul>
  </section>

  <section id="clove">
    <h2>4. Clove Hitch <span class="knot-tag">fast tie to a post</span></h2>
    <p>Two turns round a post, held by their own crossing. Quick to tie, quick to adjust, and the usual start and finish of a lashing.</p>
%s%s    <h3>How it fails</h3>
    <ul>
      <li><strong>It rolls.</strong> If the load swings from side to side, or the post can turn, the hitch walks round and comes undone.</li>
      <li><strong>It slips on smooth or tapered posts</strong> and on square timber, and under a load that comes and goes.</li>
      <li><strong>Fix:</strong> finish with one or two half hitches round the standing part, or use a round turn and two half hitches instead for anything left unattended, including animals.</li>
    </ul>
  </section>

  <section id="tautline">
    <h2>5. Taut-Line Hitch <span class="knot-tag">a line you can tighten</span></h2>
    <p>An adjustable loop. It slides along its own standing line when you push it and grips when the line pulls on it, so a guy line can be tightened without retying.</p>
%s%s    <h3>How it fails</h3>
    <ul>
      <li><strong>Slips in slick, stiff or very thin cord.</strong> Add a third turn inside the loop. If it still creeps, the cord is wrong for the job.</li>
      <li><strong>Loosens when the line goes slack and flaps</strong>, as on a tarp in gusty wind. Check guy lines at dusk and after rain.</li>
      <li><strong>Not for heavy or critical loads.</strong> It is a tensioner for lines, not an anchor.</li>
    </ul>
  </section>

  <section id="sheetbend">
    <h2>6. Sheet Bend <span class="knot-tag">joins two ropes</span></h2>
    <p>The knot for joining two ropes, and the one to use when they differ in thickness or stiffness. It also ties a rope to the corner of a tarp or blanket: fold the corner over to make the bight.</p>
%s%s    <h3>How it fails</h3>
    <ul>
      <li><strong>Works loose when slack.</strong> It holds under steady pull; shaken about unloaded, it can loosen. Check it before you load it again.</li>
      <li><strong>Bight in the wrong rope.</strong> The bight goes in the thicker or stiffer rope. The other way round, the thin rope cannot grip and pulls out.</li>
      <li><strong>Short ends on opposite sides</strong> slips sooner. Retie it.</li>
    </ul>
  </section>

  <section id="trucker">
    <h2>7. Trucker’s Hitch <span class="knot-tag">pulls a load down hard</span></h2>
    <p>Not one knot but a small machine: a loop in the line used as a pulley, so one person can strap a load down far tighter than by pulling alone.</p>
%s%s    <h3>How it fails</h3>
    <ul>
      <li><strong>Over-tightening.</strong> It is easy to crush a load, bend a rail or snap thin cord. Pull until the load does not shift, then stop.</li>
      <li><strong>The loop jams or wears.</strong> See the note above. Cut out and discard any section that has gone flat, stiff or glazed.</li>
      <li><strong>Loads settle.</strong> Check and re-tension after the first few minutes of travel and at every stop.</li>
    </ul>
  </section>

  <section id="reef">
    <h2>8. Reef Knot <span class="knot-tag">binds a bundle</span></h2>
    <p>A binding knot: it ties the two ends of one cord round something. It lies flat, which is why it is used for bandages and slings, and it unties with one pull.</p>
%s%s%s    <h3>How it fails</h3>
    <div class="callout callout-red">
      <span class="callout-icon">⛔</span>
      <div class="callout-content">
        <strong>Never join two ropes with a reef knot if they will take a load.</strong>
        Pull on one end and it flips into a shape that slides straight off the other rope. Ropes of different thickness or slipperiness make it worse. To join ropes, use a <a href="#sheetbend">sheet bend</a>.
      </div>
    </div>
    <ul>
      <li><strong>Granny by mistake.</strong> Both half knots tied the same way. It slips, then jams so it cannot be undone.</li>
      <li><strong>Needs something to press against.</strong> Tied round a bundle or a limb it holds; hanging in mid-air between two ropes it does not.</li>
    </ul>
  </section>

  <section id="rope-care">
    <h2>9. Rope Strength &amp; Care</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Rule of thumb</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td><strong>A knot costs a third to a half of the rope’s strength.</strong></td><td>Rope breaks where it bends sharply, which is inside or just beside the knot. Wide curves are stronger than tight ones.</td></tr>
          <tr><td><strong>Work a rope at no more than a fifth of its breaking strength</strong>, and a tenth where a failure could hurt someone.</td><td>Shock loads, wear, knots and age all eat the margin. A dropped load can pull several times its own weight.</td></tr>
          <tr><td><strong>Keep rope off sharp edges.</strong></td><td>An edge under load cuts rope fast. Pad it with cloth, bark or a split length of hose.</td></tr>
          <tr><td><strong>Seal the ends.</strong></td><td>Melt synthetic rope; bind natural-fibre rope with twine or tape (a whipping). An unsealed end unlays itself and the rope is ruined from the end inwards.</td></tr>
          <tr><td><strong>Dry it, shade it, hang it.</strong></td><td>Natural fibre rots if stored damp. Sunlight weakens synthetics over months. Coil it loosely and hang it off the ground, away from fuel, battery acid and rodents.</td></tr>
          <tr><td><strong>Retire it</strong> if it has cuts, flat or stiff sections, a glazed or melted patch, or powder inside when you twist it open.</td><td>Damage inside a rope does not show until it breaks. Downgrade old rope to light jobs; never to lifting.</td></tr>
        </tbody>
      </table>
    </div>
    <p>Practise each knot until you can tie it behind your back, then tie it in the dark and with cold, wet hands. A knot you have to think about is one you will get wrong when it matters. Fibres and spinning for making your own cord are in <a href="textiles.html">Textiles &amp; Clothing</a>; the shelters these knots hold up are in <a href="shelter.html">Shelter &amp; Construction</a>.</p>
  </section>
''' % (cards, fig_words(),
       facts('Tying to a tree, post or ring; a bucket handle; a tarp corner loop; a loop to haul someone a short way.', 'It will be shaken slack and reloaded; the rope is stiff or slick; a life depends on it.', 'Push the collar forward off the standing part (“break its back”); it loosens at once.'), fig_bowline(),
       facts('Starting and finishing lashings; hanging gear from a pole; a quick temporary tie to a rail or stake.', 'The pull swings sideways; the post is smooth, square or free to turn; you are leaving it unattended.', 'Push the two ends towards each other and the turns open.'), fig_clove(),
       facts('Tent and tarp guy lines; a washing line; any line that needs re-tensioning as it stretches.', 'The cord is slick or stiff; the load is heavy; the line will flap slack in the wind.', 'Slacken the line and pull the end back out.'), fig_tautline(),
       facts('Joining two ropes, especially of different sizes; tying a rope to cloth; lengthening a line.', 'It will hang slack and be shaken; the ropes are very slick (use the double version).', 'Push the thin rope’s loop back over the bight.'), fig_sheetbend(),
       facts('Lashing loads to a cart, sledge or roof; pulling a ridge line or a fence wire tight.', 'The cord is thin enough to snap, or the load can be crushed; the same spot on the rope is used every time.', 'Pull out the half hitches and the tension is released at once. Stand clear of the load.'), fig_trucker(),
       facts('Bandages and slings; tying up a bundle or a rolled tarp; parcels; shoelaces.', 'It joins two ropes under load; the two ends differ in size or stiffness.', 'Pull one end back across the knot until it flips, then slide it off.'), fig_reef(), fig_reef_vs_granny())
    html = head + body + foot
    open(os.path.join(ROOT, 'sections', 'knots.html'), 'w', encoding='utf-8').write(html)
    return len(html)


if __name__ == '__main__':
    n = page()
    print('sections/knots.html written, %.0f KB' % (n / 1024))
