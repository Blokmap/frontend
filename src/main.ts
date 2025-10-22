import PrimeVuePlugin from 'primevue/config';
import App from '@/App.vue';
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

// Mount the app.
app.mount('#app');

// Cache busting
// A bit of a hack but works
let reloaded = false;

window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('dynamically imported module') && !reloaded) {
        window.location.reload();
        reloaded = true;
    }
});

export default app;
