// Clockwork Everlasting service worker: caches the game so it can be installed and played offline.
const CACHE = 'clockwork-everlasting-v1';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
    'js/battle.js',   'js/cards.js',   'js/chesspuzzles.js',   'js/companions.js',   'js/cooking.js',   'js/data.js',   'js/extras.js',   'js/farm.js',   'js/festivals.js',   'js/homestead2.js',   'js/journal.js',   'js/main.js',   'js/mentors.js',   'js/portraits.js',   'js/puzzles.js',   'js/rift.js',   'js/sound.js',   'js/state.js',   'js/villains.js', 
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first (so updates arrive), falling back to the cache when offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
