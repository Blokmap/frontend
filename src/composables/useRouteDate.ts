import { computed, type WritableComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dateToString } from '@/utils/date';

export type RouteDateSource = 'query' | 'params';
export type RouteDateUpdateMethod = 'push' | 'replace';

export interface RouteDateOptions {
    /**
     * The name of the query or route parameter to use.
     * @default 'day'
     */
    paramName?: string;

    /**
     * Where to read/write the date from (query params or route params).
     * @default 'query'
     */
    source?: RouteDateSource;

    /**
     * The router method to use when updating the date.
     * @default 'replace'
     */
    updateMethod?: RouteDateUpdateMethod;

    /**
     * Default date to use when the param is not present or invalid.
     * @default new Date()
     */
    defaultDate?: Date;

    /**
     * Whether to format the date as YYYY-MM-DD only (without time).
     * @default true
     */
    dayOnly?: boolean;
}

/**
 * Composable to manage a date value synchronized with route query or route params.
 * This is useful for pages that filter or display data based on a date in the URL.
 *
 * @param options - Configuration options for the composable.
 * @returns A computed ref that can be used to get/set the date.
 *
 */
export function useRouteDate(options: RouteDateOptions = {}): WritableComputedRef<Date> {
    const {
        paramName = 'day',
        source = 'query',
        updateMethod = 'replace',
        defaultDate = new Date(),
        dayOnly = true,
    } = options;

    const route = useRoute();
    const router = useRouter();

    return computed<Date>({
        get: () => {
            // Get the param value from either query or params
            const paramValue =
                source === 'query'
                    ? route.query[paramName]?.toString()
                    : route.params[paramName]?.toString();

            if (!paramValue) {
                return defaultDate;
            }

            const date = new Date(paramValue);

            if (isNaN(date.getTime())) {
                return defaultDate;
            }

            return date;
        },
        set: (value: Date) => {
            const dateString = dateToString(value, dayOnly);

            if (!dateString) {
                return;
            }

            // Update the route based on source and update method
            if (source === 'query') {
                const routeUpdate = {
                    query: {
                        ...route.query,
                        [paramName]: dateString,
                    },
                };

                if (updateMethod === 'push') {
                    router.push(routeUpdate);
                } else {
                    router.replace(routeUpdate);
                }
            } else {
                // For params, we need to preserve the route name
                const routeUpdate = {
                    name: route.name || undefined,
                    params: {
                        ...route.params,
                        [paramName]: dateString,
                    },
                    query: route.query,
                };

                if (updateMethod === 'push') {
                    router.push(routeUpdate);
                } else {
                    router.replace(routeUpdate);
                }
            }
        },
    });
}
