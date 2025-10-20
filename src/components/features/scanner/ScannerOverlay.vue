<script lang="ts" setup>
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useUserMedia } from '@vueuse/core';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { ref, watch, onUnmounted, computed } from 'vue';
import type { Result } from '@zxing/library';

const visible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
    scan: [result: Result];
    close: [];
}>();

const { stream, enabled } = useUserMedia({
    constraints: { video: { facingMode: 'environment' } },
});

const scanner = new BrowserMultiFormatReader();

const videoRef = ref<HTMLVideoElement>();
const scanControls = ref<IScannerControls | null>(null);
const isVideoReady = ref<boolean>(false);

const isLoading = computed(() => enabled.value && (!stream.value || !isVideoReady.value));

watch(
    visible,
    (isVisible) => {
        enabled.value = isVisible;
        if (!isVisible) cleanup();
    },
    { immediate: true },
);

watch([stream, videoRef], ([newStream, video]) => {
    if (!video || !newStream) return;

    video.srcObject = newStream;

    video.addEventListener(
        'loadedmetadata',
        () => {
            isVideoReady.value = true;
            startScanning();
        },
        { once: true },
    );
});

/**
 * Start scanning for QR codes. Emits 'scan' event on successful scan.
 */
async function startScanning(): Promise<void> {
    if (!videoRef.value || scanControls.value) return;

    try {
        scanControls.value = await scanner.decodeFromVideoElement(videoRef.value, (result) => {
            if (result) {
                emit('scan', result);
            }
        });
    } catch (error) {
        console.error('Scanning failed:', error);
    }
}

/**
 * Cleanup resources and stop scanning
 */
function cleanup(): void {
    // Stop scanner
    scanControls.value?.stop();
    scanControls.value = null;
    isVideoReady.value = false;

    // Stop camera stream
    stream.value?.getTracks().forEach((track) => track.stop());

    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
}

/**
 * Close the scanner overlay
 */
function close(): void {
    cleanup();
    enabled.value = false;
    visible.value = false;
    emit('close');
}

onUnmounted(() => {
    cleanup();
    enabled.value = false;
});
</script>

<template>
    <Transition name="scale">
        <div v-if="visible" class="overlay">
            <Button
                @click="close"
                severity="secondary"
                class="close-button"
                rounded
                aria-label="Close scanner">
                <template #icon>
                    <FontAwesomeIcon :icon="faTimes" />
                </template>
            </Button>

            <video
                v-show="!isLoading"
                ref="videoRef"
                autoplay
                playsinline
                class="camera-feed"></video>

            <div class="overlay-mask" :class="{ loading: isLoading }">
                <div class="scanning-region">
                    <template v-if="!isLoading">
                        <div
                            v-for="corner in ['tl', 'tr', 'bl', 'br']"
                            :key="corner"
                            :class="`corner corner-${corner}`"></div>
                    </template>

                    <p v-else class="loading-message"><ProgressSpinner> </ProgressSpinner></p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.overlay {
    @apply fixed inset-0 z-50;
}

.camera-feed {
    @apply absolute inset-0 h-full w-full object-cover;
}

.overlay-mask {
    @apply absolute inset-0 z-10 flex items-center justify-center;

    &.loading {
        @apply bg-black;
    }
}

.scanning-region {
    @apply relative flex h-128 w-128 items-center justify-center;

    &:has(.loading-message) {
        @apply bg-white;
    }

    &:not(:has(.loading-message))::before {
        content: '';
        @apply absolute inset-0 backdrop-blur-xs;
        box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.75);
    }
}

.corner {
    @apply absolute h-8 w-8 border-4 border-white;

    &.corner-tl {
        @apply top-0 left-0 border-r-0 border-b-0;
    }

    &.corner-tr {
        @apply top-0 right-0 border-b-0 border-l-0;
    }

    &.corner-bl {
        @apply bottom-0 left-0 border-t-0 border-r-0;
    }

    &.corner-br {
        @apply right-0 bottom-0 border-t-0 border-l-0;
    }
}

.loading-message {
    @apply px-4 py-2 text-center text-sm font-medium text-black;
}

.close-button {
    @apply !absolute top-4 right-4 z-100;
}
</style>
