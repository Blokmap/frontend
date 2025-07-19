import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useNetworkWatcher() {
    const router = useRouter();
    const route = useRoute();

    const isOnline = ref(navigator.onLine);
    const wasOffline = ref(false);

    onMounted(() => {
        const handleOffline = () => {
            console.warn('Network is offline');
            isOnline.value = false;
            wasOffline.value = true;

            if (route.name !== 'offline') {
                router.replace({ name: 'offline', query: { from: route.fullPath } });
            }
        };

        const handleOnline = () => {
            isOnline.value = true;

            if (wasOffline.value && route.name === 'offline') {
                const returnTo = route.query.from as string;

                if (returnTo) {
                    router.replace(returnTo);
                } else {
                    router.replace('/');
                }
            }
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    });

    return { isOnline };
}
