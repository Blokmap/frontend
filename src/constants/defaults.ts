import type { CreateLocationRequest } from '@/types/schema/Location';
import type {
    CreateOpeningTimeGroupRequest,
    CreateOpeningTimeRequest,
} from '@/types/schema/OpeningTime';
import { addToDate } from '@/utils/date/date';

export const DEFAULT_LOCATION_REQ: CreateLocationRequest = {
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

export const DEFAULT_OPENING_TIME_REQ: CreateOpeningTimeRequest = {
    startTime: '08:00',
    endTime: '10:00',
    day: new Date(),
    seatCount: 10,
    reservableFrom: null,
    reservableUntil: null,
};

export const DEFAULT_OPENING_TIME_GROUP_REQ: CreateOpeningTimeGroupRequest = {
    type: 'daily',
    startDate: new Date(),
    endDate: addToDate(new Date(), 1, 'month'),
    selectedDays: [1, 2, 3, 4, 5],
    timeSlots: [
        { startTime: '08:00', endTime: '12:00', seatCount: 20 },
        { startTime: '13:00', endTime: '17:00', seatCount: 20 },
    ],
};
