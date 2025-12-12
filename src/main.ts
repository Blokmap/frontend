import PrimeVuePlugin from 'primevue/config';
import App from '@/App.vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { ConfirmationService, FocusTrap, Ripple, ToastService, Tooltip } from 'primevue';
import { createApp } from 'vue';
import { i18n } from '@/config/i18nConfig';
import { vueQueryConfig, primevueConfig } from '@/config/plugin';
import { router } from '@/config/router';
import orangUrl from './orang.txt';

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
// initSentry({
//     app,
//     dsn: '',
//     sendDefaultPii: true,
// });

// // Cache busting
// // A bit of a hack but works
// let reloaded = false;

// window.addEventListener('unhandledrejection', (event) => {
//     if (event.reason?.message?.includes('dynamically imported module') && !reloaded) {
//         window.location.reload();
//         reloaded = true;
//     }
// });

// Mount the app.
app.mount('#app');

// orang
if (import.meta.env.PROD) {
    console.log(await (await fetch(orangUrl)).text());
}

export default app;
