import { Profile } from '@/types/model/Profile';
import { Translation } from '@/types/model/Translation';
import type { DateTime } from 'luxon';
import { Image } from '@/types/model/Image';
import { z, ZodType } from 'zod/v4';
import { datetime } from '@/utils/zod';

export type Location = {
    id: number;
    name: string;
    description: Translation;
    excerpt: Translation;
    seatCount: number;
    reservationBlockSize: number;
    minReservationLength: number | null;
    maxReservationLength: number | null;
    isReservable: boolean;
    isVisible: boolean;
    street: string;
    number: string;
    zip: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    approvedAt?: DateTime | null;
    createdAt: DateTime;
    updatedAt: DateTime;
    approvedBy?: Profile | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    images?: Image[];
};

export const Location: ZodType<Location> = z.lazy(() =>
    z.object({
        id: z.number(),
        name: z.string(),
        description: Translation,
        excerpt: Translation,
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
        approvedBy: Profile.optional().nullable(),
        createdBy: Profile.optional().nullable(),
        updatedBy: Profile.optional().nullable(),
        images: Image.array().optional(),
    }),
);

export type OpeningTime = {
    id: number;
    startTime: DateTime;
    endTime: DateTime;
    seatCount: number | null;
    reservableFrom: DateTime | null;
    reservableUntil: DateTime | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    createdAt: DateTime;
    updatedAt: DateTime;
};

export const OpeningTime: ZodType<OpeningTime> = z.lazy(() =>
    z.object({
        id: z.number(),
        startTime: datetime,
        endTime: datetime,
        seatCount: z.number().nullable(),
        reservableFrom: datetime.nullable(),
        reservableUntil: datetime.nullable(),
        createdBy: Profile.optional().nullable(),
        updatedBy: Profile.optional().nullable(),
        createdAt: datetime,
        updatedAt: datetime,
    }),
);

export type Tag = {
    id: string;
    name: Translation;
};

export const Tag: ZodType<Tag> = z.lazy(() =>
    z.object({
        id: z.string(),
        name: Translation,
    }),
);

export type Review = {
    id: number;
    profile: Partial<Profile>;
    rating: number;
    body: string | null;
    createdAt: DateTime;
    updatedAt: DateTime;
};

export const Review: ZodType<Review> = z.lazy(() =>
    z.object({
        id: z.number(),
        profile: Profile,
        rating: z.number().min(1).max(5),
        body: z.string().nullable(),
        createdAt: datetime,
        updatedAt: datetime,
    }),
);
