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
  @keyframes llg-flicker{0%{opacity:0}8%{opacity:.9}12%{opacity:.08}20%{opacity:1}26%{opacity:.12}34%{opacity:.85}42%{opacity:.25}52%{opacity:1}64%{opacity:.5}100%{opacity:1}}
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
    var N = 48, K = opts.impactFrame != null ? opts.impactFrame : 0;   // frame facing the strike hemisphere
    var lx = opts.lastLight ? opts.lastLight[0] : 0.489, ly = opts.lastLight ? opts.lastLight[1] : 0.309;  // the UK — the surviving light
    var ix = opts.impact ? opts.impact[0] : 0.75, iy = opts.impact ? opts.impact[1] : 0.43;                // Middle East — where the nuke strikes
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.classList.add('llg');
    var srcs = []; for (var i = 0; i < N; i++) { var p = base + 'f' + (i < 10 ? '0' + i : i) + '.jpg'; srcs.push(p); var im = new Image(); im.src = p; }
    var darkSrc = base + 'dark' + (K < 10 ? '0' + K : K) + '.jpg';
    new Image().src = darkSrc;

    el.innerHTML =
      '<img class="llg-lit" src="' + srcs[0] + '" alt="Night-time Earth with real city lights on the continents">' +
      '<img class="llg-lit2" src="' + srcs[1] + '" alt="" style="opacity:0">' +
      '<img class="llg-dark" src="' + darkSrc + '" alt="">' +
      '<img class="llg-relit" src="' + srcs[K] + '" alt="">' +
      '<div class="llg-flash"></div><div class="llg-shock"></div><div class="llg-missile"></div>' +
      '<div class="llg-last"></div>' + (opts.caption ? '<div class="llg-cap">' + opts.caption + '</div>' : '');
    var litA = el.querySelector('.llg-lit'), litB = el.querySelector('.llg-lit2'), dark = el.querySelector('.llg-dark'),
        relit = el.querySelector('.llg-relit'), flash = el.querySelector('.llg-flash'),
        shock = el.querySelector('.llg-shock'), missile = el.querySelector('.llg-missile'),
        last = el.querySelector('.llg-last'), cap = el.querySelector('.llg-cap');

    function pt(fx, fy) { var w = el.clientWidth || 320, h = el.clientHeight || w; return { w: w, h: h, x: fx * w, y: fy * h }; }
    function ipt() { return pt(ix, iy); }   // impact — Middle East
    function lpt() { return pt(lx, ly); }   // last light — UK
    function placePoint() {
      var ip = ipt(), lp = lpt();
      shock.style.left = ip.x + 'px'; shock.style.top = ip.y + 'px';                 // shockwave centred on the strike
      last.style.left = lp.x + 'px'; last.style.top = lp.y + 'px';                    // the surviving light over the UK
      flash.style.background = 'radial-gradient(circle at ' + (ix*100) + '% ' + (iy*100) + '%, #ffffff 0%, #dfe9ff 22%, rgba(200,220,255,0) 55%)';
      relit.style.clipPath = 'circle(0px at ' + lp.x + 'px ' + lp.y + 'px)'; }        // recovery ripples out from the UK
    placePoint(); window.addEventListener('resize', placePoint);

    // ── frame spinner ──
    // fractional frame with a cross-fade between the two nearest frames → continuous, non-stepping rotation
    var ia = -1, ib = -1;
    function show(p) { var f = ((p % N) + N) % N, i0 = Math.floor(f), frac = f - i0, i1 = (i0 + 1) % N;
      if (i0 !== ia) { litA.src = srcs[i0]; ia = i0; }
      if (i1 !== ib) { litB.src = srcs[i1]; ib = i1; }
      litB.style.opacity = frac; }
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
    function resetOverlays() { dark.style.transition = 'none'; dark.style.opacity = 0; dark.style.clipPath = 'none';
      relit.style.transition = 'none'; relit.style.opacity = 0; placePoint();
      last.style.transition = 'none'; last.style.opacity = 0; last.style.animation = 'none';
      flash.style.opacity = 0; shock.style.opacity = 0; shock.style.transform = 'translate(-50%,-50%) scale(0)';
      missile.style.opacity = 0; if (cap) cap.style.opacity = 0; }

    async function cinematic() {
      resetOverlays();
      spinning = true; pos = 0; show(0);
      await sleep(3000);
      spinning = false; await easeTo(K, 800);                       // ease onto the impact face
      // incoming missile → the Middle East strike point
      var ip = ipt();
      missile.style.transition = 'none';
      missile.style.left = (ip.x + 70) + 'px'; missile.style.top = (ip.y - 150) + 'px';
      missile.style.transform = 'rotate(28deg)'; missile.style.opacity = 1; await sleep(30);
      missile.style.transition = 'left .55s cubic-bezier(.5,0,1,1), top .55s cubic-bezier(.5,0,1,1)';
      missile.style.left = ip.x + 'px'; missile.style.top = ip.y + 'px'; await sleep(560);
      missile.style.opacity = 0;
      // IMPACT — the flash, and darkness races outward from ground zero
      flash.style.transition = 'opacity .12s'; flash.style.opacity = 1; el.classList.add('shake');
      var rad = Math.max(ip.w, ip.h) * 1.75;
      shock.style.transition = 'transform .85s ease-out, opacity .85s ease-out';
      shock.style.opacity = .9; shock.style.transform = 'translate(-50%,-50%) scale(6)';
      // blackout tracks the blast: instant black at the detonation, spreading out to kill every light
      dark.style.transition = 'none'; dark.style.opacity = 1;
      dark.style.clipPath = 'circle(0px at ' + ip.x + 'px ' + ip.y + 'px)';
      void dark.offsetWidth;                                        // commit the zero-radius start
      dark.style.transition = 'clip-path .85s ease-out';
      dark.style.clipPath = 'circle(' + rad + 'px at ' + ip.x + 'px ' + ip.y + 'px)';
      await sleep(160); flash.style.transition = 'opacity .5s'; flash.style.opacity = 0;
      await sleep(700); el.classList.remove('shake'); shock.style.opacity = 0;
      // DARKNESS — a beat of total black once the wave has passed
      await sleep(550);
      // THE LAST LIGHT — flickers on over the UK
      last.style.transition = 'none'; last.style.animation = 'llg-flicker .9s ease-out forwards';
      await sleep(950);
      last.style.opacity = 1; last.style.animation = 'llg-pulse 2.4s ease-in-out infinite';
      if (cap) cap.style.opacity = 1;
      await sleep(1500);
      // RECOVERY — the other lights slowly come back, rippling out from the UK
      var lp = lpt();
      relit.style.opacity = 1;
      relit.style.transition = 'clip-path 2.6s ease-in-out';
      var r = Math.max(lp.w, lp.h) * 1.6;
      relit.style.clipPath = 'circle(' + r + 'px at ' + lp.x + 'px ' + lp.y + 'px)';
      await sleep(2600);
      last.style.transition = 'opacity .8s'; last.style.opacity = 0; last.style.animation = 'none';
      await sleep(1100);
    }

    // ── drag mode ──
    function enableDrag() {
      resetOverlays(); el.classList.add('drag'); spinning = true; vel = 6;
      var PXPF = 9, dragging = false, lastX = 0, lt = 0;
      function gx(e) { return e.clientX != null ? e.clientX : ((e.touches && e.touches[0]) ? e.touches[0].clientX : 0); }
      // momentum handled by the same raf via vel decay
      // momentum always decays toward a gentle FORWARD spin — the globe never coasts or idles backward
      var decay = function (t) { var dt = Math.min(.05,(t-lastT)/1000);
        if (!dragging && !reduce) { if (vel>6) vel=Math.max(6,vel-26*dt); else vel+=(6-vel)*Math.min(1,dt*2.5); if (vel<0) vel=0; } requestAnimationFrame(decay); };
      requestAnimationFrame(decay);
      el.addEventListener('pointerdown', function (e) { dragging = true; spinning = false; el.classList.add('dragging'); lastX = gx(e); lt = performance.now(); try { el.setPointerCapture(e.pointerId); } catch (_) {} });
      window.addEventListener('pointermove', function (e) { if (!dragging) return; var nx = gx(e), now = performance.now(), dx = nx - lastX, dt = (now - lt) / 1000 || .016; pos += dx / PXPF; vel = (dx / PXPF) / dt; show(pos); lastX = nx; lt = now; });
      window.addEventListener('pointerup', function () { if (!dragging) return; dragging = false; el.classList.remove('dragging'); vel = Math.max(6, vel); spinning = true; });
    }

    if (reduce) { show(K); if (cap) cap.style.opacity = 1; if (opts.mode === 'intro-drag') enableDrag(); return; }
    if (opts.mode === 'intro-drag') { cinematic().then(enableDrag); }
    else { (async function loop() { while (true) { await cinematic(); } })(); }
  };
})();
