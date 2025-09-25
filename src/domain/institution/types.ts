import type { Image } from '@/domain/image';
import type { Translation } from '@/domain/translation';

export type Institution = {
    id: number;
    slug: Translation;
    name: Translation;
    logo: Image;
    email: string | null;
    phone: string | null;
    street: string | null;
    zip: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
};

export type InstitutionFilter = {
    query?: string;
    page?: number;
    perPage?: number;
};
