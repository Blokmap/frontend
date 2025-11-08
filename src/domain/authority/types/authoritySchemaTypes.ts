import type { Institution } from '@/domain/institution';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

export type Authority = {
    id: number;
    name: string;
    description: string | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    institution?: Institution | null;
    members?: Profile[];
    locations?: Location[];
};

export type AuthorityBody = {
    name: string;
    description: string | null;
    institutionId: number | null;
};
