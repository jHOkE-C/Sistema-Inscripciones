/// <reference lib="webworker" />
/// <reference types="vite/client" />

declare const self: ServiceWorkerGlobalScope;

import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute([
  //{ url: '/', revision: null },
  //{ url: '/icon-192x192.png', revision: null }, 
]);
registerRoute(
  ({ request }) =>
    ['script', 'style', 'image', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,         
        maxAgeSeconds: 60
      }),
    ],
  }),
);
registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === '',
  new StaleWhileRevalidate({ cacheName: 'pages' }),
);
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
