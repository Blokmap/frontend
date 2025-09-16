import google from '@/assets/img/logos/idps/google.svg';
import type { Idp } from '@/domain/auth';

export const authIdentityProviders: Idp[] = [
    {
        id: 'google',
        name: 'Google',
        logo: google,
    },
];
