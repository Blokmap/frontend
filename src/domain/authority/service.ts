import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Authority, AuthorityFilter } from './types';
import type { Paginated } from '@/types';

/**
 * List authorities with optional filters.
 *
 * @param filters - The filters to apply when listing authorities.
 * @returns A promise that resolves to a list of authorities.
 */
export async function listAuthorities(
    filters: Partial<AuthorityFilter> = {},
): Promise<Paginated<Authority>> {
    const params = {
        ...filters,
    };

    const response = await client.get<Paginated<Authority>>(endpoints.authorities.list, {
        params,
    });

    return response.data;
}
