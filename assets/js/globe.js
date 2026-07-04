/* The Last Light — cinematic + draggable night-Earth globe.
   Usage: LastLightGlobe('#el', { mode:'loop' | 'intro-drag', base:'assets/globe/' }) */
(function () {
  var CSS = `
  .llg{position:relative;width:100%;max-width:340px;aspect-ratio:1/1;margin:0 auto;overflow:visible;
    touch-action:pan-y;user-select:none;-webkit-user-select:none}
  .llg.drag{cursor:grab}.llg.drag.dragging{cursor:grabbing}
  .llg img{position:absolute;inset:0;width:100%;height:100%;display:block;-webkit-user-drag:none;pointer-events:none}
  .llg .llg-dark,.llg .llg-relit{opacity:0}
  .llg .llg-flash{position:absolute;inset:-10%;border-radius:50%;pointer-events:none;opacity:0;mix-blend-mode:screen}
  .llg .llg-shock{position:absolute;border:2px solid rgba(230,240,255,.9);border-radius:50%;
    transform:translate(-50%,-50%) scale(0);opacity:0;pointer-events:none;width:40px;height:40px}
  .llg .llg-missile{position:absolute;width:2px;height:26px;border-radius:2px;pointer-events:none;opacity:0;
    background:linear-gradient(180deg,rgba(255,255,255,0),#eef4ff);
    box-shadow:0 0 6px #cfe4ff;transform-origin:center}
  .llg .llg-last{position:absolute;width:8px;height:8px;border-radius:50%;pointer-events:none;opacity:0;
    transform:translate(-50%,-50%);background:radial-gradient(circle,#fff 0%,#ffe6a0 45%,rgba(255,220,140,0) 72%);
    box-shadow:0 0 10px 4px rgba(255,220,140,.8)}
  .llg .llg-cap{position:absolute;left:0;right:0;bottom:-26px;text-align:center;font-family:ui-monospace,monospace;
    font-size:.72rem;color:#4d6048;opacity:0;transition:opacity .6s}
  .llg.shake{animation:llg-shake .5s ease}
  @keyframes llg-shake{0%,100%{transform:translate(0,0)}20%{transform:translate(-3px,2px)}40%{transform:translate(3px,-2px)}
    60%{transform:translate(-2px,-1px)}80%{transform:translate(2px,1px)}}
  @keyframes llg-pulse{0%,100%{opacity:.85;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.25)}}
  @media(prefers-reduced-motion:reduce){.llg *{animation:none!important}}
  `;
  var injected = false;
  function inject() { if (injected) return; injected = true;
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  window.LastLightGlobe = function (sel, opts) {
    opts = opts || {};
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    inject();
    var base = opts.base || 'assets/globe/';
    var N = 48, K = opts.impactFrame != null ? opts.impactFrame : 0;   // frame where the UK faces us
    var lx = opts.lastLight ? opts.lastLight[0] : 0.489, ly = opts.lastLight ? opts.lastLight[1] : 0.309;  // the UK
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.classList.add('llg');
    var srcs = []; for (var i = 0; i < N; i++) { var p = base + 'f' + (i < 10 ? '0' + i : i) + '.jpg'; srcs.push(p); var im = new Image(); im.src = p; }
    var darkSrc = base + 'dark' + (K < 10 ? '0' + K : K) + '.jpg';
    new Image().src = darkSrc;

    el.innerHTML =
      '<img class="llg-lit" src="' + srcs[0] + '" alt="Night-time Earth with real city lights on the continents">' +
      '<img class="llg-dark" src="' + darkSrc + '" alt="">' +
      '<img class="llg-relit" src="' + srcs[K] + '" alt="">' +
      '<div class="llg-flash"></div><div class="llg-shock"></div><div class="llg-missile"></div>' +
      '<div class="llg-last"></div>' + (opts.caption ? '<div class="llg-cap">' + opts.caption + '</div>' : '');
    var lit = el.querySelector('.llg-lit'), dark = el.querySelector('.llg-dark'),
        relit = el.querySelector('.llg-relit'), flash = el.querySelector('.llg-flash'),
        shock = el.querySelector('.llg-shock'), missile = el.querySelector('.llg-missile'),
        last = el.querySelector('.llg-last'), cap = el.querySelector('.llg-cap');

    function px() { var w = el.clientWidth || 320, h = el.clientHeight || w; return { w: w, h: h, x: lx * w, y: ly * h }; }
    function placePoint() { var p = px(); [flash].forEach(function () {}); shock.style.left = p.x + 'px'; shock.style.top = p.y + 'px';
      last.style.left = p.x + 'px'; last.style.top = p.y + 'px';
      flash.style.background = 'radial-gradient(circle at ' + (lx*100) + '% ' + (ly*100) + '%, #ffffff 0%, #dfe9ff 22%, rgba(200,220,255,0) 55%)';
      relit.style.clipPath = 'circle(0px at ' + p.x + 'px ' + p.y + 'px)'; }
    placePoint(); window.addEventListener('resize', placePoint);

    // ── frame spinner ──
    var idx = 0, curImg = 0;
    function show(i) { i = ((Math.round(i) % N) + N) % N; if (i !== curImg) { curImg = i; lit.src = srcs[i]; } }
    var spinning = false, vel = 6, lastT = performance.now(), pos = 0;
    function raf(t) { var dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
      if (spinning && !reduce) { pos += vel * dt; show(pos); } requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    function easeTo(target, ms) { return new Promise(function (res) {
      var start = pos % N, delta = ((target - (start % N)) % N + N) % N; if (delta > N/2) delta -= N;
      var t0 = performance.now();
      (function step() { var k = Math.min(1, (performance.now() - t0) / ms); var e = 1 - Math.pow(1 - k, 3);
        pos = start + delta * e; show(pos); if (k < 1) requestAnimationFrame(step); else { pos = target; show(pos); res(); } })();
    }); }

    // ── the cinematic ──
    function resetOverlays() { dark.style.transition = 'none'; dark.style.opacity = 0;
      relit.style.transition = 'none'; relit.style.opacity = 0; placePoint();
      last.style.transition = 'none'; last.style.opacity = 0; last.style.animation = 'none';
      flash.style.opacity = 0; shock.style.opacity = 0; shock.style.transform = 'translate(-50%,-50%) scale(0)';
      missile.style.opacity = 0; if (cap) cap.style.opacity = 0; }

    async function cinematic() {
      resetOverlays();
      spinning = true; pos = 0; show(0);
      await sleep(3000);
      spinning = false; await easeTo(K, 800);                       // ease onto the impact face
      // incoming missile
      var p = px();
      missile.style.transition = 'none';
      missile.style.left = (p.x + 70) + 'px'; missile.style.top = (p.y - 150) + 'px';
      missile.style.transform = 'rotate(28deg)'; missile.style.opacity = 1; await sleep(30);
      missile.style.transition = 'left .55s cubic-bezier(.5,0,1,1), top .55s cubic-bezier(.5,0,1,1)';
      missile.style.left = p.x + 'px'; missile.style.top = p.y + 'px'; await sleep(560);
      missile.style.opacity = 0;
      // IMPACT
      flash.style.transition = 'opacity .12s'; flash.style.opacity = 1; el.classList.add('shake');
      shock.style.transition = 'transform .7s ease-out, opacity .7s ease-out';
      shock.style.opacity = .9; shock.style.transform = 'translate(-50%,-50%) scale(5.5)';
      await sleep(140); flash.style.transition = 'opacity .5s'; flash.style.opacity = 0;
      await sleep(400); el.classList.remove('shake');
      // BLACKOUT — city lights ripple out
      dark.style.transition = 'opacity 1s ease-in'; dark.style.opacity = 1;
      await sleep(1000); shock.style.opacity = 0;
      await sleep(900);                                             // silence in the dark
      // THE LAST LIGHT
      last.style.transition = 'opacity .8s'; last.style.opacity = 1; await sleep(800);
      last.style.animation = 'llg-pulse 2.4s ease-in-out infinite';
      if (cap) cap.style.opacity = 1;
      await sleep(1700);
      // RECOVERY — lights ripple back out from the last light
      relit.style.opacity = 1;
      relit.style.transition = 'clip-path 2.2s ease-in-out';
      var r = Math.max(p.w, p.h) * 1.6;
      relit.style.clipPath = 'circle(' + r + 'px at ' + p.x + 'px ' + p.y + 'px)';
      await sleep(2200);
      last.style.transition = 'opacity .8s'; last.style.opacity = 0; last.style.animation = 'none';
      await sleep(1100);
    }

    // ── drag mode ──
    function enableDrag() {
      resetOverlays(); el.classList.add('drag'); spinning = true; vel = 6;
      var PXPF = 9, dragging = false, lastX = 0, lt = 0;
      function gx(e) { return e.clientX != null ? e.clientX : ((e.touches && e.touches[0]) ? e.touches[0].clientX : 0); }
      // momentum handled by the same raf via vel decay
      var decay = function (t) { var dt = Math.min(.05,(t-lastT)/1000);
        if (!dragging && !reduce) { if (vel>6) vel=Math.max(6,vel-26*dt); else if (vel<-6) vel=Math.min(-6,vel+26*dt); else vel+=(6-vel)*Math.min(1,dt*2.5);} requestAnimationFrame(decay); };
      requestAnimationFrame(decay);
      el.addEventListener('pointerdown', function (e) { dragging = true; spinning = false; el.classList.add('dragging'); lastX = gx(e); lt = performance.now(); try { el.setPointerCapture(e.pointerId); } catch (_) {} });
      window.addEventListener('pointermove', function (e) { if (!dragging) return; var nx = gx(e), now = performance.now(), dx = nx - lastX, dt = (now - lt) / 1000 || .016; pos += dx / PXPF; vel = (dx / PXPF) / dt; show(pos); lastX = nx; lt = now; });
      window.addEventListener('pointerup', function () { if (!dragging) return; dragging = false; el.classList.remove('dragging'); spinning = true; });
    }

    if (reduce) { show(K); if (cap) cap.style.opacity = 1; if (opts.mode === 'intro-drag') enableDrag(); return; }
    if (opts.mode === 'intro-drag') { cinematic().then(enableDrag); }
    else { (async function loop() { while (true) { await cinematic(); } })(); }
  };
})();
