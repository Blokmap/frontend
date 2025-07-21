import type { LngLat, LngLatBounds } from '@/types/contract/Map';
import type { Pagination } from '@/types/schema/Pagination';

export type ReservableOption = {
    value: boolean | null | undefined;
    label: string;
};

export type LocationFilter = Pagination & {
    isReservable: boolean | null;
    openOn: Date | null;
    bounds: LngLatBounds | null;
    center: {
        coords: LngLat;
        radius?: number | null;
    } | null;
};
