<script setup lang="ts">
import LocationImagesStep from '@/components/features/location/submit/LocationImagesStep.vue';
import LocationInformationStep from '@/components/features/location/submit/LocationInformationStep.vue';
import LocationOpeningsStep from '@/components/features/location/submit/LocationOpeningsStep.vue';
import LocationSettingsStep from '@/components/features/location/submit/LocationSettingsStep.vue';
import { useCreateLocation } from '@/composables/data/useLocations';
import { useToast } from '@/composables/useToast';
import type { SubStep } from '@/types/contract/LocationWizard';
import type { CreateImageRequest } from '@/types/schema/Image';
import type { CreateLocationRequest, CreateOpeningTimeRequest } from '@/types/schema/Location';
import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { mutateAsync: createLocation, isPending: isCreating } = useCreateLocation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Locatie succesvol toegevoegd',
            detail: 'Je locatie is toegevoegd en wacht op goedkeuring.',
        });
        router.push({ name: 'locations' });
    },
});

const form = useLocalStorage<CreateLocationRequest>(
    'location-form-data',
    {
        name: '',
        excerpt: {},
        description: {},
        street: '',
        number: '',
        zip: '',
        city: '',
        country: 'be',
        province: '',
        latitude: 0,
        longitude: 0,
        seatCount: 0,
        reservationBlockSize: 60,
        minReservationLength: null,
        maxReservationLength: null,
        isReservable: true,
    },
    { mergeDefaults: true },
);

const images = ref<CreateImageRequest[]>([]);
const openingTimes = ref<CreateOpeningTimeRequest[]>([]);
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

// Initialize step from URL query parameter or default to 'basics'
const step = ref((route.query.step as string) || 'basics');

// Watch for route changes to sync step
watch(
    () => route.query.step,
    (newStep) => {
        if (typeof newStep === 'string' && steps.some((s) => s.id === newStep)) {
            step.value = newStep;
        }
    },
);

const canGoNext = computed(() => substeps.value.every((substep) => substep.isCompleted));
const canGoPrevious = computed(() => stepIndex.value > 0);
const stepIndex = computed(() => steps.findIndex((curr) => curr.id === step.value));
const progressPercentage = computed(() => Math.round(((stepIndex.value + 1) * 100) / steps.length));
const isLastStep = computed(() => step.value === 'openings');

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

async function submitLocation() {
    if (!canGoNext.value) return;
    await createLocation(form.value);
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
                    :disabled="!canGoNext"
                    :loading="isCreating"
                    size="small">
                    <template v-if="isLastStep">
                        <FontAwesomeIcon :icon="faCheck" class="mr-2" />
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
                v-model="form"
                v-model:substeps="substeps"
                v-if="step === 'basics'">
            </LocationInformationStep>

            <LocationImagesStep
                v-model="images"
                v-model:substeps="substeps"
                v-if="step === 'images'">
            </LocationImagesStep>

            <LocationSettingsStep
                v-model="form"
                v-model:substeps="substeps"
                v-if="step === 'settings'">
            </LocationSettingsStep>

            <LocationOpeningsStep
                :form="form"
                v-model:openings="openingTimes"
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
