import type { MaybeRef, Ref } from 'vue';

export type LngLat = [number, number];
export type LngLatBounds = [LngLat, LngLat];

export type MarkerClusterId = number | string;

export type Marker<T = number> = {
    id: T;
    coord: LngLat;
    el: HTMLElement;
};

export type ClusterData = {
    id: string;
    position: LngLat;
    count: number;
    markers: number[];
};

export interface ClusteringAdapter<T = number> {
    updateClusters(bounds: LngLatBounds, zoom: number): void;
    loadMarkers(
        features: Array<{ id: T; coord: LngLat; properties?: Record<string, any> }>,
        bounds: LngLatBounds,
        zoom: number,
    ): void;
    getClusters(): ClusterData[];
    getExpansionZoom(clusterId: string): number | null;
}

export interface MapOptions {
    style?: string;
    center?: MaybeRef<LngLat>;
    maxBounds?: MaybeRef<LngLatBounds>;
    zoom?: MaybeRef<number>;
    autoGeolocation?: boolean;
    geoLocationControl?: boolean;
    interactive?: boolean;
    clustering?: boolean;
    clusterRadius?: number;
    clusterMaxZoom?: number;
}

export interface MapAdapter<T = number> {
    setMarkers(markers: Marker<T>[]): void;
    addMarker(marker: Marker<T | string>): void;
    removeMarker(id: T | string): void;
    flyToBounds(bounds: LngLatBounds): Promise<void>;
    flyTo(lngLat: LngLat, zoom?: number): Promise<void>;
    updateClusteredMarkers?(
        features: Array<{ id: T; coord: LngLat; properties?: Record<string, any> }>,
    ): void;
    getClusters?(): ClusterData[];
    zoomToCluster?(clusterId: string): void;
    center: Ref<LngLat>;
    zoom: Ref<number>;
    bounds: Readonly<Ref<LngLatBounds>>;
    readonly isLoaded: Readonly<Ref<boolean>>;
    readonly isDragging: Readonly<Ref<boolean>>;
    readonly isZooming: Readonly<Ref<boolean>>;
    readonly isMoving: Readonly<Ref<boolean>>;
}
