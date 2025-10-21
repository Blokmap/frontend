<script setup lang="ts">
import ScannerOverlay from '@/components/features/scanner/ScannerOverlay.vue';
import { useSound } from '@vueuse/sound';
import { useRouter } from 'vue-router';
import ping from '@/assets/sounds/ping.mp3';
import { useScanProfile } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import type { Result } from '@zxing/library';

const props = defineProps<{
    locationId: string;
}>();

const router = useRouter();
const toast = useToast();
const sound = useSound(ping, { volume: 3 });

const { mutateAsync: scanProfile, isPending } = useScanProfile({
    onSuccess: () => {
        if (navigator.vibrate) {
            navigator.vibrate(500);
        }

        sound.play({});

        toast.add({
            severity: 'success',
            summary: 'Scan successful',
            detail: 'Profile has been scanned successfully.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Scan failed',
            detail: 'An error occurred while scanning the profile.',
        });
    },
});

/**
 * Handle scanned result - ignore if already processing
 *
 * @param result - Scanned QR code result
 */
async function onScan(result: Result): Promise<void> {
    // Ignore scan if already processing
    if (isPending.value) {
        return;
    }

    const profileId = +result.getText();
    const locationId = +props.locationId;

    scanProfile({
        profileId,
        request: {
            locationId,
            day: new Date(),
        },
    });
}

/**
 * Navigate back to reservations page
 */
function onClose(): void {
    router.push({
        name: 'dashboard.locations.detail.reservations',
        params: { locationId: props.locationId },
    });
}
</script>

<template>
    <Teleport to="body">
        <ScannerOverlay :visible="true" @scan="onScan" @close="onClose" />
    </Teleport>
</template>
