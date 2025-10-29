import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { AdminCounts, AdminStats } from './types';

/**
 * Fetches admin counts/statistics for dashboard overview.
 *
 * @returns A promise that resolves to admin counts data.
 */
export async function readAdminCounts(): Promise<AdminCounts> {
    const endpoint = endpoints.admin.counts;

    const { data } = await client.get<AdminCounts>(endpoint);

    return data;
}

/**
 * Fetches detailed admin statistics.
 *
 * @returns A promise that resolves to admin statistics data.
 */
export async function readAdminStats(): Promise<AdminStats> {
    const endpoint = endpoints.admin.stats;

    const { data } = await client.get<AdminStats>(endpoint);

    return data;
}
