import { TILE_LAYER_URL } from '@/constants';
import type { BlokmapOptions } from '@/types/Config';
import { LatLng, LatLngBounds } from 'leaflet';

export const blokmapConfig: BlokmapOptions = {
    tlUrl: TILE_LAYER_URL,
    tlConfig: {
        maxZoom: 17,
        minZoom: 9,
    },
    maxLocationCount: 50,
    zoomControl: false,
    attributionControl: false,
    zoomAnimation: true,
    zoom: 9,
    maxBoundsViscosity: 1.0,
    center: new LatLng(51.052, 3.717),
    bounds: new LatLngBounds([
        [49.4967, 2.3889],
        [51.5509, 6.4083],
    ]),
};
