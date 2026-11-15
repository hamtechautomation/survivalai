#!/usr/bin/env python3
"""Copies the nine deadly-lookalike panels (Climate: wild garlic and the carrot family;
Food & Water: chanterelles) into a <template> beside the "Plant or lookalike?" game on the
Climate page, so the game uses exactly the drawings the guide teaches with.
Run again whenever those figures change:  python3 tools/lookalike_game.py
"""
import os, re, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = [('climate', 'fig-look-garlic', 'garlic'), ('climate', 'fig-look-umbel', 'umbel'), ('food', 'fig-look-chanterelle', 'mushroom')]

cards = []
for page, fid, group in SRC:
    s = open(os.path.join(ROOT, 'sections', page + '.html'), encoding='utf-8').read()
    i = s.index('id="%s"' % fid); j = s.index('</figure>', i)
    for m in re.finditer(r'<svg viewBox="([^"]+)"[^>]*aria-label="([^"]+)">(.*?)</svg>', s[i:j], re.S):
        vb, name, body = m.groups()
        texts = [html.unescape(re.sub('<[^>]+>', '', t)) for t in re.findall(r'<text[^>]*>(.*?)</text>', body)]
        verdict = texts[2]
        cards.append('<svg viewBox="%s" data-group="%s" data-name="%s" data-verdict="%s" data-safe="%d" role="img" aria-label="%s">%s</svg>' % (
            vb, group, html.escape(name), html.escape(verdict), 1 if verdict.startswith('EDIBLE') else 0, html.escape(name), body))

tpl = '<template id="lk-cards">' + ''.join(cards) + '</template>'
block = '      <div class="calc no-print" data-calc="lookalike"></div>\n      ' + tpl + '\n'
p = os.path.join(ROOT, 'sections', 'climate.html'); s = open(p, encoding='utf-8').read()
s = re.sub(r'      <div class="calc no-print" data-calc="lookalike"></div>\n      <template id="lk-cards">.*?</template>\n', '', s, flags=re.S)
anchor = '      <p>Mushrooms: see the <a href="food.html#fig-look-chanterelle">chanterelle comparison</a> in Food &amp; Water.</p>\n'
assert anchor in s
s = s.replace(anchor, anchor + block, 1)
open(p, 'w', encoding='utf-8').write(s)
print(len(cards), 'cards')
