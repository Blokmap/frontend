import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import {
    addInstitutionAuthority,
    addInstitutionMember,
    createInstitution,
    listInstitutions,
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
    detail: (slug: MaybeRefOrGetter<string>) => ['institutions', 'detail', slug] as const,
    members: (slug: MaybeRefOrGetter<string>) => ['institutions', 'members', slug] as const,
    authorities: (slug: MaybeRefOrGetter<string>) => ['institutions', 'authorities', slug] as const,
} as const;

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
        queryFn: () => listInstitutions(toValue(filters)),
    });

    return institutions;
}

/**
 * Composable to fetch a single institution by slug.
 *
 * @param slug - The slug of the institution to fetch.
 * @param options - Query options.
 * @returns An object containing the institution and its state.
 */
export function useReadInstitution(
    slug: MaybeRefOrGetter<string>,
    options: CompQueryOptions = {},
): CompQuery<Institution> {
    const institution = useQuery({
        ...options,
        queryKey: INSTITUTION_QUERY_KEYS.detail(slug),
        queryFn: () => readInstitution(toValue(slug)),
    });

    return institution;
}

/**
 * Composable to create a new institution.
 */
export function useCreateInstitution(
    options: CompMutationOptions = {},
): CompMutation<InstitutionRequest> {
    const mutation = useMutation({
        mutationFn: createInstitution,
        ...options,
    });

    return mutation;
}

export type UpdateInstitutionParams = {
    id: number;
    data: InstitutionRequest;
};

/**
 * Composable to update an institution.
 *
 * @param options - Mutation options.
 */
export function useUpdateInstitution(
    options: CompMutationOptions = {},
): CompMutation<UpdateInstitutionParams> {
    const mutation = useMutation({
        mutationFn: ({ id, data }: UpdateInstitutionParams) => updateInstitution(id, data),
        ...options,
    });

    return mutation;
}

/**
 * Composable to add a member to an institution.
 */
export function useAddInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<{ slug: string; profileId: string }> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ slug, profileId }: { slug: string; profileId: string }) =>
            addInstitutionMember(slug, profileId),
        onSuccess: (data, variables, context) => {
            // Invalidate members list and profiles list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.members(variables.slug),
            });
            queryClient.invalidateQueries({ queryKey: ['admin', 'profiles'] });
            options.onSuccess?.(data, variables, context);
        },
        ...options,
    });

    return mutation;
}

/**
 * Composable to remove a member from an institution.
 */
export function useRemoveInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<{ slug: string; profileId: string }> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ slug, profileId }: { slug: string; profileId: string }) =>
            removeInstitutionMember(slug, profileId),
        onSuccess: (data, variables, context) => {
            // Invalidate members list and profiles list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.members(variables.slug),
            });
            queryClient.invalidateQueries({ queryKey: ['admin', 'profiles'] });
            options.onSuccess?.(data, variables, context);
        },
        ...options,
    });

    return mutation;
}

/**
 * Composable to add an authority to an institution.
 */
export function useAddInstitutionAuthority(
    options: CompMutationOptions = {},
): CompMutation<{ slug: string; authorityId: number }> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ slug, authorityId }: { slug: string; authorityId: number }) =>
            addInstitutionAuthority(slug, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate authorities list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.authorities(variables.slug),
            });
            queryClient.invalidateQueries({ queryKey: ['authorities'] });
            options.onSuccess?.(data, variables, context);
        },
        ...options,
    });

    return mutation;
}

/**
 * Composable to remove an authority from an institution.
 */
export function useRemoveInstitutionAuthority(
    options: CompMutationOptions = {},
): CompMutation<{ slug: string; authorityId: number }> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ slug, authorityId }: { slug: string; authorityId: number }) =>
            removeInstitutionAuthority(slug, authorityId),
        onSuccess: (data, variables, context) => {
            // Invalidate authorities list
            queryClient.invalidateQueries({
                queryKey: INSTITUTION_QUERY_KEYS.authorities(variables.slug),
            });
            queryClient.invalidateQueries({ queryKey: ['authorities'] });
            options.onSuccess?.(data, variables, context);
        },
        ...options,
    });

    return mutation;
}
