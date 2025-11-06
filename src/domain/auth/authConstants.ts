import google from '@/assets/img/logos/idps/google.svg';
import type { Idp } from '@/domain/auth';

export const AUTH_IDPS: Idp[] = [
    {
        id: 'google',
        name: 'Google',
        logo: google,
    },
];
