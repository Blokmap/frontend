import type { Pagination } from '@/utils/pagination';

export type InstitutionFilter = Pagination & {
    query?: string | null;
};
