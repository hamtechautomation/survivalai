#!/usr/bin/env python3
"""
bunkerbot.py — The Last Light Survival Guide, in your terminal. No browser.

One command turns the whole offline library into an AI guide that cites its
sources. It runs the same BM25 retrieval over the bundled books as the web app,
and talks to a local model (Ollama or a llamafile) — or Claude if you have a key.

    python3 bunkerbot.py                 # interactive guide
    python3 bunkerbot.py "how do I treat a deep bleeding wound"   # one-shot
    ./bunkerbot.py                       # after: chmod +x bunkerbot.py

Providers (auto-detected, in order):
    Ollama      http://localhost:11434     (OLLAMA_ORIGINS not needed for CLI)
    llamafile   http://localhost:8080      (OpenAI-compatible)
    Claude      set ANTHROPIC_API_KEY
    (none)      falls back to SEARCH-ONLY mode — still a citing lookup tool

Zero dependencies — Python 3 standard library only. Runs on a Raspberry Pi.

Environment:
    BUNKERBOT_MODEL   override the model name (else first Ollama model)
    BUNKERBOT_TEMP    sampling temperature (default 0.4)
    ANTHROPIC_API_KEY use Claude
    NO_COLOR          disable colour
"""
import os, sys, re, json, math, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
CHUNKS_PATH = os.path.join(HERE, 'search', 'pdf-chunks.json')
OLLAMA = 'http://localhost:11434'
LLAMAFILE = 'http://localhost:8080'
CLAUDE_URL = 'https://api.anthropic.com/v1/messages'
CLAUDE_MODEL = 'claude-opus-4-8'
TEMP = float(os.environ.get('BUNKERBOT_TEMP', '0.4'))
TOPK = 4

# ── colour ────────────────────────────────────────────────────────────────────
_C = sys.stdout.isatty() and not os.environ.get('NO_COLOR')
def c(code, s): return f'\033[{code}m{s}\033[0m' if _C else s
AMBER = lambda s: c('38;5;179', s)
DIM   = lambda s: c('2', s)
BOLD  = lambda s: c('1', s)
BLUE  = lambda s: c('38;5;74', s)
RED   = lambda s: c('38;5;167', s)

SYSTEM_PROMPT = """You are Bunker Bot — your offline survival AI — embedded in "The Last Light Survival Guide," a comprehensive offline emergency preparedness reference.

Your purpose:
- Answer ONLY questions related to survival, emergency preparedness, first aid, food/water, energy, shelter, navigation, security, and community resilience.
- For off-topic questions, politely redirect: "I'm specialized in survival and preparedness topics. Can I help you with something in that area?"

Using the bundled library (CRITICAL):
- When a "REFERENCE MATERIAL" block is provided below, treat it as your most authoritative source. Base your answer on it and prefer it over your own training when they conflict.
- When you use reference material, CITE it inline in plain text, e.g. (Where There Is No Doctor, p.412). Cite the specific source and page given in the block.
- If the reference material does not cover the question, say so plainly and answer from general knowledge — clearly, without fabricating a citation.

Accuracy and honesty:
- NEVER invent specific drug doses, mg/kg figures, or numeric values you are unsure of. State the standard range only if you are confident, and point to the bundled medical books and dosing calculator.
- If you do not know, say "I'm not certain" rather than guessing. A clear "I don't know" is safer than a confident wrong answer.

Response format:
1. Lead with a short, actionable answer (1-3 sentences). Clarity over completeness.
2. Follow with numbered steps or bullets if the task has multiple parts.
3. End with a "Warning:" line if there is a genuine safety risk.
4. Cite bundled sources inline where used.

Tone: Calm, direct, authoritative. Never alarmist. Experienced wilderness medic meets practical engineer.

Safety: Always prioritize human safety. Never recommend actions that could cause serious harm. When professional care becomes reachable, advise getting it."""

