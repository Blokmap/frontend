import { getProfileReservations, getProfileStats } from '@/services/profile';
import type { ReservationIncludes } from '@/services/reservation';
import type { CompQuery } from '@/types/contract/Composable';
import type { ProfileStats } from '@/types/schema/Profile';
import type { Reservation } from '@/types/schema/Reservation';
import { useQuery } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';

export function useProfileStats(
    profileId: MaybeRefOrGetter<number | null>,
): CompQuery<ProfileStats> {
    const enabled = computed(() => toValue(profileId) !== null);
    const query = useQuery<ProfileStats>({
        queryKey: ['profile', 'stats', profileId],
        queryFn: () => getProfileStats(toValue(profileId)!),
        enabled,
    });

    return query;
}

export function useProfileReservations(
    profileId: MaybeRef<number | null>,
    inWeekOf: MaybeRefOrGetter<Date> = new Date(),
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery({
        queryKey: ['profile', 'reservations', profileId, inWeekOf],
        enabled,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const dateInWeek = toValue(inWeekOf);
            const includes: ReservationIncludes[] = ['location', 'openingTime'];
            return getProfileReservations(profileIdValue, dateInWeek, includes);
        },
    });

    return query;
}
