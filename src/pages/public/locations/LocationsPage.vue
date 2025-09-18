<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import { faArrowRight, faFilter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn, useTemplateRefsList } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, onDeactivated, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useItemAnimation } from '@/composables/anim/useItemAnimation';
import { useLocationsSearch, useNearestLocation } from '@/composables/data/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useToast } from '@/composables/store/useToast';
import type { Location } from '@/domain/location';
import type { LngLatBounds } from '@/domain/map';

defineOptions({ name: 'LocationsPage' });

const filterStore = useLocationFilters();
const { geoLocation } = storeToRefs(filterStore);
const toast = useToast();
const router = useRouter();

const { data: locations, isPending: locationsIsPending } = useLocationsSearch(filterStore.filters, {
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
const locationRefs = useTemplateRefsList();

const { cleanupAnimation } = useItemAnimation(locationRefs);

const hoveredLocation = ref<Location | null>(null);
const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

const isLoading = computed(() => {
    return locationsIsPending.value;
});

const hasNextPage = computed(() => {
    if (!locations.value) return false;
    return locations.value.page * locations.value.perPage < locations.value.total;
});

watch(locations, (locations) => {
    if (!locations || !locations.data.length) return;
    previousLocationCount.value = locations.data.length;
});

watch(
    [() => mapRef.value?.map.isLoaded, geoLocation],
    ([isLoaded, geoLocation]) => {
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

const handleBoundsChange = useDebounceFn(async (bounds: LngLatBounds | null) => {
    filterStore.updateFilters({ bounds, page: 1 });
}, 400);

function handlePageChange(event: { page: number }): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStore.updateFilters({ page: event.page + 1 });
}

function handleMarkerClick(id: number): void {
    router.push({ name: 'locations.detail', params: { locationId: id } });
}

function handleNearestClick(): void {
    const center = mapRef.value?.map.center.value;
    if (!center) return;
    flyToNearestLocation(center);
}

onDeactivated(() => {
    cleanupAnimation();
});
</script>

<template>
    <div class="flex w-full flex-col items-stretch gap-6 md:flex-row">
        <div class="flex w-full flex-col space-y-6 md:w-1/2">
            <div v-if="isLoading" class="mt-2">
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

                <template v-if="locations && hasNextPage">
                    <p class="text-slate-500">
                        {{ locations.perPage }} van {{ locations.total }}
                        locaties getoond. Gebruik de filters om je zoekopdracht te verfijnen.
                    </p>
                </template>

                <template v-if="!locations?.data?.length">
                    <p class="text-slate-600">Probeer je zoekcriteria of filters aan te passen.</p>
                    <p class="cursor-pointer text-slate-600 underline" @click="handleNearestClick">
                        Vlieg naar dichtstbijzijnde Blokspot
                        <FontAwesomeIcon :icon="faArrowRight" v-if="!isFlyingToNearestLocation" />
                        <FontAwesomeIcon :icon="faSpinner" spin v-else />
                    </p>
                </template>
            </div>

            <div class="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <LocationCardSkeleton v-for="n in previousLocationCount" v-if="isLoading" :key="n">
                </LocationCardSkeleton>

                <div
                    v-for="location in locations.data"
                    v-else-if="locations?.data?.length"
                    :key="location.id"
                    :ref="locationRefs.set">
                    <RouterLink
                        :to="{ name: 'locations.detail', params: { locationId: location.id } }">
                        <LocationCard
                            :location="location"
                            @mouseenter="hoveredLocation = location"
                            @mouseleave="hoveredLocation = null">
                        </LocationCard>
                    </RouterLink>
                </div>
            </div>

            <Paginator
                v-if="locations?.data?.length"
                :first="locations.perPage * (locations.page - 1)"
                :rows="locations.perPage"
                :total-records="locations.total"
                @page="handlePageChange">
            </Paginator>
        </div>
        <div class="flex md:w-1/2">
            <div class="sticky top-4 w-full" :style="{ height: 'calc(100vh - 2rem)' }">
                <BlokMap
                    ref="map"
                    v-model:hovered-location="hoveredLocation"
                    class="border-1 border-slate-200"
                    :locations="locations?.data"
                    :is-loading="isLoading"
                    @update:bounds="handleBoundsChange"
                    @click:marker="handleMarkerClick">
                </BlokMap>
            </div>
        </div>
    </div>
</template>
