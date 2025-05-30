import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/lara';

const preset = definePreset(Aura, {
    primitive: {
        platinum: palette('#d4dadc'),
        tyrian: palette('#560224'),
        linen: palette('#f6efe8'),
        red: palette('#7A3232')
    },
    semantic: {
        primary: palette('#7a3256'),
        colorScheme: {
            contentBackground: '{background.100}',
            overlayModalBackground: '{background.100}',
            light: {
                textColor: '#000',
                background: palette('#f6efe8'),
            },
            dark: {
                textColor: '#fff',
            },
        },
    },
    components: {
        card: {},
        colorScheme: {
            light: {},
        },
    },
});

export const theme = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
