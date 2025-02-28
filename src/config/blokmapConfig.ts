import type { BlokmapOptions } from '@/types/Config';
import { LatLng, LatLngBounds } from 'leaflet';

// The URL of the tile layer.
// This is a CartoDB tile layer that provides a light basemap.
const titleLayerUrl =
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

export const blokmapConfig: BlokmapOptions = {
    tlUrl: titleLayerUrl,
    tlConfig: {
        maxZoom: 17,
        minZoom: 9,
    },
    maxLocationCount: 25,
    zoomControl: false,
    zoomAnimation: true,
    zoom: 9,
    center: new LatLng(51.052, 3.717),
    bounds: new LatLngBounds([
        [49.4967, 2.3889],
        [51.5509, 6.4083],
    ]),
};
