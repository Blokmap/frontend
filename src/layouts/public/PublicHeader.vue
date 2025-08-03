<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import MenuButton from '@/components/features/layout/MenuButton.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import Logo from '@/components/shared/Logo.vue';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { LocationFilter } from '@/types/schema/Filter';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

defineEmits<{ (e: 'logout'): Promise<void> }>();

const { push } = useRouter();

const { filters } = storeToRefs(useLocationFilters());
const locationFilters = useLocationFilters();
const isExpandedSearch = ref(false);

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});

function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.preventDefault();
        isExpandedSearch.value = false;
    }
}

function handleFiltersUpdate(
    newGeoLocation: GeoJSON.GeoJsonProperties | null,
    newFilters: Partial<LocationFilter>,
): void {
    locationFilters.updateFilters(newFilters);
    locationFilters.geoLocation = { ...newGeoLocation }; // Force update the geoLocation
    isExpandedSearch.value = false;
    push({ name: 'locations' });
}
</script>

<template>
    <header class="header">
        <div class="header--wrapper">
            <div class="header--logo">
                <RouterLink :to="{ name: 'locations' }">
                    <Logo />
                </RouterLink>
            </div>

            <LocationSearch
                v-model:is-expanded-search="isExpandedSearch"
                :geo-location="locationFilters.geoLocation"
                :filters="filters"
                @update:filters="handleFiltersUpdate">
            </LocationSearch>

            <div class="header--actions">
                <MenuButton />
                <LanguageSelector />
            </div>
        </div>
    </header>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header {
    @apply dark:border-surface-800 relative z-10 flex rounded-xl;

    .header--wrapper {
        @apply relative mx-auto flex w-full items-center justify-center;
    }

    .header--logo {
        @apply top-[50%] left-0 translate-y-[-50%] sm:absolute;
    }

    .header--actions {
        @apply hidden transform items-center gap-2 sm:absolute sm:top-1 sm:right-0 sm:flex;
    }
}
</style>
