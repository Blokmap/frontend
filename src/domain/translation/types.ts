export type Translation = {
    id: string;
    [key: string]: string | null | undefined;
};

export type TranslationRequest = {
    id?: string;
    [key: string]: string | null | undefined;
};
