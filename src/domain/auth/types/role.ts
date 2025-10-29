import type { Profile } from '@/domain/profile';

export type Role = {
    name: string;
    colour: string;
    permissions: number;
    createdAt: Date;
    updatedAt: Date;
};

export type Membership = {
    profile: Profile;
    role: Role;
};
