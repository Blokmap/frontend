import type { Pagination } from '@/utils/pagination';

export type AuthorityFilter = Pagination & {
    query?: string | null;
};
