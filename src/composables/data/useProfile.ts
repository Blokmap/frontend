import type { ProfileStats } from '@/domain/profile';
import type { Reservation } from '@/domain/reservation';
import {
    deleteProfileAvatar,
    getProfileReservations,
    getProfileStats,
    updateProfileAvatar,
} from '@/services/profile';
import type { CompMutation, CompMutationOptions, CompQuery } from '@/types/Composable';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';

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

export function useDeleteAvatar(options: CompMutationOptions = {}): CompMutation<number> {
    const mutation = useMutation({
        ...options,
        mutationFn: deleteProfileAvatar,
    });

    return mutation;
}
