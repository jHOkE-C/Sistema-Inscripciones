/// <reference lib="webworker" />
/// <reference types="vite/client" />

declare const self: ServiceWorkerGlobalScope;

import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
const API_URL = import.meta.env.VITE_API_URL;

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60,
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
        maxEntries: 1000,         
        maxAgeSeconds: 60
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => /\.(wasm|js|css)$/i.test(url.pathname),
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

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
