import { z } from 'zod/v4';

export const Translation = z
    .object({
        nl: z.string().nullable(),
        en: z.string().nullable(),
        de: z.string().nullable(),
        fr: z.string().nullable(),
    })
    .catchall(z.string().nullable());

export type Translation = z.infer<typeof Translation>;
