import { defineConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
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
    },
});
