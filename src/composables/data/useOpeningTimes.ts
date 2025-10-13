import { useQuery } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import { getLocationOpeningTimes, type OpeningTime } from '@/domain/openings';
import type { CompQuery } from '@/types';
import type { AxiosError } from 'axios';

export const OPENING_TIME_QUERY_KEYS = {
    read: (locationId: MaybeRef<number | null>, dateInWeek: MaybeRefOrGetter<Date>) =>
        ['location', 'opening-times', locationId, dateInWeek] as const,
} as const;

/**
 * Composable to fetch opening times for a specific location within a given week.
 *
 * @param locationId - The ID of the location to fetch opening times for.
 * @param dateInWeek - The date within the week for which to fetch opening times.
 * @returns An object containing the opening times and their state.
 */
export function useReadOpeningTimes(
    locationId: MaybeRef<number | null>,
    dateInWeek: MaybeRefOrGetter<Date> = new Date(),
): CompQuery<OpeningTime[]> {
    const enabled = computed(() => toValue(locationId) !== null);

    const query = useQuery<OpeningTime[], AxiosError>({
        queryKey: OPENING_TIME_QUERY_KEYS.read(locationId, dateInWeek),
        enabled,
        queryFn: () => {
            const locationIdValue = toValue(locationId)!;
            const dateInWeekValue = toValue(dateInWeek);
            return getLocationOpeningTimes(locationIdValue, dateInWeekValue);
        },
    });

    return query;
}
