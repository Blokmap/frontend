import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import type { LatLng, LatLngExpression } from 'leaflet';

export type LocationStatus = 'idle' | 'prompting' | 'querying' | 'granted' | 'denied' | 'error';

export const useUserLocationStore = defineStore('userLocation', () => {
    const hasPrompted = useStorage('promptedLocation', false);
    const i18n = useI18n();

    const status = ref<LocationStatus>('idle');
    const error = ref<string | null>(null);
    const coords = ref<LatLngExpression | null>(null);
    const timeout = ref(10_000);

    /**
     * Initialize the request for the user's location.
     */
    function init() {
        if (!hasPrompted.value) {
            status.value = 'prompting';
        }
    }

    /**
     * Request the user's location.
     */
    function request() {
        return new Promise<void>((resolve, reject) => {
            status.value = 'querying';

            if (!navigator.geolocation) {
                error.value = 'Geolocation is not supported by your browser';
                status.value = 'error';
                reject(error.value);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    coords.value = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    status.value = 'granted';
                    resolve();
                },
                (err) => {
                    error.value = err.message;
                    status.value = err.code === 1 ? 'denied' : 'error';
                    reject(err);
                },
                {
                    enableHighAccuracy: true,
                    timeout: timeout.value,
                },
            );
        });
    }

    function dismiss() {
        hasPrompted.value = true;
        status.value = 'denied';
    }

    return {
        status,
        coords,
        error,
        hasPrompted,
        timeout,
        init,
        request,
        dismiss,
    };
});
