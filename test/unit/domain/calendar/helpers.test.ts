import { describe, expect, it } from 'vitest';
import { toTimeslot, toTimeslots } from '@/domain/calendar';
import type { TimeSlottable } from '@/domain/calendar';

describe('calendar helpers', () => {
    describe('toTimeslot', () => {
        it('should convert TimeSlottable to TimeSlot with metadata', () => {
            const timeslottable: TimeSlottable = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            };

            const result = toTimeslot(timeslottable);

            expect(result.day).toBe(timeslottable.day);
            expect(result.startTime).toEqual({ hours: 9, minutes: 0 });
            expect(result.endTime).toEqual({ hours: 17, minutes: 0 });
            expect(result.metadata).toBe(timeslottable);
        });

        it('should preserve additional properties in metadata', () => {
            const timeslottable = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
                customField: 'test',
                id: 123,
            };

            const result = toTimeslot(timeslottable);

            expect(result.metadata).toEqual(timeslottable);
            expect((result.metadata as any).customField).toBe('test');
        });
    });

    describe('toTimeslots', () => {
        it('should convert array of TimeSlottables to TimeSlots', () => {
            const timeslottables: TimeSlottable[] = [
                {
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                },
                {
                    day: new Date(2024, 0, 16),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                },
            ];

            const results = toTimeslots(timeslottables);

            expect(results).toHaveLength(2);
            expect(results[0].day).toEqual(new Date(2024, 0, 15));
            expect(results[1].day).toEqual(new Date(2024, 0, 16));
            expect(results[0].metadata).toBe(timeslottables[0]);
            expect(results[1].metadata).toBe(timeslottables[1]);
        });

        it('should handle empty array', () => {
            const results = toTimeslots([]);
            expect(results).toEqual([]);
        });

        it('should handle single item', () => {
            const timeslottable: TimeSlottable = {
                day: new Date(2024, 0, 15),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            };

            const results = toTimeslots([timeslottable]);

            expect(results).toHaveLength(1);
            expect(results[0].metadata).toBe(timeslottable);
        });
    });
});
