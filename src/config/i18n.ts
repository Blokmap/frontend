import type { TranslationImport } from '@/types/shared/Translation';
import { createI18n } from 'vue-i18n';

// The translation files are loaded using Vite's glob import feature.
// This allows us to load all translation files at once.
const translationFiles = import.meta.glob<TranslationImport>('@/assets/lang/*.json');

// Configure the i18n instance.
export const i18n = createI18n({
    legacy: false,
    locale: 'nl',
    fallbackLocale: 'nl',
    messages: {
        // Lazy loading of translations.
    },
});

/**
 * Loads the locale messages for the specified locale and sets them in the i18n instance.
 *
 * @param locale - The locale identifier (e.g., 'en', 'fr', 'es') for which to load the translation messages.
 * @returns A promise that resolves when the locale messages have been loaded and set.
 *
 * @throws Will log an error to the console if the translation file for the specified locale is not found.
 */
export async function loadLocaleMessages(locale: string): Promise<void> {
    const filePath = `../locales/${locale}.json`;

    if (translationFiles[filePath]) {
        const messages = await translationFiles[filePath]();
        i18n.global.setLocaleMessage(locale, messages.default || {});
    } else {
        console.error(`Translation file for ${locale} not found.`);
    }
}
