import { describe, expect, it } from 'vitest';
import { formatIncludes, transformPaginatedResponse } from '@/utils/service';

describe('service utils', () => {
    describe('formatIncludes', () => {
        it('should convert array to record with true values', () => {
            const result = formatIncludes(['field1', 'field2', 'field3']);
            expect(result).toEqual({
                field1: true,
                field2: true,
                field3: true,
            });
        });

        it('should handle empty array', () => {
            expect(formatIncludes([])).toEqual({});
        });

        it('should handle single item', () => {
            expect(formatIncludes(['only'])).toEqual({ only: true });
        });
    });

    describe('transformPaginatedResponse', () => {
        it('should handle empty data array', () => {
            const transformer = transformPaginatedResponse;

            const jsonData = JSON.stringify({
                data: [],
                page: 1,
                perPage: 10,
                total: 0,
            });

            const result = transformer(jsonData);
            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
        });
    });
});
