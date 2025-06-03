import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    optimizeDeps: {
        exclude: ['@primeuix', 'primeicons'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'public',
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue', '@vueuse/core', '@vueuse/shared'],
                    primevue: ['primevue'],
                    query: ['@tanstack/vue-query'],
                },
            },
        },
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
