import { useMutation, useQuery, useQueryClient } from 'vue-query';
import { useAuthStore } from '@/composables/stores/auth';
import type { Profile } from '@/types/';

export function useLogin(): ReturnType<
    typeof useMutation<void, Error, { username: string; password: string }>
> {
    const authStore = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Invalid credentials');
            await queryClient.invalidateQueries(['auth']);
        },
        onSuccess: async () => {
            await authStore.fetchProfile();
        },
    });
}

export function useLogout() {
    const authStore = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch('/auth/logout', { method: 'POST' });
            if (!res.ok) throw new Error('Logout failed');
        },
        onSuccess: async () => {
            authStore.clear();
            await queryClient.invalidateQueries(['auth']);
        },
    });
}

export function useAuthProfile() {
    return useQuery<Profile | null>({
        queryKey: ['auth'],
        queryFn: async () => {
            const res = await fetch('/auth/me');
            if (res.status === 401) return null;
            return await res.json();
        },
    });
}
