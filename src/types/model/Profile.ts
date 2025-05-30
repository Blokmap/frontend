import { Authority } from '@/types/model/Authority';
import { Institution } from '@/types/model/Institution';
import { z, ZodType } from 'zod/v4';

export type Profile = {
    id: number;
    username: string | null;
    firstName: string;
    lastName: string;
    email: string;
    institution?: Institution | null;
    authorities?: Authority[];
};

export const Profile: ZodType<Profile> = z.lazy(() =>
    z.object({
        id: z.number(),
        username: z.string().nullable(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.email(),
        institution: Institution.optional().nullable(),
        authorities: Authority.array().optional(),
    }),
);
