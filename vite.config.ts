import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const API_URL = env.VITE_API_URL?.replace(/\./g, '\\.');
    
    return {
        plugins: [
            react(),
            tailwindcss(),
            compression({
                algorithm: 'gzip',
                ext: '.gz',
                deleteOriginFile: false,
            }),
            VitePWA({
                registerType: 'autoUpdate',
                injectRegister: 'auto',
                workbox: {
                    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
                    globPatterns: [
                        '**/*.{js,css,html,wasm,woff2,png,jpg,svg,webp}'
                    ], 
                    cleanupOutdatedCaches: true,
                    clientsClaim: true,
                    skipWaiting: true,
                    runtimeCaching: [
                        {
                            urlPattern: ({ request, url }) => request.destination !== 'document' &&
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            url.origin === (globalThis as any).location?.origin,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'static-assets',
                                expiration: {
                                    maxAgeSeconds: 60,
                                    maxEntries: 200
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        },
                        {
                            urlPattern: new RegExp(
                                `^${API_URL}/api/(olimpiadas/\\d+|departamentos|provincias|colegios)$`
                            ),
                            handler: 'StaleWhileRevalidate',
                            options: {
                                cacheName: 'api-cache',
                                expiration: {
                                    maxAgeSeconds: 60,
                                    maxEntries: 100
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        }
                    ]
                }
            })
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    }    
});
