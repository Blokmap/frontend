import type { Predicate } from '../member';

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

export type LoginBody = {
    username: string;
    password: string;
    remember: boolean;
};

export type RegisterBody = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
};
