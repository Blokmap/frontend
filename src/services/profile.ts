import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { ProfileStats } from '@/types/schema/Profile';

/**
 * Fetches the profile statistics for a given profile ID.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns A promise that resolves to the profile statistics.
 */
export async function getProfileStats(profileId: number): Promise<ProfileStats> {
    const url = endpoints.profiles.stats.replace('{id}', String(profileId));
    const response = await client.get<ProfileStats>(url);
    return response.data;
}
