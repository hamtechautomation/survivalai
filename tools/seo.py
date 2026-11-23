#!/usr/bin/env python3
"""Search-engine and AI-answer metadata for every page, plus sitemap.xml.

    python3 tools/seo.py

Run it after adding a page or regenerating one (tools/knots/build.py,
tools/fuelpage.py), and before deploying. It is idempotent: each page gets one
block between <!-- seo:start --> and <!-- seo:end --> just before </head>,
replaced in full on every run, holding:

  - <link rel="canonical"> to the page's public URL
  - Open Graph + Twitter card tags (link previews on social sites and chat apps)
  - JSON-LD structured data: the site, the organisation, the page itself
    (Article for guide sections, WebPage otherwise) and its breadcrumb trail

It also fills in a meta description where a page has none (DESCRIPTIONS below),
adds noindex to pages that should not be in search (NOINDEX), and rewrites
sitemap.xml with each page's last git-commit date, and writes llms.txt — a
plain-text map of the site for AI assistants (https://llmstxt.org).
"""
import html
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://bunkerbot.co.uk'
NAME = 'The Last Light Survival Guide'
IMAGE = SITE + '/assets/og-image.png'
REPO = 'https://github.com/hamtechautomation/survivalai'
LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/'

# The page CloudFront serves at / (its default root object — keep the two in step).
ROOT_PAGE = 'index.html'

# Pages served at a URL other than their file path.
URL_FOR = {ROOT_PAGE: '/'}

# Kept out of search results and the sitemap.
NOINDEX = {'offline.html', '404.html'}

# Built separately or not part of the public site.
SKIP = {'pdfs/index.html'}

# Pages that had no meta description of their own.
DESCRIPTIONS = {
    'index.html': 'Open the full offline survival guide: 39 sections on medical care, water, food, shelter, power, fuel, navigation and rebuilding, emergency cards, calculators, maps and an AI that cites its sources.',
    'offline.html': 'You are offline. Every section of the Last Light Survival Guide is still available on this device.',
    'cards.html': 'Printable wallet-size emergency cards — CPR, bleeding control, water purification, signals and key numbers. Print on cardstock, cut out, laminate and keep in a wallet or go-bag.',
    'literature.html': 'The reference library: 33 public-domain survival, medical and engineering books bundled as searchable PDFs, plus 60 curated titles worth owning, with acquisition tracking.',
    'tools.html': 'Offline survival calculators: food and water needs for a group, off-grid power sizing, supply tracker, planting calendar, stay-or-go decision, radio frequencies, antibiotic dosing and firewood estimates.',
    'sections/chemistry.html': 'Making essentials from raw materials: soap, alcohol, charcoal and activated charcoal, candles and oil lamps, tanned hides, lime mortar, glues — and which chemicals must never be mixed.',
    'sections/governance.html': 'Forming and running a community through a long crisis: group roles, vetting strangers, governance models, justice, property, trade, record keeping and printable charter templates.',
    'sections/nbc.html': 'Nuclear, biological and chemical threats: fallout shelter, an improvised fallout meter, potassium iodide dosing, radiation sickness, EMP and Faraday cages, disease outbreaks and decontamination.',
    'sections/psychology.html': 'Mental health in a prolonged crisis: the stress response, tactical breathing, grief, PTSD and peer support, suicide risk, decisions under stress, group morale, children and withdrawal.',
    'sections/textiles.html': 'Clothing without factories: fibre sources, spinning, weaving, knitting, sewing, leatherwork, boot making, repairs and layering for warmth — from raw material to finished garment.',
}

TOP_TITLE = {  # better <title>s where the existing one names the site only
    'index.html': 'The Last Light Survival Guide — Offline Survival Manual, Maps & AI',
}


def git_date(path):
    # Last commit that touched the file, ignoring commits whose message starts
    # "SEO:" — metadata-only changes are not content changes.
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--invert-grep', '--grep=^SEO:', '--', path], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout.strip()
        return out or None
    except Exception:
        return None


def pages():
    out = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))
    out += sorted('sections/' + f for f in os.listdir(os.path.join(ROOT, 'sections')) if f.endswith('.html'))
    return [p for p in out if p not in SKIP]


def url_of(page):
    return SITE + URL_FOR.get(page, '/' + page)


