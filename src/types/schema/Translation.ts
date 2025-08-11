export type Translation = {
    id: string;
    [key: string]: string | null | undefined;
};

export type CreateTranslationRequest = {
    [key: string]: string | null | undefined;
};
