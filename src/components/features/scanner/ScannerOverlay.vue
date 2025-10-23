<script lang="ts" setup>
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
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
    constraints: {
        video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
        },
    },
});

const videoRef = ref<HTMLVideoElement>();
const scanControls = ref<IScannerControls | null>(null);
const isVideoReady = ref(false);

const isLoading = computed(() => enabled.value && (!stream.value || !isVideoReady.value));

// Enable camera when visible
watch(
    visible,
    (isVisible) => {
        enabled.value = isVisible;
        if (!isVisible) {
            scanControls.value?.stop();
            scanControls.value = null;
            stream.value?.getTracks().forEach((track) => track.stop());
            isVideoReady.value = false;
        }
    },
    { immediate: true },
);

// Start scanning when video is ready
watch([stream, videoRef], ([newStream, video]) => {
    if (!video || !newStream || scanControls.value) return;

    video.srcObject = newStream;

    video.onloadeddata = async () => {
        isVideoReady.value = true;
        console.log('Video stream loaded, starting scanner...');

        try {
            const scanner = new BrowserMultiFormatReader();

            scanControls.value = await scanner.decodeFromVideoElement(video, (result) => {
                if (result) emit('scan', result);
            });
        } catch (error) {
            console.error('Scanning failed:', error);
        }
    };
});

function close(): void {
    visible.value = false;
    emit('close');
}

onUnmounted(() => {
    enabled.value = false;
});
</script>

<template>
    <Transition name="scale">
        <div v-if="visible" class="overlay">
            <div class="absolute top-0 z-100 flex w-full justify-between gap-3 p-4">
                <Button severity="contrast" size="small">
                    <FontAwesomeIcon :icon="faCog" />
                    <span>Scaninstellingen</span>
                </Button>
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
            </div>

            <video
                v-show="!isLoading"
                ref="videoRef"
                autoplay
                playsinline
                class="camera-feed"></video>

            <div class="overlay-mask" :class="{ loading: isLoading }">
                <div class="scanning-region" :class="{ loading: isLoading }">
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
        @apply bg-black/70 backdrop-blur-lg;
    }

    /* Blurred dark overlay everywhere */
    &:not(.loading)::before {
        @apply content-[''];
        @apply absolute inset-0 bg-black/50 backdrop-blur-md;

        /* Cut out a square hole for the scanning region (512px = h-128) */
        clip-path: polygon(
            0 0,
            100% 0,
            100% 100%,
            0 100%,
            0 0,
            calc(50% - 256px) calc(50% - 256px),
            calc(50% - 256px) calc(50% + 256px),
            calc(50% + 256px) calc(50% + 256px),
            calc(50% + 256px) calc(50% - 256px),
            calc(50% - 256px) calc(50% - 256px)
        );
    }
}

.scanning-region {
    @apply relative flex h-128 w-128 items-center justify-center;

    &.loading {
        @apply rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md;
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
    @apply px-4 py-2 text-center text-sm font-medium text-white;
}
</style>
