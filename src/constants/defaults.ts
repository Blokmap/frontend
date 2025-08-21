import type { CreateLocationRequest } from '@/types/schema/Location';

export const DEFAULT_LOCATION_FORM: CreateLocationRequest = {
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
