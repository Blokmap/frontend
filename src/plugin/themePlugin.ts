import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

const preset = definePreset(Nora, {
    // Customizations go here.
});

export const BlokmapThemeConfig = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
