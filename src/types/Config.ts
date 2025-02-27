import type { LatLng, LatLngBounds } from 'leaflet';

export type BlokmapConfig = {
    tlUrl: string;
    tlConfig: {
        maxZoom: number;
        minZoom: number;
    };
    maxLocationCount: number;
    zoom: number;
    center: LatLng;
    bounds: LatLngBounds;
};
