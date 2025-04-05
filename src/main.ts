import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Ripple, ToastService, Tooltip } from 'primevue';
import { BlokmapThemeConfig } from '@/plugin/themePlugin';
import { I18nPlugin } from '@/plugin/i18nPlugin';
import { RouterPlugin } from '@/router/routerConfig';
import App from '@/App.vue';
import PrimeVuePlugin from 'primevue/config';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(RouterPlugin);
app.use(I18nPlugin);
app.use(ToastService);
app.use(PrimeVuePlugin, {
    theme: BlokmapThemeConfig,
    ripple: true,
});

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

// Mount the app.
app.mount('#app');
