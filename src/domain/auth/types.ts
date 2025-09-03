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

export type Idp = {
    id: string;
    name: string;
    logo?: string | null;
};
