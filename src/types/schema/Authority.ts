import { Location } from '@/types/schema/Location';
import { Profile } from '@/types/schema/Profile';
import { ZodType, z } from 'zod/v4';

export type Authority = {
    id: number;
    name: string;
    description: string | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    members?: Profile[];
    locations?: Location[];
};

export const Authority: ZodType<Authority> = z.lazy(() =>
    z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        createdBy: Profile.optional().nullable(),
        updatedBy: Profile.optional().nullable(),
        members: Profile.array().optional(),
        locations: Location.array().optional(),
    }),
);
