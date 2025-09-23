import type { LocationStatus } from './schema';
import type { LngLat, LngLatBounds } from '../../map';
import type { Pagination } from '@/domain/shared';

export type LocationFilter = Pagination & {
    query?: string | null;
    status?: LocationStatus | null;
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
