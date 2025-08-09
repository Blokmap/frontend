import { getProfileStats } from '@/services/profile';
import type { CompQuery } from '@/types/contract/Composable';
import type { ProfileStats } from '@/types/schema/Profile';
import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, computed, toValue } from 'vue';

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
