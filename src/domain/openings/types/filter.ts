import type { Pagination } from '@/utils/pagination';

export type OpeningTimeFilter = Pagination & {
    inWeekOf?: Date | null;
};
