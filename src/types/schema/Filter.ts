import type { Pagination } from "@/types/schema/Pagination";

export type ReservableOption = {
    value: boolean | null | undefined;
    label: string;
};

export type LocationFilter = Pagination & {
    language?: string | null;
    city?: string | null;

    isReservable?: boolean | null;

    openOnDay?: Date | null;
    openOnTime?: Date | null;

    centerLat?: number | null;
    centerLng?: number | null;
    distance?: number | null;

    northEastLat?: number | null;
    northEastLng?: number | null;
    southWestLat?: number | null;
    southWestLng?: number | null;
};
