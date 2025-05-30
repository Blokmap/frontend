import { Marker, type MarkerOptions } from 'leaflet';
import { type Location } from '@/types/model/Location';

export class BlokMapMarker extends Marker {
    public location: Location;

    constructor(location: Location, options?: MarkerOptions) {
        super([location.latitude, location.longitude], options);
        this.location = location;
    }
}
