import type { ReservationState } from './reservationSchemaTypes';
import type { Pagination } from '@/utils/pagination';

export type ReservationFilter = Pagination & {
    day?: Date | null;
    inWeekOf?: Date | null;
    state?: ReservationState | null;
    locationId?: number | null;
};
