import type { Profile } from './types';

/**
 * Generates a string of initials from the profile's first and last names.
 * If either name is not provided, it defaults to an empty string.
 *
 * @param {Profile} profile - The user profile containing first and last names.
 * @returns {string} A string of initials, e.g., "JD" for John Doe.
 */
export function getProfileInitials(profile: Profile): string {
    const firstNameInitial = profile.firstName?.[0] || '';
    const lastNameInitial = profile.lastName?.[0] || '';
    return `${firstNameInitial}${lastNameInitial}`;
}
