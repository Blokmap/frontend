import { createApp } from 'vue';
import { BlokmapTheme } from '@/config/theme';
import PrimeVue from 'primevue/config';
import App from '@/App.vue';

const app = createApp(App);

// Register plugins.
app.use(PrimeVue, {
    theme: {
        preset: BlokmapTheme,
        options: {
            prefix: null,
        },
    },
});

// Mount the app.
app.mount('#app');
