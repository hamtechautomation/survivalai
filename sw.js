/* The Last Light Survival Guide — Service Worker v4 */
const CACHE = 'last-light-v11';

/* Pre-cache: all HTML, CSS, JS, icons, manifest.
   pdf-chunks.json (5.7MB) is intentionally excluded from pre-cache to avoid
   iOS storage quota failures — it's cached on first access instead. */
const PRECACHE = [
  '/index.html',
  '/quick-reference.html',
  '/gear.html',
  '/tools.html',
  '/ai-setup.html',
  '/literature.html',
  '/changelog.html',
  '/cards.html',
  '/bunker-bot-prompt.html',
  '/pdfs/index.html',
  '/offline.html',
  '/sections/food.html',
  '/sections/medical.html',
  '/sections/energy.html',
  '/sections/shelter.html',
  '/sections/communications.html',
  '/sections/navigation.html',
  '/sections/security.html',
  '/sections/knowledge.html',
  '/sections/science.html',
  '/sections/agriculture.html',
  '/sections/animal.html',
  '/sections/nbc.html',
  '/sections/disasters.html',
  '/sections/climate.html',
  '/sections/metallurgy.html',
  '/sections/governance.html',
  '/sections/psychology.html',
  '/sections/chemistry.html',
  '/sections/textiles.html',
  '/sections/vehicles.html',
  '/sections/build-power.html',
  '/sections/build-structures.html',
  '/sections/medicine-making.html',
  '/sections/build-water.html',
  '/assets/css/style.css',
  '/skills.html',
  '/assets/js/app.js',
  '/assets/js/search.js',
  '/assets/js/bunker-bot.js',
  '/assets/js/librarian.js',
  '/assets/js/tools.js',
  '/assets/js/shared-progress.js',
  '/assets/js/skills-data.js',
  '/assets/js/skills.js',
  '/search/search-index.json',
  '/manifest.json',
  '/assets/icons/icon.svg',
];

/* ── Install: pre-cache everything, activate immediately ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
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
  if (url.pathname.match(/\.(css|js|svg|png|ico|woff2?|json)$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  /* HTML pages — cache-first, with network update in background */
  event.respondWith(staleWhileRevalidate(event.request));
});

/* ── Cache strategies ── */

function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetchAndCache(request);
  });
}

function staleWhileRevalidate(request) {
  return caches.open(CACHE).then(cache =>
    cache.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => null);

      return cached || networkFetch.then(r => r || offlineFallback(request));
    })
  );
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
