import type { ReservationState } from './schema';
import type { Pagination } from '@/utils/pagination';

export type ReservationFilter = Pagination & {
    date?: Date | null;
    inWeekOf?: Date | null;
    selectedDate?: Date | null;
    state?: ReservationState | null;
};
