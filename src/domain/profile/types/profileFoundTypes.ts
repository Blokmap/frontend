import type { Image } from '@/domain/image';

/**
 * Simplified profile type returned from the find endpoint
 * for searching profiles by query string.
 */
export type FoundProfile = {
    id: string;
    username: string;
    avatarUrl: Image | null;
    firstName: string | null;
    lastName: string | null;
};
