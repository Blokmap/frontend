import { addToDate } from '@/utils/date/date';
import { createTime } from '@/utils/date/time';
import type { OpeningTimeGroupRequest, OpeningTimeRequest } from './types';

export const WEEKDAY_DAYS = [0, 1, 2, 3, 4];

export const DEFAULT_OPENING_TIME_REQUEST: OpeningTimeRequest = {
    startTime: createTime(8, 0),
    endTime: createTime(10, 0),
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
        { startTime: createTime(8, 0), endTime: createTime(12, 0), seatCount: 20 },
        { startTime: createTime(13, 0), endTime: createTime(17, 0), seatCount: 20 },
    ],
};
