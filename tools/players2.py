#!/usr/bin/env python3
"""More step-by-step players: CPR, choking, splinting a forearm, making water safe.
Run:  python3 tools/players2.py   (safe to run again). Helpers come from tools/players.py.
Step text follows the section beside each player. Looping movement uses .mv-loop / .mv-flow
(assets/css/style.css): it runs only while its step is showing and is off for reduced motion.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from players import T, S, MV, DRAW, player, put, ROOT


def LOOP(inner, to, ox, oy, t=0.6, d=0.0, n='infinite', ease='ease-in-out'):
    """Moves to `to` and back, over and over, while its step is on screen."""
    st = f'transform-origin:{ox}px {oy}px;--to:{to};--mv-t:{t}s;--mv-d:{d}s;--mv-n:{n};--mv-e:{ease}'
    return f'<g class="mv-loop" style="{st}">{inner}</g>'


def L(pts, c='dg-limb'):
    return f'<polyline class="{c}" points="{" ".join(f"{x},{y}" for x, y in pts)}"/>'


def AHD(i):
    return f'<defs><marker id="ah-{i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="dg-ah" d="M0 0L10 5L0 10z"/></marker></defs>'


def note(x, y, lines, cls='dg-tb', end=False):
    return ''.join(T(x, y + i * 14, s, cls if i == 0 else 'dg-ts', mid=False, **({'text_anchor': 'end'} if end else {})) for i, s in enumerate(lines))


# ── E. Adult CPR (side view, head left; you kneel on the far side) ───────────
n = 4
b = AHD('cp') + '<rect class="dg-land" x="0" y="198" width="444" height="16"/>'
# rescuer's legs first: the casualty lies in front of them
legs = L([(232, 126), (214, 196), (276, 198)], 'dg-rlimb')
b += S('2-4', legs, n)
b += S('1-1', L([(150, 126), (178, 196), (238, 198)], 'dg-rlimb'), n)
# the casualty
b += '<circle class="dg-skin" cx="62" cy="176" r="17"/><rect class="dg-skin" x="80" y="160" width="152" height="34" rx="14"/>'
b += L([(230, 178), (388, 184)]) + L([(230, 188), (392, 194)])
# step 1: kneeling by the head, hands on the shoulders, shouting
p1 = L([(150, 126), (122, 84)], 'dg-rlimb') + '<circle class="dg-rbody" cx="116" cy="62" r="15"/>' + L([(124, 92), (100, 120), (96, 158)], 'dg-rlimb') + '<circle class="dg-rhand" cx="96" cy="160" r="6"/>'
b += S('1-1', MV(p1, 'translateX(-14px)', 120, 120, 0.7, 0.1, 0) + note(150, 24, ['“Can you hear me?”', 'shout, tap the shoulders,', 'look and listen for normal', 'breathing up to 10 seconds']) + DRAW('class="dg-arrow" d="M148 30 Q120 34 118 44" marker-end="url(#ah-cp)"', 0.5, 0.6), n)
# steps 2–3: shoulders over the hands, arms straight
p2 = L([(232, 126), (156, 84)], 'dg-rlimb') + '<circle class="dg-rbody" cx="146" cy="62" r="15"/>' + L([(156, 86), (156, 156)], 'dg-rlimb') + '<rect class="dg-rhand" x="140" y="152" width="32" height="10" rx="5"/>'
b += S('2-2', MV(p2, 'translate(-40px, 10px)', 156, 120, 0.9, 0.1, 0) + '<path class="dg-guide" d="M156 74 L156 150"/>'
       + note(268, 24, ['heel of one hand,', 'centre of the chest;', 'other hand on top']) + note(268, 78, ['arms straight,', 'shoulders over hands']), n)
b += S('3-3', LOOP(p2, 'translateY(10px)', 156, 120, 0.545) + LOOP('<rect class="dg-skin" x="120" y="160" width="72" height="8" rx="4"/>', 'translateY(9px)', 156, 160, 0.545)
       + '<path class="dg-arrow" d="M196 128 L196 156" marker-end="url(#ah-cp)"/>' + T(206, 146, '5–6 cm', 'dg-tb', mid=False)
       + note(268, 24, ['push hard and fast,', '100–120 a minute']) + '<circle class="dg-keyf mv-loop" style="transform-origin:300px 92px;--to:scale(1.5);--mv-t:.545s" cx="300" cy="92" r="9"/>' + T(320, 97, '× 30', 'dg-big', mid=False), n)
# step 4: two breaths
p4 = L([(232, 126), (128, 100)], 'dg-rlimb') + '<circle class="dg-rbody" cx="92" cy="132" r="15"/>' + L([(130, 104), (100, 142), (60, 158)], 'dg-rlimb') + L([(136, 108), (118, 150), (80, 172)], 'dg-rlimb')
b += S('4-4', MV(p4, 'translate(60px, -40px)', 120, 130, 0.9, 0.1, 0) + LOOP('<path class="dg-skin" d="M84 162 Q156 146 228 162 L228 168 L84 168 Z"/>', 'translateY(-6px)', 156, 168, 1.0, 1.0, 4)
       + note(268, 24, ['tilt the head, lift the chin,', 'pinch the nose', '2 breaths, 1 second each:', 'watch the chest rise']) + note(268, 96, ['then 30 more pushes —', 'keep going 30 : 2'], 'dg-th'), n)
FIG_CPR = player('fig-cpr-steps', n, '0 0 444 214', 'Adult CPR in four steps: check, hand position, 30 compressions, 2 breaths', b,
    ['Check: shout and tap their shoulders. No response — shout for help and send for a defibrillator. Look and listen for normal breathing for up to 10 seconds.',
     'Not breathing normally? Kneel beside them: heel of one hand in the centre of the chest, other hand on top, arms straight, shoulders over your hands.',
     'Push down 5–6 cm, 100–120 times a minute, 30 times. Let the chest come fully back up each time.',
     'Tilt the head, lift the chin, pinch the nose and give 2 breaths of about 1 second, watching the chest rise. Then 30 more pushes: keep going 30 : 2.'],
    'Can’t or won’t give breaths? Keep pushing without stopping — hands-only CPR is far better than nothing. Children and drowning: 5 breaths first (table below). Swap rescuers every 2 minutes.')

# ── F. Choking, conscious adult (side view; they face left, you stand behind) ──
n = 4
b = AHD('ch') + '<rect class="dg-land" x="0" y="232" width="444" height="14"/>'
legs_v = L([(156, 150), (150, 230)]) + L([(170, 150), (176, 230)])
upper_v = '<circle class="dg-skin" cx="158" cy="52" r="17"/><rect class="dg-skin" x="144" y="70" width="34" height="84" rx="12"/>'
b += legs_v
b += S('1-1', upper_v + L([(152, 84), (138, 98), (150, 74)]) + L([(170, 84), (162, 100), (158, 76)]) + '<path class="dg-red-s" d="M134 48 q-10 -4 -14 -14 M136 58 q-14 0 -22 -6" stroke-width="1.6"/>', n)
b += S('1-1', note(214, 30, ['can’t cough, speak', 'or breathe?']) + note(214, 76, ['silent, often clutching', 'the throat: act now']) + note(214, 120, ['still coughing?', 'let them cough — don’t hit'], 'dg-tb'), n)
# step 2: bent forward, back blows
bent = f'<g transform="rotate(-58 162 150)">{upper_v}{L([(152, 84), (140, 130)])}</g>'
b += S('2-2', MV(bent, 'rotate(58deg)', 162, 150, 0.8, 0.1), n)
resc2 = ('<circle class="dg-rbody" cx="246" cy="44" r="16"/><rect class="dg-rbody" x="232" y="62" width="30" height="80" rx="11"/>'
         + L([(240, 140), (236, 230)], 'dg-rlimb') + L([(254, 140), (262, 230)], 'dg-rlimb') + L([(236, 78), (206, 116), (164, 128)], 'dg-rlimb'))
b += S('2-2', resc2 + LOOP(L([(240, 74), (196, 60), (132, 96)], 'dg-rlimb') + '<circle class="dg-rhand" cx="130" cy="98" r="7"/>', 'rotate(-9deg)', 240, 74, 0.6, 0.9)
       + note(296, 140, ['5 firm blows', 'between the', 'shoulder blades']) + T(84, 30, 'head lower than chest', 'dg-ts'), n)
# steps 3–4: upright, abdominal thrusts from behind
b += S('3-4', upper_v, n)
resc3 = ('<circle class="dg-rbody" cx="208" cy="44" r="16"/><rect class="dg-rbody" x="194" y="62" width="30" height="82" rx="11"/>'
         + L([(202, 142), (198, 230)], 'dg-rlimb') + L([(216, 142), (226, 230)], 'dg-rlimb'))
b += S('3-4', MV(resc3, 'translateX(40px)', 208, 140, 0.7, 0.1, 0), n)
fist = L([(200, 80), (188, 116), (152, 124)], 'dg-rlimb') + '<circle class="dg-rhand" cx="150" cy="124" r="8"/>'
b += S('3-3', LOOP(fist, 'translate(7px, -7px)', 150, 124, 0.7, 0.8) + DRAW('class="dg-key-s" d="M126 140 Q142 128 150 112" marker-end="url(#ah-ch)"', 0.5, 0.9)
       + note(250, 40, ['fist just above the navel,', 'other hand over it']) + note(250, 92, ['pull sharply', 'IN and UP — 5 times'], 'dg-th'), n)
b += S('4-4', fist + '<g transform="translate(330 96)"><circle class="dg-key" r="40" fill="none"/>'
       + '<path class="dg-key-s" d="M-34 -18 A 40 40 0 0 1 30 -26" marker-end="url(#ah-ch)"/><path class="dg-key-s" d="M34 18 A 40 40 0 0 1 -30 26" marker-end="url(#ah-ch)"/>'
       + T(0, -4, '5 blows', 'dg-tb') + T(0, 12, '5 thrusts', 'dg-tb') + '</g>'
       + '<rect class="dg-badbg" x="262" y="160" width="172" height="44" rx="8"/>' + T(348, 178, 'goes unconscious?', 'dg-tb') + T(348, 194, 'lower to the floor, start CPR', 'dg-ts'), n)
FIG_CHOKE = player('fig-choking-steps', n, '0 0 444 246', 'Choking, conscious adult: back blows and abdominal thrusts in turn', b,
    ['Can they cough, speak or breathe? Then it is only partly blocked: tell them to keep coughing. Act only when they can’t — silent, often clutching the throat.',
     '5 back blows: bend them forward, head lower than chest, and strike firmly between the shoulder blades with the heel of your hand. Check the mouth after each.',
     '5 abdominal thrusts: stand behind, fist just above the navel, other hand over it, and pull sharply in and up.',
     'Keep alternating 5 and 5 until it clears. If they go unconscious, lower them to the floor and start CPR.'],
    'Not for babies under 1 year — use back blows and chest thrusts instead (below). Anyone who needed thrusts should be checked afterwards: they can cause internal injury.')

# ── G. Splinting a broken forearm (side view; elbow left, hand right) ─────────
n = 4
b = AHD('sp')
b += S('2-4', MV('<rect class="dg-stick" x="74" y="118" width="300" height="12" rx="3"/><rect class="dg-band" x="96" y="108" width="54" height="10" rx="4"/><rect class="dg-band" x="290" y="108" width="54" height="10" rx="4"/>',
                 'translateY(40px)', 220, 124, 0.8, 0.1, 0), n)
arm = ('<path class="dg-skin" d="M8 52 L96 60 Q112 62 116 76 L118 104 Q112 112 96 110 L8 106 Z"/>'
       '<path class="dg-skin" d="M104 64 L330 74 Q338 74 340 82 L340 100 Q336 108 328 108 L104 106 Z"/>'
       '<path class="dg-skin" d="M336 76 Q372 70 396 80 Q420 84 420 92 Q420 100 400 102 Q372 108 336 104 Z"/>')
b += arm
b += '<path class="dg-red-s" d="M222 70 l6 8 l-6 8 l6 8 l-6 8" stroke-width="2"/>' + T(226, 60, 'break', 'dg-ts')
b += S('1-1', LOOP('<circle class="dg-red" cx="322" cy="96" r="6"/>', 'scale(1.6)', 322, 96, 0.8) + T(322, 140, 'pulse', 'dg-tb')
       + LOOP('<path class="dg-skin" d="M396 80 q20 -10 30 -2 q-4 8 -24 10 Z"/>', 'rotate(-14deg)', 400, 86, 0.7) + T(408, 140, 'move?', 'dg-tb')
       + T(370, 60, 'feel?', 'dg-tb') + note(20, 160, ['check below the break before you start;', 'splint it as you find it — don’t straighten it']), n)
b += S('2-2', T(74, 152, 'padded splint covers the elbow', 'dg-ts', mid=False) + T(374, 152, 'and the wrist', 'dg-ts', mid=False, text_anchor='end')
       + '<path class="dg-guide" d="M110 30 L110 112 M352 30 L352 112"/>' + T(110, 24, 'joint above', 'dg-tb') + T(352, 24, 'joint below', 'dg-tb'), n)
ties = ''.join(DRAW(f'class="dg-tie" d="M{x - 3} 58 Q{x - 10} 96 {x - 3} 134 M{x + 3} 58 Q{x + 10} 96 {x + 3} 134"', 0.5, 0.2 + k * 0.25) for k, x in enumerate((134, 186, 262, 314)))
b += S(3, ties, n)
b += S('3-3', '<path class="dg-red-s" d="M210 36 L240 36" stroke-width="2"/>' + T(225, 28, 'no tie on the break', 'dg-tb') + note(20, 164, ['ties above and below the break:', 'firm, not tight']), n)
b += S('4-4', MV('<path class="dg-band" d="M70 140 Q230 186 392 140 L392 152 Q230 198 70 152 Z" opacity=".9"/>', 'translateY(24px)', 230, 150, 0.7, 0.1, 0)
       + T(230, 196, 'sling takes the weight', 'dg-ts')
       + LOOP('<circle class="dg-red" cx="322" cy="96" r="6"/>', 'scale(1.6)', 322, 96, 0.8, 0.9) + note(20, 24, ['check pulse, feeling and', 'movement again — lost any?', 'loosen the ties'], 'dg-th'), n)
FIG_SPLINT = player('fig-splint-steps', n, '0 0 444 206', 'Splinting a broken forearm: check, pad and place the splint over the elbow and wrist, tie above and below the break, sling and check again', b,
    ['Check below the injury: pulse at the wrist, can they feel your touch, can they move their fingers? Splint it as you find it — don’t straighten it.',
     'Pad a rigid splint (board, sticks, rolled magazine) and lay it along the arm so it covers the elbow and the wrist — the joints above and below the break.',
     'Tie it on above and below the break, never on it: firm, but not tight.',
     'Support the arm in a sling, then check pulse, feeling and movement again. Lost any? The ties are too tight — loosen them.'],
    'The same rules work for any limb: immobilise the joint above and below, pad the bony points, and check circulation before and after.')

# ── H. Making water safe (four stations, left to right) ─────────────────────
n = 4
b = AHD('wa') + '<rect class="dg-land" x="0" y="178" width="444" height="12" opacity=".6"/>'
# 1 settle
jar = '<path class="dg-line" d="M24 82 L24 172 Q24 178 30 178 L82 178 Q88 178 88 172 L88 82" fill="none"/><rect class="dg-water" x="27" y="96" width="58" height="80" rx="3"/>'
specks = ''.join(f'<circle class="dg-debris" cx="{x}" cy="{y}" r="2.2"/>' for x, y in ((36, 104), (48, 112), (62, 100), (74, 118), (42, 128), (68, 134), (56, 122), (80, 106)))
b += S(1, jar +
       MV('<g transform="translate(0 38)">' + specks + '</g>', 'translateY(-38px)', 56, 140, 2.4, 0.2) + '<rect class="dg-debris" x="27" y="166" width="58" height="10" rx="2"/>'
       + T(56, 198, '1 settle', 'dg-tb'), n)
# 2 pour through cloth
b += S(2, '<path class="dg-arrow" d="M96 130 L118 130" marker-end="url(#ah-wa)"/>'
       + '<g transform="rotate(-38 140 92)"><path class="dg-line" d="M120 70 L120 120 L160 120 L160 70" fill="none"/><rect class="dg-water" x="122" y="88" width="36" height="30" rx="2"/></g>'
       + '<path class="dg-blue-s mv-flow" d="M166 96 Q178 112 182 136" stroke-width="3"/>'
       + '<path class="dg-line" d="M158 140 L158 172 Q158 178 164 178 L204 178 Q210 178 210 172 L210 140" fill="none"/><path class="dg-band" d="M152 138 Q184 150 216 138 L214 134 Q184 144 154 134 Z"/>'
       + T(184, 198, '2 filter', 'dg-tb'), n)
# 3 boil
pot = '<path class="dg-line" d="M248 112 L248 160 Q248 166 254 166 L306 166 Q312 166 312 160 L312 112" fill="none" stroke-width="2.4"/><rect class="dg-water" x="250" y="120" width="60" height="44" rx="3"/>'
bubbles = ''.join(LOOP(f'<circle class="dg-white" cx="{x}" cy="150" r="3" opacity=".8"/>', 'translateY(-26px)', x, 150, 0.9, d, 'infinite', 'ease-in') for x, d in ((262, 0), (280, .3), (296, .6), (272, .45), (304, .15)))
flames = LOOP('<path class="dg-red" d="M256 176 q6 -14 12 0 q6 -16 12 0 q6 -14 12 0 q6 -16 12 0 q4 -12 8 0 Z"/>', 'scaleY(1.25)', 280, 176, 0.5)
b += S(3, '<path class="dg-arrow" d="M218 130 L240 130" marker-end="url(#ah-wa)"/>' + flames + pot + bubbles
       + T(280, 104, 'rolling boil 1 min', 'dg-tb') + T(280, 198, '3 boil', 'dg-tb'), n)
# 4 store
b += S(4, '<path class="dg-arrow" d="M318 130 L340 130" marker-end="url(#ah-wa)"/>'
       + MV('<rect class="dg-key" x="352" y="96" width="62" height="10" rx="3"/>', 'translateY(-26px) rotate(-12deg)', 383, 101, 0.7, 0.4, 0)
       + '<path class="dg-line" d="M356 106 L356 172 Q356 178 362 178 L404 178 Q410 178 410 172 L410 106" fill="none"/><rect class="dg-water" x="358" y="116" width="50" height="60" rx="3"/>'
       + '<path class="dg-line" d="M410 160 L424 160 L424 168"/>' + T(383, 198, '4 store', 'dg-tb'), n)
b += S('3-3', note(20, 22, ['no fuel? plain bleach: 2 drops per litre,', 'wait 30 minutes (3 min boil above 2,000 m)']), n)
b += S('4-4', note(20, 22, ['clean, covered container;', 'pour it out — don’t dip cups in']), n)
b += S('1-1', note(20, 22, ['cloudy water: let it stand an hour or two,', 'then pour off the clearer water from the top']), n)
b += S('2-2', note(20, 22, ['a folded clean cloth catches what’s left —', 'this alone does NOT make it safe']), n)
FIG_WATER = player('fig-water-steps', n, '0 0 444 206', 'Making water safe in four steps: settle, filter through cloth, boil or bleach, store covered', b,
    ['Let cloudy water stand for an hour or two so the dirt settles, then pour off the clearer water from the top.',
     'Pour it through a folded clean cloth to catch what is left. This alone does not make it safe.',
     'Bring it to a rolling boil for 1 minute (3 minutes above 2,000 m). No fuel? Plain unscented bleach, 2 drops per litre, then wait 30 minutes.',
     'Let it cool covered, and keep it in a clean, covered container. Pour it out rather than dipping cups in.'],
    'Filtering first makes boiling, bleach and sunlight all work far better. Any one of the three disinfects; the steps below give the details and the limits of each.')


if __name__ == '__main__':
    MED = os.path.join(ROOT, 'sections', 'medical.html'); FOOD = os.path.join(ROOT, 'sections', 'food.html')

    def after_block(path, heading, close):
        s = open(path, encoding='utf-8').read()
        i = s.index(heading); j = s.index(close, i) + len(close)
        return s[i:j]

    put(MED, 'fig-cpr-steps', FIG_CPR, after_block(MED, '<h3>Adult CPR — step by step</h3>', '</ol>\n'))
    put(MED, 'fig-choking-steps', FIG_CHOKE, after_block(MED, '<h3>Conscious adult or child (over 1 year)</h3>', '</ul>\n'))
    put(MED, 'fig-splint-steps', FIG_SPLINT, after_block(MED, '<h3>General Splinting Principles</h3>', '</ul>\n'))
    put(FOOD, 'fig-water-steps', FIG_WATER, after_block(FOOD, '<p>Each method has tradeoffs.', '</p>\n'))
    print('ok')
