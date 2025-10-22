<script setup lang="ts">
import LocationSearch from '@/components/features/location/search/LocationSearchButton.vue';
import Logo from '@/components/shared/atoms/Logo.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import MenuButton from '@/components/shared/organisms/MenuButton.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

defineEmits<{
    (e: 'logout'): Promise<void>;
    (e: 'click:search'): void;
}>();

const { locale } = useI18n();

const isExpandedSearch = ref(false);

function onEscapeClick(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    isExpandedSearch.value = false;
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
        <div class="navigation-wrapper">
            <RouterLink :to="{ name: 'locations' }">
                <Logo />
            </RouterLink>

            <div class="actions">
                <MenuButton />
                <LanguageSelector v-model="locale" />
            </div>
        </div>

        <div class="search-wrapper">
            <LocationSearch @click:search="$emit('click:search')" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header-content {
    @apply relative flex flex-col rounded-xl;
    @apply mx-auto w-full items-center justify-center gap-4;

    .navigation-wrapper {
        @apply flex w-full items-center justify-between;
    }

    .search-wrapper {
        @apply w-full md:max-w-[300px];
        @apply md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2;
    }

    .actions {
        @apply flex items-center gap-2;
    }
}
</style>
