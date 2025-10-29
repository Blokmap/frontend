import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter, type MaybeRef, computed } from 'vue';
import {
    addAuthorityMember,
    createAuthority,
    readAuthorities,
    readAuthority,
    removeAuthorityMember,
    updateAuthority,
    type Authority,
    type AuthorityFilter,
    type AuthorityRequest,
} from '@/domain/authority';
import { readProfileAuthorities } from '@/domain/profile';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export const AUTHORITY_QUERY_KEYS = {
    list: (filters: MaybeRefOrGetter<Partial<AuthorityFilter>>) =>
        ['authorities', filters] as const,
    detail: (id: MaybeRefOrGetter<number>) => ['authorities', 'detail', id] as const,
    members: (id: MaybeRefOrGetter<number>) => ['authorities', 'members', id] as const,
    profileAuthorities: (profileId: MaybeRef<string | null>) =>
        ['profile', 'authorities', profileId] as const,
} as const;

// Mutation parameter types
export type UpdateAuthorityParams = {
    id: number;
    data: AuthorityRequest;
};

export type AddAuthorityMemberParams = {
    id: number;
    profileId: string;
};

export type RemoveAuthorityMemberParams = {
    id: number;
    profileId: string;
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
        queryKey: AUTHORITY_QUERY_KEYS.list(filters),
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
        queryKey: AUTHORITY_QUERY_KEYS.detail(id),
        queryFn: () => readAuthority(toValue(id)),
    });

    return authority;
}

/**
 * Composable to create a new authority.
 *
 * @param options - Mutation options.
 * @returns The mutation object for creating an authority.
 */
export function useCreateAuthority(
    options: CompMutationOptions = {},
): CompMutation<AuthorityRequest> {
    const mutation = useMutation({
        ...options,
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

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, data }: UpdateAuthorityParams) => updateAuthority(id, data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: AUTHORITY_QUERY_KEYS.detail(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to add a member to an authority.
 *
 * @param options - Mutation options.
 * @returns The mutation object for adding a member.
 */
export function useAddAuthorityMember(
    options: CompMutationOptions = {},
): CompMutation<AddAuthorityMemberParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }: AddAuthorityMemberParams) =>
            addAuthorityMember(id, profileId),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: AUTHORITY_QUERY_KEYS.members(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to remove a member from an authority.
 *
 * @param options - Mutation options.
 * @returns The mutation object for removing a member.
 */
export function useRemoveAuthorityMember(
    options: CompMutationOptions = {},
): CompMutation<RemoveAuthorityMemberParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }: RemoveAuthorityMemberParams) =>
            removeAuthorityMember(id, profileId),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: AUTHORITY_QUERY_KEYS.members(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
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
        queryKey: AUTHORITY_QUERY_KEYS.profileAuthorities(profileId),
        enabled,
        queryFn: () => readProfileAuthorities(toValue(profileId)!),
    });

    return query;
}
