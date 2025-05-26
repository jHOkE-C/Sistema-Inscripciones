/// <reference lib="webworker" />
/// <reference types="vite/client" />

declare const self: ServiceWorkerGlobalScope;

import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
const API_URL = import.meta.env.VITE_API_URL;
//por ahora 60s pero cuando este acabado puede ser 1h o mas, esto ayudara al servidor 
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60,
      }),
    ],
  })
);

registerRoute(
  ({ request }) =>
    ['script', 'style', 'image', 'font'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,         
        maxAgeSeconds: 60
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => /\.(wasm)$/i.test(url.pathname),
  new CacheFirst({
    cacheName: 'assets-hard',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10, 
        maxAgeSeconds: 86400//1dia  
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

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
