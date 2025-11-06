import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

export * from './memberPermissionTypes';
export * from './memberPredicateTypes';

// A role defines a set of permissions that can be assigned to members.
// This is a opaque type used throughout the member domain.
export type Role = {
    id: number;
    name: string;
    colour: string;
    permissions: number;
    createdAt: Date;
    updatedAt: Date;
};

// A member represents a profile with a specific role in a certain context
// Contexts are: Location, Authority, Institution
export type Member = {
    profile: Profile;
    role: Role;
};

export type MemberBody = {
    roleId: number;
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
};

export type InstitutionMembership = {
    institution: Institution;
    role: Role | null;
};
