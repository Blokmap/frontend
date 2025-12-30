import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { useToast } from '@/composables/store/useToast';
import {
    createInstitution,
    readInstitutions,
    readInstitution,
    updateInstitution,
    updateInstitutionLogo,
    deleteInstitutionLogo,
    type Institution,
    type InstitutionFilter,
    type InstitutionRequest,
} from '@/domain/institution';
import { invalidateQueries } from './queryCache';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

// Mutation parameter types
export type UpdateInstitutionParams = {
    id: number;
    data: InstitutionRequest;
};

export type UpdateInstitutionLogoParams = {
    institutionId: number;
    file: File;
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
    filters: MaybeRefOrGetter<InstitutionFilter> = {},
    options: CompQueryOptions = {},
): CompQuery<Paginated<Institution>> {
    const institutions = useQuery<Paginated<Institution>, AxiosError>({
        ...options,
        queryKey: ['institutions', 'list', filters],
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
    const institution = useQuery<Institution, AxiosError>({
        ...options,
        queryKey: ['institutions', 'read', id],
        queryFn: () => {
            const idValue = toValue(id);
            return readInstitution(idValue);
        },
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
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all institution lists
            invalidateQueries(queryClient, ['institutions', 'list']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Institutie aangemaakt',
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
            invalidateQueries(queryClient, ['institutions'], variables.id);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Institutie bijgewerkt',
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
 * Composable to handle updating an institution's logo image.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating an institution logo.
 */
export function useUpdateInstitutionLogo(
    options: CompMutationOptions = {},
): CompMutation<UpdateInstitutionLogoParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific institution query
            invalidateQueries(queryClient, ['institutions'], variables.institutionId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Logo bijgewerkt',
                    detail: 'Het logo van de instelling is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ institutionId, file }: UpdateInstitutionLogoParams) => {
            await updateInstitutionLogo(institutionId, file);
        },
    });

    return mutation;
}

/**
 * Composable to handle deleting an institution's logo.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting an institution logo.
 */
export function useDeleteInstitutionLogo(options: CompMutationOptions = {}): CompMutation<number> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific institution query
            invalidateQueries(queryClient, ['institutions'], variables);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Logo verwijderd',
                    detail: 'Het logo van de instelling is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: deleteInstitutionLogo,
    });

    return mutation;
}
