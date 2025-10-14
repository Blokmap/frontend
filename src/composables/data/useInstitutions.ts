import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { listInstitutions, type Institution, type InstitutionFilter } from '@/domain/institution';
import type { CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';

export const INSTITUTION_QUERY_KEYS = {
    list: (filters: MaybeRefOrGetter<Partial<InstitutionFilter>>) =>
        ['institutions', filters] as const,
} as const;

/**
 * Composable to fetch a list of institutions.
 *
 * @returns An object containing the institutions and their state.
 */
export function useReadInstitutions(
    filters: MaybeRefOrGetter<Partial<InstitutionFilter>>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Institution>> {
    const institutions = useQuery({
        ...options,
        queryKey: INSTITUTION_QUERY_KEYS.list(filters),
        queryFn: () => listInstitutions(toValue(filters)),
    });

    return institutions;
}
