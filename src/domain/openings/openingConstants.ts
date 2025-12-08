import { WEEKDAY_DAYS } from '@/domain/calendar/calendarConstants';
import { addToDate } from '@/utils/date';
import { createTime } from '@/utils/time';
import type { OpeningTimeBody } from './types';
import type { TimeSlotRepetition } from '../calendar';

export const DEFAULT_REPETITION_CONFIG: TimeSlotRepetition = {
    selectedDays: WEEKDAY_DAYS,
    endDate: addToDate(new Date(), 2, 'week'),
};

export const DEFAULT_OPENING_TIME_REQUEST: OpeningTimeBody = {
    startTime: createTime(8, 0),
    endTime: createTime(10, 0),
    day: new Date(),
    seatCount: 10,
    reservableFrom: null,
    reservableUntil: null,
};

/** Minimum duration for calendar slots in minutes */
export const DEFAULT_MIN_SLOT_DURATION = 15;
