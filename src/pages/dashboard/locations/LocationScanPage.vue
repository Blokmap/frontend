<script setup lang="ts">
import ScannerOverlay from '@/components/features/scanner/ScannerOverlay.vue';
import { useSound } from '@vueuse/sound';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
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
const { t } = useI18n();
const sound = useSound(ping, { volume: 3 });

const successfullProfileScans = ref<number[]>([]);

const { mutateAsync: scanProfile, isPending } = useScanProfile({
    onSuccess: onScanSuccess,
    onError: () => {
        toast.add({
            severity: 'error',
            summary: t('domains.profiles.errors.scanFailed'),
            detail: t('domains.profiles.errors.scanFailedDetail'),
        });
    },
});

/**
 * Handle scanned result - ignore if already processing
 *
 * @param result - Scanned QR code result
 */
async function onScan(result: Result): Promise<void> {
    const profileId = +result.getText();
    const locationId = +props.locationId;

    // Ignore scan if already processing
    if (isPending.value) {
        return;
    }

    // Ignore scan if recently scanned
    if (successfullProfileScans.value.includes(profileId)) {
        return onScanSuccess(profileId);
    }

    await scanProfile({
        profileId,
        request: {
            locationId,
            day: new Date(),
        },
    });

    successfullProfileScans.value.push(profileId);
}

/**
 * Handle successful scan
 *
 * @param id - Scanned profile ID
 */
function onScanSuccess(id: number): void {
    const toastId = `scan-success-${id}`;

    if (toast.hasVisibleToast(toastId)) {
        return;
    }

    if (navigator.vibrate) {
        navigator.vibrate(500);
    }

    sound.play();

    toast.add({
        id: toastId,
        severity: 'success',
        summary: t('domains.profiles.success.scanSuccessful'),
        detail: t('domains.profiles.success.scanSuccessfulDetail'),
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
