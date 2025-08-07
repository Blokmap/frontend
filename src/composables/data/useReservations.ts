import { type ReservationIncludes, getProfileReservations } from '@/services/reservation';
import type { CompQuery } from '@/types/contract/Composable';
import type { Reservation } from '@/types/schema/Reservation';
import { useQuery } from '@tanstack/vue-query';
import { type MaybeRef, computed, toValue } from 'vue';

export function useProfileReservations(
    profileId: MaybeRef<number | null>,
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery({
        queryKey: ['profile', 'reservations', profileId],
        enabled,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const dateInWeek = new Date();
            const includes: ReservationIncludes[] = ['location', 'openingTime'];
            return getProfileReservations(profileIdValue, dateInWeek, includes);
        },
    });

    return query;
}
