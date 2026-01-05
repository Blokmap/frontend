import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouteDate } from '@/composables/useRouteDate';

// Mock vue-router
const mockRoute = {
    query: {},
    params: {},
};

const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
};

vi.mock('vue-router', () => ({
    useRoute: () => mockRoute,
    useRouter: () => mockRouter,
}));

describe('useRouteDate', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        mockRoute.query = {};
        mockRoute.params = {};
    });

    describe('getter', () => {
        it('should return default date when query param is not present', () => {
            const selectedDate = useRouteDate({ paramName: 'day' });
            const today = new Date();

            expect(selectedDate.value.toDateString()).toBe(today.toDateString());
        });

        it('should return custom default date when provided', () => {
            const customDefault = new Date('2025-01-01');
            const selectedDate = useRouteDate({ paramName: 'day', defaultDate: customDefault });

            expect(selectedDate.value.toDateString()).toBe(customDefault.toDateString());
        });

        it('should parse date from query param', () => {
            mockRoute.query = { day: '2025-10-20' };
            const selectedDate = useRouteDate({ paramName: 'day' });

            expect(selectedDate.value.toISOString()).toContain('2025-10-20');
        });

        it('should parse date from route params when source is params', () => {
            mockRoute.params = { inWeekOf: '2025-10-20' };
            const selectedDate = useRouteDate({ paramName: 'inWeekOf', source: 'params' });

            expect(selectedDate.value.toISOString()).toContain('2025-10-20');
        });

        it('should return default date when query param is invalid', () => {
            mockRoute.query = { day: 'invalid-date' };
            const selectedDate = useRouteDate({ paramName: 'day' });
            const today = new Date();

            expect(selectedDate.value.toDateString()).toBe(today.toDateString());
        });
    });

    describe('setter', () => {
        it('should call router.replace with query when updating date', () => {
            const selectedDate = useRouteDate({ paramName: 'day' });
            const newDate = new Date('2025-10-20');

            selectedDate.value = newDate;

            expect(mockRouter.replace).toHaveBeenCalledWith({
                query: {
                    day: '2025-10-20',
                },
            });
        });

        it('should preserve existing query params when updating', () => {
            mockRoute.query = { other: 'value', day: '2025-01-01' };
            const selectedDate = useRouteDate({ paramName: 'day' });
            const newDate = new Date('2025-10-20');

            selectedDate.value = newDate;

            expect(mockRouter.replace).toHaveBeenCalledWith({
                query: {
                    other: 'value',
                    day: '2025-10-20',
                },
            });
        });

        it('should update route params when source is params', () => {
            mockRoute.params = { id: '123' };
            mockRoute.query = { filter: 'active' };
            const selectedDate = useRouteDate({
                paramName: 'inWeekOf',
                source: 'params',
            });
            const newDate = new Date('2025-10-20');

            selectedDate.value = newDate;

            expect(mockRouter.replace).toHaveBeenCalledWith({
                name: undefined,
                params: {
                    id: '123',
                    inWeekOf: '2025-10-20',
                },
                query: {
                    filter: 'active',
                },
            });
        });

        it('should format date without time when dayOnly is true', () => {
            const selectedDate = useRouteDate({ paramName: 'day', dayOnly: true });
            const newDate = new Date('2025-10-20T15:30:00.000Z');

            selectedDate.value = newDate;

            expect(mockRouter.replace).toHaveBeenCalledWith({
                query: {
                    day: '2025-10-20',
                },
            });
        });

        it('should format date with time when dayOnly is false', () => {
            const selectedDate = useRouteDate({ paramName: 'day', dayOnly: false });
            const newDate = new Date('2025-10-20T15:30:00.000Z');

            selectedDate.value = newDate;

            const call = mockRouter.replace.mock.calls[0][0];
            expect(call.query.day).toContain('2025-10-20');
            expect(call.query.day).toContain('T');
        });
    });
});
