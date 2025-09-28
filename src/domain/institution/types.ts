import type { Image } from '@/domain/image';
import type { Translation } from '@/domain/translation';

export type InstitutionCategory = 'education' | 'organisation' | 'government';

export type Institution = {
    slug: string;
    name: Translation;
    logo: Image;
    email: string | null;
    phone: string | null;
    street: string | null;
    zip: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    category: InstitutionCategory;
};

export type InstitutionFilter = {
    query?: string;
    page?: number;
    perPage?: number;
};
