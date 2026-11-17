#!/usr/bin/env python3
"""Third batch of redraws of older diagrams, in the shared .dg style.
Run:  python3 tools/redraw3.py   (safe to run again), then re-split the multi-panel ones:
  node tools/split-panels.js sections/metallurgy.html fig-nail:3:2
  node tools/split-panels.js sections/agriculture.html fig-tbh:2:1
  node tools/split-panels.js sections/textiles.html fig-spindle:2:1 fig-moccasin:2:1
Every label is taken from the diagram it replaces or from the section text beside it.
Corrections are listed in docs/DIAGRAMS.md ("Redrawn diagrams, third batch").
"""
import os, re, math
from redraw import T, AH, lead, num, fig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = {}


def beam(x1, y1, x2, y2, w, cls='dg-wood'):
    """A straight timber of width w drawn as a quad along the centre line."""
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); nx, ny = -dy / L * w / 2, dx / L * w / 2
    return '<path class="%s" d="M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z"/>' % (cls, x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny)


def panel(x, y, w, h, title, sub=None):
    s = '<rect class="dg-panel" x="%s" y="%s" width="%s" height="%s" rx="9"/>' % (x, y, w, h) + T(x + w / 2, y + 20, title, 'dg-th', 'mid')
    return s + (T(x + w / 2, y + 34, sub, 'dg-ts', 'mid') if sub else '')


def dimh(x1, x2, y, label, below=True):
    return ('<path class="dg-thin" d="M%s %s L%s %s M%s %s l0 8 M%s %s l0 8"/>' % (x1, y, x2, y, x1, y - 4, x2, y - 4)
            + T((x1 + x2) / 2, y + (14 if below else -6), label, 'dg-ts', 'mid'))


def dimv(x, y1, y2, label, left=True):
    return ('<path class="dg-thin" d="M%s %s L%s %s M%s %s l8 0 M%s %s l8 0"/>' % (x, y1, x, y2, x - 4, y1, x - 4, y2)
            + T(x + (-6 if left else 8), (y1 + y2) / 2 + 4, label, 'dg-ts', 'end' if left else 'start'))


def VT(x, y, s, c='dg-ts'):
    return '<text class="%s dg-mid" transform="translate(%s %s) rotate(-90)">%s</text>' % (c, x, y, s)


# 1 ── Timber A-frame, end view ────────────────────────────────────────────────────
b = AH('af')
G0, L0, R0, AX, AY = 262, 92, 352, 222, 93          # ground, feet, apex   (65 units = 1 m)
b += '<path class="dg-earth" d="M20 %d L424 %d L424 %d L20 %d Z"/>' % (G0 + 10, G0 + 10, G0 + 22, G0 + 22)
b += '<g data-hl="sill">' + beam(70, G0 + 4, 374, G0 + 4, 12) + '</g>'
b += '<g data-hl="raft">' + beam(L0, G0 - 2, AX + 6, AY - 8, 11) + beam(R0, G0 - 2, AX - 6, AY - 8, 11) + '</g>'
cy = 170; cl = L0 + (G0 - cy) / (G0 - AY) * (AX - L0); cr = 2 * AX - cl
b += '<g data-hl="collar">' + beam(cl - 4, cy, cr + 4, cy, 9) + '</g>'
b += '<g data-hl="ridge"><rect class="dg-key" x="%d" y="%d" width="16" height="16" rx="2"/></g>' % (AX - 8, AY - 4)
pur = ''
for f in (.3, .55, .8):
    x = L0 + f * (AX - L0); y = G0 - f * (G0 - AY); a = math.degrees(math.atan2(G0 - AY, AX - L0))
    pur += '<rect class="dg-key" x="-6" y="-14" width="12" height="9" transform="translate(%.1f %.1f) rotate(%.1f)"/>' % (x, y, -a)
    pur += '<rect class="dg-key" x="-6" y="-14" width="12" height="9" transform="translate(%.1f %.1f) rotate(%.1f)"/>' % (2 * AX - x, y, a)
b += '<g data-hl="purlin">' + pur + '</g>'
b += T(222, 22, 'TIMBER A-FRAME — END VIEW', 'dg-th', 'mid')
b += T(300, 64, 'RIDGE BEAM', 'dg-tb', hl='ridge') + T(300, 77, 'joins the pairs', 'dg-ts', hl='ridge') + lead(298, 68, 232, 86)
b += T(40, 98, 'RAFTERS', 'dg-tb', hl='raft') + T(40, 111, '100 × 50 mm, in pairs', 'dg-ts', hl='raft') + T(40, 123, 'every 600 mm', 'dg-ts', hl='raft') + T(40, 135, 'along the ridge', 'dg-ts', hl='raft') + lead(110, 140, 150, 166)
b += T(436, 120, 'PURLINS', 'dg-tb', 'end', 'purlin') + T(436, 133, 'carry the roof', 'dg-ts', 'end', 'purlin') + T(436, 145, 'covering', 'dg-ts', 'end', 'purlin') + lead(380, 128, 290, 160)
b += T(222, cy + 22, 'COLLAR TIE', 'dg-tb', 'mid', 'collar') + T(222, cy + 35, 'stiffens the pair', 'dg-ts', 'mid', 'collar')
b += T(222, G0 - 10, 'FLOOR BEAM / SILL ties the feet', 'dg-tb', 'mid', 'sill')
b += T(436, 196, 'without it the roof\'s', 'dg-ts', 'end', 'sill') + T(436, 208, 'weight pushes the', 'dg-ts', 'end', 'sill') + T(436, 220, 'feet apart', 'dg-ts', 'end', 'sill')
b += '<path class="dg-red-s" d="M360 236 L392 236" marker-end="url(#ah-af)"/><path class="dg-red-s" d="M84 236 L52 236" marker-end="url(#ah-af)"/>'
b += dimh(L0, R0, G0 + 34, '4.0 m')
b += dimv(30, AY, G0, '') + VT(22, (AY + G0) / 2, '2.6 m')
F['aframe'] = fig('fig-aframe-house', '0 0 444 312', 'Timber A-frame seen end-on: paired rafters meeting at a ridge beam, purlins, a collar tie, and a floor beam tying the feet; 4 m wide, 2.6 m high',
    b, 'The triangle braces itself, so there is no complex joinery. What it does need is something holding the <strong>feet together</strong>: the floor beam (or a tie low down). Without it the roof’s weight spreads the rafters apart. Add more rafter pairs every 600&nbsp;mm along the ridge to lengthen it; 6&nbsp;m long gives the 4&nbsp;m × 6&nbsp;m, 24&nbsp;m² floor.')

# 2 ── Earthbag dome: half section, half elevation ──────────────────────────────────
b = AH('eb')
G0, CX, R = 236, 222, 130                           # 65 units = 1 m: 4 m across, 2 m high
b += '<path class="dg-earth" d="M14 %d L430 %d L430 %d L14 %d Z"/>' % (G0, G0, G0 + 34, G0 + 34)
b += '<g data-hl="found"><rect class="dg-debris" x="%d" y="%d" width="40" height="30" rx="3"/><rect class="dg-debris" x="%d" y="%d" width="40" height="30" rx="3"/></g>' % (CX - R - 6, G0 + 2, CX + R - 34, G0 + 2)
bags, wire, course = '', '', 0
y = G0
while True:
    h = 13; yc = y - h / 2; dy = G0 - yc
    if dy >= R - 4: break
    half = math.sqrt(R * R - dy * dy)
    x0 = CX - half                                   # outer face of the bag in the cut (left half)
    bags += '<rect class="dg-earth" x="%.1f" y="%.1f" width="30" height="%d" rx="5"/>' % (x0, y - h, h - 1)
    if course: wire += '<path class="dg-red-s" d="M%.1f %.1f l26 0" stroke-dasharray="3 3" stroke-width="1.6"/>' % (x0 + 3, y)
    y -= h; course += 1
