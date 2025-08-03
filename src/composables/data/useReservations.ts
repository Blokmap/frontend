import { getProfileReservations } from '@/services/reservation';
import type { CompQuery } from '@/types/contract/Composable';
import type { Reservation } from '@/types/schema/Reservation';
import { type Query, type QueryOptions, type UseQueryOptions, useQuery } from '@tanstack/vue-query';
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
            return getProfileReservations(profileIdValue);
        },
    });

    return query;
}
