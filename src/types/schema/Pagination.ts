import { z } from 'zod/v4';

export const Paginated = <T extends z.ZodTypeAny>(itemSchema: T) => {
    return z.object({
        page: z.number(),
        perPage: z.number(),
        total: z.number(),
        data: z.array(itemSchema),
    });
};

export type Paginated = z.infer<ReturnType<typeof Paginated>>;
