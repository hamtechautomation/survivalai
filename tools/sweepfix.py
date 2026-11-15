#!/usr/bin/env python3
"""Small helper for text corrections: find a sentence by its visible text (tags, &nbsp; and
entities between characters are allowed) and replace that span with new HTML.
Used by the accuracy sweeps; every change is logged in docs/DIAGRAMS.md."""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EQ = {'&': '(?:&amp;|&)', "'": "(?:'|’|&#39;|&rsquo;)", '’': "(?:'|’|&#39;|&rsquo;)", '"': '(?:"|“|”|&quot;)',
      '“': '(?:"|“|&ldquo;)', '”': '(?:"|”|&rdquo;)', '–': '(?:–|&ndash;)', '—': '(?:—|&mdash;)', '<': '(?:<|&lt;)', '>': '(?:>|&gt;)',
      '×': '(?:×|&times;)', '°': '(?:°|&deg;)', '½': '(?:½|&frac12;)', '¼': '(?:¼|&frac14;)', '¾': '(?:¾|&frac34;)', 'µ': '(?:µ|&micro;|μ)'}
TAG = r'(?:<[^>]+>)*'
def pattern(text):
    out = []
    for ch in text:
        if ch.isspace():
            if not out or not out[-1].endswith('+'):
                out.append(r'(?:\s|&nbsp;|' + ' ' + r'|<[^>]+>)+')
        else:
            out.append(EQ.get(ch, re.escape(ch)) + TAG)
    if out and out[-1].endswith(TAG):
        out[-1] = out[-1][:-len(TAG)]          # never swallow closing tags after the last character
    return ''.join(out)
_cache = {}
def page(name):
    if name not in _cache:
        _cache[name] = open(os.path.join(ROOT, 'sections', name + '.html'), encoding='utf-8').read()
    return _cache[name]
def F(name, old, new, count=1):
    s = page(name)
    pat = re.compile(pattern(old))
    found = list(pat.finditer(s))
    if len(found) != count:
        sys.exit('%s: expected %d match(es) for %r, found %d' % (name, count, old[:70], len(found)))
    if found and balance(found[0].group(0)) != balance(new):
        new = carry_closers(found[0].group(0), new)
    for m in found:
        if balance(m.group(0)) != balance(new):
            sys.exit('%s: tags would not balance for %r\n  matched HTML: %s\n  matched %s, new %s' % (name, old[:60], m.group(0)[:300], balance(m.group(0)), balance(new)))
    _cache[name] = pat.sub(lambda m: new, s)
def balance(h):
    net = {}
    for close, tag in re.findall(r'<(/?)([a-zA-Z0-9]+)[^>]*>', h):
        if tag.lower() in ('br', 'img', 'hr', 'wbr'): continue
        net[tag.lower()] = net.get(tag.lower(), 0) + (-1 if close else 1)
    return {k: v for k, v in net.items() if v}
def save():
    for name, s in _cache.items():
        open(os.path.join(ROOT, 'sections', name + '.html'), 'w', encoding='utf-8').write(s)
    print('saved', ', '.join(sorted(_cache)))

def carry_closers(matched, new):
    """A match that starts inside e.g. <strong>Label:</strong> swallows the closing tag. If the new text
    begins with the same label, put the closing tag back after it."""
    depth = {}
    for m in re.finditer(r'<(/?)([a-zA-Z0-9]+)[^>]*>', matched):
        tag = m.group(2).lower()
        if m.group(1):
            if depth.get(tag, 0) == 0:
                prefix = re.sub(r'<[^>]+>', '', matched[:m.start()])
                if new.startswith(prefix) and prefix.strip():
                    return carry_closers(matched[m.end():], new[len(prefix):]) if False else prefix + m.group(0) + new[len(prefix):]
                return new
            depth[tag] -= 1
        else:
            depth[tag] = depth.get(tag, 0) + 1
    return new
