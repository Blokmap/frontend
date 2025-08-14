<script lang="ts" setup>
import { getFlagImage } from '@/utils/locale';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
    modelValue?: string;
}

interface Emits {
    (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 'nl',
});

const emit = defineEmits<Emits>();

const { t, locale, availableLocales } = useI18n();
const popoverRef = useTemplateRef('popover');

const currentLocale = computed(() => props.modelValue || locale.value);

function toggleLanguageSelector(event: MouseEvent): void {
    if (popoverRef.value) {
        popoverRef.value.toggle(event);
    }
}

function handleLocaleChange(newLocale: string): void {
    emit('update:modelValue', newLocale);
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
    <Popover pt:content:class="p-0 min-w-[150px]" ref="popover">
        <div class="flex flex-col">
            <template :key="loc" v-for="loc in availableLocales">
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
