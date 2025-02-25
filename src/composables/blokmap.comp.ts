import { useLocation } from '@/composables/location.comp';
import { BlokMapConfig } from '@/config/map.config';
import type { GeoLocation } from '@/types/Location';
import Leaflet from 'leaflet';
import { watch } from 'vue';

export function useBlokmap(container: string = 'map') {
    const { location } = useLocation();
    const { center, zoom, bounds, tileLayerUrl, tileLayerConfig } = BlokMapConfig;

    // Create the map.
    const map = Leaflet.map(container).setView(center, zoom);

    // Configure the map.
    // Set the bounds and min zoom level.
    map.setMaxBounds(bounds);
    map.setMinZoom(tileLayerConfig.minZoom);

    // Add the tile layer.
    Leaflet.tileLayer(tileLayerUrl, tileLayerConfig).addTo(map);

    watch(
        location,
        (newLocation: GeoLocation | null) => {
            if (newLocation === null) {
                return;
            }

            Leaflet.marker([newLocation.lat, newLocation.lng])
                .addTo(map)
                .bindPopup('Your location')
                .openPopup();
        },
        { immediate: true },
    );

    return map;
}
