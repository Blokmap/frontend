import type { LocationState } from './locationSchemaTypes';
import type { LngLatBounds } from '@/domain/map/types/mapTypes';
import type { Tag } from '@/domain/tag';
import type { Pagination } from '@/utils/pagination';
import type { Time } from '@/utils/time';

export type LocationFilter = Pagination & {
    query?: string | null;
    state?: LocationState | null;
    language?: string | null;
};

export type LocationSearchFilter = Pagination & {
    query?: string | null;
    reservable?: boolean | null;
    openOnTime?: Time | null;
    openOnDay?: Date | null;
    tags?: Tag[];
    bounds?: LngLatBounds | null;
};

export type RecentLocationFilter = {
    maxCount?: number | null;
};
