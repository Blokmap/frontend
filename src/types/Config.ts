import type { LatLng, LatLngBounds, MapOptions } from 'leaflet';

export type BlokmapOptions = MapOptions & {
    maxLocationCount: number;
    zoom: number;
    center: LatLng;
    bounds: LatLngBounds;
    tlUrl: string;
    tlConfig: {
        maxZoom: number;
        minZoom: number;
    };
};
