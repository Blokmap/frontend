import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

// Opaque type used throughout the member domain.
export type Role = {
    id: number;
    name: string;
    colour: string;
    permissions: number;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateRoleRequest = {
    name: string;
    permissions: number;
    colour: string;
};

export type UpdateRoleRequest = {
    name?: string;
    permissions?: number;
    colour?: string;
};

// A member represents a profile with a specific role in a certain context
// Contexts are: Location, Authority, Institution
export type Member = {
    profile: Profile;
    role: Role | null;
    addedAt: Date;
};

export type UpdateMemberRequest = {
    roleId?: number;
};

export type CreateMemberRequest = {
    username: string;
    roleId: number | null;
};

// A membership represents the association of a profile with a context
// (Location, Authority, Institution) along with the assigned role
export type LocationMembership = {
    location: Location;
    role: Role | null;
};

export type AuthorityMembership = {
    authority: Authority;
    role: Role | null;
    locations?: LocationMembership[];
};

export type InstitutionMembership = {
    institution: Institution;
    role: Role | null;
    authorities?: AuthorityMembership[];
};
