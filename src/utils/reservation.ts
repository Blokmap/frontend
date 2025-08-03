import type { Location } from '@/types/schema/Location';
import type { Reservation } from '@/types/schema/Reservation';

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
