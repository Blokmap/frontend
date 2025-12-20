import type { Profile } from '../profile';
import type { Translation } from '../translation';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type Tag = {
    id: number;
    name: Translation;
    key: string;
    icon: IconDefinition | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
};

export type TagRequest = {
    name: Translation;
    key: string;
    icon: string | null;
};
