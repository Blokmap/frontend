import type { Authority } from '@/domain/authority';
import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';
import type { OpeningTime } from '@/domain/openings';
import type { Profile } from '@/domain/profile';
import type { TranslationBody, Translation } from '@/domain/translation';

export type LocationAddress = {
    street: string;
    number: string;
    zip: string;
    city: string;
};

export type LocationFeatures = {
    openAtNight: boolean;
    openInEvening: boolean;
    openInMorning: boolean;
    openInWeekend: boolean;
};

export enum LocationState {
    Approved = 'Approved',
    Pending = 'Pending',
    Rejected = 'Rejected',
}

export type LocationStateBody = {
    state: LocationState;
    reason?: string | null;
};

export type Location = {
    id: number;
    name: string;
    state: LocationState;
    excerpt: Translation;
    description?: Translation;
    seatCount: number;
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
    rejectedAt: Date | null;
    rejectedReason: string | null;
    approvedBy?: Profile | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    rejectedBy?: Profile | null;
    images?: Image[];
    authority?: Authority | null;
    institution?: Institution | null;
};

export type LocationBody = {
    name: string;
    description: TranslationBody;
    excerpt: TranslationBody;
    seatCount: number;
    isReservable: boolean;
    isVisible: boolean;
    street: string;
    number: string;
    zip: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    authorityId?: number | null;
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
