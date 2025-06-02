import { z } from 'zod/v4';

export const Image = z.object({
    url: z.string(),
});

export type Image = z.infer<typeof Image>;
