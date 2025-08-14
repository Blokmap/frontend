import google from '@/assets/img/idps/google.svg';
import microsoft from '@/assets/img/idps/microsoft.svg';
import type { Idp } from '@/types/schema/Profile';

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
