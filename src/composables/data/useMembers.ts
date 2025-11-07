import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, type MaybeRef, toValue } from 'vue';
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
    createLocationRole,
    updateLocationRole,
    deleteLocationRole,
    type CreateRoleBody,
    type UpdateRoleBody,
    readAuthorityRoles,
    readInstitutionRoles,
    readLocationRoles,
    type Role,
    createAuthorityRole,
    updateAuthorityRole,
    deleteAuthorityRole,
    createInstitutionRole,
    updateInstitutionRole,
    deleteInstitutionRole,
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
    profileId: MaybeRef<string | null>,
    options: CompQueryOptions = {},
): CompQuery<AuthorityMembership[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery({
        ...options,
        enabled,
        queryKey: ['memberships', 'list', 'byProfileAuthorities', profileId],
        queryFn: () => {
            const profileIdValue = toValue(profileId);
            return readProfileAuthorityMemberships(profileIdValue!);
        },
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

export type CreateRoleParams = {
    id: number;
    body: CreateRoleBody;
};

export type UpdateRoleParams = {
    id: number;
    roleId: number;
    body: UpdateRoleBody;
};

export type DeleteRoleParams = {
    id: number;
    roleId: number;
};

/**
 * Composable to create a new role for a location.
 */
export function useCreateLocationRole(
    options: CompMutationOptions = {},
): CompMutation<CreateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }) => createLocationRole(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the location
            invalidateQueries(queryClient, ['roles', 'list', 'byLocation', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol aangemaakt',
                    detail: 'De rol is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update a location role.
 */
export function useUpdateLocationRole(
    options: CompMutationOptions = {},
): CompMutation<UpdateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: (params: UpdateRoleParams) => {
            const { id, roleId, body } = params;
            return updateLocationRole(id, roleId, body);
        },
        onSuccess: (data, variables: UpdateRoleParams, context) => {
            const { id } = variables;
            // Invalidate role queries for the location
            invalidateQueries(queryClient, ['roles', 'list', 'byLocation', id]);
            // Also invalidate member queries as role information may have changed
            invalidateQueries(queryClient, ['members', 'list', 'byLocation', id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to delete a location role.
 */
export function useDeleteLocationRole(
    options: CompMutationOptions = {},
): CompMutation<DeleteRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, roleId }) => deleteLocationRole(id, roleId),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the location
            invalidateQueries(queryClient, ['roles', 'list', 'byLocation', variables.id]);
            // Also invalidate member queries as members may need to update their role info
            invalidateQueries(queryClient, ['members', 'list', 'byLocation', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol verwijderd',
                    detail: 'De rol is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to fetch roles for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadLocationRoles(
    locationId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: ['roles', 'list', 'byLocation', locationId],
        queryFn: () => readLocationRoles(toValue(locationId)),
    });

    return query;
}

/**
 * Composable to fetch roles for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadAuthorityRoles(
    authorityId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: ['roles', 'list', 'byAuthority', authorityId],
        queryFn: () => readAuthorityRoles(toValue(authorityId)),
    });

    return query;
}

/**
 * Composable to fetch roles for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadInstitutionRoles(
    institutionId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: ['roles', 'list', 'byInstitution', institutionId],
        queryFn: () => readInstitutionRoles(toValue(institutionId)),
    });

    return query;
}

/**
 * Composable to create a new role for an authority.
 */
export function useCreateAuthorityRole(
    options: CompMutationOptions = {},
): CompMutation<CreateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }) => createAuthorityRole(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the authority
            invalidateQueries(queryClient, ['roles', 'list', 'byAuthority', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol aangemaakt',
                    detail: 'De rol is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update an authority role.
 */
export function useUpdateAuthorityRole(
    options: CompMutationOptions = {},
): CompMutation<UpdateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: (params: UpdateRoleParams) => {
            const { id, roleId, body } = params;
            return updateAuthorityRole(id, roleId, body);
        },
        onSuccess: (data, variables: UpdateRoleParams, context) => {
            const { id } = variables;
            // Invalidate role queries for the authority
            invalidateQueries(queryClient, ['roles', 'list', 'byAuthority', id]);
            // Also invalidate member queries as role information may have changed
            invalidateQueries(queryClient, ['members', 'list', 'byAuthority', id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to delete an authority role.
 */
export function useDeleteAuthorityRole(
    options: CompMutationOptions = {},
): CompMutation<DeleteRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, roleId }) => deleteAuthorityRole(id, roleId),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the authority
            invalidateQueries(queryClient, ['roles', 'list', 'byAuthority', variables.id]);
            // Also invalidate member queries as members may need to update their role info
            invalidateQueries(queryClient, ['members', 'list', 'byAuthority', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol verwijderd',
                    detail: 'De rol is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to create a new role for an institution.
 */
export function useCreateInstitutionRole(
    options: CompMutationOptions = {},
): CompMutation<CreateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, body }) => createInstitutionRole(id, body),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the institution
            invalidateQueries(queryClient, ['roles', 'list', 'byInstitution', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol aangemaakt',
                    detail: 'De rol is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to update an institution role.
 */
export function useUpdateInstitutionRole(
    options: CompMutationOptions = {},
): CompMutation<UpdateRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: (params: UpdateRoleParams) => {
            const { id, roleId, body } = params;
            return updateInstitutionRole(id, roleId, body);
        },
        onSuccess: (data, variables: UpdateRoleParams, context) => {
            const { id } = variables;
            // Invalidate role queries for the institution
            invalidateQueries(queryClient, ['roles', 'list', 'byInstitution', id]);
            // Also invalidate member queries as role information may have changed
            invalidateQueries(queryClient, ['members', 'list', 'byInstitution', id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol bijgewerkt',
                    detail: 'De rol is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to delete an institution role.
 */
export function useDeleteInstitutionRole(
    options: CompMutationOptions = {},
): CompMutation<DeleteRoleParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, roleId }) => deleteInstitutionRole(id, roleId),
        onSuccess: (data, variables, context) => {
            // Invalidate role queries for the institution
            invalidateQueries(queryClient, ['roles', 'list', 'byInstitution', variables.id]);
            // Also invalidate member queries as members may need to update their role info
            invalidateQueries(queryClient, ['members', 'list', 'byInstitution', variables.id]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Rol verwijderd',
                    detail: 'De rol is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
