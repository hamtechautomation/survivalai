/* Media viewers for the rendered scenes (assets/media/), loaded by app.js only on pages that have them.
     <figure class="mv" data-mv="anim-x" data-steps="[[from,to,'label'],…]">  step-through animation
     <figure class="mv-compare" data-labels="Before|After">                  drag to compare two renders
     <figure class="mv-turn" data-sprite="…-sprite.webp">                     drag to turn a 36-frame turntable
     <div class="bbt" data-bb-tool="morse|season-wheel|solar">                the pack's offline tools
     <div class="bb-map" data-region="yorkshire" [data-hub]>                  region maps (Leaflet)
   Videos only load when scrolled near, play once (never with reduced motion) and pause off-screen. */
(function () {
  'use strict';
  const BASE = /\/(sections|pdfs)\//.test(location.pathname) ? '../' : '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const seen = new IntersectionObserver(es => es.forEach(e => { if (e.target._vis) e.target._vis(e.isIntersecting); }), { rootMargin: '200px 0px' });

  /* ── Step-through animation ── */
  function stepper(fig) {
    const v = fig.querySelector('video');
    let steps = [];
    try { steps = JSON.parse(fig.dataset.steps || '[]'); } catch (e) {}
    const ctrl = document.createElement('div');
    ctrl.className = 'mv-ctrl no-print';
    ctrl.innerHTML = '<button type="button" class="mv-btn" data-a="prev" aria-label="Previous step">◀</button>' +
      '<button type="button" class="mv-btn mv-play" data-a="play" aria-label="Play">▶</button>' +
      '<button type="button" class="mv-btn" data-a="next" aria-label="Next step">▶|</button>' +
      '<input type="range" min="0" max="1000" value="0" class="mv-range" aria-label="Scrub through the animation">';
    const chips = document.createElement('div');
    chips.className = 'mv-steps no-print';
    chips.innerHTML = steps.map((s, i) => `<button type="button" class="mv-chip" data-i="${i}">${i + 1}. ${esc(s[2])}</button>`).join('');
    const cap = document.createElement('p');
    cap.className = 'mv-cap';
    cap.setAttribute('aria-live', 'polite');
    fig.querySelector('.mv-frame').after(ctrl, chips, cap);
    const rg = ctrl.querySelector('.mv-range'), play = ctrl.querySelector('.mv-play');
    let cur = -1, started = false;
    const dur = () => v.duration || 1;
    function update() {
      const f = v.currentTime / dur();
      rg.value = Math.round(f * 1000);
      let i = steps.findIndex(s => f >= s[0] - 1e-3 && f < s[1]);
      if (i < 0) i = steps.length - 1;
      if (i !== cur && steps[i]) {
        cur = i;
        chips.querySelectorAll('.mv-chip').forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
        cap.innerHTML = `<b>Step ${i + 1} of ${steps.length}</b> · ${esc(steps[i][2])}`;
        const chip = chips.children[i];
        if (chip && chips.scrollWidth > chips.clientWidth) chips.scrollTo({ left: chip.offsetLeft - chips.clientWidth / 2 + chip.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    function setPlay(on) { play.textContent = on ? '❚❚' : '▶'; play.setAttribute('aria-label', on ? 'Pause' : 'Play'); }
    function load() { if (!started) { started = true; v.preload = 'auto'; v.load(); } }
    function seek(f) { load(); const go = () => { v.currentTime = Math.min(dur() - 0.02, Math.max(0, f * dur())); update(); }; v.readyState >= 1 ? go() : v.addEventListener('loadedmetadata', go, { once: true }); }
    function goStep(i) { v.pause(); setPlay(false); const s = steps[Math.max(0, Math.min(steps.length - 1, i))]; if (s) seek((s[0] + Math.min(s[1], 1)) / 2); }
    function toggle() {
      load();
      if (v.paused) { if (v.ended || v.currentTime / dur() > 0.99) v.currentTime = 0; v.play().catch(() => {}); setPlay(true); }
      else { v.pause(); setPlay(false); }
    }
    v.addEventListener('timeupdate', update);
    v.addEventListener('seeked', update);
    v.addEventListener('ended', () => setPlay(false));
    rg.addEventListener('input', () => { v.pause(); setPlay(false); seek(rg.value / 1000); });
    ctrl.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'play') toggle(); else goStep(cur + (a.dataset.a === 'next' ? 1 : -1));
    });
    chips.addEventListener('click', e => { const b = e.target.closest('.mv-chip'); if (b) goStep(+b.dataset.i); });
    v.addEventListener('click', toggle);
    if (steps[0]) cap.innerHTML = `<b>Step 1 of ${steps.length}</b> · ${esc(steps[0][2])}`;
    /* Plays once by itself the first time it comes into view; pauses when scrolled away. */
    let autoplayed = false;
    fig._vis = on => {
      if (on && !autoplayed && !reduce) { autoplayed = true; load(); v.play().then(() => setPlay(true)).catch(() => {}); }
      if (!on && !v.paused) { v.pause(); setPlay(false); }
    };
    seen.observe(fig);
  }

  /* ── Before / after ── */
  function compare(fig) {
    const wrap = fig.querySelector('.cmp'), after = wrap.querySelector('.cmp-after');
    const lab = (fig.dataset.labels || 'Before|After').split('|');
    wrap.insertAdjacentHTML('beforeend', '<div class="cmp-line" aria-hidden="true"><span>⇔</span></div>' +
      `<span class="cmp-l cmp-l0">${esc(lab[0])}</span><span class="cmp-l cmp-l1">${esc(lab[1])}</span>` +
      `<input type="range" min="0" max="100" value="50" class="cmp-range" aria-label="Drag to compare ${esc(lab[0])} and ${esc(lab[1])}">`);
    const line = wrap.querySelector('.cmp-line'), rg = wrap.querySelector('.cmp-range');
    const set = p => { p = Math.max(0, Math.min(100, p)); after.style.clipPath = `inset(0 0 0 ${p}%)`; line.style.left = p + '%'; rg.value = p; };
    rg.addEventListener('input', () => set(+rg.value));
    let drag = false;
    const move = e => { const r = wrap.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    wrap.addEventListener('pointerdown', e => { drag = true; wrap.setPointerCapture(e.pointerId); move(e); });
    wrap.addEventListener('pointermove', e => { if (drag) move(e); });
    wrap.addEventListener('pointerup', () => { drag = false; });
    set(50);
  }

  /* ── Turntable: 36 frames in a 6-column sprite ── */
  function turntable(fig) {
    const poster = fig.querySelector('img'), n = 36, cols = 6, label = fig.dataset.label || '3D view';
    const box = document.createElement('div');
    box.className = 'turn-box';
    box.tabIndex = 0;
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `${label}: drag or use the arrow keys to turn it`);
    poster.replaceWith(box);
    box.append(poster);
    box.insertAdjacentHTML('beforeend', '<span class="turn-hint">⟲ Drag to turn</span>');
    const ctrl = document.createElement('div');
    ctrl.className = 'mv-ctrl no-print';
    ctrl.innerHTML = '<button type="button" class="mv-btn" data-d="-3" aria-label="Turn left">⟲</button><button type="button" class="mv-btn mv-spin" aria-label="Spin">▶ Spin</button><button type="button" class="mv-btn" data-d="3" aria-label="Turn right">⟳</button>';
    box.after(ctrl);
    let cv = null, ctx, img = null, fw = 0, fh = 0, f = 0, spin = null;
    function ensure() {
      if (img) return;
      img = new Image();
      img.onload = () => {
        fw = img.naturalWidth / cols; fh = img.naturalHeight / Math.ceil(n / cols);
        cv = document.createElement('canvas'); cv.width = fw; cv.height = fh; ctx = cv.getContext('2d');
        poster.replaceWith(cv); draw();
      };
      img.src = fig.dataset.sprite;
    }
    function draw() { if (!cv) return; const i = ((Math.round(f) % n) + n) % n; ctx.drawImage(img, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh, 0, 0, fw, fh); }
    const spinBtn = ctrl.querySelector('.mv-spin');
    function stop() { if (spin) { clearInterval(spin); spin = null; spinBtn.textContent = '▶ Spin'; } }
    spinBtn.addEventListener('click', () => { ensure(); if (spin) return stop(); spinBtn.textContent = '❚❚ Stop'; spin = setInterval(() => { f += 1; draw(); }, 90); });
    ctrl.addEventListener('click', e => { const d = e.target.closest('[data-d]'); if (d) { ensure(); stop(); f += +d.dataset.d; draw(); } });
    let x0 = null, f0 = 0;
    box.addEventListener('pointerdown', e => { ensure(); stop(); x0 = e.clientX; f0 = f; box.setPointerCapture(e.pointerId); box.classList.add('grab'); });
    box.addEventListener('pointermove', e => { if (x0 === null) return; f = f0 - (e.clientX - x0) / box.clientWidth * n * 1.2; draw(); });
    box.addEventListener('pointerup', () => { x0 = null; box.classList.remove('grab'); });
    box.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { ensure(); stop(); f += e.key === 'ArrowLeft' ? -1 : 1; draw(); e.preventDefault(); } });
    fig._vis = on => { if (on) ensure(); else stop(); };
    seen.observe(fig);
  }

  /* ── The pack's offline tools ── */
  const TOOLS = { morse: 'morse-trainer.js', 'season-wheel': 'season-wheel.js', solar: 'solar-sizer.js' };
  function css(href) {
    if (document.querySelector(`link[href$="${href}"]`)) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + href; document.head.appendChild(l);
  }
  function script(src) {
    return new Promise((ok, no) => {
      if (document.querySelector(`script[src$="${src}"]`)) return ok();
      const s = document.createElement('script'); s.src = BASE + src; s.onload = ok; s.onerror = no; document.body.appendChild(s);
    });
  }
  function tools() {
    const want = new Set([...document.querySelectorAll('.bbt[data-bb-tool]')].map(el => el.dataset.bbTool).filter(t => TOOLS[t]));
    if (!want.size) return;
    css('assets/css/bb-tools.css');
    want.forEach(t => script('assets/js/tools/' + TOOLS[t]).catch(() => {}));
  }

  /* ── Region maps: the written guide is the offline part; the map needs Leaflet, its data, and tiles ── */
  function maps() {
    const els = [...document.querySelectorAll('.bb-map[data-region]')];
    if (!els.length) return;
    css('assets/vendor/maps/leaflet.css');
    css('assets/regions/region-map.css');
    script('assets/vendor/maps/leaflet.js')
      .then(() => script('assets/regions/region-map.js'))
      .then(() => Promise.all(els.map(el => script(`assets/regions/data/${el.dataset.region}.js`))))
      .then(() => els.forEach(el => {
        const data = (window.BB_REGION_DATA || {})[el.dataset.region];
        if (!data || !window.BunkerRegionMap) return;
        if (el.hasAttribute('data-hub')) window.BunkerRegionMap.mountHub(el, { data, base: '' });
        else window.BunkerRegionMap.mount(el, { data });
      }))
      .catch(() => { els.forEach(el => { el.innerHTML = '<p class="mv-note">The map couldn’t load. The written guide below works without it.</p>'; }); });
  }

  document.querySelectorAll('figure.mv[data-mv]').forEach(stepper);
  document.querySelectorAll('figure.mv-compare').forEach(compare);
  document.querySelectorAll('figure.mv-turn').forEach(turntable);
  tools();
  maps();
})();
