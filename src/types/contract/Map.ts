import type { ComputedRef } from 'vue';

export type LngLat = [number, number];
export type LngLatBounds = [LngLat, LngLat];

export interface MapOptions {
    style?: string;
    center?: LngLat;
    bounds?: LngLatBounds;
    zoom?: number;
}

export interface MapAdapter<T> {
    setMarkers(markers: [T, LngLat][]): void;
    setOnBoundsChange(callback: (bounds: LngLatBounds) => void): void;
    isLoaded: ComputedRef<boolean>;
}
