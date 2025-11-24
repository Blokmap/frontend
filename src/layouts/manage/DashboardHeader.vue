<script setup lang="ts">
import Button from 'primevue/button';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { DOCS_URL } from '@/config';

const { locale } = useI18n();
</script>

<template>
    <div class="flex w-full items-center justify-between">
        <a :href="DOCS_URL" target="_blank" rel="noopener noreferrer">
            <Button severity="contrast">
                <FontAwesomeIcon :icon="faBook" />
                <span>Documentatie</span>
            </Button>
        </a>
        <div class="flex items-center gap-3">
            <LanguageSelector v-model="locale" />
        </div>
    </div>
</template>
