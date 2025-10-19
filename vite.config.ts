import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    optimizeDeps: {
        exclude: ['@primeuix'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    publicDir: 'static',
    build: {
        outDir: 'public',
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue', '@vueuse/core', '@vueuse/shared'],
                    primevue: ['primevue'],
                    mapbox: ['mapbox-gl'],
                },
            },
        },
    },
    test: {
        include: ['test/unit/**/*.{test,spec}.ts'],
        environment: 'jsdom',
        globals: true,
        pool: 'threads',
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
