import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { Institution } from '@/types/schema/Institution';
import { useQuery } from '@tanstack/vue-query';

export function useInstitutions(): ReturnType<typeof useQuery<unknown, Error, Institution[]>> {
    const institutions = useQuery<unknown, Error, Institution[]>({
        queryKey: ['institutions'],
        queryFn: async () => {
            const response = await client.get<Institution[]>(endpoints.institutions.list);
            return response.data;
        },
    });

    return institutions;
}
