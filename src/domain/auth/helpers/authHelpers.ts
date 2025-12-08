const REDIRECT_URL_KEY = 'redirectAfterLogin';

/**
 * Stores the redirect URL in local storage.
 *
 * @param url - The URL to redirect to after login.
 */
export function pushRedirectUrl(url: string): void {
    localStorage.setItem(REDIRECT_URL_KEY, url);
}

/**
 * Retrieves and removes the redirect URL from local storage.
 *
 * @returns The stored redirect URL or null if not found.
 */
export function pullRedirectUrl(): string | null {
    const url = localStorage.getItem(REDIRECT_URL_KEY);
    localStorage.removeItem(REDIRECT_URL_KEY);
    return url;
}
