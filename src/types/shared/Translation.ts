export type TranslationMessages = {
    [key: string]: string | { [key: string]: string };
};

export type TranslationImport = {
    default: TranslationMessages;
};
