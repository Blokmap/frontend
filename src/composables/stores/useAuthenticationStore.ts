import type { Guest, User } from '@/types/model/User';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthenticationStore = defineStore('authentication', () => {
    const user = ref<User | null>(null);

    const guest = useLocalStorage<Guest>('guest', {
        favoriteLocations: [],
        recentLocations: [],
    });

    const isGuest = (): boolean => {
        return user.value === null;
    };

    return { user, guest, isGuest };
});
