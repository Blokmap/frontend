import { getAuthProfile } from '@/services/auth';
import { useQueryClient } from '@tanstack/vue-query';
import type { NavigationGuardReturn } from 'vue-router';

export async function AuthenticationGuard(): Promise<NavigationGuardReturn> {
    const client = useQueryClient();

    const user = await client.fetchQuery({
        queryKey: ['profile'],
        queryFn: getAuthProfile,
    });

    if (user === null) {
        return {
            name: 'auth',
            params: { action: 'login' },
            query: { redirect: window.location.pathname },
        };
    }

    return true;
}
