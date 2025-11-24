<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import { faArrowRight, faFilter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useSearchLocations, useNearestLocation } from '@/composables/data/useLocations';
import { useMapBox } from '@/composables/maps/useMapBox';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { usePagination } from '@/composables/usePagination';
import { hasNextPage } from '@/utils/pagination';
import type { Location, NearestLocation } from '@/domain/location';

defineOptions({ name: 'LocationsPage' });

const filterStore = useLocationFilters();
const { geoLocation, filters, config } = storeToRefs(filterStore);
const { first, onPageChange } = usePagination(filters);

const { data: locations, isPending: locationsIsPending } = useSearchLocations(filters, {
    enabled: computed(() => !!filters.value.bounds),
});

const { mutate: flyToNearestLocation, isPending: isFlyingToNearestLocation } = useNearestLocation(
    async (location: NearestLocation) => {
        return await map.flyTo([location.longitude, location.latitude]);
    },
);

const blokMapRef = useTemplateRef('blokMapRef');
const mapContainerRef = computed(() => blokMapRef.value?.mapContainer ?? null);
const map = useMapBox(mapContainerRef, config.value);

const hoveredLocation = ref<Location | null>(null);
const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

watch(locations, (locations) => {
    if (!locations || !locations.data.length) return;
    previousLocationCount.value = locations.data.length;
});

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
    { deep: true, immediate: true },
);

// Watch for changes in map bounds to update filters
watch(
    map.bounds,
    () => {
        debouncedConfigUpdate();
        debouncedFilterUpdate();
    },
    { deep: true },
);

const debouncedFilterUpdate = useDebounceFn(() => {
    filterStore.updateFilters({ bounds: map.bounds.value, page: 1 });
}, 400);

const debouncedConfigUpdate = useDebounceFn(() => {
    filterStore.updateConfig({ center: map.center.value, zoom: map.zoom.value });
}, 400);

function onNearestClick(): void {
    const center = map.center.value;

    if (center) {
        flyToNearestLocation(center);
    }
}
</script>

<template>
    <div class="page-container">
        <div class="locations-list">
            <div v-if="locationsIsPending" class="mt-2">
                <Skeleton height="2rem" />
                <Skeleton class="mt-3" height="1rem" />
            </div>

            <div class="space-y-4" v-else>
                <h2 class="flex items-center justify-between text-lg font-semibold">
                    <span>
                        <template v-if="locations?.data?.length">
                            <span v-if="locations.truncated">
                                {{
                                    $t(
                                        'pages.locations.filters.foundResultsTruncated',
                                        locations.total,
                                    )
                                }}
                            </span>
                            <span v-else>
                                {{ $t('pages.locations.filters.foundResults', locations.total) }}
                            </span>
                        </template>
                        <template v-else>
                            {{ $t('general.errors.noResultsExact') }}
                        </template>
                    </span>

                    <FontAwesomeIcon
                        class="cursor-pointer text-slate-600 hover:text-slate-700"
                        :icon="faFilter">
                    </FontAwesomeIcon>
                </h2>

                <template v-if="locations && hasNextPage(locations)">
                    <p class="text-slate-500">
                        {{
                            $t(
                                'pages.locations.filters.showingLocations',
                                { perPage: locations.perPage, total: locations.total },
                                locations.perPage,
                            )
                        }}
                    </p>
                </template>

                <template v-if="!locations?.data?.length">
                    <p class="text-slate-600">
                        {{ $t('pages.locations.filters.adjustCriteria') }}
                    </p>
                    <p class="cursor-pointer text-slate-600 underline" @click="onNearestClick">
                        {{ $t('pages.locations.filters.flyToNearest') }}
                        <FontAwesomeIcon :icon="faArrowRight" v-if="!isFlyingToNearestLocation" />
                        <FontAwesomeIcon :icon="faSpinner" spin v-else />
                    </p>
                </template>
            </div>

            <Transition name="fade" mode="out-in">
                <TransitionGroup
                    :key="locations?.data?.map((l) => l.id).join(',')"
                    name="staggered-cards"
                    tag="div"
                    appear
                    class="locations-grid grid grid-cols-2 gap-4 xl:grid-cols-3">
                    <template v-if="locationsIsPending">
                        <div
                            v-for="n in previousLocationCount"
                            :key="`skeleton-${n}`"
                            class="locations-grid__item"
                            :style="{ '--i': n - 1 }">
                            <LocationCardSkeleton></LocationCardSkeleton>
                        </div>
                    </template>

                    <template v-else-if="locations?.data?.length">
                        <div
                            v-for="(location, index) in locations.data"
                            :key="location.id"
                            class="locations-grid__item"
                            :style="{ '--i': index }">
                            <RouterLink
                                class="locations-grid__link"
                                :to="{
                                    name: 'locations.detail',
                                    params: { locationId: location.id },
                                }">
                                <LocationCard
                                    :location="location"
                                    @mouseenter="hoveredLocation = location"
                                    @mouseleave="hoveredLocation = null">
                                </LocationCard>
                            </RouterLink>
                        </div>
                    </template>
                </TransitionGroup>
            </Transition>

            <Paginator
                :first="first(locations)"
                :rows="locations?.perPage"
                :total-records="locations?.total"
                @page="onPageChange">
            </Paginator>
        </div>

        <div class="map-container sticky top-4">
            <BlokMap
                ref="blokMapRef"
                :map="map"
                v-model:hovered-location="hoveredLocation"
                class="w-full shadow-md"
                :style="{ height: 'calc(100vh - 2rem)' }"
                :locations="locations?.data"
                :loading="locationsIsPending">
            </BlokMap>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.page-container {
    @apply flex w-full flex-col items-stretch gap-3;
    @apply md:flex-row md:items-start md:gap-6;
}

.locations-list {
    @apply hidden w-full flex-col space-y-6;
    @apply md:flex md:w-1/2;
}

.map-container {
    @apply -mx-3 -my-4 w-[calc(100%+1.5rem)];
    @apply md:mx-0 md:my-0 md:flex md:w-1/2;
}

.locations-grid {
    position: relative;
}

.locations-grid__item {
    display: block;
}

.locations-grid__link {
    display: block;
    height: 100%;
}

.staggered-cards-enter-active {
    transition-delay: calc(var(--i) * 0.04s);
}

.staggered-cards-leave-active {
    transition-delay: calc(var(--i) * 0.02s);
}
</style>
