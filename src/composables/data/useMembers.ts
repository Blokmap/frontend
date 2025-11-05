import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import {
    addAuthorityMember,
    addInstitutionMember,
    deleteLocationMember,
    readAuthorityMembers,
    readInstitutionMembers,
    readLocationMembers,
    removeAuthorityMember,
    removeInstitutionMember,
    updateLocationMember,
    type Membership,
    type MembershipBody,
} from '@/domain/member';
import { useToast } from '../store/useToast';
import { invalidateQueries } from './queryCache';
import { queryKeys } from './queryKeys';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export type AddMemberParams = {
    id: number;
    memberId: string;
};

export type UpdateMemberParams = {
    id: number;
    memberId: string;
    body: MembershipBody;
};

export type DeleteMemberParams = {
    id: number;
    memberId: string;
};

/**
 * Composable to fetch members for a specific location.
 */
export function useReadLocationMembers(
    locationId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Membership>> {
    const query = useQuery<Paginated<Membership>, AxiosError>({
        ...options,
        queryKey: queryKeys.members.byLocation(toValue(locationId)),
        queryFn: () => readLocationMembers(toValue(locationId)),
    });

    return query;
}

/**
 * Composable to fetch members for a specific authority.
 */
export function useReadAuthorityMembers(
    authorityId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Membership>> {
    const query = useQuery<Paginated<Membership>, AxiosError>({
        ...options,
        queryKey: queryKeys.members.byAuthority(toValue(authorityId)),
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
): CompQuery<Paginated<Membership>> {
    const query = useQuery<Paginated<Membership>, AxiosError>({
        ...options,
        queryKey: queryKeys.members.byInstitution(toValue(institutionId)),
        queryFn: () => readInstitutionMembers(toValue(institutionId)),
    });

    return query;
}

/**
 * Composable to add a member to an authority.
 */
export function useAddMemberToAuthority(
    options: CompMutationOptions = {},
): CompMutation<AddMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => addAuthorityMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the authority
            invalidateQueries(queryClient, queryKeys.members.byAuthority(variables.id));

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Member added successfully.',
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
export function useDeleteMemberFromAuthority(
    options: CompMutationOptions = {},
): CompMutation<DeleteMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => removeAuthorityMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries in the authority
            invalidateQueries(queryClient, queryKeys.members.byAuthority(variables.id));

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Member removed successfully.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

/**
 * Composable to add a member to an institution.
 */
export function useAddMemberToInstitution(
    options: CompMutationOptions = {},
): CompMutation<AddMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, memberId }) => addInstitutionMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the institution
            invalidateQueries(queryClient, queryKeys.members.byInstitution(variables.id));

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
            invalidateQueries(queryClient, queryKeys.members.byInstitution(variables.id));

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
            invalidateQueries(queryClient, queryKeys.members.byLocation(variables.id));

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Member role updated successfully.',
                });
            }

            options.onSuccess?.(data, variables, context);
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
        mutationFn: ({ id, memberId }) => deleteLocationMember(id, memberId),
        onSuccess: (data, variables, context) => {
            // Invalidate all member queries on the location
            invalidateQueries(queryClient, queryKeys.members.byLocation(variables.id));

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Member deleted successfully.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}
