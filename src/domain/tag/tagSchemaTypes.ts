import type { Profile } from '../profile';
import type { Translation, TranslationRequest } from '../translation';

export type Tag = {
    id: number;
    name: Translation;
    slug: string;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
};

export type TagRequest = {
    name: TranslationRequest;
    slug: string;
    icon: string | null | undefined;
};
