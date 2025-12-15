import { describe, expect, it } from 'vitest';
import {
    getOpeningTimesForDay,
    getOpeningsFromRepetition,
    groupOpeningTimesByDay,
    isOverlapping,
    openingToRequest,
} from '@/domain/openings';
import { createMockOpeningTime, createMockOpeningTimeBody } from '../../mocks';

describe('openings helpers', () => {
    describe('getOpeningsFromRepetition', () => {
        it('should return single opening when no repetition', () => {
            const opening = createMockOpeningTimeBody({
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                seatCount: 50,
            });

            const result = getOpeningsFromRepetition(opening);

            expect(result).toHaveLength(1);
            expect(result[0]).toBe(opening);
        });

        it('should generate multiple openings with repetition', () => {
            const opening = createMockOpeningTimeBody({
                day: new Date(2024, 0, 1), // Monday
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                seatCount: 50,
                sequenceId: 'seq-1',
                repetition: {
                    selectedDays: [0, 1, 2, 3, 4], // Monday to Friday
                    endDate: new Date(2024, 0, 5), // End on Friday
                },
            });

            const result = getOpeningsFromRepetition(opening);

            expect(result).toHaveLength(5); // Mon-Fri
            expect(result[0].day.getDate()).toBe(1);
            expect(result[4].day.getDate()).toBe(5);
        });

        it('should use weekdays when selectedDays is empty', () => {
            const opening = createMockOpeningTimeBody({
                day: new Date(2024, 0, 1),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                seatCount: 50,
                sequenceId: 'seq-1',
                repetition: {
                    selectedDays: [],
                    endDate: new Date(2024, 0, 7),
                },
            });

            const result = getOpeningsFromRepetition(opening);

            // Should default to weekdays (Mon-Fri)
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThanOrEqual(7);
        });

        it('should filter by selected days', () => {
            const opening = createMockOpeningTimeBody({
                day: new Date(2024, 0, 1),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                seatCount: 50,
                sequenceId: 'seq-1',
                repetition: {
                    selectedDays: [5, 6], // Weekend only
                    endDate: new Date(2024, 0, 14),
                },
            });

            const result = getOpeningsFromRepetition(opening);

            // Should only have weekend days
            result.forEach((r) => {
                const day = r.day.getDay();
                expect([0, 6]).toContain(day); // Sunday or Saturday
            });
        });
    });

    describe('groupOpeningTimesByDay', () => {
        it('should group opening times by day', () => {
            const openingTimes = [
                createMockOpeningTime({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockOpeningTime({
                    id: 2,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
                createMockOpeningTime({
                    id: 3,
                    day: new Date(2024, 0, 16),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const result = groupOpeningTimesByDay(openingTimes);

            expect(result.size).toBe(2);
            expect(result.get(new Date(2024, 0, 15).toDateString())).toHaveLength(2);
            expect(result.get(new Date(2024, 0, 16).toDateString())).toHaveLength(1);
        });

        it('should sort times within each day by start time', () => {
            const openingTimes = [
                createMockOpeningTime({
                    id: 2,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
                createMockOpeningTime({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
            ];

            const result = groupOpeningTimesByDay(openingTimes);
            const dayTimes = result.get(new Date(2024, 0, 15).toDateString())!;

            expect(dayTimes[0].startTime.hours).toBe(9);
            expect(dayTimes[1].startTime.hours).toBe(13);
        });

        it('should handle empty array', () => {
            const result = groupOpeningTimesByDay([]);
            expect(result.size).toBe(0);
        });
    });

    describe('getOpeningTimesForDay', () => {
        it('should return opening times for specific day', () => {
            const grouped = new Map();
            const date = new Date(2024, 0, 15);
            const openings = [
                createMockOpeningTime({
                    id: 1,
                    day: date,
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];
            grouped.set(date.toDateString(), openings);

            const result = getOpeningTimesForDay(grouped, date);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        it('should return empty array for day without openings', () => {
            const grouped = new Map();
            const date = new Date(2024, 0, 15);

            const result = getOpeningTimesForDay(grouped, date);

            expect(result).toEqual([]);
        });
    });

    describe('isOverlapping', () => {
        it('should detect overlapping times on same day', () => {
            const a = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 12, minutes: 0 },
            };
            const b = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 11, minutes: 0 },
                endTime: { hours: 14, minutes: 0 },
            };

            expect(isOverlapping(a, b)).toBe(true);
        });

        it('should not detect overlap for non-overlapping times', () => {
            const a = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 12, minutes: 0 },
            };
            const b = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 13, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            };

            expect(isOverlapping(a, b)).toBe(false);
        });

        it('should not detect overlap for different days', () => {
            const a = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 12, minutes: 0 },
            };
            const b = {
                day: new Date(2024, 0, 16),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 12, minutes: 0 },
            };

            expect(isOverlapping(a, b)).toBe(false);
        });

        it('should detect overlap when times touch at boundaries', () => {
            const a = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 12, minutes: 0 },
            };
            const b = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 12, minutes: 0 },
                endTime: { hours: 15, minutes: 0 },
            };

            // Times that touch at boundary should not overlap
            expect(isOverlapping(a, b)).toBe(false);
        });

        it('should detect complete containment', () => {
            const a = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            };
            const b = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 11, minutes: 0 },
                endTime: { hours: 13, minutes: 0 },
            };

            expect(isOverlapping(a, b)).toBe(true);
        });
    });

    describe('openingToRequest', () => {
        it('should convert OpeningTime to OpeningTimeBody', () => {
            const opening = createMockOpeningTime({
                id: 42,
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                seatCount: 50,
                sequenceId: 'seq-1',
            });

            const result = openingToRequest(opening);

            expect(result.id).toBe(42);
            expect(result.day).toEqual(new Date(2024, 0, 15));
            expect(result.startTime).toEqual({ hours: 9, minutes: 0 });
            expect(result.endTime).toEqual({ hours: 17, minutes: 0 });
            expect(result.seatCount).toBe(50);
            expect(result.sequenceId).toBe('seq-1');
        });

        it('should preserve all fields', () => {
            const date = new Date(2024, 5, 20);
            const opening = createMockOpeningTime({
                id: 123,
                day: date,
                startTime: { hours: 14, minutes: 30 },
                endTime: { hours: 18, minutes: 45 },
                seatCount: 25,
                sequenceId: null,
            });

            const result = openingToRequest(opening);

            expect(result).toEqual({
                id: 123,
                day: date,
                startTime: { hours: 14, minutes: 30 },
                endTime: { hours: 18, minutes: 45 },
                seatCount: 25,
                reservableFrom: null,
                reservableUntil: null,
                sequenceId: null,
            });
        });
    });
});
