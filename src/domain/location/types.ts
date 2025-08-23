import type { Image } from '@/domain/image';
import type { OpeningTime } from '@/domain/openingTime';
import type { Profile } from '@/domain/profile';
import type { CreateTranslationRequest, Translation } from '@/domain/translation';

export type LocationAddress = {
    street: string;
    number: string;
    zip: string;
    city: string;
};

export type Location = {
    id: number;
    name: string;
    excerpt: Translation;
    description: Translation;
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
    openingTimes?: OpeningTime[];
    approvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    approvedBy: Profile | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    images?: Image[];
};

export type LocationRequest = {
    name: string;
    description: CreateTranslationRequest;
    excerpt: CreateTranslationRequest;
    seatCount: number;
    isReservable: boolean;
    isVisible: boolean;
    reservationBlockSize: number;
    street: string;
    number: string;
    zip: string;
    city: string;
    country: string;
    province: string;
    latitude: number;
    longitude: number;
};

export type NearestLocation = {
    id: number;
    latitude: number;
    longitude: number;
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
