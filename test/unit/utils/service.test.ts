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
        it('should parse paginated data with custom parser', () => {
            const parser = (item: any) => ({ ...item, parsed: true });
            const transformer = transformPaginatedResponse(parser);

            const jsonData = JSON.stringify({
                data: [{ id: 1 }, { id: 2 }],
                page: 1,
                perPage: 10,
                total: 2,
            });

            const result = transformer(jsonData);

            expect(result.data).toEqual([
                { id: 1, parsed: true },
                { id: 2, parsed: true },
            ]);
            expect(result.page).toBe(1);
            expect(result.perPage).toBe(10);
            expect(result.total).toBe(2);
        });

        it('should handle empty data array', () => {
            const parser = (item: any) => item;
            const transformer = transformPaginatedResponse(parser);

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

        it('should apply parser transformation correctly', () => {
            const parser = (item: any) => item.value.toUpperCase();
            const transformer = transformPaginatedResponse(parser);

            const jsonData = JSON.stringify({
                data: [{ value: 'hello' }, { value: 'world' }],
                page: 1,
                perPage: 10,
                total: 2,
            });

            const result = transformer(jsonData);
            expect(result.data).toEqual(['HELLO', 'WORLD']);
        });
    });
});
