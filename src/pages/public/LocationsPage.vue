<script lang="ts" setup>
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import BlokMap from '@/components/features/map/BlokMap.vue';
import GradientText from '@/components/shared/GradientText.vue';
import { useItemAnimation } from '@/composables/anim/useItemAnimation';
import { useLocationsSearch } from '@/composables/data/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { useMessages } from '@/composables/useMessages';
import { searchLocations } from '@/services/location';
import type { LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faFilter, faHelicopter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useQueryClient } from '@tanstack/vue-query';
import { useTemplateRefsList } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import { ref, useTemplateRef, watch } from 'vue';

const filterStore = useLocationFilters();
const messages = useMessages();
const client = useQueryClient();
const { filters, flyToTrigger } = storeToRefs(filterStore);

const mapRef = useTemplateRef('map');
const locationRefs = useTemplateRefsList();
useItemAnimation(locationRefs);

const { data: locations, isFetching: locationsIsFetching } = useLocationsSearch(filters);

const hoveredLocation = ref<Location | null>(null);
const previousLocationCount = ref<number>(filterStore.filters.perPage ?? 12);

watch(locations, (locations) => {
    if (!locations || !locations.data?.length) {
        return;
    }

    previousLocationCount.value = locations.data.length;
});

watch(
    [() => mapRef.value?.map.isLoaded, () => filters.value.location, flyToTrigger],
    ([isLoaded, location]) => {
        if (!isLoaded || !location || !location.coordinates) return;
        mapRef.value?.map.flyTo([location.coordinates.longitude, location.coordinates.latitude]);
    },
    { immediate: true, deep: true },
);

function handleBoundsChange(bounds: LngLatBounds): void {
    // When bounds change, update the filters with the new bounds
    // and reset paginatation and location filter
    filterStore.updateFilters({ bounds, page: 1 });
}

function handlePageChange(event: { page: number }): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStore.updateFilters({ page: event.page + 1 });
}

async function flyToNearestLocation(): Promise<void> {
    if (!mapRef.value) return;
    const center = { coords: mapRef.value.map.getCenter() };
    const query = await searchLocations({ center, perPage: 1 });

    if (query.data && query.data.length > 0) {
        const nearestLocation = query.data[0];
        client.setQueryData(['search', 'locations'], { data: [nearestLocation] });
        mapRef.value.map.flyTo([nearestLocation.longitude, nearestLocation.latitude]);
    } else {
        messages.showMessage({
            severity: 'info',
            summary: 'Geen resultaten',
            detail: 'Er zijn geen locaties gevonden in de buurt.',
        });
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
                                    <GradientText>Blokspots</GradientText> gevonden
                                </template>
                                <template v-else>
                                    {{ locations.total }}
                                    <GradientText>Blokspots</GradientText> gevonden
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
                            <GradientText>Blokspots</GradientText> getoond. Gebruik de filters om je
                            zoekopdracht te verfijnen.
                        </p>
                    </template>

                    <template v-else>
                        <p>Probeer je zoekcriteria of filters aan te passen.</p>
                        <Button class="mt-6" @click="flyToNearestLocation" outlined rounded>
                            <FontAwesomeIcon :icon="faHelicopter" /> Vlieg naar dichtstbijzijnde
                            <GradientText>Blokspot</GradientText>
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
