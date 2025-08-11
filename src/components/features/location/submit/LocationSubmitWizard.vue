<script setup lang="ts">
import BasicInfoStep from './steps/BasicInfoStep.vue';
import DescriptionStep from './steps/DescriptionStep.vue';
import ImagesStep from './steps/ImagesStep.vue';
import LocationDetailsStep from './steps/LocationDetailsStep.vue';
import OpeningTimesStep from './steps/OpeningTimesStep.vue';
import ReviewStep from './steps/ReviewStep.vue';
import SettingsStep from './steps/SettingsStep.vue';
import { useCreateLocation } from '@/composables/data/useLocations';
import { useMessages } from '@/composables/useMessages';
import type { LocationSubmitStep, LocationSubmitWizardState } from '@/types/schema/LocationRequest';
import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Steps from 'primevue/steps';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const wizardState = defineModel<LocationSubmitWizardState>('wizardState', { required: true });

const router = useRouter();
const messages = useMessages();
const { mutate: createLocation, isPending: isCreating } = useCreateLocation({
    onSuccess: () => {
        messages.showMessage({
            severity: 'success',
            summary: 'Locatie succesvol toegevoegd',
            detail: 'Je locatie is toegevoegd en wacht op goedkeuring.',
        });
        router.push({ name: 'locations' });
    },
    onError: (error) => {
        messages.showMessage({
            severity: 'error',
            summary: 'Fout bij het toevoegen van locatie',
            detail: error.message || 'Er is iets misgegaan. Probeer het opnieuw.',
        });
    },
});

const steps = [
    { id: 'basic-info', label: 'Basis informatie', icon: 'pi pi-info-circle' },
    { id: 'location-details', label: 'Locatie details', icon: 'pi pi-map-marker' },
    { id: 'description', label: 'Beschrijving', icon: 'pi pi-file-edit' },
    { id: 'images', label: 'Afbeeldingen', icon: 'pi pi-image' },
    { id: 'opening-times', label: 'Openingstijden', icon: 'pi pi-clock' },
    { id: 'settings', label: 'Instellingen', icon: 'pi pi-cog' },
    { id: 'review', label: 'Overzicht', icon: 'pi pi-check' },
];

const currentStepIndex = computed(() =>
    steps.findIndex((step) => step.id === wizardState.value.currentStep),
);

const progress = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100);

const canGoNext = computed(() => {
    const step = wizardState.value.currentStep;
    const data = wizardState.value.formData;

    switch (step) {
        case 'basic-info':
            return !!(data.name && data.excerpt?.nl && data.excerpt?.en);
        case 'location-details':
            return !!(
                data.street &&
                data.number &&
                data.zip &&
                data.city &&
                data.latitude &&
                data.longitude
            );
        case 'description':
            return !!(data.description?.nl && data.description?.en);
        case 'images':
            return data.images && data.images.length > 0;
        case 'opening-times':
            return data.openingTimes && data.openingTimes.length > 0;
        case 'settings':
            return data.seatCount !== undefined && data.seatCount > 0;
        case 'review':
            return true;
        default:
            return false;
    }
});

const canGoPrevious = computed(() => currentStepIndex.value > 0);

const isLastStep = computed(() => wizardState.value.currentStep === 'review');

function goToStep(stepId: LocationSubmitStep) {
    wizardState.value.currentStep = stepId;
}

function goNext() {
    if (canGoNext.value && currentStepIndex.value < steps.length - 1) {
        const currentStep = wizardState.value.currentStep;
        if (!wizardState.value.completedSteps.includes(currentStep)) {
            wizardState.value.completedSteps.push(currentStep);
        }

        const nextStep = steps[currentStepIndex.value + 1];
        wizardState.value.currentStep = nextStep.id as LocationSubmitStep;
    }
}

function goPrevious() {
    if (canGoPrevious.value) {
        const previousStep = steps[currentStepIndex.value - 1];
        wizardState.value.currentStep = previousStep.id as LocationSubmitStep;
    }
}

function submitLocation() {
    if (isLastStep.value && canGoNext.value) {
        createLocation(wizardState.value.formData as any);
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Progress Bar -->
        <Card>
            <template #content>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Voortgang</h3>
                        <span class="text-sm text-gray-500">
                            Stap {{ currentStepIndex + 1 }} van {{ steps.length }}
                        </span>
                    </div>
                    <ProgressBar :value="progress" class="h-2" />
                </div>
            </template>
        </Card>

        <!-- Steps Navigation -->
        <Card>
            <template #content>
                <Steps :model="steps" :active-step="currentStepIndex" class="mb-6">
                    <template #item="{ item, index, props }">
                        <button
                            v-bind="props.action"
                            :disabled="
                                index > currentStepIndex &&
                                !wizardState.completedSteps.includes(item.id)
                            "
                            @click="goToStep(item.id)"
                            class="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors"
                            :class="{
                                'bg-primary-50 text-primary-600': index === currentStepIndex,
                                'cursor-not-allowed text-gray-400':
                                    index > currentStepIndex &&
                                    !wizardState.completedSteps.includes(item.id),
                                'text-gray-600 hover:bg-gray-50':
                                    index < currentStepIndex ||
                                    wizardState.completedSteps.includes(item.id),
                            }">
                            <i :class="item.icon" class="text-lg"></i>
                            <span class="text-sm font-medium">{{ item.label }}</span>
                            <FontAwesomeIcon
                                v-if="wizardState.completedSteps.includes(item.id)"
                                :icon="faCheck"
                                class="text-green-500" />
                        </button>
                    </template>
                </Steps>
            </template>
        </Card>

        <!-- Step Content -->
        <Card>
            <template #content>
                <div class="min-h-[400px]">
                    <BasicInfoStep
                        v-if="wizardState.currentStep === 'basic-info'"
                        v-model:form-data="wizardState.formData" />

                    <LocationDetailsStep
                        v-if="wizardState.currentStep === 'location-details'"
                        v-model:form-data="wizardState.formData" />

                    <DescriptionStep
                        v-if="wizardState.currentStep === 'description'"
                        v-model:form-data="wizardState.formData" />

                    <ImagesStep
                        v-if="wizardState.currentStep === 'images'"
                        v-model:form-data="wizardState.formData" />

                    <OpeningTimesStep
                        v-if="wizardState.currentStep === 'opening-times'"
                        v-model:form-data="wizardState.formData" />

                    <SettingsStep
                        v-if="wizardState.currentStep === 'settings'"
                        v-model:form-data="wizardState.formData" />

                    <ReviewStep
                        v-if="wizardState.currentStep === 'review'"
                        :form-data="wizardState.formData" />
                </div>
            </template>
        </Card>

        <!-- Navigation -->
        <Card>
            <template #content>
                <div class="flex items-center justify-between">
                    <Button v-if="canGoPrevious" @click="goPrevious" severity="secondary" outlined>
                        <FontAwesomeIcon :icon="faArrowLeft" class="mr-2" />
                        Vorige
                    </Button>
                    <div v-else></div>

                    <Button v-if="!isLastStep" @click="goNext" :disabled="!canGoNext">
                        Volgende
                        <FontAwesomeIcon :icon="faArrowRight" class="ml-2" />
                    </Button>

                    <Button
                        v-else
                        @click="submitLocation"
                        :loading="isCreating"
                        :disabled="!canGoNext">
                        <FontAwesomeIcon :icon="faCheck" class="mr-2" />
                        Locatie Toevoegen
                    </Button>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
