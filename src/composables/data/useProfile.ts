import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'primevue';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    blockProfile,
    deleteProfileAvatar,
    readProfileStats,
    readProfiles,
    unblockProfile,
    updateProfile,
    updateProfileAvatar,
    readProfile,
    scanProfile,
    readInstitutionProfiles,
} from '@/domain/profile';
import {
    type Profile,
    type ProfileStats,
    type ProfileFilter,
    ProfileState,
    type ProfileScanBody,
} from '@/domain/profile';
import { invalidateQueries } from './queryCache';

import type { Reservation } from '@/domain/reservation';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

/**
 * Composable to fetch statistics for a specific profile.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns The query object containing profile statistics and their state.
 */
export function useReadProfileStats(
    profileId: MaybeRefOrGetter<string | null>,
): CompQuery<ProfileStats> {
    const enabled = computed(() => toValue(profileId) !== null);
    const query = useQuery<ProfileStats, AxiosError>({
        queryKey: ['profiles', 'read', profileId, 'stats'],
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            return readProfileStats(profileIdValue);
        },
        enabled,
    });

    return query;
}

/**
 * Composable to fetch a single profile by its ID.
 *
 * @param profileId - The ID of the profile to fetch.
 * @param options - Additional options for the query.
 * @returns The query object containing the profile data and its state.
 */
export function useReadProfile(
    profileId: MaybeRef<string>,
    options: CompQueryOptions = {},
): CompQuery<Profile | null> {
    const query = useQuery<Profile | null, AxiosError>({
        ...options,
        queryKey: ['profiles', 'read', profileId],
        queryFn: () => readProfile(toValue(profileId)),
    });

    return query;
}

/**
 * Composable to fetch a list of profiles with filters.
 *
 * @param pagination - The pagination settings to apply when fetching profiles.
 * @param filters - The filters to apply when fetching profiles.
 * @param options - Additional options for the query.
 * @returns The query object containing the list of profiles and their state.
 */
export function useReadProfiles(
    filters: MaybeRefOrGetter<ProfileFilter>,
    options: CompMutationOptions = {},
): CompQuery<Paginated<Profile>> {
    const query = useQuery<Paginated<Profile>, AxiosError>({
        ...options,
        queryKey: ['profiles', 'list', filters],
        queryFn: () => readProfiles(toValue(filters)),
    });

    return query;
}

export type UpdateAvatarParams = {
    profileId: string;
    file: File;
};

/**
 * Composable to handle updating a profile's avatar image.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a profile avatar.
 */
export function useUpdateProfileAvatar(
    options: CompMutationOptions = {},
): CompMutation<UpdateAvatarParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific profile query
            invalidateQueries(queryClient, ['profiles'], variables.profileId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Avatar bijgewerkt',
                    detail: 'De profielfoto is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ profileId, file }: UpdateAvatarParams) => {
            await updateProfileAvatar(profileId, file);
        },
    });

    return mutation;
}

export type UpdateProfileParams = {
    profileId: string;
    profileData: Partial<Profile>;
};

/**
 * Composable to handle updating profile data.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a profile.
 */
export function useUpdateProfile(
    options: CompMutationOptions = {},
): CompMutation<UpdateProfileParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all profile queries
            invalidateQueries(queryClient, ['profiles'], variables.profileId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Profiel bijgewerkt',
                    detail: 'Het profiel is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ profileId, profileData }: UpdateProfileParams) => {
            const profile = await updateProfile(profileId, profileData);
            return profile;
        },
    });

    return mutation;
}

export type ScanProfileParams = {
    profileId: string;
    request: ProfileScanBody;
};

/**
 * Composable to handle scanning a profile.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for scanning a profile.
 */
export function useScanProfile(
    options: CompMutationOptions = {},
): CompMutation<ScanProfileParams, Reservation[]> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ profileId, request }: ScanProfileParams) => scanProfile(profileId, request),
    });

    return mutation;
}

/**
 * Composable to handle deleting a profile's avatar.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting a profile avatar.
 */
export function useDeleteProfileAvatar(options: CompMutationOptions = {}): CompMutation<string> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific profile query
            invalidateQueries(queryClient, ['profiles'], variables);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Avatar verwijderd',
                    detail: 'De profielfoto is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: deleteProfileAvatar,
    });

    return mutation;
}

type ProfileStateParams = {
    profileId: string;
    state: ProfileState;
};

/**
 * Composable to handle changing a profile's state (active or disabled).
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a profile's state.
 */
export function useUpdateProfileState(
    options: CompMutationOptions = {},
): CompMutation<ProfileStateParams, Profile> {
    const queryClient = useQueryClient();
    const toast = useToast();
    const i18n = useI18n();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            invalidateQueries(queryClient, ['profiles'], variables.profileId);

            if (!options.disableToasts) {
                const statusLabel =
                    variables.state === ProfileState.Disabled ? 'geblokkeerd' : 'geactiveerd';

                toast.add({
                    severity: 'success',
                    summary: i18n.t('domains.profiles.success.statusUpdated'),
                    detail: i18n.t('domains.profiles.success.statusUpdatedDetail', [statusLabel]),
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ profileId, state }: ProfileStateParams) => {
            if (state === ProfileState.Disabled) {
                return blockProfile(profileId);
            } else if (state === ProfileState.Active) {
                return unblockProfile(profileId);
            }

            throw new Error(`Invalid state: ${state}`);
        },
    });

    return mutation;
}

export function useReadInstitutionProfiles(
    institutionId: MaybeRefOrGetter<number>,
    filters: MaybeRefOrGetter<ProfileFilter>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Profile>> {
    const query = useQuery<Paginated<Profile>, AxiosError>({
        ...options,
        queryKey: ['profiles', 'list', 'byInstitution', institutionId, filters],
        queryFn: () => readInstitutionProfiles(toValue(institutionId), toValue(filters)),
    });

    return query;
}
