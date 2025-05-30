import { useAuthenticationStore } from '@/composables/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';

export function useUserService() {
    const maxRecentLocations = 5;
    const { guest, user } = storeToRefs(useAuthenticationStore());

    const updateRecentLocations = (location: number): void => {
        const recentLocations = guest.value.recentLocations.filter((id) => id !== location);
        guest.value.recentLocations = [location, ...recentLocations].slice(0, maxRecentLocations);
    };

    const addFavoriteLocation = (location: number): void => {
        guest.value.favoriteLocations = [...getFavoriteLocations(), location];

        if (user.value !== null) {
            // TODO: Implement API call to update user's favorite location.
            return;
        }
    };

    function removeFavoriteLocation(location: number): void {
        guest.value.favoriteLocations = getFavoriteLocations().filter((id) => id !== location);

        if (user.value !== null) {
            // TODO: Implement API call to update user's favorite location.
            return;
        }
    }

    const toggleFavoriteLocation = (location: number): void => {
        if (hasFavoriteLocation(location)) {
            return removeFavoriteLocation(location);
        }

        addFavoriteLocation(location);
    };

    const hasFavoriteLocation = (location: number): boolean => {
        return getFavoriteLocations().includes(location);
    };

    const getFavoriteLocations = (): number[] => {
        if (user.value === null) {
            return guest.value.favoriteLocations ?? [];
        }

        return user.value.favoriteLocations ?? [];
    };

    return {
        toggleFavoriteLocation,
        hasFavoriteLocation,
        getFavoriteLocations,
        updateRecentLocations,
    };
}
