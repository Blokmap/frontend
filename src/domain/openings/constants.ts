import { addToDate } from '@/utils/date';
import { createTime } from '@/utils/date/time';
import type { OpeningRepetitionConfig, OpeningTimeRequest } from './types';

export const WEEKDAY_DAYS = [0, 1, 2, 3, 4];

export const DEFAULT_REPETITION_CONFIG: OpeningRepetitionConfig = {
    enabled: false,
    selectedDays: WEEKDAY_DAYS,
    endDate: addToDate(new Date(), 2, 'week'),
};

export const DEFAULT_OPENING_TIME_REQUEST: OpeningTimeRequest = {
    sequenceNumber: 0,
    startTime: createTime(8, 0),
    endTime: createTime(10, 0),
    day: new Date(),
    seatCount: 10,
    reservableFrom: null,
    reservableUntil: null,
    repetition: DEFAULT_REPETITION_CONFIG,
};
