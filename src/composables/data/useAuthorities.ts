import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter, type MaybeRef, computed } from 'vue';
import {
    createAuthority,
    readAuthorities,
    readAuthority,
    updateAuthority,
    type Authority,
    type AuthorityFilter,
    type AuthorityBody,
} from '@/domain/authority';
import { readProfileAuthorities } from '@/domain/profile';
import { useToast } from '../store/useToast';
import { invalidateQueries } from './queryCache';
import { queryKeys } from './queryKeys';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export type UpdateAuthorityParams = {
    id: number;
    data: AuthorityBody;
};

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
        queryKey: queryKeys.authorities.list(filters),
        queryFn: () => readAuthorities(toValue(filters)),
    });

    return authorities;
}

/**
 * Composable to fetch a single authority by ID.
 *
 * @param id - The ID of the authority to fetch.
 * @param options - Query options.
 * @returns An object containing the authority and its state.
 */
export function useReadAuthority(
    id: MaybeRefOrGetter<number>,
    options: CompQueryOptions = {},
): CompQuery<Authority> {
    const authority = useQuery({
        ...options,
        queryKey: queryKeys.authorities.detail(id),
        queryFn: () => readAuthority(toValue(id)),
    });

    return authority;
}

/**
 * Composable to fetch authorities associated with a specific profile.
 *
 * @param profileId - The ID of the profile to fetch authorities for.
 * @returns The query object containing profile authorities and their state.
 */
export function useReadProfileAuthorities(
    profileId: MaybeRef<string | null>,
): CompQuery<Authority[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Authority[], AxiosError>({
        enabled,
        queryKey: queryKeys.authorities.byProfile(profileId),
        queryFn: () => readProfileAuthorities(toValue(profileId)!),
    });

    return query;
}

/**
 * Composable to create a new authority.
 *
 * @param options - Mutation options.
 * @returns The mutation object for creating an authority.
 */
export function useCreateAuthority(options: CompMutationOptions = {}): CompMutation<AuthorityBody> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all authority queries
            invalidateQueries(queryClient, queryKeys.authorities.all());

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: createAuthority,
    });

    return mutation;
}

/**
 * Composable to update an authority.
 *
 * @param options - Mutation options.
 * @returns The mutation object for updating an authority.
 */
export function useUpdateAuthority(
    options: CompMutationOptions = {},
): CompMutation<UpdateAuthorityParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, data }: UpdateAuthorityParams) => updateAuthority(id, data),
        onSuccess: (data, variables, context) => {
            // Invalidate all authority queries
            const { id: authorityId } = variables;
            invalidateQueries(queryClient, queryKeys.authorities.all(), authorityId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Authority updated successfully.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
