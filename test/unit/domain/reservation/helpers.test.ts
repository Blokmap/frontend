import { describe, expect, it } from 'vitest';
import { filterReservationsByDateRange } from '@/domain/reservation';
import { createMockReservation } from '../../mocks';
import { reservationsToTimeSlots, reservationToTimeSlot } from '@/domain/calendar';

describe('reservation helpers', () => {
    describe('filterReservationsByDateRange', () => {
        it('should filter reservations within date range', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: 2,
                    day: new Date(2024, 0, 20),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
                createMockReservation({
                    id: 3,
                    day: new Date(2024, 0, 25),
                    startTime: { hours: 10, minutes: 0 },
                    endTime: { hours: 16, minutes: 0 },
                }),
            ];

            const startDate = new Date(2024, 0, 10);
            const endDate = new Date(2024, 0, 22);

            const result = filterReservationsByDateRange(reservations, startDate, endDate);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
        });

        it('should include reservations on boundary dates', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
            ];

            const startDate = new Date(2024, 0, 15);
            const endDate = new Date(2024, 0, 15);

            const result = filterReservationsByDateRange(reservations, startDate, endDate);

            expect(result).toHaveLength(1);
        });

        it('should return empty array when no reservations match', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
            ];

            const startDate = new Date(2024, 1, 1);
            const endDate = new Date(2024, 1, 28);

            const result = filterReservationsByDateRange(reservations, startDate, endDate);

            expect(result).toHaveLength(0);
        });

        it('should handle empty reservations array', () => {
            const result = filterReservationsByDateRange(
                [],
                new Date(2024, 0, 1),
                new Date(2024, 0, 31),
            );
            expect(result).toEqual([]);
        });
    });

    describe('reservationToTimeSlot', () => {
        it('should convert reservation to TimeSlot', () => {
            const reservation = createMockReservation({
                id: 42,
                day: new Date(2024, 0, 15, 10, 30, 45),
                startTime: { hours: 9, minutes: 0 },
                endTime: { hours: 17, minutes: 0 },
            });

            const result = reservationToTimeSlot(reservation);

            expect(result.id).toBe('reservation-42');
            expect(result.day.getHours()).toBe(0);
            expect(result.day.getMinutes()).toBe(0);
            expect(result.day.getSeconds()).toBe(0);
            expect(result.startTime).toEqual({ hours: 9, minutes: 0 });
            expect(result.endTime).toEqual({ hours: 17, minutes: 0 });
            expect(result.metadata).toBe(reservation);
        });

        it('should reset time to start of day', () => {
            const reservation = createMockReservation({
                id: 1,
                day: new Date(2024, 0, 15, 23, 59, 59),
                startTime: { hours: 14, minutes: 30 },
                endTime: { hours: 16, minutes: 0 },
            });

            const result = reservationToTimeSlot(reservation);

            expect(result.day.getDate()).toBe(15);
            expect(result.day.getHours()).toBe(0);
            expect(result.day.getMinutes()).toBe(0);
        });
    });

    describe('reservationsToTimeSlots', () => {
        it('should convert multiple reservations to time slots', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: 2,
                    day: new Date(2024, 0, 16),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const result = reservationsToTimeSlots(reservations);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('reservation-1');
            expect(result[1].id).toBe('reservation-2');
        });

        it('should filter by date range when provided', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: 2,
                    day: new Date(2024, 0, 25),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const startDate = new Date(2024, 0, 10);
            const endDate = new Date(2024, 0, 20);

            const result = reservationsToTimeSlots(reservations, startDate, endDate);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('reservation-1');
        });

        it('should return empty array for undefined reservations', () => {
            const result = reservationsToTimeSlots(undefined);
            expect(result).toEqual([]);
        });

        it('should handle empty reservations array', () => {
            const result = reservationsToTimeSlots([]);
            expect(result).toEqual([]);
        });

        it('should not filter when date range not provided', () => {
            const reservations = [
                createMockReservation({
                    id: 1,
                    day: new Date(2024, 0, 15),
                    startTime: { hours: 9, minutes: 0 },
                    endTime: { hours: 12, minutes: 0 },
                }),
                createMockReservation({
                    id: 2,
                    day: new Date(2024, 5, 20),
                    startTime: { hours: 13, minutes: 0 },
                    endTime: { hours: 17, minutes: 0 },
                }),
            ];

            const result = reservationsToTimeSlots(reservations);

            expect(result).toHaveLength(2);
        });
    });
});
