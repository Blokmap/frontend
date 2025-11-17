<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Step from '@/components/shared/molecules/steps/Step.vue';
import Steps from '@/components/shared/molecules/steps/Steps.vue';
import { faArrowRight, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { isAxiosError } from 'axios';
import { computed, ref, watchEffect } from 'vue';
import { useCreateLocation, useCreateLocationImage } from '@/composables/data/useLocations';
import { getImageBodyPreviewUrl, type ImageBody } from '@/domain/image';
import type { SubmissionStep } from '.';
import type { LocationBody } from '@/domain/location';

const props = defineProps<{
    canSubmit: boolean;
    location: LocationBody;
    images: ImageBody[];
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const { mutateAsync: createLocation } = useCreateLocation({ disableToasts: true });
const { mutateAsync: createLocationImage } = useCreateLocationImage({ disableToasts: true });

const error = ref<string | null>(null);
const locationId = ref<number | null>(null);

const locationStatus = ref<SubmissionStep>('idle');
const imagesStatus = ref<SubmissionStep>('idle');

const imagesStatuses = ref<Map<number, SubmissionStep>>(new Map());

const shouldStartSubmission = computed(() => {
    return props.canSubmit && visible.value && locationStatus.value === 'idle';
});

const isFinished = computed(() => {
    return (
        locationStatus.value === 'completed' && imagesStatus.value !== 'loading' && locationId.value
    );
});

const allImagesCompleted = computed(() => {
    if (props.images.length === 0) return true;

    for (const status of imagesStatuses.value.values()) {
        if (status !== 'completed') return false;
    }

    return true;
});

/**
 * Get the status of a specific image.
 * @param image The image to get the status for.
 */
function getImageStatus(image: ImageBody): SubmissionStep | undefined {
    return imagesStatuses.value.get(image.index);
}

/**
 * Submit a specific image.
 * @param image The image to submit.
 */
async function submitImage(image: ImageBody): Promise<void> {
    if (!locationId.value) return;

    imagesStatuses.value.set(image.index, 'loading');

    try {
        await createLocationImage({ locationId: locationId.value, image });
        imagesStatuses.value.set(image.index, 'completed');

        if (allImagesCompleted.value) {
            imagesStatus.value = 'completed';
            error.value = null;
        }
    } catch (e) {
        imagesStatuses.value.set(image.index, 'error');
        if (isAxiosError(e) && e.response) {
            error.value = e.response.data.message;
        }
    }
}

/**
 * Submit all images for the location.
 */
async function submitImages(): Promise<void> {
    if (!locationId.value) return;

    try {
        imagesStatus.value = 'loading';

        await Promise.all(props.images.map((image) => submitImage(image)));

        imagesStatus.value = 'completed';
    } catch (e) {
        imagesStatus.value = 'error';
        if (isAxiosError(e) && e.response) {
            error.value = e.response.data.message;
        }
    }
}

/**
 * Submit the location.
 */
async function submitLocation(): Promise<void> {
    error.value = null;
    locationId.value = null;

    locationStatus.value = 'idle';
    imagesStatus.value = 'idle';

    try {
        locationStatus.value = 'loading';
        const location = await createLocation(props.location);
        locationStatus.value = 'completed';
        locationId.value = location.id;
    } catch (e) {
        locationStatus.value = 'error';
        if (isAxiosError(e) && e.response) {
            error.value = e.response.data.message;
        }
    }
}

watchEffect(async () => {
    if (shouldStartSubmission.value) {
        await submitLocation();
        await submitImages();
    }
});
</script>

<template>
    <Dialog v-model:visible="visible" class="max-w-[650px]" :closable="false" modal>
        <template #header>
            <h2 class="text-xl font-semibold">Locatie indienen</h2>
        </template>
        <Steps>
            <Step title="Nieuwe bloklocatie aanmaken" :status="locationStatus">
                De locatiedetails worden gevalideerd en de locatie wordt aangemaakt. Dit kan een
                paar seconden duren.
            </Step>
            <Step
                title="Afbeeldingen uploaden"
                :status="imagesStatus"
                v-if="locationStatus === 'completed'">
                <div class="space-y-4">
                    <p class="text-sm text-slate-600">
                        De afbeeldingen worden geüpload. Dit kan een paar seconden duren.
                    </p>
                    <div v-if="images.length > 0" class="grid grid-cols-3 gap-3">
                        <div v-for="image in images" :key="image.index" class="image-preview">
                            <img
                                :src="getImageBodyPreviewUrl(image)"
                                :class="{
                                    loading: getImageStatus(image) === 'loading',
                                }" />

                            <div v-if="getImageStatus(image) === 'loading'" class="image-overlay">
                                <div class="spinner"></div>
                            </div>

                            <div
                                v-if="getImageStatus(image) === 'error'"
                                class="image-overlay image-error">
                                <Button
                                    @click="submitImage(image)"
                                    severity="danger"
                                    size="small"
                                    rounded>
                                    <FontAwesomeIcon :icon="faRotate" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Step>
        </Steps>
        <template #footer>
            <RouterLink
                v-if="isFinished"
                :to="{
                    name: 'dashboard.locations.detail.openings',
                    params: { locationId },
                }">
                <Button> Openingstijden toevoegen <FontAwesomeIcon :icon="faArrowRight" /> </Button>
            </RouterLink>
        </template>
    </Dialog>
</template>

<style scoped>
@import '@/assets/styles/main.css';

.image-preview {
    @apply relative aspect-square overflow-hidden;
    @apply rounded-lg shadow-lg;

    img {
        @apply h-full w-full object-cover transition-all duration-300;

        &.loading {
            @apply scale-105 blur-xs;
        }
    }
}

.image-overlay {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-black/20 backdrop-blur-sm;

    &.image-error {
        @apply bg-red-500/20;
    }
}

.spinner {
    @apply h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent;
}
</style>
