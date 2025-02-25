export type GeoLocation = {
    readonly lat: number;
    readonly lng: number;
};

export type GeolocationError = {
    readonly code: number;
    readonly message: string;
};

export type Location = {
    name: string;
    importance: number;
    coords: GeoLocation;
};
