<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { getFlagImage } from '@/config/i18nConfig';

defineProps<{
    locale: string;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="flex items-center gap-2 text-xs">
        <img :src="getFlagImage(locale)" :alt="t(`locales.${locale}`)" class="h-5 w-5 rounded-sm" />
        <span>{{ t(`locales.${locale}`) }}</span>
    </div>
</template>
