<template>
    <Teleport to="body">
        <Transition name="spotlight">
            <div v-if="isVisible" class="spotlight-overlay" @click="closeSpotlight">
                <div class="spotlight-container" @click.stop>
                    <!-- Search Bar -->
                    <div class="search-wrapper" :class="{ 'search-active': isSearchActive }">
                        <div class="search-bar">
                            <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
                            <input
                                ref="searchInput"
                                v-model="searchQuery"
                                type="text"
                                placeholder="Zoek bloklocaties..."
                                class="search-input"
                                @focus="onSearchFocus"
                                @blur="onSearchBlur" />
                        </div>
                    </div>

                    <!-- Search Results Container -->
                    <div v-if="isSearchActive && searchQuery.length > 0" class="results-container">
                        <div v-if="isLoading" class="results-loading">
                            <FontAwesomeIcon :icon="faSpinner" class="spinner" spin />
                            <span>Zoeken...</span>
                        </div>

                        <div v-if="locationResults?.data" class="results">
                            <div
                                v-for="(location, index) in locationResults.data"
                                :key="location.id"
                                class="result-item slide-in-right"
                                :style="{ animationDelay: `${index * 50}ms` }">
                                <FontAwesomeIcon
                                    :icon="faMapMarkerAlt"
                                    style="
                                        color: rgb(59 130 246);
                                        font-size: 1.125rem;
                                        flex-shrink: 0;
                                    " />
                                <div style="flex: 1; min-width: 0">
                                    <div class="result-title">{{ location.name }}</div>
                                    <div class="result-subtitle">{{ location.city }}</div>
                                </div>
                            </div>
                        </div>

                        <div v-if="!isLoading && hasNoResults" class="no-results">
                            <FontAwesomeIcon :icon="faSearch" style="font-size: 1.125rem" />
                            <span>Geen resultaten gevonden</span>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import {
    faMagnifyingGlass,
    faMapMarkerAlt,
    faSearch,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useLocationsSearch } from '@/composables/data/useLocations';

const isVisible = defineModel<boolean>('visible', { default: false });

const searchQuery = ref('');
const isSearchActive = ref(false);
const searchInput = useTemplateRef<HTMLInputElement>('searchInput');

const locationFilters = computed(() => ({
    query: searchQuery.value,
    perPage: 5,
    page: 1,
}));

const { data: locationResults, isFetching: locationsFetching } = useLocationsSearch(
    locationFilters,
    {
        enabled: computed(() => searchQuery.value.length > 0),
    },
);

const isLoading = computed(() => locationsFetching.value);

const hasNoResults = computed(() => {
    if (searchQuery.value.length === 0) return false;
    return locationResults.value && locationResults.value.data.length === 0;
});

function closeSpotlight() {
    isVisible.value = false;
    searchQuery.value = '';
    isSearchActive.value = false;
}

function onSearchFocus() {
    isSearchActive.value = true;
}

function onSearchBlur() {
    if (!searchQuery.value) {
        isSearchActive.value = false;
    }
}

function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible.value) {
        event.preventDefault();
        closeSpotlight();
    }
}

watch(isVisible, async (newValue) => {
    if (newValue) {
        await nextTick();
        searchInput.value?.focus();
    } else {
        searchQuery.value = '';
        isSearchActive.value = false;
    }
});

onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
@reference '@/assets/styles/main.css';

.spotlight-overlay {
    @apply fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 backdrop-blur-sm;
}

.spotlight-container {
    @apply flex w-full max-w-2xl flex-col px-6;
}

.search-wrapper {
    @apply transform transition-all duration-300 ease-out;

    &.search-active {
        @apply -translate-y-8;
    }

    .search-bar {
        @apply flex items-center rounded-2xl bg-white/75 px-6 py-4 backdrop-blur-xs;

        .search-icon {
            @apply mr-4 text-xl text-gray-400;
        }

        .search-input {
            @apply flex-1 border-none bg-transparent text-lg text-gray-900 placeholder-gray-500 outline-none;
        }
    }
}

.results-container {
    @apply mt-4 max-h-96 overflow-y-auto rounded-xl bg-white/80;

    .results-loading {
        @apply flex items-center justify-center gap-3 py-8 text-gray-500;

        .spinner {
            @apply text-lg;
        }
    }

    .results {
        @apply divide-y divide-gray-100;

        .result-item {
            @apply flex cursor-pointer items-center gap-4 p-4 transition-all duration-200 hover:bg-gray-50;

            .result-title {
                @apply truncate font-medium text-gray-900;
            }

            .result-subtitle {
                @apply truncate text-sm text-gray-500;
            }
        }
    }

    .no-results {
        @apply flex items-center justify-center gap-3 py-8 text-gray-500;
    }
}

.spotlight-enter-active {
    @apply transition-all duration-200;

    .spotlight-container {
        @apply transition-all duration-200;
    }
}

.spotlight-leave-active {
    @apply transition-all duration-150;

    .spotlight-container {
        @apply transition-all duration-150;
    }
}

.spotlight-enter-from,
.spotlight-leave-to {
    @apply opacity-0;

    .spotlight-container {
        @apply -translate-y-4 scale-95 transform;
    }
}
</style>
