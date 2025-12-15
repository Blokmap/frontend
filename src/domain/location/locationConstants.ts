import { faCheck, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LocationState, type LocationRequest } from './types';

export const GOOGLE_MAPS_DIRECTIONS_BASE_URL =
    'https://www.google.com/maps/dir/?api=1&destination=';

export const DEFAULT_LOCATION_REQUEST: LocationRequest = {
    name: '',
    excerpt: {},
    description: {},
    street: '',
    number: '',
    zip: '',
    city: '',
    country: 'BE',
    latitude: 0,
    longitude: 0,
    seatCount: 20,
    isReservable: true,
    isVisible: true,
    authorityId: null,
};

export const LOCATION_SETTINGS = {
    MAX_IMAGES: 10,
    MIN_IMAGES: 5,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_EXCERPT_LENGTH: 50,
};

export const LOCATION_STATES = Object.values(LocationState);

export const LOCATION_STATE_ICONS = {
    [LocationState.Approved]: faCheck,
    [LocationState.Pending]: faClock,
    [LocationState.Rejected]: faTimes,
};
