import type { Image } from '@/domain/image';
import type { Institution } from '@/domain/institution';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

export type Authority = {
    id: number;
    logo: Image | null;
    name: string;
    description: string | null;
    createdBy?: Profile | null;
    updatedBy?: Profile | null;
    createdAt: Date;
    updatedAt: Date;
    institution?: Institution;
    members?: Profile[];
    locations?: Location[];
};

export type AuthorityRequest = {
    name: string;
    description: string | null;
    institutionId: number | null;
};
