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

  // BM25 ranking over the chunk corpus
  function searchChunks(query, topK = 4) {
    if (!pdfLoaded || !pdfChunks.length) return [];
    if (!_idf) buildStats();
    const qTerms = [...new Set(tokenise(query))];
    if (!qTerms.length) return [];

    const k1 = 1.5, b = 0.75;
    const scored = pdfChunks.map((chunk, i) => {
      const words = _docTokens[i] || tokenise(chunk.t);
      const dl = words.length || 1;
      const freq = {};
      for (const w of words) freq[w] = (freq[w] || 0) + 1;
      let score = 0;
      for (const t of qTerms) {
        const f = freq[t]; if (!f) continue;
        const idf = _idf[t] || 0;
        score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * dl / _avgdl));
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
