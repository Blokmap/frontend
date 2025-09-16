import type { MapOptions } from './types';

export const defaultMapOptions = {
    style: 'mapbox://styles/mapbox/outdoors-v11',
    zoom: 7,
    center: [4.4764595, 50.5010789],
    autoGeolocation: false,
    geoLocationControl: true,
    interactive: true,
} satisfies MapOptions;
