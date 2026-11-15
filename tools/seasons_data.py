#!/usr/bin/env python3
"""Feeds the Seasons wheel (Climate page) from the guide's own calendars, so there is one source:
  - foraging: MONTH_DATA and CATEGORIES in the Climate page's foraging-wheel script
  - growing:  the 'cold' (late-April last frost, UK-like) and 'temperate' zones of CALENDAR
              in the Agriculture page's planting-calendar script
Store and prepare notes are kept here (STORE, PREPARE) and logged in docs/DIAGRAMS.md.
Run again whenever those calendars change:  python3 tools/seasons_data.py
"""
import os, re, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
clim = open(os.path.join(ROOT, 'sections', 'climate.html'), encoding='utf-8').read()
agri = open(os.path.join(ROOT, 'sections', 'agriculture.html'), encoding='utf-8').read()

# foraging month summaries and peaks
md = re.search(r'var MONTH_DATA = \[(.*?)\n  \];', clim, re.S).group(1)
forage = [{'summary': json.loads('"%s"' % m.group(1).replace("\\'", "'")), 'peak': json.loads('[%s]' % m.group(2).replace("'", '"'))}
          for m in re.finditer(r"\{ summary: '((?:[^'\\]|\\.)*)', peak: \[(.*?)\] \}", md)]
cats = [{'name': n, 'color': c, 'avail': json.loads(a)} for n, c, a in re.findall(r"\{ name: '([^']+)',\s*color: '([^']+)',\s*avail: (\[[^\]]+\]) \}", clim)]
assert len(forage) == 12 and len(cats) == 5, (len(forage), len(cats))

# planting calendar zones
cal = agri[agri.index('const CALENDAR = {'):]
def zone(name):
    z = cal[cal.index(name + ': {'):]
    z = z[:z.index('}')]
    out = []
    for mo in ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'):
        m = re.search(mo + r":\[(.*?)\](?=,\s*[A-Z][a-z]{2}:|\s*$)", z, re.S)
        out.append(re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1)) if m else [])
    return out
grow = {'cold': zone('cold'), 'temperate': zone('temperate')}

STORE = ['Eat from store; check stored roots and apples for rot every week.', 'Eat from store; mend tools and kit before spring.', 'Stores run low: plan, and use up last year’s preserves.',
         'Dry nettle tops and wild garlic; little else to store yet.', 'Elderflower cordial (needs to be kept cold or used quickly); dry herbs.', 'Dry herbs and early greens; start a fermenting crock.',
         'Jams and bottled fruit; dry beans and peas on the plant.', 'Bottle and dry fruit; dry beans; pickle and ferment the glut.', 'Store sound apples cool and separate; dry nuts; clamp or cellar potatoes.',
         'Lift and store root crops before hard frost; render fat; salt or smoke meat as the weather cools.', 'Check every store; cure and smoke; cut and stack next year’s firewood.', 'Eat from store; preserve any winter greens.']
PREPARE = ['Hardest frosts and snow: insulate pipes, keep a heat source and dry fuel.', 'Storms and floods: clear drains and gutters; know your high ground.', 'Late frosts: keep fleece or cover for early sowings.',
           'Frost still possible until May: harden plants off slowly.', 'Lambing, kidding and nesting season; check water supplies before summer.', 'Heat and dry spells: store water; wildfire risk rises (to September).',
           'Heat: shade, water and work early or late; watch for heat illness.', 'Peak wildfire risk: no open fires on dry ground; keep water butts full.', 'Autumn gales begin: secure roofs, tarps and trees near shelters.',
           'Clocks go back: shorter days — check lights, batteries and firewood.', 'Floods and gales: clear ditches; check the flood plan.', 'Ice, snow and long nights: keep warm, keep stores and medicines in reach.']

data = {'forage': forage, 'cats': cats, 'grow': grow, 'store': STORE, 'prepare': PREPARE}
block = '      <script type="application/json" id="seasons-data">' + json.dumps(data, ensure_ascii=False).replace('</', '<\\/') + '</script>\n'
p = os.path.join(ROOT, 'sections', 'climate.html')
s = re.sub(r'      <script type="application/json" id="seasons-data">.*?</script>\n', '', clim, flags=re.S)
s = re.sub(r'    <div class="calc no-print" data-calc="seasons"></div>\n', '', s)
anchor = '    <h3 id="foraging-calendar">Seasonal Foraging Calendar</h3>\n'
assert anchor in s
s = s.replace(anchor, '    <div class="calc no-print" data-calc="seasons"></div>\n' + block + '\n' + anchor, 1)
open(p, 'w', encoding='utf-8').write(s)
print('seasons data: %d months, %d categories, grow zones %s' % (len(forage), len(cats), ', '.join('%s %d' % (k, sum(map(len, v))) for k, v in grow.items())))
