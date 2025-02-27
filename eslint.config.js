import tsplugin from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
    {
        languageOptions: {
            parser: vue,
            parserOptions: {
                parser: tsparser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsplugin,
        },
        rules: {
            ...tsplugin.configs.recommended.rules,
        },
    },
    ...vue.configs['flat/recommended'],
    prettier,
];
