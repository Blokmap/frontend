import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'primevue';
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
import { invalidateQueries } from './queryCache';
import { queryKeys } from './queryKeys';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
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
    id: MaybeRefOrGetter<number>,
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all institution lists
            invalidateQueries(queryClient, queryKeys.institutions.all());

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Instelling aangemaakt',
                    detail: 'De nieuwe instelling is succesvol aangemaakt.',
                });
            }

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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific institution and all lists containing it
            invalidateQueries(queryClient, queryKeys.institutions.all(), variables.id);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Instelling bijgewerkt',
                    detail: 'De instelling is succesvol bijgewerkt.',
                });
            }

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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, authorityId }: AddInstitutionAuthorityParams) =>
            addInstitutionAuthority(id, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate institution and authority queries
            invalidateQueries(queryClient, queryKeys.institutions.all(), variables.id);
            invalidateQueries(queryClient, queryKeys.authorities.all(), variables.authorityId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Overheid toegevoegd',
                    detail: 'De overheid is succesvol toegevoegd aan de instelling.',
                });
            }

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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, authorityId }: RemoveInstitutionAuthorityParams) =>
            removeInstitutionAuthority(id, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate institution and authority queries
            invalidateQueries(queryClient, queryKeys.institutions.all(), variables.id);
            invalidateQueries(queryClient, queryKeys.authorities.all(), variables.authorityId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Overheid verwijderd',
                    detail: 'De overheid is succesvol verwijderd van de instelling.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
