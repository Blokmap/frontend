import { createI18n } from 'vue-i18n';
import nl from '@/assets/locale/nl.json';
import en from '@/assets/locale/en.json';
import fr from '@/assets/locale/fr.json';
import de from '@/assets/locale/de.json';
import { useLocalStorage } from '@vueuse/core';

// Configure the i18n instance.
// The initial locale is stored in the local storage.
const locale = useLocalStorage<string>('locale', 'nl');

export const i18n = createI18n({
    legacy: false,
    locale: locale.value,
    fallbackLocale: 'nl',
    messages: { nl, en, fr, de },
});
