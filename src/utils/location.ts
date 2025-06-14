import type { Location } from '@/types/schema/Location';

export const locationPlaceholderImages = Object.values(
    import.meta.glob('@/assets/img/placeholder/location-placeholder-*.jpg', {
        eager: true,
        as: 'url',
    }),
);

/**
 * Returns a random placeholder image URL for locations.
 *
 * @param location - The location object (not used in this function, but included for consistency).
 * @returns A random placeholder image URL.
 */
export function getLocationPlaceholderImage(location: Location): string {
    return (
        locationPlaceholderImages[location.id % locationPlaceholderImages.length] ||
        locationPlaceholderImages[0]
    );
}
