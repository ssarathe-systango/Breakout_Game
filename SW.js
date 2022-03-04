const cacheName = 'Breakout';
const staticAssets = [
'./',
'./index.html',
'./index.css',
'./Breakout.js',
'./index.js',
'./color1.jpg',
'./sw.js',
'./manifest.json',
'./breakout192.png',
'./breakout512.png',
'./sounds/brick.mp3',
'./sounds/mixkit-fairy-cartoon-success-voice-344.wav',
'./sounds/mixkit-negative-tone-interface-tap-2569.wav',
'./sounds/paddle.mp3',
'./sounds/smb_mariodie.wav',
'./sounds/smb_stage_clear.wav',
'./sounds/smb_warning.wav',
'./sounds/breakout.mp3',
'.sounds/37028-08602201.mp3',
'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
'https://fonts.googleapis.com/css?family=Germania+One',
];

self.addEventListener('install', async e => {
const cache = await caches.open(cacheName);
await cache.addAll(staticAssets);
return self.skipWaiting();
});

self.addEventListener('activate', e => {
self.clients.claim();
});

self.addEventListener('fetch', async e => {
const req = e.request;
const url = new URL(req.url);

if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
} else {
    e.respondWith(networkAndCache(req));
}
});

async function cacheFirst(req) {
const cache = await caches.open(cacheName);
const cached = await cache.match(req);
return cached || fetch(req);
}

async function networkAndCache(req) {
const cache = await caches.open(cacheName);
try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
} catch (e) {
    const cached = await cache.match(req);
    return cached;
}
}