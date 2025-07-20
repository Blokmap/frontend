import { useMessages } from '@/composables/useMessages';
import { getAuthProfile } from '@/services/auth';
import { useQueryClient } from '@tanstack/vue-query';
import type { NavigationGuardReturn } from 'vue-router';

export async function AuthenticationGuard(): Promise<NavigationGuardReturn> {
    const client = useQueryClient();
    const messages = useMessages();

    const user = await client.fetchQuery({
        queryKey: ['profile'],
        queryFn: getAuthProfile,
    });

    if (user === null) {
        messages.showMessage({
            severity: 'error',
            summary: 'Niet ingelogd',
            detail: 'Je moet ingelogd zijn om deze pagina te bekijken.',
        });

        return { name: 'auth.login', query: { redirect: window.location.pathname } };
    }

    return true;
}
