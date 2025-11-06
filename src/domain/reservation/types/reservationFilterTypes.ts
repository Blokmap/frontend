import type { ReservationState } from './reservationSchemaTypes';

export type ReservationFilter = {
    day?: Date | null;
    inWeekOf?: Date | null;
    state?: ReservationState | null;
    locationId?: number | null;
};
