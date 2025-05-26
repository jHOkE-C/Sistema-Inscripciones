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
                    globPatterns: ['**/*.{js,css,html,wasm,br,gz,woff2,png,jpg,svg,webp}'],
                    cleanupOutdatedCaches: true,
                    clientsClaim: true,
                    skipWaiting: true,
                    runtimeCaching: [
                        {
                            urlPattern: ({ request }) => request.destination !== 'document',
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'static-assets',
                                expiration: {
                                    maxAgeSeconds: 7 * 24 * 60 * 60,
                                    maxEntries: 200
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        },
                        {
                            urlPattern: new RegExp(`^${API_URL}/api/(olimpiadas/\\d+|departamentos|provincias|colegios)$`),
                            handler: 'StaleWhileRevalidate',
                            options: {
                                cacheName: 'api-cache',
                                expiration: {
                                    maxAgeSeconds: 43200,
                                    maxEntries: 100
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        }
                    ]
                },
                manifest: {
                    short_name: "Cutie",
                    name: "Cutie App",
                    start_url: "/",
                    display: "standalone",
                    background_color: "#ffffff",
                    theme_color: "#000000",
                    icons: [
                        {
                            src: "/icon-192x192.png",
                            sizes: "192x192",
                            type: "image/png"
                        },
                        {
                            src: "/icon-512x512.png",
                            sizes: "512x512",
                            type: "image/png"
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
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                    }
                }
            },
            chunkSizeWarningLimit: 1000,
        }
    }    
});
