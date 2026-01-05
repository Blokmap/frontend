import type { Predicate } from './predicateTypes';

export type Idp = {
    id: string;
    name: string;
    logo?: string | null;
};

export type AuthSettings = {
    required?: boolean;
    admin?: boolean;
    authority?: Predicate;
    location?: Predicate;
    institution?: Predicate;
};

export type LoginRequest = {
    username: string;
    password: string;
    remember: boolean;
};

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
};
