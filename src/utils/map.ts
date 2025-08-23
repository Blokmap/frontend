import type { MapOptions } from '@/types/Map';

export const defaultMapOptions: MapOptions = {
    style: 'mapbox://styles/mapbox/outdoors-v11',
    zoom: 7,
    center: [4.4764595, 50.5010789],
    maxBounds: [
        [2.5889, 49.9967],
        [6.5083, 51.6509],
    ],
    autoGeolocation: false,
    geoLocationControl: true,
};
