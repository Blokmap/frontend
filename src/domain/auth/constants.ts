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

export const LOCATION_PERMISSIONS = Object.entries(LocationPermission)
    .filter(([name]) => typeof LocationPermission[name as any] === 'number')
    .map(([name, value]) => ({
        name,
        value: value as LocationPermission,
    }));

export const AUTHORITY_PERMISSIONS = Object.entries(AuthorityPermission)
    .filter(([name]) => typeof AuthorityPermission[name as any] === 'number')
    .map(([name, value]) => ({
        name,
        value: value as AuthorityPermission,
    }));

export const INSTITUTION_PERMISSIONS = Object.entries(InstitutionPermission)
    .filter(([name]) => typeof InstitutionPermission[name as any] === 'number')
    .map(([name, value]) => ({
        name,
        value: value as InstitutionPermission,
    }));
