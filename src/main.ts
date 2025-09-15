import PrimeVuePlugin from 'primevue/config';
import App from '@/App.vue';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { isAxiosError } from 'axios';
import { createPinia } from 'pinia';
import { ConfirmationService, Ripple, ToastService, Tooltip } from 'primevue';
import { createApp } from 'vue';

import { i18n } from '@/config/locale';
import { router } from '@/config/router';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ToastService);
app.use(ConfirmationService);

app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                retry: function (failureCount, error) {
                    if (isAxiosError(error)) {
                        if (error.response?.status === 404) return false;
                    }

                    if (failureCount >= 3) return false;

                    return true;
                },
                staleTime: 10_000,
            },
        },
    },
});

app.use(PrimeVuePlugin, {
    ripple: true,
    theme: {
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue',
            },
        },
    },
});

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

// Mount the app.
app.mount('#app');
