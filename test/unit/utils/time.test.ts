import { describe, expect, it } from 'vitest';
import {
    addToTime,
    createTime,
    dateToTime,
    getTimeDuration,
    isEvening,
    isMorning,
    isNight,
    minutesToTime,
    roundToInterval,
    stringToTime,
    timeToDate,
    timeToMinutes,
    timeToString,
} from '@/utils/time';

describe('time utils', () => {
    describe('timeToString', () => {
        it('should handle null and undefined', () => {
            expect(timeToString(null)).toBeNull();
            expect(timeToString(undefined)).toBeUndefined();
        });

        it('should format time in HH:MM format', () => {
            expect(timeToString({ hours: 9, minutes: 30 })).toBe('09:30');
            expect(timeToString({ hours: 14, minutes: 5 })).toBe('14:05');
            expect(timeToString({ hours: 0, minutes: 0 })).toBe('00:00');
        });

        it('should format time in compact format', () => {
            expect(timeToString({ hours: 9, minutes: 30 }, true)).toBe('9u30');
            expect(timeToString({ hours: 14, minutes: 5 }, true)).toBe('14u05');
            expect(timeToString({ hours: 10, minutes: 0 }, true)).toBe('10u');
        });

        it('should pad single digits with zeros in standard format', () => {
            expect(timeToString({ hours: 3, minutes: 7 })).toBe('03:07');
        });
    });

    describe('stringToTime', () => {
        it('should handle null and undefined', () => {
            expect(stringToTime(null)).toBeNull();
            expect(stringToTime(undefined)).toBeUndefined();
        });

        it('should parse HH:MM format', () => {
            expect(stringToTime('09:30')).toEqual({ hours: 9, minutes: 30 });
            expect(stringToTime('14:05')).toEqual({ hours: 14, minutes: 5 });
            expect(stringToTime('00:00')).toEqual({ hours: 0, minutes: 0 });
        });

        it('should handle unparseable strings', () => {
            const result = stringToTime('invalid');
            expect(result?.hours).toBeNaN();
            expect(result?.minutes).toBeUndefined();
        });
    });

    describe('roundToInterval', () => {
        it('should round to nearest interval', () => {
            expect(roundToInterval(7, 5)).toBe(5);
            expect(roundToInterval(8, 5)).toBe(10);
            expect(roundToInterval(13, 15)).toBe(15);
            expect(roundToInterval(22, 15)).toBe(15);
            expect(roundToInterval(23, 15)).toBe(30);
        });

        it('should handle exact intervals', () => {
            expect(roundToInterval(15, 5)).toBe(15);
            expect(roundToInterval(30, 15)).toBe(30);
        });
    });

    describe('timeToMinutes', () => {
        it('should convert time to total minutes', () => {
            expect(timeToMinutes({ hours: 0, minutes: 0 })).toBe(0);
            expect(timeToMinutes({ hours: 1, minutes: 30 })).toBe(90);
            expect(timeToMinutes({ hours: 12, minutes: 45 })).toBe(765);
            expect(timeToMinutes({ hours: 23, minutes: 59 })).toBe(1439);
        });
    });

    describe('minutesToTime', () => {
        it('should convert minutes to time object', () => {
            expect(minutesToTime(0)).toEqual({ hours: 0, minutes: 0 });
            expect(minutesToTime(90)).toEqual({ hours: 1, minutes: 30 });
            expect(minutesToTime(765)).toEqual({ hours: 12, minutes: 45 });
            expect(minutesToTime(1439)).toEqual({ hours: 23, minutes: 59 });
        });
    });

    describe('dateToTime', () => {
        it('should extract time from date', () => {
            const date = new Date(2024, 0, 1, 14, 30, 45);
            expect(dateToTime(date)).toEqual({ hours: 14, minutes: 30 });
        });

        it('should handle midnight', () => {
            const date = new Date(2024, 0, 1, 0, 0, 0);
            expect(dateToTime(date)).toEqual({ hours: 0, minutes: 0 });
        });
    });

    describe('timeToDate', () => {
        it('should convert time to date for today', () => {
            const result = timeToDate({ hours: 14, minutes: 30 });
            expect(result.getHours()).toBe(14);
            expect(result.getMinutes()).toBe(30);
            expect(result.getSeconds()).toBe(0);
        });

        it('should use base date if provided', () => {
            const baseDate = new Date(2024, 5, 15);
            const result = timeToDate({ hours: 9, minutes: 15 }, baseDate);
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(5);
            expect(result.getDate()).toBe(15);
            expect(result.getHours()).toBe(9);
            expect(result.getMinutes()).toBe(15);
        });
    });

    describe('createTime', () => {
        it('should create time object', () => {
            expect(createTime(14, 30)).toEqual({ hours: 14, minutes: 30 });
            expect(createTime(0, 0)).toEqual({ hours: 0, minutes: 0 });
        });
    });

    describe('addToTime', () => {
        it('should add hours to time', () => {
            const time = { hours: 10, minutes: 30 };
            expect(addToTime(time, 2, 'hours')).toEqual({ hours: 12, minutes: 30 });
        });

        it('should add minutes to time', () => {
            const time = { hours: 10, minutes: 30 };
            expect(addToTime(time, 45, 'minutes')).toEqual({ hours: 11, minutes: 15 });
        });

        it('should handle overflow into next hour', () => {
            const time = { hours: 10, minutes: 45 };
            expect(addToTime(time, 30, 'minutes')).toEqual({ hours: 11, minutes: 15 });
        });

        it('should clamp to maximum day value', () => {
            const time = { hours: 23, minutes: 30 };
            expect(addToTime(time, 60, 'minutes')).toEqual({ hours: 23, minutes: 59 });
        });

        it('should clamp to minimum day value', () => {
            const time = { hours: 0, minutes: 30 };
            expect(addToTime(time, -60, 'minutes')).toEqual({ hours: 0, minutes: 0 });
        });
    });

    describe('getTimeDuration', () => {
        it('should calculate duration between times', () => {
            const start = { hours: 9, minutes: 0 };
            const end = { hours: 17, minutes: 30 };
            expect(getTimeDuration(start, end)).toBe(510); // 8.5 hours = 510 minutes
        });

        it('should handle same start and end', () => {
            const time = { hours: 12, minutes: 0 };
            expect(getTimeDuration(time, time)).toBe(0);
        });

        it('should handle fractional hour differences', () => {
            const start = { hours: 10, minutes: 15 };
            const end = { hours: 12, minutes: 45 };
            expect(getTimeDuration(start, end)).toBe(150); // 2.5 hours
        });
    });

    describe('isEvening', () => {
        it('should return true for evening hours (18:00-21:59)', () => {
            expect(isEvening({ hours: 18, minutes: 0 })).toBe(true);
            expect(isEvening({ hours: 20, minutes: 30 })).toBe(true);
            expect(isEvening({ hours: 21, minutes: 59 })).toBe(true);
        });

        it('should return false for non-evening hours', () => {
            expect(isEvening({ hours: 17, minutes: 59 })).toBe(false);
            expect(isEvening({ hours: 22, minutes: 0 })).toBe(false);
            expect(isEvening({ hours: 12, minutes: 0 })).toBe(false);
        });
    });

    describe('isNight', () => {
        it('should return true for night hours (before 6 AM or after 10 PM)', () => {
            expect(isNight({ hours: 0, minutes: 0 })).toBe(true);
            expect(isNight({ hours: 5, minutes: 59 })).toBe(true);
            expect(isNight({ hours: 22, minutes: 0 })).toBe(true);
            expect(isNight({ hours: 23, minutes: 30 })).toBe(true);
        });

        it('should return false for daytime hours', () => {
            expect(isNight({ hours: 6, minutes: 0 })).toBe(false);
            expect(isNight({ hours: 12, minutes: 0 })).toBe(false);
            expect(isNight({ hours: 21, minutes: 59 })).toBe(false);
        });
    });

    describe('isMorning', () => {
        it('should return true for morning hours (6:00-11:59)', () => {
            expect(isMorning({ hours: 6, minutes: 0 })).toBe(true);
            expect(isMorning({ hours: 9, minutes: 30 })).toBe(true);
            expect(isMorning({ hours: 11, minutes: 59 })).toBe(true);
        });

        it('should return false for non-morning hours', () => {
            expect(isMorning({ hours: 5, minutes: 59 })).toBe(false);
            expect(isMorning({ hours: 12, minutes: 0 })).toBe(false);
            expect(isMorning({ hours: 15, minutes: 0 })).toBe(false);
        });
    });
});
