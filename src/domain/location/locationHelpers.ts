import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import { isToday, isWeekend } from '@/utils/date';
import { getCurrentTime, isEvening, isMorning, isNight, isTimeInRange } from '@/utils/time';
import { translationToRequest } from '../translation';
import { GOOGLE_MAPS_DIRECTIONS_BASE_URL } from './locationConstants';
import type { Location, LocationAddress, LocationFeatures, LocationRequest } from './types';
import type { OpeningTime } from '../openings';

/**
 * Returns a random placeholder image URL for locations.
 *
 * @param location - The location object (not used in this function, but included for consistency).
 * @returns A random placeholder image URL.
 */
export function getLocationPlaceholderImage(_location?: Location): string {
    return placeholder;
}

/**
 * Retrieves the primary image URL of a location or a placeholder if none exists.
 *
 * @param location - The location object containing images.
 * @returns The primary image URL or a placeholder image URL.
 */
export function getLocationImageUrl(location?: Location): string {
    const primaryImage = location?.images?.find((img) => img.index === 0);

    if (!primaryImage) {
        return getLocationPlaceholderImage(location);
    }

    return primaryImage.url;
}

/**
 * Converts a Location to a LocationBody for editing.
 *
 * @param location - The location object to convert.
 * @returns A LocationBody object suitable for forms.
 */
export function locationToRequest(location: Location): LocationRequest {
    return {
        name: location.name,
        seatCount: location.seatCount,
        isReservable: location.isReservable,
        isVisible: location.isVisible,
        street: location.street,
        number: location.number,
        zip: location.zip,
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        description: translationToRequest(location.description),
        excerpt: translationToRequest(location.excerpt),
        authorityId: location.authority?.id || null,
        institutionId: location.institution?.id || null,
    };
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

/**
 * Determines whether a location is currently open based on its opening times.
 * @param location - The location object containing opening times information
 * @returns true if the location is open at the current time and day, false otherwise
 * @remarks
 * This function checks if today's date matches any opening time entry and if the current time
 * falls within that opening time's start and end times. Returns false if the location has no opening times defined.
 */
export function isLocationCurrentlyOpen(location: Location): boolean {
    if (!location.openingTimes) {
        return false;
    }

    const currentTime = getCurrentTime();

    return location.openingTimes.some((openingTime: OpeningTime) => {
        return (
            isToday(openingTime.day) &&
            isTimeInRange(currentTime, openingTime.startTime, openingTime.endTime)
        );
    });
}
