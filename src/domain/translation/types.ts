export type Translation = {
    id: string;
    [key: string]: string | null | undefined;
};

export type TranslationBody = {
    id?: string;
    [key: string]: string | null | undefined;
};
