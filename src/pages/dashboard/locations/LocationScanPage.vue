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
 * Handle scanned result
 *
 * @param result  - Scanned QR code result
 */
async function onScan(result: Result): Promise<void> {
    isProcessing.value = true;

    console.log('QR Code scanned:', {
        text: result.getText(),
        format: result.getBarcodeFormat(),
        timestamp: new Date().toISOString(),
        locationId: props.locationId,
    });

    navigator.vibrate?.(100);

    alert(`Gescande QR-code: ${result.getText()}`);

    // Resume scanning
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
    {{ isProcessing }}
    <Teleport to="body">
        <ScannerOverlay
            :visible="true"
            v-model:processing="isProcessing"
            @scan="onScan"
            @close="onClose">
        </ScannerOverlay>
    </Teleport>
</template>
