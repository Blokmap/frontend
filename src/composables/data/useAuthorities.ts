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
    readProfileAuthorities,
    readInstitutionAuthorities,
    type AuthorityIncludes,
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
        queryKey: ['authorities', 'list'],
        queryFn: () => readAuthorities(toValue(filters)),
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
    institutionId: MaybeRef<number>,
    filters: MaybeRefOrGetter<Partial<AuthorityFilter>>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Authority>> {
    const query = useQuery<Paginated<Authority>, AxiosError>({
        ...options,
        queryKey: ['authorities', 'list', 'byInstitution', institutionId, filters],
        queryFn: () => readInstitutionAuthorities(toValue(institutionId), toValue(filters)),
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
    const authority = useQuery({
        ...options,
        queryKey: ['authorities', 'read', id],
        queryFn: () => readAuthority(toValue(id), options.includes),
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
