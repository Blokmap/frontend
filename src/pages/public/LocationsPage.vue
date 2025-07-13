<script lang="ts" setup>
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import { useLocationsSearch } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { type LngLat, type LngLatBounds } from '@/types/contract/Map';
import { useTemplateRefsList } from '@vueuse/core';
import gsap from 'gsap';
import { storeToRefs } from 'pinia';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import { computed, nextTick, ref, watch } from 'vue';

const filterStore = useLocationFilters();
const { filters } = storeToRefs(filterStore);
const locationsSearchQuery = useLocationsSearch(filters);
const locationRefs = useTemplateRefsList();

const center = computed<LngLat | null>(() => {
    if (!filters.value.location?.coordinates) return null;

    return [
        filters.value.location.coordinates.longitude,
        filters.value.location.coordinates.latitude,
    ];
});

const previousLocationCount = ref(filterStore.filters.perPage);
const locationAnim = ref<GSAPTween | null>(null);

const locations = computed(() => locationsSearchQuery.data?.value);
const locationsIsFetching = computed(() => locationsSearchQuery.isFetching.value);

watch(locations, async (locations) => {
    if (!locations || !locations.data?.length) {
        return;
    }

    // Update the previous location count to match the new data length
    previousLocationCount.value = locations.data.length;

    await nextTick();

    // Kill any existing animation to prevent conflicts
    if (locationAnim.value) {
        locationAnim.value.kill();
    }

    locationAnim.value = gsap.fromTo(
        locationRefs.value,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            stagger: {
                amount: 0.5,
                from: 'start',
            },
        },
    );
});

/**
 * Handle marker click events.
 *
 * @param id The ID of the clicked marker.
 */
function handleMarkerClick(id: number): void {
    const locations = locationsSearchQuery.data?.value;
}

/**
 * Handle changes to the map's bounds.
 *
 * @param bounds The new bounds of the map.
 */
function handleBoundsChange(bounds: LngLatBounds): void {
    // When bounds change, update the filters with the new bounds
    // and reset paginatation and location filter
    filterStore.updateFilters({ bounds, page: 1, location: null });
}

/**
 * Handle page changes in the paginator.
 *
 * @param event The pagination event containing the new page number.
 */
function handlePageChange(event: { page: number }): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStore.updateFilters({ page: event.page + 1 });
}
</script>

<template>
    <div class="flex w-full flex-col-reverse items-stretch gap-6 md:flex-row">
        <div class="flex w-full flex-col md:w-4/7">
            <h2 class="mt-5 mb-9 flex items-center justify-between text-lg font-semibold">
                <template v-if="!locations">
                    <Skeleton height="1rem" />
                </template>
                <template v-else-if="locations.data.length">
                    <span v-if="locations.truncated">
                        More than {{ locations.total }} locations found
                    </span>
                    <span v-else> {{ locations.total }} locations found </span>
                </template>
                <template v-else>
                    <span>No locations found</span>
                </template>
            </h2>
            <div class="grid flex-grow grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
                <template v-if="locationsIsFetching">
                    <LocationCardSkeleton v-for="n in previousLocationCount" :key="n" />
                </template>
                <template v-else-if="locations?.data?.length">
                    <div v-for="(location, i) in locations.data" :key="i" :ref="locationRefs.set">
                        <LocationCard :location="location" @click="handleMarkerClick" />
                    </div>
                </template>
            </div>
            <template v-if="locations?.data?.length">
                <div class="mt-8">
                    <Paginator
                        :first="locations.perPage * (locations.page - 1)"
                        :rows="locations.perPage"
                        :total-records="locations.total"
                        @page="handlePageChange">
                    </Paginator>
                </div>
            </template>
        </div>
        <div class="flex md:w-3/7">
            <div
                class="sticky top-[106px] w-full"
                :style="{ height: 'calc(100vh - 106px - 1rem)' }">
                <BlokMap
                    ref="map"
                    :locations="locations?.data"
                    :is-loading="locationsIsFetching"
                    :center="center"
                    @change:bounds="handleBoundsChange"
                    @click:marker="handleMarkerClick">
                </BlokMap>
            </div>
        </div>
    </div>
</template>
