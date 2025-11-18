<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFlagImage } from '@/config/i18nConfig';

const language = defineModel<string>();

const { t, locale, availableLocales } = useI18n();

const popoverRef = useTemplateRef('popover');

const currentLocale = computed(() => language.value || locale.value);

function toggleLanguageSelector(event: MouseEvent): void {
    if (popoverRef.value) {
        popoverRef.value.toggle(event);
    }
}

function handleLocaleChange(newLocale: string): void {
    language.value = newLocale;
    popoverRef.value?.hide();
}
</script>

<template>
    <slot
        name="button"
        :toggle="toggleLanguageSelector"
        :current-locale="currentLocale"
        :current-flag="getFlagImage(currentLocale)"
        :current-label="t(`locales.${currentLocale}`)">
        <Button
            class="aspect-square !p-2.5"
            severity="contrast"
            @click="toggleLanguageSelector"
            rounded>
            <template #icon>
                <FontAwesomeIcon :icon="faGlobe" />
            </template>
        </Button>
    </slot>
    <Popover ref="popover" class="rounded-xl shadow-lg" pt:content:class="p-2 min-w-[160px]">
        <nav class="space-y-1">
            <button
                v-for="loc in availableLocales"
                :key="loc"
                @click="handleLocaleChange(loc)"
                :class="['locale-item', { active: loc === currentLocale }]">
                <img
                    :src="getFlagImage(loc)"
                    :alt="t(`locales.${loc}`)"
                    class="h-5 w-5 rounded-sm" />
                <span>{{ t(`locales.${loc}`) }}</span>
            </button>
        </nav>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
.locale-item {
    @apply flex w-full items-center gap-3 rounded-lg px-3 py-2;
    @apply text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50;

    &.active {
        @apply bg-slate-100 text-slate-900;
    }
}
</style>
