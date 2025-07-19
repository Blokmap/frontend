import google from '@/assets/img/idps/google.svg';
import microsoft from '@/assets/img/idps/microsoft.svg';
import type { Idp } from '@/types/schema/Profile';

export const authIdentityProviders: Idp[] = [
    {
        name: 'Google',
        logo: google,
    },
    {
        name: 'Microsoft',
        logo: microsoft,
    },
];