EMERGENCY_PROMPT = """You are Bunker Bot in EMERGENCY MODE. Someone may be in immediate danger.

Rules:
- Skip pleasantries. Lead with the most critical action FIRST.
- Number every step. Keep each step to one sentence.
- Flag life-threatening risks with "STOP —" and do not proceed past it unresolved.
- If professional services are needed (doctor, fire dept), say so first.
- No caveats, no "it depends" — best answer for the most common scenario.
- If a "REFERENCE MATERIAL" block is provided, base steps on it and cite it briefly, e.g. (Emergency War Surgery, p.88).
- Do NOT invent drug doses. Name the drug and route and say "confirm the dose" rather than guessing a number."""

# ── retrieval (mirrors librarian.js BM25 exactly — keep the two in sync) ───────
def tokenise(text):
    return re.findall(r'\b[a-z]{3,}\b', (text or '').lower())

# Survival-domain query expansion. BM25 alone matches words, not intent:
# "stop heavy bleeding" used to surface postpartum chapters because they say
# "bleeding" most often. Expanding the query with domain synonyms (at reduced
# weight, so the user's own words still dominate) pulls in the chunks that say
# "tourniquet" and "direct pressure" instead.
SYNONYMS = {
    'bleeding': ['hemorrhage', 'haemorrhage', 'tourniquet', 'wound', 'pressure', 'dressing'],
    'bleed':    ['hemorrhage', 'tourniquet', 'wound', 'pressure'],
    'blood':    ['bleeding', 'hemorrhage'],
    'broken':   ['fracture', 'splint', 'bone'],
    'fracture': ['splint', 'bone', 'broken'],
    'sprain':   ['splint', 'swelling', 'ligament'],
    'burn':     ['scald', 'blister', 'dressing'],
    'choking':  ['airway', 'heimlich', 'obstruction'],
    'poison':   ['poisoning', 'toxin', 'antidote', 'venom'],
    'snakebite':['venom', 'snake', 'bite', 'antivenom'],
    'infection':['antibiotic', 'sepsis', 'pus', 'infected'],
    'infected': ['antibiotic', 'infection', 'pus'],
    'fever':    ['temperature', 'infection'],
    'purify':   ['purification', 'disinfect', 'boil', 'chlorine', 'iodine', 'filter', 'potable'],
    'filter':   ['filtration', 'purify', 'sand', 'charcoal'],
    'diarrhea': ['diarrhoea', 'dehydration', 'rehydration', 'dysentery'],
    'diarrhoea':['diarrhea', 'dehydration', 'rehydration', 'dysentery'],
    'dehydration': ['rehydration', 'fluids', 'salts'],
    'hypothermia': ['cold', 'exposure', 'shivering', 'warming'],
    'frostbite':['freezing', 'thaw', 'extremities'],
    'heatstroke': ['hyperthermia', 'cooling', 'dehydration'],
    'stitches': ['suture', 'laceration', 'closure'],
    'suture':   ['stitches', 'laceration', 'wound'],
    'birth':    ['labor', 'labour', 'delivery', 'childbirth'],
    'pregnant': ['pregnancy', 'labor', 'birth'],
    'baby':     ['infant', 'newborn'],
    'tooth':    ['dental', 'toothache', 'teeth'],
    'toothache':['dental', 'tooth', 'cavity'],
    'fire':     ['tinder', 'kindling', 'ignite', 'ember'],
    'navigation': ['compass', 'bearing', 'chart', 'position'],
    'latitude': ['celestial', 'sextant', 'polaris', 'altitude'],
    'antenna':  ['dipole', 'wavelength', 'wire', 'aerial'],
    'radio':    ['transmitter', 'receiver', 'frequency', 'antenna'],
    'signal':   ['mirror', 'flare', 'rescue', 'distress'],
    'shelter':  ['insulation', 'lean', 'tarp'],
    'forage':   ['edible', 'plants', 'wild'],
    'edible':   ['forage', 'plants', 'poisonous'],
    'trap':     ['snare', 'deadfall', 'bait'],
    'knot':     ['rope', 'lashing', 'hitch', 'bend'],
    'solar':    ['panel', 'photovoltaic', 'battery', 'charge'],
    'radiation':['fallout', 'nuclear', 'iodide', 'shielding'],
    'compost':  ['humanure', 'manure', 'soil'],
}
SYN_WEIGHT  = 0.55   # expanded terms count roughly half the user's own words
STEM_WEIGHT = 0.7    # naive singular/plural variants

