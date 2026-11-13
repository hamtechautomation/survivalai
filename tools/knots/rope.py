"""Rope-drawing engine for the Knots & Rope section.

A knot is described as one or more strands. Each strand is a smooth curve through
control points, plus a string of O/U marks: what the strand does (goes Over or
Under) at each crossing it meets, in order from its start.

The engine
  * samples the curves and FINDS every crossing itself,
  * refuses to draw unless the O/U marks account for every crossing and the two
    passes at each crossing disagree (one over, one under) -- so a mis-typed
    crossing is a build error, not a wrong picture,
  * draws the rope up to any point along its length, which is how the
    step-by-step "tying" frames are made.

Output is plain inline SVG using the .kn-* classes in assets/css/style.css.
"""
import math

W = 9.0          # rope body width (viewBox units)
CASE = 4.6       # extra width of the background-coloured casing that makes an under-pass look cut
PATCH = 11.0     # half-length of the over-strand piece redrawn on top at each crossing


def catmull(pts, step=1.4):
    """Uniform Catmull-Rom through pts -> dense polyline."""
    P = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        n = max(2, int(math.dist(p1, p2) / step))
        for k in range(n):
            t = k / n; t2 = t * t; t3 = t2 * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(tuple(pts[-1]))
    return out


class Strand:
    def __init__(self, name, pts, marks, cls='a', behind=()):
        self.name, self.cls, self.marks = name, cls, marks.replace(' ', '')
        self.poly = catmull(pts)
        self.cum = [0.0]
        for a, b in zip(self.poly, self.poly[1:]): self.cum.append(self.cum[-1] + math.dist(a, b))
        self.length = self.cum[-1]
        self.ctrl = pts
        self.behind_pts = behind          # [(ctrl index from, ctrl index to)] ranges hidden behind an object
        self.enc = []                     # encounters: (arc, crossing id)

    def arc_of_ctrl(self, i):
        """Arc length at control point i (nearest sample)."""
        p = self.ctrl[i]
        k = min(range(len(self.poly)), key=lambda j: math.dist(self.poly[j], p))
        return self.cum[k]

    def behind(self):
        return [(self.arc_of_ctrl(a), self.arc_of_ctrl(b)) for a, b in self.behind_pts]

    def is_behind(self, s):
        return any(a <= s <= b for a, b in self.behind())

    def at(self, s):
        s = max(0.0, min(self.length, s))
        lo, hi = 0, len(self.cum) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if self.cum[mid] <= s: lo = mid
            else: hi = mid
        a, b = self.poly[lo], self.poly[hi]; d = self.cum[hi] - self.cum[lo]
        t = 0 if d == 0 else (s - self.cum[lo]) / d
        return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)

    def sub(self, s0, s1):
        s0, s1 = max(0.0, s0), min(self.length, s1)
        if s1 <= s0: return []
        mid = [p for p, c in zip(self.poly, self.cum) if s0 < c < s1]
        return [self.at(s0)] + mid[1::3] + [self.at(s1)]          # every 3rd sample (~4 units) is plenty for a smooth curve

    def d(self, s0, s1):
        pts = self.sub(s0, s1)
        if len(pts) < 2: return ''
        return 'M' + ' L'.join('%.1f %.1f' % p for p in pts)

    def tangent(self, s):
        a, b = self.at(s - 1.5), self.at(s + 1.5)
        L = math.dist(a, b) or 1
        return ((b[0] - a[0]) / L, (b[1] - a[1]) / L)


def _seg_x(p, p2, q, q2):
    rx, ry = p2[0] - p[0], p2[1] - p[1]; sx, sy = q2[0] - q[0], q2[1] - q[1]
    den = rx * sy - ry * sx
    if abs(den) < 1e-12: return None
    t = ((q[0] - p[0]) * sy - (q[1] - p[1]) * sx) / den
    u = ((q[0] - p[0]) * ry - (q[1] - p[1]) * rx) / den
    if 0 <= t < 1 and 0 <= u < 1: return t, u
    return None


