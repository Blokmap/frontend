import type { OpeningTimeGroupRequest, OpeningTimeRequest } from './types';
import { addToDate } from '@/utils/date/date';

export const WEEKDAY_DAYS = [0, 1, 2, 3, 4];

export const DEFAULT_OPENING_TIME_REQUEST: OpeningTimeRequest = {
    startTime: '08:00',
    endTime: '10:00',
    day: new Date(),
    seatCount: 10,
    reservableFrom: null,
    reservableUntil: null,
};

export const DEFAULT_OPENING_TIME_GROUP_REQUEST: OpeningTimeGroupRequest = {
    type: 'daily',
    startDate: new Date(),
    endDate: addToDate(new Date(), 1, 'month'),
    selectedDays: [1, 2, 3, 4, 5],
    timeSlots: [
        { startTime: '08:00', endTime: '12:00', seatCount: 20 },
        { startTime: '13:00', endTime: '17:00', seatCount: 20 },
    ],
};
