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
import { useI18n } from 'vue-i18n';
import { useSearchLocations, useNearestLocation } from '@/composables/data/useLocations';
import { usePagination } from '@/composables/data/usePagination';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useToast } from '@/composables/store/useToast';
import { hasNextPage } from '@/utils/pagination';
import type { Location } from '@/domain/location';
import type { LngLatBounds } from '@/domain/map';

defineOptions({ name: 'LocationsPage' });

const filterStore = useLocationFilters();
const toast = useToast();
const i18n = useI18n();

const { geoLocation, filters } = storeToRefs(filterStore);
const { first, onPageChange } = usePagination(filters);

const { data: locations, isPending: locationsIsPending } = useSearchLocations(filterStore.filters, {
    enabled: computed(() => !!filterStore.filters.bounds),
});

const { mutate: flyToNearestLocation, isPending: isFlyingToNearestLocation } = useNearestLocation({
    onSuccess: (location) => {
        const map = mapRef.value?.map;
        map?.flyTo([location.longitude, location.latitude]);
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: i18n.t('domains.locations.errors.fetchNearest'),
            detail: i18n.t('domains.locations.errors.tryAgainLater'),
        });
    },
});

const mapRef = useTemplateRef('map');

const hoveredLocation = ref<Location | null>(null);
const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

watch(locations, (locations) => {
    if (!locations || !locations.data.length) return;
    previousLocationCount.value = locations.data.length;
});

watch(
    [geoLocation, () => mapRef.value?.map.isLoaded],
    ([geoLocation, isLoaded]) => {
        try {
            if (isLoaded && geoLocation) {
                mapRef.value?.map.flyTo([
                    geoLocation.coordinates.longitude,
                    geoLocation.coordinates.latitude,
                ]);
            }
        } catch (error) {
            console.error('Error flying to geo location:', error);
        }
    },
    { deep: true, immediate: true },
);

/**
 * Handles bounds change events from the map.
 * @param bounds - The new bounds of the map.
 */
const onBoundsChange = useDebounceFn(async (bounds: LngLatBounds | null) => {
    filterStore.updateFilters({ bounds, page: 1 });
}, 400);

/**
 * Flies the map to the nearest location based on the current center.
 */
function onNearestClick(): void {
    const center = mapRef.value?.map.center.value;

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
                <h2
                    class="flex items-center justify-between text-lg font-semibold"
                    data-testid="locations-title">
                    <span>
                        <template v-if="locations?.data?.length">
                            <span v-if="locations.truncated">
                                {{
                                    $t('pages.locations.filters.foundResultsTruncated', [
                                        locations.total,
                                    ])
                                }}
                            </span>
                            <span v-else>
                                {{ $t('pages.locations.filters.foundResults', [locations.total]) }}
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

            <div class="grid grid-cols-2 gap-4 xl:grid-cols-3" data-testid="locations-grid">
                <template v-if="locationsIsPending">
                    <LocationCardSkeleton v-for="n in previousLocationCount" :key="n">
                    </LocationCardSkeleton>
                </template>

                <template v-else-if="locations?.data?.length">
                    <RouterLink
                        v-for="location in locations.data"
                        :key="location.id"
                        :to="{ name: 'locations.detail', params: { locationId: location.id } }"
                        class="location-card-link"
                        data-testid="location-card-link">
                        <LocationCard
                            :location="location"
                            @mouseenter="hoveredLocation = location"
                            @mouseleave="hoveredLocation = null">
                        </LocationCard>
                    </RouterLink>
                </template>
            </div>

            <Paginator
                :first="first(locations)"
                :rows="locations?.perPage"
                :total-records="locations?.total"
                @page="onPageChange">
            </Paginator>
        </div>

        <div class="map-container">
            <div class="sticky top-4 w-full" :style="{ height: 'calc(100vh - 2rem)' }">
                <BlokMap
                    ref="map"
                    v-model:hovered-location="hoveredLocation"
                    class="shadow-md"
                    data-testid="locations-map"
                    :locations="locations?.data"
                    :loading="locationsIsPending"
                    @update:bounds="onBoundsChange">
                </BlokMap>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.page-container {
    @apply flex w-full flex-col items-stretch gap-3;
    @apply md:flex-row md:gap-6;
}

.locations-list {
    @apply hidden w-full flex-col space-y-6;
    @apply md:flex md:w-1/2;
}

.map-container {
    @apply -mx-3 -my-4 w-[calc(100%+1.5rem)];
    @apply md:mx-0 md:my-0 md:flex md:w-1/2;
}
</style>
