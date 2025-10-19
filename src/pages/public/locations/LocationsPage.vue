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
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useToast } from '@/composables/store/useToast';
import { hasNextPage } from '@/utils/pagination';
import type { Location } from '@/domain/location';
import type { LngLatBounds } from '@/domain/map';

defineOptions({ name: 'LocationsPage' });

const filterStore = useLocationFilters();
const toast = useToast();

const { geoLocation } = storeToRefs(filterStore);

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
            summary: 'Fout bij het ophalen van de dichtstbijzijnde locatie',
            detail: 'Probeer het later opnieuw.',
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
 * Handles page change events from the paginator.
 * @param event - The pagination event containing the new page number.
 */
function onPageChange(event: { page: number }): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStore.updateFilters({ page: event.page + 1 });
}

/**
 * Flies the map to the nearest location based on the current center.
 */
function onNearestClick(): void {
    const center = mapRef.value?.map.center.value;
    if (!center) return;
    flyToNearestLocation(center);
}
</script>

<template>
    <div class="flex w-full flex-col items-stretch gap-6 md:flex-row">
        <div class="flex w-full flex-col space-y-6 md:w-1/2">
            <div v-if="locationsIsPending" class="mt-2">
                <Skeleton height="2rem" />
                <Skeleton class="mt-3" height="1rem" />
            </div>

            <div class="space-y-4" v-else>
                <h2 class="flex items-center justify-between text-lg font-semibold">
                    <span>
                        <template v-if="locations?.data?.length">
                            <span v-if="locations.truncated">
                                Meer dan {{ locations.total }} locaties gevonden
                            </span>
                            <span v-else>
                                {{ locations.total }}
                                {{ locations.total === 1 ? 'locatie' : 'locaties' }} gevonden
                            </span>
                        </template>
                        <template v-else>Geen exacte resultaten gevonden</template>
                    </span>

                    <FontAwesomeIcon
                        class="cursor-pointer text-slate-600 hover:text-slate-700"
                        :icon="faFilter">
                    </FontAwesomeIcon>
                </h2>

                <template v-if="locations && hasNextPage(locations)">
                    <p class="text-slate-500">
                        {{ locations.perPage }} van {{ locations.total }}
                        locaties getoond. Gebruik de filters om je zoekopdracht te verfijnen.
                    </p>
                </template>

                <template v-if="!locations?.data?.length">
                    <p class="text-slate-600">Probeer je zoekcriteria of filters aan te passen.</p>
                    <p class="cursor-pointer text-slate-600 underline" @click="onNearestClick">
                        Vlieg naar dichtstbijzijnde Blokspot
                        <FontAwesomeIcon :icon="faArrowRight" v-if="!isFlyingToNearestLocation" />
                        <FontAwesomeIcon :icon="faSpinner" spin v-else />
                    </p>
                </template>
            </div>

            <div class="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <template v-if="locationsIsPending">
                    <LocationCardSkeleton v-for="n in previousLocationCount" :key="n">
                    </LocationCardSkeleton>
                </template>

                <template v-else-if="locations?.data?.length">
                    <RouterLink
                        v-for="location in locations.data"
                        :key="location.id"
                        :to="{ name: 'locations.detail', params: { locationId: location.id } }"
                        class="location-card-link">
                        <LocationCard
                            :location="location"
                            @mouseenter="hoveredLocation = location"
                            @mouseleave="hoveredLocation = null">
                        </LocationCard>
                    </RouterLink>
                </template>
            </div>

            <Paginator
                v-if="locations?.data?.length"
                :first="locations.perPage * (locations.page - 1)"
                :rows="locations.perPage"
                :total-records="locations.total"
                @page="onPageChange">
            </Paginator>
        </div>
        <div class="flex md:w-1/2">
            <div class="sticky top-4 w-full" :style="{ height: 'calc(100vh - 2rem)' }">
                <BlokMap
                    ref="map"
                    v-model:hovered-location="hoveredLocation"
                    class="border-1 border-slate-200"
                    :locations="locations?.data"
                    :is-loading="locationsIsPending"
                    @update:bounds="onBoundsChange">
                </BlokMap>
            </div>
        </div>
    </div>
</template>

<style scoped>
.location-card-link {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
}

.location-card-link:nth-child(1) {
    animation-delay: 0.05s;
}
.location-card-link:nth-child(2) {
    animation-delay: 0.1s;
}
.location-card-link:nth-child(3) {
    animation-delay: 0.15s;
}
.location-card-link:nth-child(4) {
    animation-delay: 0.2s;
}
.location-card-link:nth-child(5) {
    animation-delay: 0.25s;
}
.location-card-link:nth-child(6) {
    animation-delay: 0.3s;
}
.location-card-link:nth-child(7) {
    animation-delay: 0.35s;
}
.location-card-link:nth-child(8) {
    animation-delay: 0.4s;
}
.location-card-link:nth-child(9) {
    animation-delay: 0.45s;
}
.location-card-link:nth-child(10) {
    animation-delay: 0.5s;
}
.location-card-link:nth-child(11) {
    animation-delay: 0.55s;
}
.location-card-link:nth-child(12) {
    animation-delay: 0.6s;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
