import { Authority } from '@/types/schema/Authority';
import { Institution } from '@/types/schema/Institution';
import { z } from 'zod/v4';

export const Idp = z.object({
    name: z.string(),
    logo: z.string().nullish(),
});

export const Profile = z.object({
    id: z.number(),
    username: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    institution: z.lazy(() => Institution.optional().nullable()),
    authorities: z.lazy(() => Authority.array().optional()),
});

export type Profile = z.infer<typeof Profile>;
export type Idp = z.infer<typeof Idp>;
