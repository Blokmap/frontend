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
