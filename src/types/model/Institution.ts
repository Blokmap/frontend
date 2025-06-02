import { Image } from '@/types/model/Image';
import { Translation } from '@/types/model/Translation';
import z from 'zod/v4';

export const Institution = z.object({
    slug: Translation,
    name: Translation,
    logo: Image,
    email: z.email().nullable(),
    phone: z.string().nullable(),
    street: z.string().nullable(),
    zip: z.string().nullable(),
    city: z.string().nullable(),
    province: z.string().nullable(),
    country: z.string().nullable(),
});

export type Institution = z.infer<typeof Institution>;
