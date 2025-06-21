import type { Image } from '@/types/schema/Image';
import type { Profile } from '@/types/schema/Profile';
import type { Translation } from '@/types/schema/Translation';

export type Location = {
    id: number;
    name: string;
    excerpt: Translation | null;
    description?: Translation | null;
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
    country: string;
    province: string;
    latitude: number;
    longitude: number;
    approvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    approvedBy: Profile | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    images?: Image[];
};

export type SearchedLocation = {
    id: number;
    name: Translation;
    latitude: number;
    longitude: number;
};

export type OpeningTime = {
    id: number;
    startTime: Date;
    endTime: Date;
    seatCount: number | null;
    reservableFrom: Date | null;
    reservableUntil: Date | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Tag = {
    id: string;
    name: Translation;
};

export type Review = {
    id: number;
    profile: Profile;
    location?: Location;
    rating: number;
    body: string | null;
    createdAt: Date;
    updatedAt: Date;
};
