import { describe, expect, it } from 'vitest';
import { abbreviateCount } from '@/utils/formatUtils';

describe('format utils', () => {
    describe('abbreviateCount', () => {
        it('should handle undefined and null', () => {
            expect(abbreviateCount(undefined)).toBeUndefined();
            expect(abbreviateCount(null)).toBeNull();
        });

        it('should return numbers less than 1000 as-is', () => {
            expect(abbreviateCount(0)).toBe('0');
            expect(abbreviateCount(42)).toBe('42');
            expect(abbreviateCount(999)).toBe('999');
        });

        it('should abbreviate thousands with K suffix', () => {
            expect(abbreviateCount(1000)).toBe('1K');
            expect(abbreviateCount(1500)).toBe('1.5K');
            expect(abbreviateCount(5000)).toBe('5K');
            expect(abbreviateCount(999999)).toBe('1000.0K');
        });

        it('should abbreviate millions with M suffix', () => {
            expect(abbreviateCount(1000000)).toBe('1M');
            expect(abbreviateCount(2500000)).toBe('2.5M');
            expect(abbreviateCount(42000000)).toBe('42M');
            expect(abbreviateCount(999999999)).toBe('1000.0M');
        });

        it('should abbreviate billions with B suffix', () => {
            expect(abbreviateCount(1000000000)).toBe('1B');
            expect(abbreviateCount(3500000000)).toBe('3.5B');
            expect(abbreviateCount(42000000000)).toBe('42B');
        });

        it('should round decimals to one place', () => {
            expect(abbreviateCount(1234)).toBe('1.2K');
            expect(abbreviateCount(1567)).toBe('1.6K');
            expect(abbreviateCount(1234567)).toBe('1.2M');
        });
    });
});
