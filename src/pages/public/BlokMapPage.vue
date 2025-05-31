<!-- <script setup lang="ts">
import type { Location } from '@/types/model/Location';
import { blokmapConfig } from '@/config/blokmap';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { PrimeIcons } from '@primevue/core';
import { Button } from 'primevue';
import { useMessages } from '@/composables/useMessages';
import BlokMap from '@/components/blokmap/BlokMap.vue';
import BlokMapSidebar from '@/components/blokmap/overlay/BlokMapSidebar.vue';
import BlokMapSearch from '@/components/blokmap/overlay/BlokMapSearch.vue';
import BlokMapAttribution from '@/components/blokmap/overlay/BlokMapAttribution.vue';

const { maxLocationCount } = blokmapConfig;
const { t } = useI18n();
// const { showError } = useMessages();
const { updatePosition, isLoadingPosition } = usePosition();
const { getViewportLocations } = useLocationService();
const { toggleFavoriteLocation, getFavoriteLocations, updateRecentLocations } = useUserService();
const { user, guest } = useAuthenticationStore();

const blokmap = useTemplateRef('map');

const showMainMenu = ref<boolean>(false);
const loadedLocations = ref<Location[]>([]);
const favoriteLocations = ref<LocationId[]>([]);
const selectedLocation = ref<Location | null>(null);

watch(
    () => [user, guest],
    () => {
        favoriteLocations.value = getFavoriteLocations();
    },
);

watchEffect(async () => {
    if (blokmap.value) {
        blokmap.value?.map?.on('moveend', updateLocations);
        updateLocations();
    }
});

const updateLocations = useDebounceFn(() => {
    if (blokmap.value && blokmap.value.map) {
        loadedLocations.value = getViewportLocations(
            blokmap.value.map.getBounds(),
            maxLocationCount,
        );
    }
}, 500);

const flyToPosition = async () => {
    try {
        const { coords } = await updatePosition();
        blokmap.value?.map?.flyTo([coords.latitude, coords.longitude], 15);
    } catch (e: any) {
        const error = e as GeolocationPositionError;
        showError(error.message);
    }
};

const toggleFavorite = (location: Location): void => {
    toggleFavoriteLocation(location.id);
};

const updateRecent = (location: Location): void => {
    updateRecentLocations(location.id);
};
</script>

<template>
    <div class="w-screen h-screen relative">
        <BlokMap
            id="map"
            ref="map"
            v-model:location="selectedLocation"
            :favorite-locations="favoriteLocations"
            :loaded-locations="loadedLocations"
            @select:location="updateRecent"
            @toggle:favorite="toggleFavorite">
        </BlokMap>
        <div id="overlay">
            <BlokMapSidebar v-model:show-menu="showMainMenu" class="pointer-events-auto">
                <Button
                    @click="flyToPosition"
                    :icon="PrimeIcons.MAP_MARKER"
                    :loading="isLoadingPosition"
                    v-tooltip="t('pages.blokmap.sidebar.locate')"
                    rounded>
                </Button>
            </BlokMapSidebar>
            <BlokMapSearch v-model:show-menu="showMainMenu" class="search pointer-events-auto" />
            <BlokMapAttribution class="attribution pointer-events-auto" />
        </div>
    </div>
</template>

<style lang="scss">
#map {
    z-index: 0;
    width: 100vw;
    height: 100vh;
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

    .search {
        margin: 1rem;
        width: 400px;
        max-width: 100vw;
    }

    .attribution {
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style> -->
