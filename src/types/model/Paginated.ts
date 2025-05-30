import { z } from 'zod/v4';

export type Paginated<T> = {
    page: number;
    perPage: number;
    total: number;
    data: T[];
};

export const Paginated = <T extends z.ZodTypeAny>(itemSchema: T) => {
    return z.object({
        page: z.number(),
        perPage: z.number(),
        total: z.number(),
        data: z.array(itemSchema),
    });
};