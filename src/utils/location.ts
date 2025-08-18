import placeholderDark from '@/assets/img/placeholder/location-placeholder-dark.svg';
import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import type { Location } from '@/types/schema/Location';

/**
 * Returns a placeholder image URL for locations based on the current theme.
 *
 * @param location - The location object (not used in this function, but included for consistency).
 * @param isDark - Whether dark mode is active.
 * @returns A placeholder image URL appropriate for the current theme.
 */
export function getLocationPlaceholderImage(location: Location, isDark = false): string {
    return isDark ? placeholderDark : placeholder;
}

/**
 * Returns the full address of a location as a formatted string.
 *
 * @param location - The location object containing address details.
 * @returns A string representing the full address of the location.
 */
export function getLocationAddress(location: Location): string {
    return `${location?.street || ''} ${location?.number || ''}, ${location?.zip || ''} ${location?.city || ''}`;
}
