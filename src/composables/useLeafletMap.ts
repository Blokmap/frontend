import { onMounted, shallowRef, type Ref } from 'vue';
import { blokmapConfig } from '@/config/blokmapConfig';
import L, { type Map as LeafletMap } from 'leaflet';
import type { BlokmapOptions } from '@/types/Config';
import type { BlokMapMarker } from '@/types/Leaflet';

export function useLeafletMap(
    container: Ref<HTMLElement | null>,
    options: BlokmapOptions = blokmapConfig,
) {
    const map = shallowRef<LeafletMap>();
    const markers = L.layerGroup();
    const tiles = L.tileLayer(options.tlUrl, options.tlConfig)

    onMounted(() => {
        if (container.value) {
            map.value = L.map(container.value, options);
            tiles.addTo(map.value);
            markers.addTo(map.value);
        }
    });

    return { map, markers };
}
