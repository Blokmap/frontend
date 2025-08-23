import google from '@/assets/img/idps/google.svg';
import microsoft from '@/assets/img/idps/microsoft.svg';
import type { Idp } from '@/domain/profile';

export const authIdentityProviders: Idp[] = [
    {
        id: 'google',
        name: 'Google',
        logo: google,
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        logo: microsoft,
    },
];
