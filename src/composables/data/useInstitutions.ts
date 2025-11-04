import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import {
    addInstitutionAuthority,
    createInstitution,
    readInstitutions,
    readInstitution,
    removeInstitutionAuthority,
    updateInstitution,
    type Institution,
    type InstitutionFilter,
    type InstitutionBody,
} from '@/domain/institution';
import { queryKeys } from './queryKeys';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';

// Mutation parameter types
export type UpdateInstitutionParams = {
    id: number;
    data: InstitutionBody;
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
        queryKey: queryKeys.institutions.list(filters),
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
        queryKey: queryKeys.institutions.detail(id),
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
): CompMutation<InstitutionBody> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all institution lists
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.lists(),
            });

            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific institution
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.detail(variables.id),
            });
            // Invalidate all institution lists
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.lists(),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ id, data }: UpdateInstitutionParams) => updateInstitution(id, data),
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
                queryKey: queryKeys.institutions.authorities(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.authorities.all() });
            // Also invalidate the specific institution detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.detail(variables.id),
            });
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
                queryKey: queryKeys.institutions.authorities(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.authorities.all() });
            // Also invalidate the specific institution detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.detail(variables.id),
            });
            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
