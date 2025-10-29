import google from '@/assets/img/logos/idps/google.svg';
import { LocationPermission, AuthorityPermission, InstitutionPermission } from './types/permission';
import type { Idp } from '@/domain/auth';

export const AUTH_IDPS: Idp[] = [
    {
        id: 'google',
        name: 'Google',
        logo: google,
    },
];

export const LOCATION_PERMISSIONS = Object.entries(LocationPermission).map(([name, value]) => ({
    name,
    value: value as LocationPermission,
}));

export const AUTHORITY_PERMISSIONS = Object.entries(AuthorityPermission).map(([name, value]) => ({
    name,
    value: value as AuthorityPermission,
}));

export const INSTITUTION_PERMISSIONS = Object.entries(InstitutionPermission).map(
    ([name, value]) => ({
        name,
        value: value as InstitutionPermission,
    }),
);
