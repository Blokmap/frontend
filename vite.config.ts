import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    publicDir: 'static',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'public',
        rollupOptions: {
            external: (id) => {
                return id.startsWith('@primeuix');
            },
            output: {
                manualChunks: {
                    vue: ['vue', '@vueuse/core', '@vueuse/shared'],
                    primevue: ['primevue'],
                    mapbox: ['mapbox-gl'],
                },
                paths: (id) => {
                    if (id.startsWith('@primeuix')) {
                        return 'data:text/javascript,export const style = "";';
                    }
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
