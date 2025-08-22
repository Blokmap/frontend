<script setup lang="ts">
import type { SubStep } from '@/components/features/location/builder/LocationBuilder.types';
import LocationImagesStep from '@/components/features/location/builder/steps/LocationImagesStep.vue';
import LocationInformationStep from '@/components/features/location/builder/steps/LocationInformationStep.vue';
import LocationOpeningsStep from '@/components/features/location/builder/steps/LocationOpeningsStep.vue';
import LocationSettingsStep from '@/components/features/location/builder/steps/LocationSettingsStep.vue';
import {
    useCreateLocation,
    useCreateLocationImage,
    useCreateLocationTimeslots,
} from '@/composables/data/useLocations';
import { useToast } from '@/composables/useToast';
import { DEFAULT_LOCATION_REQ } from '@/constants/defaults';
import type { CreateImageRequest } from '@/types/schema/Image';
import type { CreateLocationRequest } from '@/types/schema/Location';
import type { CreateOpeningTimeRequest } from '@/types/schema/OpeningTime';
import { deserializeDates, syncStorageData } from '@/utils/storage';
import { faArrowLeft, faArrowRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { mutateAsync: createLocation, isPending: isCreating } = useCreateLocation();
const { mutateAsync: createImage, isPending: isCreatingImages } = useCreateLocationImage();
const { mutateAsync: createOpenings, isPending: isCreatingOpenings } = useCreateLocationTimeslots();

const isCreatingLocation = computed(
    () => isCreating.value || isCreatingImages.value || isCreatingOpenings.value,
);

const locationForm = useLocalStorage<CreateLocationRequest>('location-form', DEFAULT_LOCATION_REQ, {
    mergeDefaults: syncStorageData,
});

const openingsForm = useLocalStorage<CreateOpeningTimeRequest[]>('openings-form', [], {
    serializer: {
        read: (value: string) => {
            try {
                const parsed = JSON.parse(value);
                // Convert date strings back to Date objects
                return deserializeDates(parsed, ['day', 'reservableFrom', 'reservableUntil']);
            } catch {
                return [];
            }
        },
        write: (value: CreateOpeningTimeRequest[]) => JSON.stringify(value),
    },
});

const imagesForm = ref<CreateImageRequest[]>([]);

const step = ref<string>(route.query.step?.toString() || 'basics');
const substeps = ref<SubStep[]>([]);

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

    try {
        const location = await createLocation(locationForm.value);

        if (imagesForm.value.length > 0) {
            await Promise.all(
                imagesForm.value.map((image) => createImage({ locationId: location.id, image })),
            );
        }

        if (openingsForm.value.length > 0) {
            await createOpenings({ timeslots: openingsForm.value, locationId: location.id });
        }

        toast.add({
            severity: 'success',
            summary: 'Locatie succesvol aangemaakt',
            detail: 'De locatie is succesvol aangemaakt en wacht op goedkeuring door een beheerder. We houden je op de hoogte!',
        });

        router.push({ name: 'locations' });
    } catch (error) {
        console.error('Error creating location:', error);
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[2048px] gap-6">
        <div class="sticky top-6 h-fit w-full space-y-6 rounded-md md:w-2/7">
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
                    :disabled="!canGoNext || isCreatingLocation"
                    size="small">
                    <template v-if="isLastStep">
                        <FontAwesomeIcon :icon="faCheck" class="mr-2" v-if="!isCreatingLocation" />
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
        <div class="w-full md:w-5/7">
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
                v-model="locationForm"
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
