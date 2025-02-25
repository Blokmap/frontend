import { useLocationStore } from '@/composables/stores/location.store';
import { BlokMapConfig } from '@/config/map.config';
import type { GeoLocation } from '@/types/Location';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import Leaflet from 'leaflet';

export function useBlokmap(container: HTMLElement) {
    const { location } = storeToRefs(useLocationStore());
    const { center, zoom, bounds, tileLayerUrl, tileLayerConfig } = BlokMapConfig;

    // Create the map.
    const map = Leaflet.map(container).setView(center, zoom);

    // Configure the map.
    // Set the bounds and min zoom level.
    map.setMaxBounds(bounds);
    map.setMinZoom(tileLayerConfig.minZoom);

    // Add the tile layer.
    Leaflet.tileLayer(tileLayerUrl, tileLayerConfig).addTo(map);

    // Watch the location and add a marker to the map.
    watch(
        location,
        (newLocation: GeoLocation | null) => {
            if (newLocation === null) {
                return;
            }

            console.log(location.value);

            Leaflet.marker([newLocation.lat, newLocation.lng])
                .addTo(map)
                .bindPopup('Your location')
                .openPopup();
        },
        { immediate: true},
    );

    return map;
}
