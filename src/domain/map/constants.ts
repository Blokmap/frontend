import type { MapOptions } from './types';

export const DEFAULT_MAP_OPTIONS = {
    style: 'mapbox://styles/mapbox/outdoors-v11',
    zoom: 7,
    maxBounds: [
        [2.4, 49.5],
        [6.5083, 51.6509],
    ],
    center: [4.4764595, 50.5010789],
    autoGeolocation: false,
    geoLocationControl: true,
    interactive: true,
} satisfies MapOptions;
