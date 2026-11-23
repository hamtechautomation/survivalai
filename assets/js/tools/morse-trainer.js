/* BunkerBot Morse Trainer: <div data-bb-tool="morse"></div>. Works fully offline. No dependencies. */
(function () {
  'use strict';
  var CODE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
    N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', '=': '-...-' };
  var DECODE = {}; Object.keys(CODE).forEach(function (k) { DECODE[CODE[k]] = k; });
  // Koch order (LCWO)
  var KOCH = 'KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X'.split('');
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('bbMorse.' + k)); localStorage.setItem('bbMorse.' + k, JSON.stringify(v)); } catch (e) { return null; } }
  function pretty(c) { return c.replace(/\./g, '·').replace(/-/g, '−'); }
  function spoken(c) { return c.split('').map(function (x) { return x === '.' ? 'dot' : 'dash'; }).join(' '); }

  function Audio(state) {
    var ctx = null, osc = null, gain = null;
    this.ensure = function () {
      if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
      if (ctx.state === 'suspended') ctx.resume(); return ctx;
    };
    this.on = function () { if (!state.sound || !this.ensure()) return; this.off(); osc = ctx.createOscillator(); gain = ctx.createGain(); osc.frequency.value = state.tone; gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005); osc.connect(gain).connect(ctx.destination); osc.start(); };
    this.off = function () { if (osc && ctx) { try { gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.005); osc.stop(ctx.currentTime + 0.01); } catch (e) {} } osc = null; };
  }

  function mount(root) {
    if (root.__bb) return; root.__bb = 1;
    root.classList.add('bb-tool', 'bb-morse');
    var state = { wpm: store('wpm') || 15, fwpm: store('fwpm') || 8, tone: store('tone') || 650, sound: true, light: true, level: store('level') || 2, mode: 'translate' };
    var audio = new Audio(state), playing = 0;
    root.innerHTML =
      '<h3>Morse Trainer</h3><p class="bb-sub">Translate, practise sending with a tap key, learn by ear with the Koch method, or flash SOS with your screen. Works offline.</p>' +
      '<div class="bb-tabs" role="tablist">' + ['translate:Translate & play', 'key:Tap key', 'learn:Learn by ear', 'sos:SOS light', 'chart:Chart'].map(function (t) { var p = t.split(':'); return '<button role="tab" data-m="' + p[0] + '">' + p[1] + '</button>'; }).join('') + '</div>' +
      '<div class="bb-mo-body"></div>' +
      '<details class="bb-noprint" style="margin-top:12px"><summary class="bb-lbl" style="cursor:pointer">Speed & sound settings</summary><div class="bb-row">' +
      '<div class="bb-field"><label>Character speed: <b class="v-wpm"></b> wpm</label><input type="range" min="5" max="35" class="s-wpm"></div>' +
      '<div class="bb-field"><label>Effective (Farnsworth) speed: <b class="v-fwpm"></b> wpm</label><input type="range" min="3" max="35" class="s-fwpm"></div>' +
      '<div class="bb-field"><label>Tone: <b class="v-tone"></b> Hz</label><input type="range" min="400" max="1000" step="10" class="s-tone"></div>' +
      '<div class="bb-field" style="flex-direction:row;align-items:center;gap:14px"><label><input type="checkbox" class="c-snd" checked> Sound</label><label><input type="checkbox" class="c-lt" checked> Light</label></div>' +
      '</div></details>';
    var body = root.querySelector('.bb-mo-body');
    function q(s) { return root.querySelector(s); }
    function bindSettings() {
      [['wpm', 'wpm'], ['fwpm', 'fwpm'], ['tone', 'tone']].forEach(function (a) {
        var s = q('.s-' + a[0]), v = q('.v-' + a[0]); s.value = state[a[1]]; v.textContent = state[a[1]];
        s.addEventListener('input', function () { state[a[1]] = +s.value; if (a[0] === 'wpm' && state.fwpm > state.wpm) { state.fwpm = state.wpm; q('.s-fwpm').value = state.fwpm; q('.v-fwpm').textContent = state.fwpm; } if (a[0] === 'fwpm' && state.fwpm > state.wpm) { state.fwpm = state.wpm; s.value = state.wpm; } v.textContent = state[a[1]]; store(a[1], state[a[1]]); });
      });
      q('.c-snd').addEventListener('change', function (e) { state.sound = e.target.checked; });
      q('.c-lt').addEventListener('change', function (e) { state.light = e.target.checked; });
    }
    bindSettings();
    // timing (PARIS standard), Farnsworth extends gaps between characters and words
    function T() { var u = 1200 / state.wpm; var fu = state.fwpm < state.wpm ? ((60 / state.fwpm) - (31 * u / 1000)) * 1000 / 19 : u; return { u: u, cg: 3 * fu, wg: 7 * fu }; }
    function seq(text) { // returns [[on,ms],...]
      var t = T(), out = []; var words = text.toUpperCase().trim().split(/\s+/);
      words.forEach(function (w, wi) {
        var chars = w === 'SOS' ? ['SOS'] : w.split('');
        chars.forEach(function (ch, ci) {
          var c = ch === 'SOS' ? '...---...' : CODE[ch]; if (!c) return;
          c.split('').forEach(function (s, si) { out.push([1, s === '.' ? t.u : 3 * t.u]); if (si < c.length - 1) out.push([0, t.u]); });
          if (ci < chars.length - 1) out.push([0, t.cg]);
        });
        if (wi < words.length - 1) out.push([0, t.wg]);
      });
      return out;
    }
    function play(text, lamp, done) {
      stop(); var s = seq(text), i = 0, id = ++playing;
      (function step() {
        if (id !== playing) return;
        if (i >= s.length) { setLamp(lamp, 0); audio.off(); if (done) done(); return; }
        var e = s[i++]; setLamp(lamp, e[0]); if (e[0]) audio.on(); else audio.off();
        setTimeout(step, e[1]);
      })();
    }
    function stop() { playing++; audio.off(); root.querySelectorAll('.bb-lamp').forEach(function (l) { setLamp(l, 0); }); }
    function setLamp(l, on) { if (!l) return; l.classList.toggle('lit', !!on && state.light); }

    var modes = {
      translate: function () {
        body.innerHTML = '<div class="bb-row"><div class="bb-field" style="flex:3 1 260px"><label for="mo-in">Text to send</label><input id="mo-in" type="text" value="SOS" maxlength="120" autocomplete="off"></div>' +
          '<div class="bb-lamp" aria-hidden="true"></div></div>' +
          '<div class="bb-card bb-mo-out" aria-live="polite"></div><div class="bb-actions"><button class="bb-primary b-play">▶ Play</button><button class="b-stop">■ Stop</button><button class="b-loop">🔁 Repeat until stopped</button></div>';
        var inp = body.querySelector('input'), out = body.querySelector('.bb-mo-out'), lamp = body.querySelector('.bb-lamp');
        function render() { var w = inp.value.toUpperCase().split(/\s+/).filter(Boolean); out.innerHTML = w.map(function (word) { return word === 'SOS' ? '<span class="bb-mo-w"><b>SOS</b> <code aria-label="' + spoken('...---...') + '">' + pretty('...---...') + '</code></span>' : '<span class="bb-mo-w">' + word.split('').map(function (c) { return CODE[c] ? '<span class="bb-mo-c"><b>' + c + '</b><code aria-label="' + spoken(CODE[c]) + '">' + pretty(CODE[c]) + '</code></span>' : ''; }).join('') + '</span>'; }).join('<span class="bb-mo-sep">/</span>') || '<span class="bb-lbl">Type something…</span>'; }
        inp.addEventListener('input', render); render();
        body.querySelector('.b-play').onclick = function () { play(inp.value, lamp); };
        body.querySelector('.b-stop').onclick = stop;
        body.querySelector('.b-loop').onclick = function () { var txt = inp.value; (function again() { play(txt, lamp, function () { setTimeout(function () { if (lamp.isConnected) again(); }, T().wg); }); })(); };
      },
      key: function () {
        body.innerHTML = '<p class="bb-note" style="margin-top:0">Press and hold the key (or the <kbd>Space</kbd> bar while the key has focus). Short = dot, long = dash. Pause to end a letter. Target speed: <b class="k-w"></b> wpm.</p>' +
          '<div class="bb-row" style="align-items:center"><button class="bb-key" aria-label="Morse key: press and hold">KEY</button><div class="bb-lamp" aria-hidden="true"></div></div>' +
          '<div class="bb-card"><div class="bb-lbl">Current letter</div><div class="k-cur bb-mo-big">&nbsp;</div><div class="bb-lbl">Decoded</div><div class="k-txt bb-mo-big" aria-live="polite"></div></div>' +
          '<div class="bb-actions"><button class="k-clr">Clear</button><button class="k-test">Challenge: send “SOS”</button></div><div class="k-msg"></div>';
        body.querySelector('.k-w').textContent = state.wpm;
        var key = body.querySelector('.bb-key'), lamp = body.querySelector('.bb-lamp'), cur = '', txt = '', t0 = 0, tUp = 0, timer = null, wTimer = null, goal = null;
        var curEl = body.querySelector('.k-cur'), txtEl = body.querySelector('.k-txt'), msg = body.querySelector('.k-msg');
        function down(e) { if (e) e.preventDefault(); if (t0) return; clearTimeout(timer); clearTimeout(wTimer); t0 = performance.now(); audio.on(); setLamp(lamp, 1); key.classList.add('on'); }
        function up(e) { if (e) e.preventDefault(); if (!t0) return; var d = performance.now() - t0; t0 = 0; audio.off(); setLamp(lamp, 0); key.classList.remove('on');
          var u = 1200 / state.wpm; cur += d < 2 * u ? '.' : '-'; curEl.textContent = pretty(cur);
          timer = setTimeout(endChar, 2.5 * u); wTimer = setTimeout(function () { if (txt && txt.slice(-1) !== ' ') { txt += ' '; show(); } }, 6 * u); }
        function endChar() { if (!cur) return; txt += (cur === '...---...' ? 'SOS' : (DECODE[cur] || '�')); cur = ''; curEl.innerHTML = '&nbsp;'; show(); }
        function show() { txtEl.textContent = txt; if (goal && txt.replace(/\s/g, '').indexOf(goal) >= 0) { msg.innerHTML = '<div class="bb-ok">✓ Clean “' + goal + '”. Well sent.</div>'; goal = null; } }
        key.addEventListener('pointerdown', down); key.addEventListener('pointerup', up); key.addEventListener('pointerleave', up); key.addEventListener('pointercancel', up);
        key.addEventListener('keydown', function (e) { if (e.code === 'Space' || e.key === ' ') { if (!e.repeat) down(e); else e.preventDefault(); } });
        key.addEventListener('keyup', function (e) { if (e.code === 'Space' || e.key === ' ') up(e); });
        body.querySelector('.k-clr').onclick = function () { txt = ''; cur = ''; show(); curEl.innerHTML = '&nbsp;'; msg.innerHTML = ''; };
        body.querySelector('.k-test').onclick = function () { txt = ''; show(); goal = 'SOS'; msg.innerHTML = '<div class="bb-note">Send · · · − − − · · · as one unbroken signal (or S O S as three letters).</div>'; key.focus(); };
      },
      learn: function () {
        body.innerHTML = '<p class="bb-note" style="margin-top:0">Koch method: listen to a character, type what you heard. Reach <b>90%</b> over 20 tries to unlock the next letter. Learn by sound, not by looking at the chart.</p>' +
          '<div class="bb-grid"><div class="bb-stat"><b class="l-lv"></b><span>Letters unlocked</span></div><div class="bb-stat"><b class="l-acc">–</b><span>Accuracy (last 20)</span></div><div class="bb-stat"><b class="l-set" style="font-size:16px;word-break:break-all"></b><span>Your letters</span></div></div>' +
          '<div class="bb-card" style="margin-top:10px;text-align:center"><div class="bb-lbl">Press Play, then type the character you heard</div><div class="l-fb bb-mo-big" aria-live="polite">&nbsp;</div>' +
          '<input type="text" class="l-in" maxlength="1" autocomplete="off" autocapitalize="characters" aria-label="Your answer" style="max-width:90px;text-align:center;font-size:24px;margin:6px auto;display:block"></div>' +
          '<div class="bb-actions"><button class="bb-primary l-play">▶ Play next</button><button class="l-rep">↺ Repeat</button><button class="l-reset">Reset progress</button></div>';
        var hist = store('hist') || [], cur = null, lv = Math.max(2, state.level);
        var fb = body.querySelector('.l-fb'), inp = body.querySelector('.l-in');
        function set() { return KOCH.slice(0, lv); }
        function stats() { var h = hist.slice(-20); var acc = h.length ? Math.round(100 * h.filter(Boolean).length / h.length) : null;
          body.querySelector('.l-lv').textContent = lv + ' / ' + KOCH.length; body.querySelector('.l-acc').textContent = acc == null ? '–' : acc + '%'; body.querySelector('.l-set').textContent = set().join(' ');
          if (h.length >= 20 && acc >= 90 && lv < KOCH.length) { lv++; state.level = lv; store('level', lv); hist = []; store('hist', hist); fb.innerHTML = '🎉 New letter unlocked: <b>' + KOCH[lv - 1] + '</b> <code>' + pretty(CODE[KOCH[lv - 1]]) + '</code>'; setTimeout(function () { play(KOCH[lv - 1]); }, 600); stats(); } }
        function next() { var s = set(); var pool = s.concat([s[s.length - 1], s[s.length - 1]]); cur = pool[Math.floor(Math.random() * pool.length)]; fb.innerHTML = '…'; inp.value = ''; inp.focus(); play(cur); }
        inp.addEventListener('input', function () { if (!cur || !inp.value) return; var a = inp.value.toUpperCase(), ok = a === cur; hist.push(ok); store('hist', hist.slice(-40));
          fb.innerHTML = (ok ? '✓ ' : '✗ ') + '<b>' + cur + '</b> <code>' + pretty(CODE[cur]) + '</code>' + (ok ? '' : ' (you typed ' + a.replace(/</g, '') + ')'); cur = null; stats(); setTimeout(next, ok ? 700 : 1600); });
        body.querySelector('.l-play').onclick = next; body.querySelector('.l-rep').onclick = function () { if (cur) play(cur); };
        body.querySelector('.l-reset').onclick = function () { lv = 2; state.level = 2; hist = []; store('level', 2); store('hist', []); stats(); fb.innerHTML = '&nbsp;'; };
        stats();
      },
      sos: function () {
        body.innerHTML = '<p class="bb-note" style="margin-top:0">Turns your screen into a signalling lamp sending SOS at a slow, readable speed. Turn screen brightness to maximum and point it toward rescuers. <b>Photosensitivity warning:</b> the screen flashes.</p>' +
          '<div class="bb-actions"><button class="bb-primary s-go">Start full-screen SOS</button><button class="s-six">Six-flash mountain distress signal</button></div>';
        function lampMode(pattern, label) {
          var ov = document.createElement('div'); ov.className = 'bb-mo-full'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', label + ' signal. Tap to stop.');
          ov.innerHTML = '<div class="bb-mo-full-lbl">' + label + ' · tap anywhere to stop</div>'; document.body.appendChild(ov);
          var alive = true, wake = null; try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (w) { wake = w; }, function () {}); } catch (e) {}
          if (ov.requestFullscreen) ov.requestFullscreen().catch(function () {});
          function end() { alive = false; audio.off(); ov.remove(); try { if (document.fullscreenElement) document.exitFullscreen(); if (wake) wake.release(); } catch (e) {} }
          ov.addEventListener('click', end); document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { end(); document.removeEventListener('keydown', esc); } });
          var i = 0; (function step() { if (!alive) return; var e = pattern[i % pattern.length]; i++; ov.classList.toggle('lit', !!e[0]); setTimeout(step, e[1]); })();
        }
        body.querySelector('.s-go').onclick = function () { var u = 400; var p = seq('SOS').map(function (e) { return [e[0], e[1] / (1200 / state.wpm) * u]; }); p.push([0, 7 * u]); lampMode(p, 'SOS'); };
        body.querySelector('.s-six').onclick = function () { var p = []; for (var k = 0; k < 6; k++) { p.push([1, 2000]); p.push([0, 8000]); } p[p.length - 1][1] = 60000 + 8000; lampMode(p, 'Six flashes a minute, then one minute pause'); };
      },
      chart: function () {
        var keys = Object.keys(CODE);
        body.innerHTML = '<p class="bb-note" style="margin-top:0">Tap a character to hear it. Timing: dot = 1 unit · dash = 3 · gap within a letter = 1 · between letters = 3 · between words = 7.</p><div class="bb-mo-chart">' +
          keys.map(function (k) { return '<button class="bb-mo-cell" data-k="' + k + '" aria-label="' + k + ': ' + spoken(CODE[k]) + '"><b>' + k + '</b><code>' + pretty(CODE[k]) + '</code></button>'; }).join('') + '</div>';
        body.querySelectorAll('.bb-mo-cell').forEach(function (b) { b.onclick = function () { play(b.getAttribute('data-k')); }; });
      }
    };
    root.querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-m')); }); });
    function setMode(m) { stop(); state.mode = m; root.querySelectorAll('[data-m]').forEach(function (b) { var on = b.getAttribute('data-m') === m; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); modes[m](); }
    setMode('translate');
    if (!document.getElementById('bb-morse-css')) {
      var st = document.createElement('style'); st.id = 'bb-morse-css';
      st.textContent = '.bb-morse code{font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;color:var(--bb-accent)}' +
        '.bb-lamp{width:54px;height:54px;border-radius:50%;background:#2a2f2c;border:3px solid #444;flex:0 0 auto;transition:background .02s,box-shadow .02s}' +
        '.bb-lamp.lit{background:#fff6c8;box-shadow:0 0 30px 10px rgba(255,230,140,.75);border-color:#ffe9a0}' +
        '.bb-mo-out{font-size:15px;display:flex;flex-wrap:wrap;gap:8px 4px;align-items:center;min-height:56px}.bb-mo-w{display:inline-flex;gap:8px;flex-wrap:wrap}.bb-mo-c{display:inline-flex;flex-direction:column;align-items:center;min-width:30px}.bb-mo-c code{font-size:13px}.bb-mo-sep{color:var(--bb-mute);margin:0 6px}' +
        '.bb-key{width:150px;height:150px;border-radius:50% !important;font-size:20px !important;font-weight:700;letter-spacing:.1em;user-select:none;touch-action:none;-webkit-user-select:none}.bb-key.on{background:var(--bb-accent) !important;color:#111 !important}' +
        '.bb-mo-big{font-size:26px;min-height:38px;font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;word-break:break-all}' +
        '.bb-mo-chart{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:6px}.bb-mo-cell{display:flex !important;flex-direction:column;align-items:center;gap:2px;padding:8px 4px !important}.bb-mo-cell b{font-size:18px}' +
        '.bb-mo-full{position:fixed;inset:0;z-index:99999;background:#000;cursor:pointer}.bb-mo-full.lit{background:#fff}.bb-mo-full-lbl{position:absolute;left:0;right:0;bottom:16px;text-align:center;color:#777;font:14px system-ui;mix-blend-mode:difference}';
      document.head.appendChild(st);
    }
  }
  function init() { document.querySelectorAll('[data-bb-tool="morse"]').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.BBMorse = { mount: mount, code: CODE };
})();

/* a11y: link each .bb-field <label> to its control so screen readers announce it (shared, idempotent) */
(function () {
  if (window.bbLabelFix) return;
  var n = 0;
  window.bbLabelFix = function (root) {
    (root || document).querySelectorAll('.bb-tool .bb-field').forEach(function (f) {
      var l = f.querySelector('label'), c = f.querySelector('input,select,textarea');
      if (!l || !c || l.htmlFor || l.contains(c)) return;
      if (!c.id) c.id = 'bbf-' + (++n);
      l.htmlFor = c.id;
    });
  };
  function go() {
    window.bbLabelFix();
    if (window.MutationObserver) new MutationObserver(function () { window.bbLabelFix(); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
