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

        sourcemap: false,

        rollupOptions: {
            output: {
                manualChunks: {

                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['lucide-react'],
                },
            },
        },
    },
});
