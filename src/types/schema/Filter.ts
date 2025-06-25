import type { LngLatBounds } from '@/types/contract/Map';
import type { Pagination } from '@/types/schema/Pagination';

export type ReservableOption = {
    value: boolean | null | undefined;
    label: string;
};

export type LocationFilter = Pagination & {
    language?: string | null;
    location?: GeoJSON.GeoJsonProperties;
    isReservable?: boolean | null;
    openOn?: Date | null;
    bounds?: LngLatBounds;
};
