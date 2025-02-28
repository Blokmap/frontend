import { createApp } from 'vue';
import { BlokmapThemeConfig } from '@/plugin/themePlugin';
import { I18nPlugin } from '@/plugin/i18nPlugin';
import { RouterPlugin } from '@/router/routerConfig';
import { Ripple, Tooltip } from 'primevue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import PrimeVuePlugin from 'primevue/config';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(createPinia());
app.use(RouterPlugin);
app.use(I18nPlugin);
app.use(PrimeVuePlugin, {
    theme: BlokmapThemeConfig,
});

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

// Mount the app.
app.mount('#app');
