import { blokmapConfig } from '@/config/blokmap';
import type { BlokmapOptions } from '@/types/Config';
import { BlokMapMarker } from '@/types/Leaflet';
import L, { LatLng, type Map as LeafletMap } from 'leaflet';
import { type Ref, onMounted, shallowRef } from 'vue';

export function useLeafletMap(
    container: Ref<HTMLElement | null>,
    options: BlokmapOptions = blokmapConfig,
    initialPosition: GeolocationPosition | null = null,
) {
    const map = shallowRef<LeafletMap>();
    const markers = L.layerGroup<BlokMapMarker>();
    const tiles = L.tileLayer(options.tlUrl, options.tlConfig);

    onMounted(() => {
        if (container.value) {
            map.value = L.map(container.value, options);
            tiles.addTo(map.value);
            markers.addTo(map.value);
        }
    });

    return { map, markers };
}
