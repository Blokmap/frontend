import { createApp } from 'vue';
import { BlokmapThemeConfig } from '@/config/theme.config';
import { I18nPlugin } from '@/config/i18n.config';
import { RouterPlugin } from '@/config/router/router.config';
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
    theme: BlokmapThemeConfig
});

// Register directives.
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);

// Mount the app.
app.mount('#app');
