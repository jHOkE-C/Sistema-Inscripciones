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
        plugins: [react(), tailwindcss(),
            compression({
                algorithm: 'brotliCompress',
                ext: '.br',
                deleteOriginFile: false,
                threshold: 0
            }),
            compression({
                algorithm: 'gzip',
                ext: '.gz',
                deleteOriginFile: false,
                threshold: 1024
            }),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                globPatterns: ['**/*.{js,css,html,wasm,br,gz,woff2,png,jpg,svg,webp}'],
                runtimeCaching: [
                    {
                    urlPattern: ({ request }) => request.destination !== 'document',
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'static-12h',
                        expiration: { maxAgeSeconds: 43200, purgeOnQuotaError: true }
                    }
                    },
                    {
                    urlPattern: new RegExp(`^${API_URL}/api/(olimpiadas/\\d+|departamentos|provincias|colegios)$`),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'api-12h',
                        expiration: { maxAgeSeconds: 43200, purgeOnQuotaError: true }
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
