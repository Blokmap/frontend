import { createApp } from 'vue';
import { BlokmapTheme } from '@/config/theme';
import { i18n } from '@/config/i18n';
import App from '@/App.vue';
import PrimeVue from 'primevue/config';

// Create the app.
const app = createApp(App);

// Register plugins.
app.use(i18n);

app.use(PrimeVue, {
    theme: BlokmapTheme
});

// Mount the app.
app.mount('#app');
