<script setup lang="ts">
import LocationImagesStep from '@/components/features/location/builder/steps/LocationImagesStep.vue';
import LocationInformationStep from '@/components/features/location/builder/steps/LocationInformationStep.vue';
import LocationOpeningsStep from '@/components/features/location/builder/steps/LocationOpeningsStep.vue';
import LocationSettingsStep from '@/components/features/location/builder/steps/LocationSettingsStep.vue';
import {
    useCreateLocation,
    useCreateLocationImage,
    useCreateLocationTimeslots,
} from '@/composables/data/useLocations';
import { useVersionedLocalStorage } from '@/composables/store/useVersionedLocalStorage';
import { useToast } from '@/composables/useToast';
import type { ImageRequest } from '@/domain/image';
import { DEFAULT_LOCATION_REQUEST } from '@/domain/location';
import type { BuilderStep, BuilderSubstep, Location, LocationRequest } from '@/domain/location';
import type { OpeningTimeRequest } from '@/domain/openings';
import { deleteLocation, deleteLocationImages, deleteLocationOpenings } from '@/services/location';
import { faArrowLeft, faArrowRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { mutateAsync: createLocation, isPending: isCreatingLocation } = useCreateLocation();
const { mutateAsync: createImage, isPending: isCreatingImages } = useCreateLocationImage();
const { mutateAsync: createOpenings, isPending: isCreatingOpenings } = useCreateLocationTimeslots();

const isCreating = computed(
    () => isCreatingLocation.value || isCreatingImages.value || isCreatingOpenings.value,
);

const locationForm = useVersionedLocalStorage<LocationRequest>('location-form', {
    defaults: DEFAULT_LOCATION_REQUEST,
});

const openingsForm = useVersionedLocalStorage<OpeningTimeRequest[]>('openings-form', {
    defaults: [],
});

const imagesForm = ref<ImageRequest[]>([]);

const step = ref<BuilderStep>(route.query.step?.toString() || 'basics');
const substeps = ref<BuilderSubstep[]>([]);

const steps: { id: string; label: string; desc: string }[] = [
    {
        id: 'basics',
        label: 'Registreer nieuwe Blokspot',
        desc: 'Start met wat basisinformatie zoals de naam en een beschrijving van de nieuwe locatie. Bevestig het adres op de kaart.',
    },
    {
        id: 'images',
        label: 'Afbeeldingen',
        desc: "Voeg een paar foto's to die de locatie mooi in beeld brengen.",
    },
    {
        id: 'settings',
        label: 'Instellingen',
        desc: 'De instellingen van de locatie bepalen hoe men reservaties kan maken.',
    },
    {
        id: 'openings',
        label: 'Openingstijden',
        desc: 'Voeg de openingstijden toe. Geen zorgen, je kan deze op elk moment aanpassen!',
    },
];

const canGoNext = computed(() => substeps.value.every((substep) => substep.isCompleted));
const canGoPrevious = computed(() => stepIndex.value > 0);
const stepIndex = computed(() => steps.findIndex((curr) => curr.id === step.value));
const progressPercentage = computed(() => Math.round(((stepIndex.value + 1) * 100) / steps.length));
const isLastStep = computed(() => step.value === 'openings');

watch(
    () => route.query.step,
    (newStep) => {
        if (typeof newStep === 'string' && steps.some((s) => s.id === newStep)) {
            step.value = newStep;
        }
    },
);

function goNext(): void {
    if (canGoNext.value && stepIndex.value < steps.length - 1) {
        const nextStep = steps[stepIndex.value + 1].id;
        router.push({ query: { step: nextStep } });
    }
}

function goPrevious(): void {
    if (stepIndex.value > 0) {
        const prevStep = steps[stepIndex.value - 1].id;
        router.push({ query: { step: prevStep } });
    }
}

async function submitLocation(): Promise<void> {
    if (!canGoNext.value) return;

    let locationId = null;
    let createdLocation = false;
    let createdImages = false;
    let createdOpenings = false;

    try {
        const location = await createLocation(locationForm.value);
        locationId = location.id;
        createdLocation = true;

        if (imagesForm.value.length > 0) {
            await Promise.all(
                imagesForm.value.map((image) => createImage({ locationId: location.id, image })),
            );
            createdImages = true;
        }

        if (openingsForm.value.length > 0) {
            await createOpenings({ timeslots: openingsForm.value, locationId: location.id });
            createdOpenings = true;
        }

        toast.add({
            severity: 'success',
            summary: 'Locatie succesvol aangemaakt',
            detail: 'De locatie is succesvol aangemaakt en wacht op goedkeuring door een beheerder. We houden je op de hoogte!',
        });

        router.push({ name: 'locations' });
    } catch (error) {
        console.error('Error creating location:', error);

        if (createdOpenings && locationId) {
            await deleteLocationOpenings(locationId);
        }

        if (createdImages && locationId) {
            await deleteLocationImages(locationId);
        }

        if (createdLocation && locationId) {
            await deleteLocation(locationId);
        }
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[2048px] gap-6">
        <div class="sticky top-6 h-fit w-full space-y-6 rounded-md md:w-1/3">
            <div class="space-y-4">
                <h1 class="text-2xl font-bold">
                    {{ steps[stepIndex].label }}
                </h1>
                <p class="text-sm text-slate-500">
                    {{ steps[stepIndex].desc }}
                </p>
            </div>

            <div class="space-y-3">
                <div v-for="substep in substeps" :key="substep.label">
                    <Checkbox :model-value="substep.isCompleted" :disabled="true" :binary="true">
                    </Checkbox>
                    <span
                        class="ms-3 text-sm"
                        :class="substep.isCompleted ? 'text-gray-900' : 'text-gray-500'">
                        {{ substep.label }}
                    </span>
                </div>
            </div>

            <div class="progressbar">
                <div class="indicator" :style="{ width: progressPercentage + '%' }"></div>
            </div>

            <div class="flex justify-between space-x-3">
                <Button
                    @click="goPrevious"
                    :disabled="!canGoPrevious"
                    severity="secondary"
                    outlined
                    size="small">
                    <FontAwesomeIcon :icon="faArrowLeft" class="mr-2" />
                    Vorige
                </Button>

                <Button
                    @click="isLastStep ? submitLocation() : goNext()"
                    :disabled="!canGoNext || isCreating"
                    size="small">
                    <template v-if="isLastStep">
                        <FontAwesomeIcon :icon="faCheck" class="mr-2" v-if="!isCreating" />
                        <FontAwesomeIcon :icon="faSpinner" class="mr-2" spin v-else />
                        Voltooien
                    </template>
                    <template v-else>
                        Volgende
                        <FontAwesomeIcon :icon="faArrowRight" class="ml-2" />
                    </template>
                </Button>
            </div>
        </div>
        <div class="w-full md:w-2/3">
            <LocationInformationStep
                v-model="locationForm"
                v-model:substeps="substeps"
                v-if="step === 'basics'">
            </LocationInformationStep>

            <LocationImagesStep
                v-model="imagesForm"
                v-model:substeps="substeps"
                v-if="step === 'images'">
            </LocationImagesStep>

            <LocationSettingsStep
                v-model:form="locationForm"
                v-model:substeps="substeps"
                v-if="step === 'settings'">
            </LocationSettingsStep>

            <LocationOpeningsStep
                :form="locationForm"
                v-model:openings="openingsForm"
                v-model:substeps="substeps"
                v-if="step === 'openings'">
            </LocationOpeningsStep>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.progressbar {
    @apply relative h-2 w-full rounded-xl bg-slate-300;

    .indicator {
        @apply bg-primary-500 absolute top-0 left-0 h-full rounded-xl;
        @apply transition-all duration-300;
    }
}
</style>
