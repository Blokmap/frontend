import z from 'zod/v4';

export const Institution = z.object({
    name: z.string(),
    email: z.email().nullable(),
    phone: z.string().nullable(),
    street: z.string().nullable(),
    city: z.string().nullable(),
    province: z.string().nullable(),
    country: z.string().nullable(),
});

export type Institution = z.infer<typeof Institution>;
