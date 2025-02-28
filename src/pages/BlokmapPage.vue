<script setup lang="ts">
import BlokMap from '@/components/blokmap/BlokMap.vue';
import { useLocationService } from '@/composables/services/useLocationService';
import { blokmapConfig } from '@/config/blokmapConfig';
import type { Location, LocationId } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { Button } from 'primevue';
import { PrimeIcons } from '@primevue/core';
import BlokMapLogo from '@/assets/img/logo-contrast.png';
import { useI18n } from 'vue-i18n';
import { useUserService } from '@/composables/services/useUserService';
import { useAuthenticationStore } from '@/composables/stores/useAuthenticationStore';

const { t } = useI18n();
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
            ref="map"
            v-model:location="selectedLocation"
            class="w-full h-full z-0"
            :favorite-locations="favoriteLocations"
            :loaded-locations="loadedLocations"
            @toggle:favorite="toggleFavorite">
        </BlokMap>
        <div id="overlay">
            <header id="header">
                <img id="logo" :src="BlokMapLogo" alt="Logo" />
                <div id="navigation">
                    <Button :label="t('layout.header.login')" :icon="PrimeIcons.USER"> </Button>
                </div>
            </header>
            <footer id="footer">
                <div id="attribution">
                    {{ t('pages.blokmap.attribution') }}
                </div>
            </footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    #header {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;

        #logo {
            height: 3rem;
        }

        #navigation {
            display: flex;
            align-items: center;
            gap: 1rem;
            pointer-events: all;

            .p-button {
                padding: 0.75rem 1rem;
            }
        }
    }

    #footer {
        padding: 1.5rem;

        #attribution {
            font-size: 12px;
            padding: 0.25rem;
            display: inline-block;
            color: var(--surface-600);
            border-radius: var(--border-radius-md);
            background: rgba(white, 0.6);
        }
    }
}
</style>
