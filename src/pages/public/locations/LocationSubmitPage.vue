<script setup lang="ts">
import LocationInformationStep from '@/components/features/location/submit/steps/LocationInformationStep.vue';
import { useCreateLocation } from '@/composables/data/useLocations';
import { useMessages } from '@/composables/useMessages';
import type { CreateLocationRequest } from '@/types/schema/Location';
import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

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
});

const steps: { id: string; label: string }[] = [
    { id: 'basic-info', label: 'Informatie' },
    { id: 'images', label: 'Afbeeldingen' },
    { id: 'opening-times', label: 'Openingstijden' },
    { id: 'settings', label: 'Instellingen' },
];

const currentStep = ref<string>('basic-info');

const formData = ref<CreateLocationRequest>({
    name: '',
    excerpt: {},
    description: {},
    street: '',
    number: '',
    zip: '',
    city: '',
    country: 'België',
    province: '',
    latitude: 0,
    longitude: 0,
    seatCount: 0,
    reservationBlockSize: 60,
    minReservationLength: null,
    maxReservationLength: null,
    isReservable: true,
});

const currentStepIndex = computed(() => steps.findIndex((step) => step.id === currentStep.value));
const progress = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100);
const canGoPrevious = computed(() => currentStepIndex.value > 0);
const isLastStep = computed(() => currentStep.value === 'settings');

const canGoNext = computed(() => {
    const data = formData.value;
    switch (currentStep.value) {
        case 'basic-info':
            return !!(
                data.name &&
                data.excerpt?.nl &&
                data.excerpt?.en &&
                data.description?.nl &&
                data.description?.en &&
                data.street &&
                data.number &&
                data.zip &&
                data.city &&
                data.latitude &&
                data.longitude
            );
        case 'settings':
            return data.seatCount !== undefined && data.seatCount > 0;
        default:
            return false;
    }
});

function goNext() {
    if (canGoNext.value && currentStepIndex.value < steps.length - 1) {
        currentStep.value = steps[currentStepIndex.value + 1].id;
    }
}

function goPrevious() {
    if (currentStepIndex.value > 0) {
        currentStep.value = steps[currentStepIndex.value - 1].id;
    }
}
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-6">
        <!-- Header -->
        <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900">
                Nieuwe <span class="text-primary-600">Blokspot</span> toevoegen
            </h1>
        </div>

        <!-- Beautiful Progress Steps -->
        <Card>
            <template #content>
                <div class="px-6 py-6">
                    <!-- Step Indicators -->
                    <div class="flex items-center justify-center space-x-4">
                        <div
                            v-for="(step, index) in steps"
                            :key="step.id"
                            class="flex items-center">
                            <!-- Step Circle -->
                            <div class="relative">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300"
                                    :class="{
                                        'bg-primary-600 scale-110 text-white shadow-lg':
                                            index === currentStepIndex,
                                        'bg-primary-500 text-white': index < currentStepIndex,
                                        'bg-gray-200 text-gray-500': index > currentStepIndex,
                                    }">
                                    <FontAwesomeIcon
                                        v-if="index < currentStepIndex"
                                        :icon="faCheck"
                                        class="text-sm" />
                                    <span v-else>{{ index + 1 }}</span>
                                </div>

                                <!-- Current step pulse ring -->
                                <div
                                    v-if="index === currentStepIndex"
                                    class="bg-primary-400 absolute inset-0 animate-ping rounded-full opacity-20"></div>
                            </div>

                            <!-- Step Label -->
                            <div class="mr-6 ml-3">
                                <div
                                    class="text-sm font-medium transition-colors duration-200"
                                    :class="{
                                        'text-primary-600': index === currentStepIndex,
                                        'text-gray-700': index < currentStepIndex,
                                        'text-gray-400': index > currentStepIndex,
                                    }">
                                    {{ step.label }}
                                </div>
                                <div
                                    v-if="index === currentStepIndex"
                                    class="text-primary-500 text-xs font-medium">
                                    Actief
                                </div>
                                <div
                                    v-else-if="index < currentStepIndex"
                                    class="text-xs text-gray-500">
                                    Voltooid
                                </div>
                            </div>

                            <!-- Connecting Arrow -->
                            <FontAwesomeIcon
                                v-if="index < steps.length - 1"
                                :icon="faArrowRight"
                                class="mr-6 text-sm text-gray-300">
                            </FontAwesomeIcon>
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Step Content -->
        <div class="p-2">
            <LocationInformationStep v-if="currentStep === 'basic-info'" v-model="formData">
            </LocationInformationStep>
        </div>

        <!-- Clean Navigation -->
        <Card>
            <template #content>
                <div class="flex items-center justify-between">
                    <!-- Previous Button -->
                    <Button
                        @click="goPrevious"
                        :disabled="!canGoPrevious"
                        severity="secondary"
                        outlined
                        size="large"
                        class="px-6"
                        :class="{ 'cursor-not-allowed opacity-50': !canGoPrevious }">
                        <FontAwesomeIcon :icon="faArrowLeft" class="mr-2" />
                        Vorige
                    </Button>

                    <!-- Next/Submit Button -->
                    <Button
                        v-if="!isLastStep"
                        @click="goNext"
                        :disabled="!canGoNext"
                        size="large"
                        class="px-6"
                        :class="{ 'cursor-not-allowed opacity-50': !canGoNext }">
                        Volgende
                        <FontAwesomeIcon :icon="faArrowRight" class="ml-2" />
                    </Button>
                    <Button
                        v-else
                        :loading="isCreating"
                        :disabled="!canGoNext"
                        size="large"
                        class="border-green-600 bg-green-600 px-6 hover:border-green-700 hover:bg-green-700"
                        :class="{ 'cursor-not-allowed opacity-50': !canGoNext }">
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
