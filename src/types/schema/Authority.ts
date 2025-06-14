import type { Location } from '@/types/schema/Location';
import type { Profile } from '@/types/schema/Profile';

export type Authority = {
    id: number;
    name: string;
    description: string | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    members?: Profile[];
    locations?: Location[];
};
