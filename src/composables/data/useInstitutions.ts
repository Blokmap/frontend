import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { listInstitutions, type Institution, type InstitutionFilter } from '@/domain/institution';
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
        queryFn: () => listInstitutions(),
    });

    return institutions;
}

/**
 * Composable to fetch a list of institutions with filters.
 *
 * @param filters - The filters to apply when listing institutions.
 * @returns An object containing the institutions and their state.
 */
export function useInstitutionsFiltered(
    filters: MaybeRefOrGetter<Partial<InstitutionFilter>>,
    options: any = {},
): CompQuery<Institution[]> {
    const query = useQuery<Institution[], AxiosError>({
        ...options,
        queryKey: ['institutions', filters],
        queryFn: () => listInstitutions(toValue(filters)),
    });

    return query;
}
