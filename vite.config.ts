import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            deleteOriginFile: false,
        }),
        // Add Brotli compression for better compression ratios
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            deleteOriginFile: false,
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // Enable source maps for debugging
        sourcemap: false,
        // Optimize chunk size
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor libraries
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['lucide-react'],
                },
            },
        },
    },
});
