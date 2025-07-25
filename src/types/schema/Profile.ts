import type { Authority } from '@/types/schema/Authority';
import type { Institution } from '@/types/schema/Institution';

export type Profile = {
    id: number;
    username: string | null;
    firstName: string;
    lastName: string;
    email: string;
    institution?: Institution | null;
    authorities?: Authority[];
};

export type Idp = {
    name: string;
    logo?: string | null;
};
