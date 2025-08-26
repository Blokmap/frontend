import type { Authority } from '@/domain/authority';
import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';

export type Profile = {
    id: number;
    avatarUrl: Image | null;
    username: string | null;
    firstName: string;
    lastName: string;
    email: string;
    institution?: Institution | null;
    authorities?: Authority[];
    createdAt: Date;
};

export type ProfileStats = {
    totalReservations: number;
    upcomingReservations: number;
    completedReservations: number;
    totalReservationHours: number;
};

export type Idp = {
    id: string;
    name: string;
    logo?: string | null;
};

export type LoginRequest = {
    username: string;
    password: string;
    remember: boolean;
};

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
};
