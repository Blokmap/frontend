<script setup lang="ts">
import BlokMap from '@/components/blokmap/BlokMap.vue';
import { useLocationService } from '@/composables/services/useLocationService';
import { blokmapConfig } from '@/config/blokmapConfig';
import type { Location, LocationId } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useUserService } from '@/composables/services/useUserService';
import { useAuthenticationStore } from '@/composables/stores/useAuthenticationStore';
import BlokmapPageSidebar from './BlokMapPageSidebar.vue';
import BlokmapPageAttribution from './BlokMapPageAttribution.vue';
import BlokmapLogo from '@/assets/img/logo/logo-contrast.png';
import BlokmapPageSearch from './BlokMapPageSearch.vue';

const { maxLocationCount } = blokmapConfig;
const { getViewportLocations } = useLocationService();
const { toggleFavoriteLocation, getFavoriteLocations } = useUserService();
const { user, guest } = useAuthenticationStore();

const blokmap = useTemplateRef('map');

const loadedLocations = ref<Location[]>([]);
const favoriteLocations = ref<LocationId[]>([]);
const selectedLocation = ref<Location | null>(null);

/**
 * Updates the locations based on the current map viewport.
 */
const updateLocations = useDebounceFn(() => {
    if (blokmap.value && blokmap.value.map) {
        const { map } = blokmap.value;
        loadedLocations.value = getViewportLocations(map.getBounds(), maxLocationCount);
    }
}, 500);

watch([user, guest], () => {
    favoriteLocations.value = getFavoriteLocations();
});

onMounted(async () => {
    const { map } = blokmap.value!;
    map?.on('moveend', updateLocations);
    updateLocations();
});

onUnmounted(() => {
    const { map } = blokmap.value!;
    map?.off('moveend', updateLocations);
});

/**
 * Toggles the favorite status of the provided location.
 */
function toggleFavorite(location: Location): void {
    toggleFavoriteLocation(location.id);
}
</script>

<template>
    <div class="w-screen h-screen relative">
        <BlokMap
            id="map"
            ref="map"
            v-model:location="selectedLocation"
            class="w-full h-full z-0"
            :favorite-locations="favoriteLocations"
            :loaded-locations="loadedLocations"
            @toggle:favorite="toggleFavorite">
        </BlokMap>
        <div id="overlay">
            <BlokmapPageSidebar id="sidebar" class="pointer-events-auto" />
            <!-- <img id="logo" :src="BlokmapLogo" alt="Blokmap Logo" /> -->
            <BlokmapPageSearch id="search" class="pointer-events-auto" />
            <BlokmapPageAttribution id="attribution" class="pointer-events-auto" />
        </div>
    </div>
</template>

<style lang="scss">
#map {
    z-index: 0;
}

#overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    display: flex;
    align-items: start;

    #search {
        margin: 1rem;
    }

    #attribution {
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style>
