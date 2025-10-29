import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import {
    addInstitutionAuthority,
    addInstitutionMember,
    createInstitution,
    readInstitutions,
    readInstitution,
    removeInstitutionAuthority,
    removeInstitutionMember,
    updateInstitution,
    type Institution,
    type InstitutionFilter,
    type InstitutionRequest,
} from '@/domain/institution';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';

export const INSTITUTION_QUERY_KEYS = {
    list: (filters: MaybeRefOrGetter<Partial<InstitutionFilter>>) =>
        ['institutions', filters] as const,
    detail: (id: MaybeRefOrGetter<string>) => ['institutions', 'detail', id] as const,
    members: (id: MaybeRefOrGetter<number>) => ['institutions', 'members', id] as const,
    authorities: (id: MaybeRefOrGetter<number>) => ['institutions', 'authorities', id] as const,
} as const;

// Mutation parameter types
export type UpdateInstitutionParams = {
    id: number;
    data: InstitutionRequest;
};

export type AddInstitutionMemberParams = {
    id: number;
    profileId: string;
};

export type RemoveInstitutionMemberParams = {
    id: number;
    profileId: string;
};

export type AddInstitutionAuthorityParams = {
    id: number;
    authorityId: number;
};

export type RemoveInstitutionAuthorityParams = {
    id: number;
    authorityId: number;
};

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
        queryFn: () => readInstitutions(toValue(filters)),
    });

    return institutions;
}

/**
 * Composable to fetch a single institution by id.
 *
 * @param id - The id of the institution to fetch.
 * @param options - Query options.
 * @returns An object containing the institution and its state.
 */
export function useReadInstitution(
    id: MaybeRefOrGetter<string>,
    options: CompQueryOptions = {},
): CompQuery<Institution> {
    const institution = useQuery({
        ...options,
        queryKey: INSTITUTION_QUERY_KEYS.detail(id),
        queryFn: () => readInstitution(toValue(id)),
    });

    return institution;
}

/**
 * Composable to create a new institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for creating an institution.
 */
export function useCreateInstitution(
    options: CompMutationOptions = {},
): CompMutation<InstitutionRequest> {
    const mutation = useMutation({
        ...options,
        mutationFn: createInstitution,
    });

    return mutation;
}

/**
 * Composable to update an institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for updating an institution.
 */
export function useUpdateInstitution(
    options: CompMutationOptions = {},
): CompMutation<UpdateInstitutionParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, data }: UpdateInstitutionParams) => updateInstitution(id, data),
    });

    return mutation;
}

/**
 * Composable to add a member to an institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for adding a member.
 */
export function useAddInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<AddInstitutionMemberParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }: AddInstitutionMemberParams) =>
            addInstitutionMember(id, profileId),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.members(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to remove a member from an institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for removing a member.
 */
export function useRemoveInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<RemoveInstitutionMemberParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }: RemoveInstitutionMemberParams) =>
            removeInstitutionMember(id, profileId),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.members(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to add an authority to an institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for adding an authority.
 */
export function useAddInstitutionAuthority(
    options: CompMutationOptions = {},
): CompMutation<AddInstitutionAuthorityParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, authorityId }: AddInstitutionAuthorityParams) =>
            addInstitutionAuthority(id, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate authorities list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.authorities(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: ['authorities'] });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to remove an authority from an institution.
 *
 * @param options - Mutation options.
 * @returns The mutation object for removing an authority.
 */
export function useRemoveInstitutionAuthority(
    options: CompMutationOptions = {},
): CompMutation<RemoveInstitutionAuthorityParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, authorityId }: RemoveInstitutionAuthorityParams) =>
            removeInstitutionAuthority(id, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate authorities list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.authorities(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: ['authorities'] });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
