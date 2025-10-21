import type { Authority } from '@/domain/authority';
import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';
import type { Time } from '@/utils/time';

export type ProfileState = 'active' | 'disabled' | 'deleted';

export type Profile = {
    id: number;
    avatarUrl: Image | null;
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

export type ProfileStats = {
    totalReservations: number;
    upcomingReservations: number;
    completedReservations: number;
    totalReservationHours: number;
};

export type ProfileRequest = {
    firstName?: string;
    lastName?: string;
    username?: string;
};

export type ProfileScanRequest = {
    locationId: number;
    day?: Date | null;
    time?: Time | null;
};
