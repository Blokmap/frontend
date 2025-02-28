export type GeoLocation = {
    readonly lat: number;
    readonly lng: number;
};

export type GeolocationError = {
    readonly code: number;
    readonly message: string;
};

export type Cell = {
    zoom: number;
    row: number;
    col: number;
    sizeLat: number;
    sizeLng: number;
    rows: number;
    cols: number;
};

export type Location = {
    id: number;
    name: string;
    importance: number;
    coords: GeoLocation;
};