# Domain routing: when a query is clearly about X, gently boost the books that
# are authorities on X (and cool obviously-wrong ones). Multipliers are mild —
# BM25 relevance still decides within a domain. Sources match by substring.
DOMAIN_RULES = [
    {'name': 'obstetric', 'triggers': ['pregnan', 'birth', 'labor', 'labour', 'postpartum', 'midwif', 'uterus', 'breastfeed', 'infant', 'newborn', 'childbirth'],
     'boost': {'Midwives': 1.4}},
    {'name': 'dental', 'triggers': ['tooth', 'teeth', 'dental', 'gum', 'cavit', 'denture', 'toothache'],
     'boost': {'Dentist': 1.5}},
    {'name': 'trauma', 'triggers': ['bleed', 'hemorrhag', 'haemorrhag', 'wound', 'fractur', 'tourniquet', 'gunshot', 'lacerat', 'splint', 'sprain', 'burn', 'suture', 'stitch'],
     'boost': {'War Surgery': 1.3, 'Special Forces': 1.3, 'Wilderness Medicine': 1.3, 'First Aid': 1.3, 'No Doctor': 1.15},
     'demote': {'Midwives': ('obstetric', 0.7), 'Dentist': ('dental', 0.7)}},
    {'name': 'water', 'triggers': ['purif', 'disinfect', 'potable', 'chlorin', 'iodin', 'filtrat'],
     'boost': {'Hygiene': 1.4, 'Survival FM': 1.2, 'No Doctor': 1.1}},
    {'name': 'navigation', 'triggers': ['navigat', 'latitude', 'longitude', 'sextant', 'celestial', 'bearing', 'compass', 'chart', 'polaris'],
     'boost': {'Navigator': 1.35}},
    {'name': 'radio', 'triggers': ['radio', 'antenna', 'frequenc', 'transmit', 'receiver', 'morse', 'dipole', 'shortwave', 'aerial'],
     'boost': {'Signal': 1.4}},
    {'name': 'nbc', 'triggers': ['radiat', 'fallout', 'nuclear', 'iodide'],
     'boost': {'Nuclear War': 1.5, 'Survival FM': 1.15}},
]
# Literary/scripture sources are ~40% of the corpus and pure noise for how-to
# queries; cool them whenever any practical domain rule fires. Queries ABOUT
# these works fire no rule, so they stay fully searchable.
LITERARY = ['Shakespeare', 'Bible', 'Aesop', 'Meditations', 'Art of War']
LITERARY_DEMOTE = 0.5

def expand_query(query):
    """tokens → [(term, weight)] with synonyms + naive plural variants."""
    base = list(dict.fromkeys(tokenise(query)))
    weights = {t: 1.0 for t in base}
    for t in base:
        for s in SYNONYMS.get(t, []):
            if weights.get(s, 0) < SYN_WEIGHT:
                weights[s] = SYN_WEIGHT
        v = t[:-1] if t.endswith('s') else t + 's'
        if len(v) >= 3 and weights.get(v, 0) < STEM_WEIGHT:
            weights[v] = STEM_WEIGHT
    return list(weights.items())

def source_multipliers(terms):
    """Which domain rules fire for these (expanded) terms → per-source factor."""
    fired = set()
    for rule in DOMAIN_RULES:
        if any(t.startswith(trig) for t, _ in terms for trig in rule['triggers']):
            fired.add(rule['name'])
    mult = {}
    if not fired:
        return mult
    for rule in DOMAIN_RULES:
        if rule['name'] not in fired:
            continue
        for src, f in rule.get('boost', {}).items():
            mult[src] = mult.get(src, 1.0) * f
        for src, (unless, f) in rule.get('demote', {}).items():
            if unless not in fired:
                mult[src] = mult.get(src, 1.0) * f
    for src in LITERARY:
        mult[src] = mult.get(src, 1.0) * LITERARY_DEMOTE
    return mult

