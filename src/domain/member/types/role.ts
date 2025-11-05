import type { Profile } from '@/domain/profile';

export type Role = {
    id: number;
    name: string;
    colour: string;
    permissions: number;
    createdAt: Date;
    updatedAt: Date;
};

export type Membership = {
    id: number;
    roleId: number;
    profileId: string;
    assignedAt: Date;
    role: Role;
    profile: Profile;
};

export type MembershipBody = {
    roleId: number;
};
