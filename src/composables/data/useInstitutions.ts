import { useQuery } from '@tanstack/vue-query';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Institution } from '@/domain/institution';
import type { CompQuery } from '@/domain/shared';
import type { AxiosError } from 'axios';

/**
 * Composable to fetch a list of institutions.
 *
 * @returns An object containing the institutions and their state.
 */
export function useInstitutions(): CompQuery<Institution[]> {
    const institutions = useQuery<Institution[], AxiosError>({
        queryKey: ['institutions'],
        queryFn: async () => {
            const response = await client.get<Institution[]>(endpoints.institutions.list);
            return response.data;
        },
    });

    return institutions;
}
