import { useQuery } from '@tanstack/vue-query';
import { readAdminCounts, readAdminStats } from '@/domain/admin';
import { queryKeys } from './queryKeys';

import type { AdminCounts, AdminStats } from '@/domain/admin';
import type { CompQuery, CompQueryOptions } from '@/types';
import type { AxiosError } from 'axios';

/**
 * Composable to fetch admin counts for dashboard overview.
 *
 * @param options - Optional query options for configuration.
 * @returns The query object containing admin counts data and its state.
 */
export function useAdminCounts(options: CompQueryOptions = {}): CompQuery<AdminCounts> {
    const query = useQuery<AdminCounts, AxiosError>({
        ...options,
        queryKey: queryKeys.admin.counts(),
        queryFn: readAdminCounts,
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
        queryKey: queryKeys.admin.stats(),
        queryFn: readAdminStats,
    });

    return query;
}
