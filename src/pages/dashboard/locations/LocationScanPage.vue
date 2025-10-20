<script setup lang="ts">
import ScannerOverlay from '@/components/features/scanner/ScannerOverlay.vue';
import { useRouter } from 'vue-router';
import type { Result } from '@zxing/library';

const props = defineProps<{
    locationId: string;
}>();

const router = useRouter();

/**
 * Handle scanned result
 *
 * @param result  - Scanned QR code result
 */
function onScan(result: Result): void {
    console.log('QR Code scanned:', {
        text: result.getText(),
        format: result.getBarcodeFormat(),
        timestamp: new Date().toISOString(),
        locationId: props.locationId,
    });
    navigator.vibrate?.(100);
    alert(`Gescande QR-code: ${result.getText()}`);
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
