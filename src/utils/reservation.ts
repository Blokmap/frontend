import { formatTimeFromDate, isDateInRange, startOfDay } from './date';
import type { Location } from '@/types/schema/Location';
import type { Reservation, TimeSlot } from '@/types/schema/Reservation';

export type ReservationLocationGroup = {
    location: Location;
    reservations: Reservation[];
};

export type ReservationDayGroup = {
    dayOfWeek: number; // 0 = Monday, 6 = Sunday
    reservations: ReservationLocationGroup[];
};

/**
 * Groups reservations by day of the week and location.
 * Each day contains a list of locations with their respective reservations.
 *
 * @param reservations - List of reservations to group.
 * @returns Array of grouped reservations by day of the week.
 */
export function groupByDayOfWeek(reservations: Reservation[]): ReservationDayGroup[] {
    const grouped: ReservationDayGroup[] = [];

    for (const reservation of reservations) {
        const dayOfWeek = new Date(reservation.startTime).getUTCDay();

        if (!grouped[dayOfWeek]) {
            grouped[dayOfWeek] = { dayOfWeek, reservations: [] };
        }

        // Find or create the location group
        let locationGroup = grouped[dayOfWeek].reservations.find(
            (group) => group.location.id === reservation.location?.id,
        );

        if (!locationGroup && reservation.location) {
            locationGroup = { location: reservation.location, reservations: [] };
            grouped[dayOfWeek].reservations.push(locationGroup);
        }

        locationGroup?.reservations.push(reservation);
    }

    return grouped;
}

/**
 * Filter reservations by date range
 */
export function filterReservationsByDateRange(
    reservations: Reservation[],
    startDate: Date,
    endDate: Date,
): Reservation[] {
    return reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.startTime);
        return isDateInRange(reservationDate, startDate, endDate);
    });
}

/**
 * Convert a reservation to a calendar time slot
 */
export function reservationToTimeSlot(reservation: Reservation): TimeSlot {
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);

    return {
        id: `reservation-${reservation.id}`,
        day: startOfDay(startTime),
        startTime: formatTimeFromDate(startTime),
        endTime: formatTimeFromDate(endTime),
        reservation,
    };
}

/**
 * Convert multiple reservations to time slots, optionally filtered by date range
 */
export function reservationsToTimeSlots(
    reservations?: Reservation[],
    startDate?: Date,
    endDate?: Date,
): TimeSlot[] {
    if (!reservations) return [];

    let filteredReservations = reservations;

    if (startDate && endDate) {
        filteredReservations = filterReservationsByDateRange(reservations, startDate, endDate);
    }

    return filteredReservations.map(reservationToTimeSlot);
}
