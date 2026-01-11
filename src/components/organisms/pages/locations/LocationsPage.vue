<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import LocationDetailCardSkeleton from '@/components/molecules/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/molecules/location/LocationDetailCard.vue';
import BlokMap from '@/components/molecules/map/BlokMap.vue';
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { refDebounced, useDebounceFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNearestLocation } from '@/composables/data/useLocations';
import { useMapBox } from '@/composables/maps/useMapBox';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { usePagination } from '@/composables/usePagination';
import PageContent from '../PageContent.vue';
import type { NearestLocation } from '@/domain/location';

// Needed for KeepAlive
defineOptions({ name: 'LocationsPage' });

defineProps<{ headerHeight: number }>();

const router = useRouter();
const filterStore = useLocationFilters();

const { geoLocation, filters, mapConfigCache, isFetching, isPending, locations } =
    storeToRefs(filterStore);

const { first, onPageChange } = usePagination(filters);

const hasLocations = computed<boolean>(() => {
    return !!locations.value?.data.length;
});

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

const blokMapRef = useTemplateRef<InstanceType<typeof BlokMap>>('blokmap');
const mapContainerRef = computed<HTMLElement | null>(() => blokMapRef.value?.$el);
const map = useMapBox(mapContainerRef, mapConfigCache.value);

const onLocationClick = (locationId: number) => {
    router.push({ name: 'locations.detail', params: { locationId } });
};

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
    <PageContent class="locations">
        <section class="locations__list">
            <Skeleton v-if="showLoading" height="2rem" />

            <div v-else ref="locationsHeader" class="locations__header">
                <div class="locations__drawer-ribbon"></div>
                <h2 class="locations__title">
                    <template v-if="hasLocations && locations?.truncated">
                        {{ $t('pages.locations.filters.foundResultsTruncated', locations.total) }}
                    </template>
                    <template v-else-if="hasLocations && locations">
                        {{ $t('pages.locations.filters.foundResults', locations?.total) }}
                    </template>
                    <template v-else>
                        {{ $t('general.errors.noResultsExact') }}
                    </template>
                </h2>

                <template v-if="!showLoading && !hasLocations">
                    <p class="locations__meta">
                        {{ $t('pages.locations.filters.adjustCriteria') }}
                    </p>
                    <p class="locations__meta locations__meta--link" @click="onNearestClick">
                        {{ $t('pages.locations.filters.flyToNearest') }}
                        <FontAwesomeIcon
                            :icon="isFlyingToNearestLocation ? faSpinner : faArrowRight"
                            :spin="isFlyingToNearestLocation">
                        </FontAwesomeIcon>
                    </p>
                </template>
            </div>

            <div v-if="showLoading" ref="locationsGrid" class="locations-grid">
                <LocationDetailCardSkeleton v-for="n in previousLocationCount" :key="n" />
            </div>

            <Transition v-else name="fade" mode="out-in">
                <TransitionGroup
                    v-if="!showLoading"
                    ref="locationsGrid"
                    :key="transitionKey"
                    name="staggered-cards"
                    class="locations-grid"
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
        </section>
        <section class="locations__map">
            <BlokMap
                ref="blokmap"
                class="locations__map-inner"
                :map="map"
                :locations="locations?.data"
                :loading="showLoading"
                @click:location="onLocationClick">
            </BlokMap>
        </section>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.locations {
    @apply flex flex-row gap-8;
}

.locations__list {
    @apply z-2 w-full flex-col space-y-8 lg:flex lg:w-3/5;
    @apply mt-[calc(100vh-155px)] -mb-6 p-4 pb-12 md:p-0 lg:mt-0;
    @apply rounded-2xl bg-white md:bg-transparent;

    .locations-grid {
        @apply relative grid grid-cols-1 gap-6 xl:grid-cols-3;
    }

    .locations__header {
        @apply space-y-4;
        @apply cursor-pointer lg:cursor-default;
        @apply flex flex-col items-center lg:items-start;
        @apply relative;

        .locations__drawer-ribbon {
            @apply h-1.5 w-12 rounded-full bg-slate-300 lg:hidden;
            @apply mb-4;
        }

        .locations__title {
            @apply font-bold;
            @apply text-center lg:text-left;
        }

        .locations__meta {
            @apply text-slate-500;
            @apply text-center lg:text-left;

            &.locations__meta--link {
                @apply cursor-pointer underline;
            }
        }
    }
}

.locations__map {
    @apply fixed top-0 left-0 z-1 h-full w-full lg:sticky lg:top-0 lg:flex lg:w-2/5;

    .locations__map-inner {
        @apply h-full w-full lg:h-[calc(100vh-2rem)] lg:rounded-xl lg:shadow-md;
    }
}
</style>
