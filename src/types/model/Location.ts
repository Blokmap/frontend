export type GeoLocation = {
    readonly lat: number;
    readonly lng: number;
};

export type GeolocationError = {
    readonly code: number;
    readonly message: string;
};

export type CellKey = {
    zoom: number;
    row: number;
    col: number;
};

export type Cell = {
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
