import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Ripple, ToastService, Tooltip } from 'primevue';
import { theme } from '@/config/theme';
import { i18n } from '@/config/i18n';
import { router } from '@/router/router';
import App from '@/App.vue';
import PrimeVuePlugin from 'primevue/config';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ToastService);
app.use(PrimeVuePlugin, {
    theme: theme,
    ripple: true,
});

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

// Mount the app.
app.mount('#app');
