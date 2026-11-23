/* The Last Light Survival Guide — Service Worker v4 */
const CACHE = 'last-light-v110';
/* Pictures and videos live in their own cache that survives version bumps: they are
   saved the first time they're viewed, or all at once from Download → Save pictures. */
const MEDIA_CACHE = 'last-light-media-v1';

/* Pre-cache: all HTML, CSS, JS, icons, manifest.
   pdf-chunks.json (~30MB) is intentionally excluded from pre-cache to avoid
   iOS storage quota failures — it's cached on first access instead. */
const PRECACHE = [
  '/',
  '/home.html',
  '/index.html',
  '/about.html',
  '/quick-reference.html',
  '/gear.html',
  '/tools.html',
  '/ai-setup.html',
  '/literature.html',
  '/expansion.html',
  '/maps.html',
  '/download.html',
  '/changelog.html',
  '/cards.html',
  '/print-essentials.html',
  '/bunker-bot-prompt.html',
  '/pdfs/index.html',
  '/offline.html',
  '/index-print.html',
  '/sections/food.html',
  '/sections/medical.html',
  '/sections/energy.html',
  '/sections/shelter.html',
  '/sections/communications.html',
  '/sections/navigation.html',
  '/sections/security.html',
  '/sections/knowledge.html',
  '/sections/science.html',
  '/sections/knots.html',
  '/sections/agriculture.html',
  '/sections/animal.html',
  '/sections/veterinary.html',
  '/sections/maternal.html',
  '/sections/nbc.html',
  '/sections/disasters.html',
  '/sections/climate.html',
  '/sections/metallurgy.html',
  '/sections/governance.html',
  '/sections/psychology.html',
  '/sections/chemistry.html',
  '/sections/textiles.html',
  '/sections/vehicles.html',
  '/sections/salvage.html',
  '/sections/fuel.html',
  '/sections/prepping.html',
  '/sections/prep-24h.html',
  '/sections/prep-home.html',
  '/sections/prep-urban.html',
  '/sections/prep-van.html',
  '/sections/prep-rural.html',
  '/sections/prep-bunkers.html',
  '/sections/prep-stockpile.html',
  '/sections/prep-buy.html',
  '/sections/solar-power.html',
  '/sections/bug-out-bag.html',
  '/sections/family-prepping.html',
  '/sections/fire-warmth.html',
  '/sections/field-shelter.html',
  '/sections/field-water.html',
  '/sections/field-first-aid.html',
  '/sections/navigation-no-gps.html',
  '/sections/signals-radio.html',
  '/sections/smallholding.html',
  '/sections/hunting-trapping.html',
  '/sections/fishing.html',
  '/sections/butchery.html',
  '/sections/food-preservation.html',
  '/sections/regions.html',
  '/sections/region-yorkshire.html',
  '/sections/region-cumbria.html',
  '/sections/region-peak-district.html',
  '/sections/region-wales.html',
  '/sections/region-scottish-highlands.html',
  '/sections/build-power.html',
  '/sections/build-structures.html',
  '/sections/medicine-making.html',
  '/sections/build-water.html',
  '/sections/projects.html',
  '/assets/css/style.css',
  '/assets/fonts/bitter-latin-wght-normal.woff2',
  '/assets/fonts/inter-latin-wght-normal.woff2',
  '/assets/fonts/jetbrains-mono-latin-wght-normal.woff2',
  '/assets/covers/aerie-backcountry-medicine.jpg',
  '/assets/covers/aesops-fables.jpg',
  '/assets/covers/art-of-war-sun-tzu.jpg',
  '/assets/covers/book-for-midwives.jpg',
  '/assets/covers/bowditch-navigator.jpg',
  '/assets/covers/bunkerbot-compendium.jpg',
  '/assets/covers/emergency-war-surgery.jpg',
  '/assets/covers/farm-household-cyclopedia.jpg',
  '/assets/covers/fema-wood-gas-generator.jpg',
  '/assets/covers/fm-21-10-field-hygiene.jpg',
  '/assets/covers/fm-21-76-survival-1957.jpg',
  '/assets/covers/fm-3-05-70-survival.jpg',
  '/assets/covers/fm-4-25-11-first-aid.jpg',
  '/assets/covers/fm-5-426-carpentry.jpg',
  '/assets/covers/fm-6-02-signal-ops.jpg',
  '/assets/covers/fuel-from-farms-ethanol.jpg',
  '/assets/covers/henleys-formulas.jpg',
  '/assets/covers/humanure-handbook.jpg',
  '/assets/covers/kjv-bible.jpg',
  '/assets/covers/knots-splices-ropework.jpg',
  '/assets/covers/meditations-marcus-aurelius.jpg',
  '/assets/covers/nrel-biodiesel-guide.jpg',
  '/assets/covers/nuclear-war-survival.jpg',
  '/assets/covers/ranger-handbook.jpg',
  '/assets/covers/sf-medical-handbook.jpg',
  '/assets/covers/shakespeare-complete.jpg',
  '/assets/covers/ships-medicine-chest.jpg',
  '/assets/covers/sturtevant-edible-plants.jpg',
  '/assets/covers/tm5-685-generators.jpg',
  '/assets/covers/uk-emergency-preparedness.jpg',
  '/assets/covers/usda-home-canning.jpg',
  '/assets/covers/where-there-is-no-dentist.jpg',
  '/assets/covers/where-there-is-no-doctor.jpg',
  '/skills.html',
  '/assets/js/app.js',
  '/assets/js/search.js',
  '/assets/js/bunker-bot.js',
  '/assets/js/librarian.js',
  '/assets/js/bookshelf.js',
  '/assets/js/library-data.js',
  '/assets/js/emergency.js',
  '/assets/js/calc.js',
  '/assets/js/model3d.js',
  '/assets/js/media.js',
  '/assets/js/tools/morse-trainer.js',
  '/assets/js/tools/season-wheel.js',
  '/assets/js/tools/solar-sizer.js',
  '/assets/css/bb-tools.css',
  '/assets/regions/region-map.js',
  '/assets/regions/region-map.css',
  '/assets/regions/data/cumbria.js',
  '/assets/regions/data/peak-district.js',
  '/assets/regions/data/regions.js',
  '/assets/regions/data/scottish-highlands.js',
  '/assets/regions/data/wales.js',
  '/assets/regions/data/yorkshire.js',
  '/assets/js/emergency-figs.js',
  '/assets/js/tools.js',
  '/assets/js/shared-progress.js',
  '/assets/js/skills-data.js',
  '/assets/js/skills.js',
  '/assets/vendor/maps/leaflet.js',
  '/assets/vendor/maps/leaflet.css',
  '/assets/vendor/maps/pmtiles.js',
  '/assets/vendor/maps/protomaps-leaflet.js',
  '/maps/regions.json',
  '/search/search-index.json',
  '/manifest.json',
  '/assets/icons/icon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/apple-touch-icon.png',
];