class Library:
    def __init__(self, chunks):
        self.chunks = chunks
        self.doc_tokens = [tokenise(ch['t']) for ch in chunks]
        N = len(chunks)
        df = {}
        total = 0
        for toks in self.doc_tokens:
            total += len(toks)
            for w in set(toks):
                df[w] = df.get(w, 0) + 1
        self.avgdl = (total / N) if N else 1
        self.idf = {w: math.log(1 + (N - dfw + 0.5) / (dfw + 0.5)) for w, dfw in df.items()}

    def search(self, query, topk=TOPK):
        q = expand_query(query)
        if not q:
            return []
        mult = source_multipliers(q)
        k1, b = 1.5, 0.75
        scored = []
        for i, toks in enumerate(self.doc_tokens):
            dl = len(toks) or 1
            freq = {}
            for w in toks:
                freq[w] = freq.get(w, 0) + 1
            score = 0.0
            for t, wgt in q:
                f = freq.get(t)
                if not f:
                    continue
                score += wgt * self.idf.get(t, 0) * (f * (k1 + 1)) / (f + k1 * (1 - b + b * dl / self.avgdl))
            if score > 0:
                src = self.chunks[i]['s']
                for key, factor in mult.items():
                    if key in src:
                        score *= factor
                scored.append((score, i))
        scored.sort(reverse=True)
        return [self.chunks[i] for _, i in scored[:topk]]

    def context(self, query):
        hits = self.search(query)
        if not hits:
            return '', []
        block = '\n---\n'.join(f"[{h['s']}, p.{h['p']}]\n{h['t']}" for h in hits)
        ctx = 'REFERENCE MATERIAL (from bundled library — use this to support your answer):\n' + block
        seen, sources = set(), []
        for h in hits:
            key = h['s']
            if key not in seen:
                seen.add(key)
                sources.append((h['s'], h['p']))
        return ctx, sources

# ── providers ──────────────────────────────────────────────────────────────────
def _get(url, timeout=3):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return json.load(r)
    except Exception:
        return None

def detect_provider():
    if os.environ.get('ANTHROPIC_API_KEY'):
        return ('claude', CLAUDE_MODEL)
    tags = _get(f'{OLLAMA}/api/tags')
    if tags and tags.get('models'):
        model = os.environ.get('BUNKERBOT_MODEL') or tags['models'][0]['name']
        return ('ollama', model)
    lf = _get(f'{LLAMAFILE}/v1/models')
    if lf:
        return ('llamafile', os.environ.get('BUNKERBOT_MODEL', 'local'))
    return (None, None)

def _post_stream(url, payload, headers):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    return urllib.request.urlopen(req, timeout=300)

def stream_ollama(model, messages):
    resp = _post_stream(f'{OLLAMA}/api/chat',
        {'model': model, 'messages': messages, 'stream': True,
         'options': {'temperature': TEMP, 'top_p': 0.9}},
        {'Content-Type': 'application/json'})
    for line in resp:
        line = line.strip()
        if not line:
            continue
        obj = json.loads(line)
        if obj.get('message', {}).get('content'):
            yield obj['message']['content']
        if obj.get('done'):
            break

def _stream_openai_sse(url, payload, headers):
    resp = _post_stream(url, payload, headers)
    for raw in resp:
        raw = raw.decode('utf-8', 'replace').strip()
        if not raw.startswith('data:'):
            continue
        data = raw[5:].strip()
        if data == '[DONE]':
            break
        try:
            obj = json.loads(data)
        except json.JSONDecodeError:
            continue
        yield obj

def stream_llamafile(model, messages):
    payload = {'model': model, 'messages': messages, 'stream': True, 'temperature': TEMP}
    for obj in _stream_openai_sse(f'{LLAMAFILE}/v1/chat/completions', payload,
                                  {'Content-Type': 'application/json'}):
        delta = obj.get('choices', [{}])[0].get('delta', {}).get('content')
        if delta:
            yield delta

