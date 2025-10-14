import type { LocationState } from './schema';
import type { LngLat, LngLatBounds } from '../../map';
import type { Pagination } from '@/utils/pagination';

export type LocationFilter = Pagination & {
    query?: string | null;
    state?: LocationState | null;
};

export type LocationSearchFilter = Pagination & {
    isReservable?: boolean | null;
    openOn?: Date | null;
    bounds?: LngLatBounds | null;
    center?: {
        coords: LngLat;
        radius?: number | null;
    } | null;
};
