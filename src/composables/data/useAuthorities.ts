import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { listAuthorities, type Authority, type AuthorityFilter } from '@/domain/authority';
import type { CompQuery, CompQueryOptions, Paginated } from '@/domain/shared';

/**
 * Composable to fetch a list of authorities.
 *
 * @returns An object containing the authorities and their state.
 */
export function useAuthorities(
    filters: MaybeRefOrGetter<Partial<AuthorityFilter>>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Authority>> {
    const authorities = useQuery({
        ...options,
        queryKey: ['authorities', filters],
        queryFn: () => listAuthorities(toValue(filters)),
    });

    return authorities;
}
