import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import vuelint from 'eslint-plugin-vue';
import pretty from 'eslint-config-prettier';

export default tslint.config(
    eslint.configs.recommended,
    ...tslint.configs.recommended,
    ...vuelint.configs['flat/recommended'],
    {
        languageOptions: {
            parserOptions: {
                parser: tslint.parser,
            },
        },
    },
    pretty,
);