bags += '<rect class="dg-earth" x="%d" y="%.1f" width="34" height="11" rx="5"/>' % (CX - 34, G0 - R - 3)
b += '<g data-hl="bags">' + bags + '</g><g data-hl="wire">' + wire + '</g>'
# right half: elevation with course lines and a door
el = '<path class="dg-line" d="M%d %d A %d %d 0 0 1 %d %d"/>' % (CX, G0 - R, R, R, CX + R, G0)
y = G0
while y > G0 - R + 10:
    dy = G0 - y; half = math.sqrt(R * R - dy * dy)
    el += '<line class="dg-thin" x1="%d" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (CX, y, CX + half, y)
    y -= 13
b += el
b += '<g data-hl="door"><path class="dg-panel" d="M282 %d L282 176 Q302 150 322 176 L322 %d Z"/><path class="dg-wood-s" d="M282 %d L282 176 Q302 150 322 176 L322 %d"/></g>' % (G0, G0, G0, G0)
b += '<path class="dg-line" d="M%d %d A %d %d 0 0 1 %d %d"/>' % (CX - R, G0, R, R, CX, G0 - R)
b += '<g data-hl="plaster"><path class="dg-green-s" d="M%d %d A %d %d 0 0 1 %d %d" stroke-width="2.6"/></g>' % (CX, G0 - R - 3, R + 3, R + 3, CX + R + 3, G0)
b += '<g data-hl="plaster"><path class="dg-green-s" d="M%d %d A %d %d 0 0 1 %d %d" stroke-width="2.6"/></g>' % (CX - R - 3, G0, R + 3, R + 3, CX, G0 - R - 3)
b += '<line class="dg-guide" x1="%d" y1="%d" x2="%d" y2="%d"/>' % (CX, G0 - R + 6, CX, G0)
b += '<line class="dg-key-s" x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke-width="1.4" data-hl="compass"/><circle class="dg-keyf" cx="%d" cy="%d" r="3.5"/>' % (CX, G0, CX - R * math.cos(math.radians(52)), G0 - R * math.sin(math.radians(52)), CX, G0)
b += T(222, 20, 'EARTHBAG DOME', 'dg-th', 'mid') + T(222, 34, 'left: cut through the wall · right: outside view', 'dg-ts', 'mid')
b += T(8, 62, 'BAGS 90% full of', 'dg-tb', hl='bags') + T(8, 75, 'moist subsoil,', 'dg-ts', hl='bags') + T(8, 87, 'tamped every course', 'dg-ts', hl='bags') + lead(64, 92, 118, 158)
b += T(8, 122, '2 strands of', 'dg-tb', hl='wire') + T(8, 135, 'BARBED WIRE', 'dg-tb', hl='wire') + T(8, 148, 'on every course:', 'dg-ts', hl='wire') + T(8, 160, 'stops bags sliding', 'dg-ts', hl='wire') + lead(70, 166, 98, 198)
b += T(436, 62, 'each course steps', 'dg-tb', 'end') + T(436, 75, 'in a little', 'dg-ts', 'end') + lead(372, 70, 206, 110)
b += T(176, 212, 'string', 'dg-ts', 'mid', 'compass')
b += T(436, 112, 'LIME or COB', 'dg-tb', 'end', 'plaster') + T(436, 125, 'PLASTER, inside', 'dg-tb', 'end', 'plaster') + T(436, 138, 'and out', 'dg-ts', 'end', 'plaster')
b += lead(366, 132, 326, 144)
b += T(436, 184, 'DOOR', 'dg-tb', 'end', 'door') + T(436, 197, 'a temporary', 'dg-ts', 'end', 'door') + T(436, 209, 'frame while', 'dg-ts', 'end', 'door') + T(436, 221, 'building over', 'dg-ts', 'end', 'door') + lead(364, 200, 324, 210)
b += T(436, 254, 'RUBBLE', 'dg-tb', 'end', 'found') + T(436, 267, 'TRENCH', 'dg-tb', 'end', 'found')
b += dimh(CX - R, CX + R, G0 + 46, '4 m across · 2 m high inside')
F['earthbag'] = fig('fig-earthbag', '0 0 444 300', 'Earthbag dome, half cut away: bags of tamped subsoil with barbed wire between courses, each course stepping inward, on a rubble trench, plastered inside and out, with a framed door',
    b, 'Each course of bags sits a little further in than the one below, and two strands of barbed wire on every course act as “mortar”, stopping the bags sliding. A string from a centre pin (or a plumb bob from a centre pole) checks every course. Plaster with lime or cob inside and out: sunlight rots the bags.')

# 3 ── Retort charcoal kiln ─────────────────────────────────────────────────────────
b = AH('rt')
b += '<g data-hl="box"><path class="dg-debris" d="M20 70 L250 70 L250 240 L20 240 Z"/><rect class="dg-panel" x="34" y="84" width="202" height="142"/></g>'
b += '<g data-hl="fire"><path class="dg-red" d="M40 220 q10 -26 20 -6 q8 -30 20 -4 q10 -24 20 -2 q10 -28 22 0 q8 -24 20 -2 q10 -26 20 -4 q8 -22 18 0 q10 -20 20 4 L236 226 L40 226 Z"/>'
b += '<path class="dg-red" d="M40 120 q-2 26 10 40 q-12 20 -4 44 L40 204 Z M230 120 q2 26 -10 40 q12 20 4 44 L230 204 Z" opacity=".8"/></g>'
b += '<g data-hl="barrel"><rect class="dg-line" x="70" y="96" width="130" height="104" rx="6"/>'
b += ''.join('<rect class="dg-wood" x="%d" y="%d" width="%d" height="13" rx="6"/>' % (78 + (i % 2) * 8, 108 + i * 14, 106 - (i % 2) * 8) for i in range(6)) + '</g>'
b += '<g data-hl="lid"><rect class="dg-key" x="64" y="88" width="142" height="10" rx="2"/><path class="dg-key-s" d="M68 86 l0 16 M202 86 l0 16"/></g>'
b += '<g data-hl="pipe"><path class="dg-blue-s" d="M135 88 L135 50 L270 50 L270 252 L120 252 L120 232" stroke-width="5" opacity=".75"/>'
b += '<path class="dg-ah" d="M114 234 L120 222 L126 234 Z" transform="translate(0 2)"/></g>'
b += T(20, 22, 'RETORT KILN', 'dg-th') + T(20, 36, 'wood cooks in a sealed barrel inside the fire', 'dg-ts')
b += T(135, 154, 'WOOD', 'dg-tb', 'mid', 'barrel')
b += T(280, 64, 'GAS PIPE', 'dg-tb', hl='pipe') + T(280, 77, 'smoke and gas from the', 'dg-ts', hl='pipe') + T(280, 89, 'wood are piped back into', 'dg-ts', hl='pipe') + T(280, 101, 'the fire and burn: the', 'dg-ts', hl='pipe') + T(280, 113, 'wood helps heat itself', 'dg-ts', hl='pipe')
b += T(280, 136, 'TIGHT LID', 'dg-tb', hl='lid') + T(280, 149, 'clamped or bolted: no air', 'dg-ts', hl='lid') + T(280, 161, 'gets in, so the wood chars', 'dg-ts', hl='lid') + T(280, 173, 'instead of burning', 'dg-ts', hl='lid')
b += T(280, 196, 'WOOD packed tight,', 'dg-tb', hl='barrel') + T(280, 209, 'billets 6–12 in long', 'dg-ts', hl='barrel')
b += T(20, 270, 'DONE WHEN', 'dg-th') + T(20, 286, '✓ no more smoke from the pipe   ✓ the gas no longer burns', 'dg-t')
b += T(20, 302, '⚠ cool completely before opening: hot charcoal bursts into flame', 'dg-tb', hl='lid')
F['retort'] = fig('fig-retort', '0 0 444 312', 'Retort charcoal kiln: a sealed barrel of wood sits inside a fire box; a pipe from the lid carries the wood gas back down into the fire',
    b, 'No air reaches the wood, so it turns to charcoal instead of ash. Once it starts to cook, the gas it gives off burns in the fire around it. Never open it hot.')