class Knot:
    def __init__(self, strands, name=''):
        self.strands, self.name = strands, name
        self.cross = []           # dict(pt, a=(strand, arc), b=(strand, arc), over=strand index 0/1 within the pair)
        self._find()
        self._assign()

    def _find(self):
        S = self.strands
        for i, A in enumerate(S):
            for j, B in enumerate(S):
                if j < i: continue
                for m in range(len(A.poly) - 1):
                    for n in range(len(B.poly) - 1):
                        if i == j and (n <= m or B.cum[n] - A.cum[m] < 3 * W): continue
                        r = _seg_x(A.poly[m], A.poly[m + 1], B.poly[n], B.poly[n + 1])
                        if not r: continue
                        sa = A.cum[m] + r[0] * (A.cum[m + 1] - A.cum[m]); sb = B.cum[n] + r[1] * (B.cum[n + 1] - B.cum[n])
                        if A.is_behind(sa) or B.is_behind(sb): continue          # hidden behind an object: not a visible crossing
                        pt = A.at(sa)
                        if any(math.dist(pt, c['pt']) < 2 for c in self.cross): continue
                        self.cross.append({'pt': pt, 'a': (i, sa), 'b': (j, sb)})
        for k, c in enumerate(self.cross):
            S[c['a'][0]].enc.append((c['a'][1], k, 'a')); S[c['b'][0]].enc.append((c['b'][1], k, 'b'))
        for s in S: s.enc.sort()

    def _assign(self):
        for s in self.strands:
            if len(s.marks) != len(s.enc):
                raise ValueError('%s / strand %s: %d crossings found but %d O/U marks given\n  crossings at: %s' % (
                    self.name, s.name, len(s.enc), len(s.marks), ', '.join('(%.0f,%.0f)' % self.cross[k]['pt'] for _, k, _ in s.enc)))
            for (arc, k, side), m in zip(s.enc, s.marks):
                self.cross[k][side + 'm'] = m
        for c in self.cross:
            if c['am'] == c['bm']:
                raise ValueError('%s: crossing at (%.0f, %.0f) is marked %s on both passes' % (self.name, c['pt'][0], c['pt'][1], c['am']))
            c['over'] = 'a' if c['am'] == 'O' else 'b'

    def describe(self):
        return '%s: %d crossings; ' % (self.name, len(self.cross)) + ' | '.join(
            '%s: %s' % (s.name, ' '.join('%s(%.0f,%.0f)' % (m, *self.cross[k]['pt']) for (_, k, _), m in zip(s.enc, s.marks))) for s in self.strands)

    # ── drawing ────────────────────────────────────────────────────────────
    # Rope pieces are written once into <defs> and placed with <use>, so a five-step
    # tying sequence costs little more than one drawing of the knot.
    def _ref(self, d):
        if d not in self.defs: self.defs[d] = '%s%d' % (self.prefix, len(self.defs))
        return self.defs[d]

    def defs_svg(self):
        return '<defs>' + ''.join('<path id="%s" d="%s"/>' % (i, d) for d, i in self.defs.items()) + '</defs>'

    def _use(self, d, cls, style=''):
        return '<use href="#%s" class="%s"%s/>' % (self._ref(d), cls, style)

    def _rope(self, s, s0, s1):
        d = s.d(s0, s1)
        if not d: return ''
        return ''.join(self._use(d, c) for c in ('kn-case', 'kn-%s-edge' % s.cls, 'kn-%s' % s.cls, 'kn-%s-hi' % s.cls))

    def _pieces(self, s, lo, hi, i):
        """[lo, hi] split at step boundaries and where the rope goes behind an object -> [(a, b, behind?)]"""
        cuts = sorted(set([lo, hi] + [c for c in self.cuts[i] if lo < c < hi] + [x for ab in s.behind() for x in ab if lo < x < hi]))
        return [(a, b, s.is_behind((a + b) / 2)) for a, b in zip(cuts, cuts[1:]) if b - a > 0.5]

    def setup(self, prefix, stops=None):
        """stops[i] = arc lengths where strand i pauses between steps."""
        self.prefix, self.defs = prefix, {}
        self.cuts = [sorted(stops[i]) if stops and stops[i] else [] for i in range(len(self.strands))]
        return self

    def draw(self, upto=None, prev=None, objects='', over=''):
        """SVG for the knot with strand i drawn to arc upto[i] (None = all).
        prev[i] = how far it was drawn in the previous step; the new piece lays itself in."""
        S = self.strands
        if not hasattr(self, 'defs'): self.setup('kn')
        upto = [s.length if (upto is None or upto[i] is None) else upto[i] for i, s in enumerate(S)]
        prev = [upto[i] if (prev is None or prev[i] is None) else min(prev[i], upto[i]) for i, s in enumerate(S)]
        o = ''
        EPS = 0.7                                                   # pieces overlap a hair so no seam shows
        # 1) parts behind the object, dashed
        for i, s in enumerate(S):
            for a, b, back in self._pieces(s, 0, upto[i], i):
                if back: o += self._use(s.d(a, b), 'kn-back' + (' kn-fade' if a >= prev[i] - 1 and prev[i] < upto[i] else ''))
        o += objects
        # 2) the ropes: what was already there, then the newly laid piece
        for i, s in enumerate(S):
            for a, b, back in self._pieces(s, 0, prev[i], i):
                if not back: o += self._rope(s, max(0, a - EPS), b)
        for i, s in enumerate(S):
            if upto[i] <= prev[i]: continue
            span = upto[i] - prev[i]
            for a, b, back in self._pieces(s, prev[i], upto[i], i):
                if back: continue
                d = s.d(max(0, a - EPS), b)
                st = ' style="--kn-len:%.0f;--kn-t0:%.2f;--kn-t:%.2f"' % (b - a + 3, (a - prev[i]) / span, (b - a) / span)
                o += self._use(d, 'kn-case kn-grow', st) + self._use(d, 'kn-%s-edge kn-grow' % s.cls, st) + self._use(d, 'kn-%s kn-grow' % s.cls, st)
                o += self._use(d, 'kn-%s-hi kn-fade' % s.cls)
        # 3) at each crossing, lay a short piece of the OVER strand back on top
        for c in self.cross:
            (ia, sa), (ib, sb) = c['a'], c['b']
            if sa > upto[ia] or sb > upto[ib]: continue
            io, so = (ia, sa) if c['over'] == 'a' else (ib, sb)
            s = S[io]
            a, b = max(0, so - PATCH), min(upto[io], so + PATCH)
            if so > prev[io]:
                o += '<g class="kn-pop" style="--kn-t0:%.2f">%s</g>' % ((so - prev[io]) / max(1.0, upto[io] - prev[io]), self._rope(s, a, b))
            else:
                o += self._rope(s, a, b)
        # 4) the working end: a whipped tip
        for i, s in enumerate(S):
            if getattr(s, 'tip', True) and upto[i] > 0:
                x, y = s.at(upto[i]); tx, ty = s.tangent(upto[i] - 2)
                ang = math.degrees(math.atan2(ty, tx))
                o += ('<g class="kn-tip%s" style="--kn-t0:1" transform="translate(%.1f %.1f) rotate(%.1f)">'
                      '<rect class="kn-%s-tip" x="-7" y="%.1f" width="8.5" height="%.1f" rx="1.6"/>'
                      '<line class="kn-whip" x1="-4.6" y1="%.1f" x2="-4.6" y2="%.1f"/><line class="kn-whip" x1="-1.8" y1="%.1f" x2="-1.8" y2="%.1f"/></g>') % (
                    ' kn-pop' if upto[i] > prev[i] else '', x, y, ang, s.cls, -W / 2 - 0.6, W + 1.2, -W / 2, W / 2, -W / 2, W / 2)
        return o + over
