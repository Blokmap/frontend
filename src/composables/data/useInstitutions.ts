import { endpoints } from '@/endpoints';
import type { CompQuery } from '@/types/interfaces/Composable';
import type { Institution } from '@/types/schema/Institution';
import { client } from '@/utils/axios';
import { useQuery } from '@tanstack/vue-query';

/**
 * Composable to fetch a list of institutions.
 *
 * @returns An object containing the institutions and their state.
 */
export function useInstitutions(): CompQuery<Institution[]> {
    const institutions = useQuery<unknown, Error, Institution[]>({
        queryKey: ['institutions'],
        queryFn: async () => {
            const response = await client.get<Institution[]>(endpoints.institutions.list);
            return response.data;
        },
    });

    return institutions;
}