# 4 ── Brake drum forge, cross-section ─────────────────────────────────────────────
b = AH('bd')
b += '<line class="dg-line" x1="20" y1="284" x2="424" y2="284"/>'
b += '<g data-hl="stand"><path class="dg-line" d="M134 140 L130 284 M310 140 L314 284 M132 262 L312 262"/></g>'
b += '<g data-hl="drum"><path class="dg-white" d="M110 70 L334 70 L334 82 L316 82 L316 140 L250 140 L250 150 L194 150 L194 140 L128 140 L128 82 L110 82 Z" opacity=".35"/>'
b += '<path class="dg-line" d="M110 70 L110 82 L128 82 L128 140 L194 140 L194 150 M334 70 L334 82 L316 82 L316 140 L250 140 L250 150"/></g>'
b += '<g data-hl="grate">' + ''.join('<rect class="dg-key" x="%d" y="122" width="10" height="6" rx="1"/>' % x for x in range(140, 310, 18)) + '</g>'
b += '<g data-hl="fire"><path class="dg-debris" d="M132 120 Q134 96 160 94 L290 94 Q312 96 312 120 Z"/><path class="dg-red" d="M176 118 Q182 80 222 74 Q262 80 268 118 Z"/></g>'
b += '<g data-hl="work"><rect class="dg-key" x="150" y="86" width="210" height="8" rx="2" transform="rotate(-4 255 90)"/></g>'
b += '<g data-hl="tuy"><rect class="dg-water" x="210" y="150" width="24" height="80" opacity=".9"/><path class="dg-water" d="M210 206 L210 230 L380 230 L380 206 Z" opacity=".9"/></g>'
b += '<g data-hl="ash"><rect class="dg-panel" x="316" y="130" width="22" height="8"/><path class="dg-thin" d="M338 134 L352 134"/></g>'
b += '<g data-hl="blow"><rect class="dg-green" x="380" y="190" width="44" height="52" rx="8"/></g>'
b += '<path class="dg-blue-s" d="M372 218 L240 218" marker-end="url(#ah-bd)"/><path class="dg-blue-s" d="M222 200 L222 128" marker-end="url(#ah-bd)"/>'
b += T(222, 20, 'BRAKE DRUM FORGE — CROSS-SECTION', 'dg-th', 'mid')
b += T(30, 48, 'WORKPIECE', 'dg-tb', hl='work') + T(30, 61, 'in the hottest spot', 'dg-ts', hl='work') + lead(132, 60, 152, 90)
b += T(436, 48, 'FIRE + FUEL', 'dg-tb', 'end', 'fire') + T(436, 61, 'coal or charcoal', 'dg-ts', 'end', 'fire') + lead(362, 56, 262, 98)
b += T(30, 92, 'BRAKE DRUM', 'dg-tb', hl='drum') + T(30, 105, 'truck, cast iron', 'dg-ts', hl='drum') + lead(112, 96, 114, 80)
b += T(30, 136, 'GRATE: steel', 'dg-tb', hl='grate') + T(30, 149, 'bars hold fuel', 'dg-ts', hl='grate') + T(30, 161, 'above the air hole', 'dg-ts', hl='grate') + lead(108, 140, 140, 126)
b += T(436, 120, 'ASH DUMP', 'dg-tb', 'end', 'ash') + T(436, 133, 'hole 2 cm below', 'dg-ts', 'end', 'ash') + T(436, 145, 'the grate', 'dg-ts', 'end', 'ash')
b += T(204, 168, 'TUYERE', 'dg-tb', 'end', 'tuy') + T(204, 181, '4–6 cm pipe', 'dg-ts', 'end', 'tuy') + T(204, 193, 'up the centre', 'dg-ts', 'end', 'tuy')
b += T(402, 260, 'BLOWER', 'dg-tb', 'mid', 'blow') + T(402, 273, 'or bellows', 'dg-ts', 'mid', 'blow')
b += dimv(18, 70, 284, '') + VT(12, 220, 'hip height ≈ 90 cm')
F['drumforge'] = fig('fig-drumforge', '0 0 444 296', 'Brake drum forge in cross-section: a cast-iron truck brake drum at hip height, a grate over a central air pipe fed by a blower, fire and workpiece in the bowl, and a side ash dump',
    b, 'Air is forced up the tuyere, through the grate and into the fire. Mount the drum at hip height, about 90&nbsp;cm. A hand-crank blower, bellows or even an old hair dryer will drive it. The side ash dump lets you clear clinker without disturbing the fire.')

# 5 ── Knife: five stages + bevel ──────────────────────────────────────────────────
b = AH('kn')
X0, W = 10, 84
shapes = [
    '<rect class="dg-line" x="0" y="0" width="70" height="14" rx="1"/>',
    '<path class="dg-line" d="M0 2 L48 2 L70 12 L48 14 L0 14 Z"/>',
    '<path class="dg-line" d="M0 4 L24 2 L50 2 L70 12 L50 14 L24 12 L0 12 Z"/><path class="dg-thin" d="M24 8 L66 11"/>',
    '<path class="dg-line" d="M0 5 L24 3 L50 2 L70 12 L50 14 L24 12 L0 11 Z"/><path class="dg-thin" d="M24 9 L66 11.5"/>',
    '<rect class="dg-wood" x="0" y="2" width="26" height="12" rx="4"/><path class="dg-key" d="M26 2 L50 2 L70 12 L50 14 L26 14 Z"/><path class="dg-thin" d="M26 10 L66 12"/>',
]
steps = [('STOCK', 'anneal: heat', 'to cherry red,', 'cool in ash'), ('PROFILE', 'mark it, cut', '3–4 mm outside', 'the line'), ('FORGE', 'draw the tip,', 'forge bevels,', 'draw the tang'),
         ('GRIND', 'normalize 3×,', 'then grind; edge', 'left 0.5 mm'), ('HARDEN', 'oil quench,', 'temper straw,', 'sharpen')]
