import { keepPreviousData } from '@tanstack/vue-query';
import { isAxiosError } from 'axios';

function retryQuery(failureCount: number, error: unknown): boolean {
    if (isAxiosError(error)) {
        if (error.response?.status === 404) return false;
    }

    if (failureCount >= 3) return false;

    return true;
}

export const vueQueryConfig = {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                placeholderData: keepPreviousData,
                retry: retryQuery,
                staleTime: 10_000,
            },
        },
    },
};
