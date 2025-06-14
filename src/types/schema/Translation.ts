export type Translation = {
    id?: string;
    nl: string | null;
    en: string | null;
    de: string | null;
    fr: string | null;
    [key: string]: string | null | undefined;
};
