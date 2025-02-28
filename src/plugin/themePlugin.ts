import { definePreset, palette } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

const preset = definePreset(Nora, {
    semantic: {
        primary: palette('#881941'),
    },
});

export const BlokmapThemeConfig = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
