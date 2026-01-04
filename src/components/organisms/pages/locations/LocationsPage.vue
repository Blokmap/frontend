<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import LocationDetailCardSkeleton from '@/components/molecules/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/molecules/location/LocationDetailCard.vue';
import LocationFilterButton from '@/components/molecules/location/search/LocationFilterButton.vue';
import BlokMap from '@/components/molecules/map/BlokMap.vue';
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { refDebounced, useDebounceFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useNearestLocation } from '@/composables/data/useLocations';
import { useMapBox } from '@/composables/maps/useMapBox';
import { useLayoutState } from '@/composables/store/useLayoutState';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { usePagination } from '@/composables/usePagination';
import type { NearestLocation } from '@/domain/location';

// Needed for KeepAlive
defineOptions({ name: 'LocationsPage' });

const filterStore = useLocationFilters();

const { geoLocation, filters, mapConfigCache, isFetching, isPending, locations } =
    storeToRefs(filterStore);

const { showFiltersDialog } = storeToRefs(useLayoutState());
const { first, onPageChange } = usePagination(filters);

const showLoading = refDebounced(
    computed<boolean>(() => isFetching.value || isPending.value),
    150,
);

const { mutate: flyToNearestLocation, isPending: isFlyingToNearestLocation } = useNearestLocation(
    async (location: NearestLocation) => {
        return await map.flyTo([location.longitude, location.latitude]);
    },
);

const onNearestClick = (): void => {
    const center = map.center.value;

    if (center) {
        flyToNearestLocation(center);
    }
};

const blokMapRef = useTemplateRef('blokmap');
const mapContainerRef = computed(() => blokMapRef.value?.$el ?? null);
const map = useMapBox(mapContainerRef, mapConfigCache.value);

const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

// Keep track of previous location count to show skeletons when loading new data
watch(locations, (locations) => {
    if (!locations || !locations.data.length) return;
    previousLocationCount.value = locations.data.length;
});

// Watch for changes in geoLocation to fly the map to that location
watch(
    [geoLocation, map.isLoaded],
    ([geoLocation, isLoaded]) => {
        try {
            if (isLoaded && geoLocation) {
                map.flyTo([geoLocation.coordinates.longitude, geoLocation.coordinates.latitude]);
            }
        } catch (error) {
            console.error('Error flying to geo location:', error);
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

// Watch for changes in map bounds to update filters
watch(map.bounds, () => {
    debouncedConfigCacheUpdate();
    debouncedFilterUpdate();
});

const debouncedConfigCacheUpdate = useDebounceFn(() => {
    filterStore.updateConfigCache({
        center: map.center.value,
        zoom: map.zoom.value,
    });
});

const debouncedFilterUpdate = useDebounceFn(() => {
    filterStore.updateFilters({
        bounds: map.bounds.value,
        page: 1,
    });
}, 400);

const transitionKey = computed<string | undefined>(() => {
    return locations.value?.data.map((l) => l.id).join(',');
});
</script>

<template>
    <div class="locs">
        <div class="locs__sidebar">
            <Skeleton v-if="showLoading" height="2rem" />

            <div v-else class="locs__header">
                <h2 class="locs__title">
                    <span v-if="locations?.data?.length">
                        {{
                            locations.truncated
                                ? $t(
                                      'pages.locations.filters.foundResultsTruncated',
                                      locations.total,
                                  )
                                : $t('pages.locations.filters.foundResults', locations.total)
                        }}
                    </span>
                    <span v-else>{{ $t('general.errors.noResultsExact') }}</span>

                    <LocationFilterButton :filters="filters" @click="showFiltersDialog = true" />
                </h2>

                <p v-if="locations?.data?.length" class="locs__meta">
                    {{
                        $t(
                            'pages.locations.filters.showingLocations',
                            { shown: locations.data.length, total: locations.total },
                            locations.data.length,
                        )
                    }}
                </p>

                <template v-else>
                    <p class="locs__meta">{{ $t('pages.locations.filters.adjustCriteria') }}</p>
                    <p class="locs__meta locs__meta--link" @click="onNearestClick">
                        {{ $t('pages.locations.filters.flyToNearest') }}
                        <FontAwesomeIcon
                            :icon="isFlyingToNearestLocation ? faSpinner : faArrowRight"
                            :spin="isFlyingToNearestLocation">
                        </FontAwesomeIcon>
                    </p>
                </template>
            </div>

            <div v-if="showLoading" class="locs-grid">
                <div v-for="n in previousLocationCount" :key="n">
                    <LocationDetailCardSkeleton />
                </div>
            </div>

            <Transition v-else name="fade" mode="out-in">
                <TransitionGroup
                    v-if="!showLoading"
                    :key="transitionKey"
                    name="staggered-cards"
                    class="locs-grid"
                    tag="div"
                    appear>
                    <div
                        v-for="(location, index) in locations?.data"
                        :key="location.id"
                        :style="{ '--i': index }">
                        <LocationDetailCard
                            :to="{ name: 'locations.detail', params: { locationId: location.id } }"
                            :location="location"
                            :show-navigation-buttons="false">
                        </LocationDetailCard>
                    </div>
                </TransitionGroup>
            </Transition>

            <Paginator
                v-if="locations?.data.length"
                :first="first(locations)"
                :rows="locations?.perPage"
                :total-records="locations?.total"
                @page="onPageChange">
            </Paginator>
        </div>

        <div class="locs__map">
            <BlokMap
                ref="blokmap"
                class="locs__map-inner"
                :map="map"
                :locations="locations?.data"
                :loading="showLoading">
            </BlokMap>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.locs {
    @apply flex w-full flex-col items-stretch gap-3 lg:flex-row lg:items-start lg:gap-6;
    @apply lg:py-6;

    .locs__sidebar {
        @apply hidden w-full flex-col space-y-6 lg:flex lg:w-1/2;
    }

    .locs__header {
        @apply space-y-4;
    }

    .locs__title {
        @apply flex items-center justify-between text-2xl font-bold;
    }

    .locs__meta {
        @apply text-slate-500;

        &.locs__meta--link {
            @apply cursor-pointer underline;
        }
    }

    .locs-grid {
        @apply relative grid grid-cols-2 gap-6 xl:grid-cols-3;
    }

    .locs__map {
        @apply sticky top-4 lg:flex lg:w-1/2;

        .locs__map-inner {
            @apply h-[calc(100vh-2rem)] shadow-md;
        }
    }
}
</style>
