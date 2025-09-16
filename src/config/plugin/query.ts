import { isAxiosError } from 'axios';

export const vueQueryConfig = {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                retry: (failureCount: number, error: unknown) => {
                    if (isAxiosError(error)) {
                        if (error.response?.status === 404) return false;
                    }

                    if (failureCount >= 3) return false;

                    return true;
                },
                staleTime: 10_000,
            },
        },
    },
};
