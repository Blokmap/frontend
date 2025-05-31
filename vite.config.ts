import { defineConfig } from 'vitest/config';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'public',
    },
    test: {
        include: ['test/unit/**/*.{test,spec}.ts'],
        environment: 'jsdom',
    },
    server: {
        host: true,
        allowedHosts: true,
        port: 3000,
        hmr: {
            clientPort: 443,
        },
    },
});