for i, ((t, a, c, d), sh) in enumerate(zip(steps, shapes)):
    x = X0 + i * (W + 4)
    b += '<g data-hl="k%d">' % i + num(x + 10, 50, i + 1) + T(x + 24, 54, t, 'dg-tb dg-tb-sm') + '<g transform="translate(%d 66)">%s</g>' % (x + 4, sh)
    b += T(x + 2, 102, a, 'dg-ts') + T(x + 2, 114, c, 'dg-ts') + T(x + 2, 126, d, 'dg-ts') + '</g>'
    if i < 4: b += '<path class="dg-arrow" d="M%d 74 L%d 74" marker-end="url(#ah-kn)"/>' % (x + 76, x + W + 2)
b += T(222, 22, 'FORGING A KNIFE', 'dg-th', 'mid') + T(222, 36, 'each stage is a full forging heat — do not rush', 'dg-ts', 'mid')
b += '<line class="dg-guide" x1="10" y1="138" x2="434" y2="138"/>'
b += T(222, 154, 'EDGE BEVEL — the blade cut across', 'dg-th', 'mid')
for k, (ang, name, note) in enumerate(((15, 'slicing', 'fillet, kitchen'), (22.5, 'utility', '20–25° a side'), (30, 'chopping', 'heavy chopper'))):
    cx = 78 + k * 144; ty, by = 172, 262; half = (by - ty) * math.tan(math.radians(ang))
    b += '<g data-hl="b%d"><path class="dg-white" d="M%.1f %d L%.1f %d L%d %d Z" opacity=".9"/>' % (k, cx - half, ty, cx + half, ty, cx, by)
    b += '<line class="dg-guide" x1="%d" y1="%d" x2="%d" y2="%d"/>' % (cx, ty - 4, cx, by)
    b += '<path class="dg-key-s" d="M%d %d A 40 40 0 0 1 %.1f %.1f" stroke-width="1.6"/>' % (cx, by - 40, cx + 40 * math.sin(math.radians(ang)), by - 40 * math.cos(math.radians(ang)))
    b += T(cx + half + 6, ty + 22, ('%g°' % ang) if k != 1 else '20–25°', 'dg-tb dg-tb-sm')
    b += T(cx, by + 16, name, 'dg-tb', 'mid') + T(cx, by + 29, note, 'dg-ts', 'mid') + '</g>'
b += T(8, 186, 'spine', 'dg-ts') + T(8, 258, 'edge', 'dg-ts')
F['knife'] = fig('fig-knife', '0 0 444 300', 'Forging a knife in five stages, from annealed bar stock to hardened blade, and three edge bevels: 15° for slicing, 20 to 25° for a utility knife, 30° for chopping',
    b, 'Normalize three times after forging and before grinding. Leave the edge about 0.5&nbsp;mm thick until after the quench, or it may warp. Bevel angles are per side: keep the same angle every time you sharpen (a wooden guide block cut to the angle helps).')

# 6 ── Nail making, six steps (panels) ──────────────────────────────────────────────
b = AH('nl')
PW, PH = 144, 132
def rod(x, y0, y1, w=8, tip=True):
    s = '<path class="dg-line" d="M%d %d L%d %d L%d %d L%d %d Z"/>' % (x - w / 2, y0, x + w / 2, y0, x + w / 2, y1 - (14 if tip else 0), x - w / 2, y1 - (14 if tip else 0))
    if tip: s += '<path class="dg-key" d="M%d %d L%d %d L%d %d Z"/>' % (x - w / 2, y1 - 14, x + w / 2, y1 - 14, x, y1)
    return s
def header(x, y):
    return '<rect class="dg-white" x="%d" y="%d" width="70" height="10" rx="3" opacity=".55"/><rect class="dg-panel" x="%d" y="%d" width="8" height="10"/>' % (x - 20, y, x - 4, y)
