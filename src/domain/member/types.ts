import type { Role } from '../auth';
import type { Profile } from '../profile';

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
