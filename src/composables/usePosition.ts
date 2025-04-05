import { usePermission } from '@vueuse/core';
import { ref } from 'vue';

export function usePosition() {
    const isLoadingPosition = ref(false);
    const positionStatus = usePermission('geolocation');
    const position = ref<GeolocationPosition | null>(null);

    const updatePosition = (): Promise<GeolocationPosition> => {
        isLoadingPosition.value = true;
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos: GeolocationPosition) => {
                    isLoadingPosition.value = false;
                    position.value = pos;
                    resolve(pos);
                },
                (error: GeolocationPositionError) => {
                    isLoadingPosition.value = false;
                    reject(error);
                },
                {
                    timeout: 10000,
                },
            );
        });
    };

    return { position, positionStatus, updatePosition, isLoadingPosition };
}
