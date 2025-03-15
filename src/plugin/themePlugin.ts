import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const preset = definePreset(Aura, {
    primitive: {
        platinum: palette('#d4dadc'),
        tyrian: palette('#560224'),
    },
    semantic: {
        primary: palette('#60809d'),
        overlayModalPadding: '1rem',
        colorScheme: {
            light: {
                textColor: '#000',
            },
        },
    },
});

export const BlokmapThemeConfig = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
