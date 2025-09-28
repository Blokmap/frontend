<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import Breadcrumbs from '@/components/shared/organisms/Breadcrumbs.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>

<template>
    <div class="flex w-full items-center justify-between">
        <Breadcrumbs />
        <LanguageSelector v-model="locale" />
    </div>
</template>
