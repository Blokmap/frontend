<script lang="ts" setup>
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import { useItemAnimation } from '@/composables/anim/useItemAnimation';
import { useLocationsSearch } from '@/composables/data/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useToast } from '@/composables/useToast';
import { getNearestLocation } from '@/services/location';
import type { LngLat, LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faFilter, faHelicopter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRefsList } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import { ref, useTemplateRef, watch } from 'vue';

const filterStore = useLocationFilters();
const toast = useToast();
const { filters, geoLocation } = storeToRefs(filterStore);
const { data: locations, isFetching: locationsIsFetching } = useLocationsSearch(filters);

const isFetchingNearest = ref(false);
const hoveredLocation = ref<Location | null>(null);
const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

const mapRef = useTemplateRef('map');
const locationRefs = useTemplateRefsList();

watch(locations, (locations) => {
    if (!locations || !locations.data?.length) {
        return;
    }

    previousLocationCount.value = locations.data.length;
});

watch(
    [() => mapRef.value?.map.isLoaded, geoLocation],
    ([isLoaded, location]) => {
        try {
            if (!isLoaded || !location || !location.coordinates) {
                return;
            }
            const destination: LngLat = [
                location.coordinates.longitude,
                location.coordinates.latitude,
            ];
            mapRef.value?.map.flyTo(destination);
        } catch (error) {
            console.error('Error flying to geo location:', error);
        }
    },
    { immediate: true, deep: true },
);

useItemAnimation(locationRefs);

function handleBoundsChange(bounds: LngLatBounds): void {
    filterStore.updateFilters({ bounds, page: 1 });
}

function handlePageChange(event: { page: number }): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStore.updateFilters({ page: event.page + 1 });
}

async function flyToNearestLocation(): Promise<void> {
    if (!mapRef.value) return;

    try {
        isFetchingNearest.value = true;
        const location = await getNearestLocation(mapRef.value.map.getCenter() as LngLat);
        await mapRef.value.map.flyTo([location.longitude, location.latitude]);
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij het ophalen van de dichtstbijzijnde locatie',
            detail: 'Probeer het later opnieuw.',
        });
    } finally {
        isFetchingNearest.value = false;
    }
}
</script>

<template>
    <div class="flex w-full flex-col-reverse items-stretch gap-6 md:flex-row">
        <div class="flex w-full flex-col md:w-4/7">
            <div class="mb-8">
                <template v-if="locationsIsFetching">
                    <div class="mt-2">
                        <Skeleton height="2rem" />
                        <Skeleton class="mt-3" height="1rem" />
                    </div>
                </template>

                <template v-else>
                    <h2 class="mb-3 flex items-center justify-between text-xl font-semibold">
                        <span>
                            <template v-if="locations?.data?.length">
                                <template v-if="locations.truncated">
                                    Meer dan {{ locations.total }}
                                    <span class="text-gradient-conic">Blokspots</span> gevonden
                                </template>
                                <template v-else>
                                    {{ locations.total }}
                                    <span class="text-gradient-conic">Blokspots</span> gevonden
                                </template>
                            </template>
                            <template v-else> Geen exacte resultaten gevonden </template>
                        </span>

                        <Button size="small" severity="contrast" @click="() => {}" outlined rounded>
                            <template #icon>
                                <FontAwesomeIcon :icon="faFilter" />
                            </template>
                        </Button>
                    </h2>

                    <template v-if="locations?.data?.length">
                        <p class="text-slate-500" v-if="locations.total > locations.perPage">
                            {{ locations.perPage }} van {{ locations.total }}
                            <span class="text-gradient-conic">Blokspots</span> getoond. Gebruik de
                            filters om je zoekopdracht te verfijnen.
                        </p>
                        <p class="text-slate-500" v-else>
                            Klik op een <span class="text-gradient-conic">Blokspot</span> voor meer
                            informatie of om een plek te reserveren.
                        </p>
                    </template>

                    <template v-else>
                        <p>Probeer je zoekcriteria of filters aan te passen.</p>
                        <Button
                            class="mt-6"
                            @click="flyToNearestLocation"
                            :loading="isFetchingNearest"
                            outlined
                            rounded>
                            <FontAwesomeIcon
                                :icon="isFetchingNearest ? faSpinner : faHelicopter"
                                :spin="isFetchingNearest">
                            </FontAwesomeIcon>
                            Vlieg naar dichtstbijzijnde
                            <span class="text-gradient-conic">Blokspot</span>
                        </Button>
                    </template>
                </template>
            </div>

            <div class="grid flex-grow grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
                <template v-if="locationsIsFetching">
                    <LocationCardSkeleton v-for="n in previousLocationCount" :key="n" />
                </template>
                <template v-else-if="locations?.data?.length">
                    <div v-for="(location, i) in locations.data" :key="i" :ref="locationRefs.set">
                        <LocationCard
                            :location="location"
                            @mouseenter="hoveredLocation = location"
                            @mouseleave="hoveredLocation = null">
                        </LocationCard>
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
            <div class="sticky top-4 w-full" :style="{ height: 'calc(100vh - 2rem)' }">
                <BlokMap
                    ref="map"
                    :locations="locations?.data"
                    :is-loading="locationsIsFetching"
                    v-model:hovered-location="hoveredLocation"
                    @change:bounds="handleBoundsChange">
                </BlokMap>
            </div>
        </div>
    </div>
</template>
