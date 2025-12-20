import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter, type MaybeRef, computed } from 'vue';
import {
    createAuthority,
    readAuthorities,
    readAuthority,
    updateAuthority,
    updateAuthorityLogo,
    deleteAuthorityLogo,
    type Authority,
    type AuthorityFilter,
    type AuthorityBody,
    readProfileAuthorities,
    readInstitutionAuthorities,
    type AuthorityIncludes,
    deleteAuthority,
} from '@/domain/authority';
import { useToast } from '../store/useToast';
import { invalidateQueries } from './queryCache';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export type UpdateAuthorityParams = {
    id: number;
    data: AuthorityBody;
};

export type UpdateAuthorityLogoParams = {
    authorityId: number;
    file: File;
};

/**
 * Composable to fetch a list of authorities.
 *
 * @returns An object containing the authorities and their state.
 */
export function useReadAuthorities(
    filters: MaybeRefOrGetter<Partial<AuthorityFilter>>,
    options: CompQueryOptions<AuthorityIncludes> = {},
): CompQuery<Paginated<Authority>> {
    const authorities = useQuery<Paginated<Authority>, AxiosError>({
        ...options,
        queryKey: ['authorities', 'list'],
        queryFn: () => {
            return readAuthorities({
                authorityFilter: toValue(filters),
                authorityIncludes: toValue(options.includes),
            });
        },
    });

    return authorities;
}

/**
 * Composable to fetch authorities associated with a specific institution.
 *
 * @param institutionId - The ID of the institution to fetch authorities for.
 * @param options - Query options.
 * @returns The query object containing institution authorities and their state.
 */
export function useReadInstitutionAuthorities(
    institutionId: MaybeRef<number | null>,
    filters: MaybeRefOrGetter<Partial<AuthorityFilter>> = {},
    options: CompQueryOptions = {},
): CompQuery<Paginated<Authority>> {
    const enabled = computed(() => {
        const enabled = !options.enabled || toValue(options.enabled);
        return enabled && toValue(institutionId) !== null;
    });

    const query = useQuery<Paginated<Authority>, AxiosError>({
        ...options,
        enabled,
        queryKey: ['authorities', 'list', 'byInstitution', institutionId, filters],
        queryFn: () => {
            const institutionIdValue = toValue(institutionId)!;
            const filtersValue = toValue(filters);

            return readInstitutionAuthorities(institutionIdValue, filtersValue);
        },
    });

    return query;
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
    options: CompQueryOptions<AuthorityIncludes> = {},
): CompQuery<Authority> {
    const authority = useQuery<Authority, AxiosError>({
        ...options,
        queryKey: ['authorities', 'read', id],
        queryFn: () => {
            const idValue = toValue(id);
            return readAuthority(idValue, options.includes);
        },
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
        queryKey: ['authorities', 'list', 'byProfile', profileId],
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
            invalidateQueries(queryClient, ['authorities', 'list']);

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
            invalidateQueries(queryClient, ['authorities'], authorityId);

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

export function useDeleteAuthority(options: CompMutationOptions = {}): CompMutation<number> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: deleteAuthority,
        onSuccess: (data, variables, context) => {
            // Invalidate all authority queries
            const authorityId = variables;
            invalidateQueries(queryClient, ['authorities'], authorityId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Authority deleted successfully.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to handle updating an authority's logo image.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating an authority logo.
 */
export function useUpdateAuthorityLogo(
    options: CompMutationOptions = {},
): CompMutation<UpdateAuthorityLogoParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific authority query
            invalidateQueries(queryClient, ['authorities'], variables.authorityId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Logo bijgewerkt',
                    detail: 'Het logo van de autoriteit is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ authorityId, file }: UpdateAuthorityLogoParams) => {
            await updateAuthorityLogo(authorityId, file);
        },
    });

    return mutation;
}

/**
 * Composable to handle deleting an authority's logo.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting an authority logo.
 */
export function useDeleteAuthorityLogo(options: CompMutationOptions = {}): CompMutation<number> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific authority query
            invalidateQueries(queryClient, ['authorities'], variables);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Logo verwijderd',
                    detail: 'Het logo van de autoriteit is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: deleteAuthorityLogo,
    });

    return mutation;
}
