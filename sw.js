/* The Last Light Survival Guide — Service Worker */
const CACHE_NAME = 'last-light-v2';
const URLS_TO_CACHE = [
  '/', '/index.html', '/quick-reference.html', '/gear.html', '/tools.html',
  '/ai-setup.html', '/literature.html', '/changelog.html', '/cards.html',
  '/sections/food.html', '/sections/medical.html', '/sections/energy.html',
  '/sections/shelter.html', '/sections/communications.html', '/sections/navigation.html',
  '/sections/security.html', '/sections/agriculture.html', '/sections/animal.html',
  '/sections/nbc.html', '/sections/disasters.html', '/sections/governance.html',
  '/sections/chemistry.html', '/sections/metallurgy.html', '/sections/psychology.html',
  '/sections/textiles.html', '/sections/vehicles.html', '/sections/knowledge.html',
  '/assets/css/style.css', '/assets/js/app.js', '/assets/js/search.js', '/assets/js/aria.js',
  '/assets/js/librarian.js', '/assets/js/tools.js',
  '/search/search-index.json', '/search/pdf-chunks.json',
  '/sections/climate.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // PDFs are served from disk via the local server — skip SW caching to avoid quota issues
  if (new URL(event.request.url).pathname.startsWith('/pdfs/')) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
