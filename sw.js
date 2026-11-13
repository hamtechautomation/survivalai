/* The Last Light Survival Guide — Service Worker v4 */
const CACHE = 'last-light-v85';

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
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
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
