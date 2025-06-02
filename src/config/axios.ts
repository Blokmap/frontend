import { mockInstitutions } from '@/config/mock';
import { endpoints } from '@/endpoints';
import axios from 'axios';

export const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

client.interceptors.request.use(async (config) => {
    if (config.url === endpoints.institutions.list && config.method === 'get') {
        console.log('Mocking institutions list request');
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, Math.random() * (1500 - 250) + 1500));
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
