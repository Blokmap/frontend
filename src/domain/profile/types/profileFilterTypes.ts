import type { ProfileState } from './profileSchemaTypes';
import type { Pagination } from '@/utils/pagination';

export type ProfileFilter = Pagination & {
    query?: string;
    isAdmin?: boolean;
    state?: ProfileState | null;
};
