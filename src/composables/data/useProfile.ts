import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import {
    blockProfile,
    deleteProfileAvatar,
    readProfileReservations,
    readProfileStats,
    listProfiles,
    unblockProfile,
    updateProfile,
    updateProfileAvatar,
    readProfileLocations,
    readProfile,
} from '@/domain/profile';
import type { Location } from '@/domain/location';
import type { Profile, ProfileStats, ProfileFilter, ProfileState } from '@/domain/profile';
import type { Reservation, ReservationFilter } from '@/domain/reservation';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export const PROFILE_QUERY_KEYS = {
    read: (profileId: MaybeRef<number>) => ['profile', 'details', profileId] as const,
    list: (filters: MaybeRefOrGetter<Partial<ProfileFilter>>) =>
        ['admin', 'profiles', filters] as const,
    stats: (profileId: MaybeRefOrGetter<number | null>) => ['profile', 'stats', profileId] as const,
    reservations: (
        profileId: MaybeRef<number | null>,
        filters: MaybeRefOrGetter<ReservationFilter>,
    ) => ['profile', 'reservations', profileId, filters] as const,
    locations: (profileId: MaybeRef<number | null>) => ['profile', 'locations', profileId] as const,
} as const;

/**
 * Composable to fetch statistics for a specific profile.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns The query object containing profile statistics and their state.
 */
export function useReadProfileStats(
    profileId: MaybeRefOrGetter<number | null>,
): CompQuery<ProfileStats> {
    const enabled = computed(() => toValue(profileId) !== null);
    const query = useQuery<ProfileStats, AxiosError>({
        queryKey: PROFILE_QUERY_KEYS.stats(profileId),
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            return readProfileStats(profileIdValue);
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
export function useReadProfileReservations(
    profileId: MaybeRef<number | null>,
    filters: MaybeRef<ReservationFilter>,
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        queryKey: PROFILE_QUERY_KEYS.reservations(profileId, filters),
        enabled,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const filtersValue = toValue(filters);

            return readProfileReservations(profileIdValue, filtersValue, [
                'location',
                'openingTime',
            ]);
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
export function useReadProfileLocations(profileId: MaybeRef<number | null>): CompQuery<Location[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Location[], AxiosError>({
        queryKey: PROFILE_QUERY_KEYS.locations(profileId),
        enabled,
        queryFn: () => readProfileLocations(toValue(profileId)!),
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
    profileId: MaybeRef<number>,
    options: CompQueryOptions = {},
): CompQuery<Profile | null> {
    const query = useQuery<Profile | null, AxiosError>({
        ...options,
        queryKey: PROFILE_QUERY_KEYS.read(profileId),
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
export function useReadProfiles(
    filters: MaybeRefOrGetter<Partial<ProfileFilter>>,
    options: CompMutationOptions = {},
): CompQuery<Paginated<Profile>> {
    const query = useQuery<Paginated<Profile>, AxiosError>({
        ...options,
        queryKey: PROFILE_QUERY_KEYS.list(filters),
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
export function useUpdateProfileAvatar(
    options: CompMutationOptions = {},
): CompMutation<UpdateAvatarParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific profile query
            queryClient.invalidateQueries({
                queryKey: PROFILE_QUERY_KEYS.read(variables.profileId),
            });
            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all profile detail queries
            queryClient.invalidateQueries({ queryKey: ['profile', 'details'] });
            // Invalidate the profile list
            queryClient.invalidateQueries({ queryKey: ['admin', 'profiles'] });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ profileId, profileData }: UpdateProfileParams) => {
            const profile = await updateProfile(profileId, profileData);
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
export function useDeleteProfileAvatar(options: CompMutationOptions = {}): CompMutation<number> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific profile query
            queryClient.invalidateQueries({
                queryKey: PROFILE_QUERY_KEYS.read(variables),
            });
            options.onSuccess?.(data, variables, context);
        },
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
export function useUpdateProfileState(
    options: CompMutationOptions = {},
): CompMutation<ProfileStateParams, Profile> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific profile query
            queryClient.invalidateQueries({
                queryKey: PROFILE_QUERY_KEYS.read(variables.profileId),
            });
            // Invalidate the profile list
            queryClient.invalidateQueries({
                queryKey: ['admin', 'profiles'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
