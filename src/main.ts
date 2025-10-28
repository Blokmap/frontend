import PrimeVuePlugin from 'primevue/config';
import App from '@/App.vue';
import { init as initSentry } from '@sentry/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { ConfirmationService, FocusTrap, Ripple, ToastService, Tooltip } from 'primevue';
import { createApp } from 'vue';
import { i18n } from '@/config/i18n';
import { vueQueryConfig, primevueConfig } from '@/config/plugin';
import { router } from '@/config/router';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(ToastService);
app.use(ConfirmationService);

app.use(VueQueryPlugin, vueQueryConfig);
app.use(PrimeVuePlugin, primevueConfig);

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.directive('focustrap', FocusTrap);

// Initialize Sentry.
initSentry({
    app,
    dsn: 'https://54b54a00bda878a7de2c7e414b434f64@o4510268643475456.ingest.de.sentry.io/4510268655534160',
    sendDefaultPii: true,
});

// Cache busting
// A bit of a hack but works
let reloaded = false;

window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('dynamically imported module') && !reloaded) {
        window.location.reload();
        reloaded = true;
    }
});

// Mount the app.
app.mount('#app');

export default app;
