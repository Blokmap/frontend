<script lang="ts" setup>
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import { useLocationsSearch } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useDebouncedLoading } from '@/composables/useDebouncedLoading';
import type { LngLatBounds } from '@/types/contract/Map';
import { useDebounce, useTemplateRefsList } from '@vueuse/core';
import gsap from 'gsap';
import { storeToRefs } from 'pinia';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import { nextTick, ref, watch } from 'vue';

const { updateFilters } = useLocationFilters();
const { filters } = storeToRefs(useLocationFilters());
const debouncedFilters = useDebounce(filters, 300);

const { locations, locationsIsFetching } = useLocationsSearch(debouncedFilters);

const isLoading = useDebouncedLoading(locationsIsFetching, 300);

const locationAnim = ref<GSAPTween | null>(null);
const locationRefs = useTemplateRefsList();

watch(locations, async (locations) => {
    if (!locations || !locations.data?.length) {
        return;
    }

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
 * Handle changes to the map's bounds.
 *
 * @param bounds The new bounds of the map.
 */
function handleBoundsChange(bounds: LngLatBounds): void {
    updateFilters({ bounds });
}
</script>

<template>
    <div class="flex w-full flex-col items-stretch gap-8 md:flex-row">
        <div class="flex w-full flex-col md:w-1/2">
            <h2 class="mb-8 font-semibold">
                <template v-if="isLoading">
                    <Skeleton width="" height="1rem" />
                </template>
                <template v-else> Meer dan {{ locations?.total }} locaties gevonden </template>
            </h2>
            <div class="grid flex-grow grid-cols-3 gap-x-3 gap-y-8">
                <template v-if="isLoading">
                    <LocationCardSkeleton v-for="n in 6" :key="n" />
                </template>
                <template v-else-if="locations?.data?.length">
                    <div v-for="(location, i) in locations.data" :key="i" :ref="locationRefs.set">
                        <LocationCard :location="location" />
                    </div>
                </template>
                <template v-else>
                    <p class="mt-4 text-center text-sm text-gray-500">
                        No locations found in this area.
                    </p>
                </template>
            </div>
            <template v-if="locations?.data?.length">
                <div class="mt-8">
                    <Paginator
                        :rows="locations.perPage"
                        :total-records="locations.total"
                        @update:first="console.log" />
                </div>
            </template>
        </div>

        <div class="flex md:w-1/2">
            <div
                class="sticky top-[116px] w-full"
                :style="{ height: 'calc(100vh - 116px - 2rem)' }">
                <BlokMap
                    ref="map"
                    :locations="locations?.data"
                    :is-loading="isLoading"
                    @change:bounds="handleBoundsChange"
                    class="h-full w-full rounded-xl">
                </BlokMap>
            </div>
        </div>
    </div>
</template>
