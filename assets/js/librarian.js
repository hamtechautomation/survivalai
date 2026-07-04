/* librarian.js — Personal Library Manager + PDF RAG for Bunker Bot */
'use strict';

const Librarian = (() => {

  const LS_ENTRIES = 'll-library-entries';
  const LS_NOTES   = 'll-library-notes';

  // ── Personal library entries ──────────────────────────────
  let entries = [];

  function loadEntries() {
    try { entries = JSON.parse(localStorage.getItem(LS_ENTRIES) || '[]'); }
    catch { entries = []; }
    return entries;
  }

  function saveEntries() {
    localStorage.setItem(LS_ENTRIES, JSON.stringify(entries));
  }

  function addEntry(data) {
    const entry = {
      id:     Date.now().toString(36) + Math.random().toString(36).slice(2),
      title:  data.title  || 'Untitled',
      author: data.author || '',
      url:    data.url    || '',
      desc:   data.desc   || '',
      tags:   (data.tags  || '').split(',').map(t => t.trim()).filter(Boolean),
      notes:  data.notes  || '',
      added:  new Date().toISOString().slice(0, 10)
    };
    entries.unshift(entry);
    saveEntries();
    return entry;
  }

  function updateEntry(id, data) {
    const i = entries.findIndex(e => e.id === id);
    if (i === -1) return null;
    entries[i] = {
      ...entries[i], ...data,
      tags: (data.tags || '').split(',').map(t => t.trim()).filter(Boolean)
    };
    saveEntries();
    return entries[i];
  }

  function removeEntry(id) {
    entries = entries.filter(e => e.id !== id);
    saveEntries();
  }

  function exportLibrary() {
    const blob = new Blob(
      [JSON.stringify({ entries, notes: getNotes(), exported: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'last-light-library.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function importLibrary(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data.entries)) {
        const seen = new Set(entries.map(e => e.id));
        data.entries.forEach(e => { if (!seen.has(e.id)) entries.push(e); });
        saveEntries();
      }
      if (data.notes) localStorage.setItem(LS_NOTES, data.notes);
      return true;
    } catch { return false; }
  }

  // ── Knowledge-base notes ──────────────────────────────────
  function getNotes() {
    return localStorage.getItem(LS_NOTES) || '';
  }

  function saveNotes(text) {
    localStorage.setItem(LS_NOTES, text);
  }

  // ── PDF RAG ───────────────────────────────────────────────
  let pdfChunks  = null;
  let pdfLoaded  = false;
  let pdfLoading = false;

  async function loadPdfChunks(onProgress) {
    if (pdfLoaded || pdfLoading) return pdfLoaded;
    pdfLoading = true;
    try {
      onProgress?.('Fetching PDF index...');
      const inSub = window.location.pathname.match(/\/(sections|pdfs)\//);
      const r = await fetch((inSub ? '../' : '') + 'search/pdf-chunks.json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      onProgress?.('Parsing index...');
      const data = await r.json();
      pdfChunks = data.chunks || [];
      pdfLoaded = pdfChunks.length > 0;
      onProgress?.(pdfLoaded ? `Loaded ${pdfChunks.length} chunks.` : 'Empty index.');
    } catch (e) {
      pdfChunks = [];
      pdfLoaded = false;
      onProgress?.('Not found — run extract.py first.');
    }
    pdfLoading = false;
    return pdfLoaded;
  }

  function tokenise(text) {
    return (text || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  }

  // ── Survival-domain query expansion (keep in sync with bunkerbot.py) ──
  // BM25 alone matches words, not intent: "stop heavy bleeding" used to surface
  // postpartum chapters because they say "bleeding" most often. Expanding the
  // query with domain synonyms (at reduced weight, so the user's own words still
  // dominate) pulls in the chunks that say "tourniquet" and "direct pressure".
  const SYNONYMS = {
    bleeding: ['hemorrhage','haemorrhage','tourniquet','wound','pressure','dressing'],
    bleed:    ['hemorrhage','tourniquet','wound','pressure'],
    blood:    ['bleeding','hemorrhage'],
    broken:   ['fracture','splint','bone'],
    fracture: ['splint','bone','broken'],
    sprain:   ['splint','swelling','ligament'],
    burn:     ['scald','blister','dressing'],
    choking:  ['airway','heimlich','obstruction'],
    poison:   ['poisoning','toxin','antidote','venom'],
    snakebite:['venom','snake','bite','antivenom'],
    infection:['antibiotic','sepsis','pus','infected'],
    infected: ['antibiotic','infection','pus'],
    fever:    ['temperature','infection'],
    purify:   ['purification','disinfect','boil','chlorine','iodine','filter','potable'],
    filter:   ['filtration','purify','sand','charcoal'],
    diarrhea: ['diarrhoea','dehydration','rehydration','dysentery'],
    diarrhoea:['diarrhea','dehydration','rehydration','dysentery'],
    dehydration: ['rehydration','fluids','salts'],
    hypothermia: ['cold','exposure','shivering','warming'],
    frostbite:['freezing','thaw','extremities'],
    heatstroke: ['hyperthermia','cooling','dehydration'],
    stitches: ['suture','laceration','closure'],
    suture:   ['stitches','laceration','wound'],
    birth:    ['labor','labour','delivery','childbirth'],
    pregnant: ['pregnancy','labor','birth'],
    baby:     ['infant','newborn'],
    tooth:    ['dental','toothache','teeth'],
    toothache:['dental','tooth','cavity'],
    fire:     ['tinder','kindling','ignite','ember'],
    navigation: ['compass','bearing','chart','position'],
    latitude: ['celestial','sextant','polaris','altitude'],
    antenna:  ['dipole','wavelength','wire','aerial'],
    radio:    ['transmitter','receiver','frequency','antenna'],
    signal:   ['mirror','flare','rescue','distress'],
    shelter:  ['insulation','lean','tarp'],
    forage:   ['edible','plants','wild'],
    edible:   ['forage','plants','poisonous'],
    trap:     ['snare','deadfall','bait'],
    knot:     ['rope','lashing','hitch','bend'],
    solar:    ['panel','photovoltaic','battery','charge'],
    radiation:['fallout','nuclear','iodide','shielding'],
    compost:  ['humanure','manure','soil'],
  };
  const SYN_WEIGHT = 0.55, STEM_WEIGHT = 0.7;

  // Domain routing: when a query is clearly about X, gently boost the books
  // that are authorities on X (and cool obviously-wrong ones). Multipliers are
  // mild — BM25 relevance still decides within a domain. Substring source match.
  const DOMAIN_RULES = [
    { name:'obstetric', triggers:['pregnan','birth','labor','labour','postpartum','midwif','uterus','breastfeed','infant','newborn','childbirth'],
      boost:{ 'Midwives':1.4 } },
    { name:'dental', triggers:['tooth','teeth','dental','gum','cavit','denture','toothache'],
      boost:{ 'Dentist':1.5 } },
    { name:'trauma', triggers:['bleed','hemorrhag','haemorrhag','wound','fractur','tourniquet','gunshot','lacerat','splint','sprain','burn','suture','stitch'],
      boost:{ 'War Surgery':1.3, 'Special Forces':1.3, 'Wilderness Medicine':1.3, 'First Aid':1.3, 'No Doctor':1.15 },
      demote:{ 'Midwives':['obstetric',0.7], 'Dentist':['dental',0.7] } },
    { name:'water', triggers:['purif','disinfect','potable','chlorin','iodin','filtrat'],
      boost:{ 'Hygiene':1.4, 'Survival FM':1.2, 'No Doctor':1.1 } },
    { name:'navigation', triggers:['navigat','latitude','longitude','sextant','celestial','bearing','compass','chart','polaris'],
      boost:{ 'Navigator':1.35 } },
    { name:'radio', triggers:['radio','antenna','frequenc','transmit','receiver','morse','dipole','shortwave','aerial'],
      boost:{ 'Signal':1.4 } },
    { name:'nbc', triggers:['radiat','fallout','nuclear','iodide'],
      boost:{ 'Nuclear War':1.5, 'Survival FM':1.15 } },
  ];
  // Literary/scripture sources are ~40% of the corpus and pure noise for how-to
  // queries; cool them whenever any practical rule fires. Queries ABOUT these
  // works fire no rule, so they stay fully searchable.
  const LITERARY = ['Shakespeare','Bible','Aesop','Meditations','Art of War'];
  const LITERARY_DEMOTE = 0.5;

  // tokens → [ [term, weight] ] with synonyms + naive singular/plural variants
  function expandQuery(query) {
    const base = [...new Set(tokenise(query))];
    const weights = {};
    for (const t of base) weights[t] = 1.0;
    for (const t of base) {
      for (const s of (SYNONYMS[t] || []))
        if (!(weights[s] >= SYN_WEIGHT)) weights[s] = SYN_WEIGHT;
      const v = t.endsWith('s') ? t.slice(0, -1) : t + 's';
      if (v.length >= 3 && !(weights[v] >= STEM_WEIGHT)) weights[v] = STEM_WEIGHT;
    }
    return Object.entries(weights);
  }

  // which domain rules fire for these (expanded) terms → per-source factor
  function sourceMultipliers(terms) {
    const fired = new Set();
    for (const rule of DOMAIN_RULES)
      if (terms.some(([t]) => rule.triggers.some(trig => t.startsWith(trig))))
        fired.add(rule.name);
    const mult = {};
    if (!fired.size) return mult;
    for (const rule of DOMAIN_RULES) {
      if (!fired.has(rule.name)) continue;
      for (const src in (rule.boost || {})) mult[src] = (mult[src] || 1) * rule.boost[src];
      for (const src in (rule.demote || {})) {
        const [unless, f] = rule.demote[src];
        if (!fired.has(unless)) mult[src] = (mult[src] || 1) * f;
      }
    }
    for (const src of LITERARY) mult[src] = (mult[src] || 1) * LITERARY_DEMOTE;
    return mult;
  }

  // ── BM25 index stats (built once, cached) ──
  // Proper IDF weighting matters: with large literary texts (Bible,
  // Shakespeare) in the same flat index, raw term-frequency lets common
  // words drown out concentrated technical terms. IDF rewards rare,
  // discriminative terms so a medical query surfaces the medical books.
  let _idf = null, _avgdl = 1, _docTokens = null;
  function buildStats() {
    const N = pdfChunks.length;
    const df = {};
    _docTokens = new Array(N);
    let total = 0;
    for (let i = 0; i < N; i++) {
      const words = tokenise(pdfChunks[i].t);
      _docTokens[i] = words;
      total += words.length;
      for (const w of new Set(words)) df[w] = (df[w] || 0) + 1;
    }
    _avgdl = total / N || 1;
    _idf = {};
    for (const w in df) _idf[w] = Math.log(1 + (N - df[w] + 0.5) / (df[w] + 0.5));
  }

  // BM25 ranking over the chunk corpus — with weighted query expansion and
  // domain-aware source routing (see expandQuery / sourceMultipliers above)
  function searchChunks(query, topK = 4) {
    if (!pdfLoaded || !pdfChunks.length) return [];
    if (!_idf) buildStats();
    const qTerms = expandQuery(query);
    if (!qTerms.length) return [];
    const mult = sourceMultipliers(qTerms);

    const k1 = 1.5, b = 0.75;
    const scored = pdfChunks.map((chunk, i) => {
      const words = _docTokens[i] || tokenise(chunk.t);
      const dl = words.length || 1;
      const freq = {};
      for (const w of words) freq[w] = (freq[w] || 0) + 1;
      let score = 0;
      for (const [t, wgt] of qTerms) {
        const f = freq[t]; if (!f) continue;
        const idf = _idf[t] || 0;
        score += wgt * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * dl / _avgdl));
      }
      if (score > 0) for (const key in mult) {
        if (chunk.s.includes(key)) score *= mult[key];
      }
      return { i, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => pdfChunks[s.i]);
  }

  // Returns formatted context string for injection into Bunker Bot system prompt
  function getContext(query) {
    const parts = [];

    const chunks = searchChunks(query);
    if (chunks.length) {
      const block = chunks.map(c => `[${c.s}, p.${c.p}]\n${c.t}`).join('\n---\n');
      parts.push('REFERENCE MATERIAL (from bundled library — use this to support your answer):\n' + block);
    }

    const notes = getNotes().trim();
    if (notes) {
      const qTerms = tokenise(query);
      const notesLow = notes.toLowerCase();
      const hit = qTerms.some(t => notesLow.includes(t));
      if (hit) {
        const snippet = notes.length > 1200 ? notes.slice(0, 1200) + '…' : notes;
        parts.push('PERSONAL KNOWLEDGE BASE NOTES:\n' + snippet);
      }
    }

    const entryNotes = entries
      .filter(e => e.notes && tokenise(query).some(t => e.notes.toLowerCase().includes(t)))
      .slice(0, 2)
      .map(e => `[${e.title}]\n${e.notes}`)
      .join('\n---\n');
    if (entryNotes) parts.push('BOOK NOTES:\n' + entryNotes);

    return parts.join('\n\n===\n\n');
  }

  // Distinct sources (with page) backing a query — for UI citation chips
  function getSources(query, topK = 4) {
    const seen = new Set();
    const out = [];
    for (const c of searchChunks(query, topK)) {
      const key = c.s + '|' + c.p;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ source: c.s, page: c.p });
    }
    return out;
  }

  function isPdfIndexed() { return pdfLoaded && pdfChunks.length > 0; }
  function getPdfChunkCount() { return pdfChunks ? pdfChunks.length : 0; }

  // ── Download-all helper ───────────────────────────────────
  // NOTE: programmatic multi-download is blocked by browsers.
  // Callers should show a guide modal instead — this is kept
  // for single-file use only (i.e. files.length === 1).
  function downloadAll(files) {
    if (files.length === 1) {
      const a = document.createElement('a');
      a.href = files[0];
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return {
    loadEntries, addEntry, updateEntry, removeEntry,
    exportLibrary, importLibrary,
    getNotes, saveNotes,
    loadPdfChunks, getContext, getSources, isPdfIndexed, getPdfChunkCount,
    downloadAll
  };
})();
