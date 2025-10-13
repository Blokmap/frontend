import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import {
    blockProfile,
    deleteProfileAvatar,
    getProfileReservations,
    getProfileStats,
    listProfiles,
    unblockProfile,
    updateProfile,
    updateProfileAvatar,
    getProfileLocations,
    readProfile,
} from '@/domain/profile';
import type { Location } from '@/domain/location';
import type { Profile, ProfileStats, ProfileFilter, ProfileState } from '@/domain/profile';
import type { Reservation } from '@/domain/reservation';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
    Paginated,
} from '@/types';
import type { AxiosError } from 'axios';

/**
 * Composable to fetch statistics for a specific profile.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns The query object containing profile statistics and their state.
 */
export function useProfileStats(
    profileId: MaybeRefOrGetter<number | null>,
): CompQuery<ProfileStats> {
    const enabled = computed(() => toValue(profileId) !== null);
    const query = useQuery<ProfileStats, AxiosError>({
        queryKey: ['profile', 'stats', profileId],
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            return getProfileStats(profileIdValue);
        },
        enabled,
    });

    return query;
}

/**
 * Composable to fetch reservations for a specific profile within a given week.
 *
 * @param profileId - The ID of the profile to fetch reservations for.
 * @param inWeekOf - The date within the week for which to fetch reservations.
 * @returns The query object containing profile reservations and their state.
 */
export function useProfileReservations(
    profileId: MaybeRef<number | null>,
    inWeekOf: MaybeRefOrGetter<Date> = new Date(),
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        queryKey: ['profile', 'reservations', profileId, inWeekOf],
        enabled,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const dateInWeek = toValue(inWeekOf);
            return getProfileReservations(profileIdValue, dateInWeek, ['location', 'openingTime']);
        },
    });

    return query;
}

/**
 * Composable to fetch locations associated with a specific profile.
 *
 * @param profileId - The ID of the profile to fetch locations for.
 * @returns The query object containing profile locations and their state.
 */
export function useProfileLocations(profileId: MaybeRef<number | null>): CompQuery<Location[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Location[], AxiosError>({
        queryKey: ['profile', 'locations', profileId],
        enabled,
        queryFn: () => getProfileLocations(toValue(profileId)!),
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
export function useProfile(
    profileId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Profile | null> {
    const query = useQuery<Profile | null, AxiosError>({
        ...options,
        queryKey: ['profile', 'details', profileId],
        queryFn: () => readProfile(toValue(profileId)),
    });

    return query;
}

/**
 * Composable to fetch a list of profiles with filters.
 *
 * @param filters - The filters to apply when fetching profiles.
 * @param options - Additional options for the query.
 * @returns The query object containing the list of profiles and their state.
 */
export function useProfiles(
    filters: MaybeRefOrGetter<Partial<ProfileFilter>>,
    options: CompMutationOptions = {},
): CompQuery<Paginated<Profile>> {
    const query = useQuery<Paginated<Profile>, AxiosError>({
        ...options,
        queryKey: ['admin', 'profiles', filters],
        queryFn: () => listProfiles(toValue(filters)),
    });

    return query;
}

export type UpdateAvatarParams = {
    profileId: number;
    file: File;
};

/**
 * Composable to handle updating a profile's avatar image.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a profile avatar.
 */
export function useUpdateAvatar(
    options: CompMutationOptions = {},
): CompMutation<UpdateAvatarParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: async ({ profileId, file }: UpdateAvatarParams) => {
            await updateProfileAvatar(profileId, file);
        },
    });

    return mutation;
}

export type UpdateProfileParams = {
    profileId: number;
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
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: async ({ profileId, profileData }: UpdateProfileParams) => {
            const profile = await updateProfile(profileId, profileData);
            client.invalidateQueries({ queryKey: ['profile', 'details'] });
            return profile;
        },
    });

    return mutation;
}

/**
 * Composable to handle deleting a profile's avatar.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting a profile avatar.
 */
export function useDeleteAvatar(options: CompMutationOptions = {}): CompMutation<number> {
    const mutation = useMutation({
        ...options,
        mutationFn: deleteProfileAvatar,
    });

    return mutation;
}

type ProfileStateParams = {
    profileId: number;
    state: ProfileState;
};

/**
 * Composable to handle changing a profile's state (active or disabled).
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a profile's state.
 */
export function useProfileState(
    options: CompMutationOptions = {},
): CompMutation<ProfileStateParams, Profile> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ profileId, state }: ProfileStateParams) => {
            if (state === 'disabled') {
                return blockProfile(profileId);
            } else if (state === 'active') {
                return unblockProfile(profileId);
            }

            throw new Error(`Invalid state: ${state}`);
        },
    });

    return mutation;
}
