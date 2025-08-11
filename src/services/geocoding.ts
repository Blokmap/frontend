import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/endpoints';
import type { LngLat } from '@/types/contract/Map';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

/**
 * Convert an address string to coordinates using Mapbox Geocoding API
 */
export async function geocodeAddress(address: string): Promise<LngLat | null> {
    try {
        const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
            mapboxEndpoints.geocoding.forward,
            {
                params: {
                    q: address.trim(),
                    access_token: MAPBOX_ACCESS_TOKEN,
                    country: 'be',
                    limit: 1,
                },
            },
        );

        const feature = response.data.features[0];
        if (feature?.geometry?.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            return [lng, lat];
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