def text(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


def attr(s):
    return html.escape(s, quote=True)


def block(page, title, desc, date):
    url = url_of(page)
    short = title.split(' — ' + NAME)[0] if title != NAME else NAME
    section = page.startswith('sections/')
    og_type = 'article' if section else 'website'

    graph = [
        {'@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/', 'name': NAME,
         'description': 'A complete, fully-offline survival reference and library.',
         'inLanguage': 'en', 'license': LICENSE, 'publisher': {'@id': SITE + '/#org'}},
        {'@type': 'Organization', '@id': SITE + '/#org', 'name': NAME, 'url': SITE + '/',
         'logo': SITE + '/assets/icons/apple-touch-icon.png', 'sameAs': [REPO]},
    ]
    trail = [('Home', SITE + '/')]
    if page != ROOT_PAGE:
        if section and ROOT_PAGE != 'index.html':
            trail.append(('Guide', url_of('index.html')))
        trail.append((short, url))
    crumbs = {'@type': 'BreadcrumbList', '@id': url + '#breadcrumb', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(trail)]}

    node = {'@type': 'Article' if section else 'WebPage', '@id': url + '#page', 'url': url,
            'name': short, 'description': desc, 'inLanguage': 'en', 'image': IMAGE,
            'isPartOf': {'@id': SITE + '/#website'}, 'breadcrumb': {'@id': url + '#breadcrumb'},
            'license': LICENSE}
    if section:
        node.update({'headline': short, 'author': {'@id': SITE + '/#org'},
                     'publisher': {'@id': SITE + '/#org'}, 'mainEntityOfPage': url})
    if date:
        node['dateModified'] = date
    graph += [node, crumbs]

    if page in ('home.html', 'index.html'):
        graph.append({
            '@type': 'SoftwareApplication', 'name': NAME,
            'applicationCategory': 'ReferenceApplication',
            'operatingSystem': 'Any (web browser, offline-capable)',
            'url': SITE + '/', 'downloadUrl': SITE + '/download.html',
            'description': 'A complete, fully-offline survival library — 39 sections, 33 reference books, '
                           'an offline AI assistant that cites its sources, and offline maps. Works with no '
                           'internet, on anything down to a Raspberry Pi.',
            'image': IMAGE, 'license': LICENSE,
            'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP'}})

    ld = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':'))
    ld = ld.replace('</', '<\\/')
    lines = [
        '<!-- seo:start — generated by tools/seo.py; edit that, not this -->',
        f'<link rel="canonical" href="{url}">',
    ]
    if page in NOINDEX:
        lines.append('<meta name="robots" content="noindex">')
    lines += [
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{attr(NAME)}">',
        f'<meta property="og:title" content="{attr(short)}">',
        f'<meta property="og:description" content="{attr(desc)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{IMAGE}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{attr(NAME)} — a complete, fully-offline survival library.">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{attr(short)}">',
        f'<meta name="twitter:description" content="{attr(desc)}">',
        f'<meta name="twitter:image" content="{IMAGE}">',
        '<script type="application/ld+json">', ld, '</script>',
        '<!-- seo:end -->',
    ]
    return '\n'.join(lines) + '\n'


# Tags the generated block owns; hand-written copies are removed so there is one of each.
OWNED = [
    r'[ \t]*<link rel="canonical"[^>]*>\n',
    r'[ \t]*<meta property="og:[^"]+"[^>]*>\n',
    r'[ \t]*<meta name="twitter:[^"]+"[^>]*>\n',
    r'[ \t]*<meta name="robots"[^>]*>\n',
    r'[ \t]*<script type="application/ld\+json">.*?</script>\n',
]


