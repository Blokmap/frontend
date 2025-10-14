import { describe, expect, it } from 'vitest';
import { getTotalPages, hasNextPage, hasPreviousPage } from '@/utils/pagination';
import type { Paginated } from '@/utils/pagination';

describe('pagination utils', () => {
    describe('hasNextPage', () => {
        it('should return true when more pages available', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 1,
                perPage: 10,
                total: 25,
                truncated: false,
            };
            expect(hasNextPage(paginated)).toBe(true);
        });

        it('should return false on last page', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 3,
                perPage: 10,
                total: 25,
                truncated: false,
            };
            expect(hasNextPage(paginated)).toBe(false);
        });

        it('should return false when on exact last page', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 2,
                perPage: 10,
                total: 20,
                truncated: false,
            };
            expect(hasNextPage(paginated)).toBe(false);
        });

        it('should handle empty results', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 1,
                perPage: 10,
                total: 0,
                truncated: false,
            };
            expect(hasNextPage(paginated)).toBe(false);
        });
    });

    describe('hasPreviousPage', () => {
        it('should return false on first page', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 1,
                perPage: 10,
                total: 25,
                truncated: false,
            };
            expect(hasPreviousPage(paginated)).toBe(false);
        });

        it('should return true on second page', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 2,
                perPage: 10,
                total: 25,
                truncated: false,
            };
            expect(hasPreviousPage(paginated)).toBe(true);
        });

        it('should return true on later pages', () => {
            const paginated: Paginated<any> = {
                data: [],
                page: 5,
                perPage: 10,
                total: 100,
                truncated: false,
            };
            expect(hasPreviousPage(paginated)).toBe(true);
        });
    });

    describe('getTotalPages', () => {
        it('should calculate correct total pages', () => {
            expect(
                getTotalPages({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 25,
                    truncated: false,
                }),
            ).toBe(3);
        });

        it('should handle exact multiples', () => {
            expect(
                getTotalPages({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 30,
                    truncated: false,
                }),
            ).toBe(3);
        });

        it('should return 1 for empty results', () => {
            expect(
                getTotalPages({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 0,
                    truncated: false,
                }),
            ).toBe(0);
        });

        it('should handle single item', () => {
            expect(
                getTotalPages({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 1,
                    truncated: false,
                }),
            ).toBe(1);
        });

        it('should round up partial pages', () => {
            expect(
                getTotalPages({
                    data: [],
                    page: 1,
                    perPage: 10,
                    total: 95,
                    truncated: false,
                }),
            ).toBe(10);
        });
    });
});
