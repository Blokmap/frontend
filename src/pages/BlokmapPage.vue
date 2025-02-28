<script setup lang="ts">
import BlokMap from '@/components/blokmap/BlokMap.vue';
import { useLocationService } from '@/composables/services/useLocationService';
import { blokmapConfig } from '@/config/blokmapConfig';
import type { Location } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { Button } from 'primevue';
import { PrimeIcons } from '@primevue/core';
import BlokMapLogo from '@/assets/img/logo-contrast.png';

const { maxLocationCount } = blokmapConfig;
const { getViewportLocations } = useLocationService();

const blokmap = useTemplateRef('map');

const locations = ref<Location[]>([]);
const location = ref<Location | null>(null);

/**
 * Updates the locations based on the current map viewport.
 */
const updateLocations = useDebounceFn(() => {
    if (blokmap.value && blokmap.value.map) {
        const { map } = blokmap.value;

        locations.value = getViewportLocations(
            map.getBounds(),
            maxLocationCount,
        );
    }
}, 500);

onMounted(async () => {
    const { map } = blokmap.value!;
    map?.on('moveend', updateLocations);
});

onUnmounted(() => {
    const { map } = blokmap.value!;
    map?.off('moveend', updateLocations);
});
</script>

<template>
    <div class="w-screen h-screen relative">
        <BlokMap
            ref="map"
            v-model:location="location"
            class="w-full h-full z-0"
            :locations="locations">
        </BlokMap>
        <div
            class="absolute top-0 left-0 w-screen h-screen pointer-events-none z-1">
            <header
                class="p-4 flex align-items-center justify-content-between gap-3">
                <img class="h-3rem" :src="BlokMapLogo" alt="Logo" />
                <div class="flex align-items-center gap-3 pointer-events-auto">
                    <Button label="Login" :icon="PrimeIcons.USER"></Button>
                </div>
            </header>
            <footer></footer>
        </div>
    </div>
</template>
