import { onMounted, ref, type Ref } from 'vue';
import { blokmapConfig } from '@/config/blokmap.config';
import L, { Map } from 'leaflet';

export function useLeafletMap(container: Ref<HTMLElement | null>, options = blokmapConfig) {
    const map = ref<Map>();

    onMounted(() => {
        if (container.value) {
            map.value = L.map(container.value, options);
            L.tileLayer(options.tlUrl, options.tlConfig).addTo(map.value);
        }
    });

    return { map };
}
