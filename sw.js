/* My Daily service worker — offline app shell. No user data passes through here:
   posts live in localStorage, media in IndexedDB. */
const VERSION = 'mydaily-v3';
const SHELL = VERSION + '-shell';
const RUNTIME = VERSION + '-runtime';
const scope = self.registration.scope;
const INDEX = new URL('index.html', scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const core = ['./', 'index.html', 'manifest.webmanifest', 'firebase-config.js', 'favicon-64.png', 'icon-192.png', 'icon-512.png']
      .map((p) => new URL(p, scope).href);
    await cache.addAll(core);
    // precache the hashed JS/CSS referenced by index.html so the very first visit works offline
    const html = await (await fetch(INDEX, { cache: 'no-store' })).text();
    const assets = [...html.matchAll(/(?:src|href)="(\.?\/?[\w.-]+\.(?:js|css))"/g)]
      .map((m) => new URL(m[1], INDEX).href)
      .filter((u) => !u.endsWith('firebase-config.js') && !u.endsWith('sw.js'));
    await cache.addAll(assets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // app navigation: network first, fall back to cached shell
  if (req.mode === 'navigate' && url.href.startsWith(scope)) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put(INDEX, res.clone());
        return res;
      } catch {
        return (await caches.match(INDEX)) || Response.error();
      }
    })());
    return;
  }

  const sameOrigin = url.origin === self.location.origin;

  // settings file: always try the network so edits on GitHub take effect immediately
  if (sameOrigin && url.pathname.endsWith('/firebase-config.js')) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req, { cache: 'no-store' });
        (await caches.open(SHELL)).put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req)) || new Response('window.MYDAILY_FIREBASE_CONFIG = null;', { headers: { 'Content-Type': 'text/javascript' } });
      }
    })());
    return;
  }
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  // static assets & fonts: cache first, update in background
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(async (res) => {
      if (res.ok || res.type === 'opaque') (await caches.open(RUNTIME)).put(req, res.clone());
      return res;
    }).catch(() => undefined);
    return cached || (await network) || Response.error();
  })());
});
