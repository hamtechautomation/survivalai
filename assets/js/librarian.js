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
      const r = await fetch('search/pdf-chunks.json');
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

  // BM25-style: score chunks by query-term frequency
  function searchChunks(query, topK = 4) {
    if (!pdfLoaded || !pdfChunks.length) return [];
    const qTerms = [...new Set(tokenise(query))];
    if (!qTerms.length) return [];

    const scored = pdfChunks.map((chunk, i) => {
      const words = tokenise(chunk.t);
      const freq  = {};
      for (const w of words) freq[w] = (freq[w] || 0) + 1;
      const score = qTerms.reduce((s, t) => s + (freq[t] || 0), 0);
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
    loadPdfChunks, getContext, isPdfIndexed, getPdfChunkCount,
    downloadAll
  };
})();
