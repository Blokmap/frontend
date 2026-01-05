import { describe, expect, it } from 'vitest';
import { createMockReservation } from '../../mocks';
import { toTimeslot, toTimeslots } from '@/domain/calendar';

describe('reservation helpers', () => {
    describe('reservationToTimeSlot', () => {
        it('should convert reservation to TimeSlot', () => {
            const reservation = createMockReservation({
                id: '42',
                day: new Date(2024, 0, 15, 10, 30, 45),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            });

            const result = toTimeslot(reservation);

            expect(result.day.getHours()).toBe(0);
            expect(result.day.getMinutes()).toBe(0);
            expect(result.day.getSeconds()).toBe(0);
            expect(result.startTime).toEqual({ hours: 9, minutes: 0 });
            expect(result.endTime).toEqual({ hours: 17, minutes: 0 });
            expect(result.metadata).toBe(reservation);
        });

        it('should reset time to start of day', () => {
            const reservation = createMockReservation({
                id: '1',
                day: new Date(2024, 0, 15, 23, 59, 59),
                startTime: { hours: 14, minutes: 30 },
                endTime: { hours: 16, minutes: 0 },
            });

            const result = toTimeslot(reservation);

            expect(result.day.getDate()).toBe(15);
            expect(result.day.getHours()).toBe(0);
            expect(result.day.getMinutes()).toBe(0);
        });
    });

    describe('toTimeslot', () => {
        it('should convert multiple reservations to time slots', () => {
            const reservations = [
                createMockReservation({
                    id: '1',
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: '2',
                    day: new Date(2024, 0, 16),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const result = toTimeslots(reservations);

            expect(result).toHaveLength(2);
        });

        it('should handle empty reservations array', () => {
            const result = toTimeslots([]);
            expect(result).toEqual([]);
        });

        it('should not filter when date range not provided', () => {
            const reservations = [
                createMockReservation({
                    id: '1',
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: '2',
                    day: new Date(2024, 5, 20),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const result = toTimeslots(reservations);

            expect(result).toHaveLength(2);
        });
    });
});
