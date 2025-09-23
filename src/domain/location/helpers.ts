import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import { isEvening, isMorning, isNight, isWeekend } from '@/utils/date';
import { GOOGLE_MAPS_DIRECTIONS_BASE_URL } from './constants';
import type { Location, LocationAddress, LocationFeatures, LocationStatus } from './types';

/**
 * Returns a random placeholder image URL for locations.
 *
 * @param location - The location object (not used in this function, but included for consistency).
 * @returns A random placeholder image URL.
 */
export function getLocationPlaceholderImage(_location: Location): string {
    return placeholder;
}

/**
 * Returns the full address of a location as a formatted string.
 *
 * @param location - The location object containing address details.
 * @returns A string representing the full address of the location.
 */
export function formatLocationAddress(location: LocationAddress): string {
    return `${location?.street || ''} ${location?.number || ''}, ${location?.zip || ''} ${location?.city || ''}`;
}

/**
 * Gets the location features based on its opening times.
 *
 * @param location - The location to evaluate
 * @returns An object containing the location's features.
 */
export function getLocationFeatures(location: Location): LocationFeatures {
    const openAtNight = location.openingTimes?.some((time) => isWeekend(time.day)) || false;
    const openInEvening = location.openingTimes?.some((time) => isEvening(time.endTime)) || false;
    const openInMorning = location.openingTimes?.some((time) => isMorning(time.startTime)) || false;
    const openInWeekend = location.openingTimes?.some((time) => isNight(time.startTime)) || false;

    return {
        openAtNight,
        openInEvening,
        openInMorning,
        openInWeekend,
    };
}

/**
 * Determines the status of a location based on its approval and rejection dates.
 *
 * @param location - The location object to evaluate.
 * @returns The status of the location: 'approved', 'pending', or 'rejected'.
 */
export function getLocationStatus(location: Location): LocationStatus {
    if (location.rejectedAt) {
        return 'rejected';
    }

    if (location.approvedAt) {
        return 'approved';
    }

    return 'pending';
}

/**
 * Generates a Google Maps directions link for a given location.
 *
 * @param location - The location object containing address details.
 * @returns A URL string for Google Maps directions to the location.
 */
export function getGoogleMapsDirectionsLink(location: Location): string {
    const address = formatLocationAddress(location);
    const encodedAddress = encodeURIComponent(address);
    return `${GOOGLE_MAPS_DIRECTIONS_BASE_URL}${encodedAddress}`;
}
