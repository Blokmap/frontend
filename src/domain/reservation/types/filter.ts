import type { ReservationState } from './schema';
import type { Pagination } from '@/utils/pagination';

export type ReservationFilter = Pagination & {
    day?: Date | null;
    inWeekOf?: Date | null;
    state?: ReservationState | null;
};
