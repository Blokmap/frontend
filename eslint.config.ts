import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const gitignore = fileURLToPath(new URL('.gitignore', import.meta.url));

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,

    // Global ignores
    {
        ignores: [
            '**/test/**',
            '**/tests/**',
            '**/*.test.*',
            '**/*.spec.*',
            '**/cypress/**',
            'dist/**',
            'public/**',
        ],
    },

    // All source files
    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        languageOptions: {
            globals: globals.browser,
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            vue: vuePlugin,
            import: importPlugin,
            'simple-import-sort': simpleImportSort,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
        rules: {
            // TypeScript
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],

            // Vue
            'vue/multi-word-component-names': 'off',
            'vue/component-name-in-template-casing': ['error', 'PascalCase'],
            'vue/require-default-prop': 'off',

            // Import validation
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/namespace': 'error',

            // Import ordering
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: 'primevue/**',
                            group: 'builtin',
                            position: 'before',
                        },
                        {
                            pattern: '**/*.vue',
                            group: 'builtin',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['type'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: false,
                    },
                },
            ],
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
        },
    },

    includeIgnoreFile(gitignore),
];
