import { useLocalStorage } from '@vueuse/core';
import { watch } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import nlFlag from '@/assets/img/flags/be.svg';
import deFlag from '@/assets/img/flags/de.svg';
import enFlag from '@/assets/img/flags/en.svg';
import frFlag from '@/assets/img/flags/fr.svg';

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_LOCALES = ['en', 'nl', 'fr'] as const;

/**
 * Checks if a locale is supported.
 *
 * @param locale - The locale to check.
 * @returns True if the locale is supported, false otherwise.
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

// Mapping of locale codes to flag images
export const localeFlagImages: Record<string, string> = {
    nl: nlFlag,
    en: enFlag,
    fr: frFlag,
    de: deFlag,
};

// Loader functions for each locale namespace
const localeLoaders: Record<SupportedLocale, Record<string, () => Promise<object>>> = {
    nl: {
        app: () => import('@/assets/locale/nl/app.json'),
        pages: () => import('@/assets/locale/nl/pages.json'),
        components: () => import('@/assets/locale/nl/components.json'),
        permissions: () => import('@/assets/locale/nl/permissions.json'),
    },
    en: {
        app: () => import('@/assets/locale/en/app.json'),
        pages: () => import('@/assets/locale/en/pages.json'),
        components: () => import('@/assets/locale/en/components.json'),
        permissions: () => import('@/assets/locale/nl/permissions.json'),
    },
    fr: {
        app: () => import('@/assets/locale/fr/app.json'),
        pages: () => import('@/assets/locale/fr/pages.json'),
        components: () => import('@/assets/locale/fr/components.json'),
        permissions: () => import('@/assets/locale/nl/permissions.json'),
    },
};

export const persistedLocale = useLocalStorage<string>('locale', 'nl');

export const i18n = createI18n({
    legacy: false,
    locale: persistedLocale.value,
    messages: {
        nl: {},
        en: {},
        fr: {},
    },
});

// Track loaded locales to avoid re-loading
const loadedLocales = new Set<string>();

/**
 * Loads all translation namespaces for a specific locale
 * @param targetLocale - The locale to load (en, nl, fr)
 */
async function loadLocaleMessages(targetLocale: SupportedLocale): Promise<void> {
    // If already loaded, skip
    if (loadedLocales.has(targetLocale)) {
        return;
    }

    const now = performance.now();
    const loaders = localeLoaders[targetLocale];

    if (!loaders) {
        console.warn(`No loaders found for locale: ${targetLocale}`);
        return;
    }

    // Load all namespaces in parallel
    const [app, pages, components, permissions] = await Promise.all([
        loaders.app(),
        loaders.pages(),
        loaders.components(),
        loaders.permissions(),
    ]);

    // Merge all namespaces into a single locale object
    const messages = {
        ...app,
        pages,
        components,
        permissions,
    };

    // Set the locale messages
    i18n.global.setLocaleMessage(targetLocale, messages);
    loadedLocales.add(targetLocale);

    // Log loading time
    const duration = performance.now() - now;
    console.log(`Locale messages loaded for: ${targetLocale} in ${duration.toFixed(2)} ms`);
}

/**
 * Initializes i18n locale loading and watching.
 * Call this once in your app's root component (e.g., App.vue).
 *
 * This function sets up automatic locale loading when the locale changes,
 * and loads the initial locale immediately.
 */
export function setupI18n(): void {
    // Watch for locale changes and automatically load + switch locale
    const { locale } = useI18n();

    watch(
        locale,
        async (newLocale: string) => {
            if (!isSupportedLocale(newLocale)) {
                return;
            }

            await loadLocaleMessages(newLocale);

            i18n.global.locale.value = newLocale;
            persistedLocale.value = newLocale;
        },
        { immediate: true },
    );
}

/**
 * Returns the URL of a flag image based on the country code.
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g., 'BE' for Belgium).
 * @return The URL of the flag image if found, otherwise undefined.
 */
export function getFlagImage(countryCode: string): string | undefined {
    return localeFlagImages[countryCode];
}