const MEDIA = [
  '/assets/media/anim-boil-water-poster.webp',
  '/assets/media/anim-boil-water.mp4',
  '/assets/media/anim-bow-drill-poster.webp',
  '/assets/media/anim-bow-drill.mp4',
  '/assets/media/anim-bugout-pack-poster.webp',
  '/assets/media/anim-bugout-pack.mp4',
  '/assets/media/anim-cage-trap-trigger-poster.webp',
  '/assets/media/anim-cage-trap-trigger.mp4',
  '/assets/media/anim-deadfall-trip-poster.webp',
  '/assets/media/anim-deadfall-trip.mp4',
  '/assets/media/anim-debris-hut-poster.webp',
  '/assets/media/anim-debris-hut.mp4',
  '/assets/media/anim-deer-turntable-poster.webp',
  '/assets/media/anim-deer-turntable.mp4',
  '/assets/media/anim-ferro-rod-strike-poster.webp',
  '/assets/media/anim-ferro-rod-strike.mp4',
  '/assets/media/anim-fire-lay-poster.webp',
  '/assets/media/anim-fire-lay.mp4',
  '/assets/media/anim-fish-float-bite-poster.webp',
  '/assets/media/anim-fish-float-bite.mp4',
  '/assets/media/anim-fish-funnel-swim-poster.webp',
  '/assets/media/anim-fish-funnel-swim.mp4',
  '/assets/media/anim-morse-sos-poster.webp',
  '/assets/media/anim-morse-sos.mp4',
  '/assets/media/anim-rabbit-jointing-poster.webp',
  '/assets/media/anim-rabbit-jointing.mp4',
  '/assets/media/anim-rain-harvest-flow-poster.webp',
  '/assets/media/anim-rain-harvest-flow.mp4',
  '/assets/media/anim-roof-hook-install-poster.webp',
  '/assets/media/anim-roof-hook-install.mp4',
  '/assets/media/anim-rotational-grazing-poster.webp',
  '/assets/media/anim-rotational-grazing.mp4',
  '/assets/media/anim-signal-mirror-poster.webp',
  '/assets/media/anim-signal-mirror.mp4',
  '/assets/media/anim-smallholding-flyover-poster.webp',
  '/assets/media/anim-smallholding-flyover.mp4',
  '/assets/media/anim-smoke-signal-poster.webp',
  '/assets/media/anim-smoke-signal.mp4',
  '/assets/media/anim-solar-flow-poster.webp',
  '/assets/media/anim-solar-flow.mp4',
  '/assets/media/anim-sun-path-tilt-poster.webp',
  '/assets/media/anim-sun-path-tilt.mp4',
  '/assets/media/anim-tarp-shelter-poster.webp',
  '/assets/media/anim-tarp-shelter.mp4',
  '/assets/media/anim-water-filter-poster.webp',
  '/assets/media/anim-water-filter.mp4',
  '/assets/media/anim-yorkshire-rain-shadow-poster.webp',
  '/assets/media/anim-yorkshire-rain-shadow.mp4',
  '/assets/media/ba-groundair-good.webp',
  '/assets/media/ba-groundair-poor.webp',
  '/assets/media/ba-solar-summer.webp',
  '/assets/media/ba-solar-winter.webp',
  '/assets/media/ba-water-clean.webp',
  '/assets/media/ba-water-dirty.webp',
  '/assets/media/bugout-knolling.webp',
  '/assets/media/butcher-beef.webp',
  '/assets/media/butcher-deer.webp',
  '/assets/media/butcher-gamebird.webp',
  '/assets/media/butcher-lamb.webp',
  '/assets/media/butcher-pig.webp',
  '/assets/media/butcher-rabbit.webp',
  '/assets/media/farm-chicken-coop.webp',
  '/assets/media/farm-duck-house.webp',
  '/assets/media/farm-goat-sheep.webp',
  '/assets/media/farm-pig-ark.webp',
  '/assets/media/farm-smallholding-layout.webp',
  '/assets/media/fire-lays.webp',
  '/assets/media/fire-tinder-kit.webp',
  '/assets/media/fish-float-rig.webp',
  '/assets/media/fish-funnel-trap.webp',
  '/assets/media/fish-stone-weir.webp',
  '/assets/media/gear-knolling.webp',
  '/assets/media/home-pantry.webp',
  '/assets/media/hunt-high-seat.webp',
  '/assets/media/power-battery-prep.webp',
  '/assets/media/power-generator.webp',
  '/assets/media/power-ground-mount.webp',
  '/assets/media/power-offgrid-system.webp',
  '/assets/media/power-plug-in-solar.webp',
  '/assets/media/power-portable-kit.webp',
  '/assets/media/power-roof-retrofit.webp',
  '/assets/media/shelter-lean-to.webp',
  '/assets/media/shelter-sleep-system.webp',
  '/assets/media/sig-dipole.webp',
  '/assets/media/sig-ground-air.webp',
  '/assets/media/sig-groundplane.webp',
  '/assets/media/sig-radio-kit.webp',
  '/assets/media/trap-cage-live.webp',
  '/assets/media/trap-figure4-deadfall.webp',
  '/assets/media/trap-purse-net.webp',
  '/assets/media/trap-snare-run.webp',
  '/assets/media/trap-tunnel-spring.webp',
  '/assets/media/turn-farm-chicken-coop-poster.webp',
  '/assets/media/turn-farm-chicken-coop-sprite.webp',
  '/assets/media/turn-shelter-lean-to-poster.webp',
  '/assets/media/turn-shelter-lean-to-sprite.webp',
  '/assets/media/turn-sig-groundplane-poster.webp',
  '/assets/media/turn-sig-groundplane-sprite.webp',
  '/assets/media/turn-trap-figure4-deadfall-poster.webp',
  '/assets/media/turn-trap-figure4-deadfall-sprite.webp',
  '/assets/media/water-rain-catchment.webp',
];

