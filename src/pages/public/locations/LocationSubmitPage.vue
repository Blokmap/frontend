<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import SubmissionDialog from '@/components/features/location/builder/LocationSubmissionDialog.vue';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import { faArrowLeft, faArrowRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { DEFAULT_LOCATION_REQUEST, type LocationRequest } from '@/domain/location';
import type { BuilderStep, BuilderSubstep } from '@/components/features/location/builder';
import type { ImageRequest } from '@/domain/image';

const imagesForm = ref<ImageRequest[]>([]);

const locationForm = useLocalStorage<LocationRequest>('location-form', {
    defaults: DEFAULT_LOCATION_REQUEST,
});

const showSubmissionDialog = ref(false);
const step = ref<BuilderStep>('basics');
const substeps = ref<BuilderSubstep[]>([]);

const steps: { id: BuilderStep; label: string; desc: string }[] = [
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
        label: 'Instituties',
        desc: 'De instellingen van de locatie bepalen hoe men reservaties kan maken.',
    },
];

const stepIndex = computed<number>(() => steps.findIndex((curr) => curr.id === step.value));
const progress = computed<number>(() => Math.round(((stepIndex.value + 1) * 100) / steps.length));

const canGoNext = computed<boolean>(() => substeps.value.every((substep) => substep.isCompleted));
const canGoPrevious = computed<boolean>(() => stepIndex.value > 0);
const isLastStep = computed<boolean>(() => step.value === 'settings');
const isCreating = computed<boolean>(() => showSubmissionDialog.value);

/**
 * Go to the next step in the wizard
 * @return void
 */
function goNext(): void {
    if (canGoNext.value && stepIndex.value < steps.length - 1) {
        const nextStep = steps[stepIndex.value + 1].id;
        step.value = nextStep;
    }
}

/**
 * Go to the previous step in the wizard
 * @return void
 */
function goPrevious(): void {
    if (stepIndex.value > 0) {
        const prevStep = steps[stepIndex.value - 1].id;
        step.value = prevStep;
    }
}

/**
 * Submit the location form, images and openings to the API
 * @return Promise<void>
 */
async function submitLocation(): Promise<void> {
    showSubmissionDialog.value = true;
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
                    <Checkbox :model-value="substep.isCompleted" :disabled="true" :binary="true" />
                    <span
                        class="ms-3 text-sm"
                        :class="substep.isCompleted ? 'text-gray-900' : 'text-gray-500'">
                        {{ substep.label }}
                    </span>
                </div>
            </div>

            <div class="progressbar">
                <div class="indicator" :style="{ width: progress + '%' }" />
            </div>

            <div class="flex justify-between space-x-3">
                <Button
                    :disabled="!canGoPrevious"
                    severity="secondary"
                    outlined
                    size="small"
                    @click="goPrevious">
                    <FontAwesomeIcon :icon="faArrowLeft" class="mr-2" />
                    Vorige
                </Button>

                <Button
                    :disabled="!canGoNext || isCreating"
                    size="small"
                    @click="isLastStep ? submitLocation() : goNext()">
                    <template v-if="isLastStep">
                        <FontAwesomeIcon v-if="!isCreating" :icon="faCheck" class="mr-2" />
                        <FontAwesomeIcon v-else :icon="faSpinner" class="mr-2" spin />
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
            <LocationInformationBuilder
                v-if="step === 'basics'"
                v-model="locationForm"
                v-model:substeps="substeps">
            </LocationInformationBuilder>

            <LocationImagesBuilder
                v-if="step === 'images'"
                v-model="imagesForm"
                v-model:substeps="substeps">
            </LocationImagesBuilder>

            <LocationSettingsBuilder
                v-if="step === 'settings'"
                v-model:form="locationForm"
                v-model:substeps="substeps">
            </LocationSettingsBuilder>
        </div>
    </div>
    <Teleport to="body">
        <SubmissionDialog
            v-model:visible="showSubmissionDialog"
            :can-submit="isLastStep && canGoNext"
            :location="locationForm"
            :images="imagesForm">
        </SubmissionDialog>
    </Teleport>
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
