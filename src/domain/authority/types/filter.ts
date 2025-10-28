import type { Pagination } from '@/utils/pagination';

export type AuthorityFilter = Pagination & {
    query?: string | null;
    // Filter authorities by institution slug or id
    institution?: string | number | null;
};
