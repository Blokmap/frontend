import type { Pagination } from './Pagination';
import type { LngLat, LngLatBounds } from '@/domain/map';

export type LocationFilter = Pagination & {
    isReservable: boolean | null;
    openOn: Date | null;
    bounds: LngLatBounds | null;
    center: {
        coords: LngLat;
        radius?: number | null;
    } | null;
};
