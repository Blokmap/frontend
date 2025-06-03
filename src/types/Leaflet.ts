import { type SearchedLocation } from '@/types/schema/Location';
import { Marker, type MarkerOptions } from 'leaflet';

export class BlokMapMarker extends Marker {
    public location: SearchedLocation;

    constructor(location: SearchedLocation, options?: MarkerOptions) {
        super([location.latitude, location.longitude], options);
        this.location = location;
    }
}
