import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Institution, InstitutionFilter } from './types';

/**
 * List institutions with optional filters.
 *
 * @param filters - The filters to apply when listing institutions.
 * @returns A promise that resolves to a list of institutions.
 */
export async function listInstitutions(
    filters: Partial<InstitutionFilter> = {},
): Promise<Institution[]> {
    const params = {
        ...filters,
    };

    const response = await client.get<Institution[]>(endpoints.institutions.list, {
        params,
    });

    return response.data;
}
