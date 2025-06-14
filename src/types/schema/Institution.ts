import type { Image } from '@/types/schema/Image';
import type { Translation } from '@/types/schema/Translation';

export type Institution = {
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
