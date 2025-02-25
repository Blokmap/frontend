import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";

export type BlokmapConfig = {
    tlUrl: string;
    tlConfig: {
        maxZoom: number;
        minZoom: number;
    };
    maxPinCount: number;
    zoom: number;
    center: LatLngExpression;
    bounds: LatLngBoundsExpression;
};
