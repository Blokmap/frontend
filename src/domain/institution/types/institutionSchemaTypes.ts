import type { Image } from '@/domain/image';
import type { Translation, TranslationBody } from '@/domain/translation';

export enum InstitutionCategory {
    Education = 'education',
    Organisation = 'organisation',
    Government = 'government',
}

export type Institution = {
    id: number;
    slug: string;
    name: Translation;
    logo: Image;
    email: string | null;
    phone: string | null;
    street: string | null;
    number: string | null;
    zip: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    category: InstitutionCategory;
    aclType: 'blacklist' | 'whitelist';
};

export type InstitutionBody = {
    category: InstitutionCategory;
    name: TranslationBody;
    slug: string;
    aclType: 'blacklist' | 'whitelist';
    city: string | null;
    zip: string | null;
    country: string | null;
    number: string | null;
    street: string | null;
    province: string | null;
    email: string | null;
    phoneNumber: string | null;
};
