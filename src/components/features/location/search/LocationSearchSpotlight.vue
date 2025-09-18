<template>
    <Transition name="fade">
        <div
            v-if="isVisible"
            class="spotlight"
            @click="isVisible = false"
            @keydown.escape="isVisible = false"
            v-focustrap>
            <div class="search" @click.stop>
                <div class="flex items-center">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
                    <input
                        ref="searchInput"
                        v-model="search"
                        type="text"
                        placeholder="Zoek bloklocaties..."
                        class="search-input"
                        aria-label="Zoek naar bloklocaties en locaties"
                        :aria-describedby="hasResults ? 'search-results' : undefined" />

                    <FontAwesomeIcon v-if="isSearching" :icon="faSpinner" class="search-icon" spin>
                    </FontAwesomeIcon>
                    <FontAwesomeIcon
                        v-else
                        :icon="faSliders"
                        class="search-icon"
                        @click="emit('filter')">
                    </FontAwesomeIcon>
                </div>

                <!-- Results Section -->
                <div v-if="hasResults" class="results" aria-label="Zoekresultaten">
                    <!-- Location Results -->
                    <div class="space-y-2" v-if="locations?.data.length">
                        <h3>Bloklocaties</h3>
                        <button
                            v-for="location in locations.data"
                            :key="location.id"
                            type="button"
                            class="result"
                            :aria-label="`Ga naar ${location.name} op ${location.street} ${location.number}, ${location.city}`"
                            @click="handleLocationClick(location)">
                            <div class="result-content">
                                <div>{{ location.name }}</div>
                                <div class="address">
                                    {{ location.street }} {{ location.number }},
                                    {{ location.city }}
                                </div>
                            </div>
                            <FontAwesomeIcon :icon="faChevronRight" class="result-arrow" />
                        </button>
                    </div>

                    <!-- Geolocation Results -->
                    <div class="space-y-2" v-if="geolocations?.length">
                        <h3>Locaties</h3>
                        <button
                            v-for="(geo, index) in geolocations"
                            :key="index"
                            type="button"
                            class="result"
                            :aria-label="`Ga naar ${geo?.name || 'Unknown'} op ${geo?.place_formatted || geo?.full_address || 'No address'}`"
                            @click="handleGeoClick(geo)">
                            <div class="result-content">
                                <div>{{ geo?.name || 'Unknown' }}</div>
                                <div class="address">
                                    {{ geo?.place_formatted || geo?.full_address || 'No address' }}
                                </div>
                            </div>
                            <FontAwesomeIcon :icon="faChevronRight" class="result-arrow" />
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
import { useGeoSearch } from '@/composables/data/useGeoCoding';
import { useLocationsSearch } from '@/composables/data/useLocations';
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

const { data: locations, isPending: isFetchingLocations } = useLocationsSearch(
    computed(() => ({ query: debouncedSearch.value, perPage: 5 })),
    {
        enabled: computed(() => debouncedSearch.value.length >= 2),
    },
);

const { data: geolocations, isPending: isFetchingGeolocations } = useGeoSearch(
    computed(() => ({ search: debouncedSearch.value, limit: 5 })),
    {
        enabled: computed(() => debouncedSearch.value.length >= 2),
    },
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

function handleLocationClick(location: Location) {
    router.push({ name: 'locations.detail', params: { locationId: location.id } });
    isVisible.value = false;
}

function handleGeoClick(geo: GeoJsonProperties) {
    router.push({ name: 'locations' });
    filters.geoLocation.value = geo;
    isVisible.value = false;
}

watch(isVisible, async (newValue) => {
    if (!newValue) return;
    await nextTick();
    searchInput.value?.focus();
});
</script>

<style scoped>
@reference '@/assets/styles/main.css';

.spotlight {
    @apply fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs;
    @apply items-start md:items-center;
    @apply px-3 pt-20 md:pt-0;
}

.search {
    @apply w-full max-w-2xl rounded-2xl bg-white/90 px-6 py-4 backdrop-blur-xs;
    @apply transition-all duration-300 ease-out;
    @apply overflow-hidden;

    .search-icon {
        @apply mr-4 text-xl text-gray-500;

        &:last-child {
            @apply mr-0 ml-4 cursor-pointer hover:text-gray-700;
        }
    }

    .search-input {
        @apply flex-1 border-none bg-transparent text-lg text-gray-700 placeholder-gray-400 outline-none;
    }

    .results {
        @apply mt-4 space-y-3 border-t border-gray-100 pt-4;

        h3 {
            @apply mb-3 text-sm font-medium text-gray-600;
        }

        .result {
            @apply flex w-full cursor-pointer items-center justify-between;
            @apply border-none bg-transparent p-0 text-left;
            @apply transition-all duration-200;

            .result-content .address {
                @apply mt-1 text-sm text-gray-500;
            }

            .result-arrow {
                @apply translate-x-2 transform text-gray-400 opacity-0;
                @apply transition-all duration-200;
            }

            &:hover .result-arrow,
            &:focus .result-arrow {
                @apply translate-x-0 transform opacity-100;
            }

            &:focus {
                @apply outline-none;
            }
        }
    }
}
</style>