def process(page):
    path = os.path.join(ROOT, page)
    src = open(path, encoding='utf-8').read()
    head_end = src.index('</head>')
    head, rest = src[:head_end], src[head_end:]
    head = re.sub(r'<!-- seo:start.*?<!-- seo:end -->\n', '', head, flags=re.S)
    for pat in OWNED:
        head = re.sub(pat, '', head, flags=re.S)

    if page in TOP_TITLE:
        head = re.sub(r'<title>.*?</title>', f'<title>{html.escape(TOP_TITLE[page], quote=False)}</title>', head, flags=re.S)
    title = text(re.search(r'<title>(.*?)</title>', head, re.S).group(1))

    m = re.search(r'<meta name="description" content="([^"]*)">', head)
    if page in DESCRIPTIONS:
        new = f'<meta name="description" content="{attr(DESCRIPTIONS[page])}">'
        if m:
            head = head.replace(m.group(0), new)
        else:
            head = re.sub(r'(<meta name="viewport"[^>]*>\n)', r'\1  ' + new.replace('\\', '\\\\') + '\n', head, count=1)
        desc = DESCRIPTIONS[page]
    elif m:
        desc = html.unescape(m.group(1))
    else:
        sys.exit(f'{page}: no meta description — add one to DESCRIPTIONS in tools/seo.py')

    out = head + block(page, title, desc, git_date(page)) + rest
    if out != src:
        open(path, 'w', encoding='utf-8').write(out)
        return True
    return False


def sitemap(all_pages):
    rows = []
    order = [ROOT_PAGE] + [p for p in all_pages if p != ROOT_PAGE]
    for p in order:
        if p in NOINDEX or p not in all_pages:
            continue
        pri = '1.0' if p == ROOT_PAGE else '0.9' if p == 'index.html' or p.startswith('sections/') else '0.7'
        date = git_date(p)
        rows.append('  <url>\n    <loc>%s</loc>\n%s    <priority>%s</priority>\n  </url>' % (
            url_of(p), f'    <lastmod>{date}</lastmod>\n' if date else '', pri))
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(rows) + '\n</urlset>\n')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(xml)
    return len(rows)


def page_info(page):
    head = open(os.path.join(ROOT, page), encoding='utf-8').read().split('</head>')[0]
    title = text(re.search(r'<title>(.*?)</title>', head, re.S).group(1)).split(' — ' + NAME)[0]
    desc = html.unescape(re.search(r'<meta name="description" content="([^"]*)">', head).group(1))
    return title, desc


LLMS_GROUPS = [
    ('Start here', ['index.html', 'home.html', 'quick-reference.html', 'download.html', 'about.html']),
    ('Guide sections', None),  # every page in sections/
    ('Reference and tools', ['tools.html', 'cards.html', 'gear.html', 'skills.html', 'literature.html',
                             'maps.html', 'expansion.html', 'print-essentials.html', 'index-print.html']),
    ('Offline AI (Bunker Bot)', ['ai-setup.html', 'bunker-bot-prompt.html']),
]


def llms_txt(all_pages):
    """llms.txt (llmstxt.org): a plain map of the site for AI crawlers and assistants."""
    n_sections = sum(p.startswith('sections/') for p in all_pages)
    out = [f'# {NAME}', '',
           f'> A free, fully-offline survival and emergency-preparedness library: {n_sections} guide sections '
           '(medical and first aid, water, food, shelter, power, fuel, navigation, communications, '
           'security, rebuilding), 33 bundled public-domain reference books, printable emergency cards, '
           'calculators, offline maps, and a local AI assistant that cites its sources. Runs from a USB '
           'stick or a Raspberry Pi with no internet. Licensed CC BY-SA 4.0.', '',
           'Content is cross-checked against the bundled reference books and cited inline. The medical '
           'material has not yet been reviewed by a licensed clinician; in a real emergency with services '
           'available, call them first.', '']
    used = set()
    for heading, group in LLMS_GROUPS:
        group = group or [p for p in all_pages if p.startswith('sections/')]
        out += [f'## {heading}', '']
        for p in group:
            if p in all_pages and p not in NOINDEX:
                t, d = page_info(p)
                out.append(f'- [{t}]({url_of(p)}): {d}')
                used.add(p)
        out.append('')
    rest = [p for p in all_pages if p not in used and p not in NOINDEX]
    if rest:
        out += ['## Optional', ''] + [f'- [{page_info(p)[0]}]({url_of(p)}): {page_info(p)[1]}' for p in rest] + ['']
    out += ['## Source', '', f'- [GitHub repository]({REPO}): source, issue tracker for corrections, releases', '']
    open(os.path.join(ROOT, 'llms.txt'), 'w', encoding='utf-8').write('\n'.join(out))


if __name__ == '__main__':
    ps = pages()
    changed = [p for p in ps if process(p)]
    n = sitemap(ps)
    llms_txt(ps)
    print(f'{len(changed)} of {len(ps)} pages updated; sitemap.xml lists {n} URLs; llms.txt written.')
