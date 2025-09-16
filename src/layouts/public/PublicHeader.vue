<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import MenuButton from '@/components/features/layout/MenuButton.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import Logo from '@/components/shared/Logo.vue';
import { useLocalStorage } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

defineEmits<{
    (e: 'logout'): Promise<void>;
    (e: 'click:search'): void;
}>();

const { locale } = useI18n();
const rememberedLocale = useLocalStorage('locale', 'nl');

const isExpandedSearch = ref(false);

function onEscapeClick(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    isExpandedSearch.value = false;
}

function onLocaleChange(newLocale: string): void {
    locale.value = newLocale;
    rememberedLocale.value = newLocale;
}

onMounted(() => {
    window.addEventListener('keydown', onEscapeClick);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onEscapeClick);
});
</script>

<template>
    <div class="header-content">
        <div class="logo">
            <RouterLink :to="{ name: 'locations' }">
                <Logo />
            </RouterLink>
        </div>

        <LocationSearch @click:search="$emit('click:search')" />

        <div class="actions">
            <MenuButton />
            <LanguageSelector :model-value="locale" @update:model-value="onLocaleChange" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header-content {
    @apply relative z-10 flex rounded-xl;
    @apply mx-auto w-full items-center justify-center;

    .logo {
        @apply absolute top-[50%] left-0 translate-y-[-50%];
    }

    .actions {
        @apply absolute top-0 right-0 flex h-full transform items-center gap-2;
    }
}
</style>