nail = [
    ('POINT', 'four-sided taper; turn', '90° between blows',
     rod(72, 48, 110) + '<rect class="dg-red" x="66" y="82" width="12" height="28" opacity=".5"/>' + '<path class="dg-key-s" d="M96 92 a 10 10 0 1 1 -4 -10" stroke-width="1.6"/><path class="dg-ah" d="M92 77 l6 2 l-5 5z"/>'),
    ('MARK', 'point in the header;', 'mark the length',
     header(72, 70) + rod(72, 36, 110) + '<path class="dg-key-s" d="M60 58 L84 58" stroke-dasharray="3 2"/>' + T(92, 62, 'mark', 'dg-ts')),
    ('NICK', 'hot-cut almost through', 'leave it just attached',
     rod(72, 36, 110) + '<path class="dg-red" d="M76 58 L88 52 L88 64 Z"/><path class="dg-line" d="M88 50 L112 44 L112 70 L88 66 Z"/>' + T(116, 56, 'hot', 'dg-ts') + T(116, 68, 'chisel', 'dg-ts')),
    ('IN THE HEADER', 'header over the point;', 'twist the rod off',
     header(72, 76) + rod(72, 80, 112) + '<rect class="dg-line" x="68" y="64" width="8" height="12"/>' + '<path class="dg-guide" d="M68 36 L76 36 L76 60 L68 60 Z"/>' + T(84, 74, 'stub', 'dg-ts')),
    ('HEAD', '3–4 blows spread', 'the stub into a head',
     header(72, 80) + rod(72, 84, 112) + '<path class="dg-key" d="M58 80 Q72 66 86 80 Z"/>' + '<rect class="dg-line" x="56" y="40" width="32" height="14" rx="2"/><path class="dg-line" d="M88 47 L118 47"/><path class="dg-arrow" d="M72 56 L72 66" marker-end="url(#ah-nl)"/>'),
    ('RELEASE', 'over the pritchel hole:', 'tap, the nail drops out',
     '<path class="dg-key" d="M58 52 Q72 40 86 52 Z"/>' + rod(72, 52, 116, 8) + '<path class="dg-arrow" d="M104 70 L104 100" marker-end="url(#ah-nl)"/>'),
]
for i, (t, a, c, art) in enumerate(nail):
    px, py = 2 + (i % 3) * (PW + 6), 2 + (i // 3) * (PH + 6)
    b += '<rect class="dg-panel" x="%d" y="%d" width="%d" height="%d" rx="9"/>' % (px, py, PW, PH)
    b += num(px + 14, py + 16, i + 1) + T(px + 28, py + 20, t, 'dg-tb dg-tb-sm')
    b += '<g transform="translate(%d %d) scale(.8)">%s</g>' % (px + 14, py + 10, art)
    b += T(px + 8, py + PH - 20, a, 'dg-ts') + T(px + 8, py + PH - 8, c, 'dg-ts')
F['nail'] = fig('fig-nail', '0 0 444 274', 'Making a nail in six steps: point the rod, mark the length in the header, nick it, set it in the header and twist off, strike the head, tap it out',
    b, 'Mild steel rod, 4–6&nbsp;mm. <strong>Make the nail header first</strong>: without it every head takes several heats. With one, a practised smith makes 60–100 nails an hour; 3–4&nbsp;in framing nails are the most needed.')

# 7 ── Drop spindle + twist direction (two panels) ─────────────────────────────────
b = AH('sp')
b += panel(2, 2, 220, 300, 'BOTTOM-WHORL SPINDLE', 'build time 20–30 minutes')
b += '<g data-hl="fib"><path class="dg-white" d="M60 52 Q40 62 52 80 Q66 96 92 92 Q104 70 92 56 Q78 46 60 52 Z" opacity=".75"/></g>'
b += '<path class="dg-key-s" d="M88 88 Q100 104 108 112 L112 120" stroke-width="1.6"/>'
b += '<g data-hl="shaft"><rect class="dg-wood" x="108" y="118" width="8" height="166" rx="3"/><path class="dg-line" d="M112 118 q0 -10 8 -8 q6 2 2 8" stroke-width="1.6"/></g>'
b += '<g data-hl="cop"><path class="dg-key" d="M108 196 Q90 222 108 244 L116 244 Q134 222 116 196 Z"/></g>'
b += '<g data-hl="whorl"><ellipse class="dg-wood" cx="112" cy="252" rx="46" ry="10"/><ellipse class="dg-wood" cx="112" cy="248" rx="46" ry="10"/></g>'
b += '<path class="dg-key-s" d="M146 140 a 34 10 0 1 1 -10 -6" stroke-width="1.6"/><path class="dg-ah" d="M136 128 l8 4 l-8 4z"/>'
b += T(10, 112, 'FIBRE', 'dg-tb', hl='fib') + T(10, 125, 'drafted out', 'dg-ts', hl='fib') + T(10, 137, 'by hand', 'dg-ts', hl='fib')
b += T(214, 116, 'HOOK', 'dg-tb', 'end', 'shaft') + lead(180, 112, 122, 112)
b += T(214, 168, 'SHAFT', 'dg-tb', 'end', 'shaft') + T(214, 181, '10–12 in', 'dg-ts', 'end', 'shaft') + lead(178, 172, 118, 172)
b += T(10, 210, 'COP: spun', 'dg-tb', hl='cop') + T(10, 223, 'yarn wound on', 'dg-ts', hl='cop') + lead(76, 214, 100, 218)
b += T(214, 278, 'WHORL', 'dg-tb', 'end', 'whorl') + T(214, 291, '3 in disc', 'dg-ts', 'end', 'whorl') + lead(168, 280, 150, 256)
b += T(160, 150, 'spin', 'dg-ts')
b += panel(226, 2, 216, 300, 'WHICH WAY TO SPIN', 'looking down the shaft')
def yarn(x, slope, cls):
    s = '<rect class="dg-white" x="%d" y="70" width="34" height="150" rx="17" opacity=".85"/>' % (x - 17)
    for k in range(9):
        y = 82 + k * 15
        s += '<line class="%s" x1="%d" y1="%d" x2="%d" y2="%d" stroke-width="2.6"/>' % (cls, x - 12, y + 6 * slope, x + 12, y - 6 * slope)
    return s
b += '<g data-hl="z">' + yarn(280, 1, 'dg-key-s') + T(280, 244, 'Z', 'dg-big', 'mid') + T(280, 262, 'clockwise', 'dg-tb', 'mid') + T(280, 276, 'singles', 'dg-ts', 'mid') + '</g>'
b += '<g data-hl="s">' + yarn(388, -1, 'dg-blue-s') + T(388, 244, 'S', 'dg-big', 'mid') + T(388, 262, 'anticlockwise', 'dg-tb', 'mid') + T(388, 276, 'plying', 'dg-ts', 'mid') + '</g>'
b += T(334, 140, 'slant', 'dg-ts', 'mid') + T(334, 152, 'matches the', 'dg-ts', 'mid') + T(334, 164, 'letter’s middle', 'dg-ts', 'mid')
F['spindle'] = fig('fig-spindle', '0 0 444 304', 'Bottom-whorl drop spindle: hook at the top, 10 to 12 inch shaft, yarn cop above a 3 inch whorl; Z twist spun clockwise for singles, S twist anticlockwise for plying',
    b, 'Spin <strong>clockwise for Z-twist singles</strong>, then ply two singles together <strong>anticlockwise (S)</strong>: the opposite twists lock together and the yarn stops snarling.')

# 8 ── Frame loom ───────────────────────────────────────────────────────────────────
b = AH('lm')
FX0, FX1, FY0, FY1 = 20, 280, 40, 290
b += '<g data-hl="frame"><path class="dg-wood" d="M%d %d L%d %d L%d %d L%d %d Z M%d %d L%d %d L%d %d L%d %d Z" fill-rule="evenodd"/></g>' % (FX0, FY0, FX1, FY0, FX1, FY1, FX0, FY1, FX0 + 16, FY0 + 16, FX1 - 16, FY0 + 16, FX1 - 16, FY1 - 16, FX0 + 16, FY1 - 16)
xs = list(range(48, 256, 13))
warp = ''.join('<line class="dg-line" x1="%d" y1="%d" x2="%d" y2="%d" stroke-width="1.6"/>' % (x, FY0 + 8, x, FY1 - 8) for x in xs)
nails = ''.join('<circle class="dg-keyf" cx="%d" cy="%d" r="2.4"/><circle class="dg-keyf" cx="%d" cy="%d" r="2.4"/>' % (x, FY0 + 8, x, FY1 - 8) for x in xs)
b += '<g data-hl="warp">' + warp + nails + '</g>'
weave = ''
for r in range(9):
    y = FY1 - 26 - r * 6
    weave += '<line class="dg-key-s" x1="%d" y1="%d" x2="%d" y2="%d" stroke-width="4"/>' % (xs[0] - 4, y, xs[-1] + 4, y)
    weave += ''.join('<line class="dg-line" x1="%d" y1="%d" x2="%d" y2="%d" stroke-width="1.6"/>' % (x, y - 3, x, y + 3) for j, x in enumerate(xs) if (j + r) % 2 == 0)
b += '<g data-hl="weft">' + weave + '</g>'
b += '<g data-hl="shed"><rect class="dg-wood" x="34" y="120" width="234" height="10" rx="4"/>' + ''.join('<line class="dg-line" x1="%d" y1="118" x2="%d" y2="132" stroke-width="1.6"/>' % (x, x) for j, x in enumerate(xs) if j % 2 == 0) + '</g>'
b += '<g data-hl="shut"><rect class="dg-key" x="96" y="186" width="120" height="14" rx="7"/><path class="dg-arrow" d="M220 193 L262 193" marker-end="url(#ah-lm)"/></g>'
b += '<rect class="dg-panel" x="112" y="205" width="76" height="18" rx="4"/>' + T(150, 218, 'beat down ↓', 'dg-tb dg-tb-sm', 'mid', 'weft')
b += T(150, 30, 'FRAME LOOM', 'dg-th', 'mid')
b += '<rect class="dg-panel" x="112" y="137" width="76" height="18" rx="4"/>' + T(150, 150, 'SHED STICK', 'dg-tb', 'mid', 'shed') + T(156, 197, 'SHUTTLE', 'dg-tb', 'mid', 'shut')
b += T(150, 312, 'nails every ½ in, top and bottom · learning size 12 × 18 in', 'dg-ts', 'mid', 'warp')
terms = [('warp', 'WARP', 'threads held tight', 'top to bottom'), ('weft', 'WEFT', 'thread carried across', 'by the shuttle'),
         ('shed', 'SHED', 'the gap opened between', 'odd and even warps'), ('warp', 'SETT', 'warp ends per inch', '(epi)'), ('weft', 'BEAT', 'push each pass down', 'with a comb or fork')]
for i, (k, a, c, d) in enumerate(terms):
    y = 56 + i * 48
    b += T(296, y, a, 'dg-tb', hl=k) + T(296, y + 13, c, 'dg-ts', hl=k) + T(296, y + 25, d, 'dg-ts', hl=k)
F['loom'] = fig('fig-loom', '0 0 444 320', 'Frame loom: warp threads stretched between nails on a wooden frame, a shed stick woven through, a shuttle carrying weft across, and finished plain weave at the bottom',
    b, 'Four lengths of 2×2 lumber and a row of nails top and bottom. Turn the shed stick on edge to lift alternate warps, pass the shuttle through, then lay it flat and pick up the other set by hand for the return pass. Beat each pass down.')

# 9 ── Moccasin pattern + finished shoe (two panels) ─────────────────────────────────
b = AH('mc')
b += panel(2, 2, 240, 300, 'THE PATTERN', 'one piece of hide')
foot = 'M122 72 C146 70 158 96 156 130 C154 168 150 196 148 222 C146 250 134 262 118 262 C100 262 90 248 92 226 C94 196 90 170 88 140 C86 100 96 74 122 72 Z'
cut = 'M122 46 C168 44 188 92 184 136 C182 180 178 214 176 240 L140 262 L140 288 L98 288 L98 262 L62 240 C62 212 60 182 60 142 C58 92 76 48 122 46 Z'
b += '<g data-hl="cut"><path class="dg-leather" d="%s" opacity=".55"/><path class="dg-key-s" d="%s" stroke-dasharray="6 4"/></g>' % (cut, cut)
b += '<g data-hl="foot"><path class="dg-line" d="%s"/></g>' % foot
b += '<g data-hl="toe">' + ''.join('<line class="dg-red-s" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke-width="1.6"/>' % (
    122 + 62 * math.cos(math.radians(a)), 108 - 62 * math.sin(math.radians(a)), 122 + 50 * math.cos(math.radians(a)), 108 - 50 * math.sin(math.radians(a))) for a in range(40, 150, 14)) + '</g>'
b += '<g data-hl="heel"><path class="dg-red-s" d="M98 262 L98 288 M140 262 L140 288"/></g>'
b += T(122, 170, 'FOOT', 'dg-tb', 'mid', 'foot') + T(122, 183, 'trace', 'dg-ts', 'mid', 'foot')
b += dimh(156, 184, 132, '2 in', False)
b += T(10, 60, 'small cuts', 'dg-tb', hl='toe') + T(10, 73, 'let the toe', 'dg-ts', hl='toe') + T(10, 85, 'gather', 'dg-ts', hl='toe')
b += T(10, 256, 'heel edges', 'dg-tb', hl='heel') + T(10, 269, 'meet; sewn', 'dg-ts', hl='heel') + T(10, 281, 'up the back', 'dg-ts', hl='heel') + lead(70, 274, 96, 276)
b += T(236, 190, 'cut line', 'dg-tb', 'end', 'cut') + T(236, 203, '(dashed)', 'dg-ts', 'end', 'cut')
b += panel(246, 2, 196, 300, 'SEWN UP', 'two seams only')
b += '<g data-hl="toe"><path class="dg-leather" d="M268 214 Q262 168 300 160 L360 160 Q404 162 414 196 Q420 214 400 220 L280 222 Q268 220 268 214 Z"/>'
b += '<path class="dg-red-s" d="M318 164 Q352 150 396 184" stroke-width="1.6"/>' + ''.join('<line class="dg-red-s" x1="%d" y1="%d" x2="%d" y2="%d" stroke-width="1.2"/>' % (x, 160 + (x - 318) * .45, x + 2, 170 + (x - 318) * .45) for x in range(326, 392, 9)) + '</g>'
b += '<g data-hl="heel"><path class="dg-red-s" d="M272 168 L270 214" stroke-dasharray="3 3"/></g>'
b += T(380, 120, 'gathered toe', 'dg-tb', 'mid', 'toe') + lead(380, 126, 370, 160) + T(258, 246, 'heel seam', 'dg-tb', hl='heel') + T(258, 259, 'whipstitch or', 'dg-ts', hl='heel') + T(258, 271, 'backstitch', 'dg-ts', hl='heel') + lead(270, 240, 271, 200)
b += T(344, 64, 'for ankle cover, leave', 'dg-ts', 'mid') + T(344, 76, 'extra at the heel to', 'dg-ts', 'mid') + T(344, 88, 'fold up and tie', 'dg-ts', 'mid')
F['moccasin'] = fig('fig-moccasin', '0 0 444 304', 'One-piece moccasin: the foot traced on hide with a 2 inch margin, small cuts round the toe, and the heel edges sewn up the back; the finished shoe with a gathered toe',
    b, 'Trace the foot with about 2&nbsp;in to spare all round, cut one piece, dampen it, gather the toe over the foot and sew the heel up the back. 30–60 minutes. On rough ground, stitch a hard sole of heavy leather or tyre tread underneath.')

# 10 ── Rainwater catchment with first-flush ─────────────────────────────────────────
b = AH('rw')
b += ''.join('<path class="dg-blue-s" d="M%d 18 l-6 14" stroke-width="1.6"/>' % x for x in range(40, 200, 22))
b += '<g data-hl="roof"><path class="dg-debris" d="M10 54 L200 40 L200 50 L10 64 Z"/></g>'
b += '<g data-hl="gut"><path class="dg-water" d="M196 46 L224 46 L224 60 Q210 66 196 60 Z"/><path class="dg-thin" d="M196 46 L224 46" stroke-dasharray="2 2"/></g>'
b += '<rect class="dg-water" x="204" y="60" width="12" height="44"/><path class="dg-water" d="M204 104 L330 104 L330 116 L216 116 L216 260 L204 260 Z"/>'
b += '<g data-hl="ff"><rect class="dg-water" x="194" y="130" width="32" height="140" rx="4"/><circle class="dg-white" cx="210" cy="140" r="10"/><rect class="dg-key" x="198" y="270" width="24" height="10" rx="2"/></g>'
b += '<path class="dg-blue-s" d="M210 286 l0 10" stroke-dasharray="2 3"/>'
b += '<g data-hl="tank"><rect class="dg-water" x="290" y="128" width="92" height="140" rx="10"/><rect class="dg-line" x="290" y="128" width="92" height="140" rx="10"/><rect class="dg-key" x="286" y="120" width="100" height="10" rx="3"/></g>'
b += '<path class="dg-water" d="M324 116 L336 116 L336 128 L324 128 Z"/>'
b += '<g data-hl="over"><path class="dg-blue-s" d="M382 146 L414 146 L414 198" stroke-width="4"/></g>'
b += '<g data-hl="tap"><path class="dg-line" d="M290 254 L276 254 L276 264"/><rect class="dg-key" x="270" y="250" width="10" height="8"/></g>'
b += '<rect class="dg-debris" x="286" y="268" width="100" height="22"/><line class="dg-line" x1="10" y1="290" x2="434" y2="290"/>'
b += T(10, 86, 'ROOF', 'dg-tb', hl='roof') + T(10, 99, 'metal, unpainted tin', 'dg-ts', hl='roof') + T(10, 111, 'or clay tile; avoid', 'dg-ts', hl='roof') + T(10, 123, 'asphalt and lead', 'dg-ts', hl='roof')
b += T(236, 44, 'GUTTER, screened', 'dg-tb', hl='gut')
b += T(10, 152, 'FIRST FLUSH', 'dg-tb', hl='ff') + T(10, 165, 'the dirty first water', 'dg-ts', hl='ff') + T(10, 177, '(~10 gal per 1,000 sq ft', 'dg-ts', hl='ff') + T(10, 189, 'of roof) fills this pipe;', 'dg-ts', hl='ff') + T(10, 201, 'the ball floats up and', 'dg-ts', hl='ff') + T(10, 213, 'seals it, and clean', 'dg-ts', hl='ff') + T(10, 225, 'water goes on', 'dg-ts', hl='ff') 
b += T(10, 256, 'slow-drip cap empties', 'dg-ts', hl='ff') + T(10, 268, 'it between storms', 'dg-ts', hl='ff') + lead(130, 262, 196, 274)
b += T(336, 184, 'STORAGE', 'dg-tb', 'mid', 'tank') + T(336, 197, '55–300 gal', 'dg-ts', 'mid', 'tank') + T(336, 209, 'opaque, lidded,', 'dg-ts', 'mid', 'tank') + T(336, 221, 'all openings', 'dg-ts', 'mid', 'tank') + T(336, 233, 'screened', 'dg-ts', 'mid', 'tank')
b += T(414, 214, 'overflow', 'dg-ts', 'mid', 'over') + T(414, 226, 'to garden', 'dg-ts', 'mid', 'over')
b += T(264, 258, 'tap', 'dg-ts', 'end', 'tap')
b += T(222, 310, 'Treat before drinking: filter, then boil or chlorinate', 'dg-tb', 'mid')
F['rainwater'] = fig('fig-rainwater', '0 0 444 318', 'Rainwater catchment: roof, screened gutter, downpipe to a first-flush pipe with a floating ball, then on to a raised storage tank with overflow and tap',
    b, 'The first-flush pipe throws away the first, dirtiest water (dust, bird droppings, leaves) before anything reaches the tank. A common rule is about 10&nbsp;gallons for every 1,000&nbsp;sq&nbsp;ft of roof. Stand the tank on blocks so a bucket fits under the tap. Always treat rainwater before drinking.')

# 11 ── Dugout canoe with outrigger (two panels) ─────────────────────────────────────
b = AH('dg')
b += panel(2, 2, 276, 250, 'FROM ABOVE')
b += '<g data-hl="hull"><path class="dg-wood" d="M20 92 Q140 56 262 92 Q140 128 20 92 Z"/><path class="dg-debris" d="M38 92 Q140 66 244 92 Q140 118 38 92 Z"/></g>'
b += '<g data-hl="iako"><rect class="dg-wood" x="92" y="74" width="10" height="132" rx="3"/><rect class="dg-wood" x="182" y="74" width="10" height="132" rx="3"/>'
b += ''.join('<path class="dg-key-s" d="M%d %d l12 6 M%d %d l12 -6" stroke-width="1.4"/>' % (x - 1, y - 3, x - 1, y + 3) for x in (92, 182) for y in (80, 104, 198)) + '</g>'
b += '<g data-hl="ama"><path class="dg-wood" d="M64 200 Q140 186 220 200 Q140 214 64 200 Z"/></g>'
b += T(140, 96, 'HULL', 'dg-tb', 'mid', 'hull')
b += T(142, 146, 'CROSSBEAMS', 'dg-tb', 'mid', 'iako') + T(142, 159, '(iako), lashed', 'dg-ts', 'mid', 'iako') + T(142, 171, 'across the hull', 'dg-ts', 'mid', 'iako')
b += T(140, 230, 'FLOAT (ama): a smaller log', 'dg-tb', 'mid', 'ama')
b += dimv(234, 104, 196, '', False) + T(242, 146, '3–4 ft', 'dg-ts') + T(242, 158, 'out', 'dg-ts')
b += T(140, 244, 'lash with plant-fibre rope or paracord', 'dg-ts', 'mid')
b += panel(286, 2, 156, 250, 'CUT ACROSS')
b += '<circle class="dg-guide" cx="364" cy="128" r="60"/>'
b += '<g data-hl="hull"><path class="dg-wood" d="M310 112 L326 112 Q330 166 364 168 Q398 166 402 112 L418 112 Q416 186 364 186 Q312 186 310 112 Z"/></g>'
b += '<line class="dg-blue-s" x1="296" y1="150" x2="432" y2="150" stroke-dasharray="6 4" stroke-width="1.6"/>'
b += T(364, 46, 'original log', 'dg-ts', 'mid') + T(364, 214, 'wall 1.5–2 in, kept even', 'dg-tb', 'mid', 'hull') + T(364, 228, 'log Ø = beam + 6 in min.', 'dg-ts', 'mid') + T(364, 242, 'blue dashes: waterline', 'dg-ts', 'mid')
F['dugout'] = fig('fig-dugout', '0 0 444 254', 'Dugout canoe with an outrigger: seen from above, two crossbeams lashed across the hull carry a float log 3 to 4 feet out; cut across, the hollowed log with walls 1.5 to 2 inches thick',
    b, 'Hollow the log with a burn → scrape → burn cycle, keeping the walls an even 1.5–2&nbsp;in. Cedar is the first choice, then cypress, tulip poplar or basswood. The outrigger float, held 3–4&nbsp;ft out on two crossbeams, is what makes it stable enough for open water and fishing.')

# 12 ── Flat-bottomed skiff (two panels) ────────────────────────────────────────────
b = AH('sk')
b += panel(2, 2, 440, 178, 'FROM ABOVE — 12 ft long, 4 ft beam')
bow, stern, mid = 30, 404, 100
def hw(x):                                           # half-width of the bottom at x
    f = (x - bow) / (stern - bow); return 52 * min(1, (f / .55) ** .6) if f < .55 else 52 - (52 - 44) * (f - .55) / .45
top = ' '.join('L%.1f %.1f' % (x, mid - hw(x)) for x in range(bow + 4, stern + 1, 6)); bot = ' '.join('L%.1f %.1f' % (x, mid + hw(x)) for x in range(stern, bow + 3, -6))
b += '<g data-hl="bottom"><path class="dg-wood" d="M%d %d %s %s Z" opacity=".75"/></g>' % (bow, mid, top, bot)
b += '<g data-hl="frames">' + ''.join('<line class="dg-line" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke-width="2.4"/>' % (x, mid - hw(x) + 3, x, mid + hw(x) - 3) for x in range(76, 400, 39)) + '</g>'
b += '<g data-hl="thwart">' + ''.join('<rect class="dg-key" x="%d" y="%.1f" width="16" height="%.1f" rx="2"/>' % (x - 8, mid - hw(x), 2 * hw(x)) for x in (155, 280)) + '</g>'
b += '<g data-hl="transom"><rect class="dg-key" x="%d" y="%d" width="10" height="%d" rx="2"/></g>' % (stern - 2, mid - 44, 88)
b += '<g data-hl="stem"><circle class="dg-key" cx="%d" cy="%d" r="6"/></g>' % (bow + 2, mid)
b += ''.join('<circle class="dg-white" cx="%d" cy="%.1f" r="4"/>' % (220, mid + s * (hw(220) + 6)) for s in (-1, 1))
b += T(14, 170, 'STEM', 'dg-tb', hl='stem') + T(48, 170, '(bow)', 'dg-ts', hl='stem')
b += T(436, 44, 'TRANSOM (stern board)', 'dg-tb', 'end', 'transom')
b += T(155, 170, 'THWARTS at thirds', 'dg-tb', 'mid', 'thwart') + T(330, 170, 'frames every 18 in', 'dg-tb', 'mid', 'frames') + T(228, 44, 'oarlocks', 'dg-ts')
b += panel(2, 184, 440, 120, 'FROM THE SIDE')
b += '<g data-hl="strake"><path class="dg-wood" d="M24 212 Q200 238 404 230 L404 262 L156 262 Q70 260 24 220 Z"/><path class="dg-thin" d="M40 226 Q180 248 404 246"/></g>'
b += '<line class="dg-blue-s" x1="20" y1="254" x2="430" y2="254" stroke-dasharray="6 4" stroke-width="1.4"/>'
b += T(222, 282, 'SIDE STRAKES: two planks a side, bent onto the frames', 'dg-tb', 'mid', 'strake') + T(222, 296, 'flat bottom; the bow sweeps up so it rides over waves', 'dg-ts', 'mid')
F['skiff'] = fig('fig-skiff', '0 0 444 306', 'Flat-bottomed skiff 12 feet by 4 feet: from above, the bottom with stem, transom, frames every 18 inches and two thwarts; from the side, the side strakes and the raised bow',
    b, 'Build the transom and stem first, then the bottom, frames, side strakes and thwarts. The thwarts are structural, not just seats: they hold the hull’s shape under load. Caulk every seam with oakum and pine pitch. A 12&nbsp;ft × 4&nbsp;ft skiff takes 1–3 days to build and carries 4–6 people or 400–600&nbsp;lb.')

# 13 ── Top bar hive (two panels) ──────────────────────────────────────────────────
b = AH('tb')
b += panel(2, 2, 200, 316, 'END VIEW', 'cut across the hive')
cx, top, dep, wt, wb = 102, 120, 108, 156, 104       # 4 units per cm: depth 27, top 39, bottom 26 cm
b += '<g data-hl="roof"><path class="dg-wood" d="M%d %d L%d %d L%d %d L%d %d Z"/></g>' % (cx - wt / 2 - 20, top - 30, cx + wt / 2 + 20, top - 30, cx + wt / 2 + 20, top - 20, cx - wt / 2 - 20, top - 20)
b += '<g data-hl="bar"><rect class="dg-key" x="%d" y="%d" width="%d" height="10" rx="2"/></g>' % (cx - wt / 2 - 4, top - 10, wt + 8)
b += '<g data-hl="comb"><path class="dg-key" d="M%d %d L%d %d Q%d %d %d %d Q%d %d %d %d Z" opacity=".6"/>' % (cx - 58, top, cx + 58, top, cx + 52, top + 60, cx, top + 96, cx - 52, top + 60, cx - 58, top)
b += ''.join('<path class="dg-thin" d="M%d %d l8 5 l8 -5"/>' % (cx - 40 + (k % 5) * 16, top + 14 + (k // 5) * 14) for k in range(15)) + '</g>'
b += '<g data-hl="body"><path class="dg-line" d="M%d %d L%d %d L%d %d L%d %d" stroke-width="5"/></g>' % (cx - wt / 2, top, cx - wb / 2, top + dep, cx + wb / 2, top + dep, cx + wt / 2, top)
b += '<g data-hl="legs"><path class="dg-wood-s" d="M%d %d L%d 278 M%d %d L%d 278" stroke-width="6"/></g>' % (cx - wb / 2 + 4, top + dep, cx - wb / 2 - 8, cx + wb / 2 - 4, top + dep, cx + wb / 2 + 8)
b += dimh(cx - wt / 2, cx + wt / 2, 64, 'top 38–40 cm', False) + T(cx, top + dep + 16, 'bottom 24–28 cm', 'dg-ts', 'mid')
b += dimv(22, top, top + dep, '', True) + VT(14, top + dep / 2, '25–30 cm')
b += T(102, 294, 'legs: waist height;', 'dg-ts', 'mid', 'legs') + T(102, 306, 'grease them against ants', 'dg-ts', 'mid', 'legs')
b += panel(208, 2, 234, 316, 'FROM THE SIDE', 'roof off')
b += '<g data-hl="body"><rect class="dg-line" x="222" y="110" width="206" height="80" stroke-width="3"/></g>'
b += '<g data-hl="bar">' + ''.join('<rect class="dg-key" x="%d" y="100" width="7" height="10"/>' % x for x in range(224, 424, 8)) + '</g>'
b += '<g data-hl="comb">' + ''.join('<path class="dg-key" d="M%d 110 L%d 110 L%d 170 Q%d 180 %d 170 Z" opacity=".6"/>' % (x, x + 7, x + 6, x + 3.5, x + 1) for x in range(224, 330, 8)) + '</g>'
b += '<g data-hl="ent"><circle class="dg-dark dg-panel" cx="420" cy="180" r="5"/></g>'
b += dimh(222, 428, 82, '120 cm long', False)
b += T(230, 214, 'BARS: 25–30, each 38 mm', 'dg-tb', hl='bar') + T(230, 227, 'wide; bees hang one comb', 'dg-ts', hl='bar') + T(230, 239, 'from each — no foundation', 'dg-ts', hl='bar')
b += T(230, 260, 'ENTRANCE: 2 cm hole', 'dg-tb', hl='ent') + T(230, 273, 'near the bottom', 'dg-ts', hl='ent') + lead(372, 256, 416, 186)
b += T(102, 86, 'ROOF overhangs 5 cm', 'dg-ts', 'mid', 'roof')
F['tbh'] = fig('fig-tbh', '0 0 444 320', 'Top bar hive: end view of the sloped-sided box with a comb hanging from one bar, under a roof, on legs; side view of the 120 cm box with 25 to 30 bars and an entrance hole',
    b, 'Bees build natural comb down from each bar, with no foundation or extractor needed. Lift one bar at a time to inspect. The sloped sides mean the bees attach less comb to the walls. Build it from 25&nbsp;mm (1&nbsp;in) rough-sawn boards of any species.')


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


JOBS = [('build-structures.html', 'TIMBER A-FRAME — FRONT ELEVATION', 'aframe'),
        ('build-structures.html', 'EARTHBAG DOME — FRONT ELEVATION', 'earthbag'),
        ('chemistry.html', 'Retort Kiln: no oxygen', 'retort'),
        ('metallurgy.html', 'BRAKE DRUM FORGE — CROSS SECTION', 'drumforge'),
        ('metallurgy.html', 'KNIFE FORGING SEQUENCE', 'knife'),
        ('metallurgy.html', 'NAIL MAKING SEQUENCE', 'nail'),
        ('textiles.html', 'Build time: 20–30 minutes', 'spindle'),
        ('textiles.html', 'Wooden Frame (2×2 lumber)', 'loom'),
        ('textiles.html', 'gather toe here', 'moccasin'),
        ('food.html', 'aria-labelledby="rainwater-title"', 'rainwater'),
        ('vehicles.html', 'DUGOUT CANOE WITH OUTRIGGER', 'dugout'),
        ('vehicles.html', 'FLAT-BOTTOMED SKIFF — Overhead', 'skiff'),
        ('agriculture.html', 'Top Bar Hive — Construction Plans', 'tbh')]

if __name__ == '__main__':
    for page, marker, key in JOBS:
        fid = re.search(r'id="([^"]+)"', F[key]).group(1)
        print('%-22s %-16s %s' % (page, fid, swap(page, marker, F[key], fid)))
