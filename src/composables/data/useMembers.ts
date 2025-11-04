import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'primevue';
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
import { invalidateQueries } from './queryCache';
import { queryKeys } from './queryKeys';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export type AddMemberParams = {
    id: number;
    profileId: string;
};

export type RemoveMemberParams = {
    id: number;
    profileId: string;
};

export type UpdateLocationMemberParams = {
    locationId: number;
    profileId: number;
    body: MembershipBody;
};

export type DeleteLocationMemberParams = {
    locationId: number;
    memberId: number;
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
        mutationFn: ({ id, profileId }) => addAuthorityMember(id, profileId),
        onSuccess: (data, variables, context) => {
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
export function useRemoveMemberFromAuthority(
    options: CompMutationOptions = {},
): CompMutation<RemoveMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }) => removeAuthorityMember(id, profileId),
        onSuccess: (data, variables, context) => {
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
        mutationFn: ({ id, profileId }) => addInstitutionMember(id, profileId),
        onSuccess: (data, variables, context) => {
            invalidateQueries(queryClient, queryKeys.members.byInstitution(variables.id));
            // Also invalidate the specific institution detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.detail(variables.id),
            });

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
 * Composable to remove a member from an institution.
 */
export function useRemoveMemberFromInstitution(
    options: CompMutationOptions = {},
): CompMutation<RemoveMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ id, profileId }) => removeInstitutionMember(id, profileId),
        onSuccess: (data, variables, context) => {
            invalidateQueries(queryClient, queryKeys.members.byInstitution(variables.id));
            // Also invalidate the specific institution detail
            queryClient.invalidateQueries({
                queryKey: queryKeys.institutions.detail(variables.id),
            });

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
 * Composable to update a location member.
 */
export function useUpdateLocationMember(
    options: CompMutationOptions = {},
): CompMutation<UpdateLocationMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, profileId, body }) =>
            updateLocationMember(locationId, profileId, body),
        onSuccess: (data, variables, context) => {
            invalidateQueries(queryClient, queryKeys.members.byLocation(variables.locationId));

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Member updated successfully.',
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
): CompMutation<DeleteLocationMemberParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, memberId }) => deleteLocationMember(locationId, memberId),
        onSuccess: (data, variables, context) => {
            invalidateQueries(queryClient, queryKeys.members.byLocation(variables.locationId));

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
