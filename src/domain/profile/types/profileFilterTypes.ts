import type { ProfileState } from './profileSchemaTypes';
import type { Pagination } from '@/utils/pagination';

export type ProfileFilter = Pagination & {
    query?: string | null;
    isAdmin?: boolean;
    state?: ProfileState | null;
};

export type ProfileFindFilter = Pagination & {
    query: string;
};
