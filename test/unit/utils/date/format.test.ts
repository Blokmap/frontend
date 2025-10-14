import { describe, expect, it } from 'vitest';
import { formatDayName } from '@/utils/date';

describe('date format utils', () => {
    describe('formatDayName', () => {
        it('should format day names in short format', () => {
            // Using day index (0 = Monday in this context based on the implementation)
            expect(formatDayName(0, 'short', 'en')).toBe('Mon');
            expect(formatDayName(3, 'short', 'en')).toBe('Thu');
            expect(formatDayName(6, 'short', 'en')).toBe('Sun');
        });

        it('should format day names in long format', () => {
            expect(formatDayName(0, 'long', 'en')).toBe('Monday');
            expect(formatDayName(3, 'long', 'en')).toBe('Thursday');
            expect(formatDayName(6, 'long', 'en')).toBe('Sunday');
        });

        it('should format day names in narrow format', () => {
            expect(formatDayName(0, 'narrow', 'en')).toBe('M');
            expect(formatDayName(3, 'narrow', 'en')).toBe('T');
            expect(formatDayName(6, 'narrow', 'en')).toBe('S');
        });

        it('should accept Date objects', () => {
            const monday = new Date(2024, 0, 1); // January 1, 2024 is a Monday
            expect(formatDayName(monday, 'long', 'en')).toBe('Monday');

            const friday = new Date(2024, 0, 5); // January 5, 2024 is a Friday
            expect(formatDayName(friday, 'long', 'en')).toBe('Friday');
        });

        it('should default to short format and en locale', () => {
            const result = formatDayName(0);
            expect(result).toBe('Mon');
        });

        it('should support different locales', () => {
            expect(formatDayName(0, 'long', 'nl')).toBe('maandag');
            expect(formatDayName(0, 'long', 'de')).toBe('Montag');
            expect(formatDayName(0, 'long', 'fr')).toBe('lundi');
        });
    });
});
