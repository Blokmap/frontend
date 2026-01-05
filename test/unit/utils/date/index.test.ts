import { describe, expect, it } from 'vitest';
import {
    addToDate,
    datesInRange,
    endOfMonth,
    endOfWeek,
    isDateInRange,
    isToday,
    isWeekend,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from '@/utils/date';

describe('date utils', () => {
    describe('startOfWeek', () => {
        it('should return Monday for a Tuesday date', () => {
            const tuesday = new Date(2024, 0, 2); // Jan 2, 2024 is a Tuesday
            const monday = startOfWeek(tuesday);
            expect(monday.getDay()).toBe(1); // Monday
            expect(monday.getDate()).toBe(1);
        });

        it('should return Monday for a Sunday date', () => {
            const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is a Sunday
            const monday = startOfWeek(sunday);
            expect(monday.getDay()).toBe(1); // Monday
            expect(monday.getDate()).toBe(1);
        });

        it('should return same date for Monday', () => {
            const monday = new Date(2024, 0, 1); // Jan 1, 2024 is a Monday
            const result = startOfWeek(monday);
            expect(result.getDay()).toBe(1);
            expect(result.getDate()).toBe(1);
        });
    });

    describe('endOfWeek', () => {
        it('should return Sunday for a Tuesday date', () => {
            const tuesday = new Date(2024, 0, 2); // Jan 2, 2024 is a Tuesday
            const sunday = endOfWeek(tuesday);
            expect(sunday.getDay()).toBe(0); // Sunday
            expect(sunday.getDate()).toBe(7);
        });

        it('should return same date for Sunday', () => {
            const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is a Sunday
            const result = endOfWeek(sunday);
            expect(result.getDay()).toBe(0);
            expect(result.getDate()).toBe(7);
        });
    });

    describe('startOfMonth', () => {
        it('should return first day of month', () => {
            const date = new Date(2024, 5, 15); // June 15, 2024
            const result = startOfMonth(date);
            expect(result.getDate()).toBe(1);
            expect(result.getMonth()).toBe(5); // June
            expect(result.getFullYear()).toBe(2024);
        });

        it('should handle last day of month', () => {
            const date = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)
            const result = startOfMonth(date);
            expect(result.getDate()).toBe(1);
            expect(result.getMonth()).toBe(1); // February
        });
    });

    describe('endOfMonth', () => {
        it('should return last day of 31-day month', () => {
            const date = new Date(2024, 0, 15); // January
            const result = endOfMonth(date);
            expect(result.getDate()).toBe(31);
            expect(result.getMonth()).toBe(0);
        });

        it('should return last day of February in leap year', () => {
            const date = new Date(2024, 1, 15); // February 2024
            const result = endOfMonth(date);
            expect(result.getDate()).toBe(29);
        });

        it('should return last day of February in non-leap year', () => {
            const date = new Date(2023, 1, 15); // February 2023
            const result = endOfMonth(date);
            expect(result.getDate()).toBe(28);
        });
    });

    describe('datesInRange', () => {
        it('should generate array of dates in range', () => {
            const start = new Date(2024, 0, 1);
            const end = new Date(2024, 0, 5);
            const dates = datesInRange(start, end);

            expect(dates).toHaveLength(5);
            expect(dates[0].getDate()).toBe(1);
            expect(dates[4].getDate()).toBe(5);
        });

        it('should include both start and end dates', () => {
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 12);
            const dates = datesInRange(start, end);

            expect(dates).toHaveLength(3);
        });

        it('should handle single day range', () => {
            const date = new Date(2024, 0, 1);
            const dates = datesInRange(date, date);
            expect(dates).toHaveLength(1);
        });

        it('should handle month boundaries', () => {
            const start = new Date(2024, 0, 30);
            const end = new Date(2024, 1, 2);
            const dates = datesInRange(start, end);

            expect(dates).toHaveLength(4);
            expect(dates[0].getMonth()).toBe(0); // January
            expect(dates[3].getMonth()).toBe(1); // February
        });
    });

    describe('addToDate', () => {
        it('should add days to date', () => {
            const date = new Date(2024, 0, 15);
            const result = addToDate(date, 5, 'day');
            expect(result.getDate()).toBe(20);
        });

        it('should subtract days from date', () => {
            const date = new Date(2024, 0, 15);
            const result = addToDate(date, -5, 'day');
            expect(result.getDate()).toBe(10);
        });

        it('should add weeks to date', () => {
            const date = new Date(2024, 0, 1);
            const result = addToDate(date, 2, 'week');
            expect(result.getDate()).toBe(15);
        });

        it('should add months to date', () => {
            const date = new Date(2024, 0, 15);
            const result = addToDate(date, 3, 'month');
            expect(result.getMonth()).toBe(3); // April
        });

        it('should default to day granularity', () => {
            const date = new Date(2024, 0, 15);
            const result = addToDate(date, 7);
            expect(result.getDate()).toBe(22);
        });
    });

    describe('isDateInRange', () => {
        it('should return true for date within range', () => {
            const date = new Date(2024, 0, 15);
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 20);
            expect(isDateInRange(date, start, end)).toBe(true);
        });

        it('should return true for date equal to start', () => {
            const date = new Date(2024, 0, 10);
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 20);
            expect(isDateInRange(date, start, end)).toBe(true);
        });

        it('should return true for date equal to end', () => {
            const date = new Date(2024, 0, 20);
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 20);
            expect(isDateInRange(date, start, end)).toBe(true);
        });

        it('should return false for date before range', () => {
            const date = new Date(2024, 0, 5);
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 20);
            expect(isDateInRange(date, start, end)).toBe(false);
        });

        it('should return false for date after range', () => {
            const date = new Date(2024, 0, 25);
            const start = new Date(2024, 0, 10);
            const end = new Date(2024, 0, 20);
            expect(isDateInRange(date, start, end)).toBe(false);
        });
    });

    describe('startOfDay', () => {
        it('should reset time to midnight', () => {
            const date = new Date(2024, 0, 15, 14, 30, 45);
            const result = startOfDay(date);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
            expect(result.getDate()).toBe(15);
        });
    });

    describe('isToday', () => {
        it('should return true for current date', () => {
            const today = new Date();
            expect(isToday(today)).toBe(true);
        });

        it('should return false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday)).toBe(false);
        });

        it('should return false for tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isToday(tomorrow)).toBe(false);
        });

        it('should ignore time component', () => {
            const today = new Date();
            today.setHours(23, 59, 59);
            expect(isToday(today)).toBe(true);
        });
    });

    describe('isWeekend', () => {
        it('should return true for Saturday', () => {
            const saturday = new Date(2024, 0, 6); // Jan 6, 2024 is Saturday
            expect(isWeekend(saturday)).toBe(true);
        });

        it('should return true for Sunday', () => {
            const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is Sunday
            expect(isWeekend(sunday)).toBe(true);
        });

        it('should return false for weekdays', () => {
            const monday = new Date(2024, 0, 1);
            const friday = new Date(2024, 0, 5);
            expect(isWeekend(monday)).toBe(false);
            expect(isWeekend(friday)).toBe(false);
        });
    });
});
