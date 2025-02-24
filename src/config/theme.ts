import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const preset = definePreset(Aura, {
    // Customizations go here.
});

export const BlokmapTheme = {
    preset,
    options: {
        prefix: null,
    },
};