def stream_claude(model, messages):
    system = next((m['content'] for m in messages if m['role'] == 'system'), '')
    convo = [m for m in messages if m['role'] != 'system']
    payload = {'model': model, 'system': system, 'messages': convo,
               'max_tokens': 1500, 'temperature': TEMP, 'stream': True}
    headers = {'Content-Type': 'application/json',
               'x-api-key': os.environ['ANTHROPIC_API_KEY'],
               'anthropic-version': '2023-06-01'}
    for obj in _stream_openai_sse(CLAUDE_URL, payload, headers):
        if obj.get('type') == 'content_block_delta':
            t = obj.get('delta', {}).get('text')
            if t:
                yield t

STREAMERS = {'ollama': stream_ollama, 'llamafile': stream_llamafile, 'claude': stream_claude}

# ── app ────────────────────────────────────────────────────────────────────────
def load_library():
    if not os.path.exists(CHUNKS_PATH):
        print(RED(f"Can't find {CHUNKS_PATH} — run this from the guide folder."))
        sys.exit(1)
    with open(CHUNKS_PATH, encoding='utf-8') as f:
        data = json.load(f)
    return Library(data['chunks'])

def answer(lib, provider, model, history, question, emergency):
    ctx, sources = lib.context(question)
    base = EMERGENCY_PROMPT if emergency else SYSTEM_PROMPT
    system = base + ('\n\n' + ctx if ctx else '')
    messages = [{'role': 'system', 'content': system}] + history[-12:] + \
               [{'role': 'user', 'content': question}]
    if provider is None:
        # search-only fallback: surface the reference material itself
        if not ctx:
            print(DIM("No local model and nothing in the library matched. Try rephrasing."))
            return None
        print(DIM("(no model running — showing the library's best matches)\n"))
        for src, pg in sources:
            print(BLUE(f"  📖 {src} · p.{pg}"))
        print()
        for h in lib.search(question):
            print(h['t'][:600].strip(), '\n')
        return None
    print(AMBER("\nBunker Bot: "), end='', flush=True)
    full = []
    try:
        for tok in STREAMERS[provider](model, messages):
            full.append(tok)
            sys.stdout.write(tok)
            sys.stdout.flush()
    except urllib.error.URLError as e:
        print(RED(f"\n[connection to {provider} failed: {e}]"))
        return None
    print()
    if sources:
        chips = '   '.join(BLUE(f"{s} · p.{p}") for s, p in sources)
        print(DIM("📚 Sources: ") + chips)
    return ''.join(full)

def main():
    lib = load_library()
    provider, model = detect_provider()
    args = [a for a in sys.argv[1:]]
    emergency = False

    # banner
    print(AMBER(BOLD("\n  ⚡ Bunker Bot — The Last Light Survival Guide")))
    n = len(lib.chunks)
    src_count = len({ch['s'] for ch in lib.chunks})
    print(DIM(f"  {n:,} indexed passages from {src_count} bundled books"))
    if provider:
        print(DIM(f"  model: {provider} · {model}   (temp {TEMP})"))
    else:
        print(RED("  no model detected — SEARCH-ONLY mode (start Ollama or a llamafile for AI answers)"))

    # one-shot mode
    if args:
        answer(lib, provider, model, [], ' '.join(args), emergency)
        return

    print(DIM("  commands: /emergency  /help  /quit\n"))
    history = []
    while True:
        try:
            q = input(AMBER("You: ")).strip()
        except (EOFError, KeyboardInterrupt):
            print(DIM("\n  stay safe.\n"))
            break
        if not q:
            continue
        low = q.lower()
        if low in ('/quit', '/exit', 'quit', 'exit'):
            print(DIM("  stay safe.\n"))
            break
        if low == '/help':
            print(DIM("  Ask any survival/preparedness question. It cites the bundled books.\n"
                      "  /emergency  toggle terse life-or-death mode\n"
                      "  /quit       exit\n"))
            continue
        if low == '/emergency':
            emergency = not emergency
            print(RED("  EMERGENCY MODE ON — terse, critical-action-first.\n") if emergency
                  else DIM("  emergency mode off.\n"))
            continue
        reply = answer(lib, provider, model, history, q, emergency)
        if reply:
            history.append({'role': 'user', 'content': q})
            history.append({'role': 'assistant', 'content': reply})
        print()

if __name__ == '__main__':
    main()
