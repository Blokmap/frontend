import z from 'zod/v4';

export const LocationFilter = z.object({
    language: z.string().nullish(),
    query: z.string().nullish(),

    isReservable: z.boolean().nullish(),

    openOnDay: z.date().nullish(),
    openOnTime: z.date().nullish(),

    centerLat: z.number().nullish(),
    centerLng: z.number().nullish(),
    distance: z.number().nullish(),

    northEastLat: z.number().nullish(),
    northEastLng: z.number().nullish(),
    southWestLat: z.number().nullish(),
    southWestLng: z.number().nullish(),
});

export type LocationFilter = z.infer<typeof LocationFilter>;
