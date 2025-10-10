export const AUTH_COOKIE_NAME = 'blokmap_access_token';

/**
 * Get a cookie by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The cookie value or null if not found.
 */
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(';')[0];
    }
    return null;
}

/**
 * Delete a cookie by name.
 * @param name - The name of the cookie to delete.
 */
export function deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
}

/**
 * Set a cookie with a name, value, and expiration in days.
 * @param name - The name of the cookie to set.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires.
 */
export function setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
}
