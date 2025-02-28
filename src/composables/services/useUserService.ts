import { useAuthenticationStore } from '@/composables/stores/useAuthenticationStore';
import { storeToRefs } from 'pinia';

export function useUserService() {
    const { guest, user } = storeToRefs(useAuthenticationStore());

    function addFavoriteLocationId(locationId: number): void {
        guest.value.favoriteLocationIds = [...getFavoriteLocations(), locationId];

        if (user.value !== null) {
            // TODO: Implement API call to update user's favorite location.
            return;
        }
    }

    function removeFavoriteLocation(locationId: number): void {
        guest.value.favoriteLocationIds = getFavoriteLocations().filter((id) => id !== locationId);

        if (user.value !== null) {
            // TODO: Implement API call to update user's favorite location.
            return;
        }
    }

    function toggleFavoriteLocation(locationId: number): void {
        if (hasFavoriteLocation(locationId)) {
            return removeFavoriteLocation(locationId);
        }

        addFavoriteLocationId(locationId);
    }

    function hasFavoriteLocation(locationId: number): boolean {
        return getFavoriteLocations().includes(locationId);
    }

    function getFavoriteLocations(): number[] {
        if (user.value === null) {
            return guest.value.favoriteLocationIds ?? [];
        }

        return user.value.favoriteLocationIds ?? [];
    }

    return {
        toggleFavoriteLocation,
        hasFavoriteLocation,
        getFavoriteLocations,
    };
}
