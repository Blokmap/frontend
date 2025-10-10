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
    console.log(error);
    // Do not retry if the error is a 404 (Not Found)
    if (error?.status === HttpStatusCode.NotFound) return false;
    // Do not retry if the maximum number of retries has been reached
    if (failureCount > MAX_RETRIES) return false;
    // Otherwise, retry the query
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
