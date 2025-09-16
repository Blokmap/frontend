<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import MenuButton from '@/components/features/layout/MenuButton.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import Logo from '@/components/shared/Logo.vue';
import { useLocalStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRouter } from 'vue-router';
import { useLocationsSearch } from '@/composables/data/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';

defineEmits<{ (e: 'logout'): Promise<void> }>();

const { push } = useRouter();
const { locale } = useI18n();
const rememberedLocale = useLocalStorage('locale', 'nl');

const { filters, geoLocation } = storeToRefs(useLocationFilters());
const locationFilters = useLocationFilters();
const isExpandedSearch = ref(false);

// Get the search query for refetching
const { isFetching, refetch } = useLocationsSearch(filters, { enabled: false });

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});

function handleEscape(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    isExpandedSearch.value = false;
}

function handleSearch(): void {
    // If we have a geo location, just trigger map update
    // (map bounds change will handle refetch)
    if (geoLocation.value) {
        locationFilters.triggerGeoLocationAction();
    } else {
        // Only refetch if no geo location
        // (no map flyTo will happen)
        refetch();
    }

    isExpandedSearch.value = false;
    push({ name: 'locations' });
}

function handleLocaleChange(newLocale: string): void {
    locale.value = newLocale;
    rememberedLocale.value = newLocale;
}
</script>

<template>
    <div class="header-content">
        <div class="logo">
            <RouterLink :to="{ name: 'locations' }">
                <Logo />
            </RouterLink>
        </div>

        <LocationSearch
            v-model:is-expanded-search="isExpandedSearch"
            v-model:geo-location="geoLocation"
            v-model:filters="filters"
            :is-searching="isFetching"
            @search="handleSearch" />

        <div class="actions">
            <MenuButton />
            <LanguageSelector :model-value="locale" @update:model-value="handleLocaleChange" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header-content {
    @apply relative z-10 flex rounded-xl;
    @apply mx-auto w-full items-center justify-center;
}

.logo {
    @apply top-[50%] left-0 translate-y-[-50%] sm:absolute;
}

.actions {
    @apply hidden transform items-center gap-3 sm:absolute sm:top-0 sm:right-0 sm:flex sm:h-full;
}
</style>
