import { Image } from '@/types/schema/Image';
import { Profile } from '@/types/schema/Profile';
import { Translation } from '@/types/schema/Translation';
import { datetime } from '@/utils/zod';
import { z } from 'zod/v4';

export const Location = z.object({
    id: z.number(),
    name: z.string(),
    description: z.lazy(() => Translation),
    excerpt: z.lazy(() => Translation),
    seatCount: z.number(),
    reservationBlockSize: z.number(),
    minReservationLength: z.number().nullable(),
    maxReservationLength: z.number().nullable(),
    isReservable: z.boolean(),
    isVisible: z.boolean(),
    street: z.string(),
    number: z.string(),
    zip: z.string(),
    city: z.string(),
    province: z.string(),
    latitude: z.float64(),
    longitude: z.float64(),
    approvedAt: datetime.nullable(),
    createdAt: datetime,
    updatedAt: datetime,
    approvedBy: z.lazy(() => Profile.optional().nullable()),
    createdBy: z.lazy(() => Profile.optional().nullable()),
    updatedBy: z.lazy(() => Profile.optional().nullable()),
    images: z.lazy(() => Image.array().optional()),
});

export const SearchedLocation = z.object({
    id: z.number(),
    name: z.string(),
    latitude: z.float64(),
    longitude: z.float64(),
});

export const OpeningTime = z.object({
    id: z.number(),
    startTime: datetime,
    endTime: datetime,
    seatCount: z.number().nullable(),
    reservableFrom: datetime.nullable(),
    reservableUntil: datetime.nullable(),
    createdBy: z.lazy(() => Profile.optional().nullable()),
    updatedBy: z.lazy(() => Profile.optional().nullable()),
    createdAt: datetime,
    updatedAt: datetime,
});

export const Tag = z.object({
    id: z.string(),
    name: z.lazy(() => Translation),
});

export const Review = z.object({
    id: z.number(),
    profile: z.lazy(() => Profile),
    location: z.lazy(() => Location.optional()),
    rating: z.number().min(1).max(5),
    body: z.string().nullable(),
    createdAt: datetime,
    updatedAt: datetime,
});

export type Location = z.infer<typeof Location>;
export type SearchedLocation = z.infer<typeof SearchedLocation>;
export type OpeningTime = z.infer<typeof OpeningTime>;
export type Tag = z.infer<typeof Tag>;
export type Review = z.infer<typeof Review>;
