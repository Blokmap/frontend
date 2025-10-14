import { describe, expect, it } from 'vitest';
import { dateToString, stringToDate } from '@/utils/date';

describe('date convert utils', () => {
    describe('stringToDate', () => {
        it('should handle null and undefined', () => {
            expect(stringToDate(null)).toBeNull();
            expect(stringToDate(undefined)).toBeUndefined();
        });

        it('should convert valid ISO string to Date', () => {
            const isoString = '2024-01-15T10:30:00.000Z';
            const result = stringToDate(isoString);
            expect(result).toBeInstanceOf(Date);
            expect(result?.toISOString()).toBe(isoString);
        });

        it('should convert date string to Date', () => {
            const result = stringToDate('2024-03-20');
            expect(result).toBeInstanceOf(Date);
            expect(result?.getFullYear()).toBe(2024);
            expect(result?.getMonth()).toBe(2); // March is month 2
            expect(result?.getDate()).toBe(20);
        });
    });

    describe('dateToString', () => {
        it('should handle null and undefined', () => {
            expect(dateToString(null)).toBeNull();
            expect(dateToString(undefined)).toBeUndefined();
        });

        it('should convert Date to ISO string', () => {
            const date = new Date('2024-01-15T10:30:00.000Z');
            const result = dateToString(date);
            expect(result).toBe('2024-01-15T10:30:00.000Z');
        });

        it('should handle different dates correctly', () => {
            const date = new Date(Date.UTC(2025, 9, 14, 12, 0, 0));
            const result = dateToString(date);
            expect(result).toContain('2025-10-14');
        });
    });
});
