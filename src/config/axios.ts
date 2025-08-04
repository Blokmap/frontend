import { type UseMessages } from '@/composables/useMessages';
import { mockInstitutions } from '@/config/mock';
import { endpoints } from '@/endpoints';
import axios, { HttpStatusCode } from 'axios';
import { type Router } from 'vue-router';

export const mapBoxClient = axios.create({
    baseURL: import.meta.env.VITE_MAPBOX_API_BASE_URL,
    params: {
        access_token: import.meta.env.VITE_MAPBOX_API_KEY,
    },
    headers: {
        'Content-Type': 'application/json',
        Referrer: import.meta.env.VITE_API_BASE_URL,
    },
});

export const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

/**
 * Sets up Axios interceptors for the client.
 * This includes handling unauthorized responses and mocking certain endpoints.
 */
export function setupAxiosInterceptors(router: Router, messages: UseMessages): void {
    client.interceptors.response.use((response) => {
        if (response.status === HttpStatusCode.Unauthorized) {
            router.push({
                name: 'auth',
                params: { action: 'login' },
                query: { redirect: window.location.pathname },
            });
            messages.showMessage({
                severity: 'error',
                summary: 'Niet ingelogd',
                detail: 'Je moet ingelogd zijn om deze pagina te bekijken.',
            });
        }

        return response;
    });

    client.interceptors.request.use(async (config) => {
        if (config.url === endpoints.institutions.list && config.method === 'get') {
            await getRandomDelay();
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
    });
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
