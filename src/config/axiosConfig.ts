import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { useToast } from '@/composables/store/useToast';
import { MAPBOX_API_KEY, MAPBOX_URL } from '@/config';

export const mapBoxClient = axios.create({
    baseURL: MAPBOX_URL,
    params: {
        access_token: MAPBOX_API_KEY,
    },
    headers: {
        'Content-Type': 'application/json',
    },
});

export const client = axios.create({
    baseURL: '/api/',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

/**
 * Sets up Axios interceptors for the client.
 * This includes handling unauthorized responses and mocking certain endpoints.
 */
export function setupAxiosInterceptors(): void {
    const toast = useToast();

    // Response interceptor to handle errors
    client.interceptors.response.use(
        async (response) => {
            if (import.meta.env.DEV) {
                // Change this to simulate network delay in development
                await getRandomDelay(500, 1500);
            }

            return response;
        },
        async (error) => {
            if (!isAxiosError(error)) {
                throw error;
            }

            if (error.status === HttpStatusCode.PayloadTooLarge) {
                toast.add({
                    severity: 'error',
                    summary: 'Bestand te groot',
                    detail: 'Het geüploade bestand is te groot. Probeer een kleiner bestand te uploaden.',
                });
            }

            throw error;
        },
    );
}

/**
 * Generates a random delay between minDelay and maxDelay milliseconds.
 *
 * @param minDelay - number of milliseconds for the minimum delay (default is 250ms)
 * @param maxDelay - number of milliseconds for the maximum delay (default is 1500ms)
 * @returns {Promise<void>} - A promise that resolves after the random delay.
 */
export async function getRandomDelay(
    minDelay: number = 250,
    maxDelay: number = 1500,
): Promise<void> {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise((resolve) => setTimeout(resolve, delay));
}
