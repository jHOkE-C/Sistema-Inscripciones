import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), compression({
        algorithm: "brotliCompress",
        ext: ".br",
    }), compression({
        algorithm: "gzip",
        ext: ".gz",
    })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
