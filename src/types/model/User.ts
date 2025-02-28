import type { Institution } from "@/types/model/Institution";

export type User = {
    firstName: string;
    lastName: string;
    institution: Institution;
    favoriteLocationIds?: number[];
    email?: string;
};

export type Guest = Partial<User> & {
    favoriteLocationIds: number[];
};