import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

export type Authority = {
    id: number;
    name: string;
    description: string | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    members?: Profile[];
    locations?: Location[];
};
