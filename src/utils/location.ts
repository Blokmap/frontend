import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import type { Location } from '@/types/schema/Location';

/**
 * Returns a random placeholder image URL for locations.
 *
 * @param location - The location object (not used in this function, but included for consistency).
 * @returns A random placeholder image URL.
 */
export function getLocationPlaceholderImage(location: Location): string {
    return placeholder;
}
