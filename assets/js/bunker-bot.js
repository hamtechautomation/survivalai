/* =========================================
   THE LAST LIGHT SURVIVAL GUIDE
   bunker-bot.js — Bunker Bot AI Chat Panel
   Providers: Ollama (offline) | Claude API (online)
   ========================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     CONSTANTS
  ────────────────────────────────────────── */
  const OLLAMA_URL        = 'http://localhost:11434';
  const CLAUDE_API_URL    = 'https://api.anthropic.com/v1/messages';
  const ANTHROPIC_VERSION = '2023-06-01';

  const PROVIDER_LOCAL  = 'local';
  const PROVIDER_CLAUDE = 'claude';

  const CLAUDE_MODELS = [
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5  — fast & cheap'   },
    { id: 'claude-sonnet-4-6',         label: 'Sonnet 4.6 — best quality'    },
  ];

  const SYSTEM_PROMPT = `You are Bunker Bot — your offline survival AI — embedded in "The Last Light Survival Guide," a comprehensive offline emergency preparedness reference.

Your purpose:
- Answer ONLY questions related to survival, emergency preparedness, first aid, food/water, energy, shelter, navigation, security, and community resilience.
- For off-topic questions, politely redirect: "I'm specialized in survival and preparedness topics. Can I help you with something in that area?"

The guide contains 27 sections covering:
Food & Water, Medical & First Aid, Energy, Shelter & Construction, Communications, Navigation, Security & Defense, Knowledge & Literacy, First Principles (science/maths/invention), Agriculture, Animal Husbandry, Veterinary Care, Pregnancy & Infant Care, NBC/EMP Threats, Disaster Playbooks, Climate & Regional, Metallurgy, Governance, Psychology & Morale, Chemistry & Materials, Textiles & Clothing, Vehicles & Transport, Power Generation, Building & Structures, Medicine Making, Water Systems, Practical Projects (cooling/air filters/dams/pumps/toilets/radiation/mills/breeding/food storage).

Using the bundled library (CRITICAL):
- When a "REFERENCE MATERIAL" block is provided below, treat it as your most authoritative source. Base your answer on it and prefer it over your own training when they conflict.
- When you use reference material, CITE it inline in plain text, e.g. (Where There Is No Doctor, p.412). Cite the specific source and page given in the block.
- If the reference material does not cover the question, say so plainly and answer from general knowledge — clearly, without fabricating a citation.

Accuracy and honesty:
- NEVER invent specific drug doses, mg/kg figures, or numeric values you are unsure of. For medication dosing, point the user to the Antibiotic Dosing Calculator and Field Pharmacology Guide (Calculators & Tools) and the bundled medical books, and state the standard range only if you are confident.
- If you do not know, or the guide does not cover it, say "I'm not certain" rather than guessing. A clear "I don't know" is safer than a confident wrong answer.
- Do not overstate certainty on medical, structural, or chemical safety questions.

Response format:
1. Lead with a short, actionable answer (1-3 sentences). Clarity over completeness.
2. Follow with numbered steps or bullet points if the task has multiple parts.
3. End with a "⚠️ Warning:" line if there is a genuine safety risk.
4. Cite bundled sources inline where used, and add "→ See: [Section Name]" for the relevant guide section.

Tone: Calm, direct, authoritative. Never alarmist. Think experienced wilderness medic meets practical engineer.

Safety: Always prioritize human safety. Never recommend actions that could cause serious harm. When professional care (doctor, dentist, surgeon) becomes reachable, say so and advise getting it. When in doubt, advise seeking professional help post-crisis.`;

  const EMERGENCY_SYSTEM_PROMPT = `You are Bunker Bot in EMERGENCY MODE. Someone may be in immediate danger.

Rules:
- Skip pleasantries. Lead with the most critical action FIRST.
- Number every step. Keep each step to one sentence.
- Flag life-threatening risks with ⛔ STOP — do not proceed past this warning without resolving it.
- If the situation requires professional services (doctor, fire department), say so first.
- No caveats, no "it depends" — give your best answer for the most common scenario.
- If a "REFERENCE MATERIAL" block is provided, base steps on it and cite it briefly inline, e.g. (Emergency War Surgery, p.88).
- Do NOT invent drug doses. If a dose is needed, name the drug and route and say "confirm the dose" rather than guessing a number.

You cover: first aid, water purification, shelter, fire, signalling for rescue, food safety, trauma, burns, fractures, poisoning, allergic reactions, NBC threats.`;

  /* ──────────────────────────────────────────
     STATE
  ────────────────────────────────────────── */
  let conversationHistory = [];
  let currentProvider     = PROVIDER_LOCAL;
  let ollamaModel         = 'llama3';
  let claudeModel         = CLAUDE_MODELS[0].id;
  let claudeApiKey        = '';
  let currentTemperature  = 0.7;
  let emergencyMode       = false;
  let isStreaming         = false;
  let abortController     = null;
  let toolbarBuilt        = false;
  let tokenCount          = 0;

  /* ──────────────────────────────────────────
     DOM HELPER
  ────────────────────────────────────────── */
  function $(id) { return document.getElementById(id); }

  /* ──────────────────────────────────────────
     INIT
  ────────────────────────────────────────── */
  window.ariaInit = function () {
    if (!toolbarBuilt) { buildToolbar(); toolbarBuilt = true; }
    loadPreferences();
    ensureLibrarian();
    checkStatus();
    setupInputHandlers();
  };

  /* ──────────────────────────────────────────
     LIBRARY RAG — ensure librarian.js is loaded and the
     PDF chunk index is in memory, on EVERY page (not just
     literature.html). This is what lets Bunker Bot cite the
     bundled library anywhere in the guide.
  ────────────────────────────────────────── */
  let librarianRequested = false;
  function ensureLibrarian() {
    if (librarianRequested) return;
    librarianRequested = true;

    if (typeof Librarian !== 'undefined') {
      try { Librarian.loadEntries(); } catch (_) {}
      Librarian.loadPdfChunks().catch(() => {});
      return;
    }

    /* Derive librarian.js path from our own <script src> so it works
       at any directory depth (root, /sections/, /pdfs/) and on file://. */
    const tag = document.querySelector('script[src$="bunker-bot.js"]');
    const src = tag ? tag.getAttribute('src') : 'assets/js/bunker-bot.js';
    const libSrc = src.replace(/bunker-bot\.js(\?.*)?$/, 'librarian.js');

    const s = document.createElement('script');
    s.src = libSrc;
    s.onload = () => {
      if (typeof Librarian === 'undefined') return;
      try { Librarian.loadEntries(); } catch (_) {}
      Librarian.loadPdfChunks().catch(() => {});
    };
    s.onerror = () => {};
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = $('aria-panel');
    if (panel && panel.classList.contains('open')) ariaInit();
  });

  /* ──────────────────────────────────────────
     TOOLBAR BUILD
  ────────────────────────────────────────── */
  function buildToolbar() {
    const panel = $('aria-panel');
    if (!panel) return;

    /* ── Settings gear button in header ── */
    const header = panel.querySelector('.aria-header');
    if (header && !panel.querySelector('#aria-settings-toggle')) {
      const gear = document.createElement('button');
      gear.id        = 'aria-settings-toggle';
      gear.className = 'btn-icon';
      gear.title     = 'Settings';
      gear.style.cssText = 'font-size:.9rem;opacity:.6;transition:opacity .2s';
      gear.textContent = '⚙️';
      const closeBtn = header.querySelector('#aria-close') || header.querySelector('.btn-icon');
      if (closeBtn) header.insertBefore(gear, closeBtn);
      else header.appendChild(gear);
    }

    /* ── System prompt collapsible ── */
    if (header && !panel.querySelector('.aria-system-prompt')) {
      const sysEl = document.createElement('details');
      sysEl.className = 'aria-system-prompt no-print';
      sysEl.innerHTML = `<summary>System Prompt</summary><pre>${escapeHtml(SYSTEM_PROMPT)}</pre>`;
      header.after(sysEl);
    }

    /* ── Main toolbar (after .aria-status) — collapsed by default ── */
    const statusEl = panel.querySelector('.aria-status');
    if (statusEl && !panel.querySelector('.aria-toolbar')) {
      const tb = document.createElement('div');
      tb.className = 'aria-toolbar no-print';
      tb.style.display = 'none';
      tb.innerHTML = `
        <!-- Provider toggle -->
        <div class="aria-toolbar-row aria-provider-row">
          <span class="aria-toolbar-label">Mode</span>
          <div class="aria-provider-toggle">
            <button id="aria-provider-local"  class="aria-provider-btn active" title="Offline — uses your local Ollama model">🏠 Local</button>
            <button id="aria-provider-claude" class="aria-provider-btn"        title="Online — uses Claude API (requires internet + API key)">☁️ Claude</button>
          </div>
        </div>
        <!-- Ollama model row (visible in Local mode) -->
        <div class="aria-toolbar-row" id="aria-row-ollama-model">
          <span class="aria-toolbar-label">Model</span>
          <select id="aria-model-select" class="aria-select" title="Select local Ollama model">
            <option value="llama3">llama3</option>
          </select>
          <span id="aria-token-count" class="aria-token-count" title="Estimated tokens used this session">0 tok</span>
        </div>
        <!-- Claude model row (hidden in Local mode) -->
        <div class="aria-toolbar-row" id="aria-row-claude-model" style="display:none">
          <span class="aria-toolbar-label">Model</span>
          <select id="aria-claude-model-select" class="aria-select" title="Select Claude model">
            ${CLAUDE_MODELS.map(m => `<option value="${m.id}">${m.label}</option>`).join('')}
          </select>
          <span id="aria-token-count-claude" class="aria-token-count" title="Tokens used this session">0 tok</span>
        </div>
        <!-- Claude API key row (hidden in Local mode) -->
        <div class="aria-toolbar-row aria-apikey-row" id="aria-row-apikey" style="display:none">
          <span class="aria-toolbar-label">API Key</span>
          <input type="password" id="aria-claude-key" class="aria-apikey-input"
                 placeholder="sk-ant-api03-…" autocomplete="off" spellcheck="false">
          <button id="aria-key-toggle" class="btn btn-sm btn-ghost" style="font-size:.7rem;padding:.15rem .35rem" title="Show/hide key">👁</button>
          <button id="aria-key-save"   class="btn btn-sm btn-primary" style="font-size:.7rem;padding:.15rem .45rem">Save</button>
        </div>
        <!-- Temperature row (both modes) -->
        <div class="aria-toolbar-row">
          <span class="aria-toolbar-label">Temp</span>
          <input type="range" id="aria-temp-slider" min="0" max="1" step="0.05" value="0.7" class="aria-slider"
                 title="Response temperature — lower is more focused, higher is more creative">
          <span id="aria-temp-value" class="aria-slider-val">0.7</span>
        </div>`;
      statusEl.after(tb);

      /* Wire gear toggle */
      $('aria-settings-toggle')?.addEventListener('click', () => {
        const open = tb.style.display === 'none';
        tb.style.display = open ? '' : 'none';
        const gear = $('aria-settings-toggle');
        if (gear) gear.style.opacity = open ? '1' : '.6';
      });

      /* Wire provider toggle */
      $('aria-provider-local') ?.addEventListener('click', () => switchProvider(PROVIDER_LOCAL));
      $('aria-provider-claude')?.addEventListener('click', () => switchProvider(PROVIDER_CLAUDE));

      /* Wire Ollama model select */
      $('aria-model-select')?.addEventListener('change', e => {
        ollamaModel = e.target.value;
        localStorage.setItem('aria-ollama-model', ollamaModel);
        updateModelBadge();
      });

      /* Wire Claude model select */
      $('aria-claude-model-select')?.addEventListener('change', e => {
        claudeModel = e.target.value;
        localStorage.setItem('aria-claude-model', claudeModel);
        updateModelBadge();
      });

      /* Wire API key */
      $('aria-key-save')?.addEventListener('click', saveApiKey);
      $('aria-key-toggle')?.addEventListener('click', () => {
        const inp = $('aria-claude-key');
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
      });
      $('aria-claude-key')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveApiKey();
      });

      /* Wire temperature */
      const tempSlider = $('aria-temp-slider');
      const tempVal    = $('aria-temp-value');
      if (tempSlider) {
        tempSlider.addEventListener('input', () => {
          currentTemperature = parseFloat(tempSlider.value);
          if (tempVal) tempVal.textContent = currentTemperature.toFixed(2);
          localStorage.setItem('aria-temperature', currentTemperature);
        });
      }
    }

    /* ── Actions row (after .aria-input-area) ── */
    const inputArea = panel.querySelector('.aria-input-area');
    if (inputArea && !panel.querySelector('.aria-actions')) {
      const actions = document.createElement('div');
      actions.className = 'aria-actions no-print';
      actions.innerHTML = `
        <button id="aria-emergency" class="btn btn-sm btn-ghost" title="Emergency mode — direct answers, no hedging">🚨 Emergency</button>
        <button id="aria-copy-last" class="btn btn-sm btn-ghost" title="Copy last response">📋 Copy</button>
        <button id="aria-export"    class="btn btn-sm btn-ghost" title="Export conversation as text">💾 Export</button>
        <button id="aria-clear-btn" class="btn btn-sm btn-ghost" title="Clear conversation">🗑️ Clear</button>`;
      inputArea.after(actions);

      $('aria-emergency')?.addEventListener('click', toggleEmergencyMode);
      $('aria-copy-last')?.addEventListener('click', copyLastResponse);
      $('aria-export')   ?.addEventListener('click', exportChat);
      $('aria-clear-btn')?.addEventListener('click', () => ariaClear());
    }
  }

  /* ──────────────────────────────────────────
     PROVIDER SWITCHING
  ────────────────────────────────────────── */
  function switchProvider(provider) {
    currentProvider = provider;
    localStorage.setItem('aria-provider', provider);

    const isLocal  = provider === PROVIDER_LOCAL;
    const isCloud  = provider === PROVIDER_CLAUDE;

    /* Toggle button states */
    $('aria-provider-local') ?.classList.toggle('active', isLocal);
    $('aria-provider-claude')?.classList.toggle('active', isCloud);

    /* Show/hide rows */
    const rowOllama  = $('aria-row-ollama-model');
    const rowClaude  = $('aria-row-claude-model');
    const rowApiKey  = $('aria-row-apikey');
    if (rowOllama) rowOllama.style.display = isLocal ? '' : 'none';
    if (rowClaude) rowClaude.style.display = isCloud ? '' : 'none';
    if (rowApiKey) rowApiKey.style.display = isCloud ? '' : 'none';

    /* Populate API key field if we have one saved */
    if (isCloud && claudeApiKey) {
      const inp = $('aria-claude-key');
      if (inp) inp.value = claudeApiKey;
    }

    updateModelBadge();
    checkStatus();
  }

  /* ──────────────────────────────────────────
     API KEY
  ────────────────────────────────────────── */
  function saveApiKey() {
    const inp = $('aria-claude-key');
    if (!inp) return;
    const key = inp.value.trim();
    if (!key) return;

    claudeApiKey = key;
    /* Store obfuscated — just base64, not real security but avoids casual reading */
    try { localStorage.setItem('aria-claude-key', btoa(key)); } catch (_) {}

    const btn = $('aria-key-save');
    if (btn) {
      btn.textContent = '✓ Saved';
      btn.style.background = 'var(--green,#2a8a2a)';
      setTimeout(() => { btn.textContent = 'Save'; btn.style.background = ''; }, 2000);
    }
    checkStatus();
  }

  function loadApiKey() {
    try {
      const raw = localStorage.getItem('aria-claude-key');
      if (raw) claudeApiKey = atob(raw);
    } catch (_) {}
  }

  /* ──────────────────────────────────────────
     STATUS CHECK
  ────────────────────────────────────────── */
  async function checkStatus() {
    if (currentProvider === PROVIDER_LOCAL) {
      await checkOllamaStatus();
    } else {
      checkClaudeStatus();
    }
  }

  async function checkOllamaStatus() {
    const dot   = document.querySelector('.status-dot');
    const label = document.querySelector('.aria-status-label');
    if (!dot) return;

    dot.className = 'status-dot checking';
    if (label) label.textContent = 'Checking Ollama…';

    try {
      const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data   = await res.json();
      const models = (data.models || []).map(m => m.name);
      dot.className = 'status-dot online';
      if (label) label.textContent = `🏠 Local · ${models.length} model${models.length !== 1 ? 's' : ''}`;

      populateOllamaModels(models);

      /* Pick best available model */
      const saved     = localStorage.getItem('aria-ollama-model');
      const preferred = ['llama3', 'llama3:8b', 'gemma3', 'phi4-mini', 'phi3', 'mistral'];
      if (saved && models.includes(saved)) {
        ollamaModel = saved;
      } else {
        for (const p of preferred) {
          const match = models.find(n => n.startsWith(p));
          if (match) { ollamaModel = match; break; }
        }
        if (models.length && !models.includes(ollamaModel)) ollamaModel = models[0];
      }

      const sel = $('aria-model-select');
      if (sel) sel.value = ollamaModel;
      updateModelBadge();

      if (models.length === 0) {
        appendMessage('aria', `<strong>Ollama is running but no models are installed.</strong><br>
          Pull one in your terminal:<br>
          <code>ollama pull phi3:mini</code>  (2.2 GB, fast)<br>
          <code>ollama pull llama3:8b</code>  (4.7 GB, better quality)`, true);
      }
    } catch (_) {
      dot.className = 'status-dot offline';
      if (label) label.textContent = '🏠 Local · Ollama not running';
      appendMessage('aria', `⚠️ Ollama is not running. Start it with:<br>
        <code>./start.command</code>  (or double-click it in Finder)<br><br>
        Or switch to <strong>☁️ Claude</strong> mode above if you have an API key.<br>
        <a href="../ai-setup.html">→ Setup guide</a>`, true);
    }
  }

  function checkClaudeStatus() {
    const dot   = document.querySelector('.status-dot');
    const label = document.querySelector('.aria-status-label');
    if (!dot) return;

    const modelLabel = CLAUDE_MODELS.find(m => m.id === claudeModel)?.label || claudeModel;

    if (!claudeApiKey) {
      dot.className = 'status-dot checking'; /* amber-ish */
      if (label) label.textContent = '☁️ Claude · API key needed';
      appendMessage('aria', `To use Claude, enter your Anthropic API key in the toolbar above.<br><br>
        Get a key at <strong>console.anthropic.com</strong><br>
        Keys start with <code>sk-ant-</code><br><br>
        ⚠️ Your key is stored only in this browser's localStorage — it never leaves your device except when sent directly to Anthropic's API.`, true);
    } else {
      dot.className = 'status-dot online';
      if (label) label.textContent = `☁️ Claude · ${modelLabel.split('—')[0].trim()}`;
      updateModelBadge();
    }
  }

  function populateOllamaModels(models) {
    const sel = $('aria-model-select');
    if (!sel || !models.length) return;
    sel.innerHTML = models.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
  }

  function updateModelBadge() {
    const badge = $('aria-model-badge');
    if (!badge) return;
    if (currentProvider === PROVIDER_LOCAL) {
      badge.textContent = ollamaModel || '—';
    } else {
      badge.textContent = (CLAUDE_MODELS.find(m => m.id === claudeModel)?.label || claudeModel).split('—')[0].trim();
    }
  }

  /* ──────────────────────────────────────────
     INPUT HANDLERS
  ────────────────────────────────────────── */
  function setupInputHandlers() {
    const input   = $('aria-input');
    const sendBtn = $('aria-send');
    if (!input || !sendBtn) return;

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  }

  /* ──────────────────────────────────────────
     SEND MESSAGE
  ────────────────────────────────────────── */
  // Returns system prompt augmented with any relevant library context
  function buildSystemPrompt(userText) {
    const base = emergencyMode ? EMERGENCY_SYSTEM_PROMPT : SYSTEM_PROMPT;
    if (typeof Librarian === 'undefined') return base;
    const ctx = Librarian.getContext(userText);
    if (!ctx) return base;
    return base + '\n\n' + ctx;
  }

  function showLibraryBadge(userText) {
    if (typeof Librarian === 'undefined') return;
    const sources = Librarian.getSources ? Librarian.getSources(userText) : [];
    if (!sources.length) return;
    const badge = document.createElement('div');
    badge.className = 'aria-citation-badge';
    badge.style.cssText = 'font-size:0.68rem;color:#3498db;margin:0.2rem 0 0.5rem;padding-left:0.5rem;display:flex;flex-wrap:wrap;gap:0.3rem;align-items:center;';
    const chips = sources.map(s =>
      `<span style="background:rgba(52,152,219,0.12);border:1px solid rgba(52,152,219,0.3);border-radius:10px;padding:1px 7px;white-space:nowrap;">${escapeHtml(s.source)} · p.${s.page}</span>`
    ).join('');
    badge.innerHTML = '<span title="Bunker Bot is grounding its answer in these bundled sources">📚 Sources:</span>' + chips;
    const msgs = $('aria-messages');
    if (msgs) msgs.appendChild(badge);
  }

  async function sendMessage() {
    const input = $('aria-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || isStreaming) return;

    input.value = '';
    input.style.height = 'auto';

    appendMessage('user', escapeHtml(text));
    conversationHistory.push({ role: 'user', content: text });
    addTokens(text.length);
    showLibraryBadge(text);

    if (currentProvider === PROVIDER_CLAUDE) {
      if (!claudeApiKey) {
        appendMessage('aria', '⚠️ No API key set. Enter your Anthropic API key in the toolbar above.', true);
        return;
      }
      await streamClaude(text);
    } else {
      await streamOllama(text);
    }
  }

  /* ──────────────────────────────────────────
     STREAM — OLLAMA
  ────────────────────────────────────────── */
  async function streamOllama(userText) {
    isStreaming = true;
    abortController = new AbortController();
    setSendBtn('stop');

    const thinkingEl = appendThinking();
    try {
      const payload = {
        model: ollamaModel,
        messages: [
          { role: 'system', content: buildSystemPrompt(userText) },
          ...conversationHistory.slice(-12)
        ],
        stream: true,
        options: { temperature: currentTemperature, top_p: 0.9 }
      };

      const res = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      thinkingEl.remove();
      const msgEl    = appendMessage('aria', '');
      const contentEl = msgEl?.querySelector('.aria-message-content');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split('\n').filter(Boolean)) {
          try {
            const d = JSON.parse(line);
            if (d.message?.content) {
              full += d.message.content;
              if (contentEl) contentEl.innerHTML = formatMarkdown(full);
              scrollMessages();
            }
          } catch (_) {}
        }
      }

      conversationHistory.push({ role: 'assistant', content: full });
      addTokens(full.length);

    } catch (err) {
      thinkingEl?.remove();
      if (err.name !== 'AbortError') {
        appendMessage('aria', `⚠️ Ollama error: ${escapeHtml(err.message)}. <a href="../ai-setup.html">Setup guide →</a>`, true);
      } else {
        appendMessage('aria', '_[Response stopped]_', false);
      }
    } finally {
      isStreaming = false;
      setSendBtn('send');
    }
  }

  /* ──────────────────────────────────────────
     STREAM — CLAUDE API (SSE)
  ────────────────────────────────────────── */
  async function streamClaude(userText) {
    isStreaming = true;
    abortController = new AbortController();
    setSendBtn('stop');

    const thinkingEl = appendThinking();
    try {
      /* Claude API takes system separately, and messages must alternate user/assistant */
      const messages = conversationHistory.slice(-12).map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const payload = {
        model:      claudeModel,
        max_tokens: 1024,
        system:     buildSystemPrompt(userText),
        messages,
        stream: true,
        temperature: Math.min(currentTemperature, 1) /* Claude max temp is 1 */
      };

      const res = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'content-type':                           'application/json',
          'x-api-key':                               claudeApiKey,
          'anthropic-version':                       ANTHROPIC_VERSION,
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg     = errBody.error?.message || `HTTP ${res.status}`;
        if (res.status === 401) throw new Error('Invalid API key — check your key in the toolbar');
        if (res.status === 429) throw new Error('Rate limited — wait a moment and try again');
        if (res.status === 529) throw new Error('Claude API overloaded — try again in a moment');
        throw new Error(msg);
      }

      thinkingEl.remove();
      const msgEl    = appendMessage('aria', '');
      const contentEl = msgEl?.querySelector('.aria-message-content');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full   = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); /* keep incomplete line */

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]' || !raw) continue;
          try {
            const ev = JSON.parse(raw);
            /* Streaming text delta */
            if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
              full += ev.delta.text;
              if (contentEl) contentEl.innerHTML = formatMarkdown(full);
              scrollMessages();
            }
            /* Real token count from API */
            if (ev.type === 'message_delta' && ev.usage?.output_tokens) {
              setTokenCount(ev.usage.output_tokens);
            }
          } catch (_) {}
        }
      }

      conversationHistory.push({ role: 'assistant', content: full });

    } catch (err) {
      thinkingEl?.remove();
      if (err.name !== 'AbortError') {
        appendMessage('aria', `⚠️ ${escapeHtml(err.message)}`, true);
      } else {
        appendMessage('aria', '_[Response stopped]_', false);
      }
    } finally {
      isStreaming = false;
      setSendBtn('send');
    }
  }

  function setSendBtn(mode) {
    const btn = $('aria-send');
    if (!btn) return;
    if (mode === 'stop') {
      btn.textContent = '■ Stop';
      btn.onclick = () => { if (abortController) abortController.abort(); };
    } else {
      btn.textContent = 'Send';
      btn.onclick = sendMessage;
    }
  }

  /* ──────────────────────────────────────────
     TOKEN COUNTER
  ────────────────────────────────────────── */
  function addTokens(charCount) {
    tokenCount += Math.ceil(charCount / 4);
    renderTokenCount(tokenCount);
  }

  function setTokenCount(tokens) {
    tokenCount = tokens;
    renderTokenCount(tokenCount);
  }

  function renderTokenCount(n) {
    const label = n >= 1000 ? (n / 1000).toFixed(1) + 'k tok' : n + ' tok';
    const el1 = $('aria-token-count');
    const el2 = $('aria-token-count-claude');
    if (el1) el1.textContent = label;
    if (el2) el2.textContent = label;
  }

  /* ──────────────────────────────────────────
     EMERGENCY MODE
  ────────────────────────────────────────── */
  function toggleEmergencyMode() {
    emergencyMode = !emergencyMode;
    const btn = $('aria-emergency');
    if (btn) {
      btn.classList.toggle('emergency-on', emergencyMode);
      btn.textContent = emergencyMode ? '🚨 EMERGENCY ON' : '🚨 Emergency';
    }
    appendMessage('aria',
      emergencyMode
        ? '⛔ <strong>EMERGENCY MODE ON.</strong> Direct, step-by-step answers. Describe the situation.'
        : 'Emergency mode off — returning to standard responses.',
      true);
  }

  /* ──────────────────────────────────────────
     COPY / EXPORT
  ────────────────────────────────────────── */
  function copyLastResponse() {
    const msgs = document.querySelectorAll('#aria-messages .from-aria .aria-message-content');
    if (!msgs.length) return;
    const text = msgs[msgs.length - 1].innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('aria-copy-last');
      if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000); }
    }).catch(() => {});
  }

  function exportChat() {
    if (!conversationHistory.length) return;
    const provider = currentProvider === PROVIDER_CLAUDE
      ? `Claude API · ${claudeModel}`
      : `Ollama · ${ollamaModel}`;
    const lines = [
      'The Last Light Survival Guide — Bunker Bot Chat Export',
      `Exported: ${new Date().toLocaleString()}`,
      `Provider: ${provider}`,
      `Temperature: ${currentTemperature}`,
      '', '---', ''
    ];
    conversationHistory.forEach(m => {
      lines.push(m.role === 'user' ? 'You:' : 'Bunker Bot:');
      lines.push(m.content);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bunker-bot-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ──────────────────────────────────────────
     MESSAGES
  ────────────────────────────────────────── */
  function appendMessage(role, content, isHTML = false) {
    const container = $('aria-messages');
    if (!container) return null;
    const div = document.createElement('div');
    div.className = `aria-message from-${role === 'user' ? 'user' : 'aria'}`;
    const contentEl = document.createElement('div');
    contentEl.className = 'aria-message-content';
    contentEl.innerHTML = isHTML ? content : formatMarkdown(content);
    div.appendChild(contentEl);
    container.appendChild(div);
    scrollMessages();
    return div;
  }

  function appendThinking() {
    const container = $('aria-messages');
    const div = document.createElement('div');
    div.className = 'aria-message from-aria aria-thinking';
    div.innerHTML = '<span></span><span></span><span></span>';
    container?.appendChild(div);
    scrollMessages();
    return div;
  }

  function scrollMessages() {
    const c = $('aria-messages');
    if (c) c.scrollTop = c.scrollHeight;
  }

  /* ──────────────────────────────────────────
     MARKDOWN RENDERER
  ────────────────────────────────────────── */
  function formatMarkdown(text) {
    if (!text) return '';
    let h = text;
    h = h.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="lang-${lang}">${escapeHtml(code.trim())}</code></pre>`);
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_self">$1</a>');
    h = h.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    h = h.replace(/^## (.+)$/gm,  '<h3>$1</h3>');
    h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => `<ol>${m}</ol>`);
    h = h.replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => m.startsWith('<ol>') ? m : `<ul>${m}</ul>`);
    h = h.replace(/\n\n+/g, '</p><p>');
    h = `<p>${h}</p>`;
    h = h.replace(/\n/g, '<br>');
    h = h.replace(/⚠️ Warning: (.+)/g, '<span style="color:var(--red,#c0392b)">⚠️ <strong>Warning:</strong> $1</span>');
    h = h.replace(/⛔ (.+)/g,          '<span style="color:var(--red,#c0392b);font-weight:700">⛔ $1</span>');
    return h;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ──────────────────────────────────────────
     PREFERENCES
  ────────────────────────────────────────── */
  function loadPreferences() {
    try {
      const provider = localStorage.getItem('aria-provider');
      if (provider === PROVIDER_CLAUDE || provider === PROVIDER_LOCAL) {
        currentProvider = provider;
      }

      const om = localStorage.getItem('aria-ollama-model');
      if (om) ollamaModel = om;

      const cm = localStorage.getItem('aria-claude-model');
      if (cm && CLAUDE_MODELS.some(m => m.id === cm)) claudeModel = cm;

      const t = localStorage.getItem('aria-temperature');
      if (t) {
        currentTemperature = parseFloat(t);
        const slider = $('aria-temp-slider');
        const val    = $('aria-temp-value');
        if (slider) slider.value = currentTemperature;
        if (val)    val.textContent = currentTemperature.toFixed(2);
      }

      loadApiKey();

      /* Apply provider UI state */
      if (currentProvider === PROVIDER_CLAUDE) {
        $('aria-provider-local') ?.classList.remove('active');
        $('aria-provider-claude')?.classList.add('active');
        const rowO = $('aria-row-ollama-model');
        const rowC = $('aria-row-claude-model');
        const rowK = $('aria-row-apikey');
        if (rowO) rowO.style.display = 'none';
        if (rowC) rowC.style.display = '';
        if (rowK) rowK.style.display = '';
        if (claudeApiKey) {
          const inp = $('aria-claude-key');
          if (inp) inp.value = claudeApiKey;
        }
      }

      /* Restore Claude model selector */
      const cmSel = $('aria-claude-model-select');
      if (cmSel) cmSel.value = claudeModel;

    } catch (_) {}
  }

  /* ──────────────────────────────────────────
     GLOBAL CLEAR
  ────────────────────────────────────────── */
  window.ariaClear = function () {
    conversationHistory = [];
    tokenCount = 0;
    renderTokenCount(0);
    const container = $('aria-messages');
    if (!container) return;
    container.innerHTML = `
      <div class="aria-message aria-welcome">
        <p>Conversation cleared. How can I help?</p>
      </div>`;
  };

})();
