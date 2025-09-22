import { useQuery } from '@tanstack/vue-query';
import { getAdminCounts, getAdminStats } from '@/domain/admin';
import type { AdminCounts, AdminStats } from '@/domain/admin';
import type { CompQuery, CompQueryOptions } from '@/types/Composable';
import type { AxiosError } from 'axios';

export const ADMIN_QUERY_KEYS = {
    counts: () => ['admin', 'counts'] as const,
    stats: () => ['admin', 'stats'] as const,
} as const;

/**
 * Composable to fetch admin counts for dashboard overview.
 *
 * @param options - Optional query options for configuration.
 * @returns The query object containing admin counts data and its state.
 */
export function useAdminCounts(options: CompQueryOptions = {}): CompQuery<AdminCounts> {
    const query = useQuery<AdminCounts, AxiosError>({
        ...options,
        queryKey: ADMIN_QUERY_KEYS.counts(),
        queryFn: getAdminCounts,
        staleTime: 60 * 60 * 1000, // 60 minutes
    });

    return query;
}

/**
 * Composable to fetch detailed admin statistics.
 *
 * @param options - Optional query options for configuration.
 * @returns The query object containing admin stats data and its state.
 */
export function useAdminStats(options: CompQueryOptions = {}): CompQuery<AdminStats> {
    const query = useQuery<AdminStats, AxiosError>({
        ...options,
        queryKey: ADMIN_QUERY_KEYS.stats(),
        queryFn: getAdminStats,
    });

    return query;
}
