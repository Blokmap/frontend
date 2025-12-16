import type { Authority } from '@/domain/authority';
import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';
import type { Time } from '@/utils/time';

export enum ProfileState {
    Active = 'Active',
    Disabled = 'Disabled',
    Deleted = 'Deleted',
}

export type Profile = {
    id: string;
    avatar: Image | null;
    username: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    institution?: Institution | null;
    authorities?: Authority[];
    createdAt: Date;
    isAdmin: boolean;
    state: ProfileState;
};

export type FoundProfile = {
    id: string;
    username: string;
    avatar: Image | null;
    firstName: string | null;
    lastName: string | null;
};

export type ProfileStats = {
    totalReservations: number;
    upcomingReservations: number;
    completedReservations: number;
    totalReservationHours: number;
};

export type ProfileRequest = {
    firstName: string | null;
    lastName: string | null;
    username: string;
};

export type ProfileScanBody = {
    locationId: number;
    day?: Date | null;
    time?: Time | null;
};
