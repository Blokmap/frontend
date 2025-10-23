import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useRouter } from 'vue-router';
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
    const router = useRouter();
    const toast = useToast();

    // Response interceptor to handle errors
    client.interceptors.response.use(
        async (response) => {
            //await getRandomDelay(1000, 2000);
            return response;
        },
        (error: AxiosError) => {
            if (error.status === HttpStatusCode.Forbidden) {
                if (error.request.method === 'GET') {
                    router.push({ name: 'dashboard' });
                }

                if (error.request.method !== 'GET') {
                    toast.add({
                        severity: 'error',
                        summary: 'Toegang geweigerd',
                        detail: 'Je hebt geen toegang tot deze actie of pagina.',
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Toegang geweigerd',
                        detail: 'Je hebt geen toegang tot deze data.',
                    });
                }
            }

            if (error.status === HttpStatusCode.PayloadTooLarge) {
                console.debug('File too large error intercepted', error);
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
