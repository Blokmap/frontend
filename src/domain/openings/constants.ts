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
} as const;

/** Number of pixels per hour in the calendar grid */
export const PIXELS_PER_HOUR = 50;

/** Maximum number of minutes in a day (24 * 60) */
export const MAX_MINUTES_IN_DAY = 1440;

/** Minimum duration for calendar slots in minutes */
export const DEFAULT_MIN_SLOT_DURATION = 15;

/** Number of days in a week */
export const DAYS_IN_WEEK = 7;

/** Number of hours in a day */
export const HOURS_IN_DAY = 24;
