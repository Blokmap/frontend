export * from './auth';

// Re-export from member domain for backwards compatibility
export type { Role, Membership, MembershipBody, Predicate, PermissionType } from '@/domain/member';
export { LocationPermission, AuthorityPermission, InstitutionPermission } from '@/domain/member';

export type AuthSettings = {
    required?: boolean;
    admin?: boolean;
    authority?: unknown;
    location?: unknown;
    institution?: unknown;
};
