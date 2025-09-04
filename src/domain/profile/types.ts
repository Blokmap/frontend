import type { Authority } from '@/domain/authority';
import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';

export type Profile = {
    id: number;
    avatarUrl: Image | null;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    institution?: Institution | null;
    authorities?: Authority[];
    createdAt: Date;
    isAdmin: boolean;
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
