import type { BlokmapConfig } from '@/types/Config';

// The URL of the tile layer.
// This is a CartoDB tile layer that provides a light basemap.
const titleLayerUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

export const blokmapConfig: BlokmapConfig = {
    tlUrl: titleLayerUrl,
    tlConfig: {
        maxZoom: 17,
        minZoom: 8,
    },
    maxPinCount: 100,
    zoom: 9,
    center: [51.052, 3.717],
    bounds: [
        [49.4967, 2.3889],
        [51.5509, 6.4083],
    ],
};
