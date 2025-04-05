import type { Institution } from '@/types/model/Institution';

export type User = {
    firstName: string;
    lastName: string;
    institution: Institution;
    email?: string;
    favoriteLocations?: number[];
};

export type Guest = Partial<User> & {
    favoriteLocations: number[];
    recentLocations: number[];
};
