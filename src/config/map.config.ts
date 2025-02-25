import { type LatLngExpression, type LatLngBoundsExpression } from 'leaflet';

// The URL of the tile layer.
// This is a CartoDB tile layer that provides a light basemap.
const titleLayerUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

export const BlokMapConfig = {
    tileLayerUrl: titleLayerUrl,
    zoom: 8,
    tileLayerConfig: {
        maxZoom: 17,
        minZoom: 8,
    },
    center: [51.052, 3.717] as LatLngExpression,
    bounds: [
        [49.4967, 2.3889],
        [51.5509, 6.4083],
    ] as LatLngBoundsExpression,
};
