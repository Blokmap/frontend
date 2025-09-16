<template>
    <Transition name="fade">
        <div
            v-if="isVisible"
            class="spotlight"
            @click="isVisible = false"
            @keydown.escape="isVisible = false">
            <div class="search" @click.stop>
                <div class="flex items-center">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
                    <input
                        ref="searchInput"
                        v-model="search"
                        type="text"
                        placeholder="Zoek bloklocaties..."
                        class="search-input" />

                    <FontAwesomeIcon v-if="isSearching" :icon="faSpinner" class="search-icon" spin>
                    </FontAwesomeIcon>
                    <FontAwesomeIcon
                        v-else
                        :icon="faFilter"
                        class="search-icon"
                        @click="emit('filter')">
                    </FontAwesomeIcon>
                </div>

                <!-- Results Section -->
                <div v-if="hasResults" class="results">
                    <!-- Location Results -->
                    <div v-if="locations?.data.length">
                        <h3>Bloklocaties</h3>
                        <div
                            v-for="location in locations.data"
                            :key="location.id"
                            class="result"
                            @click="handleLocationClick(location)">
                            <div class="result-content">
                                <div>{{ location.name }}</div>
                                <div class="address">
                                    {{ location.street }} {{ location.number }},
                                    {{ location.city }}
                                </div>
                            </div>
                            <FontAwesomeIcon :icon="faChevronRight" class="result-arrow" />
                        </div>
                    </div>

                    <!-- Geolocation Results -->
                    <div v-if="geolocations?.length">
                        <h3>Locaties</h3>
                        <div
                            v-for="(geo, index) in geolocations"
                            :key="index"
                            class="result"
                            @click="handleGeoClick(geo)">
                            <div class="result-content">
                                <div>{{ geo?.name || 'Unknown' }}</div>
                                <div class="address">
                                    {{ geo?.place_formatted || geo?.full_address || 'No address' }}
                                </div>
                            </div>
                            <FontAwesomeIcon :icon="faChevronRight" class="result-arrow" />
                        </div>
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
    faFilter,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounce } from '@vueuse/core';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGeoSearch } from '@/composables/data/useGeoCoding';
import { useLocationsSearch } from '@/composables/data/useLocations';
import type { Location } from '@/domain/location';

const isVisible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
    filter: [];
}>();

const search = ref('');
const debouncedSearch = useDebounce(search, 500);

const router = useRouter();

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
    return (
        (isFetchingLocations.value || isFetchingGeolocations.value) &&
        debouncedSearch.value.length >= 2
    );
});

const hasResults = computed(() => {
    const hasLocations = locations.value?.data.length || 0;
    const hasGeos = geolocations.value?.length || 0;
    return (hasLocations > 0 || hasGeos > 0) && debouncedSearch.value.length >= 2;
});

function handleLocationClick(location: Location) {
    router.push({ name: 'locations.detail', params: { locationId: location.id } });
    isVisible.value = false;
}

const handleGeoClick = (geo: any) => {
    alert(`Geolocation clicked: ${geo?.name} - ${geo?.place_formatted}`);
};

watch(isVisible, async (newValue) => {
    if (newValue) {
        await nextTick();
        searchInput.value?.focus();
    }
});
</script>

<style scoped>
@reference '@/assets/styles/main.css';

.spotlight {
    @apply fixed inset-0 z-50 flex items-center justify-center bg-black/10;
}

.search {
    @apply w-full max-w-2xl rounded-2xl bg-white/80 px-6 py-4 backdrop-blur-xs;
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
        @apply mt-4 border-t border-gray-100 pt-4;

        h3 {
            @apply mb-3 text-sm font-medium text-gray-600;
        }

        .result {
            @apply flex cursor-pointer items-center justify-between;
            @apply transition-all duration-200;

            .result-content .address {
                @apply mt-1 text-sm text-gray-500;
            }

            .result-arrow {
                @apply translate-x-2 transform text-gray-400 opacity-0;
                @apply transition-all duration-200;
            }

            &:hover .result-arrow {
                @apply translate-x-0 transform opacity-100;
            }
        }
    }
}
</style>
