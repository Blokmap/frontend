import axios, { HttpStatusCode } from 'axios';
import { type Router } from 'vue-router';
import { useProgress } from '@/composables/store/useProgress';
import { MAPBOX_API_KEY, MAPBOX_URL } from '@/config';
import { endpoints } from '@/config/endpoints';
import { mockInstitutions } from '@/mock';

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
export function setupAxiosInterceptors(router: Router, toast: any): void {
    const progressStore = useProgress();

    // Request interceptor to start progress
    client.interceptors.request.use(
        async (config) => {
            progressStore.start();

            if (config.url === endpoints.institutions.list && config.method === 'get') {
                config.adapter = async () => {
                    return {
                        data: mockInstitutions,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    };
                };
            }

            return config;
        },
        (error) => {
            progressStore.finish();
            return Promise.reject(error);
        },
    );

    // Response interceptor to finish progress and handle errors
    client.interceptors.response.use(
        async (response) => {
            progressStore.finish();

            if (response.status === HttpStatusCode.Unauthorized) {
                router.push({
                    name: 'auth',
                    params: { action: 'login' },
                    query: { redirect: window.location.pathname },
                });
                toast.add({
                    severity: 'error',
                    summary: 'Niet ingelogd',
                    detail: 'Je moet ingelogd zijn om deze pagina te bekijken.',
                });
            }

            if (response.status === HttpStatusCode.InternalServerError) {
                console.error('Server error:', response);
                toast.add({
                    severity: 'error',
                    summary: 'Serverfout',
                    detail: 'Er is een fout opgetreden op de server. Probeer het later opnieuw.',
                });
            }

            if (response.status === HttpStatusCode.BadRequest) {
                toast.add({
                    severity: 'error',
                    summary: 'Fout bij verwerken verzoek',
                    detail: 'Er is een fout opgetreden bij het verwerken van je verzoek.',
                });
            }

            return response;
        },
        (error) => {
            progressStore.finish();
            return Promise.reject(error);
        },
    );

    // Add interceptors for MapBox client as well
    mapBoxClient.interceptors.request.use(
        async (config) => {
            progressStore.start();
            return config;
        },
        (error) => {
            progressStore.finish();
            return Promise.reject(error);
        },
    );

    mapBoxClient.interceptors.response.use(
        async (response) => {
            progressStore.finish();
            return response;
        },
        (error) => {
            progressStore.finish();
            return Promise.reject(error);
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
