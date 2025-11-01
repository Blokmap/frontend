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

export type Idp = {
    id: string;
    name: string;
    logo?: string | null;
};
