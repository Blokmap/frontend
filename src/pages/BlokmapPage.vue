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
import { useI18n } from 'vue-i18n';

const { maxLocationCount } = blokmapConfig;
const { getViewportLocations } = useLocationService();

const { t } = useI18n();
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
        <div id="overlay">
            <header id="header">
                <img id="logo" :src="BlokMapLogo" alt="Logo" />
                <div id="navigation">
                    <Button
                        :label="t('layout.header.login')"
                        :icon="PrimeIcons.USER">
                    </Button>
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