/* ── Install: pre-cache everything, activate immediately ──
   Fetch each file with cache:'reload' so a new worker version pulls FRESH copies
   from the network, bypassing the long (1-year) browser HTTP cache. This is what
   makes aggressive caching safe: bump CACHE here and every asset refreshes. */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const total = PRECACHE.length;
    let done = 0;
    // Same all-or-nothing result as cache.addAll (any failure fails the
    // install), but file by file so open pages can show "Saving 42 / 85".
    const queue = PRECACHE.slice();
    const worker = async () => {
      while (queue.length) {
        const url = queue.shift();
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (!res.ok) throw new Error('precache failed: ' + url);
        await cache.put(url, res);
        done++;
        if (done % 5 === 0 || done === total) broadcast({ type: 'precache-progress', done, total, version: CACHE });
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    await self.skipWaiting();
  })());
});

async function broadcast(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach(c => c.postMessage(msg));
}

/* Download → "Save pictures for offline": fetch every picture and video into MEDIA_CACHE. */
self.addEventListener('message', event => {
  const t = event.data && event.data.type;
  if (t !== 'media-status' && t !== 'save-media') return;
  event.waitUntil((async () => {
    const cache = await caches.open(MEDIA_CACHE);
    const have = new Set((await cache.keys()).map(r => new URL(r.url).pathname));
    const todo = MEDIA.filter(u => !have.has(u));
    const reply = done => event.source.postMessage({ type: 'media-status', total: MEDIA.length, saved: MEDIA.length - todo.length + done, busy: t === 'save-media' && done < todo.length });
    if (t === 'media-status') return reply(0);
    let done = 0;
    const queue = todo.slice();
    const worker = async () => {
      while (queue.length) {
        const url = queue.shift();
        try { const res = await fetch(url, { cache: 'reload' }); if (res.ok) await cache.put(url, res); } catch (e) {}
        done++;
        if (done % 4 === 0 || done === todo.length) reply(done);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    reply(todo.length);
  })());
});

/* Pages ask "is everything saved?" to show an honest offline-ready status. */
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'offline-status') return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const keys = await cache.keys();
    const have = new Set(keys.map(r => new URL(r.url).pathname));
    const missing = PRECACHE.filter(u => !have.has(u));
    event.source.postMessage({ type: 'offline-status', version: CACHE, total: PRECACHE.length, missing: missing.length });
  })());
});

