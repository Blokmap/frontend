<script lang="ts" setup>
import { getFlagImage } from '@/utils/locale';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale, availableLocales } = useI18n();
const rememberedLocale = useLocalStorage('locale', 'nl');
const popoverRef = useTemplateRef('popover');

/**
 * Toggles the language selection popover.
 */
function toggleLanguageSelector(event: MouseEvent): void {
    if (popoverRef.value) {
        popoverRef.value.toggle(event);
    }
}

/**
 * Handles the change of locale.
 * @param newLocale - The new locale to set.
 */
function handleLocaleChange(newLocale: string): void {
    locale.value = newLocale;
    rememberedLocale.value = newLocale;
    popoverRef.value?.hide();
}
</script>

<template>
    <Button severity="secondary" @click="toggleLanguageSelector" rounded>
        <template #icon>
            <FontAwesomeIcon :icon="faGlobe" />
        </template>
    </Button>
    <Popover pt:content:class="p-0 min-w-[150px]" ref="popover">
        <div class="flex flex-col">
            <template :key="loc" v-for="loc in availableLocales">
                <div
                    class="locale-item"
                    :class="{ active: loc === locale }"
                    @click="handleLocaleChange(loc)">
                    <img :src="getFlagImage(loc)" alt="flag" class="h-6 w-6" />
                    <span class="">{{ t(`app.locales.${loc}`) }}</span>
                </div>
            </template>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.locale-item {
    @apply flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-100;

    &.active {
        @apply bg-primary-100;
    }
}
</style>
