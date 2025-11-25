<template>
    <Transition name="fade">
        <div
            v-if="isVisible"
            class="spotlight"
            @click="isVisible = false"
            @keydown.escape="isVisible = false"
            v-focustrap>
            <div class="container" @click.stop>
                <div class="flex w-full items-center gap-2.5">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" class="h-4 w-4 text-slate-500" />

                    <input
                        ref="searchInput"
                        v-model="search"
                        type="text"
                        placeholder="Zoek bloklocaties..."
                        class="flex-1 border-none bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none"
                        aria-label="Zoek naar bloklocaties en locaties"
                        :aria-describedby="hasResults ? 'search-results' : undefined" />

                    <button
                        v-if="!isSearching"
                        type="button"
                        class="filter-button"
                        @click="emit('filter')"
                        aria-label="Open filters">
                        <FontAwesomeIcon :icon="faSliders" class="h-3.5 w-3.5 text-slate-600" />
                    </button>
                    <div v-else class="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                        <FontAwesomeIcon :icon="faSpinner" class="text-primary-400 h-5 w-5" spin />
                    </div>
                </div>

                <!-- Results Section -->
                <div
                    v-if="hasResults"
                    class="mt-3 space-y-4 border-t-2 border-gray-100 pt-3"
                    aria-label="Zoekresultaten">
                    <!-- Location Results -->
                    <div class="space-y-2" v-if="locations?.data.length">
                        <h3 class="mb-3 text-sm font-semibold text-gray-600">Bloklocaties</h3>
                        <button
                            v-for="location in locations.data"
                            :key="location.id"
                            type="button"
                            class="result-item"
                            :aria-label="`Ga naar ${location.name} op ${location.street} ${location.number}, ${location.city}`"
                            @click="onLocationClick(location)">
                            <div class="min-w-0 flex-1">
                                <div class="truncate font-medium text-gray-800">
                                    {{ location.name }}
                                </div>
                                <div class="mt-1 truncate text-sm text-gray-500">
                                    {{ location.street }} {{ location.number }},
                                    {{ location.city }}
                                </div>
                            </div>
                            <FontAwesomeIcon
                                :icon="faChevronRight"
                                class="h-4 w-4 flex-shrink-0 translate-x-2 transform text-gray-400 opacity-0 transition-all duration-200">
                            </FontAwesomeIcon>
                        </button>
                    </div>

                    <!-- Geolocation Results -->
                    <div class="space-y-2" v-if="geolocations?.length">
                        <h3 class="mb-3 text-sm font-semibold text-gray-600">Locaties</h3>
                        <button
                            v-for="(geo, index) in geolocations"
                            :key="index"
                            type="button"
                            class="result-item"
                            :aria-label="`Ga naar ${geo?.name || 'Unknown'} op ${geo?.place_formatted || geo?.full_address || 'No address'}`"
                            @click="onGeoClick(geo)">
                            <div class="min-w-0 flex-1">
                                <div class="truncate font-medium text-gray-800">
                                    {{ geo?.name || 'Unknown' }}
                                </div>
                                <div class="mt-1 truncate text-sm text-gray-500">
                                    {{ geo?.place_formatted || geo?.full_address || 'No address' }}
                                </div>
                            </div>
                            <FontAwesomeIcon
                                :icon="faChevronRight"
                                class="h-4 w-4 flex-shrink-0 translate-x-2 transform text-gray-400 opacity-0 transition-all duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import {
    faMagnifyingGlass,
    faSpinner,
    faChevronRight,
    faSliders,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounce } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchGeoLocations } from '@/composables/data/useGeoCoding';
import { useSearchLocations } from '@/composables/data/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { Location } from '@/domain/location';
import type { GeoJsonProperties } from 'geojson';

const isVisible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
    filter: [];
}>();

const search = ref('');
const debouncedSearch = useDebounce(search, 500);

const router = useRouter();
const filters = storeToRefs(useLocationFilters());

const enabled = computed(() => debouncedSearch.value.length >= 2);

const { data: locations, isFetching: isFetchingLocations } = useSearchLocations(
    computed(() => ({ query: debouncedSearch.value, perPage: 5 })),
    { enabled },
);

const { data: geolocations, isFetching: isFetchingGeolocations } = useSearchGeoLocations(
    computed(() => ({ search: debouncedSearch.value, limit: 5 })),
    { enabled },
);

const searchInput = useTemplateRef<HTMLInputElement>('searchInput');

const isSearching = computed(() => {
    return isFetchingLocations.value || isFetchingGeolocations.value;
});

const hasResults = computed(() => {
    const hasLocations = locations.value?.data.length || 0;
    const hasGeos = geolocations.value?.length || 0;
    return hasLocations > 0 || hasGeos > 0;
});

// Focus the search input when the spotlight becomes visible
watch(isVisible, async (newValue) => {
    if (!newValue) return;
    await nextTick();
    searchInput.value?.focus();
});

function onLocationClick(location: Location) {
    router.push({ name: 'locations.detail', params: { locationId: location.id } });
    isVisible.value = false;
}

function onGeoClick(geo: GeoJsonProperties) {
    router.push({ name: 'locations' });
    filters.geoLocation.value = geo;
    isVisible.value = false;
}
</script>

<style scoped>
@reference '@/assets/styles/main.css';

.spotlight {
    @apply fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-xs;
    @apply px-3 pt-20;
}

.container {
    @apply w-full max-w-2xl overflow-hidden;
    @apply rounded-xl bg-white px-4 py-3;
    @apply border-primary-200 border-3;
    @apply shadow-playful;
    @apply transition-all duration-300 ease-out;
    --shadow-color: var(--p-primary-200);
    --shadow-size: 0.35rem;
}

.filter-button {
    @apply flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full;
    @apply bg-slate-100 transition-colors duration-150;
    @apply cursor-pointer border-none;

    &:hover {
        @apply bg-slate-200;
    }

    &:focus-visible {
        @apply outline-primary-500 outline-2 outline-offset-2;
    }
}

.result-item {
    @apply flex w-full cursor-pointer items-center justify-between gap-3;
    @apply rounded-2xl border-2 border-transparent bg-transparent p-3;
    @apply text-left transition-all duration-200;

    &:hover {
        @apply bg-gray-50;
    }

    &:hover svg {
        @apply text-primary-400 translate-x-0 opacity-100;
    }

    &:focus-visible {
        @apply border-primary-400 bg-gray-50 outline-none;
    }

    &:focus-visible svg {
        @apply translate-x-0 opacity-100;
    }
}
</style>
