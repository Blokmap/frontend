import google from '@/assets/img/idps/google.svg';
import type { Idp } from '@/domain/auth';

export const authIdentityProviders: Idp[] = [
    {
        id: 'google',
        name: 'Google',
        logo: google,
    },
];
