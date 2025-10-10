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
        (response) => response,
        (error: AxiosError) => {
            if (error.status === HttpStatusCode.Unauthorized) {
                router.push({
                    name: 'auth',
                    params: { action: 'login' },
                    query: { redirect: window.location.pathname },
                });
                toast.add({
                    severity: 'error',
                    summary: 'Niet ingelogd',
                    detail: 'Je moet ingelogd zijn om deze actie uit te voeren.',
                });
            }

            if (error.status === HttpStatusCode.Forbidden) {
                if (error.request.method === 'GET') {
                    router.push({ name: 'dashboard' });
                }
                toast.add({
                    severity: 'error',
                    summary: 'Toegang geweigerd',
                    detail: 'Je hebt geen toegang tot deze actie of pagina.',
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
