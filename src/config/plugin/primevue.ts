import type { PrimeVueConfiguration } from 'primevue';

export const primevueConfig: PrimeVueConfiguration = {
    ripple: true,
    theme: {
        preset: 'none',
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue',
            },
        },
    },
};
