import { keepPreviousData } from '@tanstack/vue-query';
import { HttpStatusCode } from 'axios';

const MAX_RETRIES = 3;

/**
 * Retry function for Vue Query to determine if a query should be retried based on the error and failure count.
 *
 * @param failureCount - The number of times the query has failed.
 * @param error - The error object returned from the failed query.
 * @returns A boolean indicating whether the query should be retried.
 */
function retryQuery(failureCount: number, error: any): boolean {
    if (failureCount > MAX_RETRIES) {
        return false;
    }

    switch (error?.status) {
        case HttpStatusCode.NotFound:
        case HttpStatusCode.Unauthorized:
        case HttpStatusCode.Forbidden:
        case HttpStatusCode.BadRequest: {
            return false;
        }

        default: {
            return true;
        }
    }
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
