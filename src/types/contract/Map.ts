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
    setOnMarkerClick(callback: (id: T, event: MouseEvent) => void): void;
    setOnMove(callback: (lngLat: LngLat) => void): void;
    setOnBoundsChange(callback: (bounds: LngLatBounds) => void): void;
    flyToBounds(bounds: LngLatBounds): void;
    flyTo(lngLat: LngLat): void;
    isLoaded: ComputedRef<boolean>;
    isMoving: ComputedRef<boolean>;
}
