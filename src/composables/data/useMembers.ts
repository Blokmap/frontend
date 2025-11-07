import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import {
    addAuthorityMember,
    addInstitutionMember,
    removeLocationMember,
    readAuthorityMembers,
    readInstitutionMembers,
    readLocationMembers,
    removeAuthorityMember,
    removeInstitutionMember,
    updateAuthorityMember,
    updateInstitutionMember,
    updateLocationMember,
    type UpdateMemberBody,
    type Member,
    type LocationMembership,
    readProfileLocationMemberships,
    type AuthorityMembership,
    readProfileAuthorityMemberships,
    type InstitutionMembership,
    readProfileInstitutionMemberships,
    type CreateMemberBody,
    addLocationMember,
} from '@/domain/member';
import { useToast } from '../store/useToast';
import { invalidateQueries } from './queryCache';
import type { LocationFilter } from '@/domain/location';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export type UpdateMemberParams = {
    id: number;
    memberId: string;
    body: UpdateMemberBody;
};

export type DeleteMemberParams = {
    id: number;
    memberId: string;
};

/**
 * Composable to fetch members for a specific location.
 *
 */
export function useReadLocationMembers(
    locationId: MaybeRef<number>,
    filters: MaybeRef<LocationFilter> = {},
    options: CompQueryOptions = {},
): CompQuery<Paginated<Member>> {
    const query = useQuery({
        ...options,
        queryKey: ['members', 'list', 'byLocation', locationId, filters],
        queryFn: () => readLocationMembers(toValue(locationId), toValue(filters)),
    });

    return query;
}

/**
 * Composable to fetch members for a specific authority.
 */
export function useReadAuthorityMembers(
    authorityId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Member>> {
    const query = useQuery<Paginated<Member>, AxiosError>({
        ...options,
        queryKey: ['members', 'list', 'byAuthority', authorityId],
        queryFn: () => readAuthorityMembers(toValue(authorityId)),
    });

    return query;
}

/**
 * Composable to fetch members for a specific institution.
 */
export function useReadInstitutionMembers(
    institutionId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Member>> {
    const query = useQuery({
        ...options,
        queryKey: ['members', 'list', 'byInstitution', institutionId],
        queryFn: () => readInstitutionMembers(toValue(institutionId)),
    });

    return query;
}

export type AddMemberParams = {
    id: number;
    body: CreateMemberBody;
};

/**
 * Composable to add a member to an authority.
 */
export function useAddAuthorityMember(
    options: CompMutationOptions = {},
): CompMutation<AddMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }: AddMemberParams) => addAuthorityMember(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the authority
            invalidateQueries(queryClient, ['members', 'list', 'byAuthority', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid toegevoegd',
                    detail: 'Het lid is succesvol toegevoegd aan de autoriteit.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update a member's role in an authority.
 */
export function useUpdateAuthorityMember(
    options: CompMutationOptions = {},
): CompMutation<UpdateMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId, body }) => updateAuthorityMember(id, memberId, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the authority
            invalidateQueries(queryClient, ['members', 'list', 'byAuthority', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol van het lid is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to remove a member from an authority.
 */
export function useDeleteAuthorityMember(
    options: CompMutationOptions = {},
): CompMutation<DeleteMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => removeAuthorityMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries in the authority
            invalidateQueries(queryClient, ['members', 'list', 'byAuthority', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid verwijderd',
                    detail: 'Het lid is succesvol verwijderd van de autoriteit.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to add a member to an institution.
 *
 * @param {CompMutationOptions} options - Options for the mutation.
 * @returns {CompMutation<AddMemberParams>} The mutation object for adding an institution member.
 */
export function useAddInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<AddMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }: AddMemberParams) => addInstitutionMember(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the institution
            invalidateQueries(queryClient, ['members', 'list', 'byInstitution', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid toegevoegd',
                    detail: 'Het lid is succesvol toegevoegd aan de instelling.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update a member's role in an institution.
 */
export function useUpdateInstitutionMember(
    options: CompMutationOptions = {},
): CompMutation<UpdateMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId, body }) => updateInstitutionMember(id, memberId, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the institution
            invalidateQueries(queryClient, ['members', 'list', 'byInstitution', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol van het lid is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to remove a member from an institution.
 */
export function useDeleteMemberFromInstitution(
    options: CompMutationOptions = {},
): CompMutation<DeleteMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => removeInstitutionMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the institution
            invalidateQueries(queryClient, ['members', 'list', 'byInstitution', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid verwijderd',
                    detail: 'Het lid is succesvol verwijderd van de instelling.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update a location member.
 */
export function useUpdateLocationMember(
    options: CompMutationOptions = {},
): CompMutation<UpdateMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId, body }) => updateLocationMember(id, memberId, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the location
            invalidateQueries(queryClient, ['members', 'list', 'byLocation', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol van het lid is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to add a location member.
 *
 * @returns {CompMutation<AddMemberParams>} The mutation object for adding a location member.
 */
export function useAddLocationMember(
    options: CompMutationOptions = {},
): CompMutation<AddMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }: AddMemberParams) => addLocationMember(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the location
            invalidateQueries(queryClient, ['members', 'list', 'byLocation', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid toegevoegd',
                    detail: 'Het lid is succesvol toegevoegd aan de locatie.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            if (!options.disableToasts) {
                toast.add({
                    severity: 'error',
                    summary: 'Fout bij toevoegen lid',
                    detail: 'Er is een fout opgetreden bij het toevoegen van het lid aan de locatie.',
                });
            }

            options.onError?.(error, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to delete a location member.
 */
export function useDeleteLocationMember(
    options: CompMutationOptions = {},
): CompMutation<DeleteMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => removeLocationMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the location
            invalidateQueries(queryClient, ['members', 'list', 'byLocation', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Lid verwijderd',
                    detail: 'Het lid is succesvol verwijderd van de locatie.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to read a profile's location memberships.
 */
export function useReadProfileLocationMemberships(
    profileId: MaybeRef<string>,
    options: CompQueryOptions = {},
): CompQuery<LocationMembership[]> {
    const query = useQuery({
        ...options,
        queryKey: ['memberships', 'list', 'byProfileLocations', profileId],
        queryFn: () => readProfileLocationMemberships(toValue(profileId)),
    });

    return query;
}

/**
 *
 * Composable to read a profile's authority memberships.
 */
export function useReadProfileAuthorityMemberships(
    profileId: MaybeRef<string>,
    options: CompQueryOptions = {},
): CompQuery<AuthorityMembership[]> {
    const query = useQuery({
        ...options,
        queryKey: ['memberships', 'list', 'byProfileAuthorities', profileId],
        queryFn: () => readProfileAuthorityMemberships(toValue(profileId)),
    });

    return query;
}

/**
 * Composable to read a profile's institution memberships.
 */
export function useReadProfileInstitutionMemberships(
    profileId: MaybeRef<string>,
    options: CompQueryOptions = {},
): CompQuery<InstitutionMembership[]> {
    const query = useQuery({
        ...options,
        queryKey: ['memberships', 'list', 'byProfileInstitutions', profileId],
        queryFn: () => readProfileInstitutionMemberships(toValue(profileId)),
    });

    return query;
}
