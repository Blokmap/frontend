import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/config/endpoints';
import type { LngLat } from './types';

/**
 * Convert an address string to coordinates using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<LngLat> {
    try {
        const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
            mapboxEndpoints.geocoding.forward,
            {
                params: {
                    q: address.trim(),
                    country: 'be',
                    limit: 1,
                },
            },
        );

        const [feature] = response.data.features;

        if (feature.geometry?.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            return [lng, lat];
        }

        throw new Error('No valid coordinates found for the given address.');
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}
