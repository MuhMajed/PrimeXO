const CACHE_NAME = 'prime-xo-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon.svg',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'hooks/useGameLogic.ts',
  'hooks/useSounds.ts',
  'services/aiService.ts',
  'components/SetupScreen.tsx',
  'components/Board.tsx',
  'components/MinorBoard.tsx',
  'components/Cell.tsx',
  'components/Scoreboard.tsx',
  'components/OptionsModal.tsx',
  'components/Icons.tsx',
  'components/WinningLine.tsx',
  'components/TieBreakerModal.tsx',
  'components/HowToPlayModal.tsx',
  // External resources that need to be cached for offline use
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/',
  'https://esm.sh/react@^19.1.1/'
];

// Install event: open a cache and add the app shell files to it
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        const promises = urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        });
        return Promise.all(promises);
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting();
      })
  );
});

// Activate event: clean up old caches to remove outdated files
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation completed');
      return self.clients.claim();
    })
  );
});

// Fetch event: serve assets from cache, falling back to network
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the resource is in the cache, serve it directly
        if (response) {
          return response;
        }

        // If not in cache, fetch from the network
        return fetch(event.request);
      })
  );
});
