/// <reference lib="webworker" />
/// <reference types="vite/client" />

declare const self: ServiceWorkerGlobalScope;

import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
const API_URL = import.meta.env.VITE_API_URL;

precacheAndRoute(self.__WB_MANIFEST || [
  { url: '/', revision: null },
//  { url: '/icon-192x192.png', revision: null }, 
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
  ({ url }) => url.pathname.endsWith('.wasm'),
  new CacheFirst({
    cacheName: 'assets-hard',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10, 
        maxAgeSeconds: 60  
      }),
    ],
  })
);

registerRoute(
  ({url}) => url.href.startsWith(API_URL) && 
             new RegExp(`^${API_URL}/api/(olimpiadas/\\d+|departamentos|provincias|colegios)$`).test(url.href),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], 
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60
      }),
    ],
  })
);

registerRoute(
  ({ request, url }) => request.destination === '' && !url.href.startsWith(API_URL), 
  new CacheFirst({
    cacheName: 'octet-stream-cache',
    plugins: [
      new CacheableResponsePlugin({
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }),
      new ExpirationPlugin({
        maxEntries: 10, 
        maxAgeSeconds: 60
      }),
    ],
  })
);

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
