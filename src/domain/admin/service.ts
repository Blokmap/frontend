import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { AdminCounts, AdminStats } from './types';

/**
 * Fetches admin counts/statistics for dashboard overview.
 *
 * @returns A promise that resolves to admin counts data.
 */
export async function getAdminCounts(): Promise<AdminCounts> {
    const response = await client.get<AdminCounts>(endpoints.admin.counts);
    return response.data;
}

/**
 * Fetches detailed admin statistics.
 *
 * @returns A promise that resolves to admin statistics data.
 */
export async function getAdminStats(): Promise<AdminStats> {
    const response = await client.get<AdminStats>(endpoints.admin.stats);
    return response.data;
}
