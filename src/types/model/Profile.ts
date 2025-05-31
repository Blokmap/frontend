import { Authority } from '@/types/model/Authority';
import { Institution } from '@/types/model/Institution';
import { z } from 'zod/v4';

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