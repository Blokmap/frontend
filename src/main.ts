import App from '@/App.vue';
import { i18n } from '@/config/i18n';
import router from '@/router/router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { Ripple, ToastService, Tooltip } from 'primevue';
import PrimeVuePlugin from 'primevue/config';
import { createApp } from 'vue';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                staleTime: 10_000,
            },
        },
    },
});
app.use(ToastService);
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
