import type { LatLngExpression } from 'leaflet';

export type LocationId = number;

export type Location = {
    id: LocationId;
    name: string;
    importance: number;
    coords: LatLngExpression;
};
