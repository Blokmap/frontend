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

export function useProfileLocations(profileId: MaybeRef<number | null>): CompQuery<Location[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Location[], AxiosError>({
        queryKey: ['profile', 'locations', profileId],
        enabled,
        queryFn: () => getProfileLocations(toValue(profileId)!),
    });

    return query;
}

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