/* ── Activate: delete stale caches, take control immediately ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== MEDIA_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: smart routing ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* Map data (.pmtiles) uses HTTP range requests — let the browser handle them
     directly so partial-content responses aren't mangled by cache logic. */
  if (url.pathname.endsWith('.pmtiles')) return;

  /* Rendered scenes: cache-first in MEDIA_CACHE. Videos are asked for in byte ranges,
     so answer those from the saved copy, slicing it; never store a partial response. */
  if (url.pathname.startsWith('/assets/media/')) {
    event.respondWith(mediaResponse(event.request, url.pathname));
    return;
  }

  /* PDF files — not pre-cached, but serve from cache if the user manually saved one offline */
  if (url.pathname.match(/\/pdfs\/.+\.pdf$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  /* pdf-chunks.json is 5.7MB — network-first, cache on demand only */
  if (url.pathname.endsWith('pdf-chunks.json')) {
    event.respondWith(networkFirstWithCache(event.request));
    return;
  }

  /* Static assets (CSS, JS, icons, fonts) — cache-first for speed */
  if (url.pathname.match(/\.(css|js|svg|png|jpe?g|ico|woff2?|json)$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  /* HTML pages — cache-first. We intentionally do NOT revalidate in the
     background: with long HTTP caching that fetch could pull a stale page from
     the browser cache and re-pollute the SW cache. Updates arrive via a new SW
     version (bump CACHE), which force-refreshes every file on install. */
  event.respondWith(cacheFirst(event.request));
});

/* ── Cache strategies ── */

async function mediaResponse(request, path) {
  const cache = await caches.open(MEDIA_CACHE);
  const hit = await cache.match(path);
  const range = request.headers.get('range');
  if (hit && range) {
    const buf = await hit.arrayBuffer();
    const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
    const start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
    return new Response(buf.slice(start, end + 1), { status: 206, headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'video/mp4', 'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
  }
  if (hit) return hit;
  if (range) {                                            // a video streaming in: let it, and save a whole copy alongside
    fetch(path).then(r => { if (r.ok && r.status === 200) cache.put(path, r); }).catch(() => {});
    return fetch(request);
  }
  try {
    const res = await fetch(request);
    if (res.ok && res.status === 200) cache.put(path, res.clone());
    return res;
  } catch (e) { return new Response('', { status: 504 }); }
}

function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetchAndCache(request);
  });
}

function networkFirstWithCache(request) {
  return fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        caches.open(CACHE).then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => caches.match(request));
}

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (!response || response.status !== 200 || response.type !== 'basic') return response;
    caches.open(CACHE).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(() => offlineFallback(request));
}

function offlineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  return new Response('', { status: 503 });
}
