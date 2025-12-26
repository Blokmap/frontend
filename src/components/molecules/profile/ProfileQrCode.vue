<script setup lang="ts">
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { EncodeHintType } from '@zxing/library';
import { ref, watch, onMounted } from 'vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const container = ref<HTMLDivElement>();

/**
 * Generates and renders the QR code for the given profile ID.
 */
function generateQrCode(): void {
    if (!container.value) return;

    const qrWriter = new BrowserQRCodeSvgWriter();

    try {
        const hints = new Map();
        hints.set(EncodeHintType.MARGIN, 0);

        const svg = qrWriter.write(props.profile.id.toString(), 200, 200, hints);

        container.value.replaceChildren(svg);
    } catch (error) {
        console.error('Failed to generate QR code:', error);
    }
}

onMounted(generateQrCode);

watch(() => props.profile.id, generateQrCode);
</script>

<template>
    <div ref="container" class="qr-code-container"></div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.qr-code-container {
    @apply aspect-square h-full rounded-lg bg-white;
}
</style>
