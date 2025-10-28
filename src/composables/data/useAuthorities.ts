import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import {
    addAuthorityMember,
    createAuthority,
    listAuthorities,
    listAuthorityMembers,
    readAuthority,
    removeAuthorityMember,
    updateAuthority,
    type Authority,
    type AuthorityFilter,
    type AuthorityRequest,
} from '@/domain/authority';
import type { Profile } from '@/domain/profile';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';

export const AUTHORITY_QUERY_KEYS = {
    list: (filters: MaybeRefOrGetter<Partial<AuthorityFilter>>) =>
        ['authorities', filters] as const,
    detail: (id: MaybeRefOrGetter<number>) => ['authorities', 'detail', id] as const,
    members: (id: MaybeRefOrGetter<number>) => ['authorities', 'members', id] as const,
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
        queryFn: () => listAuthorities(toValue(filters)),
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
 * Composable to fetch members of an authority.
 *
 * @param id - The ID of the authority.
 * @param options - Query options.
 * @returns The query object containing the members and their state.
 */
export function useListAuthorityMembers(
    id: MaybeRefOrGetter<number>,
    options: CompQueryOptions = {},
): CompQuery<Profile[]> {
    const query = useQuery({
        ...options,
        queryKey: AUTHORITY_QUERY_KEYS.members(id),
        queryFn: () => listAuthorityMembers(toValue(id)),
    });

    return query;
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
