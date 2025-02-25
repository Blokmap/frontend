import type { GeoLocation } from '@/types/Location';
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';

export function useLocation() {
    const location = useLocalStorage<GeoLocation | null>('geolocation', null);
    const isError = ref(false);
    const isLoading = ref(true);
    const hasPermission = ref(false);

    /**
     * Retrieves the current geographical location of the user.
     *
     * @returns void
     */
    function getGeoLocation(): void {
        // Get the current position via the Geolocation API.
        // This will prompt the user for permission if needed.
        console.info('Getting location...');

        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
                console.info('Got location:', position);
                isLoading.value = false;
                location.value = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            },
            () => {
                console.error('Failed to get location.');
                isLoading.value = false;
                isError.value = true;
            },
        );
    }

    // Check if the user has granted permission to access their location.
    // This will not prompt the user for permission.
    watch(
        location,
        async () => {
            const { state } = await navigator.permissions.query({ name: 'geolocation' });
            hasPermission.value = state === 'granted';
        },
        { immediate: true },
    );

    return {
        location,
        isError,
        isLoading,
        hasPermission,
        getGeoLocation,
    };
}
