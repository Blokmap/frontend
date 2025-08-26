import type { LocationRequest } from './types';
import { addToDate } from '@/utils/date/date';

export const DEFAULT_LOCATION_REQUEST: LocationRequest = {
    name: '',
    excerpt: {},
    description: {},
    street: '',
    number: '',
    zip: '',
    city: '',
    country: 'be',
    province: '',
    latitude: 0,
    longitude: 0,
    seatCount: 20,
    isReservable: true,
    isVisible: true,
    reservationBlockSize: 0,
};

export const LOCATION_SETTINGS = {
    MAX_IMAGES: 10,
    MIN_IMAGES: 5,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_EXCERPT_LENGTH: 50,
};
