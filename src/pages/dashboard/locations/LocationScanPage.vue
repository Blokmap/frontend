<script setup lang="ts">
import ScannerOverlay from '@/components/features/scanner/ScannerOverlay.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Result } from '@zxing/library';

const props = defineProps<{
    locationId: string;
}>();

const router = useRouter();

const isProcessing = ref<boolean>(false);

/**
 * Handle scanned result - ignore if already processing
 *
 * @param result - Scanned QR code result
 */
async function onScan(result: Result): Promise<void> {
    // Ignore scan if already processing
    if (isProcessing.value) {
        return;
    }

    isProcessing.value = true;

    console.log('QR Code scanned:', {
        text: result.getText(),
        format: result.getBarcodeFormat(),
        timestamp: new Date().toISOString(),
        locationId: props.locationId,
    });

    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate(500);
    }

    alert(`Gescande QR-code: ${result.getText()}`);

    // Ready for next scan
    isProcessing.value = false;
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
