import { useLocalStorage } from '@vueuse/core';
import { createI18n } from 'vue-i18n';
import nlFlag from '@/assets/img/flags/be.svg';
import deFlag from '@/assets/img/flags/de.svg';
import enFlag from '@/assets/img/flags/en.svg';
import frFlag from '@/assets/img/flags/fr.svg';
import en from '@/assets/locale/en.json';
import nl from '@/assets/locale/nl.json';

export const locale = useLocalStorage<string>('locale', 'nl');

export const localeFlagImages: Record<string, string> = {
    en: enFlag,
    nl: nlFlag,
    fr: frFlag,
    de: deFlag,
};

export const i18n = createI18n({
    legacy: false,
    locale: locale.value,
    fallbackLocale: 'en',
    messages: { nl, en },
});

/**
 * Returns the URL of a flag image based on the country code.
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g., 'BE' for Belgium).
 * @return The URL of the flag image if found, otherwise undefined.
 */
export function getFlagImage(countryCode: string): string | undefined {
    return localeFlagImages[countryCode];
}
