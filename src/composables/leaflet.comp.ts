import { onMounted, onUnmounted, ref, shallowRef, type Ref } from 'vue';
import { blokmapConfig } from '@/config/blokmap.config';
import L, { type LeafletEventHandlerFn, type Map as LeafletMap } from 'leaflet';

export function useLeafletMap(container: Ref<HTMLElement | null>, options = blokmapConfig) {
    const map = shallowRef<LeafletMap>();
    const listeners = new Map<string, LeafletEventHandlerFn>();

    /**
     * Adds an event listener to the map and registers it for cleanup.
     *
     * @param event - The event name (e.g., 'click', 'moveend').
     * @param handler - The event handler function.
     */
    function addMapListener(event: string, handler: LeafletEventHandlerFn) {
        if (map.value) {
            map.value.on(event, handler);
            listeners.set(event, handler);
        }
    }

    /**
     * Removes an event listener from the map.
     *
     * @param event - The event name (e.g., 'click', 'moveend').
     */
    function removeMapListener(event: string) {
        if (map.value && listeners.has(event)) {
            map.value.off(event, listeners.get(event)!);
            listeners.delete(event);
        }
    }

    onMounted(() => {
        if (container.value) {
            map.value = L.map(container.value, options);
            L.tileLayer(options.tlUrl, options.tlConfig).addTo(map.value);
        }
    });

    onUnmounted(() => {
        if (map.value) {
            for (const event of listeners.keys()) {
                removeMapListener(event);
            }
        }
    });

    return { map, addMapListener, removeMapListener };
}
