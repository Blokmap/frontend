import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const preset = definePreset(Aura, {
    semantic: {
        primary: palette('#78a0c5'),
    },
});

export const BlokmapThemeConfig = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
