import type { ComputedRef, VNode } from 'vue';

export type LngLat = [number, number];
export type LngLatBounds = [LngLat, LngLat];

export type Marker<T = number> = {
    id: T;
    coord: LngLat;
    el: HTMLElement;
};

export interface MapOptions {
    style?: string;
    center?: LngLat;
    bounds?: LngLatBounds;
    zoom?: number;
}

export interface MapAdapter<T = number> {
    setMarkers(markers: Marker<T>[]): void;
    addMarker(marker: Marker<T>): void;
    removeMarker(id: T): void;
    setOnMove(callback: (lngLat: LngLat) => void): void;
    setOnBoundsChange(callback: (bounds: LngLatBounds) => void): void;
    flyToBounds(bounds: LngLatBounds): void;
    flyTo(lngLat: LngLat): void;
    getBounds(): LngLatBounds | null;
    isLoaded: ComputedRef<boolean>;
    isMoving: ComputedRef<boolean>;
}
