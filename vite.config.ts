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
            output: {
                manualChunks(id) {
                    // Split FontAwesome icon packages
                    if (id.includes('@fortawesome/free-solid-svg-icons')) {
                        return 'fontawesome-solid';
                    }
                    if (id.includes('@fortawesome/free-regular-svg-icons')) {
                        return 'fontawesome-regular';
                    }
                    if (id.includes('@fortawesome/free-brands-svg-icons')) {
                        return 'fontawesome-brands';
                    }
                    if (id.includes('@fortawesome/fontawesome-svg-core')) {
                        return 'fontawesome-svg-core';
                    }
                    if (id.includes('@fortawesome/vue-fontawesome')) {
                        return 'fontawesome-vue';
                    }

                    // Core libraries
                    if (id.includes('node_modules')) {
                        if (id.includes('primevue')) {
                            return 'primevue';
                        }
                        if (id.includes('vue') || id.includes('@vueuse')) {
                            return 'vue';
                        }
                        if (id.includes('mapbox-gl')) {
                            return 'mapbox';
                        }
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
