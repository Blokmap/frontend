import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { listAuthorities, type Authority, type AuthorityFilter } from '@/domain/authority';
import type { CompQuery, CompQueryOptions, Paginated } from '@/types';

export const AUTHORITY_QUERY_KEYS = {
    list: (filters: MaybeRefOrGetter<Partial<AuthorityFilter>>) =>
        ['authorities', filters] as const,
} as const;

/**
 * Composable to fetch a list of authorities.
 *
 * @returns An object containing the authorities and their state.
 */
export function useReadAuthorities(
    filters: MaybeRefOrGetter<Partial<AuthorityFilter>>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Authority>> {
    const authorities = useQuery({
        ...options,
        queryKey: AUTHORITY_QUERY_KEYS.list(filters),
        queryFn: () => listAuthorities(toValue(filters)),
    });

    return authorities;
}
