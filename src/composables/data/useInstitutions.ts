import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { listInstitutions, type Institution, type InstitutionFilter } from '@/domain/institution';
import type { CompQuery, CompQueryOptions, Paginated } from '@/types';

/**
 * Composable to fetch a list of institutions.
 *
 * @returns An object containing the institutions and their state.
 */
export function useInstitutions(
    filters: MaybeRefOrGetter<Partial<InstitutionFilter>>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Institution>> {
    const institutions = useQuery({
        ...options,
        queryKey: ['institutions', filters],
        queryFn: () => listInstitutions(toValue(filters)),
    });

    return institutions;
}
