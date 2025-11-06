import type { LocationState } from './locationSchemaTypes';
import type { LngLat, LngLatBounds } from '../../map';
import type { Pagination } from '@/utils/pagination';

export type LocationFilter = Pagination & {
    query?: string | null;
    state?: LocationState | null;
    language?: string | null;
};

export type LocationSearchFilter = Pagination & {
    query?: string | null;
    isReservable?: boolean | null;
    openOn?: Date | null;
    bounds?: LngLatBounds | null;
    center?: {
        coords: LngLat;
        radius?: number | null;
    } | null;
    language?: string | null;
};
