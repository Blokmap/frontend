import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const preset = definePreset(Aura, {
    // Customizations go here.
});

export const BlokmapThemeConfig = {
    preset,
    options: {
        prefix: '',
        darkModeSelector: false,
    },
};
