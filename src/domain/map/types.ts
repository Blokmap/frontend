import type { DeepReadonly, MaybeRef, Ref } from 'vue';

export type LngLat = [number, number];
export type LngLatBounds = [LngLat, LngLat];

export type Marker<T = number> = {
    id: T;
    coord: LngLat;
    el: HTMLElement;
};

export interface MapOptions {
    style?: string;
    center?: MaybeRef<LngLat>;
    maxBounds?: MaybeRef<LngLatBounds>;
    zoom?: MaybeRef<number>;
    autoGeolocation?: boolean;
    geoLocationControl?: boolean;
    interactive?: boolean;
}

export interface MapAdapter<T = number> {
    setMarkers(markers: Marker<T>[]): void;
    addMarker(marker: Marker<T>): void;
    removeMarker(id: T): void;
    flyToBounds(bounds: LngLatBounds): Promise<void>;
    flyTo(lngLat: LngLat, zoom?: number): Promise<void>;
    center: Ref<LngLat>;
    zoom: Ref<number>;
    bounds: DeepReadonly<Ref<LngLatBounds>>;
    readonly isLoaded: Readonly<Ref<boolean>>;
    readonly isDragging: Readonly<Ref<boolean>>;
    readonly isZooming: Readonly<Ref<boolean>>;
    readonly isMoving: Readonly<Ref<boolean>>;
}
