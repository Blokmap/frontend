<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFlagImage } from '@/config/locale';

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
    locale.value = newLocale;
    popoverRef.value?.hide();
}
</script>

<template>
    <slot
        name="button"
        :toggle="toggleLanguageSelector"
        :current-locale="currentLocale"
        :current-flag="getFlagImage(currentLocale)"
        :current-label="t(`app.locales.${currentLocale}`)">
        <Button severity="contrast" @click="toggleLanguageSelector" rounded>
            <template #icon>
                <FontAwesomeIcon :icon="faGlobe" />
            </template>
        </Button>
    </slot>
    <Popover ref="popover" pt:content:class="p-0 min-w-[150px]">
        <div class="flex flex-col">
            <template v-for="loc in availableLocales" :key="loc">
                <div
                    class="locale-item"
                    :class="{ active: loc === currentLocale }"
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
